<template>
  <div>
    <RouterView v-if="!authStore.isLoading" />
    <div v-else>
      Loading... <!-- Atau komponen loading yang lebih bagus -->
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/store/AuthStore.js'
import { RouterView } from 'vue-router'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initializeAuthState()
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap');

body {
  margin: 0;
  padding: 0;
  font-family: 'Lato', sans-serif;
}
</style>
