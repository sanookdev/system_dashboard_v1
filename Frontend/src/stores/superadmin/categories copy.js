import { defineStore } from "pinia";
import axios from "axios";
import baseApiUrl from "../config/axiosConfig";
import api from "@/utils/api";
import { useEventStore } from "../event";

export const useCategoriesStore = defineStore("categories", {
  state: () => ({
    list: JSON.parse(localStorage.getItem("categories")) || [],
    response: {
      status: false,
      statusCode: false,
      message: "",
    },
  }),
  actions: {
    async createCategory(data, token) {
      try {
        if (!data?.name) {
          return {
            status: false,
            message: "กรุณาระบบชื่อหมวดหมู่",
          };
        }
        const res = await axios.post(`${baseApiUrl}superadmin/category`, data, {
          headers: {
            "Application-Key": import.meta.env.VITE_APPLICATION_KEY,
            Authorization: token,
          },
        });
        await this.getCategories(token); // รีโหลดรายการ
        return res.data;
      } catch (error) {
        this.response = { status: false, message: "ไม่สามารถสร้างหมวดหมู่ได้" };
        console.error(error);
      }
    },
    async updateCategory(id, data, token) {
      try {
        const response = await axios.put(
          `${baseApiUrl}/superadmin/category/${id}`,
          data,
          {
            headers: {
              "Application-Key": import.meta.env.VITE_APPLICATION_KEY,
              Authorization: `Bearer ${token}`,
            },
          }
        );
        await this.getCategories(token);
        return response.data;
      } catch (error) {
        console.error(error);
        return { status: false, message: "อัพเดตล้มเหลว" };
      }
    },

    async deleteCategory(id, token) {
      try {
        const response = await axios.delete(
          `${baseApiUrl}/superadmin/category/${id}`,
          {
            headers: {
              "Application-Key": import.meta.env.VITE_APPLICATION_KEY,
              Authorization: `Bearer ${token}`,
            },
          }
        );
        await this.getCategories(token);
        return response.data;
      } catch (error) {
        this.response = { status: false, message: "ลบล้มเหลว" };
        console.error(error);
      }
    },
    async getCategories(token) {
      const eventStore = useEventStore();
      try {
        const response = await axios.get(
          `${baseApiUrl}superadmin/category/list`, // ✅ ดึงจาก .env
          {
            headers: {
              "application-key": import.meta.env.VITE_APPLICATION_KEY,
              Authorization: token,
            },
          }
        );
        // console.log(response);
        if (response.data?.error) {
          console.error(response.data.error);
        }
        if (response.data?.status) {
          this.list = response.data?.categories || [];
          localStorage.setItem("categories", JSON.stringify(this.list));
        }
      } catch (error) {
        // จัดการข้อผิดพลาดที่เกิดขึ้น เช่น การเชื่อมต่อผิดพลาด
        console.error("Login error:", error);

        if (error.status === 403) {
          this.response.statusCode = 403;
          this.response.message =
            error?.response?.data?.error?.message || "Session expired";
        }

        this.response.status = false;
        if (error.status === 400)
          this.response.message = error.response.data.error[0].msg;
        if (error.status === 500)
          this.response.message = error.response.data.message;
      }
    },
    async clearCategories() {
      this.list = [];
      localStorage.removeItem("categories");
    },
  },
});
