<template>
  <AdminLayout>
    <div v-if="permissionLoaded">
      <span class="loading loading-dots"></span>
    </div>
    <div v-else>
      <div class="mb-4">
        <div class="flex flex-col md:flex-row gap-2">
          <form @submit.prevent="onSubmit" class="flex gap-2 items-center">
            <div class="flex flex-col gap-2 md:flex-row">
              <div>
                <label class="label text-sm">รหัสพนักงาน</label>
                <input
                  v-model="permissionForm.employee_code"
                  type="text"
                  placeholder="Employee Code"
                  class="input input-bordered"
                />
              </div>
              <div>
                <label class="label text-sm" for="role">ระบบ</label>
                <select
                  v-model="permissionForm.system_id"
                  class="select select-bordered"
                >
                  <option disabled value="">เลือกระบบ</option>
                  <option
                    v-for="system in systemList"
                    :key="system.id"
                    :value="system.id"
                  >
                    {{ system.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="label text-sm">กำหนดสิทธิ์</label>
                <select
                  v-model="permissionForm.isAdmin"
                  class="select select-bordered"
                >
                  <option disabled value="">กำหนดสิทธิ์</option>
                  <option :value="true">Admin</option>
                  <option :value="false">User</option>
                </select>
              </div>
              <div class="flex items-end">
                <div>
                  <button class="btn btn-success">
                    {{ isEditMode ? "อัพเดต" : "สร้าง" }}
                  </button>
                </div>
                <div>
                  <a @click="clearPermissionForm" class="btn btn-ghost">
                    เคลียค่า
                  </a>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div v-if="permissionList.length">
        <Table
          :headers="['employee_code', 'system_id', 'system_name', 'isAdmin']"
          :rows="permissionList"
          :edit_button="true"
          :delete_button="true"
          :view_button="false"
          @edit="onEdit"
          @delete="onDelete"
        ></Table>
      </div>
      <div v-else>Empty</div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed, reactive, getCurrentInstance } from "vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import { usePermissionStore } from "@/stores/superadmin/permission";
import { useSystemsStore } from "@/stores/superadmin/systems";
import Table from "@/components/Table.vue";

const permissionStore = usePermissionStore();
const systemStore = useSystemsStore();
const { proxy } = getCurrentInstance();

const permissionList = computed(() => permissionStore.list);
const systemList = computed(() => systemStore.list);

const permissionForm = ref({
  id: null,
  employee_code: "",
  system_id: "",
  isAdmin: false,
});

const permissionLoaded = ref(false);
const isEditMode = ref(false);

onMounted(async () => {
  permissionLoaded.value = true;
  await Promise.all([
    permissionStore.getPermissionList(),
    systemStore.getSystems(),
  ]);
  permissionLoaded.value = false;
});

const formattedPermissions = computed(() =>
  permissionList.value.map((perm) => ({
    ...perm,
    system_name: perm.system?.name || `ID: ${perm.system_id}`,
  }))
);
const onEdit = (row) => {
  permissionForm.value = {
    id: row.id,
    employee_code: row.employee_code,
    system_id: row.system_id,
    isAdmin: row.isAdmin,
  };
  isEditMode.value = true;
};

const onDelete = async (row) => {
  proxy.$alertify
    .confirm(
      `ต้องการลบสิทธิ์ "${row.employee_code}" ของระบบ ${row.system_name} ใช่หรือไม่?`,
      async () => {
        console.log(row);
        // const result = await permissionStore.deletePermission(
        //   permissionForm.value.id,
        //   permissionForm.value.employee_code
        // );
        // proxy.$alertify
        //   .alert(result.message)
        //   .set({ title: result.status ? "สำเร็จ" : "ผิดพลาด" });
      }
    )
    .set({ title: "ยืนยันการลบ" });
};
const onSubmit = async () => {
  try {
    let result;
    if (isEditMode.value) {
      result = await permissionStore.updatePermission(
        permissionForm.value.employee_code,
        permissionForm.value.isAdmin,
        permissionForm.value.system_id
      );
    } else {
      const newPermission = reactive({
        employee_code: permissionForm.value.employee_code,
        system_id: permissionForm.value.system_id,
        isAdmin: permissionForm.value.isAdmin,
      });
      await permissionStore.createPermission(newPermission);
      await permissionStore.getPermissionList();
    }

    proxy.$alertify.alert(permissionStore.response.message).set({
      title: permissionStore.response.status ? "สำเร็จ" : "ข้อผิดพลาด",
    });
    await Promise.all([
      permissionStore.getPermissionList(),
      systemStore.getSystems(),
      clearPermissionForm(),
    ]);
  } catch (error) {
    console.error(error);
    proxy.$alertify.alert("เกิดข้อผิดพลาด");
  }
};

const clearPermissionForm = () => {
  permissionForm.value = {
    id: null,
    employee_code: "",
    system_id: "",
    isAdmin: false,
  };
  isEditMode.value = false;
};
</script>

<style scoped></style>
