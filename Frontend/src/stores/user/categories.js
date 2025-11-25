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
        const response = accountStore.user.role === 'user' ? await api.get("/user/category/list") : '';
        console.log(response)
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

    async clearCategories() {
      this.list = [];
      localStorage.removeItem("categories");
    },
  },
});
