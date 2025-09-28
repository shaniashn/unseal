<template>
  <section class="message-section">
    <router-link to="/home">Back to home</router-link>
    <div class="capsule-container">
      <div class="loading" v-if="loading">Loading..</div>
      <div class="capsule-content" v-else-if="capsule">
        <div class="capsule-image-container">
          <img :src="capsule.image" alt="capsule" />
        </div>
        <h3 class="capsule-title">{{ capsule.title }}</h3>
        <p class="capsule-message">{{ capsule.message }}</p>
      </div>
      <div class="error" v-else>Capsule not found or you don't have permission to view it.</div>
    </div>
  </section>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { supabase } from './lib/supabaseClient'
import { onMounted, ref } from 'vue'

const route = useRoute()
const capsule = ref('')
const loading = ref('')

async function fetchCapsule() {
  try {
    loading.value = true
    const capsuleId = route.params.id

    if (!capsuleId) {
      console.log('capsule id not found')
      return
    }

    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError) {
      console.error('error getting user', userError)
      return
    }

    const { data, error } = await supabase
      .from('capsules')
      .select()
      .eq('id', capsuleId)
      .eq('user_id', userData.user.id)

    console.log('data', data)

    if (error) {
      console.error('error getting capsule data', error)
    } else {
      capsule.value = data[0]
      console.log('capsule.value: ', capsule.value)
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchCapsule()
})
</script>

<style scoped>
.message-section {
  /* padding: 20px;
  max-width: 600px;
  margin: 0 auto; */

  /* background-color: aqua; */
}

.capsule-container {
  /* padding: 20px; */
  max-width: 600px;
  margin: 0 auto;
}

.capsule-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.capsule-image-container {
  display: grid;
  justify-content: center;
  width: 100%;
}

.capsule-image-container img {
  padding: 20px;
  max-width: 300px;
  height: 300px;
  /* object-fit: cover; */
}

.capsule-title {
  font-size: 24px;
  font-weight: bold;
  /* margin-bottom: 20px; */
  color: #333;
  /* border-bottom: 2px solid #f0f0f0; */
  /* padding-bottom: 10px; */
}

.capsule-message {
  font-size: 16px;
  line-height: 1.6;
  /* margin-bottom: 20px; */
  color: #555;
  text-align: justify;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* .capsule-date {
  font-size: 14px;
  color: #888;
  font-style: italic;
  text-align: right;
  border-top: 1px solid #f0f0f0;
  padding-top: 15px;
} */

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 18px;
}

.error {
  text-align: center;
  padding: 40px;
  color: #d32f2f;
  background-color: #ffebee;
  border-radius: 8px;
  border: 1px solid #ffcdd2;
}
</style>
