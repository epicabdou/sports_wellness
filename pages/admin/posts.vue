<!-- pages/admin/posts.vue -->
<template>
  <div>
    <div class="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
      <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
        Gestion des articles
      </h1>
      <div class="mt-3 sm:mt-0 sm:ml-4">
        <NuxtLink
            to="/admin/posts/create"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon class="mr-2 h-5 w-5" />
          Nouvel article
        </NuxtLink>
      </div>
    </div>

    <!-- Filtres et recherche -->
    <div class="mt-4 flex flex-col sm:flex-row sm:items-end space-y-3 sm:space-y-0 sm:space-x-4">
      <div class="grow">
        <label for="search" class="block text-sm font-medium text-gray-700">Rechercher</label>
        <div class="mt-1 relative rounded-md shadow-sm">
          <input
              id="search"
              v-model="searchQuery"
              type="text"
              class="focus:ring-primary-500 focus:border-primary-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Rechercher par titre, extrait ou contenu..."
              @keyup.enter="fetchPosts(1)"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <Search class="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div>
        <label for="filterCategory" class="block text-sm font-medium text-gray-700">Catégorie</label>
        <select
            id="filterCategory"
            v-model="filterCategory"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            @change="fetchPosts(1)"
        >
          <option value="">Toutes les catégories</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <div>
        <label for="filterStatus" class="block text-sm font-medium text-gray-700">Statut</label>
        <select
            id="filterStatus"
            v-model="filterStatus"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            @change="fetchPosts(1)"
        >
          <option value="">Tous les statuts</option>
          <option value="true">Publié</option>
          <option value="false">Brouillon</option>
        </select>
      </div>

      <div>
        <button
            type="button"
            class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            @click="fetchPosts(1)"
        >
          <FilterIcon class="mr-2 h-5 w-5 text-gray-400" />
          Filtrer
        </button>
      </div>
    </div>

    <!-- Tableau des articles -->
    <div class="mt-6 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
            Image
          </th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
            Titre
          </th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
            Catégorie
          </th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
            Auteur
          </th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
            Statut
          </th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
            Date
          </th>
          <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
            <span class="sr-only">Actions</span>
          </th>
        </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
        <tr v-if="isLoading">
          <td colspan="7" class="px-6 py-10 text-center">
            <Loader2 class="h-8 w-8 text-primary-500 animate-spin mx-auto" />
          </td>
        </tr>
        <tr v-else-if="posts.length === 0">
          <td colspan="7" class="px-6 py-10 text-center text-sm text-gray-500">
            Aucun article trouvé
          </td>
        </tr>
        <template v-else>
          <tr v-for="post in posts" :key="post.id">
            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
              <div class="h-12 w-20 rounded overflow-hidden bg-gray-100">
                <img
                    v-if="post.image"
                    :src="`${pocketbaseUrl}/api/files/posts/${post.id}/${post.image}`"
                    :alt="post.title"
                    class="h-full w-full object-cover"
                />
                <div v-else class="h-full w-full flex items-center justify-center">
                  <ImageIcon class="h-6 w-6 text-gray-400" />
                </div>
              </div>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
              <div class="font-medium">{{ truncateText(post.title, 40) }}</div>
              <div class="text-gray-500">{{ truncateText(post.excerpt, 40) }}</div>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {{ post.expand?.category?.name || 'Sans catégorie' }}
                </span>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {{ post.expand?.author?.name || post.expand?.author?.email || 'Inconnu' }}
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm">
                <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="post.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                >
                  {{ post.isPublished ? 'Publié' : 'Brouillon' }}
                </span>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {{ formatDate(post.created) }}
            </td>
            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <div class="flex justify-end space-x-2">
                <NuxtLink :to="`/admin/posts/edit/${post.id}`" class="text-primary-600 hover:text-primary-900">
                  <PencilIcon class="h-5 w-5" />
                </NuxtLink>
                <NuxtLink :to="`/blog/${post.slug}`" target="_blank" class="text-gray-600 hover:text-gray-900">
                  <ExternalLinkIcon class="h-5 w-5" />
                </NuxtLink>
                <button @click="confirmDeletePost(post)" class="text-red-600 hover:text-red-900">
                  <TrashIcon class="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
        </template>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-6 flex justify-between items-center">
      <div class="text-sm text-gray-700">
        Affichage de <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> à
        <span class="font-medium">{{ Math.min(currentPage * pageSize, totalItems) }}</span> sur
        <span class="font-medium">{{ totalItems }}</span> résultats
      </div>
      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        <button
            @click="fetchPosts(currentPage - 1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
        >
          <span class="sr-only">Précédent</span>
          <ChevronLeft class="h-5 w-5" />
        </button>

        <button
            v-for="page in visiblePages"
            :key="page"
            @click="fetchPosts(page)"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium"
            :class="page === currentPage ? 'z-10 bg-primary-50 border-primary-500 text-primary-600' : 'text-gray-500 hover:bg-gray-50'"
        >
          {{ page }}
        </button>

        <button
            @click="fetchPosts(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
        >
          <span class="sr-only">Suivant</span>
          <ChevronRight class="h-5 w-5" />
        </button>
      </nav>
    </div>

    <!-- Modal de confirmation de suppression -->
    <Dialog :open="showDeleteModal" @close="cancelDelete" class="relative z-10">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" />

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <TriangleAlert class="h-6 w-6 text-red-600" />
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  Supprimer l'article
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.
                  </p>
                  <p v-if="postToDelete" class="mt-2 font-medium text-gray-900">
                    {{ postToDelete.title }}
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                  @click="deletePost"
                  class="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  :disabled="isDeleting"
              >
                <svg v-if="isDeleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Supprimer
              </button>
              <button
                  @click="cancelDelete"
                  class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                  :disabled="isDeleting"
              >
                Annuler
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'
import {
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  PlusIcon,
  FilterIcon,
  PencilIcon,
  ExternalLinkIcon,
  TrashIcon,
  ImageIcon,
  TriangleAlert
} from 'lucide-vue-next'
import {
  Dialog,
  DialogPanel,
  DialogTitle
} from '@headlessui/vue'
import { useAuthStore } from '~/stores/auth'
import { useAdminStore } from '~/stores/admin'

