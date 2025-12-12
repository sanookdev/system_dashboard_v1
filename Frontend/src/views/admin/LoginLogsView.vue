<template>
  <AdminLayout>
    <div v-if="logsLoaded">
      <span class="loading loading-dots"></span>
    </div>
    <div v-else>
      <div v-if="logsList.length">
        <Table
          :headers="['id', 'username', 'created_at', 'lastlogin_at']"
          :rows="logsList"
          :view_button="false"
        ></Table>
      </div>
      <div v-else>Empty</div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed, getCurrentInstance } from "vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import { useLogsStore } from "@/stores/superadmin/loginlogs";
import Table from "@/components/Table.vue";

const logsStore = useLogsStore();

const logsList = computed(() => logsStore.list);

const logsLoaded = ref(false);

onMounted(async () => {
  logsLoaded.value = true;
  await Promise.all([logsStore.getLogsList()]);
  console.log(logsList);
  logsLoaded.value = false;
});
</script>

<style scoped></style>
