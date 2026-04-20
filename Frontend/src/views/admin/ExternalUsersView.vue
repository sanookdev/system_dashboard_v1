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
        
        <div class="flex flex-col gap-2 mt-4 p-4 border rounded bg-base-100">
          <h3 class="font-bold">นำเข้าข้อมูลผ่าน Excel</h3>
          <div class="flex gap-4 items-center flex-wrap">
            <button @click="downloadTemplate" class="btn btn-info btn-sm">
              ดาวน์โหลด Template (Excel)
            </button>
            <div class="flex items-center gap-2">
              <input 
                type="file" 
                ref="fileInput" 
                @change="onFileChange" 
                accept=".xlsx, .xls" 
                class="file-input file-input-bordered file-input-sm w-full max-w-xs" 
              />
              <button @click="importExcel" class="btn btn-primary btn-sm" :disabled="!selectedFile">
                นำเข้าข้อมูล
              </button>
            </div>
          </div>
          
          <div v-if="importResult" class="mt-4 p-4 border rounded bg-base-200" :class="importResult.failedList.length ? 'border-error' : 'border-success'">
            <h4 class="font-bold mb-2">สรุปผลการนำเข้า</h4>
            <div class="text-sm mb-2">
              <span class="text-success font-semibold">สำเร็จ: {{ importResult.successList.length }} รายการ</span> <span class="mx-2">|</span>
              <span class="text-error font-semibold">ล้มเหลว: {{ importResult.failedList.length }} รายการ</span>
            </div>
            <div v-if="importResult.failedList.length > 0" class="mt-2 bg-base-100 p-2 rounded">
              <p class="font-semibold text-error text-sm mb-1">รายละเอียดรายการที่ไม่สำเร็จ:</p>
              <ul class="list-disc pl-5 text-sm text-error">
                <li v-for="(item, idx) in importResult.failedList" :key="idx">
                  <strong>{{ item.username }}</strong> - {{ item.reason }}
                </li>
              </ul>
            </div>
          </div>
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
import * as XLSX from "xlsx";

const { proxy } = getCurrentInstance();
const router = useRouter();

const loading = ref(false);
const usersStore = useExternalUsersStore();
const users = computed(() => usersStore.list);

const form = ref({ username: "", password: "", fname: "", lname: "", is_active: true });
const resetPasswordVal = ref("");
const isEditMode = ref(false);

const selectedFile = ref(null);
const fileInput = ref(null);
const importResult = ref(null);

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

const downloadTemplate = () => {
  const ws = XLSX.utils.json_to_sheet([
    { username: "EXT-001", password: "password123", fname: "ชื่อ", lname: "นามสกุล" }
  ]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template");
  XLSX.writeFile(wb, "ExternalUser_Template.xlsx");
};

const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedFile.value = file;
  } else {
    selectedFile.value = null;
  }
};

const importExcel = () => {
  if (!selectedFile.value) return;
  importResult.value = null; // clear previous results
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      
      if (json.length === 0) {
        proxy.$alertify.alert("ไม่พบข้อมูลในไฟล์ Excel");
        return;
      }
      
      const result = await usersStore.importExternalUsers(json);
      proxy.$alertify
        .alert(result.message)
        .set({ title: result.status ? "นำเข้าเสร็จสิ้น" : "ข้อผิดพลาด" });
        
      if (result.status && result.data && result.data.data) {
        importResult.value = result.data.data;
        selectedFile.value = null;
        if (fileInput.value) {
          fileInput.value.value = "";
        }
      }
    } catch (error) {
      console.error(error);
      proxy.$alertify.alert("เกิดข้อผิดพลาดในการอ่านไฟล์ Excel");
    }
  };
  reader.readAsArrayBuffer(selectedFile.value);
};
</script>

<style scoped></style>
