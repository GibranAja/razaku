<template>
  <div>
    <RouterView v-if="!authStore.isLoading" />
    <div v-else class="loader-container">
      <div class="loader"></div>
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

.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
}

/* HTML: <div class="loader"></div> */
.loader {
  width: 60px;
  height: 30px;
  display: flex;
  --c:#0000 calc(100% - 5px),#000 calc(100% - 4px) 96%,#0000;
  background:
    radial-gradient(farthest-side at bottom,var(--c)) 0 0,
    radial-gradient(farthest-side at top   ,var(--c)) 100% 100%;
  background-size:calc(50% + 2px) 50%;
  background-repeat: no-repeat;
  animation: l13 2s infinite linear;
}
.loader:before {
  content: "";
  flex: 1;
  background: inherit;
  transform: rotate(90deg);
}
@keyframes l13 {
   100% {transform:rotate(1turn)}
}
</style>