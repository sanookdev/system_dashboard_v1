const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const userSystemController = require("../controllers/user/systems.controller")
const adminSystem = ["admin", "superadmin", "system"];
const cache = require("../utils/cache.js");
const crypto = require("crypto")

const {
  verifyToken,
  isInRole,
  setUser,
  verifyApplicationKey,
  refreshToken,
  passwordHashForAuthen,
  decodeToken,
} = require("../middleware/security.js");
const { check, validationResult } = require("express-validator");
const security = require("../middleware/security.js");

/* ---------- Helper: รูปแบบการตอบให้สม่ำเสมอ ---------- */
function badRequest(res, message = "Invalid request", extra = {}) {
  return res.status(400).json({ status: false, message, ...extra });
}
function unauthorized(res, message = "Unauthorized") {
  return res.status(401).json({ status: false, message });
}
function forbidden(res, message = "Forbidden") {
  return res.status(403).json({ status: false, message });
}
function serverError(res, error) {
  return res.status(500).json({
    status: false,
    message: "Server error",
    error: error?.message || String(error),
  });
}

router.post(
  "/login",
  verifyApplicationKey,
  [
    check("username").notEmpty().withMessage("Username is required!"),
    check("password").notEmpty().withMessage("Password is required!"),
  ],
  async (req, res) => {
    const checkErr = validationResult(req);
    if (!checkErr.isEmpty()) {
      return res.status(400).json({ status: false, error: checkErr.errors });
    }
    try {
      if (!req.body) {
        return res
          .status(400)
          .json({ message: "ไม่พบข้อมูลใน body ของ request" });
      }
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "กรุณาระบุ username และ password" });
      }

      const result = adminSystem.includes(username)
        ? await authController.adminLogin(username, password)
        : await authController.userLogin(
          username,
          passwordHashForAuthen(password)
        );

      return res.status(200).json(result);
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
        error: error.message,
      });
    }
  }
);
/* ---------- POST /auth/introspect ----------
   ใช้ตรวจสิทธิ์เบื้องต้นจาก Dashboard: เช็ค isAdmin/roles ของผู้ใช้สำหรับ system_id
   หมายเหตุ: ต้องแนบ Authorization: Bearer <access_token> มาด้วย
------------------------------------------------ */

router.get(
  "/authenticate",
  verifyApplicationKey,
  verifyToken,
  refreshToken,
  async (req, res) => {
    try {
      let user = await decodeToken(req.headers["authorization"]);
      let authorize = await authController.authorizeSystem(user.username);
      res.json({
        status: true,
        message: "Token is valid!",
        user: {
          ...user,
          permission: authorize,
        },
        refreshToken: req.refreshedToken,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Failed to authenticate user",
        error: error.message,
      });
    }
  }
); router.get(
  "/authenticate/sso",
  verifyApplicationKey,
  verifyToken,
  refreshToken,
  async (req, res) => {
    try {
      let user = await decodeToken(req.headers["authorization"]);
      let authorize = await authController.authorizeSystem(user.username);
      res.json({
        status: true,
        message: "Token is valid!",
        user: {
          ...user
        },
        refreshToken: req.refreshedToken,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Failed to authenticate user",
        error: error.message,
      });
    }
  }
);

router.get(
  "/authorise",
  verifyApplicationKey,
  verifyToken,
  async (req, res) => {
    try {
      let user = await decodeToken(req.headers["authorization"]);
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Failed to authorise.",
        error: error.message,
      });
    }
  }
);

router.get("/callback", async (req, res) => {
  try {
    const { code, state } = req.query || {};
    if (!code || !state) return res.status(400).send("missing code or state");
    // TODO: validate state ถ้าคุณ generate ตอนก่อนออกจาก dashboard/FE

    return res.status(200).json({ code: code, state: state })

    const r = await axios.post(
      "https://dashboard.example.com/auth/introspect",
      { code, system_id: 7 },
      { headers: { "Application-Key": process.env.APP_KEY } }
    );

    if (!r.data?.status) return res.status(401).send("Unauthorized");

    // สร้าง session ภายใน System A
    const sessionId = await createSessionFor(r.data.user, {
      isAdmin: r.data.isAdmin,
      roles: r.data.roles,
      perms: r.data.perms,
      exp: r.data.exp
    });

    res.cookie("sa_session", sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "None", // ถ้าข้ามโดเมนย่อย
      path: "/",
      maxAge: 60 * 60 * 1000
    });

    return res.redirect("/");
  } catch (err) {
    return res.status(500).send("callback error");
  }
})

