import { defineStore } from "pinia";
import api from "@/utils/api"; // Axios instance พร้อม interceptor
import { useAccountStore } from "../account";

export const useCategoriesStore = defineStore("categories", {
  state: () => ({
    list: JSON.parse(localStorage.getItem("categories")) || [],
    response: {
      status: false,
      statusCode: null,
      message: "",
    },
  }),

  actions: {
    async getCategories() {
      try {
        const accountStore = useAccountStore();
        const response = accountStore.user.role === 'superadmin' ? await api.get("/superadmin/category/list") : '';

        if (response.data?.status) {
          this.list = response.data.categories || [];
          localStorage.setItem("categories", JSON.stringify(this.list));
          this.response = {
            status: true,
            statusCode: 200,
            message: "โหลดข้อมูลสำเร็จ",
          };
        }
      } catch (error) {
        const errMsg =
          error?.response?.data?.error?.message || "เกิดข้อผิดพลาด";
        this.response = {
          status: false,
          statusCode: error?.response?.status || 500,
          message: errMsg,
        };
        console.error("getCategories error:", error);
      }
    },

    async createCategory(data) {
      if (!data?.name) {
        return { status: false, message: "กรุณาระบุชื่อหมวดหมู่" };
      }

      try {
        const res = await api.post("/superadmin/category", data);
        await this.getCategories();
        return {
          status: true,
          message: "สร้างหมวดหมู่สำเร็จ",
          data: res.data,
        };
      } catch (error) {
        const msg =
          error?.response?.data?.error?.message || "ไม่สามารถสร้างหมวดหมู่ได้";
        console.error("createCategory error:", error);
        return { status: false, message: msg };
      }
    },

    async updateCategory(id, data) {
      try {
        const res = await api.put(`/superadmin/category/${id}`, data);
        await this.getCategories();
        return {
          status: true,
          message: "อัพเดตสำเร็จ",
          data: res.data,
        };
      } catch (error) {
        const msg = error?.response?.data?.error?.message || "อัพเดตล้มเหลว";
        console.error("updateCategory error:", error);
        return { status: false, message: msg };
      }
    },

    async deleteCategory(id) {
      try {
        const res = await api.delete(`/superadmin/category/${id}`);
        await this.getCategories();
        return {
          status: true,
          message: "ลบหมวดหมู่สำเร็จ",
          data: res.data,
        };
      } catch (error) {
        const msg = error?.response?.data?.error?.message || "ลบล้มเหลว";
        console.error("deleteCategory error:", error);
        return { status: false, message: msg };
      }
    },

    async clearCategories() {
      this.list = [];
      localStorage.removeItem("categories");
    },
  },
});
