import { defineStore } from "pinia";
import api from "@/utils/api";

export const useExternalDepartmentsStore = defineStore("externalDepartments", {
  state: () => ({
    list: [],
    response: {
      status: false,
      statusCode: null,
      message: "",
    },
  }),

  actions: {
    async getDepartments() {
      try {
        const response = await api.get("/superadmin/external_departments");
        if (response.data?.status) {
          this.list = response.data.data || [];
          this.response = { status: true, statusCode: 200, message: "โหลดข้อมูลสำเร็จ" };
        }
      } catch (error) {
        const errMsg = error?.response?.data?.message || "เกิดข้อผิดพลาด";
        this.response = { status: false, statusCode: error?.response?.status || 500, message: errMsg };
        console.error("getDepartments error:", error);
      }
    },

    async createDepartment(data) {
      try {
        const res = await api.post("/superadmin/external_departments", data);
        await this.getDepartments();
        return { status: true, message: res.data.message || "สร้างหน่วยงานสำเร็จ" };
      } catch (error) {
        return { status: false, message: error?.response?.data?.message || "ไม่สามารถสร้างหน่วยงานได้" };
      }
    },

    async updateDepartment(id, data) {
      try {
        const res = await api.put(`/superadmin/external_departments/${id}`, data);
        await this.getDepartments();
        return { status: true, message: res.data.message || "อัพเดตสำเร็จ" };
      } catch (error) {
        return { status: false, message: error?.response?.data?.message || "อัพเดตล้มเหลว" };
      }
    },

    async deleteDepartment(id) {
      try {
        const res = await api.delete(`/superadmin/external_departments/${id}`);
        await this.getDepartments();
        return { status: true, message: res.data.message || "ลบหน่วยงานสำเร็จ" };
      } catch (error) {
        return { status: false, message: error?.response?.data?.message || "ลบล้มเหลว" };
      }
    },
  },
});