// Définir les métadonnées de la page
definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
  meta: {
    requiresAuth: true,
    requiresAdmin: true
  }
})

const authStore = useAuthStore()
const adminStore = useAdminStore()
const runtimeConfig = useRuntimeConfig()
const pocketbaseUrl = computed(() => runtimeConfig.public.pocketbaseUrl)

// États
const posts = ref([])
const categories = ref([])
const isLoading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const pageSize = ref(10)

// Filtres
const searchQuery = ref('')
const filterCategory = ref('')
const filterStatus = ref('')

// Modal de suppression
const showDeleteModal = ref(false)
const postToDelete = ref(null)
const isDeleting = ref(false)

// Calculer les pages visibles pour la pagination
const visiblePages = computed(() => {
  const pages = []
  const maxVisiblePages = 5

  let startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1)

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return pages
})

// Surveiller les changements de filtres
watch([searchQuery, filterCategory, filterStatus], () => {
  fetchPosts(1)
}, { deep: true })

onMounted(async () => {
  await fetchCategories()
  await fetchPosts(1)
})

// Récupérer les catégories
async function fetchCategories() {
  try {
    categories.value = await adminStore.fetchAdminCategories()
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

// Récupérer les articles
async function fetchPosts(page) {
  isLoading.value = true
  currentPage.value = page

  try {
    const pb = authStore.getPocketBaseInstance()
    if (!pb) throw new Error('PocketBase not initialized')

    // Construire le filtre en fonction des critères sélectionnés
    let filter = ''

    if (filterCategory.value) {
      filter += `category="${filterCategory.value}"`
    }

    if (filterStatus.value !== '') {
      if (filter) filter += ' && '
      filter += `isPublished=${filterStatus.value}`
    }

    if (searchQuery.value.trim()) {
      const search = searchQuery.value.trim()
      if (filter) filter += ' && '
      filter += `(title~"${search}" || excerpt~"${search}" || content~"${search}")`
    }

    // Récupérer les articles avec pagination
    const response = await pb.collection('posts').getList(page, pageSize.value, {
      filter: filter,
      sort: '-created',
      expand: 'category,author'
    })

    posts.value = response.items
    totalPages.value = Math.ceil(response.totalItems / pageSize.value)
    totalItems.value = response.totalItems
  } catch (error) {
    console.error('Failed to fetch posts:', error)
  } finally {
    isLoading.value = false
  }
}

// Confirmer la suppression d'un article
function confirmDeletePost(post) {
  postToDelete.value = post
  showDeleteModal.value = true
}

// Annuler la suppression
function cancelDelete() {
  showDeleteModal.value = false
  postToDelete.value = null
}

// Supprimer un article
async function deletePost() {
  if (!postToDelete.value) return

  isDeleting.value = true

  try {
    await adminStore.deletePost(postToDelete.value.id)

    // Rafraîchir la liste d'articles
    await fetchPosts(currentPage.value)

    // Fermer le modal
    showDeleteModal.value = false
    postToDelete.value = null

    // Afficher une notification (implémentation à déterminer)
    alert('Article supprimé avec succès')
  } catch (error) {
    console.error('Failed to delete post:', error)
    alert('Erreur lors de la suppression de l\'article: ' + error.message)
  } finally {
    isDeleting.value = false
  }
}

// Tronquer un texte
function truncateText(text, maxLength) {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

// Formater la date
function formatDate(dateString) {
  const date = new Date(dateString)

  // Format pour la France
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}
</script>