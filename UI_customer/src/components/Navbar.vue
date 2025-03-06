<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/recipes">Recipes</RouterLink>
    <RouterLink to="/plans">Plans</RouterLink>
    <RouterLink to="/contact">Contact</RouterLink>
    <RouterLink to="/chatbot">Chatbot</RouterLink>
    
    <!-- Auth Links -->
    <div class="auth-links">
      <template v-if="isAuthenticated">
        <RouterLink to="/profile">Profile</RouterLink>
        <RouterLink to="/logout">Logout</RouterLink>
      </template>
      <template v-else>
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/register">Register</RouterLink>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'

const isAuthenticated = ref(false)

const checkAuth = () => {
  isAuthenticated.value = !!localStorage.getItem('user')
}

onMounted(() => {
  checkAuth()
  window.addEventListener('storage', checkAuth)
})

onUnmounted(() => {
  window.removeEventListener('storage', checkAuth)
})
</script>

<style scoped>
nav {
  width: 100%;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
  padding: 1rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid #ddd;
  text-decoration: none;
  color: #333;
  transition: color 0.3s ease;
}

nav a:first-of-type {
  border: 0;
}

nav a.router-link-exact-active {
  color: #4CAF50;
  font-weight: 500;
}

.auth-links {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.auth-links a {
  color: #4CAF50;
}

.auth-links a:hover {
  color: #45a049;
}
</style>