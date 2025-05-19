<!-- pages/index.vue -->
<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-primary-700 py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
          <span class="block">Sport & Bien-être</span>
          <span class="block text-secondary-400">Votre blog de santé en français</span>
        </h1>
        <p class="mt-6 max-w-xl mx-auto text-xl text-primary-100">
          Des conseils, des astuces et des guides pour rester en forme et prendre soin de votre santé.
        </p>
        <div class="mt-10 max-w-sm mx-auto flex justify-center">
          <Button
              @click="scrollToLatestPosts"
              size="lg"
              variant="secondary"
          >
            Découvrir les derniers articles
          </Button>
        </div>
      </div>
    </section>

    <!-- Featured Categories -->
    <section ref="categoriesSection" class="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-3xl font-extrabold text-gray-900 text-center">
          Explorez par catégories
        </h2>

        <div class="mt-12">
          <div v-if="isLoadingCategories" class="flex justify-center">
            <Loader2 class="h-8 w-8 text-primary-500 animate-spin" />
          </div>

          <div v-else-if="categories.length === 0" class="text-center text-gray-500">
            Aucune catégorie trouvée.
          </div>

          <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div
                v-for="category in categories"
                :key="category.id"
                class="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <NuxtLink :to="`/categories/${category.slug}`" class="block">
                <div class="h-40 bg-primary-100 relative">
                  <img
                      v-if="category.image"
                      :src="`${pocketbaseUrl}/api/files/categories/${category.id}/${category.image}`"
                      :alt="category.name"
                      class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <FolderIcon class="h-16 w-16 text-primary-300" />
                  </div>
                </div>
                <div class="p-4">
                  <h3 class="text-xl font-semibold text-gray-900">
                    {{ category.name }}
                  </h3>
                  <p v-if="category.description" class="mt-2 text-gray-600">
                    {{ category.description }}
                  </p>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest Posts -->
    <section ref="latestPostsSection" class="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-3xl font-extrabold text-gray-900 text-center">
          Derniers articles
        </h2>

        <div class="mt-12">
          <div v-if="isLoadingPosts" class="flex justify-center">
            <Loader2 class="h-8 w-8 text-primary-500 animate-spin" />
          </div>

          <div v-else-if="posts.length === 0" class="text-center text-gray-500">
            Aucun article trouvé.
          </div>

          <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <PostCard
                v-for="post in posts"
                :key="post.id"
                :post="post"
            />
          </div>

          <div class="mt-12 text-center">
            <NuxtLink
                to="/blog"
                class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              Voir tous les articles
              <ArrowRight class="ml-2 h-5 w-5" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Subscription -->
    <NewsletterBanner />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Loader2, ArrowRight, FolderIcon } from 'lucide-vue-next'
import { useRuntimeConfig } from 'nuxt/app'
import { useBlogStore } from '~/stores/blog'
import PostCard from '~/components/blog/PostCard.vue'
import Button from '~/components/ui/Button.vue'
import NewsletterBanner from "~/components/home/NewsletterBanner.vue";

const runtimeConfig = useRuntimeConfig()
const pocketbaseUrl = computed(() => runtimeConfig.public.pocketbaseUrl)

const blogStore = useBlogStore()
const posts = ref([])
const categories = ref([])
const isLoadingPosts = ref(true)
const isLoadingCategories = ref(true)

const newsletterEmail = ref('')
const subscriptionMessage = ref('')
const isSubscribing = ref(false)

const latestPostsSection = ref(null)
const categoriesSection = ref(null)

onMounted(async () => {
  try {
    isLoadingPosts.value = true
    const response = await blogStore.fetchPosts(1)
    posts.value = response.items.slice(0, 6) // Only show the latest 6 posts
  } catch (error) {
    console.error('Failed to fetch posts:', error)
  } finally {
    isLoadingPosts.value = false
  }

  try {
    isLoadingCategories.value = true
    const categoriesResponse = await blogStore.fetchAllCategories()
    categories.value = categoriesResponse.slice(0, 6) // Only show the first 6 categories
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  } finally {
    isLoadingCategories.value = false
  }
})

function scrollToLatestPosts() {
  latestPostsSection.value.scrollIntoView({ behavior: 'smooth' })
}

function subscribeToNewsletter() {
  if (!newsletterEmail.value.trim()) return

  isSubscribing.value = true

  // Here we would typically send the email to an API
  // But for now, we'll just simulate it
  setTimeout(() => {
    subscriptionMessage.value = 'Merci pour votre inscription ! Vous recevrez bientôt nos actualités.'
    newsletterEmail.value = ''
    isSubscribing.value = false

    // Clear message after a few seconds
    setTimeout(() => {
      subscriptionMessage.value = ''
    }, 5000)
  }, 1000)
}
</script>