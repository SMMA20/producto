<template>
    <v-card class="product-card mx-auto" max-width="300" elevation="3">
      <div class="discount-badge" v-if="discount > 0">
        <span>{{ discount }}%</span>
      </div>
      
      
      <v-img
        :src="product.image"
        :alt="product.name"
        class="product-image"
        height="200"
        cover
      ></v-img>
      
      <v-card-title class="text-center">{{ product.name }}</v-card-title>
      
      <v-card-text>
        <div class="d-flex justify-space-between align-center">
          <div>
            <p class="text-h6 mb-0">{{ formatPrice(product.price) }}</p>
            <p class="text-caption text-decoration-line-through" v-if="discount > 0">
              {{ formatPrice(originalPrice) }}
            </p>
          </div>
          <v-btn
            color="primary"
            variant="elevated"
            @click="comprarProducto"
            prepend-icon="mdi-cart"
            class="buy-button"
          >
            Comprar
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup>
  import { computed } from 'vue';

  const props = defineProps({
    product: {
      type: Object,
      required: true,
      default: () => ({
        id: 1,
        name: 'Bonsai de cerezo 🌸',
        price: 1000,
        image: 'https://m.media-amazon.com/images/I/61e18KAxftL.jpg',
      })
    },
    discount: {
      type: Number,
      default: 0
    }
  });
  
  const emit = defineEmits(['buy']);
  
  const originalPrice = computed(() => {
    if (props.discount <= 0) return props.product.price;
    return props.product.price * 100 / (100 - props.discount);
  });
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };
  
  const comprarProducto = () => {
    emit('buy', props.product.id);
  };
  </script>
  
  <style scoped>
  .product-card {
    position: relative;
    overflow: visible;
    transition: transform 0.3s;
    top: 200px;
  }
  


  .product-card:hover {
    transform: translateY(-5px);
  }
  
  .product-image {
    transition: transform 0.3s;
  }
  
  .product-card:hover .product-image {
    transform: scale(1.05);
  }
  

  .discount-badge {
    position: absolute;
    top: -15px;
    right: -10px;
    width: 45px;
    height: 45px;
    background-color: #ff5252;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    transform: rotate(45deg);
    z-index: 1;
  }
  
  .discount-badge::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: inherit;
    transform: rotate(45deg);
    z-index: -1;
  }
  
  .discount-badge span {
    transform: rotate(-45deg);
  }
  
  .buy-button {
    transition: all 0.8s;
  }
  
  .buy-button:hover {
    transform: scale(1.1);
  }
  </style>