<template>
  <div class="login">
    <div class="login__container">
      <div class="login__card">
        <h2 class="login__title">Welcome to HealthyChef!</h2>

        <!-- Email and Password Login Form -->
        <form @submit.prevent="loginWithEmail" class="login__form">
          <div class="login__form-group">
            <label class="login__label" for="email">Email: </label>
            <input
              type="email"
              v-model="email"
              placeholder="Email address"
              class="login__input"
              required
              aria-label="Email"
            />
          </div>

          <div class="login__form-group">
            <label class="login__label" for="password">Password: </label>
            <input
              type="password"
              v-model="password"
              placeholder="Password"
              class="login__input"
              required
              aria-label="Password"
            />
            <p class="login__reset-text">
              Forgot your password? 
              <router-link to="/reset-password" class="login__link">Reset here</router-link>.
            </p>
          </div>
          
          <button type="submit" class="login__button login__button--primary">
            Login
          </button>
        </form>

        <!-- Display error message if it exists -->
        <div v-if="errorMessage" class="login__alert login__alert--error">
          {{ errorMessage }}
        </div>

        <div class="login__text">Or</div>
        
        <!-- Google Login Button -->
        <button @click="loginWithGoogle" class="login__button login__button--google">
          <i class="fab fa-google"></i> Login with Google
        </button>

        <!-- Register Link -->
        <div class="login__register">
          <p class="login__register-text">
            Don't have an account?
            <router-link to="/register" class="login__link">Register Here</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, db, googleProvider, signInWithPopup } from '../../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import '../../styles/main.css';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    getErrorMessage(code) {
      const errorMessages = {
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/user-disabled': 'This account has been disabled. Please contact support.',
        'auth/user-not-found': 'No account found with this email. Please check your email or sign up.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/invalid-login-credentials': 'Invalid login credentials. Please check your email and password.',
        'auth/too-many-requests': 'Too many failed login attempts. Please try again later.',
        'auth/network-request-failed': 'Network error. Please check your internet connection.',
        'auth/popup-closed-by-user': 'Google sign-in was cancelled. Please try again.',
        'auth/operation-not-allowed': 'This login method is not enabled. Please contact support.',
        'auth/requires-recent-login': 'Please log in again to continue.',
        'auth/email-already-in-use': 'An account already exists with this email.',
        'auth/weak-password': 'Password should be at least 6 characters.',
        'auth/missing-password': 'Please enter your password.',
        'auth/invalid-credential': 'Invalid credentials. Please check your email and password.',
        'default': 'An error occurred during login. Please try again.'
      };
      return errorMessages[code] || errorMessages.default;
    },
    async loginWithEmail() {
      try {
        this.errorMessage = ''; // Clear any existing error messages
        await signInWithEmailAndPassword(auth, this.email, this.password);
        this.$router.push('/');
      } catch (error) {
        this.errorMessage = this.getErrorMessage(error.code);
        console.error('Login error:', error);
      }
    },
    async loginWithGoogle() {
      try {
        this.errorMessage = ''; // Clear any existing error messages
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          await setDoc(doc(db, 'users', user.uid), {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            uid: user.uid,
            dietaryPreferences: [],
            notifications: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          console.log('User profile saved to Firestore');
        }

        this.$router.push('/');
      } catch (error) {
        this.errorMessage = this.getErrorMessage(error.code);
        console.error('Google Sign-In error:', error);
      }
    },
  },
};
</script>
