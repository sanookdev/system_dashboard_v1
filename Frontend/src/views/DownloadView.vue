<template>
  <div>
    <UserLayout>
      <transition name="fade-scale" mode="out-in" appear>
        <ul class="list bg-base-100 rounded-xl shadow-md">
          <li
            class="list-row"
            v-for="(page, index) in downloadList"
            :key="index"
          >
            <div
              class="text-4xl w-10 font-thin opacity-60 flex justify-center tabular-nums"
            >
              {{ index + 1 }}
            </div>
            <div class="list-col-grow">
              <div class="text-xl">{{ page.title }}</div>
              <div class="text-md opacity-60">
                {{ page.description }} link : {{ page.link }}
              </div>
            </div>
            <a
              :href="page.link"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-external-link-icon lucide-external-link"
              >
                <path d="M15 3h6v6" />
                <path d="M10 14 21 3" />
                <path
                  d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                />
              </svg>
            </a>
          </li>
        </ul>
      </transition>
    </UserLayout>
  </div>
</template>

<script setup>
import UserLayout from "@/layouts/UserLayout.vue";

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
</script>

<style scoped>
</style>