<template>
  <button class="reusable-button" :class="{ 'icon-only': !text }" @click="$emit('click')">
    <i v-if="icon" :class="icon" class="button-icon"></i>
    <span v-if="text" class="button-text">{{ text }}</span>
  </button>
</template>

<script>
export default {
  name: 'ReusableButton',
  props: {
    text: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    }
  },
  emits: ['click']
}
</script>

<style scoped>
.reusable-button {
  background-color: #000033;
  color: #f5f5f5;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  font-size: 1rem;
}

.reusable-button:hover {
  background-color: #000066;
}

.button-icon {
  font-size: 1rem;
  margin-right: 0.7rem;
}

.icon-only .button-icon {
  margin-right: 0;
}

.button-text {
  white-space: nowrap;
}

@media (max-width: 768px) {
  .reusable-button {
    padding: 0.7rem 1.2rem;
  }

  .button-icon {
    font-size: 1.8rem;
  }
}
</style>