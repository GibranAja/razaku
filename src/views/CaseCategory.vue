<template>
  <NavbarComponent/>
  <div class="case-category">
    <div class="category-header">
      <div class="header-left">
        <ButtonComponent
          @click="goBack"
          icon="fas fa-arrow-left"
          text="Back"
        />
        <h1>{{ capitalizedCategory }} Cases</h1>
      </div>
      <p class="product-count">{{ caseItems.length }} products</p>
    </div>
    <div v-if="caseItems.length > 0" class="case-grid">
      <CardCatalog
        v-for="(item, index) in caseItems"
        :key="index"
        :image-url="item.imageUrl"
        :title="item.title"
        :description="item.description"
      />
    </div>
    <div v-else class="no-products">
      <p>Products not displayed</p>
    </div>
  </div>
  <FooterComponent/>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NavbarComponent from '../components/NavbarComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import CardCatalog from '@/components/CardCatalog.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';

const route = useRoute();
const router = useRouter();
const category = computed(() => route.params.category);
const capitalizedCategory = computed(() => {
  return category.value.charAt(0).toUpperCase() + category.value.slice(1);
});

const caseItems = ref([]);

const images = import.meta.glob('@/image/casing/**/*.jpg');

onMounted(async () => {
  const categoryImages = Object.keys(images).filter(path => 
    path.includes(`/casing/${category.value}/`)
  );

  for (const imagePath of categoryImages) {
    const imageModule = await images[imagePath]();
    const fileName = imagePath.split('/').pop().split('.')[0];
    caseItems.value.push({
      imageUrl: imageModule.default,
      title: `${capitalizedCategory.value} ${fileName}`,
      description: `This is a ${category.value} case design ${fileName}.`
    });
  }
});

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
.case-category {
  padding: 20px;
  margin-top: 120px;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-left {
  align-items: center;
  gap: 20px;
}

.product-count {
  font-size: 1.2rem;
  font-weight: bold;
  color: #666;
}

.case-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.no-products {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-top: 50px;
}
</style>