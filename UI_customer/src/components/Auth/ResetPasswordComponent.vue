<!-- src/components/Auth/ResetPasswordComponent.vue -->
<template>
  <div class="reset-password">
    <h2 class="reset-password__title">Reset Your Password</h2>
    <p class="reset-password__description">Enter your registered email address, and we'll send you a link to reset your password.</p>
    <form @submit.prevent="resetPassword" class="reset-password__form">
      <div class="reset-password__form-group">
        <input
          type="email"
          v-model="email"
          class="reset-password__input"
          placeholder="Email"
          required
        />
      </div>
      <button type="submit" class="reset-password__button reset-password__button--primary">Send Reset Link</button>
    </form>

    <div v-if="message" class="reset-password__alert reset-password__alert--success">
      {{ message }}
    </div>

    <div v-if="error" class="reset-password__alert reset-password__alert--error">
      {{ error }}
    </div>

    <p class="reset-password__register-text">
      Back to login page:
      <router-link to="/login" class="reset-password__link">Login Page</router-link>
    </p>
  </div>
</template>

  
  <script>
  import { sendPasswordResetEmail } from 'firebase/auth';
  import { auth } from '../../services/firebase';
  import '../../styles/main.css';
  
  export default {
    data() {
      return {
        email: '',
        message: '',
        error: '',
      };
    },
    methods: {
      async resetPassword() {
        this.message = '';
        this.error = '';
        try {
          await sendPasswordResetEmail(auth, this.email);
          this.message = 'Password reset email sent! Please check your inbox.';
        } catch (error) {
          this.error = 'Error sending reset email. Please check the email entered or try again later.';
          console.error(error);
        }
      },
    },
  };
  </script>
  