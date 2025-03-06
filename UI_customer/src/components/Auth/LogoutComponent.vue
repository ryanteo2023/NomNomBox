<template>
  <div class="logout">
    <div class="logout__container">
      <div class="logout__card">
        <!-- Loading State -->
        <div v-if="isLoading" class="logout__content">
          <div class="logout__spinner"></div>
          <p class="logout__message">Logging out, please wait...</p>
        </div>

        <!-- Error State -->
        <div v-if="error" class="logout__content">
          <div class="logout__alert logout__alert--error">
            {{ error }}
          </div>
          <button @click="retryLogout" class="logout__button">
            Try Again
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from '@/services/firebase';
import '../../styles/main.css';

export default {
  data() {
    return {
      isLoading: true,
      error: null
    };
  },
  methods: {
    async retryLogout() {
      this.error = null;
      this.isLoading = true;
      await this.performLogout();
    },
    async performLogout() {
      try {
        await auth.signOut();
        this.$router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
        this.error = 'Failed to log out. Please try again.';
        this.isLoading = false;
      }
    }
  },
  async created() {
    await this.performLogout();
  }
};
</script>