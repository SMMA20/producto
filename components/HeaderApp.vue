<template>
    <v-app-bar :elevation="2"
     height="60"
     color="blue"
     class="fondo">
        <template v-slot:prepend>
          <v-app-bar-nav-icon></v-app-bar-nav-icon>
        </template>
      
        <v-app-bar-title>BONSAIS PARADISE ⛩️</v-app-bar-title>
        <CarritoCompra></CarritoCompra>
      </v-app-bar>
</template>
<style scoped>
.fondo{
    background-color: rgb(252, 252, 252);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center; 
    
}
</style>