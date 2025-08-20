import { createRouter, createWebHistory } from 'vue-router';
import AuthForm from '@/components/AuthForm.vue';
import RootPage from '@/RootPage.vue';
import HomePage from '@/HomePage.vue';
import ResetPassword from '@/ResetPassword.vue';
import CapsuleForm from '@/CapsuleForm.vue';
import { supabase } from '@/lib/supabaseClient'

const routes = [
  {
    name: 'RootPage',
    component: RootPage,
    path: '/'
  },
  {
    name: 'AuthForm',
    component: AuthForm,
    path: '/auth',
  },
  {
    name: 'HomePage',
    component: HomePage,
    path: '/home',
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: 'ResetPassword',
    component: ResetPassword,
    path: '/reset-password',
  },
  {
    name: 'CapsuleForm',
    component: CapsuleForm,
    path: '/capsule-form'
  }
];

const router = createRouter({
  history: createWebHistory(), routes
});

const isAuthenticated = async () => {
  try {
    const { data } = await supabase.auth.getSession()
    console.log('router guard - session data', data)
    return data.session != null
  } catch (error) {
    console.error('Error getting session: ', error)
    return false
  }
}

router.beforeEach(async (to, from, next) => {
  // if the route requires auth and the user is not authenticated, redirect to the auth page
  if (to.meta.requiresAuth && !(await isAuthenticated())) {
    console.log('redirecting to auth page')
    next('/auth')
  }
  // if the route does not require auth or the user is authenticated, allow access to the route
  else {
    next()
  }
})

export default router;
