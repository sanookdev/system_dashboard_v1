<template>
  <AdminLayout>
    <Table
      :headers="['icon', 'name', 'URL']"
      :rows="tableData"
      :edit_button="true"
      :delete_button="true"
      :view_button="true"
      @edit="onEdit"
      @delete="onDelete"
    ></Table>
  </AdminLayout>
</template>

<script setup>
import { ref, reactive } from "vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import Table from "@/components/Table.vue";
const tableData = reactive([
  {
    name: "ระบบบริการงานเทคโน",
    URL: "https://med.tu.ac.th/service-techno-medtu",
    icon: "omega",
  },
  {
    name: "ระบบสวัสดิการยืดหยุ่น / 5000",
    URL: "https://med.tu.ac.th/welfare-employee",
    icon: "hand-coins",
  },
]);

const onEdit = () => {
  console.log("Edit Clicked!");
};
const onDelete = () => {
  console.log("Edit Clicked!");
};
</script>

<style scoped></style>
