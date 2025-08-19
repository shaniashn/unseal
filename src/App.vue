<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './lib/supabaseClient'
import router from './router/routers'

const session = ref()

onMounted(() => {
  // Get initial session
  supabase.auth.getSession().then(({ data, error }) => {
    try {
      session.value = data.session
      console.log('app - session', session.value)
      console.log('app - data', data)
    } catch {
      console.error('Error getting session: ', error)
    }
  })

  // Listen for auth state changes globally
  supabase.auth.onAuthStateChange((event, sessionData) => {
    console.log('Auth state changed:', event, sessionData)
    session.value = sessionData

    if (event === 'SIGNED_OUT') {
      console.log('User signed out - redirecting to auth page')
      router.push('/auth')
    } else if (event === 'SIGNED_IN') {
      console.log('User signed in - redirecting to home page')
      router.push('/home')
    } else if (event === 'INITIAL_SESSION') {
      console.log('User is already signed in - redirecting to home page')
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
}
</style>
