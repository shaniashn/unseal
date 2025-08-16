<template>
  <section>Hi {{ fullname }}</section>
  <button @click="signOut">Sign Out</button>
</template>

<script>
import { supabase } from '@/lib/supabaseClient'

export default {
  name: 'HomePage',
  data() {
    return {
      fullname: '',
    }
  },
  methods: {
    async signOut() {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('Error signing out: ', error)
      } else {
        console.log('Signed out')
      }
      // No need to manually redirect here - the global auth state listener in App.vue will handle it
    },
  },
  async mounted() {
    const { data } = await supabase.auth.getUser()

    if (data.user) {
      // Set fullname from user metadata or email
      this.fullname = data.user.user_metadata?.full_name || data.user.email
    }

    console.log('getUser mounted homepage', data)
  },
}
</script>
