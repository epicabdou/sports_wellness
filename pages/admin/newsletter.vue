<!-- pages/admin/newsletter.vue -->
<template>
  <div>
    <div class="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
      <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
        Gestion de la Newsletter
      </h1>
      <div class="mt-3 sm:mt-0 sm:ml-4">
        <button
            @click="exportSubscribers"
            class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <FileDown class="mr-2 h-5 w-5" />
          Exporter (CSV)
        </button>
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
              placeholder="Rechercher par nom, email ou ville..."
              @keyup.enter="fetchSubscribers(1)"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <Search class="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div>
        <label for="filterCity" class="block text-sm font-medium text-gray-700">Ville</label>
        <select
            id="filterCity"
            v-model="filterCity"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            @change="fetchSubscribers(1)"
        >
          <option value="">Toutes les villes</option>
          <option v-for="city in cities" :key="city" :value="city">
            {{ city }}
          </option>
        </select>
      </div>

      <div>
        <label for="sortBy" class="block text-sm font-medium text-gray-700">Trier par</label>
        <select
            id="sortBy"
            v-model="sortBy"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            @change="fetchSubscribers(1)"
        >
          <option value="-created">Date d'inscription (plus récent)</option>
          <option value="created">Date d'inscription (plus ancien)</option>
          <option value="name">Nom (A-Z)</option>
          <option value="-name">Nom (Z-A)</option>
          <option value="city">Ville (A-Z)</option>
        </select>
      </div>

      <div>
        <button
            type="button"
            class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            @click="fetchSubscribers(1)"
        >
          <FilterIcon class="mr-2 h-5 w-5 text-gray-400" />
          Filtrer
        </button>
      </div>
    </div>

    <!-- Statistiques -->
    <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-primary-100 rounded-md p-3">
              <Users class="h-6 w-6 text-primary-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total des abonnés
                </dt>
                <dd v-if="isLoading">
                  <div class="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                </dd>
                <dd v-else class="text-2xl font-semibold text-gray-900">
                  {{ totalItems }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-100 rounded-md p-3">
              <MapPin class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Villes différentes
                </dt>
                <dd v-if="isLoading">
                  <div class="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                </dd>
                <dd v-else class="text-2xl font-semibold text-gray-900">
                  {{ cities.length }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <Calendar class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Nouveaux ce mois-ci
                </dt>
                <dd v-if="isLoading">
                  <div class="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                </dd>
                <dd v-else class="text-2xl font-semibold text-gray-900">
                  {{ subscribersThisMonth }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-purple-100 rounded-md p-3">
              <Activity class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Âge moyen
                </dt>
                <dd v-if="isLoading">
                  <div class="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                </dd>
                <dd v-else class="text-2xl font-semibold text-gray-900">
                  {{ averageAge ? `${Math.round(averageAge)} ans` : 'N/A' }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Liste des abonnés -->
    <div class="mt-8 flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom / Email
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Téléphone
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ville
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Âge / Poids / Taille
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'inscription
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="isLoading">
                <td colspan="6" class="px-6 py-10 text-center">
                  <Loader2 class="h-8 w-8 text-primary-500 animate-spin mx-auto" />
                </td>
              </tr>
              <tr v-else-if="subscribers.length === 0">
                <td colspan="6" class="px-6 py-10 text-center text-sm text-gray-500">
                  Aucun abonné trouvé
                </td>
              </tr>
              <template v-else>
                <tr v-for="subscriber in subscribers" :key="subscriber.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-medium">
                          {{ subscriber.name ? subscriber.name.charAt(0).toUpperCase() : 'U' }}
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ subscriber.name }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ subscriber.email }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ subscriber.phone }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ subscriber.city }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                      {{ subscriber.age ? `${subscriber.age} ans` : 'N/A' }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ getPhysicalInfo(subscriber) }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(subscriber.created) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                        @click="confirmDeleteSubscriber(subscriber)"
                        class="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
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
            @click="fetchSubscribers(currentPage - 1)"
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
            @click="fetchSubscribers(page)"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium"
            :class="page === currentPage ? 'z-10 bg-primary-50 border-primary-500 text-primary-600' : 'text-gray-500 hover:bg-gray-50'"
        >
          {{ page }}
        </button>

        <button
            @click="fetchSubscribers(currentPage + 1)"
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
                  Supprimer l'abonné
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Êtes-vous sûr de vouloir supprimer cet abonné ? Cette action est irréversible.
                  </p>
                  <p v-if="subscriberToDelete" class="mt-2 font-medium text-gray-900">
                    {{ subscriberToDelete.name }} ({{ subscriberToDelete.email }})
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                  @click="deleteSubscriber"
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
import {
  Loader2,
  Search,
  FilterIcon,
  ChevronLeft,
  ChevronRight,
  Users,
  MapPin,
  Calendar,
  Activity,
  FileDown,
  TriangleAlert
} from 'lucide-vue-next'
import {
  Dialog,
  DialogPanel,
  DialogTitle
} from '@headlessui/vue'
import { useAuthStore } from '~/stores/auth'

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

// États
const subscribers = ref([])
const allSubscribers = ref([])
const cities = ref([])
const isLoading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const pageSize = ref(10)
const subscribersThisMonth = ref(0)
const averageAge = ref(null)

