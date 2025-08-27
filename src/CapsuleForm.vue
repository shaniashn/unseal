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
        <button type="submit" @click="checkUser">Send message</button>
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

      const userId = await this.getUser()
      console.log('userid', userId)

      const response = await supabase.from('capsules').insert({
        user_id: userId,
        title: this.title,
        message: this.message,
        to_open_at: this.date,
      })

      if (response.error) {
        console.error('Error sending msg', response.error)
      } else {
        console.log('data capsule created. status code: ', response.status)
        this.status = 'sent'
      }
    },
    async checkUser() {
      // const { data } = await supabase.auth.getUser()
      // console.log('get user response', data.user.id)

      console.log('date', this.date)
      console.log('date split', this.date.split())
      const today = new Date()
      const getdate = today.getDate()
      const getmnth = today.getMonth()
      const getyear = today.getFullYear()
      const todayDate = `${getdate}-${getmnth}-${getyear}`

      console.log('todayDateIs', todayDate)
      // const dateIs = new Date(this.date)
      const getdate2 = today.getDate()
      const getmnth2 = today.getMonth()
      const getyear2 = today.getFullYear()
      const dateIs2 = `${getdate2}-${getmnth2}-${getyear2}`
      console.log('dateIs', dateIs2)

      console.log(todayDate === dateIs2)
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
  //   this.checkUser()
  // },
}
</script>

<style>
.capsule-container form {
  display: flex;
  flex-direction: column;
}
</style>
