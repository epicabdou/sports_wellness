<!-- pages/admin/activities.vue -->
<template>
  <div>
    <div class="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
      <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
        Activités des utilisateurs
      </h1>
      <div class="mt-3 sm:mt-0 sm:ml-4">
        <div class="flex rounded-md shadow-sm">
          <div class="relative flex-grow focus-within:z-10">
            <input
                v-model="searchQuery"
                type="text"
                class="block w-full rounded-none rounded-l-md border-gray-300 pl-3 pr-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Rechercher des activités..."
                @keyup.enter="fetchActivities(1)"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
              <Search class="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <button
              @click="fetchActivities(1)"
              type="button"
              class="relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            Rechercher
          </button>
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <div class="mt-4 flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
      <div>
        <label for="filterType" class="block text-sm font-medium text-gray-700">Type d'activité</label>
        <select
            id="filterType"
            v-model="filterType"
            class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
            @change="fetchActivities(1)"
        >
          <option value="">Tous les types</option>
          <option value="login">Connexion</option>
          <option value="logout">Déconnexion</option>
          <option value="profile_update">Mise à jour de profil</option>
          <option value="password_change">Changement de mot de passe</option>
          <option value="post_view">Lecture d'article</option>
          <option value="post_like">J'aime sur article</option>
          <option value="post_unlike">Retrait de j'aime</option>
          <option value="post_comment">Commentaire sur article</option>
        </select>
      </div>

      <div>
        <label for="filterUser" class="block text-sm font-medium text-gray-700">Utilisateur</label>
        <select
            id="filterUser"
            v-model="filterUser"
            class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
            @change="fetchActivities(1)"
        >
          <option value="">Tous les utilisateurs</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.name || user.email }}
          </option>
        </select>
      </div>

      <div>
        <label for="sortBy" class="block text-sm font-medium text-gray-700">Trier par</label>
        <select
            id="sortBy"
            v-model="sortBy"
            class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
            @change="fetchActivities(1)"
        >
          <option value="-created">Date (plus récent)</option>
          <option value="created">Date (plus ancien)</option>
        </select>
      </div>
    </div>

    <!-- Tableau d'activités -->
    <div class="mt-6 flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type d'activité
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Détails
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="isLoading" class="bg-white">
                <td colspan="4" class="px-6 py-10 text-center">
                  <Loader2 class="h-8 w-8 text-primary-500 animate-spin mx-auto" />
                </td>
              </tr>
              <tr v-else-if="activities.length === 0" class="bg-white">
                <td colspan="4" class="px-6 py-10 text-center text-sm text-gray-500">
                  Aucune activité trouvée
                </td>
              </tr>
              <template v-else>
                <tr v-for="(activity, activityIdx) in activities" :key="activity.id" :class="activityIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div v-if="activity.expand?.user?.avatar" class="h-10 w-10 rounded-full overflow-hidden">
                          <img
                              :src="`${pocketbaseUrl}/api/files/users/${activity.expand.user.id}/${activity.expand.user.avatar}`"
                              :alt="activity.expand.user.name || activity.expand.user.email"
                              class="h-full w-full object-cover"
                          />
                        </div>
                        <div v-else class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-medium">
                          {{ activity.expand?.user?.name ? activity.expand.user.name.charAt(0).toUpperCase() : (activity.expand?.user?.email ? activity.expand.user.email.charAt(0).toUpperCase() : 'U') }}
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ activity.expand?.user?.name || 'Sans nom' }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ activity.expand?.user?.email }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <ActivityBadge :type="activity.activity.type" />
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">
                      {{ getActivityDescription(activity) }}
                    </div>
                    <div v-if="activity.activity.data?.postTitle" class="text-sm text-gray-500">
                      {{ activity.activity.data.postTitle }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(activity.created) }}
                  </td>
                </tr>
              </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
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
            @click="fetchActivities(currentPage - 1)"
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
            @click="fetchActivities(page)"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium"
            :class="page === currentPage ? 'z-10 bg-primary-50 border-primary-500 text-primary-600' : 'text-gray-500 hover:bg-gray-50'"
        >
          {{ page }}
        </button>

        <button
            @click="fetchActivities(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
        >
          <span class="sr-only">Suivant</span>
          <ChevronRight class="h-5 w-5" />
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'
import { Loader2, Search, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useAdminStore } from '~/stores/admin'
import ActivityBadge from '~/components/admin/ActivityBadge.vue'

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
const activities = ref([])
const users = ref([])
const isLoading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const pageSize = ref(10)

// Filtres
const searchQuery = ref('')
const filterType = ref('')
const filterUser = ref('')
const sortBy = ref('-created')

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
watch([searchQuery, filterType, filterUser, sortBy], () => {
  fetchActivities(1)
}, { deep: true })

onMounted(async () => {
  await fetchUsers()
  await fetchActivities(1)
})

// Récupérer la liste des utilisateurs
async function fetchUsers() {
  try {
    users.value = await adminStore.fetchUsers()
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
}

// Récupérer les activités avec pagination et filtres
async function fetchActivities(page) {
  isLoading.value = true
  currentPage.value = page

  try {
    const pb = authStore.getPocketBaseInstance()
    if (!pb) throw new Error('PocketBase not initialized')

    // Construire le filtre en fonction des critères sélectionnés
    let filter = ''

    if (filterUser.value) {
      filter += `user="${filterUser.value}"`
    }

    if (filterType.value) {
      if (filter) filter += ' && '
      filter += `activity.type?~"${filterType.value}"`
    }

    if (searchQuery.value.trim()) {
      // Recherche dans différents champs d'activité
      if (filter) filter += ' && '
      filter += `(activity.data.message?~"${searchQuery.value}" || activity.data.postTitle?~"${searchQuery.value}")`
    }

    // Récupérer les activités avec pagination
    const response = await pb.collection('userActivity').getList(page, pageSize.value, {
      filter: filter,
      sort: sortBy.value,
      expand: 'user'
    })

    activities.value = response.items
    totalPages.value = Math.ceil(response.totalItems / pageSize.value)
    totalItems.value = response.totalItems
  } catch (error) {
    console.error('Failed to fetch activities:', error)
  } finally {
    isLoading.value = false
  }
}

// Formater la date
function formatDate(dateString) {
  const date = new Date(dateString)

  // Format pour la France
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Obtenir une description lisible de l'activité
function getActivityDescription(activity) {
  const type = activity.activity.type
  const data = activity.activity.data || {}

  switch (type) {
    case 'login':
      return 'S\'est connecté'
    case 'logout':
      return 'S\'est déconnecté'
    case 'profile_update':
      return data.message || 'A mis à jour son profil'
    case 'password_change':
      return 'A changé son mot de passe'
    case 'post_view':
      return `A consulté l'article "${data.postTitle || 'Sans titre'}"`
    case 'post_like':
      return `A aimé l'article "${data.postTitle || 'Sans titre'}"`
    case 'post_unlike':
      return `A retiré son j'aime sur l'article "${data.postTitle || 'Sans titre'}"`
    case 'post_comment':
      return `A commenté l'article "${data.postTitle || 'Sans titre'}"`
    default:
      return 'Activité non spécifiée'
  }
}
</script>