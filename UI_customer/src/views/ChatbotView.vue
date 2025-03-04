<script setup>
import Chatbot from '../components/chatbot.vue'
</script>

<template>
  <div class="chatbot-page">
    <Chatbot />
  </div>
</template>

<style scoped>
.chatbot-page {
  min-height: calc(100vh - 60px); /* Adjust for navbar height */
  background-color: #f5f7fa;
  display: flex;
}
</style> 