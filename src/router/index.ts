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
  {
    path: "/:pathMatch(.*)*",
    component: () => import("../views/InvalidRoute.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}").uid;
  const admin = JSON.parse(localStorage.getItem("admin") || "{}") === true;
  console.log(user);
  if ((to.meta.auth && !admin) || (!to.meta.logged && user)) next("/");
  else next();

  await useFireBase().getData();
  useBlogPost().resizeVar();
});

export default router;
