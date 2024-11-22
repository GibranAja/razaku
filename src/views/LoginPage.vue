<template>
    <NavbarComponent />
  <AuthComponent :isLogin= true />
</template>

<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue';
import AuthComponent from '@/components/AuthComponent.vue'
</script>
