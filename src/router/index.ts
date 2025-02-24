import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Login from '@/views/Login.vue';
import ChatList from '@/views/ChatList.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', component: Login },
  { path: '/chats', component: ChatList, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const isAuth = !!localStorage.getItem('matrix_access_token');

  if (to.meta.requiresAuth && !isAuth) {
    next('/login');
  } else {
    next();
  }
});

export default router;
