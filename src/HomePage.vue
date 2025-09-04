<template>
  <section>
    Hi {{ fullname }}
    <button @click="signOut">Sign Out</button>
    <router-link to="/capsule-form">Create new capsule</router-link>
  </section>
  <section class="messages-container">
    <div v-for="message in messages" :key="message.id" class="message-item">
      <p>{{ message.text }}</p>
      <p>{{ message.date }}</p>
    </div>
  </section>
</template>

<script>
import { supabase } from '@/lib/supabaseClient'

const Status = Object.freeze({
  EDITING: 'editing',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
})

const Text = Object.freeze({
  LOCKED: 'To be open at:',
  UNLOCKED: 'Opened',
})

export default {
  name: 'HomePage',
  data() {
    return {
      fullname: '',
      status: Status.EDITING,
      message: {
        id: '',
        isLocked: false,
        text: Text.LOCKED,
        date: '',
      },
      messages: [],
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
    async fetchMessagesData() {
      try {
        this.status = Status.LOADING

        const { data: msg, error } = await supabase.from('capsules').select()

        if (error) {
          console.log(error)
        } else {
          console.log('msg: ', msg)
        }

        msg.forEach((data) => {
          this.messages.push({
            id: data.id,
            date: data.to_open_at,
            isLocked: false,
            // text: data.is_locked ? Text.LOCKED : Text.UNLOCKED,
            text: Text.UNLOCKED,
          })
        })
      } catch (error) {
        console.error('Error fetching messages', error)
      } finally {
        this.status = Status.SUCCESS
      }
    },
  },
  async mounted() {
    await this.fetchMessagesData()
  },
}
</script>

<style>
.messages-container {
  display: flex;
  flex-wrap: wrap;
}

.message-item {
  background-color: white;
  padding: 25px;
  margin: 10px;
}
</style>
