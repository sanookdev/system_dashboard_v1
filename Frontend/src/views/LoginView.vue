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
            Single Portal Login
          </h1>
          <p class="text-xl text-gray-500 font-light">สำหรับบุคลากรคณะแพทย์ฯ</p>
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
          <div class="label">
            <span class="label-text font-semibold text-gray-600 ml-1"
              >Username</span
            >
          </div>
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
              :disabled="loading"
              placeholder="MEDCODE (รหัสพนักงาน)"
            />
          </label>
        </div>

        <div class="form-control">
          <div class="label">
            <span class="label-text font-semibold text-gray-600 ml-1"
              >Password</span
            >
          </div>
          <div
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
              :disabled="loading"
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
          </div>
        </div>

        <button
          class="btn border-none w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:-translate-y-1"
        >
          <span v-if="!loading">LOGIN</span>
          <span v-else class="loading loading-dots loading-md"></span>
        </button>
      </form>

      <div class="mt-3 text-center">
        <button
          @click="openForgotPasswordModal"
          class="text-sm text-emerald-600 hover:text-emerald-700 font-medium hover:underline transition-all duration-200 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 inline-block mr-1 -mt-0.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
          </svg>
          ลืมรหัสผ่าน?
        </button>
      </div>

      <div class="mt-4 pt-6 border-t border-gray-200/60 text-center">
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
            >หากพบปัญหาการใช้งานติดต่อ <br />งานเทคโนฯ โทร 9700
          </span>
        </div>

        <div
          class="flex justify-center gap-6 mt-4 text-sm text-gray-500 font-medium"
        >
          <a
            @click.prevent="openTermsModal"
            class="hover:text-emerald-600 transition-colors cursor-pointer"
            >เงื่อนไขการให้บริการ</a
          >
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdsCb-OlSDB4i7yWLvIsBzrJh2eJATVsbU4Pm9B7DOrCTZhcw/viewform?usp=sharing&ouid=104571451642350975963"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-emerald-600 transition-colors cursor-pointer"
            >แบบประเมินความพึงพอใจ
          </a>
        </div>
      </div>
    </div>
    <dialog ref="termsModal" class="modal modal-bottom sm:modal-middle">
      <div
        class="modal-box bg-white/95 backdrop-blur-md border rounded-4xl border-white/50 shadow-2xl p-0 overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div
          class="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white flex justify-between items-center shrink-0"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </div>
            <h3 class="font-bold text-lg">ข้อกำหนดและเงื่อนไขการใช้งาน</h3>
          </div>
          <form method="dialog">
            <button
              class="btn btn-circle btn-ghost btn-sm text-white hover:bg-white/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </form>
        </div>

        <div
          class="p-6 overflow-y-auto custom-scrollbar text-gray-700 rounded-md leading-relaxed text-sm space-y-4"
        >
          <div
            class="alert bg-blue-50 text-accent border-blue-200 text-md py-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="stroke-current shrink-0 w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span
              >โปรดอ่านข้อกำหนดนี้อย่างละเอียดก่อนเข้าใช้งานระบบ Single
              Portal</span
            >
          </div>

          <div>
            <h4 class="font-bold text-gray-900 mb-2">
              1. การเข้าถึงและการยืนยันตัวตน
            </h4>
            <p>
              บัญชีผู้ใช้งาน (User Account) ถือเป็นทรัพย์สินของคณะแพทยศาสตร์
              ห้ามมิให้ส่งต่อ รหัสผ่าน (Password) ให้แก่ผู้อื่นโดยเด็ดขาด
              การกระทำใดๆ
              ภายใต้บัญชีของท่านถือเป็นความรับผิดชอบของเจ้าของบัญชีแต่เพียงผู้เดียว
            </p>
          </div>

          <div>
            <h4 class="font-bold text-gray-900 mb-2">
              2. การรักษาความลับข้อมูลนักศึกษาและบุคลากร
            </h4>
            <p>
              ข้อมูลในระบบอาจประกอบด้วยประวัตินักศึกษา ผลการเรียน
              ข้อมูลทรัพยากรบุคคล และการประเมินต่างๆ ผู้ใช้งานต้องปฏิบัติตาม
              <span class="font-semibold text-red-600"
                >พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)</span
              >
              และระเบียบของมหาวิทยาลัยอย่างเคร่งครัด
            </p>
            <ul class="list-disc list-inside mt-1 ml-2 text-gray-600">
              <li>
                ห้ามแคปหน้าจอ (Screen Capture)
                หรือเผยแพร่เกรด/เงินเดือน/ข้อมูลส่วนตัว ของผู้อื่น
              </li>
              <li>
                ห้ามนำข้อมูลออกจากระบบเพื่อใช้ในวัตถุประสงค์อื่นนอกเหนือจากการปฏิบัติงาน
              </li>
            </ul>
          </div>

          <div>
            <h4 class="font-bold text-gray-900 mb-2">3. การใช้งานที่เหมาะสม</h4>
            <p>
              ระบบนี้จัดทำขึ้นเพื่อสนับสนุนการปฏิบัติงานภายในคณะฯ เท่านั้น
              ห้ามใช้เพื่อวัตถุประสงค์ส่วนตัว ธุรกิจ หรือการกระทำที่ผิดกฎหมาย
            </p>
          </div>

          <div>
            <h4 class="font-bold text-gray-900 mb-2">
              4. การตรวจสอบ (Auditing & Monitoring)
            </h4>
            <p>
              ระบบจะทำการบันทึกประวัติการเข้าใช้งาน (Log)
              ของท่านเพื่อประโยชน์ในการตรวจสอบความปลอดภัยและการบริหารจัดการระบบ
            </p>
          </div>

          <div class="text-xs text-gray-400 border-t pt-4 mt-6">
            ปรับปรุงล่าสุด: 8 ธันวาคม 2568
          </div>
        </div>

        <div
          class="p-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50"
        >
          <form method="dialog">
            <button class="btn btn-neutral btn-sm min-w-[100px]">
              ปิดหน้าต่าง
            </button>
          </form>
        </div>
      </div>

      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>

    <!-- Forgot Password Modal -->
    <dialog ref="forgotPasswordModal" class="modal forgot-modal">
      <div
        class="modal-box bg-white/95 backdrop-blur-md border border-white/50 shadow-2xl p-0 overflow-hidden flex flex-col forgot-modal-box"
      >
        <div
          class="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 sm:p-5 text-white flex justify-between items-center shrink-0"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-lg">ลืมรหัสผ่าน</h3>
              <p class="text-xs text-white/70">{{ forgotStep === 1 ? 'ขั้นตอนที่ 1: ยืนยันตัวตน' : forgotStep === 2 ? 'ขั้นตอนที่ 2: ตั้งรหัสผ่านใหม่' : 'สำเร็จ' }}</p>
            </div>
          </div>
          <button
            @click="closeForgotPasswordModal"
            class="btn btn-circle btn-ghost btn-sm text-white hover:bg-white/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Step Progress Bar -->
        <div class="px-4 sm:px-6 pt-3 sm:pt-4 shrink-0">
          <div class="flex items-center gap-2">
            <div class="flex-1 h-1.5 rounded-full transition-all duration-500" :class="forgotStep >= 1 ? 'bg-emerald-500' : 'bg-gray-200'"></div>
            <div class="flex-1 h-1.5 rounded-full transition-all duration-500" :class="forgotStep >= 2 ? 'bg-emerald-500' : 'bg-gray-200'"></div>
            <div class="flex-1 h-1.5 rounded-full transition-all duration-500" :class="forgotStep >= 3 ? 'bg-emerald-500' : 'bg-gray-200'"></div>
          </div>
        </div>

        <div class="p-4 sm:p-6 overflow-y-auto">
          <!-- Error Message -->
          <transition name="shake">
            <div
              v-if="forgotError"
              class="alert alert-error mb-4 shadow-sm rounded-xl text-sm font-medium text-white border-none bg-red-500/90 py-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ forgotError }}</span>
            </div>
          </transition>

          <!-- Step 1: Identity Verification -->
          <div v-if="forgotStep === 1" class="space-y-4 animate-fade-in">
            <div class="alert bg-blue-50 text-blue-700 border-blue-200 text-sm py-3 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>กรุณากรอกข้อมูลเพื่อยืนยันตัวตนก่อนตั้งรหัสผ่านใหม่</span>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold text-gray-600">Username (รหัสพนักงาน)</span>
              </label>
              <label class="input input-bordered w-full flex items-center gap-3 bg-white/70 hover:bg-white focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/50 transition-all duration-300 rounded-xl shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-5 h-5 opacity-50 text-emerald-500">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input
                  type="text"
                  class="grow placeholder:text-gray-400 text-gray-700"
                  v-model="forgotData.username"
                  :disabled="forgotLoading"
                  placeholder="กรอกรหัสพนักงาน"
                />
              </label>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold text-gray-600">เลขบัตรประชาชน / passport</span>
              </label>
              <label class="input input-bordered w-full flex items-center gap-3 bg-white/70 hover:bg-white focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/50 transition-all duration-300 rounded-xl shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 opacity-50 text-emerald-500">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
                </svg>
                <input
                  type="text"
                  class="grow placeholder:text-gray-400 text-gray-700"
                  v-model="forgotData.idcard"
                  :disabled="forgotLoading"
                  placeholder="กรอกเลขบัตรประชาชน 13 หลัก"
                  maxlength="13"
                />
              </label>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold text-gray-600">วันเดือนปีเกิด</span>
              </label>
              <label class="input input-bordered w-full flex items-center gap-3 bg-white/70 hover:bg-white focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/50 transition-all duration-300 rounded-xl shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 opacity-50 text-emerald-500">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                <input
                  type="date"
                  class="grow placeholder:text-gray-400 text-gray-700"
                  v-model="forgotData.birthdate"
                  :disabled="forgotLoading"
                />
              </label>
            </div>

            <button
              @click="verifyIdentity"
              :disabled="forgotLoading"
              class="btn border-none w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300"
            >
              <span v-if="!forgotLoading">ยืนยันตัวตน</span>
              <span v-else class="loading loading-dots loading-md"></span>
            </button>
          </div>

          <!-- Step 2: Set New Password -->
          <div v-if="forgotStep === 2" class="space-y-4 animate-fade-in">
            <div class="alert bg-emerald-50 text-emerald-700 border-emerald-200 text-sm py-3 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>ยืนยันตัวตนสำเร็จ! กรุณาตั้งรหัสผ่านใหม่</span>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold text-gray-600">รหัสผ่านใหม่</span>
              </label>
              <div class="input input-bordered w-full flex items-center gap-3 bg-white/70 hover:bg-white focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/50 transition-all duration-300 rounded-xl shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-5 h-5 opacity-50 text-emerald-500">
                  <path fill-rule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clip-rule="evenodd" />
                </svg>
                <input
                  :type="showNewPassword ? 'text' : 'password'"
                  class="grow placeholder:text-gray-400 text-gray-700"
                  v-model="forgotData.newPassword"
                  :disabled="forgotLoading"
                  placeholder="รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)"
                />
                <button type="button" @click="showNewPassword = !showNewPassword" class="btn btn-circle btn-ghost btn-xs text-gray-500 hover:text-emerald-600">
                  <svg v-if="showNewPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                </button>
              </div>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold text-gray-600">ยืนยันรหัสผ่านใหม่</span>
              </label>
              <div class="input input-bordered w-full flex items-center gap-3 bg-white/70 hover:bg-white focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/50 transition-all duration-300 rounded-xl shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-5 h-5 opacity-50 text-emerald-500">
                  <path fill-rule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clip-rule="evenodd" />
                </svg>
                <input
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="grow placeholder:text-gray-400 text-gray-700"
                  v-model="forgotData.confirmPassword"
                  :disabled="forgotLoading"
                  placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                />
                <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="btn btn-circle btn-ghost btn-xs text-gray-500 hover:text-emerald-600">
                  <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                </button>
              </div>
            </div>

            <!-- Password strength indicator -->
            <div v-if="forgotData.newPassword" class="space-y-1">
              <div class="flex gap-1">
                <div class="h-1 flex-1 rounded-full transition-all duration-300" :class="passwordStrength >= 1 ? 'bg-red-400' : 'bg-gray-200'"></div>
                <div class="h-1 flex-1 rounded-full transition-all duration-300" :class="passwordStrength >= 2 ? 'bg-yellow-400' : 'bg-gray-200'"></div>
                <div class="h-1 flex-1 rounded-full transition-all duration-300" :class="passwordStrength >= 3 ? 'bg-emerald-400' : 'bg-gray-200'"></div>
                <div class="h-1 flex-1 rounded-full transition-all duration-300" :class="passwordStrength >= 4 ? 'bg-emerald-600' : 'bg-gray-200'"></div>
              </div>
              <p class="text-xs" :class="passwordStrength <= 1 ? 'text-red-500' : passwordStrength === 2 ? 'text-yellow-600' : 'text-emerald-600'">
                {{ passwordStrength <= 1 ? 'อ่อน' : passwordStrength === 2 ? 'ปานกลาง' : passwordStrength === 3 ? 'ดี' : 'แข็งแรงมาก' }}
              </p>
            </div>

            <button
              @click="submitResetPassword"
              :disabled="forgotLoading"
              class="btn border-none w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300"
            >
              <span v-if="!forgotLoading">เปลี่ยนรหัสผ่าน</span>
              <span v-else class="loading loading-dots loading-md"></span>
            </button>
          </div>

          <!-- Step 3: Success -->
          <div v-if="forgotStep === 3" class="text-center space-y-4 animate-fade-in py-4">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-10 h-10 text-emerald-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h4 class="text-lg font-bold text-gray-800">เปลี่ยนรหัสผ่านสำเร็จ!</h4>
            <p class="text-sm text-gray-500">กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่ของคุณ</p>
            <button
              @click="closeForgotPasswordModal"
              class="btn border-none bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all duration-300 min-w-[160px]"
            >
              กลับไปหน้า Login
            </button>
          </div>
        </div>
      </div>

      <form method="dialog" class="modal-backdrop">
        <button @click="closeForgotPasswordModal">close</button>
      </form>
    </dialog>

    <div v-if="toast.show" class="toast toast-bottom toast-center z-50">
      <div
        class="alert shadow-lg transition-all duration-300 ease-in-out transform"
        :class="{
          'alert-success text-white': toast.type === 'success',
          'alert-info text-white': toast.type === 'info',
          'alert-error text-white': toast.type === 'error',
        }"
      >
        <svg
          v-if="toast.type === 'success'"
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <svg
          v-if="toast.type === 'info'"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="stroke-current shrink-0 w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
