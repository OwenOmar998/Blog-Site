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
    path: "/viewBlog:blogId",
    name: "viewBlog",
    component: () => import("../views/ViewBlog.vue"),
    meta: {
      auth: false,
      logged: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const user = JSON.parse(localStorage.getItem("user") ?? "");
  const admin = JSON.parse(localStorage.getItem("admin") ?? "");
  const isValidRoute = routes.some((route) => route.path === to.path);
  if (!isValidRoute) next("/");
  else {
    await useFireBase().getData();
    useBlogPost().resizeVar();
    if ((to.meta.auth && !admin) || (!to.meta.logged && user)) next("/");
    else next();
  }
});

export default router;
