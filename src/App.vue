<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './lib/supabaseClient'
import { useRouter } from 'vue-router'

const session = ref()
const router = useRouter()
const isInitialLoad = ref(true)

onMounted(() => {
  // Get initial session
  supabase.auth.getSession().then(({ data, error }) => {
    try {
      session.value = data.session
    } catch {
      console.error('Error getting session: ', error)
    }
  })

  // Listen for auth state changes globally
  supabase.auth.onAuthStateChange((event, sessionData) => {
    console.log('Auth state changed:', event, 'on path:', router.currentRoute.value.path)
    session.value = sessionData

    if (event === 'INITIAL_SESSION') {
      // Don't redirect on INITIAL_SESSION - user is already where they want to be
      console.log(
        'INITIAL_SESSION detected - staying on current page:',
        router.currentRoute.value.path,
      )
      isInitialLoad.value = false
    } else if (event === 'SIGNED_OUT') {
      console.log('User signed out - redirecting to auth page')
      router.push('/auth')
    } else if (event === 'TOKEN_REFRESHED') {
      console.log('TOKEN_REFRESHED - staying on current page:', router.currentRoute.value.path)
      // Don't redirect on token refresh - user should stay where they are
    } else if (event === 'SIGNED_IN') {
      // Only redirect to home if user is currently on auth page or root
      // This handles the case where user just logged in from the auth form
      const currentPath = router.currentRoute.value.path
      if ((currentPath === '/auth' || currentPath === '/') && !isInitialLoad.value) {
        console.log('User signed in from auth/root - redirecting to home')
        router.push('/home')
      } else {
        console.log('User signed in but already on protected page - staying here:', currentPath)
        isInitialLoad.value = false
      }
    }
  })
})
</script>

<template>
  <router-view />
</template>

<style>
body {
  font-family: 'Montserrat', sans-serif;
  background-color: antiquewhite;
  color: #333333;
}

button,
input,
label {
  color: #333333;
  font-family: 'Montserrat', sans-serif;
}
</style>
