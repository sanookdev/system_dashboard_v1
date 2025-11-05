<template>
  <div class="overflow-x-auto w-full">
    <table class="table table-zebra w-full">
      <thead>
        <tr>
          <th>#</th>
          <th v-for="(header, index) in headers" :key="index">
            <div v-if="header === 'category'">{{ header }}</div>
            <div v-else>
              {{ header }}
            </div>
          </th>
          <th v-if="hasAnyAction">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in paginatedRows" :key="index">
          <td>{{ index + 1 + (currentPage - 1) * rowsPerPage }}</td>
          <td v-for="(header, colIndex) in headers" :key="colIndex">
            <component
              v-if="header === 'icon'"
              :is="row[header]"
              class="w-5 h-5"
            />
            <span v-else>
              <div v-if="header === 'category'">
                {{ row[header]?.name || "" }}
              </div>
              <div v-else-if="header === 'isAdmin'">
                <div
                  :class="
                    row[header] ? 'badge badge-accent' : 'badge badge-warning'
                  "
                >
                  {{ row[header] ? "Yes" : "No" }}
                </div>
                <div></div>
              </div>
              <div v-else>
                {{ row[header] }}
              </div>
            </span>
            <!-- {{ row.header }} -->
          </td>
          <td v-if="hasAnyAction">
            <div class="flex gap-2 items-center">
              <Pencil
                v-if="edit_button"
                class="btn btn-xs btn-ghost"
                @click="$emit('edit', row)"
              >
                Edit
              </Pencil>
              <Trash2
                v-if="delete_button"
                color="red"
                class="cursor-pointer btn btn-xs btn-ghost"
                @click="$emit('delete', row)"
              />
              <button
                v-if="view_button"
                class="btn btn-sm btn-info"
                @click="$emit('view', row)"
              >
                View
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="mt-4 flex justify-between items-center text-sm">
      <div>
        Showing {{ startItem }}–{{ endItem }} of {{ rows.length }} entries
      </div>
      <div class="join">
        <button
          class="join-item btn btn-sm"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          « Prev
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          class="join-item btn btn-sm"
          :class="{ 'btn-active': currentPage === page }"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
        <button
          class="join-item btn btn-sm"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          Next »
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Pencil } from "lucide-vue-next";
import { computed, ref } from "vue";

const props = defineProps({
  headers: Array,
  rows: Array,
  edit_button: Boolean,
  delete_button: Boolean,
  view_button: Boolean,
});

const rowsPerPage = 5;
const currentPage = ref(1);

const totalPages = computed(() => Math.ceil(props.rows.length / rowsPerPage));

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  return props.rows.slice(start, end);
});

const hasAnyAction = computed(() => {
  return props.edit_button || props.delete_button || props.view_button;
});

const startItem = computed(() => {
  return props.rows.length === 0
    ? 0
    : (currentPage.value - 1) * rowsPerPage + 1;
});

const endItem = computed(() => {
  return Math.min(currentPage.value * rowsPerPage, props.rows.length);
});
</script>
