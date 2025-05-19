<!-- pages/categories/index.vue -->
<template>
  <div>
    <div class="bg-white py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Catégories
          </h1>
          <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Explorez nos différentes catégories d'articles sur le sport et le bien-être.
          </p>
        </div>

        <!-- Categories grid -->
        <div class="mt-12">
          <div v-if="isLoading" class="flex justify-center py-10">
            <Loader2 class="h-10 w-10 text-primary-500 animate-spin" />
          </div>

          <template v-else>
            <div v-if="categories.length === 0" class="text-center py-10">
              <FolderIcon class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune catégorie trouvée</h3>
              <p class="mt-1 text-sm text-gray-500">
                Aucune catégorie n'est disponible pour le moment.
              </p>
            </div>

            <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div
                  v-for="category in categories"
                  :key="category.id"
                  class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <NuxtLink :to="`/categories/${category.slug}`" class="block">
                  <div class="h-48 bg-gray-200">
                    <img
                        v-if="category.image"
                        :src="`${pocketbaseUrl}/api/files/categories/${category.id}/${category.image}`"
                        :alt="category.name"
                        class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <FolderIcon class="h-16 w-16 text-gray-400" />
                    </div>
                  </div>

                  <div class="p-4">
                    <h2 class="text-xl font-semibold text-gray-900">
                      {{ category.name }}
                    </h2>
                    <p v-if="category.description" class="mt-2 text-gray-600">
                      {{ category.description }}
                    </p>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'
import { Loader2, FolderIcon } from 'lucide-vue-next'
import { useBlogStore } from '~/stores/blog'

const blogStore = useBlogStore()
const runtimeConfig = useRuntimeConfig()
const pocketbaseUrl = computed(() => runtimeConfig.public.pocketbaseUrl)

const categories = ref([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const response = await blogStore.fetchAllCategories()
    categories.value = response
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  } finally {
    isLoading.value = false
  }
})
</script>