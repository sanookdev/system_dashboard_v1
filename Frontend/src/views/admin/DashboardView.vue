<template>
  <div>
    <AdminLayout>
      <div class="flex justify-between">
        <div class="flex items-center gap-2 text-sm">
          <div class="label">จำนวนระบบทั้งหมด :</div>
          <div class="text-accent">{{ systems.length }} ระบบ</div>
        </div>
        <div class="input input-bordered flex items-center gap-2 h-10">
          <input
            type="text"
            class="grow w-full max-w-xs"
            placeholder="ค้นหาระบบ..."
            v-model="searchQuery"
          />
          <Search class="w-4 h-4 opacity-70" />
        </div>
        <div class="hidden md:flex items-center gap-4">
          <div
            class="bg-accent rounded-xl p-2 cursor-pointer"
            @click="toggleListView"
          >
            <List v-if="!isListView" color="white" />
            <LayoutDashboard v-else color="white" />
          </div>
        </div>
      </div>
      <div class="divider p-0 m-0"></div>

      <div class="flex flex-col gap-10">
        <div role="tablist" class="tabs tabs-border tabs-md" v-if="categories">
          <a
            v-for="item in categories"
            :key="item.id"
            class="tab"
            :class="
              item.id === selectedTabId
                ? 'tab-active text-accent'
                : 'text-gray-600'
            "
            @click="selectTab(item.id)"
          >
            {{ item.name }}
          </a>
        </div>

        <transition name="fade-scale" mode="out-in">
          <div :key="selectedTabId + '-' + isListView" v-if="systems">
            <div v-if="!isListView">
              <div
                v-if="systems.length"
                class="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4"
              >
                <div
                  v-for="system in systems"
                  :key="system.id"
                  class="flex justify-center items-center"
                >
                  <SubsystemCard
                    v-if="system"
                    @click="openSubsystem(system)"
                    :subsystem="system"
                  />
                </div>
              </div>
              <div v-else class="text-center text-gray-400 p-6">
                ไม่พบระบบที่เกี่ยวข้อง
              </div>
            </div>

            <div
              v-else-if="systems.length"
              class="space-y-2 rounded-xl p-4 bg-white"
            >
              <div
                v-for="system in systems"
                :key="system.id"
                class="p-2 hover:bg-base-200 rounded-full"
              >
                <div
                  class="flex items-center gap-2 cursor-pointer p-2"
                  @click="openSubsystem(system)"
                >
                  <img
                    v-if="system.img_icon"
                    :src="`${basePath}${system.img_icon}`"
                    :alt="system.name"
                    class="inline-block w-6 h-6 mr-2 object-contain"
                  />
                  <component
                    v-else
                    :is="system.icon"
                    class="inline-block w-6 h-6 mr-2"
                  />
                  <div></div>
                  <div class="font-bold">{{ system.name }}</div>
                  <div class="text-sm text-gray-500">
                    {{ system.description }}
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center text-gray-400 p-6">
              ไม่พบระบบที่เกี่ยวข้อง
            </div>
          </div>
        </transition>
      </div>
    </AdminLayout>
    <div
      v-if="redirectLoading"
      class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-60 text-white"
    >
      <span class="loading loading-spinner loading-lg mb-4"></span>
      <p class="text-xl">{{ redirectLoadingText }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import SubsystemCard from "@/components/SubsystemCard.vue";
import { LayoutDashboard } from "lucide-vue-next";

import { useAccountStore } from "@/stores/account";
const accountStore = useAccountStore();

import { useCategoriesStore } from "@/stores/superadmin/categories";
const categoriesStore = useCategoriesStore();

const basePath = import.meta.env.VITE_BASE_PATH_PRODUCTION || "";

const selectedTabId = ref(null);

const redirectLoadingText = ref("...");

// 1. เพิ่มตัวแปรเก็บคำค้นหา
const searchQuery = ref("");

const categories = computed(() => categoriesStore.list);

// 2. แก้ไข systems computed ให้ filter ตามชื่อ
const systems = computed(() => {
  const selected = categories.value.find((c) => c.id === selectedTabId.value);
  let list = selected?.systems || [];

  // ถ้ามีการพิมพ์ค้นหา ให้กรองเฉพาะที่มีชื่อตรงกัน
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    list = list.filter((system) => system.name.toLowerCase().includes(query));
  }

  return list;
});

const redirectLoading = ref(false);

onMounted(async () => {
  await categoriesStore.getCategories(accountStore.token);
  if (categories.value[0]?.id) {
    selectedTabId.value = categories.value[0].id;
  }

  console.log(systems.value);
});
const selectTab = (id) => {
  selectedTabId.value = id;
};

const isListView = ref(false);

const toggleListView = () => {
  isListView.value = !isListView.value;
};

const openSubsystem = async (system) => {
  try {
    redirectLoading.value = true;
    redirectLoadingText.value = "กำลังยืนยันตัวตน...";
    await new Promise((resolve) => setTimeout(resolve, 500));

    const token = encodeURIComponent(accountStore.token);
    const { id: system_id, url: system_url } = system;
    const redirect_to_subsystem = system.sso
      ? `${system_url}?token=${token}`
      : system_url;
    const ssoResponse = await accountStore.ssoStart(system_id);
    if (!ssoResponse?.status) {
      throw new Error(ssoResponse?.message || "เริ่ม SSO ไม่สำเร็จ");
    } else {
      console.log("sso pass");
      redirectLoadingText.value = "กำลังเช็คสิทธิ์การใช้งาน...";
    }
    await new Promise((resolve) => setTimeout(resolve, 500));

    const authorizeResponse = ssoResponse.status
      ? await accountStore.authorize_system(ssoResponse.redirect, system_id)
      : (authorizeResponse.status = false);

    if (!authorizeResponse?.status) {
      console.log(authorizeResponse);
      throw new Error(
        authorizeResponse?.message || "ไม่สามารถยืนยันสิทธิ์เข้าใช้ระบบย่อยได้"
      );
    } else {
      console.log("authorize system pass");
      redirectLoadingText.value = "กำลังนำท่านเข้าสู่ระบบ...";
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (authorizeResponse.status) {
      window.open(redirect_to_subsystem, "_blank");
    } else {
      alert(authorizeResponse.message);
    }
  } catch (error) {
    console.error(error);
  } finally {
    redirectLoading.value = false;
  }
};
</script>

<style scoped></style>
