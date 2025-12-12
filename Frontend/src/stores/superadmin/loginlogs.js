import { defineStore } from "pinia";
import api from "@/utils/api";

const apiUrl = "/auth/loginlogs";

export const useLogsStore = defineStore("logs", {
    state: () => ({
        list: JSON.parse(localStorage.getItem("logsList")) || {},
    }),
    actions: {
        async getLogsList() {
            try {
                const response = await api.get(`${apiUrl}/`);
                console.log('response', response)
                if (response.data?.status) {
                    this.list = response.data?.data || [];
                    localStorage.setItem("logsList", JSON.stringify(this.list));
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
        async clearLogsList() {
            this.list = [];
            localStorage.removeItem("logsList");
        },
    },
});