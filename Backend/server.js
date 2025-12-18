require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  'http://172.17.1.250:5173',
  "https://med.tu.ac.th",
  "http://203.131.209.137",
  "https://student.med.tu.ac.th",
];

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        // 1. กฎพื้นฐาน: เชื่อถือเฉพาะโดเมนตัวเอง
        "default-src": ["'self'"],

        // 2. สำหรับ Google Fonts
        "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        "font-src": ["'self'", "https://fonts.gstatic.com"],

        // 3. สำหรับ Google Calendar (Iframe)
        "frame-src": ["'self'", "https://calendar.google.com", "https://www.google.com"],

        // 4. สำหรับ Lucide Icons และรูปภาพ
        // data: จำเป็นสำหรับ Lucide ที่บางครั้งแปลงเป็น Data URI
        "img-src": ["'self'", "data:", "https://*.googleusercontent.com", "https://*.gstatic.com"],

        // 5. สำหรับการเชื่อมต่อ API (ต้องครอบคลุมโดเมนใน allowedOrigins ของคุณ)
        "connect-src": [
          "'self'",
          "https://med.tu.ac.th",
          "https://student.med.tu.ac.th",
          "http://203.131.209.137",
          "http://localhost:5173",
          "http://172.17.1.250:5173"
        ],

        // 6. สำหรับ Vue.js 3
        // 'unsafe-eval' อาจจำเป็นในบางกรณีถ้าคุณใช้ Vue template compiler ใน browser (แต่ถ้า build แล้วมักไม่ต้องใช้)
        "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],

        "object-src": ["'none'"],
        "upgrade-insecure-requests": [],
      },
    },
    // ปิด x-powered-by (คุณมี app.disable("x-powered-by") แล้ว แต่ helmet ก็ช่วยปิดให้ด้วย)
    xPoweredBy: false,
  })
);

app.use(cors({
  origin(origin, cb) {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "application-key"],
  credentials: true,
}));

app.disable("x-powered-by");
const port = process.env.PORT || 3000;
const isProdection = process.env.ENVMODE == "PRODUCTION";

const baseServerPath = process.env.BASE_SERVER_PATH;

const distPath = path.resolve(__dirname, "www");

// Serve static files
if (isProdection) {
  app.use(baseServerPath, express.static(distPath));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`${baseServerPath}/api`, require("./routes"));

app.get(`${baseServerPath}/health`, (req, res) => {
  res.status(200).json({ status: 'oks' });
});

// SPA fallback
app.get(`${baseServerPath}/*`, (req, res) => {
  if (isProdection) {
    return res.sendFile(path.join(distPath, "index.html"));
  }
  res.end(`<h1>Backend server is started.</h1>`);
});




// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(
    `✅ Server running at http://localhost:${port}${baseServerPath}   -- PRODUCTION MODE : ${isProdection} `
  );
});
