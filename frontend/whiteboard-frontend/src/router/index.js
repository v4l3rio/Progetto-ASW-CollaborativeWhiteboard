import { createRouter, createWebHashHistory } from 'vue-router'
import WhiteboardView from '../views/WhiteboardView.vue'
import LoginView from '../views/LoginView.vue'
import AddWhiteboardView from '../views/AddWhiteboardView.vue'

const routes = [
  {
    path: '/',
    name: 'Whiteboard',
    component: WhiteboardView
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
