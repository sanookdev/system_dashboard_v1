<template>
  <div>
    <AdminLayout>
      <transition name="fade-scale" mode="out-in" appear>
        <ul class="list bg-base-100 rounded-xl shadow-md">
          <li
            class="list-row cursor-pointer hover:bg-base-200 transition-colors"
            v-for="(page, index) in downloadList"
            :key="index"
            @click="openLink(page.link)"
          >
            <div
              class="text-4xl w-10 font-thin opacity-60 flex justify-center tabular-nums"
            >
              {{ index + 1 }}
            </div>
            <div class="list-col-grow">
              <div class="text-xl">{{ page.title }}</div>
              <div class="text-md opacity-60">
                {{ page.description }}
              </div>
            </div>
          </li>
        </ul>
      </transition>
    </AdminLayout>
  </div>
</template>

<script setup>
import AdminLayout from "@/layouts/AdminLayout.vue";

const downloadList = [
  {
    title: "งานบริหาร",
    description: "เอกสารแบบฟอร์มต่างๆ ของงานบริหาร",
    icon: "",
    link: "https://med.tu.ac.th/administration_office/?page_id=164",
  },
  {
    title: "งานบริหารทรัพยากรมนุษย์",
    description: "เอกสารแบบฟอร์มต่างๆ ของงานบริหารทรัพยากรมนุษย์",
    icon: "",
    link: "https://med.tu.ac.th/human_resource/?page_id=816",
  },
  {
    title: "งานวิจัย",
    description: "ประกาศ ทุน ข้อบังคับ ของงานวิจัย",
    icon: "",
    link: "https://med.tu.ac.th/researchoffices/?page_id=841701",
  },
  {
    title: "ศูนย์วิจัยทางคลินิก (CRC)",
    description: "แบบฟอร์ม ประกาศ ของศูนย์วิจัย",
    icon: "",
    link: "https://med.tu.ac.th/researchs-crc/?page_id=1371",
  },
  {
    title: "คณะกรรมการจริยธรรมการวิจัยในคน",
    description: "แบบฟอร์ม ประกาศต่างๆ เกี่ยวกับคณะกรรมการจริยธรรมวิจัยในคน",
    icon: "",
    link: "https://med.tu.ac.th/human-researchs/?page_id=951",
  },
  {
    title: "GCP online",
    description: "ข้อบังคับ และประกาศของทุน GCP",
    icon: "",
    link: "https://med.tu.ac.th/researchoffices/?page_id=841701",
  },
];

const openLink = (url) => {
  if (url) {
    window.open(url, "_blank");
  }
};
</script>

<style scoped></style>
