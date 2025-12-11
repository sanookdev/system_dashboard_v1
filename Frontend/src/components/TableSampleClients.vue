<script setup>
import { computed, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { mdiEye, mdiTrashCan } from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import TableCheckboxCell from "@/components/TableCheckboxCell.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";

defineProps({
  checkable: Boolean,
});

const mainStore = useMainStore();

const items = computed(() => mainStore.tasks);

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const perPage = ref(5);

const currentPage = ref(0);

const checkedRows = ref([]);

const userIdToDelete = ref(null);

const itemsPaginated = computed(() =>
  items.value.slice(
    perPage.value * currentPage.value,
    perPage.value * (currentPage.value + 1)
  )
);

const numPages = computed(() => Math.ceil(items.value.length / perPage.value));

const currentPageHuman = computed(() => currentPage.value + 1);

const pagesList = computed(() => {
  const pagesList = [];

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }

  return pagesList;
});

const remove = (arr, cb) => {
  const newArr = [];

  arr.forEach((item) => {
    if (!cb(item)) {
      newArr.push(item);
    }
  });

  return newArr;
};

const checked = (isChecked, task) => {
  if (isChecked) {
    checkedRows.value.push(task);
    console.log(checkedRows);
  } else {
    checkedRows.value = remove(checkedRows.value, (row) => row.id === task.id);
  }
};

const openModalDelete = (userId) => {
  isModalDangerActive.value = true;
  userIdToDelete.value = userId;
};

const removeTask = async (taskId) => {
  let result = await mainStore.removeTask(taskId);
  alert(result.message);
  await mainStore.fetchSampleClients();
};
</script>

<template>
  <div>
    <CardBoxModal v-model="isModalActive" title="Sample modal">
      <p>Lorem ipsum dolor sit amet <b>adipiscing elit</b></p>
      <p>This is sample modal</p>
    </CardBoxModal>

    <CardBoxModal
      v-model="isModalDangerActive"
      title="Please confirm"
      button="danger"
      @confirm="removeTask(userIdToDelete)"
      has-cancel
      :user-id="userIdToDelete"
      @close="userIdToDelete = null"
    >
      <p>
        คุณต้องการลบข้อมูลผู้ใช้งาน <b>ID : {{ userIdToDelete }}</b> ?
      </p>
    </CardBoxModal>

    <table>
      <thead>
        <tr>
          <th v-if="checkable">
            <!-- <th /> -->
          </th>
          <th>ลำดับ</th>
          <th>วันที่แจ้ง</th>
          <th>ประเภทของงาน</th>
          <th>ผู้ขอรับบริการ</th>
          <th>หน่วยงาน</th>
          <th>สถานะของงาน</th>
          <th></th>
        </tr>
      </thead>
      <tbody v-if="items.length > 0">
        <tr v-for="(task, index) in itemsPaginated" :key="task.id">
          <TableCheckboxCell
            v-if="checkable"
            @checked="checked($event, task)"
          />
          <td class="text-center">
            {{ currentPage * perPage + index + 1 }}
          </td>
          <td data-label="Created_date">
            {{ task.created_date }}
          </td>
          <td data-label="Typework">
            {{ task.typework_name }}
          </td>
          <td data-label="User_req_name">
            {{ task.user_req_name }} ( {{ task.user_req }})
          </td>
          <td data-label="User_req_department" class="lg:w-50 text-center">
            {{ task.user_req_department }}
          </td>
          <td data-label="Task_status" class="lg:w-50 text-center">
            <div v-if="task.task_status === 1" class="bg-blue-800 rounded-md">
              {{ task.task_status_name }}
            </div>
            <div v-if="task.task_status === 2" class="bg-yellow-600 rounded-md">
              {{ task.task_status_name }}
            </div>
            <div v-if="task.task_status === 3" class="bg-green-600 rounded-md">
              {{ task.task_status_name }}
            </div>
          </td>
          <td class="before:hidden lg:w-1 whitespace-nowrap">
            <BaseButtons type="justify-start lg:justify-end" no-wrap>
              <BaseButton
                color="info"
                :icon="mdiEye"
                small
                @click="isModalActive = true"
              />
              <BaseButton
                color="danger"
                :icon="mdiTrashCan"
                small
                @click="openModalDelete(task.id)"
              />
            </BaseButtons>
          </td>
        </tr>
      </tbody>
    </table>
    <div
      v-if="items.length > 0"
      class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800"
    >
      <BaseLevel>
        <BaseButtons>
          <BaseButton
            v-for="page in pagesList"
            :key="page"
            :active="page === currentPage"
            :label="page + 1"
            :color="page === currentPage ? 'lightDark' : 'whiteDark'"
            small
            @click="currentPage = page"
          />
        </BaseButtons>
        <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
      </BaseLevel>
    </div>
  </div>
</template>
