import { defineStore } from "pinia";
import axios from "axios";
import baseApiUrl from "@/stores/config/axiosConfig";

export const useAccountStore = defineStore("account", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || {},
    staffs: [],
    token: localStorage.getItem("token") || null,
    isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
    response: {
      status: false,
      message: "",
    },
  }),
  actions: {
    async clearResponse() {
      this.response.status = false;
      this.response.message = "";
    },
    async login(userLogin) {
      try {
        if (!userLogin?.username || !userLogin?.password) {
          this.response.message = "กรุณากรอกข้อมูล Username และ Password!";
          this.response.status = false;
          return;
        }
        const res = await axios.post(
          // "http://172.18.1.36:1234/api/employee/login", // ✅ ดึงจาก .env
          `${baseApiUrl}/auth/login`, // ✅ ดึงจาก .env
          userLogin,
          {
            headers: {
              "application-key": import.meta.env.VITE_APPLICATION_KEY,
            },
          }
        );

        // // ตรวจสอบว่ามีข้อมูลสำคัญครบถ้วน
        if (res.data && res.data.status) {
          this.user = res.data.user;
          this.token = res.data.token;
          this.isLoggedIn = true;

          // เก็บข้อมูลใน localStorage
          localStorage.setItem("user", JSON.stringify(this.user));
          localStorage.setItem("token", this.token);
          localStorage.setItem("isLoggedIn", "true");

          this.response.status = true;
          this.response.message = res.data.message;
        } else {
          // กรณี login ไม่สำเร็จ
          this.response.status = false;
          this.response.message = res.data.message || "Login failed";
          this.logout(); // เรียก logout เพื่อเคลียร์ข้อมูลที่อาจมีค้างอยู่
        }
      } catch (error) {
        // จัดการข้อผิดพลาดที่เกิดขึ้น เช่น การเชื่อมต่อผิดพลาด
        console.error("Login error:", error);

        this.response.status = false;
        if (error.status === 400)
          this.response.message = error.response.data.error[0].msg;
        if (error.status === 500)
          this.response.message = error.response.data.message;

        this.logout(); // ออกจากระบบหากมีข้อผิดพลาด
      }
    },

    async checkAuth() {
      try {
        // console.log(this.token);
        if (this.token) {
          const result = await axios.get(`${coreUrl}auth`, {
            headers: {
              Authorization: this.token,
            },
          });
          // console.log(result);
          if (result.data.newToken) {
            localStorage.setItem("token", result.data.newToken);
          }
          if (result.data.status) {
            this.isLoggedIn = true;
            this.user = result.data.user;

            // อัปเดตข้อมูลใน localStorage
            localStorage.setItem("user", JSON.stringify(this.user));
            localStorage.setItem("isLoggedIn", "true");
          } else {
            this.isLoggedIn = false;
            this.user = {};
            this.clearStorage();
          }
        }
      } catch (error) {
        console.log(error.response.data);
        if (!error.response.data.status) {
          this.isLoggedIn = false;
          this.user = {};
          this.clearStorage();
        }
      }
    },
    async logout() {
      this.clearStorage();
      this.isLoggedIn = false;
      this.user = {};
      this.token = null;
    },

    async clearStorage() {
      await localStorage.removeItem("user");
      await localStorage.removeItem("token");
      await localStorage.removeItem("isLoggedIn");
      await localStorage.removeItem("systems");
      await localStorage.removeItem("permissionList");
      await localStorage.removeItem("categories");
    },
  },
});
