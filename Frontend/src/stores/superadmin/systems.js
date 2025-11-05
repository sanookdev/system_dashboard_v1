import { defineStore } from "pinia";
import api from "@/utils/api"; // Axios instance พร้อม interceptor

export const useSystemsStore = defineStore("systems", {
  state: () => ({
    list: JSON.parse(localStorage.getItem("systems")) || [],
    response: {
      status: false,
      statusCode: null,
      message: "",
    },
  }),

  actions: {
    async getSystems() {
      try {
        const response = await api.get("/superadmin/systems/list");

        if (response.data?.status) {
          this.list = response.data.systems || [];
          localStorage.setItem("systems", JSON.stringify(this.list));
          this.response = {
            status: true,
            statusCode: 200,
            message: "โหลดข้อมูลระบบสำเร็จ",
          };
        }
      } catch (error) {
        const errMsg =
          error?.response?.data?.error?.message ||
          "เกิดข้อผิดพลาดในการโหลดระบบ";
        this.response = {
          status: false,
          statusCode: error?.response?.status || 500,
          message: errMsg,
        };
        console.error("getSystems error:", error);
      }
    },

    async createSystem(data) {
      if (!data?.name || !data?.url) {
        return { status: false, message: "กรุณาระบุชื่อและ URL ของระบบ" };
      }

      try {
        const res = await api.post("/superadmin/systems", data);
        await this.getSystems();
        return {
          status: true,
          message: "สร้างระบบสำเร็จ",
          data: res.data,
        };
      } catch (error) {
        const msg =
          error?.response?.data?.error?.message ||
          error?.response?.data?.error[0]?.msg ||
          "ไม่สามารถสร้างระบบได้";
        console.error("createSystem error:", error);
        console.log(error.response.data.error[0]);
        return { status: false, message: msg };
      }
    },

    async updateSystem(id, data) {
      try {
        const res = await api.put(`/superadmin/systems/${id}`, data);
        await this.getSystems();
        return {
          status: true,
          message: "อัพเดตระบบสำเร็จ",
          data: res.data,
        };
      } catch (error) {
        const msg =
          error?.response?.data?.error?.message || "อัพเดตระบบล้มเหลว";
        console.error("updateSystem error:", error);
        return { status: false, message: msg };
      }
    },

    async deleteSystem(id) {
      try {
        const res = await api.delete(`/superadmin/systems/${id}`);
        await this.getSystems();
        return {
          status: true,
          message: "ลบระบบสำเร็จ",
          data: res.data,
        };
      } catch (error) {
        const msg = error?.response?.data?.error?.message || "ลบระบบล้มเหลว";
        console.error("deleteSystem error:", error);
        return { status: false, message: msg };
      }
    },

    async clearSystems() {
      this.list = [];
      localStorage.removeItem("systems");
    },
  },
});
