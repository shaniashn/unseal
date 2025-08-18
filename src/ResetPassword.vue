<template>
  <div v-if="currentStep === 'request'">
    <h1>Reset Password</h1>
    <div v-if="message" :class="messageClass">{{ message }}</div>
    <form @submit.prevent="requestReset">
      <input type="email" v-model="email" placeholder="Email" autocomplete="email" required />
      <button type="submit" :disabled="loading || !email">
        {{ loading ? 'Sending...' : 'Send reset link' }}
      </button>
    </form>
    <div class="back-to-login">
      <a @click="goToLogin" :disabled="loading || !email">Back to login</a>
    </div>
  </div>

  <div v-else-if="currentStep === 'sent'">
    <h1>Check your email</h1>
    <p>
      We've sent a password reset link to <strong>{{ email }}</strong>
    </p>
    <p>Click the link in the email to reset your password.</p>
    <div class="actions">
      <button @click="currentStep = 'request'">Send another email</button>
      <button @click="goToLogin">Back to login</button>
    </div>
  </div>

  <div v-else-if="currentStep === 'reset'">
    <h1>Set up new password</h1>
    <p>Enter your new password below.</p>
    <div v-if="message" :class="messageClass">{{ message }}</div>
    <form @submit.prevent="updatePassword">
      <label for="password">New Password</label>
      <input
        type="password"
        id="password"
        v-model="password"
        placeholder="Enter your new password"
        required
        :disabled="loading"
        minlength="6"
      />
      <label for="confirmPassword">Confirm New Password</label>
      <input
        type="password"
        id="confirmPassword"
        v-model="confirmPassword"
        placeholder="Confirm new password"
        required
        :disabled="loading"
        minlength="6"
      />
      <button type="submit" :disabled="loading || !canSubmit">
        {{ loading ? 'Updating...' : 'Update Password' }}
      </button>
    </form>
  </div>

  <div v-else-if="currentStep === 'success'">
    <h1>Password updated</h1>
    <p>Your password has been successfully updated.</p>
    <p>You can now sign in with your new password.</p>
    <button @click="goToLogin">Go to login</button>
  </div>
</template>

<script setup>
import { supabase } from '@/lib/supabaseClient'
import { ref, computed, watch, onMounted } from 'vue'
import router from './router/routers'

const email = ref('')
const currentStep = ref('request')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const message = ref('')
const messageType = ref('')

const canSubmit = computed(() => {
  return (
    password.value &&
    confirmPassword.value &&
    password.value === confirmPassword.value &&
    password.value.length >= 6
  )
})

const messageClass = computed(() => {
  return messageType.value === 'error' ? 'error-message' : 'success-message'
})

async function checkForRecoverySession() {
  try {
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const type = hashParams.get('type')

    if (type === 'recovery') {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (session && !error) {
        currentStep.value = 'reset'
        console.log('Recovery session detected, showing password reset form')
      } else {
        message.value = 'Invalid or expired reset link. Please request a new one.'
        messageType.value = 'error'
        currentStep.value = 'request'
      }
    }
  } catch (error) {
    console.error('Error checking recovery session:', error)
    currentStep.value = 'request'
  }
}

async function requestReset() {
  if (!email.value) return

  loading.value = true
  message.value = ''

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      message.value = error.message
      messageType.value = 'error'
    } else {
      currentStep.value = 'sent'
    }
  } catch (error) {
    message.value = 'An unexpected error occurred. Please try again.'
    messageType.value = 'error'
    console.error('Error in requestReset:', error)
  }

  loading.value = false
}

async function updatePassword() {
  if (!canSubmit.value) return

  if (password.value !== confirmPassword.value) {
    message.value = 'Passwords do not match'
    messageType.value = 'error'
    return
  }

  loading.value = true
  message.value = ''

  try {
    const { error } = await supabase.auth.updateUser({
      password: password.value,
    })

    if (error) {
      message.value = error.message
      messageType.value = 'error'
    } else {
      currentStep.value = 'success'
      await supabase.auth.signOut()
    }
  } catch (error) {
    message.value = 'An unexpected error occurred. Please try again.'
    messageType.value = 'error'
    console.error('Error in updatePassword:', error)
  }

  loading.value = false
}

function goToLogin() {
  router.push('/auth')
}

// Clear error messages when user starts typing
watch([password, confirmPassword, email], () => {
  if (messageType.value === 'error') {
    message.value = ''
  }
})

// Check for recovery session on component mount
onMounted(() => {
  checkForRecoverySession()
})
</script>

<style scoped></style>
