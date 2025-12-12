import { defineStore } from "pinia";
import api from "@/utils/api";

const apiUrl = "/superadmin/permission";

export const usePermissionStore = defineStore("permission", {
  state: () => ({
    list: JSON.parse(localStorage.getItem("permissionList")) || {},
  }),
  actions: {
    async getPermissionList() {
      try {
        const response = await api.get(`${apiUrl}/list`);
        if (response.data?.status) {
          this.list = response.data?.permissionList || [];
          localStorage.setItem("permissionList", JSON.stringify(this.list));
          this.response = {
            status: true,
            statusCode: 200,
            message: "โหลดข้อมูลสำเร็จ",
          };
        }
        console.log(this.list);
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
    async createPermission(newPermission) {
      try {
        const response = await api.post(`${apiUrl}`, newPermission);
        if (response.status) {
          this.response = {
            status: true,
            statusCode: 200,
            message: response.data.message,
          };
        }
      } catch (error) {
        const errMsg =
          error?.response?.data?.error?.message || "เกิดข้อผิดพลาด";
        console.log(error.response.data.error);

        this.response = {
          status: false,
          statusCode: error?.response?.status || 500,
          message: error?.response?.data?.error
            ? error?.response?.data?.error[0].msg
            : errMsg,
        };
        console.error("createPermission error:", error);
        return error;
      }
    },
    async clearPermissionList() {
      this.list = [];
      localStorage.removeItem("permissionList");
    },
    async updatePermission(employee_code, isAdmin, system_id) {
      try {
        const response = await api.put(`${apiUrl}/${employee_code}`, { isAdmin: isAdmin, system_id: system_id });
        if (response.status) {
          this.response = {
            status: true,
            statusCode: 200,
            message: response.data.message,
          };
        }
      } catch (error) {
        const errMsg =
          error?.response?.data?.error?.message || "เกิดข้อผิดพลาด";
        console.log(error.response.data.error);

        this.response = {
          status: false,
          statusCode: error?.response?.status || 500,
          message: error?.response?.data?.error
            ? error?.response?.data?.error[0].msg
            : errMsg,
        };
        console.error("updatePermission error:", error);
        // return error;
        if (error?.response?.data) return error.response.data;
      }
    },
    async deletePermission(id, employee_code) {
      try {
        console.log(id, employee_code)
      } catch (error) {
        this.response = {
          status: false,
          message: 'เกิดข้อผิดพลาด deletePermission store',
          error: error.message
        }
      }
    }
  },
});
