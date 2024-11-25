<template>
    <div class="d-flex justify-center">
      <div>
        <img :src="NotFound" style="width: 40vw" alt="" />
        <h1>Halaman yang kamu cari tidak di temukan</h1>
        <v-btn color="green" class="my-10" block :to="{ name: 'HomePublic' }">Back</v-btn>
      </div>
    </div>
  </template>
  
  <script setup>
  import NotFound from '../../assets/NotFound.svg'
  </script>
  