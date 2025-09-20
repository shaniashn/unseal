<template>
  <section>
    Hi {{ fullname }}
    <button @click="signOut">Sign Out</button>
    <router-link to="/capsule-form">Create new capsule</router-link>
  </section>
  <section class="messages-container">
    <div v-for="message in messages" :key="message.id" class="message-item">
      <!-- <p>{{ message.text }}</p> -->
      <p>{{ message.date }}</p>
      <router-link :to="`/capsule-view/${message.id}`" v-if="message.isLocked">{{
        message.status
      }}</router-link>

      <!-- <router-link :to="`/capsule-view/${message.id}`" v-if="message.isLocked">haha</router-link>

      <div class="locked" v-else>
        <p>Locked</p>
      </div> -->
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
    },
    goToCapsule() {
      this.$router.push('/home/capsule-form')
    },
    async fetchMessagesData() {
      try {
        this.status = Status.LOADING

        const userId = await this.getUserData()
        console.log('userId', userId.data.user.id)

        const { data: msg, error } = await supabase
          .from('capsules')
          .select('*') // Select all fields including title and message
          .eq('user_id', userId.data.user.id)

        if (error) {
          console.log('error:', error)
        } else {
          this.messages = msg.map((data) => {
            console.log('to open at', data.to_open_at)
            console.log('today', this.todayDate)

            return {
              id: data.id,
              date: data.to_open_at,
              // isLocked: this.todayDate > data.to_open_at,
              isLocked: true,
              status: data.isLocked ? Text.LOCKED : Text.UNLOCKED,
            }
          })
        }
      } catch (error) {
        console.error('Error fetching messages', error)
      } finally {
        this.status = Status.SUCCESS
      }
    },
    async getUserData() {
      try {
        const userId = await supabase.auth.getUser()

        return userId
      } catch (error) {
        console.error('Error getting user data:', error)
      }
    },
  },
  computed: {
    todayDate() {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0') // +1 because getMonth() is 0-indexed
      const day = String(today.getDate() + 1).padStart(2, '0')
      return `${year}-${month}-${day}`
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
