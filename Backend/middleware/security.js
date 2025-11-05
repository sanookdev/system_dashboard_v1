const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwt_access_key = process.env.ACCESS_TOKEN_KEY;
const application_key = process.env.APPLICATION_KEY;
const { StaffWelfarePermission } = require("../models");
const md5 = require("md5");
const CryptoJS = require("crypto-js");

const security = {
  verifyToken(req, res, next) {
    let token = req.headers["authorization"]; // Get token on headers authorization

    if (!token) {
      const error = {
        error: {
          message: "Not authenticated.",
        },
        status: 401,
      };
      return res.json(error);
    }

    token = token.replace("Bearer ", ""); //  Remove string word "Bearer " from token

    // Verify token is valid or not
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, jwt_access_key);
      req.user = decodedToken;
      console.log('decodedToken', req.user)
    } catch (error) {
      let errors = {
        status: false,
        error: error,
      };
      return res.status(403).json(errors);
    }
    next();
  },
  refreshToken(req, res, next) {
    try {
      const user = req.user;

      if (!user?.username) {
        return res
          .status(401)
          .json({ status: false, message: "Unauthorized: no user data" });
      }

      console.log('test', req.user)

      const newToken = jwt.sign(
        { username: user.username, fname: user.fname, lname: user.lname, role: user.role },
        jwt_access_key,
        { expiresIn: "1h" }
      );

      req.refreshedToken = newToken;
      next();
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Error refreshing token",
        error: error.message,
      });
    }
  },
  decodeToken(token) {
    return new Promise((resolve, reject) => {
      if (!token) {
        const error = {
          error: {
            message: "Not authenticated.",
          },
          status: 401,
        };
        return res.json(error);
      }

      token = token.replace("Bearer ", ""); //  Remove string word "Bearer " from token
      let decodedToken;
      try {
        decodedToken = jwt.verify(token, jwt_access_key);
      } catch (error) {
        let errors = {
          status: "false",
          error: error,
        };
        return resolve(errors);
      }

      resolve(decodedToken);
    });
  },
  setUser(req, res, next) {
    let token = req.headers["authorization"]; // Get token on headers authorization

    // Check token not empty
    if (!token) {
      const error = {
        error: {
          message: "Not authenticated.",
        },
        status: 401,
      };
      return res.json(error);
    }

    token = token.replace("Bearer ", ""); //  Remove string word "Bearer " from token

    // Verify token is valid or not
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, jwt_access_key);
      req.user = decodedToken;
      next();
    } catch (error) {
      let errors = {
        status: "false",
        error: error,
      };
      return res.json(errors);
    }
  },

  verifyApplicationKey(req, res, next) {
    try {
      let secret = req.headers["application-key"];
      if (!secret) {
        return res.status(401).json({
          status: false,
          message: "Application-Key :{Access Token} is required.",
        });
      }
      const decryptSecret = security.decryptKey(secret);
      // Compare the provided secret with the stored SECRET_KEY
      if (process.env.SECRET_KEY !== decryptSecret) {
        return res
          .status(401)
          .json({ status: false, message: "Invalid secret key." });
      }
      next();
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Error application-key",
        error: error.message,
      });
    }
  },

  async encryptKey() {
    let newKey = await CryptoJS.AES.encrypt(
      process.env.SECRET_KEY,
      process.env.APPLICATION_KEY
    ).toString();
    let decrypt = await security.decryptKey(newKey);
    const data = {
      checkCompare: process.env.SECRET_KEY === decrypt,
      oldKey: decrypt,
      newKey: newKey,
      secret_key: process.env.SECRET_KEY,
    };
    return data;
  },
  decryptKey(encryptSecret) {
    let bytesDecrypt = CryptoJS.AES.decrypt(
      encryptSecret,
      process.env.APPLICATION_KEY
    );
    let originalText = bytesDecrypt.toString(CryptoJS.enc.Utf8);
    return originalText;
  },
  passwordHashForAuthen(password) {
    //User for return password from req.body.passowrd, Because the old system from authen server use m5(m5(password)).
    try {
      return {
        status: true,
        password: md5(md5(password)),
      };
    } catch (error) {
      return {
        status: false,
        error: error.message,
      };
    }
  },

  isInRole:
    (roles = []) =>
      (req, res, next) => {
        let token = req.headers["authorization"]; // Get token on headers authorization

        // Check token not empty
        if (!token) {
          const error = {
            error: {
              message: "Not authenticated.",
            },
            status: 401,
          };
          return res.json(error);
        }

        token = token.replace("Bearer ", ""); //  Remove string word "Bearer " from token

        // Verify token is valid or not
        let decodedToken;
        try {
          decodedToken = jwt.verify(token, jwt_access_key);
        } catch (error) {
          let errors = {
            status: "false",
            error: error,
          };
          return res.json(errors);
        }

        let user_role = decodedToken.role;
        const authorized = roles.includes(user_role);

        if (!authorized) {
          const error = {
            error: {
              message: "You don't have permission.",
            },
            role: user_role,
            status: 403,
          };
          return res.json(error);
        }
        next();
      },
};

module.exports = security;
