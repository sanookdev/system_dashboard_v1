<template>
  <div>
    <UserLayout>
      <div class="font-regular text-2xl">ตารางแสดงกิจกรรมคณะแพทยศาสตร์</div>
      <transition name="fade-scale" mode="out-in" appear>
        <!-- This Calendar -->
        <div class="calendar-container">
          <iframe
            src="https://calendar.google.com/calendar/embed?src=en.th%23holiday%40group.v.calendar.google.com&ctz=Asia%2FBangkok"
            width="100%"
            height="100%"
            frameborder="0"
            scrolling="no"
          ></iframe>
        </div>
      </transition>
    </UserLayout>
  </div>
</template>

<script setup>
import UserLayout from "@/layouts/UserLayout.vue";
</script>

<style scoped>
.calendar-container {
  /* กำหนดความสูงของปฏิทินให้เหมาะสม */
  height: 80vh;
  width: 100%;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* ถ้าอยากให้ iframe เต็มพื้นที่ container เสมอ */
iframe {
  width: 100%;
  height: 100%;
  border: none !important;
}
</style>
