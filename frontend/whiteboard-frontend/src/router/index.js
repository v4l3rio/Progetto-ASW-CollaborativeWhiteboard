import { createRouter, createWebHashHistory } from 'vue-router'
import WhiteboardView from '../views/WhiteboardView.vue'
import LoginView from '../views/LoginView.vue'
import AddWhiteboardView from '../views/AddWhiteboardView.vue'
import HomepageComponent from "@/components/HomepageComponent.vue";
import UserProfileView from '../views/UserProfileView.vue'
import NotificationPageComponent from "@/components/NotificationPageComponent.vue";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomepageComponent
  },
  {
    path: '/whiteboard/:id',
    name: 'Whiteboard',
    component: WhiteboardView,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/addWhiteboard',
    name: 'Files',
    component: AddWhiteboardView
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: UserProfileView
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: NotificationPageComponent
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to) =>{
  document.title = to.name;
})

export default router
