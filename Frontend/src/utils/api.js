import axios from "axios";
import { useAccountStore } from "@/stores/account";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_DEVELOPMENT,
});

// Axios Interceptor เพื่อ refresh token ทุกครั้งก่อนส่ง request
api.interceptors.request.use(
  async (config) => {
    const accountStore = useAccountStore();

    // แนบ token และ app key ทุกครั้ง
    if (accountStore.token) {
      config.headers["Authorization"] = `Bearer ${accountStore.token}`;
      // config.headers["Authorization"] = `Bearer ${accountStore.token}`;
      config.headers["Application-Key"] = import.meta.env.VITE_APPLICATION_KEY;
    }

    try {
      // เรียก API สำหรับ refresh token
      const res = await axios.get(
        `${import.meta.env.VITE_API_DEVELOPMENT}auth/authenticate`,
        {
          headers: {
            Authorization: `Bearer ${accountStore.token}`,
            "Application-Key": import.meta.env.VITE_APPLICATION_KEY,
          },
        }
      );
      if (res.data?.refreshToken) {
        console.log("✅ REFRESHED TOKEN:", res.data.refreshToken);
        accountStore.token = res.data.refreshToken;
        localStorage.setItem("token", res.data.refreshToken);
        config.headers["Authorization"] = `Bearer ${res.data.refreshToken}`;
      }
    } catch (error) {
      console.warn("❌ Token refresh failed", error?.response?.data || error);

      // ถ้า refresh token fail แสดง alert และ logout
      const router = await import("@/router");
      const { default: alertify } = await import("alertifyjs");

      alertify
        .alert("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง", function () {
          accountStore.logout();
          router.default.push({ name: "login" });
        })
        .set({ title: "Session Timeout" });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default api;
