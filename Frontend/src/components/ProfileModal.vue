<template>
  <dialog ref="profileModal" class="modal profile-modal">
    <div class="modal-box bg-white/95 backdrop-blur-md border border-white/50 shadow-2xl p-0 overflow-hidden flex flex-col profile-modal-box">
      <!-- Header -->
      <div class="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 sm:p-5 text-white flex justify-between items-center shrink-0">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-lg">โปรไฟล์</h3>
            <p class="text-xs text-white/70">{{ currentView === 'profile' ? 'ข้อมูลผู้ใช้งาน' : changeSuccess ? 'สำเร็จ' : 'เปลี่ยนรหัสผ่าน' }}</p>
          </div>
        </div>
        <button @click="closeModal" class="btn btn-circle btn-ghost btn-sm text-white hover:bg-white/20">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-4 sm:p-6 overflow-y-auto">
        <!-- Profile View -->
        <div v-if="currentView === 'profile'" class="space-y-5 animate-fade-in-profile">
          <!-- Avatar + Info -->
          <div class="flex flex-col items-center gap-3 pb-4">
            <div class="avatar">
              <div class="w-20 h-20 rounded-full ring ring-emerald-500/30 ring-offset-2 overflow-hidden">
                <img :src="avatarUrl" alt="avatar" class="object-cover object-top" />
              </div>
            </div>
            <div class="text-center">
              <h4 class="text-lg font-bold text-gray-800">{{ user.fname }} {{ user.lname }}</h4>
              <p class="text-sm text-gray-500">{{ user.username }}</p>
            </div>
          </div>

          <!-- Info Cards -->
          <div class="space-y-3">
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div class="p-2 bg-emerald-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-emerald-600">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-400 font-medium">ชื่อ-นามสกุล</p>
                <p class="text-sm font-semibold text-gray-700">{{ user.fname }} {{ user.lname }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div class="p-2 bg-blue-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-blue-600">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-400 font-medium">รหัสพนักงาน</p>
                <p class="text-sm font-semibold text-gray-700">{{ user.username }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div class="p-2 bg-purple-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-purple-600">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-400 font-medium">บทบาท</p>
                <p class="text-sm font-semibold text-gray-700 capitalize">{{ user.role }}</p>
              </div>
            </div>
          </div>

          <!-- Change Password Button -->
          <button
            @click="currentView = 'changePassword'"
            class="btn border-none w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
            </svg>
            เปลี่ยนรหัสผ่าน
          </button>
        </div>

        <!-- Change Password View -->
        <div v-if="currentView === 'changePassword' && !changeSuccess" class="space-y-4 animate-fade-in-profile">
          <!-- Error -->
          <div v-if="errorMsg" class="alert alert-error shadow-sm rounded-xl text-sm font-medium text-white border-none bg-red-500/90 py-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ errorMsg }}</span>
          </div>

          <!-- Old Password -->
          <div class="form-control">
            <label class="label"><span class="label-text font-semibold text-gray-600">รหัสผ่านเดิม</span></label>
            <div class="input input-bordered w-full flex items-center gap-3 bg-white/70 hover:bg-white focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/50 transition-all duration-300 rounded-xl shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-5 h-5 opacity-50 text-emerald-500">
                <path fill-rule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clip-rule="evenodd" />
              </svg>
              <input
                :type="showOld ? 'text' : 'password'"
                class="grow placeholder:text-gray-400 text-gray-700"
                v-model="form.oldPassword"
                :disabled="loading"
                placeholder="กรอกรหัสผ่านเดิม"
              />
              <button type="button" @click="showOld = !showOld" class="btn btn-circle btn-ghost btn-xs text-gray-500 hover:text-emerald-600">
                <svg v-if="showOld" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
              </button>
            </div>
          </div>

          <!-- New Password -->
          <div class="form-control">
            <label class="label"><span class="label-text font-semibold text-gray-600">รหัสผ่านใหม่</span></label>
            <div class="input input-bordered w-full flex items-center gap-3 bg-white/70 hover:bg-white focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/50 transition-all duration-300 rounded-xl shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-5 h-5 opacity-50 text-emerald-500">
                <path fill-rule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clip-rule="evenodd" />
              </svg>
              <input
                :type="showNew ? 'text' : 'password'"
                class="grow placeholder:text-gray-400 text-gray-700"
                v-model="form.newPassword"
                :disabled="loading"
                placeholder="รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)"
              />
              <button type="button" @click="showNew = !showNew" class="btn btn-circle btn-ghost btn-xs text-gray-500 hover:text-emerald-600">
                <svg v-if="showNew" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
              </button>
            </div>
          </div>

          <!-- Confirm New Password -->
          <div class="form-control">
            <label class="label"><span class="label-text font-semibold text-gray-600">ยืนยันรหัสผ่านใหม่</span></label>
            <div class="input input-bordered w-full flex items-center gap-3 bg-white/70 hover:bg-white focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/50 transition-all duration-300 rounded-xl shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-5 h-5 opacity-50 text-emerald-500">
                <path fill-rule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clip-rule="evenodd" />
              </svg>
              <input
                :type="showConfirm ? 'text' : 'password'"
                class="grow placeholder:text-gray-400 text-gray-700"
                v-model="form.confirmPassword"
                :disabled="loading"
                placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
              />
              <button type="button" @click="showConfirm = !showConfirm" class="btn btn-circle btn-ghost btn-xs text-gray-500 hover:text-emerald-600">
                <svg v-if="showConfirm" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
              </button>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex gap-2 mt-2">
            <button
              @click="goBackToProfile"
              :disabled="loading"
              class="btn border border-gray-300 bg-white hover:bg-gray-50 text-gray-600 font-semibold rounded-xl transition-all duration-200 flex-shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              ย้อนกลับ
            </button>
            <button
              @click="submitChangePassword"
              :disabled="loading"
              class="btn border-none flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300"
            >
              <span v-if="!loading">เปลี่ยนรหัสผ่าน</span>
              <span v-else class="loading loading-dots loading-md"></span>
            </button>
          </div>
        </div>

        <!-- Success View -->
        <div v-if="changeSuccess" class="text-center space-y-4 animate-fade-in-profile py-4">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-10 h-10 text-emerald-600">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h4 class="text-lg font-bold text-gray-800">เปลี่ยนรหัสผ่านสำเร็จ!</h4>
          <p class="text-sm text-gray-500">รหัสผ่านของคุณถูกเปลี่ยนเรียบร้อยแล้ว</p>
          <button
            @click="closeModal"
            class="btn border-none bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all duration-300 min-w-[160px]"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>

    <form method="dialog" class="modal-backdrop">
      <button @click="closeModal">close</button>
    </form>
  </dialog>
</template>

<script setup>
import { ref, reactive } from "vue";
import api from "@/utils/api";

const props = defineProps({
  user: { type: Object, required: true },
  avatarUrl: { type: String, default: "" },
});

const profileModal = ref(null);
const currentView = ref("profile"); // 'profile' | 'changePassword'
const loading = ref(false);
const errorMsg = ref("");
const changeSuccess = ref(false);

const showOld = ref(false);
const showNew = ref(false);
const showConfirm = ref(false);

const form = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const resetForm = () => {
  form.oldPassword = "";
  form.newPassword = "";
  form.confirmPassword = "";
  errorMsg.value = "";
  showOld.value = false;
  showNew.value = false;
  showConfirm.value = false;
  loading.value = false;
  changeSuccess.value = false;
};

const openModal = () => {
  currentView.value = "profile";
  resetForm();
  if (profileModal.value) {
    profileModal.value.showModal();
  }
};

const closeModal = () => {
  if (profileModal.value) {
    profileModal.value.close();
  }
};

const goBackToProfile = () => {
  currentView.value = "profile";
  resetForm();
};

const submitChangePassword = async () => {
  errorMsg.value = "";

  if (!form.oldPassword) {
    errorMsg.value = "กรุณากรอกรหัสผ่านเดิม";
    return;
  }
  if (!form.newPassword || form.newPassword.length < 6) {
    errorMsg.value = "รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร";
    return;
  }
  if (form.newPassword !== form.confirmPassword) {
    errorMsg.value = "รหัสผ่านใหม่ไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง";
    return;
  }

  loading.value = true;

  try {
    const res = await api.post("auth/change-password", {
      oldPassword: form.oldPassword,
      newPassword: form.newPassword,
    });

    if (res.data && res.data.status) {
      changeSuccess.value = true;
    } else {
      errorMsg.value = res.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่";
    }
  } catch (error) {
    console.error("Change password error:", error);
    if (error.response?.data?.message) {
      errorMsg.value = error.response.data.message;
    } else {
      errorMsg.value = "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์";
    }
  } finally {
    loading.value = false;
  }
};

defineExpose({ openModal });
</script>

<style scoped>
.profile-modal {
  align-items: center;
  justify-content: center;
}

.profile-modal-box {
  max-height: 90vh;
  max-height: 90dvh;
  width: calc(100% - 2rem);
  max-width: 28rem;
  margin: 1rem;
  border-radius: 1.5rem;
}

@media (max-width: 640px) {
  .profile-modal-box {
    max-height: 85vh;
    max-height: 85dvh;
    max-width: calc(100% - 1.5rem);
    margin: 0.75rem;
    border-radius: 1.25rem;
  }
}

.animate-fade-in-profile {
  animation: fadeInProfile 0.3s ease-out forwards;
}

@keyframes fadeInProfile {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
