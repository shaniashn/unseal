<template>
  <section>
    Hi {{ fullname }}
    <button @click="signOut">Sign Out</button>
    <router-link to="/capsule-form">Create new capsule</router-link>
  </section>
</template>

<script>
import { supabase } from '@/lib/supabaseClient'
// import router from './router/routers'

export default {
  name: 'HomePage',
  data() {
    return {
      fullname: '',
      status: 'editing',
    }
  },
  methods: {
    async signOut() {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('Error signing out: ', error)
      } else {
        console.log('Signed out success')
      }
      // No need to manually redirect here - the global auth state listener in App.vue will handle it
    },
    goToCapsule() {
      // router.push('/capsule-form')
      this.$router.push('/home/capsule-form')
    },
  },
  // async mounted() {
  //   const { data } = await supabase.auth.getUser()

  //   if (data.user) {
  //     // Set fullname from user metadata or email
  //     this.fullname = data.user.user_metadata?.full_name || data.user.email
  //   }

  //   console.log('getUser mounted homepage', data)
  // },
}
</script>
