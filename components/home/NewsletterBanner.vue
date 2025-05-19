<!-- components/home/NewsletterBanner.vue -->
<template>
  <section class="bg-primary-700 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-3xl font-extrabold text-white sm:text-4xl">
        <span class="block">Recevez des conseils personnalisés</span>
        <span class="block text-secondary-300">directement dans votre boîte mail</span>
      </h2>
      <p class="mt-4 text-lg leading-6 text-primary-100">
        Inscrivez-vous à notre newsletter et recevez chaque semaine des conseils adaptés à votre profil, des programmes d'entraînement personnalisés et des astuces pour maintenir une bonne santé.
      </p>
      <div class="mt-8 flex justify-center">
        <div class="inline-flex rounded-md shadow">
          <NuxtLink
              to="/newsletter"
              class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50"
          >
            S'inscrire à la newsletter
            <ArrowRight class="ml-2 -mr-1 h-5 w-5" />
          </NuxtLink>
        </div>
        <div class="ml-3 inline-flex">
          <NuxtLink
              to="/blog"
              class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-500"
          >
            Parcourir les articles
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ArrowRight } from 'lucide-vue-next'
</script>