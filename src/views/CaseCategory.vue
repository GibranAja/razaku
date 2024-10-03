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
        v-for="item in caseItems"
        :key="item.title"
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

const images = import.meta.glob('@/image/casing/**/*.jpg', { eager: true });

onMounted(async () => {
  const categoryImages = Object.entries(images).filter(([path]) => 
    path.includes(`/casing/${category.value}/`)
  );

  const itemPromises = categoryImages.map(async ([imagePath, imageModule]) => {
    const fileName = imagePath.split('/').pop().split('.')[0];
    return {
      imageUrl: imageModule.default,
      title: `${capitalizedCategory.value} ${fileName}`,
      description: `This is a ${category.value} case design ${fileName}.`
    };
  });

  caseItems.value = await Promise.all(itemPromises);
});

const goBack = () => {
  router.go(-1);
};
</script>


<style scoped>
.case-category {
  padding: 10px;
  margin-top: 120px;
}

.category-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
}

.header-left {
  /* display: flex; */
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.product-count {
  font-size: 1rem;
  font-weight: bold;
  color: #666;
}

.case-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.no-products {
  text-align: center;
  font-size: 1rem;
  color: #666;
  margin-top: 50px;
}

@media (min-width: 768px) {
  .case-category {
    padding: 20px;
  }

  .category-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .header-left {
    margin-bottom: 0;
    gap: 20px;
  }

  .product-count {
    font-size: 1.2rem;
  }

  .case-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
}

@media (min-width: 1024px) {
  .case-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>