<template>
  <div
    class="min-h-screen bg-base-200 py-10 px-4 font-sans relative overflow-hidden"
  >
    <div
      class="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"
    ></div>

    <div class="max-w-6xl mx-auto relative z-10">
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-extrabold text-base-content mb-2">
          ศูนย์รับเรื่องร้องเรียนและข้อเสนอแนะ
        </h1>
        <h2 class="text-xl md:text-2xl font-semibold text-primary/80 mb-4">
          ( Complaints and Suggestions Center )
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <a
          href="http://203.131.209.137/main/RiskRegister/#/"
          target="_blank"
          class="group card bg-base-100 border border-error/20 hover:border-error hover:shadow-lg transition-all duration-300 relative overflow-hidden"
        >
          <div
            class="absolute inset-0 bg-error/5 group-hover:bg-error/10 transition-colors"
          ></div>

          <div class="card-body flex flex-row items-start gap-4 relative z-10">
            <div
              class="p-4 rounded-xl bg-error text-white shadow-lg shadow-error/30 group-hover:scale-110 transition-transform mt-1"
            >
              <ShieldAlert class="w-8 h-8" />
            </div>
            <div class="flex-1">
              <h2 class="card-title text-error text-xl mb-0">
                ระบบบริหารความเสี่ยง
              </h2>
              <div class="text-error/80 text-sm font-semibold mb-1">
                Risk Management System
              </div>
              <p class="text-base-content/70 text-sm">
                แจ้งอุบัติการณ์ ความเสี่ยง หรือเหตุฉุกเฉิน
              </p>
              <p class="text-base-content/50 text-sm mt-1">
                Report incidents, risks, or emergencies.
              </p>
            </div>
            <ExternalLink
              class="text-error/50 group-hover:text-error w-5 h-5"
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

          <div class="card-body flex flex-row items-start gap-4 relative z-10">
            <div
              class="p-4 rounded-xl bg-primary text-primary-content shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform mt-1"
            >
              <Megaphone class="w-8 h-8" />
            </div>
            <div class="flex-1">
              <h2 class="card-title text-primary text-xl mb-0">สายตรงคณบดี</h2>
              <div class="text-primary/80 text-sm font-semibold mb-1">
                Dean's Direct Line
              </div>
              <p class="text-base-content/70 text-sm">
                ส่งข้อเสนอแนะเชิงนโยบายถึงผู้บริหารสูงสุด
              </p>
              <p class="text-base-content/50 text-sm mt-1">
                Submit policy recommendations directly to the Dean.
              </p>
            </div>
            <ExternalLink
              class="text-primary/50 group-hover:text-primary w-5 h-5"
            />
          </div>
        </a>
      </div>

      <div class="relative py-4 mb-8">
        <div class="absolute inset-0 flex items-center" aria-hidden="true">
          <div class="w-full border-t border-base-content/10"></div>
        </div>
        <div class="relative flex justify-center text-center">
          <span
            class="bg-base-200 px-4 text-md text-base-content/50 tracking-wider uppercase"
          >
            หน่วยงานและบริการ / Departments & Services
          </span>
        </div>
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
            </div>

            <h3
              class="font-bold text-lg text-base-content group-hover:text-primary transition-colors"
            >
              {{ item.title }}
            </h3>
            <div class="text-sm font-semibold text-primary/70 mb-2">
              {{ item.titleEn }}
            </div>

            <!-- <p class="text-sm text-base-content/70">{{ item.desc }}</p>
            <p class="text-sm text-base-content/50 mt-1">{{ item.descEn }}</p>  -->
            <p class="text-sm text-base-content/70">รายละเอียด (ภาษาไทย)</p>
            <p class="text-sm text-base-content/50 mt-1">
              รายละเอียด (ภาษาอังกฤษ)
            </p>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  ShieldAlert,
  Megaphone,
  ExternalLink,
  GraduationCap,
  UsersRound,
  MessageSquareText,
  LockKeyhole, // ใช้ LockKeyhole แทน HeartHandshake เพื่อสื่อถึง Staff/Private
  ArrowRight,
} from "lucide-vue-next";

const generalChannels = ref([
  {
    title: "ร้องเรียนสำหรับนักศึกษา ป.ตรี",
    titleEn: "Complaints for Undergraduate Students",
    desc: "งานทะเบียน ตารางเรียน-สอบ และหลักสูตร",
    descEn: "Registration, class schedules, and curriculum.",
    icon: GraduationCap, // ส่ง Object Component (ห้ามใส่ "")
    link: "#",
    bgClass: "bg-info/10",
    textClass: "text-info",
  },
  {
    title: "ร้องเรียนสำหรับนักศึกษา ป.โท-เอก",
    titleEn: "Complaints for Graduate Students",
    desc: "งานทะเบียน ตารางเรียน-สอบ และหลักสูตร",
    descEn: "Registration, class schedules, and curriculum.",
    icon: GraduationCap, // ส่ง Object Component (ห้ามใส่ "")
    link: "#",
    bgClass: "bg-info/10",
    textClass: "text-info",
  },
  {
    title: "ร้องเรียนสำหรับแพทย์ประจำบ้าน/ต่อยอด",
    titleEn: "Complaints for Residents and Fellows",
    desc: "ทุน กิจกรรม ชมรม และสวัสดิการนิสิต",
    descEn: "Scholarships, activities, clubs, and student welfare.",
    icon: UsersRound,
    link: "#",
    bgClass: "bg-secondary/10",
    textClass: "text-secondary",
  },
]);
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;700&display=swap");

.font-sans {
  font-family: "Sarabun", ui-sans-serif, system-ui, -apple-system,
    BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
</style>