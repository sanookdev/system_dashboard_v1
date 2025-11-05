import { defineStore } from "pinia";

export const useEventStore = defineStore("event", {
  state: () => ({
    alert: false,
    data: {},
  }),
  actions: {
    popupMessage(status, message, timeOut = true) {
      this.data = {
        status,
        message,
      };
      this.alert = true;
      if (timeOut) {
        setTimeout(() => {
          this.clearMessage();
        }, 5000);
      }
    },
    clearMessage() {
      this.alert = false;
      this.data = {};
    },
  },
});
