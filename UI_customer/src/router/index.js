import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChatbotView from '../views/ChatbotView.vue'
import LoginPageView from '../views/LoginPageVIew.vue'
import RegistrationPageView from '../views/RegistrationPageView.vue'
import ResetPasswordPageView from '../views/ResetPasswordPageView.vue'
import ProfileSettingsPageView from '../views/ProfileSettingsPageView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/chatbot',
      name: 'chatbot',
      component: ChatbotView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPageView,
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegistrationPageView,
      meta: { requiresGuest: true }
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPasswordPageView,
      meta: { requiresGuest: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileSettingsPageView,
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('user'); // Check if user is logged in

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router
