<template>
  <div>
    <div class="navbar lg:hidden bg-accent shadow-sm fixed top-0 w-full z-50">
      <div class="flex pl-5 w-full">
        <label class="btn btn-square btn-ghost drawer-button" for="my-drawer-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block h-5 w-5 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </label>
      </div>
      <div class="flex w-full">
        <div class="flex items-center">
          <div class="flex lg:hidden items-center gap-2">
            <div class="avatar">
              <div class="rounded-full overflow-hidden">
                <div class="w-10 object-cover object-top">
                  <img :src="avatarUrl" />
                </div>
              </div>
            </div>
            <div class="grid grid-cols-1">
              <div class="text-sm">
                {{ accountStore.user.fname + " " + accountStore.user.lname }}
              </div>
              <div class="label text-xs">{{ accountStore.user.username }}</div>
            </div>
            <div class="divider divider-horizontal mx-0"></div>
            <div>
              <div @click="logout">
                <LogOut class="w-5 h-5"></LogOut>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="drawer lg:drawer-open mt-16 lg:mt-0">
      <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content mx-4 my-6">
        <div class="flex justify-between mb-6 px-5">
          <div></div>
          <div class="hidden lg:flex items-center gap-2">
            <div class="avatar">
              <div
                class="rounded-full overflow-hidden ring-accent ring-offset-base-100 ring-2 ring-offset-2"
              >
                <div class="w-12 object-cover object-top">
                  <img :src="avatarUrl" alt="avatar" />
                </div>
              </div>
            </div>
            <div class="grid grid-cols-1">
              <div class="text-sm">
                {{ accountStore.user.fname + " " + accountStore.user.lname }}
              </div>
              <div class="label text-xs">
                {{ accountStore.user.username }} :
                <span class="text-info">{{ accountStore.user.role }}</span>
              </div>
            </div>
            <div class="divider divider-horizontal mx-0"></div>
            <div>
              <div @click="logout" class="cursor-pointer">
                <LogOut class="w-5 h-5"></LogOut>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-100 rounded-3xl mx-4 px-10 py-10 my-10">
          <div class="grid grid-cols-1 gap-6">
            <div class="font-semibold text-3xl">{{ route.meta.title }}</div>
            <slot></slot>
          </div>
        </div>
        <div class="mx-4 absolute bottom-0">
          <Footer></Footer>
        </div>
      </div>

      <div class="drawer-side z-[60]">
        <label
          for="my-drawer-2"
          aria-label="close sidebar"
          class="drawer-overlay"
        >
        </label>
        <ul class="menu text-base-content min-h-full w-70 p-4 bg-white">
          <div class="lg:mb-8">
            <li>
              <div
                class="flex hover:bg-transparent rounded-3xl active:bg-transparent"
              >
                <div class="w-18">
                  <img :src="logoUrl" alt="" />
                </div>
                <div>
                  <h1 class="text-xl font-semibold">INTRANET</h1>
                </div>
              </div>
            </li>
          </div>
          <div class="flex flex-col gap-2">
            <div class="rouded-md p-4">
              <div class="flex flex-col gap-2">
                <div v-for="(menu, index) in menus" :key="index">
                  <li>
                    <RouterLink
                      :to="{ name: menu.routeName }"
                      class="rounded-full px-6 py-3"
                      :class="
                        menu.routeName === activeMenu
                          ? 'active bg-accent text-white shadow-[0_4px_12px_-5px_black]'
                          : 'rounded-3xl'
                      "
                    >
                      <component :is="menu.icon"></component>
                      {{ menu.name }}
                    </RouterLink>
                  </li>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-auto opacity-70">
            <img :src="imgUrlFooterSidebar" alt="" />
          </div>
        </ul>
      </div>
    </div>
  </div>

  <!-- Main content -->
</template>
<script setup>
import { computed, ref, watchEffect, onMounted } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import axios from "axios";
import { fetchAvatarUrl } from "@/utils/profileImgByUsername";
import Footer from "@/layouts/Footer.vue";

import { useAccountStore } from "@/stores/account";
const accountStore = useAccountStore();

const route = useRoute();
const router = useRouter();

const defaultAvatar = ref(
  "https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"
);
const avatarUrl = ref(null);

const imgUrlFooterSidebar = ref(
  `${
    import.meta.env.VITE_BASE_PATH
  }/medias/Flux_Dev_Create_an_intricate_illustration_that_visually_repres_0.jpg`
);
const activeMenu = ref("");

// const tokenInStorage = computed(() => localStorage.getItem("token"));

const logoUrl = new URL("/logo/medtu_png_onlylogo.png", import.meta.url).href;

watchEffect(() => {
  activeMenu.value = route.name;
  console.log(accountStore.user);
});

const logout = async () => {
  await accountStore.logout();
  router.push({ name: "login", query: { action: "logout" } });
};
// --- ดึงรูปจาก API (แบบไฟล์รูป/Blob)
async function loadAvatar(username) {
  try {
    avatarUrl.value = (await fetchAvatarUrl(username)) ?? defaultAvatar.value;
    console.log(avatarUrl.value);
  } catch (err) {
    console.error("Load avatar failed:", err);
    avatarUrl.value = null; // ใช้ default ต่อ
  }
}

// โหลดรูปตอนเข้า component และเมื่อ username เปลี่ยน
onMounted(() => {
  if (accountStore?.user?.username) {
    loadAvatar(accountStore.user.username);
  }
});
const menus = [
  {
    name: "Event Calendar",
    routeName: "event-calendar",
    icon: "CalendarDays",
  },
  {
    name: "Dashboard",
    routeName: "user-dashboard",
    icon: "LayoutDashboard",
  },
  {
    name: "Download เอกสาร",
    routeName: "downloadpage",
    icon: "download",
  },
];
</script>