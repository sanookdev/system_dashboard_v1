<template>
  <AdminLayout>
    <div v-if="loading">
      <span class="loading loading-dots"></span>
    </div>
    <div v-else>
      <div class="mb-4">
        <div class="flex flex-col gap-2">
          <form @submit.prevent="onSubmit" class="flex gap-2 items-end flex-wrap">
            <div class="flex flex-col gap-2 md:flex-row items-end">
              <div>
                <label class="label"><span class="label-text">Username (ขึ้นต้นด้วย EXT-)</span></label>
                <input
                  v-model="form.username"
                  type="text"
                  placeholder="EXT-001"
                  class="input input-bordered w-full"
                  :disabled="isEditMode"
                />
              </div>
              <div v-if="!isEditMode">
                <label class="label"><span class="label-text">Password</span></label>
                <input
                  v-model="form.password"
                  type="password"
                  placeholder="Password"
                  class="input input-bordered w-full"
                />
              </div>
              <div>
                <label class="label"><span class="label-text">ชื่อ</span></label>
                <input
                  v-model="form.fname"
                  type="text"
                  placeholder="First name"
                  class="input input-bordered w-full"
                />
              </div>
              <div>
                <label class="label"><span class="label-text">นามสกุล</span></label>
                <input
                  v-model="form.lname"
                  type="text"
                  placeholder="Last name"
                  class="input input-bordered w-full"
                />
              </div>
              <div>
                <label class="label"><span class="label-text">สถานะ</span></label>
                <select class="select select-bordered" v-model="form.is_active">
                  <option :value="true">Active</option>
                  <option :value="false">Inactive</option>
                </select>
              </div>
              <div class="flex gap-2">
                <button class="btn btn-success">
                  {{ isEditMode ? "อัพเดต" : "สร้าง" }}
                </button>
                <a @click="clearForm" class="btn btn-ghost">
                  เคลียค่า
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Reset Password Form -->
      <div v-if="isEditMode" class="mb-4 p-4 border rounded bg-base-200">
        <h3 class="font-bold mb-2">เปลี่ยนรหัสผ่านสำหรับ {{ form.username }}</h3>
        <div class="flex gap-2 items-center">
          <input
            v-model="resetPasswordVal"
            type="password"
            placeholder="New Password"
            class="input input-bordered"
          />
          <button @click="onResetPassword" class="btn btn-warning btn-sm">รีเซ็ตรหัสผ่าน</button>
        </div>
      </div>

      <div v-if="users.length">
        <Table
          :headers="[
            'username',
            'fname',
            'lname',
            'is_active',
            'created_at',
            'updated_at',
          ]"
          :rows="users"
          :edit_button="true"
          :delete_button="true"
          :view_button="false"
          @edit="onEdit"
          @delete="onDelete"
        ></Table>
      </div>
      <div v-else>ไม่มีข้อมูลผู้ใช้งานภายนอก</div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";
import { useExternalUsersStore } from "@/stores/superadmin/external_users";
import Table from "@/components/Table.vue";

const { proxy } = getCurrentInstance();
const router = useRouter();

const loading = ref(false);
const usersStore = useExternalUsersStore();
const users = computed(() => usersStore.list);

const form = ref({ username: "", password: "", fname: "", lname: "", is_active: true });
const resetPasswordVal = ref("");
const isEditMode = ref(false);

onMounted(async () => {
  loading.value = true;
  await usersStore.getExternalUsers();
  loading.value = false;

  if (usersStore.response.statusCode === 403) {
    const errorMsg = usersStore.response.message;
    proxy.$alertify
      .alert(errorMsg, () => {
        router.push({ name: "login" });
      })
      .set({ title: "Session หมดอายุ" });
  }
});

const onEdit = (row) => {
  form.value = { 
    username: row.username, 
    fname: row.fname || "", 
    lname: row.lname || "", 
    is_active: row.is_active 
  };
  resetPasswordVal.value = "";
  isEditMode.value = true;
};

const onDelete = async (row) => {
  proxy.$alertify
    .confirm(`คุณต้องการลบผู้ใช้งาน "${row.username}" ใช่หรือไม่?`, async () => {
      const result = await usersStore.deleteExternalUser(row.username);
      proxy.$alertify
        .alert(result.message)
        .set({ title: result.status ? "สำเร็จ" : "ผิดพลาด" });
    })
    .set({ title: "ยืนยันการลบ" });
};

const onResetPassword = async () => {
  if (!resetPasswordVal.value.trim()) {
    proxy.$alertify.alert("กรุณาระบุรหัสผ่านใหม่");
    return;
  }
  
  const result = await usersStore.resetPassword(form.value.username, resetPasswordVal.value);
  proxy.$alertify
    .alert(result.message)
    .set({ title: result.status ? "สำเร็จ" : "ข้อผิดพลาด" });
    
  if (result.status) {
    resetPasswordVal.value = "";
  }
};

const onSubmit = async () => {
  if (!form.value.username.trim()) {
    proxy.$alertify.alert("กรุณาระบุ Username");
    return;
  }
  
  if (!isEditMode.value && !form.value.password.trim()) {
    proxy.$alertify.alert("กรุณาระบุรหัสผ่านสำหรับผู้ใช้งานใหม่");
    return;
  }

  let result;
  if (isEditMode.value) {
    result = await usersStore.updateExternalUser(form.value.username, {
      fname: form.value.fname,
      lname: form.value.lname,
      is_active: form.value.is_active,
    });
  } else {
    result = await usersStore.createExternalUser({
      username: form.value.username,
      password: form.value.password,
      fname: form.value.fname,
      lname: form.value.lname,
      is_active: form.value.is_active,
    });
  }

  proxy.$alertify
    .alert(result.message)
    .set({ title: result.status ? "สำเร็จ" : "ข้อผิดพลาด" });

  if (result.status) {
    clearForm();
  }
};

const clearForm = () => {
  form.value = { username: "", password: "", fname: "", lname: "", is_active: true };
  resetPasswordVal.value = "";
  isEditMode.value = false;
};
</script>

<style scoped></style>
