<!-- CardComponent.vue -->
<template>
  <div class="card-container" @click="navigateTo">
    <div class="card">
      <div class="card-image-container">
        <img :src="imageUrl" :alt="title" class="card-image">
        <div class="card-title-container">
          <h2 class="card-title">{{ title }}</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  imageUrl: String,
  title: String
});

const router = useRouter();
  
const navigateTo = () => {
  router.push({
    name: 'caseCategory',
    params: { category: props.title }
  });
};
</script>
  
<style scoped>
.card-container {
  display: flex;
  justify-content: center;
  margin: 5px; /* Reduced margin for mobile */
}

.card {
  position: relative;
  width: 100%;
  max-width: 340px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.card-image-container {
  position: relative;
  width: 100%;
  height: 140px; /* Reduced height for mobile */
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-title-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 25%;
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
  padding: 15px 8px 8px; /* Adjusted padding for mobile */
  display: flex;
  align-items: flex-end;
  transition: height 0.3s ease;
}

.card-title {
  font-size: 0.9rem; /* Smaller font size for mobile */
  font-weight: 600;
  margin: 0;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
}

/* Tablet and up */
@media (min-width: 768px) {
  .card-container {
    margin: 10px;
  }

  .card-image-container {
    height: 180px;
  }

  .card-title-container {
    padding: 20px 10px 10px;
  }

  .card-title {
    font-size: 1.1rem;
  }
}
</style>