import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useBlogPost } from "../stores/BlogPost";
import { useFireBase } from "../stores/FireBase";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: {
      auth: false,
    },
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/LogIn.vue"),
    meta: {
      auth: false,
    },
  },
  {
    path: "/createBlog",
    name: "createBlog",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/CreateBlog.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/viewBlog",
    name: "viewBlog",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/ViewBlog.vue"),
    meta: {
      auth: false,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  await useFireBase().getToken();
  const isValidRoute = routes.some((route) => route.path === to.path);
  if (!isValidRoute) next("/");

  if (to.meta.auth && !useFireBase().admin) {
    next("/");
  } else if (!to.meta.auth && useFireBase().user && to.name === "login") {
    next("/");
  } else {
    if (to.name === "home") {
      useFireBase().getData();
      useBlogPost().resizeVar();
    }
    if (to.name === "createBlog" && useBlogPost().Blogs.length === 0) {
      useFireBase().getData();
      useBlogPost().resizeVar();
    }
    if (to.name === "viewBlog" && !useBlogPost().viewBlog.id) {
      router.push("/");
    }
    next();
  }
});

export default router;
