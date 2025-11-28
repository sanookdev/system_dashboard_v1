require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  'http://172.17.1.250:5173',
  "https://med.tu.ac.th",
  "https://med.tu.ac.th/intra_dashboard",
  "http://203.131.209.137/main/income_display",
  "http://203.131.209.137",
  "https://student.med.tu.ac.th",
  "https://student.med.tu.ac.th/serviceTechno",
];

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
