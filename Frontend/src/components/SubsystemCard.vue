<template>
  <div class="tooltip" :data-tip="subsystem.description">
    <div
      class="cursor-pointer rounded-xl bg-white p-2 transition duration-200 hover:translate-y-[-5px] hover:shadow-sm shadow-accent mx-auto"
    >
      <div
        class="flex flex-col justify-between gap-4 px-3 py-6 w-[240px] h-[200px] md:w-[160px] md:h-[200px] xl:w-[200px] xl:h-[188px]"
      >
        <div class="flex justify-between">
          <div class="flex">
            <div>
              <img
                v-if="subsystem.img_icon"
                :src="`${basePath}${subsystem.img_icon}`"
                class="w-20 h-20 p-4"
                :alt="subsystem.name"
              />

              <component
                v-else
                :is="subsystem.icon"
                color="green"
                class="w-20 h-20 p-4"
              />
            </div>
            <div
              v-if="subsystem.sso"
              class="text-xs badge text-nowrap badge-warning flex justify-end"
            >
              SSO
            </div>
          </div>

          <div>
            <ArrowRight />
          </div>
        </div>
        <div class="flex">
          <div class="flex flex-col w-full gap-1">
            <div class="text-sm truncate">{{ subsystem.name }}</div>

            <div
              class="badge badge-accent h-auto py-1 text-[0.8rem] leading-tight text-center break-words"
            >
              {{ subsystem.owner_department }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const basePath = import.meta.env.VITE_BASE_PATH_PRODUCTION;
defineProps({
  subsystem: Object,
});
function onClick() {
  // redirect หรือเปิดลิงก์ระบบย่อย พร้อมแนบ token ถ้าต้องการ
  window.open(subsystem.link, "_blank");
}
</script>
