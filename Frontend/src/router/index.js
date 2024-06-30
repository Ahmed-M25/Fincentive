import { createRouter, createWebHistory } from 'vue-router'
import Home from '../Pages/Home.vue'
import Login from '../Pages/Login.vue'
import Signup from '../Pages/Signup.vue'
import Dashboard from '../Pages/Dashboard.vue'

const routes = [
  {
    path: '/',
    alias: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
