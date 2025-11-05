<template>
  <div class="flex justify-center mt-16 text-3xl">
    <video
      autoplay
      muted
      loop
      playsinline
      class="absolute top-0 left-0 w-full min-h-full object-cover z-[-1] brightness-70"
    >
      <source src="/4760-179739327_large.webm" type="video/webm" />
      Your browser does not support the video tag.
    </video>
    <div
      class="flex-1 max-w-lg bg-gray-800 shadow-sm shadow-neutral-300 py-5 rounded-md px-10 mx-2 lg:mx-0"
    >
      <div class="flex justify-end items-center gap-3">
        <img src="/logo/medlogopng.png" class="h-10 w-auto" alt="" />
        <div class="text-[1.2rem] text-white">ระบบสำหรับบุคลากรคณะแพทย์ฯ</div>
      </div>
      <div class="divider divider-success"></div>
      <div class="text-white text-3xl flex justify-center mb-2">Login</div>
      <div class="text-sm flex flex-col text-orange-200 border-2 p-3">
        <div class="text-center flex w-full justify-center">ข้อมูลทดสอบ</div>
        <div class="divider divider-warning py-0 my-0"></div>
        <div class="grid grid-cols-2">
          <div class="text-center">username :</div>
          <div class="text-red-400">{{ userLoginData.username }}</div>
        </div>
        <div class="grid grid-cols-2">
          <div class="text-center">password :</div>
          <div class="text-red-400">{{ userLoginData.password }}</div>
        </div>
      </div>
      <form @submit.prevent="login">
        <fieldset class="fieldset">
          <legend class="fieldset-legend text-white text-xl">Username</legend>
          <input
            type="text"
            class="input w-full"
            v-model="userLoginData.username"
            placeholder="MEDCODE (รหัสพนักงาน)"
          />
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend text-white text-xl">Password</legend>
          <input
            type="password"
            class="input w-full"
            v-model="userLoginData.password"
            placeholder="Password (รหัสผู้ใช้งาน)"
          />
        </fieldset>
        <button
          @click="login"
          class="btn btn-success w-full my-5 transition-transform duration-200 hover:translate-y-[-2px]"
        >
          LOGIN
        </button>
        <div
          v-if="loginError"
          class="badge badge-error p-3 w-full justify-center"
        >
          {{ loginError }}
        </div>
      </form>
      <div
        class="text-sm text-red-300 border-gray-700 border-2 py-2 px-4 text-center mb-4"
      >
        หมายเหตุ : หากพบปัญหาการใช้งานติดต่อ งานเทคโนฯ 9700
      </div>
      <div class="text-sm text-gray-400 flex flex-row underline">
        <div class="flex-1">
          <a class="hover:text-orange-200" href="#">เงื่อนไขการให้บริการ</a>
        </div>
        <div>
          <a class="hover:text-orange-200" href="#">คู่มือการใช้งาน</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
console.log("ENV : ", import.meta.env);
import { reactive, getCurrentInstance, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const { proxy } = getCurrentInstance();

import { useAccountStore } from "@/stores/account";
const accountStore = useAccountStore();

import { useEventStore } from "@/stores/event";
const eventStore = useEventStore();

const userLoginData = reactive({
  username: "",
  password: "",
});

const loading = ref(false);

const login = async () => {
  userLoginData.username = userLoginData["username"].trim();
  userLoginData.password = userLoginData["password"].trim();
  await accountStore.login(userLoginData);
  if (accountStore.response.status) {
    proxy.$alertify
      .alert(accountStore.response.message, function () {
        router.push({ name: "superadmin-dashboard" });
      })
      .set({ title: "แจ้งเตือน !!" });
  } else {
    proxy.$alertify
      .alert(
        accountStore.response?.message || "เกิดข้อผิดพลาดบางอย่าง",
        function () {
          userLoginData.username = "";
          userLoginData.password = "";
          accountStore.clearResponse();
          router.push({ name: "login" });
        }
      )
      .set({ title: "แจ้งเตือน !!" });
  }
};
</script>

<style scoped></style>