// 1) set
router.post("/debug/set", async (req, res) => {
  const { code } = req.body;
  const cacheKey = `code:${code}`;

  cache.set(cacheKey, { hello: "world" }, 60);

  console.log("SET", cacheKey);
  return res.json({ status: true, cacheKey });
});

// 2) get
router.post("/debug/get", async (req, res) => {
  const { code } = req.body;
  const cacheKey = `code:${code}`;

  const data = cache.get(cacheKey);

  console.log("GET", cacheKey, data);
  if (!data) return res.json({ status: false, message: "Cannot decrypt code." })
  return res.json({ status: true, cacheKey, data });
});
router.post("/sso/start", verifyApplicationKey, verifyToken, async (req, res) => {
  try {
    const { system_id, redirect_uri } = req.body || {}
    if (!system_id || !redirect_uri) return res.status(401).json({ status: false, message: "system_id and redirect_uri was required!" })
    const code = crypto.randomUUID();
    const state = crypto.randomUUID();
    await cache.set(`code:${code}`, {
      user: { id: req.user.sub, username: req.user.username },
      system_id,
      exp: Date.now() + 60_000, // 60s
      state
    }, 60);
    const url = new URL(redirect_uri);
    url.searchParams.set("code", code);
    url.searchParams.set("state", state);
    return res.status(200).json({ status: true, redirect: url.toString(), query: `?code=${code}&state=${state}` });
  } catch (error) {
    return res.status(500).json({ status: false, message: "เกิดข้อผิดพลาด /sso/start", error: error.message })
  }

});
router.post("/sso_other/start", verifyApplicationKey, verifyToken, async (req, res) => {
  try {
    const { system_id, redirect_uri } = req.body || {}
    if (!system_id || !redirect_uri) return res.status(401).json({ status: false, message: "system_id and redirect_uri was required!" })
    const code = crypto.randomUUID();
    const state = crypto.randomUUID();
    console.log(req.user.sub)
    await cache.set(`code:${code}`, {
      user: { id: req.user.sub, username: req.user.username },
      system_id,
      exp: Date.now() + 60_000, // 60s
      state
    }, 60);
    const url = new URL(redirect_uri);
    url.searchParams.set("code", code);
    url.searchParams.set("state", state);
    url.searchParams.set("system_id", system_id);
    return res.status(200).json({ status: true, redirect: url.toString(), query: `?code=${code}&state=${state}&system_id=${system_id}` });
  } catch (error) {
    return res.status(500).json({ status: false, message: "เกิดข้อผิดพลาด /sso/start", error: error.message })
  }

}); router.post("/sso_v1/start", verifyApplicationKey, async (req, res) => {
  try {
    const { system_id, redirect_uri } = req.body || {}
    if (!system_id || !redirect_uri) return res.status(401).json({ status: false, message: "system_id and redirect_uri was required!" })
    const code = crypto.randomUUID();
    const state = crypto.randomUUID();
    await cache.set(`code:${code}`, {
      user: { username: 'ASU0020' },
      system_id,
      exp: Date.now() + 60_000, // 60s
      state
    }, 60);
    const url = new URL(redirect_uri);
    url.searchParams.set("code", code);
    url.searchParams.set("state", state);
    url.searchParams.set("system_id", system_id);
    return res.status(200).json({ status: true, redirect: url.toString(), query: `?code=${code}&state=${state}&system_id=${system_id}` });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Error: /sso_v1/start", error: error.message })
  }

});
router.get(
  "/introspect_other",
  verifyApplicationKey,
  [
    check("code").notEmpty().withMessage("code is required"),
    check("state").notEmpty().withMessage("state is required"),
    check("system_id").notEmpty().withMessage("system_id is required"),

  ],
  async (req, res) => {
    const checkErr = validationResult(req);
    if (!checkErr.isEmpty()) {
      return badRequest(res, "Validation error", { error: checkErr.errors });
    }

    try {
      if (!req.body) {
        return badRequest(res, "Missing body");
      }
      const { code, state, system_id } = req.query || {}

      console.log('code = ' + code)
      console.log('state = ' + state)

      // 1) ดึงข้อมูลจาก cache ด้วย code
      const cacheKey = `code:${code}`;
      const data = await cache.get(cacheKey);

      if (!data) {
        return unauthorized(res, "invalid or expired code");
      }

      // 2) ตรวจ state ให้ตรงกัน
      if (data.state !== state) {
        // กันกรณีโดนดัก code แล้วเอาไปยิงเอง
        await cache.del(cacheKey); // ลบทิ้งอยู่ดี กัน reuse
        return unauthorized(res, "invalid state");
      }
      // 3) ตรวจหมดอายุ
      if (data.exp && data.exp < Date.now()) {
        await cache.del(cacheKey);
        return unauthorized(res, "code expired");
      }

      // 4) ตรวจว่า code นี้ออกให้ system นี้จริงไหม
      if (String(data.system_id) !== String(system_id)) {
        return forbidden(res, "code is not issued for this system");
      }

      // 5) ลบ code ออกจาก cache ให้เป็น one-time
      await cache.del(cacheKey);

      const user = data.user; // มาจาก verifyToken แล้ว เช่น { sub, username, isAdmin, roles, exp, ... }

      if (!user) {
        return unauthorized(res, "invalid or missing token");
      }

      // ตรวจสิทธิ์ในระบบย่อยจากศูนย์กลาง
      const verify = await authController.verifySystem(user.username, system_id);

      // สมมติ verify คืน { status:boolean, roles?:[], perms?:[], isAdmin?:boolean, message?:string }
      if (!verify?.status) {
        return forbidden(res, verify?.message || "No permission for this system");
      }

      return res.status(200).json({
        status: true,
        user: {
          id: user.sub,
          username: user.username,
          isAdmin: !!verify.isAdmin, // หรือจะ fallback เป็น !!user.isAdmin ก็ได้หากมีใน token
        },
        system_id,
        roles: verify.roles || [],
        perms: verify.perms || [],
        // ส่ง exp ของ token ปัจจุบันกลับไปเผื่อระบบย่อย cache ตามอายุ token
        exp: user.exp,
      });
    } catch (error) {
      return serverError(res, error);
    }
  }
);

