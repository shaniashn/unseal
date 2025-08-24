<template>
  <section v-if="status == 'sent'">
    <div class="sent-text">
      <p>Capsule sent successfully to the future!</p>
      <p>Capsule can be opened on {{ date }}</p>
    </div>
  </section>
  <section class="capsule-form-page" v-else-if="status == 'editing'">
    <router-link to="/home">back to home</router-link>
    <div class="capsule-container">
      <form @submit.prevent="">
        <input
          type="text"
          id="title-message"
          v-model="title"
          placeholder="Write the title here"
          required
        />
        <input
          type="text"
          id="body-message"
          v-model="message"
          placeholder="Write your message here"
          required
        />

        <span>Open date</span>
        <input v-model="date" type="date" name="date-open" id="date-open" required />
        <button type="submit" @click="sendMsg">Send message</button>
      </form>
    </div>
  </section>
</template>

<script>
import { supabase } from './lib/supabaseClient'
export default {
  name: 'CapsuleForm',
  data() {
    return {
      title: '',
      message: '',
      status: 'editing',
      date: '',
      loading: false,
    }
  },
  methods: {
    async sendMsg() {
      if (!this.fieldsCheck) return

      this.loading = true

      console.log('title', this.title)
      console.log('message', this.message)
      console.log('date', this.date)

      const userId = this.getUser()

      const { data: capsule, error } = await supabase.from('capsules').insert({
        id: userId,
        title: 'title capsule',
        message: 'message capsule',
        date: this.date,
      })

      if (error) {
        console.error('Error sending msg', error)
      } else {
        console.log('data capsule', capsule)
      }
    },
    async checkUser() {
      const { data } = await supabase.auth.getUser()
      console.log('get user response', data.id)
    },
    async getUser() {
      const { data, error } = await supabase.auth.getUser()

      if (error) {
        console.error('Error getting user data', error)
        return
      }
      return data.user.id
    },
  },
  computed: {
    fieldsCheck() {
      return this.title && this.message && this.date
    },
  },
  // mounted() {
  // console.log('testt')
  // console.log(this.status)
  // this.checkUser()
  // },
}
</script>

<style>
.capsule-container form {
  display: flex;
  flex-direction: column;
}
</style>
