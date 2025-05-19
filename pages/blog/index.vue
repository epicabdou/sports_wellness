<!-- pages/blog/index.vue -->
<template>
  <div>
    <div class="bg-white py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Le Blog Sport & Bien-être
          </h1>
          <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Découvrez nos articles sur le sport, la nutrition, la santé mentale et le bien-être général.
          </p>
        </div>

        <!-- Filter by categories -->
        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <button
              @click="resetCategoryFilter"
              class="px-4 py-2 text-sm font-medium rounded-md"
              :class="!currentCategory ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
          >
            Tous les articles
          </button>

          <button
              v-for="category in categories"
              :key="category.id"
              @click="filterByCategory(category.slug)"
              class="px-4 py-2 text-sm font-medium rounded-md"
              :class="currentCategory && currentCategory.id === category.id ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
          >
            {{ category.name }}
          </button>
        </div>

        <!-- Blog posts grid -->
        <div class="mt-12">
          <div v-if="isLoading" class="flex justify-center py-10">
            <Loader2 class="h-10 w-10 text-primary-500 animate-spin" />
          </div>

          <template v-else>
            <div v-if="posts.length === 0" class="text-center py-10">
              <FileText class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun article trouvé</h3>
              <p class="mt-1 text-sm text-gray-500">
                {{ currentCategory ? `Aucun article dans la catégorie ${currentCategory.name}.` : 'Aucun article disponible pour le moment.' }}
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
import { Loader2, ChevronLeft, ChevronRight, FileText } from 'lucide-vue-next'
import { useBlogStore } from '~/stores/blog'
import PostCard from '~/components/blog/PostCard.vue'

const blogStore = useBlogStore()
const route = useRoute()
const router = useRouter()

const posts = ref([])
const categories = ref([])
const currentCategory = ref(null)
const isLoading = ref(true)
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

onMounted(async () => {
  await Promise.all([
    loadCategories(),
    loadPosts()
  ])
})

async function loadCategories() {
  try {
    const response = await blogStore.fetchAllCategories()
    categories.value = response
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

async function loadPosts() {
  isLoading.value = true

  try {
    // Get category slug from query params if exists
    const categorySlug = route.query.category

    // Fetch posts with the current page and category filter
    const response = await blogStore.fetchPosts(
        currentPage.value,
        categorySlug
    )

    posts.value = response.items
    totalPages.value = Math.ceil(response.totalItems / blogStore.pageSize)
    currentCategory.value = blogStore.currentCategory
  } catch (error) {
    console.error('Failed to fetch posts:', error)
  } finally {
    isLoading.value = false
  }
}

function filterByCategory(categorySlug) {
  router.push({
    path: '/blog',
    query: {
      category: categorySlug,
      page: 1
    }
  })
}

function resetCategoryFilter() {
  router.push({
    path: '/blog',
    query: {
      page: 1
    }
  })
}

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return

  const query = { ...route.query, page }

  router.push({
    path: '/blog',
    query
  })
}
</script>