router.post(
  "/introspect",
  verifyApplicationKey,
  verifyToken, // => ใส่ payload ลง req.user แล้ว
  [
    check("code").notEmpty().withMessage("code is required"),
    check("state").notEmpty().withMessage("state is required"),
    check("system_id").notEmpty().withMessage("system_id is required"),
    // ถ้าต้องการให้เป็นตัวเลข strict: .isInt().withMessage("system_id must be an integer")
  ],
  async (req, res) => {
    const checkErr = validationResult(req);
    if (!checkErr.isEmpty()) {
      return badRequest(res, "Validation error", { error: checkErr.errors });
    }

    try {
      if (!req.body) {
        return badRequest(res, "Missing body");
      }
      const { system_id } = req.body || {};
      const { code, state } = req.query || {}

      console.log('code = ' + code)
      console.log('state = ' + state)

      // 1) ดึงข้อมูลจาก cache ด้วย code
      const cacheKey = `code:${code}`;
      const data = await cache.get(cacheKey);

      if (!data) {
        return unauthorized(res, "invalid or expired code");
      }

      // 2) ตรวจ state ให้ตรงกัน
      if (data.state !== state) {
        // กันกรณีโดนดัก code แล้วเอาไปยิงเอง
        await cache.del(cacheKey); // ลบทิ้งอยู่ดี กัน reuse
        return unauthorized(res, "invalid state");
      }
      // 3) ตรวจหมดอายุ
      if (data.exp && data.exp < Date.now()) {
        await cache.del(cacheKey);
        return unauthorized(res, "code expired");
      }

      // 4) ตรวจว่า code นี้ออกให้ system นี้จริงไหม
      if (String(data.system_id) !== String(system_id)) {
        return forbidden(res, "code is not issued for this system");
      }

      // 5) ลบ code ออกจาก cache ให้เป็น one-time
      await cache.del(cacheKey);

      const user = data.user; // มาจาก verifyToken แล้ว เช่น { sub, username, isAdmin, roles, exp, ... }

      if (!user) {
        return unauthorized(res, "invalid or missing token");
      }

      // ตรวจสิทธิ์ในระบบย่อยจากศูนย์กลาง
      const verify = await authController.verifySystem(user.username, system_id);

      // สมมติ verify คืน { status:boolean, roles?:[], perms?:[], isAdmin?:boolean, message?:string }
      if (!verify?.status) {
        return forbidden(res, verify?.message || "No permission for this system");
      }

      return res.status(200).json({
        status: true,
        user: {
          id: user.sub,
          username: user.username,
          isAdmin: !!verify.isAdmin, // หรือจะ fallback เป็น !!user.isAdmin ก็ได้หากมีใน token
        },
        system_id,
        roles: verify.roles || [],
        perms: verify.perms || [],
        // ส่ง exp ของ token ปัจจุบันกลับไปเผื่อระบบย่อย cache ตามอายุ token
        exp: user.exp,
      });
    } catch (error) {
      return serverError(res, error);
    }
  }
);

router.get("/genkey", async (req, res) => {
  try {
    const appkey = await security.encryptKey();
    return res.status(200).json({
      status: true,
      appkey: appkey,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

module.exports = router;
