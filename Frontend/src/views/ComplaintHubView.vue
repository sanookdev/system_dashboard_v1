<template>
  <div
    class="min-h-screen bg-base-200 py-10 px-4 font-sans relative overflow-hidden"
  >
    <div
      class="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"
    ></div>

    <div class="max-w-6xl mx-auto relative z-10">
      <div class="text-center mb-10">
        <h1 class="text-4xl font-extrabold text-base-content mb-3">
          ศูนย์รับเรื่องร้องเรียนและข้อเสนอแนะ
        </h1>
        <p class="text-base-content/60 text-lg">
          โปรดเลือกหัวข้อหรือหน่วยงานที่ท่านต้องการติดต่อ
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <a
          href="http://203.131.209.137/main/RiskRegister/#/"
          target="_blank"
          class="group card bg-base-100 border border-error/20 hover:border-error hover:shadow-lg transition-all duration-300 relative overflow-hidden"
        >
          <div
            class="absolute inset-0 bg-error/5 group-hover:bg-error/10 transition-colors"
          ></div>
          <div class="card-body flex flex-row items-center gap-4 relative z-10">
            <div
              class="p-4 rounded-xl bg-error text-white shadow-lg shadow-error/30 group-hover:scale-110 transition-transform"
            >
              <ShieldAlert class="w-8 h-8" />
            </div>
            <div>
              <h2 class="card-title text-error text-xl">
                ระบบบริหารความเสี่ยง
              </h2>
              <p class="text-base-content/70 text-sm">
                แจ้งอุบัติการณ์ ความเสี่ยง หรือเหตุฉุกเฉิน
              </p>
            </div>
            <ExternalLink
              class="ml-auto text-error/50 group-hover:text-error"
            />
          </div>
        </a>

        <a
          href="mailto:meddeantu@gmail.com"
          target="_blank"
          class="group card bg-base-100 border border-primary/20 hover:border-primary hover:shadow-lg transition-all duration-300 relative overflow-hidden"
        >
          <div
            class="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"
          ></div>
          <div class="card-body flex flex-row items-center gap-4 relative z-10">
            <div
              class="p-4 rounded-xl bg-primary text-primary-content shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform"
            >
              <Megaphone class="w-8 h-8" />
            </div>
            <div>
              <h2 class="card-title text-primary text-xl">สายตรงคณบดี</h2>
              <p class="text-base-content/70 text-sm">
                ส่งข้อเสนอแนะเชิงนโยบายถึงผู้บริหารสูงสุด
              </p>
            </div>
            <ExternalLink
              class="ml-auto text-primary/50 group-hover:text-primary"
            />
          </div>
        </a>
      </div>

      <div
        class="divider text-base-content/30 text-sm font-light tracking-widest uppercase"
      >
        หน่วยงานและบริการ
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <a
          v-for="(item, idx) in generalChannels"
          :key="idx"
          :href="item.link"
          target="_blank"
          class="card bg-base-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-base-200 group relative"
        >
          <div class="card-body p-6 relative z-10">
            <div class="flex justify-between items-start mb-4">
              <div :class="`p-3 rounded-lg ${item.bgClass} ${item.textClass}`">
                <component :is="item.icon" class="w-6 h-6" />
              </div>
              <span class="badge badge-ghost text-xs font-light"
                >Student & General</span
              >
            </div>
            <h3
              class="font-bold text-lg mb-1 group-hover:text-primary transition-colors"
            >
              {{ item.title }}
            </h3>
            <p class="text-sm text-base-content/60">{{ item.desc }}</p>
          </div>
        </a>
      </div>

      <a
        href="#"
        target="_blank"
        class="card bg-neutral/5 border border-neutral/10 hover:bg-white hover:border-neutral hover:shadow-lg transition-all duration-300 group mt-4"
      >
        <div
          class="card-body p-6 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div class="flex items-center gap-4">
            <div
              class="p-3 bg-neutral text-neutral-content rounded-full shadow-md"
            >
              <HeartHandshake class="w-6 h-6" />
            </div>
            <div>
              <h3 class="font-bold text-lg text-neutral-focus">
                สำหรับบุคลากร (Staff Only)
              </h3>
              <p class="text-sm text-base-content/60">
                ช่องทางร้องเรียนภายใน สวัสดิการ และงาน HR
              </p>
            </div>
          </div>
          <div
            class="flex items-center gap-2 text-neutral text-sm font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform"
          >
            ไปหน้าร้องเรียน
            <ArrowRight class="w-4 h-4" />
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// ข้อมูลสำหรับกลุ่มทั่วไป
const generalChannels = ref([
  {
    title: "ร้องเรียนบริการการศึกษา",
    desc: "งานทะเบียน ตารางเรียน-สอบ และหลักสูตร",
    icon: "GraduationCap", // ส่งตัวแปร Component โดยตรง (ไม่ต้องใส่เครื่องหมายคำพูด "")
    link: "#",
    bgClass: "bg-info/10", // ปรับ Syntax เป็น /10 เพื่อคุม Opacity ได้ชัวร์กว่า
    textClass: "text-info",
  },
  {
    title: "ร้องเรียนงานกิจ",
    desc: "ทุน กิจกรรม ชมรม และสวัสดิการนิสิต",
    icon: "UsersRound", // ส่งตัวแปร Component
    link: "#",
    bgClass: "bg-secondary/10",
    textClass: "text-secondary",
  },
  {
    title: "ข้อเสนอแนะ",
    desc: "แจ้งข้อเสนอแนะเพิ่มเติม",
    icon: "MessageSquareText", // ส่งตัวแปร Component
    link: "#",
    bgClass: "bg-accent/10",
    textClass: "text-accent",
  },
]);
</script>

<style scoped>
/* Google Font */
@import url("https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;700&display=swap");

.font-sans {
  font-family: "Sarabun", sans-serif;
}
</style>