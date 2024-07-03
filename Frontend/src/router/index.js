import { createRouter, createWebHistory } from "vue-router";
import store from '../store';
import Home from "../Pages/Home.vue";
import Login from "../Pages/Login.vue";
import Signup from "../Pages/Signup.vue";
import Dashboard from "../Pages/Dashboard.vue";
import NotFound from "../Pages/NotFound.vue";

const routes = [
  {
    path: "/",
    alias: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/:notFound(.*)",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  console.log('Navigation Guard:', store.getters['auth/isLoggedIn']); // Debug log
  if (to.meta.requiresAuth && !store.getters['auth/isLoggedIn']) {
    next('/login');
  } else {
    next();
  }
});

export default router;
