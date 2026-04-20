import { defineStore } from "pinia";
import api from "@/utils/api";

export const useExternalUsersStore = defineStore("externalUsers", {
  state: () => ({
    list: [],
    response: {
      status: false,
      statusCode: null,
      message: "",
    },
  }),

  actions: {
    async getExternalUsers() {
      try {
        const response = await api.get("/superadmin/external_users");

        if (response.data?.status) {
          this.list = response.data.data || [];
          this.response = {
            status: true,
            statusCode: 200,
            message: "โหลดข้อมูลสำเร็จ",
          };
        }
      } catch (error) {
        const errMsg = error?.response?.data?.message || "เกิดข้อผิดพลาด";
        this.response = {
          status: false,
          statusCode: error?.response?.status || 500,
          message: errMsg,
        };
        console.error("getExternalUsers error:", error);
      }
    },

    async createExternalUser(data) {
      if (!data?.username || !data?.password) {
        return { status: false, message: "กรุณาระบุ Username และ Password" };
      }

      try {
        const res = await api.post("/superadmin/external_users", data);
        await this.getExternalUsers();
        return {
          status: true,
          message: res.data.message || "สร้างผู้ใช้งานสำเร็จ",
          data: res.data,
        };
      } catch (error) {
        const msg = error?.response?.data?.message || "ไม่สามารถสร้างผู้ใช้งานได้";
        console.error("createExternalUser error:", error);
        return { status: false, message: msg };
      }
    },

    async updateExternalUser(username, data) {
      try {
        const res = await api.put(`/superadmin/external_users/${username}`, data);
        await this.getExternalUsers();
        return {
          status: true,
          message: res.data.message || "อัพเดตสำเร็จ",
          data: res.data,
        };
      } catch (error) {
        const msg = error?.response?.data?.message || "อัพเดตล้มเหลว";
        console.error("updateExternalUser error:", error);
        return { status: false, message: msg };
      }
    },

    async deleteExternalUser(username) {
      try {
        const res = await api.delete(`/superadmin/external_users/${username}`);
        await this.getExternalUsers();
        return {
          status: true,
          message: res.data.message || "ลบผู้ใช้งานสำเร็จ",
          data: res.data,
        };
      } catch (error) {
        const msg = error?.response?.data?.message || "ลบล้มเหลว";
        console.error("deleteExternalUser error:", error);
        return { status: false, message: msg };
      }
    },
    
    async resetPassword(username, password) {
      try {
        const res = await api.post(`/superadmin/external_users/${username}/reset-password`, { password });
        return {
          status: true,
          message: res.data.message || "รีเซ็ตรหัสผ่านสำเร็จ",
          data: res.data,
        };
      } catch (error) {
        const msg = error?.response?.data?.message || "รีเซ็ตรหัสผ่านล้มเหลว";
        console.error("resetPassword error:", error);
        return { status: false, message: msg };
      }
    },
    
    async importExternalUsers(users) {
      try {
        const res = await api.post('/superadmin/external_users/import', { users });
        await this.getExternalUsers();
        return {
          status: true,
          message: res.data.message || "นำเข้าข้อมูลสำเร็จ",
          data: res.data,
        };
      } catch (error) {
        const msg = error?.response?.data?.message || "นำเข้าข้อมูลล้มเหลว";
        console.error("importExternalUsers error:", error);
        return { status: false, message: msg };
      }
    }
  },
});
