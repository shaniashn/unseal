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
      <div class="signup-link">
        <span>Don't have an account? <a v-on:click="refreshPage">Sign Up</a></span>
      </div>
      <div class="reset-password-link">
        <span>Forgot password? <a v-on:click="resetPassword">Reset Password</a></span>
      </div>
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

<style scoped>
#signup-form,
#signin-form {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 32px;
  max-width: 400px;
  min-width: 320px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

#signup-form form,
#signin-form form {
  display: grid;
  gap: 8px;
}

#signup-form label,
#signin-form label {
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 6px;
  margin-top: 16px;
}

#signup-form label:first-of-type,
#signin-form label:first-of-type {
  margin-top: 0;
}

#signup-form input,
#signin-form input {
  padding: 12px 16px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.2s ease;
  background-color: #ffffff;
  margin-bottom: 4px;
}

#signup-form input:focus,
#signin-form input:focus {
  outline: none;
  border-color: #333333;
  box-shadow: 0 0 0 2px rgba(51, 51, 51, 0.1);
}

#signup-form button,
#signin-form button {
  background-color: #333333;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 14px 20px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 24px;
  margin-bottom: 16px;
  font-family: 'Montserrat', sans-serif;
}

#signup-form button:hover,
#signin-form button:hover {
  background-color: #222222;
}

#signup-form a,
#signin-form a {
  color: #333333;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.2s ease;
}

#signup-form a:hover,
#signin-form a:hover {
  color: #000000;
}

#signup-form span,
#signin-form span {
  font-size: 14px;
  color: #666666;
  text-align: center;
}

.signup-link,
.reset-password-link {
  margin-top: 12px;
  text-align: center;
}

.reset-password-link {
  margin-top: 8px;
}

#signup-form div[v-if='message'],
#signin-form div[v-if='message'] {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #495057;
  text-align: center;
}
</style>