console.log("ENV : ", import.meta.env);
import { reactive, ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
const router = useRouter();
const route = useRoute();

import { useAccountStore } from "@/stores/account";
import baseApiUrl from "@/stores/config/axiosConfig";
const accountStore = useAccountStore();

const userLoginData = reactive({
  username: "",
  password: "",
});

const loading = ref(false);
const loginError = ref("");
const showPassword = ref(false);

const termsModal = ref(null);

// ✅ 1. สร้าง State สำหรับ Toast
const toast = reactive({
  show: false,
  message: "",
  type: "success", // success, info, error
});

// ✅ 2. ฟังก์ชันเรียกใช้ Toast
const showToast = (message, type = "success", duration = 3000) => {
  toast.message = message;
  toast.type = type;
  toast.show = true;

  // ซ่อนอัตโนมัติตามเวลาที่กำหนด
  setTimeout(() => {
    toast.show = false;
  }, duration);
};

// ✅ 3. เช็คสถานะ Logout ตอนโหลดหน้าจอ
onMounted(() => {
  // ถ้ามีการ Redirect มาพร้อม query ?action=logout (ต้องไปแก้ปุ่ม logout ที่หน้าอื่นให้ส่งมาแบบนี้)
  if (route.query.action === "logout") {
    showToast("ออกจากระบบเรียบร้อยแล้ว", "info");

    // (Optional) ล้าง query param ออกเพื่อให้ URL สวยงาม
    router.replace({ query: null });
  }
});

// ฟังก์ชันเปิด Modal
const openTermsModal = () => {
  if (termsModal.value) {
    termsModal.value.showModal();
  }
};

// ========== Forgot Password ==========
const forgotPasswordModal = ref(null);
const forgotStep = ref(1); // 1=verify, 2=new password, 3=success
const forgotLoading = ref(false);
const forgotError = ref("");
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const forgotData = reactive({
  username: "",
  idcard: "",
  birthdate: "",
  newPassword: "",
  confirmPassword: "",
});

const passwordStrength = computed(() => {
  const p = forgotData.newPassword;
  if (!p) return 0;
  let score = 0;
  if (p.length >= 6) score++;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
  if (/[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p)) score++;
  return score;
});

const openForgotPasswordModal = () => {
  forgotStep.value = 1;
  forgotError.value = "";
  forgotLoading.value = false;
  forgotData.username = "";
  forgotData.idcard = "";
  forgotData.birthdate = "";
  forgotData.newPassword = "";
  forgotData.confirmPassword = "";
  showNewPassword.value = false;
  showConfirmPassword.value = false;
  if (forgotPasswordModal.value) {
    forgotPasswordModal.value.showModal();
  }
};

const closeForgotPasswordModal = () => {
  if (forgotPasswordModal.value) {
    forgotPasswordModal.value.close();
  }
};

const verifyIdentity = async () => {
  forgotError.value = "";

  if (!forgotData.username.trim()) {
    forgotError.value = "กรุณากรอก Username";
    return;
  }
  if (!forgotData.idcard.trim() || forgotData.idcard.trim().length !== 13) {
    forgotError.value = "กรุณากรอกเลขบัตรประชาชน 13 หลัก";
    return;
  }
  if (!forgotData.birthdate) {
    forgotError.value = "กรุณาเลือกวันเดือนปีเกิด";
    return;
  }

  forgotLoading.value = true;

  try {
    const res = await axios.post(
      `${baseApiUrl}auth/verify-identity`,
      {
        username: forgotData.username.trim(),
        idcard: forgotData.idcard.trim(),
        birthdate: forgotData.birthdate,
      },
      {
        headers: {
          "application-key": import.meta.env.VITE_APPLICATION_KEY,
        },
      }
    );

    if (res.data && res.data.status) {
      forgotStep.value = 2;
    } else {
      forgotError.value = res.data?.message || "ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง";
    }
  } catch (error) {
    console.error("Verify identity error:", error);
    if (error.response?.data?.message) {
      forgotError.value = error.response.data.message;
    } else if (error.response?.data?.error) {
      forgotError.value = error.response.data.error[0]?.msg || "เกิดข้อผิดพลาด";
    } else {
      forgotError.value = "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์";
    }
  } finally {
    forgotLoading.value = false;
  }
};

const submitResetPassword = async () => {
  forgotError.value = "";

  if (!forgotData.newPassword || forgotData.newPassword.length < 6) {
    forgotError.value = "รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร";
    return;
  }
  if (forgotData.newPassword !== forgotData.confirmPassword) {
    forgotError.value = "รหัสผ่านใหม่ไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง";
    return;
  }

  forgotLoading.value = true;

  try {
    const res = await axios.post(
      `${baseApiUrl}auth/reset-password`,
      {
        username: forgotData.username.trim(),
        idcard: forgotData.idcard.trim(),
        birthdate: forgotData.birthdate,
        newPassword: forgotData.newPassword,
      },
      {
        headers: {
          "application-key": import.meta.env.VITE_APPLICATION_KEY,
        },
      }
    );

    if (res.data && res.data.status) {
      forgotStep.value = 3;
    } else {
      forgotError.value = res.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
    }
  } catch (error) {
    console.error("Reset password error:", error);
    if (error.response?.data?.message) {
      forgotError.value = error.response.data.message;
    } else if (error.response?.data?.error) {
      forgotError.value = error.response.data.error[0]?.msg || "เกิดข้อผิดพลาด";
    } else {
      forgotError.value = "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์";
    }
  } finally {
    forgotLoading.value = false;
  }
};
// ========== (END) Forgot Password ==========

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
    // ✅ 4. กรณี Login สำเร็จ: แสดง Toast ก่อนย้ายหน้า
    showToast("เข้าสู่ระบบสำเร็จ...", "success");
    setTimeout(() => {
      if (
        accountStore.user?.role == "admin" ||
        accountStore.user?.role == "superadmin"
      ) {
        router.push({ name: "superadmin-dashboard" });
      } else if (accountStore.user?.role == "user") {
        router.push({ name: "event-calendar" });
      }
    }, 1000);
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

/* Forgot Password Modal — always centered */
.forgot-modal {
  align-items: center;
  justify-content: center;
}

.forgot-modal-box {
  max-height: 90vh;
  max-height: 90dvh;
  width: calc(100% - 2rem);
  max-width: 28rem;
  margin: 1rem;
  border-radius: 1.5rem;
}

@media (max-width: 640px) {
  .forgot-modal-box {
    max-height: 85vh;
    max-height: 85dvh;
    max-width: calc(100% - 1.5rem);
    margin: 0.75rem;
    border-radius: 1.25rem;
  }
}

/* Fade-in animation for modal steps */
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
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