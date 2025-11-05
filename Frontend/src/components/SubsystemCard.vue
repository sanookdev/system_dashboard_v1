<template>
  <div class="tooltip" :data-tip="subsystem.description">
    <div
      class="cursor-pointer rounded-xl bg-white p-2 transition duration-200 hover:translate-y-[-5px] hover:shadow-sm shadow-accent mx-auto"
    >
      <div
        class="flex flex-col justify-between gap-4 px-3 py-6 w-[240px] h-[200px] md:w-[160px] md:h-[200px] xl:w-[200px] xl:h-[188px]"
      >
        <div class="flex justify-between">
          <div>
            <component
              color="green"
              :is="subsystem.icon"
              class="w-20 h-20 p-4"
            />
          </div>
          <div>
            <ArrowRight />
          </div>
        </div>
        <div class="flex">
          <div class="flex flex-col w-1/2">
            <div class="text-sm text-nowrap">{{ subsystem.name }}</div>
            <div class="text-xs badge text-nowrap badge-accent">
              {{ subsystem.owner_department }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  subsystem: Object,
});

function onClick() {
  // redirect หรือเปิดลิงก์ระบบย่อย พร้อมแนบ token ถ้าต้องการ
  window.open(subsystem.link, "_blank");
}
</script>
