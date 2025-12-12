<template>
  <AdminLayout>
    <div class="mb-4 flex items-center justify-end gap-2">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="ค้นหา username..."
        class="input input-bordered w-full max-w-xs"
      />

      <button
        @click="fetchLogs"
        class="btn btn-square btn-info btn-sm btn-outline"
        :disabled="logsLoaded"
        title="Refresh Data"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
          :class="{ 'animate-spin': logsLoaded }"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      </button>
    </div>

    <div v-if="logsLoaded">
      <div class="flex justify-center p-10">
        <span class="loading loading-dots loading-lg"></span>
      </div>
    </div>
    <div v-else>
      <div v-if="filteredLogs.length">
        <Table
          :headers="['id', 'username', 'created_at', 'lastlogin_at']"
          :rows="filteredLogs"
          :view_button="false"
        ></Table>
      </div>
      <div v-else>
        <div class="text-center p-4 border rounded-lg bg-base-100">
          {{ logsList.length ? "ไม่พบข้อมูลที่ค้นหา" : "ไม่มีข้อมูล (Empty)" }}
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import { useLogsStore } from "@/stores/superadmin/loginlogs";
import Table from "@/components/Table.vue";

const logsStore = useLogsStore();
const logsList = computed(() => logsStore.list);
const logsLoaded = ref(false);
const searchQuery = ref("");

// Computed สำหรับกรองข้อมูล
const filteredLogs = computed(() => {
  if (!searchQuery.value) return logsList.value;
  const query = searchQuery.value.toLowerCase();
  return logsList.value.filter(
    (log) => log.username && log.username.toLowerCase().includes(query)
  );
});

// แยกฟังก์ชันดึงข้อมูลออกมา เพื่อให้เรียกใช้ซ้ำได้
const fetchLogs = async () => {
  logsLoaded.value = true;
  try {
    await logsStore.getLogsList();
  } catch (error) {
    console.error("Error fetching logs:", error);
  } finally {
    logsLoaded.value = false;
  }
};

onMounted(async () => {
  // เรียกใช้ฟังก์ชันเดียวกันตอนเริ่มหน้าเว็บ
  await fetchLogs();
});
</script>