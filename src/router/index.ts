import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useBlogPost } from "../stores/BlogPost";
import { useFireBase } from "../stores/FireBase";
import { getAuth, User } from "@firebase/auth";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: {
      auth: false,
      logged: true,
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LogIn.vue"),
    meta: {
      auth: false,
      logged: false,
    },
  },
  {
    path: "/createBlog",
    name: "createBlog",
    component: () => import("../views/CreateBlog.vue"),
    meta: {
      auth: true,
      logged: true,
    },
  },
  {
    path: "/viewBlog/:blogId",
    name: "viewBlog",
    component: () => import("../views/ViewBlog.vue"),
    meta: {
      auth: false,
      logged: true,
    },
    props: true,
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("../views/InvalidRoute.vue"),
    meta: {
      auth: false,
      logged: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,

  scrollBehavior(_, _2, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { left: 0, top: 0 };
  },
});

router.beforeEach(async (to, _, next) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}").uid;
  const admin = JSON.parse(localStorage.getItem("admin") || "{}") === true;
  if ((to.meta.auth && !admin) || (!to.meta.logged && user)) next("/");
  else next();
});

export default router;
