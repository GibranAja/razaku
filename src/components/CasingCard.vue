<template>
  <div class="casing-card" @click="$emit('click', casing)">
    <div class="card">
      <div class="card-image-container">
        <img :src="casing.imageBase64" :alt="casing.name" class="card-image">
      </div>
      <div class="card-details">
        <h3 class="card-title">{{ casing.name }}</h3>
        <div class="card-price">
          <span class="original-price" v-if="casing.discount > 0">
            {{ formatCurrency(casing.price) }}
          </span>
          <span class="final-price">
            {{ formatCurrency(casing.finalPrice) }}
          </span>
        </div>
        <div class="card-themes" v-if="casing.themes?.length">
          <span 
            class="theme-tag" 
            v-for="theme in casing.themes" 
            :key="theme"
          >
            {{ theme }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  casing: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(value)
}
</script>

<style scoped>
.casing-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.casing-card:hover {
  transform: scale(1.05);
}

.card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-image-container {
  height: 250px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-details {
  padding: 15px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  margin: 0 0 10px 0;
  font-size: 1.2rem;
}

.card-price {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.original-price {
  text-decoration: line-through;
  color: #888;
}

.final-price {
  font-weight: bold;
  color: #000;
}

.card-themes {
  display: flex;
  gap: 5px;
  margin-top: auto;
}

.theme-tag {
  background-color: #f0f0f0;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
}
</style>