// Filtres
const searchQuery = ref('')
const filterCity = ref('')
const sortBy = ref('-created')

// Modal de suppression
const showDeleteModal = ref(false)
const subscriberToDelete = ref(null)
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
watch([searchQuery, filterCity, sortBy], () => {
  fetchSubscribers(1)
}, { deep: true })

onMounted(async () => {
  await fetchAllSubscribers()
  await fetchSubscribers(1)
})

// Récupérer tous les abonnés pour les statistiques
async function fetchAllSubscribers() {
  try {
    const pb = authStore.getPocketBaseInstance()
    if (!pb) throw new Error('PocketBase not initialized')

    const response = await pb.collection('newsletter').getFullList({
      sort: '-created'
    })

    allSubscribers.value = response

    // Extraire les villes pour le filtre
    const uniqueCities = new Set()
    response.forEach(subscriber => {
      if (subscriber.city) {
        uniqueCities.add(subscriber.city)
      }
    })
    cities.value = Array.from(uniqueCities).sort()

    // Calculer le nombre d'abonnés ce mois-ci
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    subscribersThisMonth.value = response.filter(subscriber => {
      const createdDate = new Date(subscriber.created)
      return createdDate >= firstDayOfMonth
    }).length

    // Calculer l'âge moyen
    const validAges = response.filter(subscriber => subscriber.age).map(subscriber => subscriber.age)
    if (validAges.length > 0) {
      const sum = validAges.reduce((acc, age) => acc + age, 0)
      averageAge.value = sum / validAges.length
    }
  } catch (error) {
    console.error('Failed to fetch all subscribers:', error)
  }
}

// Récupérer les abonnés avec pagination et filtres
async function fetchSubscribers(page) {
  isLoading.value = true
  currentPage.value = page

  try {
    const pb = authStore.getPocketBaseInstance()
    if (!pb) throw new Error('PocketBase not initialized')

    // Construire le filtre en fonction des critères sélectionnés
    let filter = ''

    if (filterCity.value) {
      filter += `city="${filterCity.value}"`
    }

    if (searchQuery.value.trim()) {
      const search = searchQuery.value.trim()
      if (filter) filter += ' && '
      filter += `(name~"${search}" || email~"${search}" || city~"${search}")`
    }

    // Récupérer les abonnés avec pagination
    const response = await pb.collection('newsletter').getList(page, pageSize.value, {
      filter: filter,
      sort: sortBy.value
    })

    subscribers.value = response.items
    totalPages.value = Math.ceil(response.totalItems / pageSize.value)
    totalItems.value = response.totalItems
  } catch (error) {
    console.error('Failed to fetch subscribers:', error)
  } finally {
    isLoading.value = false
  }
}

// Confirmer la suppression d'un abonné
function confirmDeleteSubscriber(subscriber) {
  subscriberToDelete.value = subscriber
  showDeleteModal.value = true
}

// Annuler la suppression
function cancelDelete() {
  showDeleteModal.value = false
  subscriberToDelete.value = null
}

// Supprimer un abonné
async function deleteSubscriber() {
  if (!subscriberToDelete.value) return

  isDeleting.value = true

  try {
    const pb = authStore.getPocketBaseInstance()
    if (!pb) throw new Error('PocketBase not initialized')

    await pb.collection('newsletter').delete(subscriberToDelete.value.id)

    // Rafraîchir la liste d'abonnés
    await fetchAllSubscribers()
    await fetchSubscribers(currentPage.value)

    // Fermer le modal
    showDeleteModal.value = false
    subscriberToDelete.value = null
  } catch (error) {
    console.error('Failed to delete subscriber:', error)
    alert('Erreur: ' + error.message)
  } finally {
    isDeleting.value = false
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

// Obtenir les informations physiques
function getPhysicalInfo(subscriber) {
  const parts = []

  if (subscriber.weight) {
    parts.push(`${subscriber.weight} kg`)
  }

  if (subscriber.height) {
    parts.push(`${subscriber.height} cm`)
  }

  return parts.length > 0 ? parts.join(' / ') : 'Non spécifié'
}

// Exporter les abonnés en CSV
function exportSubscribers() {
  try {
    // En-tête CSV
    let csvContent = "Nom,Email,Téléphone,Ville,Âge,Poids,Taille,Date d'inscription\n"

    // Ajouter les données
    allSubscribers.value.forEach(subscriber => {
      const row = [
        subscriber.name || '',
        subscriber.email || '',
        subscriber.phone || '',
        subscriber.city || '',
        subscriber.age || '',
        subscriber.weight || '',
        subscriber.height || '',
        subscriber.created || ''
      ].map(field => `"${String(field).replace(/"/g, '""')}"`) // Échapper les guillemets

      csvContent += row.join(',') + '\n'
    })

    // Créer un blob et un lien de téléchargement
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    // Préparer le téléchargement
    link.setAttribute('href', url)
    link.setAttribute('download', `newsletter_subscribers_${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = 'hidden'

    // Déclencher le téléchargement
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Failed to export subscribers:', error)
    alert('Erreur lors de l\'exportation: ' + error.message)
  }
}
</script>