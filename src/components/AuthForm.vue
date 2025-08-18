<template>
  <div id="signup-form" v-if="isRegister">
    <form action="submit" @submit.prevent="handleSubmit">
      <div v-if="message">{{ message }}</div>
      <label for="username">Username</label>
      <input
        type="text"
        id="username"
        name="username"
        v-model="signUpFormData.username"
        autocomplete="username"
        required
      />
      <label for="email">Email</label>
      <input
        type="email"
        name="email"
        id="email"
        v-model="signUpFormData.email"
        autocomplete="email"
        required
      />
      <label for="password">Password</label>
      <input
        type="password"
        name="password"
        id="password"
        v-model="signUpFormData.password"
        autocomplete="new-password"
      />

      <label for="full_name">Full Name</label>
      <input
        type="text"
        name="full_name"
        id="full_name"
        v-model="signUpFormData.full_name"
        autocomplete="name"
        required
      />

      <button type="submit">Sign Up</button>
      <span>Already have an account? <a v-on:click="refreshPage">Sign In</a></span>
    </form>
  </div>

  <div id="signin-form" v-if="!isRegister">
    <form action="submit" @submit.prevent="handleSubmit">
      <div v-if="message">{{ message }}</div>
      <!-- <label for="username">Username</label>
      <input
        type="text"
        id="username"
        name="username"
        v-model="signInFormData.username"
        autocomplete="username"
        required
      /> -->
      <label for="email">Email</label>
      <input
        type="email"
        name="email"
        id="email"
        v-model="signInFormData.email"
        autocomplete="email"
        required
      />
      <label for="password">Password</label>
      <input
        type="password"
        name="password"
        id="password"
        v-model="signInFormData.password"
        autocomplete="new-password"
      />
      <button type="submit">Sign In</button>
      <span>Don't have an account? <a v-on:click="refreshPage">Sign Up</a></span>
      <span>Forgot password? <a v-on:click="resetPassword">Reset Password</a></span>
    </form>
  </div>
</template>

<script>
import { supabase } from '@/lib/supabaseClient'
import router from '@/router/routers'

export default {
  data() {
    return {
      email: '',
      password: '',
      username: '',
      full_name: '',
      isRegister: false,
      message: '',
      signInFormData: {
        email: '',
        password: '',
      },
      signUpFormData: {
        email: '',
        password: '',
        username: '',
        full_name: '',
      },
    }
  },
  methods: {
    async handleSubmit() {
      try {
        if (this.isRegister) {
          const response = await supabase.auth.signUp({
            email: this.signUpFormData.email,
            password: this.signUpFormData.password,
            options: {
              data: {
                username: this.signUpFormData.username,
                full_name: this.signUpFormData.full_name,
                avatar_url: this.signUpFormData.avatar_url,
              },
            },
          })

          if (!response.error) {
            console.log('Response: ', response)
            this.message = `Response is ${response}`

            router.push('/home')
          } else {
            console.error('Error: ', response.error)
          }
        }

        if (!this.isRegister) {
          const response = await supabase.auth.signInWithPassword({
            email: this.signInFormData.email,
            password: this.signInFormData.password,
          })

          if (!response.error) {
            console.log('AuthForm - Response: ', response)
            this.message = `Response is ${response}`
            // No need to manually redirect - global auth state listener will handle it
          } else {
            console.error('Sign in error: ', response.error)
          }

          // console.log('AuthForm - Response: ', response)
        }
      } catch (error) {
        console.error(`An unexpected error occured: ${error}`)
      }
    },
    refreshPage() {
      this.isRegister = !this.isRegister
    },
    resetPassword() {
      router.push('/reset-password')
    },
  },
  props: {
    user: {
      username: '',
    },
  },
  mounted() {
    console.log('AuthForm')
  },
}
</script>
