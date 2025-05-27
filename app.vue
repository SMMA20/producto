import { ProductoVue } from './.nuxt/components';
<template>
  <v-app>
    <HeaderApp></HeaderApp> 
    <ProductoVue
     class="mt-6"
     :discount="20"></ProductoVue>
  </v-app>
</template>
<script setup>
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css'
    }
  ]
})
</script>