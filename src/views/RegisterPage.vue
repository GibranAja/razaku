<template>
    <NavbarComponent />
    <AuthComponent :is-login = false />    
</template>

<script setup>
import AuthComponent from '@/components/AuthComponent.vue';
import NavbarComponent from '@/components/NavbarComponent.vue';
</script>