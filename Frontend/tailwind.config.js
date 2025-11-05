// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["corporate"],
    // หรือใช้แบบกำหนด default ได้ตรงๆ
    // themes: ["corporate"],
  },
};
