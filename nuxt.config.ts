// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import vuetify from 'vite-plugin-vuetify'
import { fileURLToPath } from 'url'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/fonts', '@nuxt/icon', '@nuxt/image',
    async (options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', config => {
        config.plugins?.push(vuetify())
      })
    },
  ],
  build: {
    transpile: ['vuetify'],
  },

  vite: {
    resolve: {
      alias: {
        '@mdi/font': fileURLToPath(new URL('./node_modules/@mdi/font', import.meta.url))
      }
    },
    // Opciones de Vite si necesitas más personalización
    ssr: {
      noExternal: ['vuetify'],
    },
  },

  css: [
    'vuetify/styles',
    // Usa esta ruta
   
    // O esta alternativa
   
  ],


  


})