// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Blog Sport & Bien-être',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Blog français sur le sport et le bien-être'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  runtimeConfig: {
    public: {
      pocketbaseUrl: process.env.POCKETBASE_URL || 'http://127.0.0.1:8090'
    }
  },

  css: [
    '@/assets/css/main.css',
  ],
  ssr: false,
  modules: [
    '@nuxt/scripts',
    '@nuxtjs/tailwindcss',
    'nuxt-lucide-icons',
    'nuxt-headlessui',
    '@pinia/nuxt'
  ]
})