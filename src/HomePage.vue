<template>
  <section>
    Hi {{ fullname }}
    <button @click="signOut">Sign Out</button>
    <router-link to="/capsule-form">Create new capsule</router-link>
  </section>
  <section class="messages-container">
    <div v-for="message in messages" :key="message" class="message-item">
      <p>{{ message.text }}</p>
      <p>{{ message.date }}</p>
    </div>
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
      message: {
        id: '',
        isOpened: false,
        text: 'To be open at:',
        date: '',
      },
      messages: [
        {
          id: '',
          isOpened: false,
          text: 'To be open at:',
          date: '',
        },
        {
          id: '',
          isOpened: false,
          text: 'To be open at:',
          date: '',
        },
      ],
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
  async mounted() {},
}
</script>
