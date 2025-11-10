<template>
  <div>
    <UserLayout>
      <div class="flex justify-between">
        <div class="flex items-center gap-2 text-sm">
          <div class="label">จำนวนระบบทั้งหมด :</div>
          <div class="text-accent">{{ systems.length }} ระบบ</div>
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
                class="flex flex-col md:flex-row gap-4"
              >
                <div
                  v-for="system in systems"
                  :key="system.id"
                  class="flex justify-center items-center gap-2"
                >
                  <div v-if="system">
                    <SubsystemCard
                      @click="openSubsystem(system)"
                      :subsystem="system"
                    ></SubsystemCard>
                  </div>
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
                <div class="flex items-center gap-2 cursor-pointer p-2">
                  <component
                    :is="system.icon"
                    class="inline-block w-4 h-4 mr-2"
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
    </UserLayout>
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
import SubsystemCard from "@/components/SubsystemCard.vue";
import { LayoutDashboard } from "lucide-vue-next";

import { useAccountStore } from "@/stores/account";
const accountStore = useAccountStore();

import { useCategoriesStore } from "@/stores/user/categories";
import UserLayout from "@/layouts/UserLayout.vue";
const categoriesStore = useCategoriesStore();

const selectedTabId = ref(null);

const redirectLoadingText = ref("...");

const categories = computed(() => categoriesStore.list);

const systems = computed(() => {
  const selected = categories.value.find((c) => c.id === selectedTabId.value);
  return selected?.systems || [];
});

const redirectLoading = ref(false);

onMounted(async () => {
  await categoriesStore.getCategories();
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
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const token = encodeURIComponent(accountStore.token);
    const { id: system_id, url: system_url } = system;
    const redirect_to_subsystem = `${system_url}?token=${token}`;
    const ssoResponse = await accountStore.ssoStart(system_id);
    if (!ssoResponse?.status) {
      throw new Error(ssoResponse?.message || "เริ่ม SSO ไม่สำเร็จ");
    } else {
      console.log("sso pass");
      redirectLoadingText.value = "กำลังเช็คสิทธิ์การใช้งาน...";
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));

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
      window.open(redirect_to_subsystem, "__blank");
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
