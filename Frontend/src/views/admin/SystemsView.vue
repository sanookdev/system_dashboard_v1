<template>
  <AdminLayout>
    <div v-if="iconLoading">
      กำลังโหลดข้อมูล <span class="loading loading-dots"></span>
    </div>
    <div v-else>
      <div class="mb-4 mx-auto">
        <form @submit.prevent="onSubmit" class="space-y-4">
          <div class="flex flex-wrap gap-2 items-center">
            <div class="flex flex-col">
              <div class="label">ชื่อระบบ</div>
              <input
                v-model="systemForm.name"
                type="text"
                placeholder="System name"
                class="input input-bordered"
              />
            </div>
            <div class="flex flex-col">
              <div class="label">Link</div>
              <input
                v-model="systemForm.url"
                type="text"
                placeholder="URL"
                class="input input-bordered"
              />
            </div>
            <div class="flex flex-col">
              <div class="label">หน่วยงานเจ้าของระบบ</div>
              <input
                id="systemOwner"
                v-model="systemForm.owner_department"
                type="text"
                placeholder="กรอกชื่อหน่วยงาน.."
                class="input input-bordered"
              />
            </div>
            <div class="flex flex-col">
              <div class="label">หมวดหมู่</div>
              <select
                v-model="systemForm.category_id"
                class="select select-bordered"
              >
                <option disabled value="">เลือกหมวดหมู่</option>
                <option
                  v-if="
                    systemForm.category_id &&
                    !categories.some((c) => c.id === systemForm.category_id)
                  "
                  :value="systemForm.category_id"
                  disabled
                >
                  (หมวดหมู่เดิมถูกลบแล้ว)
                </option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="flex flex-col">
            <div class="label">รายละเอียด</div>
            <textarea
              v-model="systemForm.description"
              placeholder="คำอธิบายระบบ"
              class="textarea textarea-bordered w-full"
            ></textarea>
          </div>

          <!-- ✅ Icon Picker -->
          <div>
            <label class="font-semibold block mb-2">เลือกไอคอน: </label>
            <div class="flex flex-col md:flex-row gap-10">
              <div
                class="grid lg:grid-cols-8 md:grid-cols-6 grid-cols-4 gap-2 max-h-[200px] lg:max-w-[70%] overflow-y-auto bg-white p-4 border my-4 md:my-0"
              >
                <div
                  v-for="icon in iconsList01"
                  :key="icon"
                  class="p-2 border hover:bg-gray-100 cursor-pointer"
                  :class="{
                    'bg-blue-100 border-blue-400': icon === systemForm.icon,
                  }"
                  @click="systemForm.icon = icon"
                >
                  <component :is="icon" class="w-5 h-5 mx-auto" />
                  <div class="text-[10px] truncate text-center mt-1">
                    {{ icon }}
                  </div>
                </div>
              </div>
              <div class="flex flex-col p-10">
                <div
                  class="flex min-w-[30%] justify-center text-sm text-nowrap"
                >
                  ตัวอย่างที่แสดง
                </div>
                <div class="flex min-h-full items-center justify-center">
                  <div class="flex flex-col items-center gap-2">
                    <component :is="systemForm.icon" size="60"></component>
                    <span class="text-green-800 text-xs">{{
                      systemForm.icon
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- ✅ ปุ่มสร้าง/อัปเดต + เคลียค่า -->
          <div class="flex justify-end gap-2">
            <button class="btn btn-success">
              {{ isEditMode ? "อัพเดต" : "สร้าง" }}
            </button>
            <button @click.prevent="clearSystemForm" class="btn btn-ghost">
              เคลียค่า
            </button>
          </div>
        </form>
      </div>
      <div class="divider my-0 py-0"></div>
      <div v-if="systems.length">
        <div class="text-xl text-accent font-semibold underline">
          ระบบงานทั้งหมด
        </div>
        <Table
          :headers="['icon', 'name', 'category', 'url']"
          :rows="systems"
          :edit_button="true"
          :delete_button="true"
          :view_button="true"
          @edit="onEdit"
          @delete="onDelete"
          @view="onView"
        ></Table>
      </div>
      <div v-else>ยังไม่มีข้อมูลระบบ</div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";
import Table from "@/components/Table.vue";
import { useSystemsStore } from "@/stores/superadmin/systems";
import { useCategoriesStore } from "@/stores/superadmin/categories";
import { useAccountStore } from "@/stores/account";
import * as lucideIcons from "lucide-vue-next";

const { proxy } = getCurrentInstance();
const router = useRouter();
const systemsStore = useSystemsStore();
const categoriesStore = useCategoriesStore();
const accountStore = useAccountStore();

const systems = computed(() => systemsStore.list);
const categories = computed(() => categoriesStore.list);

const iconLoading = ref(false);

const systemForm = ref({
  id: null,
  name: "",
  url: "",
  icon: "",
  owner_department: "",
  description: "",
  category_id: "",
});

const isEditMode = ref(false);

const iconsList01 = ref([]);

onMounted(async () => {
  iconLoading.value = true;
  await Promise.all([
    systemsStore.getSystems(),
    categoriesStore.getCategories(),
  ]);

  if (systemsStore.response.statusCode === 403) {
    proxy.$alertify
      .alert(systemsStore.response.message, () => {
        router.push({ name: "login" });
      })
      .set({ title: "Session หมดอายุ" });
  }
  const res = await fetch(
    "https://corsproxy.io/?https://unpkg.com/@iconify-json/lucide@latest/icons.json"
  );
  const data = await res.json();
  iconsList01.value = Object.keys(data.icons);
  iconLoading.value = false;
  console.log("Loaded icons:", iconsList01.value.length);
});

const onEdit = (row) => {
  systemForm.value = {
    id: row.id,
    name: row.name,
    url: row.url,
    icon: row.icon || "Circle",
    owner_department: row.owner_department || "",
    description: row.description || "",
    category_id: row.category_id || "",
  };
  isEditMode.value = true;
};

const onDelete = (row) => {
  proxy.$alertify
    .confirm(`ลบระบบ "${row.name}" ใช่หรือไม่?`, async () => {
      const result = await systemsStore.deleteSystem(row.id);
      proxy.$alertify
        .alert(result.message)
        .set({ title: result.status ? "สำเร็จ" : "ล้มเหลว" });
    })
    .set({ title: "ยืนยันการลบ" });
};

const onView = (row) => {
  const info = `
    <span class = "font-semibold">🔹 ชื่อระบบ:</span> ${row.name}<br>
    <span class = "font-semibold">🔹 รายละเอียดระบบ:</span> ${
      row.description
    }<br>
    <span class = "font-semibold">🔹 URL:</span> ${row.url}<br>
    <span class = "font-semibold">🔹 หน่วยงาน:</span> ${
      row.owner_department
    }<br>
    <span class = "font-semibold">🔹 หมวดหมู่:</span> ${row.category_id}<br>
    <span class = "font-semibold">🔹 คำอธิบาย:</span> ${row.description || "-"}
    <br><span class = "font-semibold">🔹 Icon:</span> ${row.icon}
    <br><span class = "font-semibold">🔹 อัพเดตเมื่อ:</span> ${row.updated_at}
    <br><span class = "font-semibold">🔹 อัพเดตโดย:</span> ${row.updated_by}
  `;
  proxy.$alertify.alert(info).set({ title: "รายละเอียดระบบ" });
};

const onSubmit = async () => {
  if (!systemForm.value.name || !systemForm.value.url) {
    proxy.$alertify
      .alert("กรุณากรอกข้อมูลให้ครบ")
      .set({ title: "แจ้งเตือน !" });
    return;
  }

  const payload = {
    name: systemForm.value.name,
    url: systemForm.value.url,
    icon: systemForm.value.icon,
    owner_department: systemForm.value.owner_department,
    description: systemForm.value.description,
    category_id: systemForm.value.category_id,
  };

  let result;
  if (isEditMode.value) {
    result = await systemsStore.updateSystem(systemForm.value.id, payload);
  } else {
    result = await systemsStore.createSystem(payload);
  }

  proxy.$alertify
    .alert(result.message)
    .set({ title: result.status ? "สำเร็จ" : "ผิดพลาด" });

  clearSystemForm();
};

const clearSystemForm = () => {
  systemForm.value = {
    id: null,
    name: "",
    url: "",
    icon: "",
    owner_department: "",
    description: "",
    category_id: "",
  };
  isEditMode.value = false;
};
</script>
