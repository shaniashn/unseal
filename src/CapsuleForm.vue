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
        <input type="image" :src="image" v-if="image" alt="image" />
        <input type="file" id="imageInput" accept="image/png, image/jpeg" @change="loadImage" />

        <input
          type="text"
          id="title-message"
          v-model="title"
          placeholder="Write the title here"
          value="hello"
          required
        />
        <input
          type="text"
          id="body-message"
          v-model="message"
          placeholder="Write your message here"
          value="hello"
          required
        />

        <span>Open date</span>
        <input
          v-model="date"
          type="date"
          name="date-open"
          id="date-open"
          :min="todayDate"
          value="2025-09-24"
          required
        />
        <button type="submit" @click="sendMsg" :disabled="!fieldsCheck">Send message</button>
      </form>
    </div>
  </section>
</template>

<script>
import { supabase } from './lib/supabaseClient'
import router from './router/routers'

export default {
  name: 'CapsuleForm',
  data() {
    return {
      title: '',
      message: '',
      status: 'editing',
      date: '',
      loading: false,
      image: '',
    }
  },
  methods: {
    async sendMsg() {
      if (!this.fieldsCheck) return
      this.loading = true
      console.log('title', this.title)
      console.log('message', this.message)
      console.log('date', this.date)

      try {
        const userId = await this.getUser()
        const imagePath = await this.uploadImage()

        if (!imagePath) {
          console.log('no image')
          return
        }

        console.log('imgpath', imagePath)

        const response = await supabase.from('capsules').insert({
          user_id: userId,
          title: this.title,
          message: this.message,
          to_open_at: this.date,
          image: imagePath,
        })

        if (response.error) {
          console.error('Error sending msg', response.error)
        } else {
          this.status = 'sent'
          router.push('/home')
        }
      } catch (error) {
        console.error('Error handling image', error)
      }
    },
    async checkUser() {
      try {
        const { data, error } = await supabase.auth.getUser()

        if (error) {
          console.error('Error getting user data', error)
          return null
        }

        console.log('get user response', data.user.id)
        return data.user.id
      } catch (error) {
        console.error('Error in checkUser', error)
        return null
      }
    },
    async getUser() {
      try {
        const { data, error } = await supabase.auth.getUser()

        if (error) {
          console.error('Error getting user data', error)
          return
        }
        return data.user.id
      } catch (error) {
        console.error('Error getting user', error)
        return
      }
    },
    loadImage(event) {
      const reader = new FileReader()

      reader.addEventListener('load', () => {
        this.image = reader.result
      })

      reader.readAsDataURL(event.target.files[0])
    },
    async uploadImage() {
      const input = document.getElementById('imageInput')
      this.image = input.files[0]
      console.log('image ', this.image.name)

      const fileExtension = this.image.name.split('.').pop()

      const newFileName = `${crypto.randomUUID()}.${fileExtension}`

      if (!input.files) {
        return
      }

      try {
        //Upload to Firebase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('capsule_images')
          .upload(`images/${newFileName}`, this.image)

        if (uploadError) {
          console.error('Upload failed:', uploadError)
        } else {
          //Get public URL of the uploaded file
          const { data: publicUrlData } = await supabase.storage
            .from('capsule_images')
            .getPublicUrl(uploadData.path)

          const imagePath = publicUrlData.publicUrl
          console.log('imagePath', imagePath)
          console.log('uploadData.path', uploadData.path)

          return imagePath
        }
      } catch (error) {
        console.error('Error: ', error)
        return error
      }
    },
  },
  computed: {
    fieldsCheck() {
      return this.title && this.message && this.date
    },
    todayDate() {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0') // +1 because getMonth() is 0-indexed
      const day = String(today.getDate() + 1).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
  },
  mounted() {},
}
</script>

<style>
.capsule-container form {
  display: flex;
  flex-direction: column;
}

.capsule-container form input[type='image'] {
  width: 300px;
  height: 300px;
  object-fit: cover;
}
</style>
