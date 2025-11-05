<template>
  <div>
    <UserLayout>
      <div class="flex flex-col gap-10">
        <div role="tablist" class="tabs tabs-border">
          <a role="tab" class="tab">ระบบงานพื้นฐาน</a>
          <a role="tab" class="tab tab-active"
            >ระบบงานเฉพาะส่วนสำหรับหน่วยงาน</a
          >
          <a role="tab" class="tab">ระบบสวัสดิการบุคลากร</a>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-5 item gap-6">
          <div
            v-for="system in systems"
            :key="system.id"
            class="flex justify-center items-center"
          >
            <!-- <SubsystemCard :subsystem="system"></SubsystemCard> -->
            <div>
              <IconCard :subsystem="system"></IconCard>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import UserLayout from "@/layouts/UserLayout.vue";
import SubsystemCard from "@/components/SubsystemCard.vue";
import IconCard from "@/components/IconCard.vue";

const systems = reactive([
  {
    id: 1,
    icon: "User",
    name: "ระบบ Profile",
    description: "More detail system 1",
  },
  {
    id: 2,
    icon: "Settings",
    name: "ระบบ Setting",
    description: "More detail system 2",
  },
  {
    id: 2,
    icon: "Funnel",
    name: "ระบบ สถิติ",
    description: "More detail system 2",
  },
  {
    id: 2,
    icon: "Book-image",
    name: "ระบบ image",
    description: "More detail system 2",
  },
  {
    id: 2,
    icon: "File",
    name: "ระบบ File",
    description: "More detail system 2",
  },
  {
    id: 2,
    icon: "Folder-open",
    name: "ระบบ Folder",
    description: "More detail system 2",
  },
  {
    id: 2,
    icon: "Edit",
    name: "ระบบ Edit",
    description: "More detail system 2",
  },
]);
</script>

<style scoped></style>
