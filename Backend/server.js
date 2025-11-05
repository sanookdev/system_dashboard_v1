require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://med.tu.ac.th",
      "https://med.tu.ac.th/intra_dashboard",
      "https://med.tu.ac.th/intra_dashboard_dev_v1",
    ], // frontend
    credentials: true, // ถ้ามี cookie/token
  })
);

app.disable("x-powered-by");
const port = process.env.PORT || 3000;
const isProdection = process.env.ENVMODE == "PRODUCTION";

const distPath = path.resolve(__dirname, "www");

// Serve static files
if (isProdection) {
  app.use("/intra_dashboard", express.static(distPath));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", require("./routes"));

// SPA fallback
app.get("/intra_dashboard/*", (req, res) => {
  if (isProdection) {
    res.sendFile(path.join(distPath, "index.html"));
  }
  res.end(`<h1>Backend server is started.</h1>`);
});

// Start server
app.listen(port, () => {
  console.log(
    `✅ Server running at http://localhost:${port}/intra_dashboard   -- PRODUCTION MODE : ${isProdection} `
  );
});
