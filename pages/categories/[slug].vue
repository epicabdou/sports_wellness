<!-- pages/categories/[slug].vue -->
<template>
  <div>
    <div v-if="isLoading" class="flex justify-center py-20">
      <Loader2 class="h-12 w-12 text-primary-500 animate-spin" />
    </div>

    <div v-else-if="error" class="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <AlertCircle class="h-5 w-5 text-red-400" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Erreur</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ error }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-8 text-center">
        <button
            @click="$router.push('/categories')"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Retour aux catégories
        </button>
      </div>
    </div>

    <div v-else-if="category" class="bg-white py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {{ category.name }}
          </h1>
          <p v-if="category.description" class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            {{ category.description }}
          </p>
        </div>

        <!-- Posts grid -->
        <div class="mt-12">
          <div v-if="isLoadingPosts" class="flex justify-center py-10">
            <Loader2 class="h-10 w-10 text-primary-500 animate-spin" />
          </div>

          <template v-else>
            <div v-if="posts.length === 0" class="text-center py-10">
              <DocumentIcon class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun article trouvé</h3>
              <p class="mt-1 text-sm text-gray-500">
                Aucun article n'est disponible dans cette catégorie pour le moment.
              </p>
            </div>

            <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <PostCard
                  v-for="post in posts"
                  :key="post.id"
                  :post="post"
              />
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="mt-12 flex justify-center">
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                    @click="goToPage(currentPage - 1)"
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
                >
                  <span class="sr-only">Précédent</span>
                  <ChevronLeft class="h-5 w-5" />
                </button>

                <button
                    v-for="page in paginationPages"
                    :key="page"
                    @click="goToPage(page)"
                    :class="[
                    page === currentPage
                      ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                  ]"
                >
                  {{ page }}
                </button>

                <button
                    @click="goToPage(currentPage + 1)"
                    :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
                >
                  <span class="sr-only">Suivant</span>
                  <ChevronRight class="h-5 w-5" />
                </button>
              </nav>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBlogStore } from '~/stores/blog'
import { useAuthStore } from '~/stores/auth'
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  DocumentIcon,
  AlertCircle
} from 'lucide-vue-next'
import PostCard from '~/components/blog/PostCard.vue'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()
const authStore = useAuthStore()

const category = ref(null)
const posts = ref([])
const isLoading = ref(true)
const isLoadingPosts = ref(true)
const error = ref(null)
const currentPage = ref(1)
const totalPages = ref(1)

// Computed properties
const paginationPages = computed(() => {
  const pages = []
  const maxPagesToShow = 5
  let startPage = Math.max(1, currentPage.value - Math.floor(maxPagesToShow / 2))
  let endPage = Math.min(totalPages.value, startPage + maxPagesToShow - 1)

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return pages
})

// Watch for route changes to update content
watch(
    () => route.query,
    async (newQuery) => {
      currentPage.value = parseInt(newQuery.page || 1)
      await loadPosts()
    }
)

watch(
    () => route.params.slug,
    async (newSlug) => {
      if (newSlug) {
        await loadCategory(newSlug)
        await loadPosts()
      }
    }
)

onMounted(async () => {
  const { slug } = route.params

  if (!slug) {
    error.value = "URL de catégorie invalide."
    isLoading.value = false
    return
  }

  currentPage.value = parseInt(route.query.page || 1)

  await loadCategory(slug)
  await loadPosts()
})

async function loadCategory(slug) {
  isLoading.value = true
  error.value = null

  try {
    // Obtenir l'instance PocketBase
    const pb = authStore.getPocketBaseInstance()
    if (!pb) {
      throw new Error('PocketBase non initialisé')
    }

    // Récupérer la catégorie par slug
    const categoryData = await pb.collection('categories').getFirstListItem(`slug="${slug}"`)
    category.value = categoryData
  } catch (err) {
    error.value = err.message || "Impossible de charger la catégorie."
  } finally {
    isLoading.value = false
  }
}

async function loadPosts() {
  if (!category.value) return

  isLoadingPosts.value = true

  try {
    // Récupérer les articles par catégorie avec pagination
    const pb = authStore.getPocketBaseInstance()
    if (!pb) {
      throw new Error('PocketBase non initialisé')
    }

    const filter = `isPublished=true && category="${category.value.id}"`
    const pageSize = 9

    const postsData = await pb.collection('posts').getList(currentPage.value, pageSize, {
      sort: '-created',
      filter,
      expand: 'category,author'
    })

    posts.value = postsData.items
    totalPages.value = Math.ceil(postsData.totalItems / pageSize)
  } catch (err) {
    console.error('Failed to load posts:', err)
  } finally {
    isLoadingPosts.value = false
  }
}

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return

  router.push({
    path: `/categories/${route.params.slug}`,
    query: { page }
  })
}
</script>