<template>
  <AdminLayout>
    <div v-if="categoryLoaded">
      <span class="loading loading-dots"></span>
    </div>
    <div v-else>
      <div class="mb-4">
        <div class="flex flex-col md:flex-row gap-2">
          <form @submit.prevent="onSubmit" class="flex gap-2 items-center">
            <div class="flex flex-col gap-2 md:flex-row">
              <div>
                <input
                  v-model="categoryForm.name"
                  type="text"
                  placeholder="Category name"
                  class="input input-bordered"
                />
              </div>
              <div class="flex">
                <div>
                  <button class="btn btn-success">
                    {{ isEditMode ? "อัพเดต" : "สร้าง" }}
                  </button>
                </div>
                <div>
                  <a @click="clearCategoryForm" class="btn btn-ghost">
                    เคลียค่า
                  </a>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div v-if="categories.length">
        <Table
          :headers="['name', 'created_at', 'created_by', 'updated_at']"
          :rows="categories"
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
import { ref, reactive, onMounted, computed, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";
import { useCategoriesStore } from "@/stores/superadmin/categories";
import Table from "@/components/Table.vue";

const { proxy } = getCurrentInstance();
const router = useRouter();

const categoryLoaded = ref(false);

const categoriesStore = useCategoriesStore();

const categories = computed(() => categoriesStore.list);

const categoryForm = ref({ id: null, name: "" });
const isEditMode = ref(false);

onMounted(async () => {
  categoryLoaded.value = true;

  await categoriesStore.getCategories();

  categoryLoaded.value = false;
  // เช็คว่าหมดอายุ session หรือไม่
  if (categoriesStore.response.statusCode === 403) {
    const errorMsg = categoriesStore.response.message;
    proxy.$alertify
      .alert(errorMsg, () => {
        router.push({ name: "login" });
      })
      .set({ title: "Session หมดอายุ" });
  }
});

const onEdit = (row) => {
  categoryForm.value = { id: row.id, name: row.name };
  isEditMode.value = true;
};

const onDelete = async (row) => {
  proxy.$alertify
    .confirm(`คุณต้องการลบหมวดหมู่ "${row.name}" ใช่หรือไม่?`, async () => {
      const result = await categoriesStore.deleteCategory(row.id);
      proxy.$alertify
        .alert(result.message)
        .set({ title: result.status ? "สำเร็จ" : "ผิดพลาด" });
    })
    .set({ title: "ยืนยันการลบ" });
};

const onSubmit = async () => {
  if (!categoryForm.value.name.trim()) {
    proxy.$alertify.alert("กรุณาระบุชื่อหมวดหมู่");
    return;
  }

  let result;
  if (isEditMode.value) {
    result = await categoriesStore.updateCategory(categoryForm.value.id, {
      name: categoryForm.value.name,
    });
  } else {
    result = await categoriesStore.createCategory({
      name: categoryForm.value.name,
    });
  }

  proxy.$alertify
    .alert(result.message)
    .set({ title: result.status ? "สำเร็จ" : "ข้อผิดพลาด" });

  clearCategoryForm();
};

const clearCategoryForm = () => {
  categoryForm.value = { id: null, name: "" };
  isEditMode.value = false;
};
</script>

<style scoped></style>
