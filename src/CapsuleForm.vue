<template>
  <div class="capsule-container">
    <form @submit.prevent="">
      <input type="text" id="title-message" v-model="title" placeholder="Write the title here" />
      <input
        type="text"
        id="body-message"
        v-model="message"
        placeholder="Write your message here"
      />

      <span>Open date</span>
      <input type="date" name="date-open" id="date-open" />
    </form>
  </div>
</template>

<script>
export default {
  name: 'CapsuleForm',
  data() {
    return {
      title: '',
      message: '',
    }
  },
}
</script>
