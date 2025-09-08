<template>
  <section class="message-section">
    <router-link to="/home" class="back-link">← Back to Home</router-link>

    <div v-if="loading" class="loading">Loading capsule...</div>

    <div v-else-if="capsule" class="capsule-content">
      <h2 class="capsule-title">{{ capsule.title }}</h2>
      <p class="capsule-message">{{ capsule.message }}</p>
      <p class="capsule-date">Open date: {{ formatDate(capsule.to_open_at) }}</p>
    </div>

    <div v-else class="error">Capsule not found or you don't have permission to view it.</div>
  </section>
</template>

<script>
import { supabase } from './lib/supabaseClient'

export default {
  name: 'CapsuleView',
  data() {
    return {
      capsule: null,
      loading: true,
    }
  },
  methods: {
    async fetchCapsule() {
      try {
        const capsuleId = this.$route.params.id

        if (!capsuleId) {
          console.error('No capsule ID provided')
          this.loading = false
          return
        }

        // Get current user to ensure they own this capsule
        const { data: userData, error: userError } = await supabase.auth.getUser()

        if (userError) {
          console.error('Error getting user:', userError)
          this.loading = false
          return
        }

        // Fetch capsule data with user validation
        const { data, error } = await supabase
          .from('capsules')
          .select('*')
          .eq('id', capsuleId)
          .eq('user_id', userData.user.id) // Ensure user owns this capsule
          .single()

        if (error) {
          console.error('Error fetching capsule:', error)
        } else {
          this.capsule = data
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        this.loading = false
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },
  },
  async mounted() {
    await this.fetchCapsule()
  },
}
</script>
