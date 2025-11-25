require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(
  cors({
    // origin: [
    //   "http://localhost:5173",
    //   'http://172.17.1.250:5173',
    //   "https://med.tu.ac.th",
    //   "https://med.tu.ac.th/intra_dashboard",
    //   "https://med.tu.ac.th/intra_dashboard_dev_v1",
    // ], // frontend
    orifin: "*",
    credentials: true, // ถ้ามี cookie/token
  })
);

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

// SPA fallback
app.get(`${baseServerPath}/*`, (req, res) => {
  if (isProdection) {
    return res.sendFile(path.join(distPath, "index.html"));
  }
  res.end(`<h1>Backend server is started.</h1>`);
});

app.get(`${baseServerPath}/health`, (req, res) => {
  res.status(200).json('Hello');
});


// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(
    `✅ Server running at http://localhost:${port}${baseServerPath}   -- PRODUCTION MODE : ${isProdection} `
  );
});
