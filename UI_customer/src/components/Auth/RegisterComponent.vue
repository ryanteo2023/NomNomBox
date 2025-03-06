<template>
  <div class="register d-flex justify-content-center align-items-center min-vh-100 bg-light">
    <div class="register__card card p-4 shadow-sm">
      <h2 class="register__title text-center mb-4">Register</h2>
      
      <!-- Show general error message -->
      <div v-if="error" class="register__error alert alert-danger mb-3" role="alert">
        {{ error }}
      </div>

      <form class="register__form" @submit.prevent="handleSubmit">
        <div class="register__form-group mb-3">
          <label for="email" class="register__label form-label">Email:</label>
          <input
            id="email"
            type="email"
            v-model="formData.email"
            class="register__input form-control"
            :class="{ 'is-invalid': emailError }"
            placeholder="Email"
            required
            aria-label="Email"
          />
          <div v-if="emailError" class="register__error alert alert-danger mt-2">
            {{ emailError }}
          </div>
        </div>

        <div class="register__form-group mb-3">
          <label for="displayName" class="register__label form-label">Display Name:</label>
          <input
            id="displayName"
            type="text"
            v-model="formData.displayName"
            class="register__input form-control"
            placeholder="Display Name"
            aria-label="Display Name"
          />
        </div>

        <div class="register__form-group mb-3">
          <label for="password" class="register__label form-label">Password:</label>
          <input
            id="password"
            :type="passwordVisible ? 'text' : 'password'"
            v-model="formData.password"
            class="register__input form-control"
            placeholder="Password"
            required
            aria-label="Password"
          />
          <!-- Show password length error message -->
          <div v-if="passwordLengthError" class="register__error alert alert-danger mt-2">
            Password must be between 6 and 4096 characters.
          </div>
        </div>

        <div class="register__form-group mb-3">
          <label for="confirmPassword" class="register__label form-label">Confirm Password:</label>
          <input
            id="confirmPassword"
            :type="passwordVisible ? 'text' : 'password'"
            v-model="formData.confirmPassword"
            class="register__input form-control"
            placeholder="Confirm Password"
            required
            aria-label="Confirm Password"
          />
          <!-- Show password match error message -->
          <div v-if="passwordMatchError" class="register__error alert alert-danger mt-2">
            Passwords do not match.
          </div>
        </div>

        <button
          type="button"
          class="register__toggle-btn register__button my-3"
          @click="passwordVisible = !passwordVisible"
        >
          {{ passwordVisible ? 'Hide Passwords' : 'Show Passwords' }}
        </button>

        <button 
          type="submit" 
          class="register__button"
          :disabled="isSubmitting || passwordLengthError || passwordMatchError"
        >
          <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
          {{ isSubmitting ? 'Registering...' : 'Register' }}
        </button>
      </form>

      <p class="register__login-link text-center mt-3">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  </div>
</template>

<script>
import { auth, db } from '@/services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import '../../styles/main.css';

export default {
  name: 'RegisterForm',
  data() {
    return {
      formData: {
        email: '',
        password: '',
        confirmPassword: '',
        displayName: '',
      },
      passwordVisible: false,
      isSubmitting: false,
      error: null,
      emailError: null,
    };
  },
  computed: {
    passwordLengthError() {
      const { password } = this.formData;
      return password.length > 0 && (password.length < 6 || password.length > 4096);
    },
    passwordMatchError() {
      const { password, confirmPassword } = this.formData;
      return confirmPassword.length > 0 && password !== confirmPassword;
    }
  },
  methods: {
    clearErrors() {
      this.error = null;
      this.emailError = null;
    },
    getFirebaseErrorMessage(error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          return 'This email is already registered. Please use a different email or try logging in.';
        case 'auth/invalid-email':
          return 'Please enter a valid email address.';
        case 'auth/operation-not-allowed':
          return 'Email/password registration is not enabled. Please contact support.';
        case 'auth/weak-password':
          return 'Please choose a stronger password.';
        case 'auth/network-request-failed':
          return 'Network error. Please check your internet connection and try again.';
        default:
          return 'An error occurred during registration. Please try again.';
      }
    },
    async handleSubmit() {
      if (this.isSubmitting) return;

      this.clearErrors();
      
      // Form validation
      if (!this.formData.email.trim()) {
        this.emailError = 'Email is required';
        return;
      }

      if (this.passwordLengthError || this.passwordMatchError) {
        return;
      }

      this.isSubmitting = true;

      try {
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.formData.email,
          this.formData.password
        );

        // Get the newly created user
        const user = userCredential.user;

        try {
          // Set the user data in Firestore
          await setDoc(doc(db, 'users', user.uid), {
            email: this.formData.email,
            dietaryPreferences: [],
            displayName: this.formData.displayName || '',
            photoURL: user.photoURL || '',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });

          // Registration successful
          this.$router.push({
            path: '/profile',
            query: { welcome: 'true' }
          });
        } catch (firestoreError) {
          console.error('Firestore error:', firestoreError);
          
          // If Firestore fails, delete the auth user to maintain consistency
          try {
            await user.delete();
          } catch (deleteError) {
            console.error('Error deleting auth user after Firestore failure:', deleteError);
          }

          this.error = 'Failed to complete registration. Please try again.';
        }
      } catch (error) {
        console.error('Firebase auth error:', error);
        if (error.code === 'auth/invalid-email') {
          this.emailError = this.getFirebaseErrorMessage(error);
        } else {
          this.error = this.getFirebaseErrorMessage(error);
        }
      } finally {
        this.isSubmitting = false;
      }
    },
  },
  beforeUnmount() {
    // Clear sensitive data
    this.formData = {
      email: '',
      password: '',
      confirmPassword: '',
      displayName: '',
      notifications: false,
    };
  }
}
</script>