<!-- pages/admin/users.vue -->
<template>
  <div>
    <div class="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
      <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
        Gestion des utilisateurs
      </h1>
      <div class="mt-3 sm:mt-0 sm:ml-4">
        <div class="flex rounded-md shadow-sm">
          <div class="relative flex-grow focus-within:z-10">
            <input
                v-model="searchQuery"
                type="text"
                class="block w-full rounded-none rounded-l-md border-gray-300 pl-3 pr-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Rechercher des utilisateurs..."
                @keyup.enter="fetchUsers(1)"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
              <Search class="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <button
              @click="fetchUsers(1)"
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
        <label for="filterStatus" class="block text-sm font-medium text-gray-700">Statut</label>
        <select
            id="filterStatus"
            v-model="filterStatus"
            class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
            @change="fetchUsers(1)"
        >
          <option value="">Tous les statuts</option>
          <option value="active">Actifs</option>
          <option value="suspended">Suspendus</option>
        </select>
      </div>

      <div>
        <label for="filterRole" class="block text-sm font-medium text-gray-700">Rôle</label>
        <select
            id="filterRole"
            v-model="filterRole"
            class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
            @change="fetchUsers(1)"
        >
          <option value="">Tous les rôles</option>
          <option value="admin">Administrateurs</option>
          <option value="user">Utilisateurs</option>
        </select>
      </div>

      <div>
        <label for="filterVerified" class="block text-sm font-medium text-gray-700">Vérification</label>
        <select
            id="filterVerified"
            v-model="filterVerified"
            class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
            @change="fetchUsers(1)"
        >
          <option value="">Tous</option>
          <option value="true">Vérifiés</option>
          <option value="false">Non vérifiés</option>
        </select>
      </div>

      <div>
        <label for="sortBy" class="block text-sm font-medium text-gray-700">Trier par</label>
        <select
            id="sortBy"
            v-model="sortBy"
            class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
            @change="fetchUsers(1)"
        >
          <option value="-created">Date d'inscription (plus récent)</option>
          <option value="created">Date d'inscription (plus ancien)</option>
          <option value="name">Nom (A-Z)</option>
          <option value="-name">Nom (Z-A)</option>
          <option value="-lastConnected">Dernière connexion</option>
        </select>
      </div>
    </div>

    <!-- Tableau des utilisateurs -->
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
                  Rôle
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière connexion
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
              <tr v-else-if="users.length === 0">
                <td colspan="6" class="px-6 py-10 text-center text-sm text-gray-500">
                  Aucun utilisateur trouvé
                </td>
              </tr>
              <template v-else>
                <tr v-for="user in users" :key="user.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div v-if="user.avatar" class="h-10 w-10 rounded-full overflow-hidden">
                          <img
                              :src="`${pocketbaseUrl}/api/files/users/${user.id}/${user.avatar}`"
                              :alt="user.name || user.email"
                              class="h-full w-full object-cover"
                          />
                        </div>
                        <div v-else class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-medium">
                          {{ user.name ? user.name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U') }}
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ user.name || 'Sans nom' }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ user.email }}
                        </div>
                        <div v-if="user.phoneNumber" class="text-xs text-gray-500">
                          {{ user.phoneNumber }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                      <span
                          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                          :class="user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'"
                      >
                        {{ user.isAdmin ? 'Administrateur' : 'Utilisateur' }}
                      </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex flex-col space-y-1">
                        <span
                            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                            :class="user.isSuspended ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'"
                        >
                          {{ user.isSuspended ? 'Suspendu' : 'Actif' }}
                        </span>
                      <span
                          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                          :class="user.verified ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'"
                      >
                          {{ user.verified ? 'Vérifié' : 'Non vérifié' }}
                        </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ user.lastConnected ? formatDate(user.lastConnected) : 'Jamais' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(user.created) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex space-x-3 justify-end">
                      <button
                          @click="toggleUserRole(user)"
                          class="text-primary-600 hover:text-primary-900"
                          :disabled="user.id === authStore.user.id"
                          :class="{ 'opacity-50 cursor-not-allowed': user.id === authStore.user.id }"
                      >
                        {{ user.isAdmin ? 'Retirer admin' : 'Faire admin' }}
                      </button>
                      <button
                          @click="toggleUserStatus(user)"
                          :class="user.isSuspended ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900'"
                          :disabled="user.id === authStore.user.id"
                          :title="user.id === authStore.user.id ? 'Vous ne pouvez pas modifier votre propre statut' : ''"
                      >
                        {{ user.isSuspended ? 'Réactiver' : 'Suspendre' }}
                      </button>
                      <button
                          @click="viewUserActivities(user)"
                          class="text-gray-600 hover:text-gray-900"
                      >
                        Activités
                      </button>
                    </div>
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
            @click="fetchUsers(currentPage - 1)"
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
            @click="fetchUsers(page)"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium"
            :class="page === currentPage ? 'z-10 bg-primary-50 border-primary-500 text-primary-600' : 'text-gray-500 hover:bg-gray-50'"
        >
          {{ page }}
        </button>

        <button
            @click="fetchUsers(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
        >
          <span class="sr-only">Suivant</span>
          <ChevronRight class="h-5 w-5" />
        </button>
      </nav>
    </div>

    <!-- Modal de confirmation -->
    <Dialog :open="showConfirmModal" @close="cancelAction" class="relative z-10">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" />

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                <TriangleAlert class="h-6 w-6 text-yellow-600" />
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  {{ confirmTitle }}
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    {{ confirmMessage }}
                  </p>
                  <p v-if="selectedUser" class="mt-2 font-medium text-gray-900">
                    {{ selectedUser.name || selectedUser.email }}
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                  @click="confirmAction"
                  class="inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  :class="confirmButtonStyle"
                  :disabled="isActionLoading"
              >
                <svg v-if="isActionLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ confirmButtonText }}
              </button>
              <button
                  @click="cancelAction"
                  class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                  :disabled="isActionLoading"
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
import { useRouter } from 'vue-router'
import {
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
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
const router = useRouter()
const pocketbaseUrl = computed(() => runtimeConfig.public.pocketbaseUrl)

// États
const users = ref([])
const isLoading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const pageSize = ref(10)

// Filtres
const searchQuery = ref('')
const filterStatus = ref('')
const filterRole = ref('')
const filterVerified = ref('')
const sortBy = ref('-created')

// Modal de confirmation
const showConfirmModal = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmButtonText = ref('')
const selectedUser = ref(null)
const pendingAction = ref('')
const isActionLoading = ref(false)

// Style du bouton de confirmation
const confirmButtonStyle = computed(() => {
  if (pendingAction.value === 'suspend') {
    return 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
  } else if (pendingAction.value === 'activate') {
    return 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
  } else if (pendingAction.value === 'make-admin') {
    return 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500'
  } else if (pendingAction.value === 'remove-admin') {
    return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
  } else {
    return 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'
  }
})

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
watch([searchQuery, filterStatus, filterRole, filterVerified, sortBy], () => {
  fetchUsers(1)
}, { deep: true })

onMounted(async () => {
  await fetchUsers(1)
})

// Récupérer les utilisateurs
async function fetchUsers(page) {
  isLoading.value = true
  currentPage.value = page

  try {
    const pb = authStore.getPocketBaseInstance()
    if (!pb) throw new Error('PocketBase not initialized')

    // Construire le filtre en fonction des critères sélectionnés
    let filter = ''

    if (filterStatus.value === 'active') {
      filter += 'isSuspended=false'
    } else if (filterStatus.value === 'suspended') {
      filter += 'isSuspended=true'
    }

    if (filterRole.value === 'admin') {
      if (filter) filter += ' && '
      filter += 'isAdmin=true'
    } else if (filterRole.value === 'user') {
      if (filter) filter += ' && '
      filter += 'isAdmin=false'
    }

    if (filterVerified.value !== '') {
      if (filter) filter += ' && '
      filter += `verified=${filterVerified.value}`
    }

    if (searchQuery.value.trim()) {
      const search = searchQuery.value.trim()
      if (filter) filter += ' && '
      filter += `(name~"${search}" || email~"${search}" || phoneNumber~"${search}")`
    }

    // Récupérer les utilisateurs avec pagination
    const response = await pb.collection('users').getList(page, pageSize.value, {
      filter: filter,
      sort: sortBy.value
    })

    users.value = response.items
    totalPages.value = Math.ceil(response.totalItems / pageSize.value)
    totalItems.value = response.totalItems
  } catch (error) {
    console.error('Failed to fetch users:', error)
  } finally {
    isLoading.value = false
  }
}

// Afficher le modal pour changer le rôle d'un utilisateur
function toggleUserRole(user) {
  // Empêcher la modification de son propre rôle
  if (user.id === authStore.user.id) {
    return
  }

  selectedUser.value = user

  if (user.isAdmin) {
    // Retirer le rôle admin
    pendingAction.value = 'remove-admin'
    confirmTitle.value = 'Retirer les droits administrateur'
    confirmMessage.value = 'Êtes-vous sûr de vouloir retirer les droits administrateur de cet utilisateur ?'
    confirmButtonText.value = 'Retirer admin'
  } else {
    // Ajouter le rôle admin
    pendingAction.value = 'make-admin'
    confirmTitle.value = 'Ajouter des droits administrateur'
    confirmMessage.value = 'Êtes-vous sûr de vouloir donner les droits administrateur à cet utilisateur ?'
    confirmButtonText.value = 'Faire admin'
  }

  showConfirmModal.value = true
}

// Afficher le modal pour changer le statut d'un utilisateur
function toggleUserStatus(user) {
  // Empêcher la modification de son propre statut
  if (user.id === authStore.user.id) {
    return
  }

  selectedUser.value = user

  if (user.isSuspended) {
    // Réactiver l'utilisateur
    pendingAction.value = 'activate'
    confirmTitle.value = 'Réactiver l\'utilisateur'
    confirmMessage.value = 'Êtes-vous sûr de vouloir réactiver cet utilisateur ?'
    confirmButtonText.value = 'Réactiver'
  } else {
    // Suspendre l'utilisateur
    pendingAction.value = 'suspend'
    confirmTitle.value = 'Suspendre l\'utilisateur'
    confirmMessage.value = 'Êtes-vous sûr de vouloir suspendre cet utilisateur ? Il ne pourra plus se connecter.'
    confirmButtonText.value = 'Suspendre'
  }

  showConfirmModal.value = true
}

// Confirmer l'action en cours
async function confirmAction() {
  if (!selectedUser.value) return

  isActionLoading.value = true

  try {
    const userId = selectedUser.value.id

    if (pendingAction.value === 'make-admin' || pendingAction.value === 'remove-admin') {
      // Changer le rôle
      const isAdmin = pendingAction.value === 'make-admin'
      await adminStore.toggleAdminRole(userId, isAdmin)
    } else if (pendingAction.value === 'suspend' || pendingAction.value === 'activate') {
      // Changer le statut
      const isSuspended = pendingAction.value === 'suspend'
      await adminStore.updateUserStatus(userId, isSuspended)
    }

    // Rafraîchir la liste d'utilisateurs
    await fetchUsers(currentPage.value)

    // Fermer le modal
    showConfirmModal.value = false
    selectedUser.value = null
    pendingAction.value = ''

    // Afficher une notification (implémentation à déterminer)
    alert('Action effectuée avec succès')
  } catch (error) {
    console.error('Failed to perform action:', error)
    alert('Erreur: ' + error.message)
  } finally {
    isActionLoading.value = false
  }
}

// Annuler l'action en cours
function cancelAction() {
  showConfirmModal.value = false
  selectedUser.value = null
  pendingAction.value = ''
}

// Voir les activités d'un utilisateur
function viewUserActivities(user) {
  router.push(`/admin/activities?user=${user.id}`)
}

// Formater la date
function formatDate(dateString) {
  if (!dateString) return 'Jamais'

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
</script>