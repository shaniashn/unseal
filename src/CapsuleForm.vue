<template>
  <section v-if="status == sent">
    <div class="sent-text">
      <p>Capsule sent successfully to the future!</p>
      <p>Capsule can be opened on {{ date }}</p>
    </div>
  </section>
  <section class="capsule-form-page" v-else-if="status == editing">
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
        <input type="date" name="date-open" id="date-open" required />
        <button type="submit" @click="sendMsg"></button>
      </form>
    </div>
  </section>
</template>

<script>
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
    sendMsg() {
      if (!this.fieldsCheck) return

      this.loading = true

      console.log('title', this.title)
      console.log('message', this.message)
      console.log('date', this.date)

      // await supabase.
    },
  },
  computed: {
    fieldsCheck() {
      return this.title && this.message && this.date
    },
  },
  mounted() {
    console.log('testt')
  },
}
</script>

<style>
.capsule-container form {
  display: flex;
  flex-direction: column;
}
</style>
