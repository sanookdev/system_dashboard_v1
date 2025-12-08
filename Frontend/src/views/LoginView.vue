<template>
  <div
    class="relative min-h-screen flex items-center justify-center overflow-hidden"
  >
    <div class="absolute inset-0 z-[-1]">
      <video
        autoplay
        muted
        loop
        playsinline
        class="w-full h-full object-cover brightness-[0.8]"
      >
        <source
          src="/videos/6913708_Motion_Graphics_Motion_Graphic_3840x2160.mp4"
          type="video/mp4"
        />
      </video>
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent"
      ></div>
    </div>

    <div
      class="relative w-full max-w-md mx-4 p-8 rounded-3xl bg-white/80 backdrop-blur-xl shadow-2xl border border-white/50 animate-fade-in-up"
    >
      <div class="flex flex-col items-center gap-4 mb-8">
        <div class="p-3 bg-white rounded-full shadow-md">
          <img src="/logo/medlogopng.png" class="h-12 w-auto" alt="Logo" />
        </div>
        <div class="text-center">
          <h1 class="text-2xl font-bold text-gray-800 tracking-wide">
            MED PSU Login
          </h1>
          <p class="text-sm text-gray-500 font-light">
            ระบบสำหรับบุคลากรคณะแพทย์ฯ
          </p>
        </div>
      </div>

      <transition name="shake">
        <div
          v-if="loginError"
          class="alert alert-error mb-6 shadow-lg rounded-xl text-sm font-medium text-white border-none bg-red-500/90"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{{ loginError }}</span>
        </div>
      </transition>

      <form @submit.prevent="login" class="space-y-5">
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold text-gray-600 ml-1"
              >Username</span
            >
          </label>
          <label
            class="input input-bordered w-full flex items-center gap-3 bg-white/70 hover:bg-white focus-within:bg-white focus-within:ring-2 focus-within:ring-success/50 transition-all duration-300 rounded-xl shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              class="w-5 h-5 opacity-50 text-success"
            >
              <path
                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"
              />
            </svg>
            <input
              type="text"
              class="grow placeholder:text-gray-400 text-gray-700 text-base"
              v-model="userLoginData.username"
              placeholder="MEDCODE (รหัสพนักงาน)"
            />
          </label>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold text-gray-600 ml-1"
              >Password</span
            >
          </label>
          <label
            class="input input-bordered w-full flex items-center gap-3 bg-white/70 hover:bg-white focus-within:bg-white focus-within:ring-2 focus-within:ring-success/50 transition-all duration-300 rounded-xl shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              class="w-5 h-5 opacity-50 text-success"
            >
              <path
                fill-rule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clip-rule="evenodd"
              />
            </svg>
            <input
              :type="showPassword ? 'text' : 'password'"
              class="grow placeholder:text-gray-400 text-gray-700 text-base"
              v-model="userLoginData.password"
              placeholder="Password (รหัสผ่าน)"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="btn btn-circle btn-ghost btn-xs text-gray-500 hover:text-emerald-600"
            >
              <svg
                v-if="showPassword"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            </button>
          </label>
        </div>

        <button
          class="btn border-none w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:-translate-y-1"
        >
          <span v-if="!loading">LOGIN</span>
          <span v-else class="loading loading-dots loading-md"></span>
        </button>
      </form>

      <div class="mt-8 pt-6 border-t border-gray-200/60 text-center">
        <div
          class="flex items-start justify-center gap-2 text-xs text-orange-600 bg-orange-50 p-3 rounded-lg border border-orange-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5 shrink-0"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
          <span class="text-left"
            >หากพบปัญหาการใช้งานติดต่อ<br />งานเทคโนฯ โทร 9700</span
          >
        </div>

        <div
          class="flex justify-center gap-6 mt-4 text-sm text-gray-500 font-medium"
        >
          <a class="hover:text-emerald-600 transition-colors cursor-pointer"
            >เงื่อนไขการให้บริการ</a
          >
          <a class="hover:text-emerald-600 transition-colors cursor-pointer"
            >คู่มือการใช้งาน</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// ... (ใช้ Script เดิมได้เลยครับ ไม่ต้องแก้) ...
console.log("ENV : ", import.meta.env);
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

import { useAccountStore } from "@/stores/account";
const accountStore = useAccountStore();

const userLoginData = reactive({
  username: "",
  password: "",
});

const loading = ref(false);
const loginError = ref("");
const showPassword = ref(false);

const login = async () => {
  loading.value = true;
  loginError.value = "";

  userLoginData.username = userLoginData.username.trim();
  userLoginData.password = userLoginData.password.trim();

  await new Promise((resolve) => setTimeout(resolve, 500));

  await accountStore.login(userLoginData);

  loading.value = false;
  console.log(accountStore.response);
  console.log(accountStore.user);

  if (accountStore.response.status) {
    if (
      accountStore.user?.role == "admin" ||
      accountStore.user?.role == "superadmin"
    ) {
      router.push({ name: "superadmin-dashboard" });
    }
    if (accountStore.user?.role == "user") {
      router.push({ name: "event-calendar" });
    }
  } else {
    loginError.value =
      accountStore.response?.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
    accountStore.clearResponse();
  }
};
</script>

<style scoped>
/* Custom Animation สำหรับตอนเปิดหน้าเว็บ */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

/* Transition สำหรับ Error Message */
.shake-enter-active {
  animation: shake 0.5s;
}
.shake-leave-active {
  transition: opacity 0.3s;
}
.shake-leave-to {
  opacity: 0;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>