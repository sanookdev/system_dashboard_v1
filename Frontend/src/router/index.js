import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import AdminDashboardView from "@/views/admin/DashboardView.vue";
import PermissionView from "@/views/admin/PermissionView.vue";
import LoginLogsView from "@/views/admin/LoginLogsView.vue";
import AdminCategory from "@/views/admin/CategoryView.vue";
import AdminSystems from "@/views/admin/SystemsView.vue";
import UserDashboard from "@/views/user/DashboardView.vue";
import Downloadpage from "@/views/DownloadView.vue"
import Calendarpage from "@/views/EventCalendar.vue"
import DownloadpageAdmin from "@/views/admin/DownloadView.vue"
import CalendarpageAdmin from "@/views/admin/EventCalendar.vue"
// ✅ import store
import { useAccountStore } from "@/stores/account";
import ComplaintHubView from "@/views/ComplaintHubView.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/superadmin/dashboard",
      name: "superadmin-dashboard",
      component: AdminDashboardView,
      meta: { title: "ภาพรวมระบบ", requiresAuth: true, role: ["admin", "superadmin"] },
    },
    {
      path: "/superadmin/permission",
      name: "superadmin-permission",
      component: PermissionView,
      meta: { title: "สิทธิ์การใช้งาน", requiresAuth: true, role: ["admin", "superadmin"] },
    },
    {
      path: "/superadmin/loginlogs",
      name: "superadmin-login-logs",
      component: LoginLogsView,
      meta: { title: "Login Logs", requiresAuth: true, role: ["admin", "superadmin"] },
    },
    {
      path: "/superadmin/systems",
      name: "superadmin-systems",
      component: AdminSystems,
      meta: { title: "ระบบงาน", requiresAuth: true, role: ["admin", "superadmin"] },
    },
    {
      path: "/superadmin/category",
      name: "superadmin-category",
      component: AdminCategory,
      meta: { title: "หมวดหมู่", requiresAuth: true, role: ["admin", "superadmin"] },
    },
    {
      path: "/dashboard",
      name: "user-dashboard",
      component: UserDashboard,
      meta: { title: "User-Dashboard", requiresAuth: true, role: 'user' }
    },
    {
      path: "/superadmin/downloadpage",
      name: "superadmin-downloadpage",
      component: Downloadpage,
      meta: { title: "Download", requiresAuth: true, role: ["user", "superadmin", "admin"] }
    },
    {
      path: "/user/downloadpage",
      name: "user-downloadpage",
      component: Downloadpage,
      meta: { title: "Download", requiresAuth: true, role: ["user", "superadmin", "admin"] }
    },
    {
      path: "/downloadpage",
      name: "downloadpage",
      component: Downloadpage,
      meta: { title: "Download", requiresAuth: true, role: ["user", "superadmin", "admin"] }
    },
    {
      path: "/eventcalendar",
      name: "event-calendar",
      component: Calendarpage,
      meta: { title: "Event Calendar", requiresAuth: true, role: ["user", "superadmin", "admin"] }
    },
    {
      path: "/downloadpageAdmin",
      name: "downloadpageAdmin",
      component: DownloadpageAdmin,
      meta: { title: "Download", requiresAuth: true, role: ["superadmin", "admin"] }
    },
    {
      path: "/eventcalendarAdmin",
      name: "event-calendarAdmin",
      component: CalendarpageAdmin,
      meta: { title: "Event Calendar", requiresAuth: true, role: ["user", "superadmin", "admin"] }
    },
    {
      path: "/complainthub",
      name: "complaint-hub",
      component: ComplaintHubView,
      meta: { title: "ร้องเรียน" }
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { title: "เข้าสู่ระบบ" },
    },
    {
      path: "/",
      name: "",
      component: LoginView,
      meta: { title: "เข้าสู่ระบบ" },
    },
  ],
});
// ✅ map หน้า home ของแต่ละ role
const roleHome = (role) => {
  if (role === "admin") return { name: "superadmin-dashboard" };
  if (role === "user") return { name: "user-dashboard" };
  return { name: "login" };
};

router.beforeEach((to, from, next) => {
  const accountStore = useAccountStore();

  const isLoggedIn = accountStore.isLoggedIn;     // ใช้ state ที่มีอยู่แล้ว
  const userRole = accountStore.user?.role || ""; // ปรับให้ตรงกับ field จริง

  // ตั้ง title
  if (to.meta?.title) {
    document.title = to.meta.title;
  }

  // ---------- กรณียังไม่ล็อกอิน ----------
  if (!isLoggedIn) {
    // ถ้า route นี้ต้อง login แต่ยังไม่ login → เด้งไป login
    if (to.meta.requiresAuth) {
      // กันลูป: ถ้าเดิมทีก็จะไป login อยู่แล้ว ไม่ต้อง redirect ซ้ำ
      if (to.name !== "login") {
        return next({ name: "login" });
      }
      return next();
    }

    // ถ้าเป็น public route (login, root) → ปล่อยผ่าน
    return next();
  }
  // ---------- ล็อกอินแล้ว ----------
  if (to.name === "login" || to.name === "root") {
    const target = getHomeByRole(userRole);
    if (to.name !== target.name) return next(target);
    return next();
  }

  // ---------- ตรวจ role ----------
  if (to.meta.role) {
    const allowedRoles = Array.isArray(to.meta.role)
      ? to.meta.role
      : [to.meta.role]; // แปลงเป็น array เสมอ

    // ถ้า userRole ไม่อยู่ใน allowedRoles → redirect ไปหน้า home ตัวเอง
    if (!allowedRoles.includes(userRole)) {
      const target = getHomeByRole(userRole);
      if (to.name !== target.name) return next(target);
    }
  }

  // ผ่านทุกเงื่อนไขแล้ว ไปต่อปกติ
  next();
});
// ✅ ฟังก์ชันคืนค่าหน้า home ตาม role
function getHomeByRole(role) {
  if (role === "admin" || role === "superadmin") {
    return { name: "superadmin-dashboard" };
  }
  if (role === "user") {
    return { name: "user-dashboard" };
  }
  return { name: "login" };
}
export default router;
