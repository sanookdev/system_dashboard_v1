import "@/style.css";
import "@/assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import alertify from "alertifyjs";
import "alertifyjs/build/css/themes/default.min.css"; // หรือ bootstrap.min.css ก็ได้

// Lucide Icons
import * as lucide from "lucide-vue-next";

import "alertifyjs/build/css/alertify.min.css";
import VueApexCharts from "vue3-apexcharts";

const app = createApp(App);
for (const [key, component] of Object.entries(lucide)) {
  app.component(key, component);
}

app.config.globalProperties.$alertify = alertify;


router.beforeEach((to, from, next) => {
  const defaultTitle = "ชื่อเว็บไซต์ของคุณ";
  document.title = "Intranet : " + to.meta.title || defaultTitle;
  next();
});

app.use(createPinia());
app.use(router);
app.use(VueApexCharts);

app.mount("#app");
