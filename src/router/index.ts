import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import LoginView from '@/views/LoginView.vue';
import OrdersView from '@/views/OrdersView.vue';
import OrderDetailView from '@/views/OrderDetailView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/orders'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guestOnly: true }
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrdersView,
      meta: { requiresAuth: true }
    },
    {
      path: '/orders/:id',
      name: 'order-detail',
      component: OrderDetailView,
      meta: { requiresAuth: true }
    }
  ]
});

router.beforeEach((to) => {
  const authStore = useAuthStore();
  authStore.restore();
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return {
      name: 'login',
      query: { redirect: to.fullPath }
    };
  }
  if (to.meta.guestOnly && authStore.isLoggedIn) {
    return {
      name: 'orders'
    };
  }
  return true;
});

export default router;
