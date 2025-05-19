<!-- pages/admin/index.vue -->
<template>
  <div>
    <div class="py-6">
      <h1 class="text-3xl font-bold text-gray-900">
        Tableau de bord
      </h1>
      <p class="mt-2 text-sm text-gray-700">
        Vue d'ensemble du blog Sport & Bien-être
      </p>
    </div>

    <!-- Stats overview -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-primary-100 rounded-md p-3">
              <FileText class="h-6 w-6 text-primary-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total des articles
                </dt>
                <dd v-if="isLoading">
                  <div class="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                </dd>
                <dd v-else class="text-2xl font-semibold text-gray-900">
                  {{ stats.postsCount }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-4 sm:px-6">
          <div class="text-sm">
            <NuxtLink to="/admin/posts" class="font-medium text-primary-600 hover:text-primary-500">
              Voir tous les articles
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-secondary-100 rounded-md p-3">
              <Folder class="h-6 w-6 text-secondary-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Catégories
                </dt>
                <dd v-if="isLoading">
                  <div class="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                </dd>
                <dd v-else class="text-2xl font-semibold text-gray-900">
                  {{ stats.categoriesCount }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-4 sm:px-6">
          <div class="text-sm">
            <NuxtLink to="/admin/categories" class="font-medium text-primary-600 hover:text-primary-500">
              Gérer les catégories
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-indigo-100 rounded-md p-3">
              <Users class="h-6 w-6 text-indigo-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Utilisateurs
                </dt>
                <dd v-if="isLoading">
                  <div class="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                </dd>
                <dd v-else class="text-2xl font-semibold text-gray-900">
                  {{ stats.usersCount }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-4 sm:px-6">
          <div class="text-sm">
            <NuxtLink to="/admin/users" class="font-medium text-primary-600 hover:text-primary-500">
              Gérer les utilisateurs
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-red-100 rounded-md p-3">
              <MessageSquare class="h-6 w-6 text-red-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Commentaires
                </dt>
                <dd v-if="isLoading">
                  <div class="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                </dd>
                <dd v-else class="text-2xl font-semibold text-gray-900">
                  {{ stats.commentsCount }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-4 sm:px-6">
          <div class="text-sm">
            <a href="#comments" class="font-medium text-primary-600 hover:text-primary-500">
              Voir les commentaires récents
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent posts -->
    <div class="mt-8">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-medium text-gray-900">
          Articles récents
        </h2>
        <NuxtLink to="/admin/posts" class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Voir tous
        </NuxtLink>
      </div>

      <div class="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <div v-if="isLoading" class="flex justify-center py-10">
          <Loader2 class="h-8 w-8 text-primary-500 animate-spin" />
        </div>

        <table v-else class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
              Titre
            </th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Catégorie
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
          <tr v-for="post in recentPosts" :key="post.id">
            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
              {{ truncateText(post.title, 40) }}
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {{ post.expand?.category?.name || 'Non catégorisé' }}
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm">
                <span
                    class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                    :class="post.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                >
                  {{ post.isPublished ? 'Publié' : 'Brouillon' }}
                </span>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {{ formatDate(post.created) }}
            </td>
            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <NuxtLink :to="`/admin/posts/edit/${post.id}`" class="text-primary-600 hover:text-primary-900">
                Modifier
              </NuxtLink>
              <span class="text-gray-300 mx-1">|</span>
              <NuxtLink :to="`/blog/${post.slug}`" target="_blank" class="text-primary-600 hover:text-primary-900">
                Voir
              </NuxtLink>
            </td>
          </tr>
          <tr v-if="recentPosts.length === 0">
            <td colspan="5" class="px-3 py-4 text-sm text-gray-500 text-center">
              Aucun article trouvé
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Recent activities -->
    <div class="mt-8">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-medium text-gray-900">
          Activités récentes
        </h2>
        <NuxtLink to="/admin/activities" class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Voir toutes
        </NuxtLink>
      </div>

      <div class="mt-4 overflow-hidden bg-white shadow sm:rounded-md">
        <div v-if="isLoading" class="flex justify-center py-10">
          <Loader2 class="h-8 w-8 text-primary-500 animate-spin" />
        </div>

        <ul v-else role="list" class="divide-y divide-gray-200">
          <li v-for="activity in recentActivities" :key="activity.id">
            <div class="block hover:bg-gray-50">
              <div class="px-4 py-4 sm:px-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center min-w-0 space-x-3">
                    <div class="flex-shrink-0">
                      <div v-if="activity.expand?.user?.avatar" class="h-10 w-10 rounded-full overflow-hidden">
                        <img
                            :src="`${pocketbaseUrl}/api/files/users/${activity.expand.user.id}/${activity.expand.user.avatar}`"
                            :alt="activity.expand?.user?.name || 'User'"
                            class="h-full w-full object-cover"
                        />
                      </div>
                      <div v-else class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-medium">
                        {{ activity.expand?.user?.name ? activity.expand.user.name.charAt(0).toUpperCase() : (activity.expand?.user?.email ? activity.expand.user.email.charAt(0).toUpperCase() : 'U') }}
                      </div>
                    </div>
                    <p class="truncate text-sm font-medium text-primary-600">
                      {{ activity.expand?.user?.name || activity.expand?.user?.email || 'Utilisateur inconnu' }}
                    </p>
                  </div>
                  <div class="flex-shrink-0 text-sm text-gray-500">
                    {{ formatRelativeTime(activity.created) }}
                  </div>
                </div>
                <div class="mt-2 sm:flex sm:justify-between">
                  <div class="sm:flex">
                    <p class="text-sm text-gray-900">
                      {{ getActivityDescription(activity) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li v-if="recentActivities.length === 0">
            <div class="px-4 py-4 sm:px-6 text-center text-gray-500">
              Aucune activité trouvée
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Recent comments -->
    <div id="comments" class="mt-8">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-medium text-gray-900">
          Commentaires récents
        </h2>
      </div>

      <div class="mt-4 overflow-hidden bg-white shadow sm:rounded-md">
        <div v-if="isLoading" class="flex justify-center py-10">
          <Loader2 class="h-8 w-8 text-primary-500 animate-spin" />
        </div>

        <ul v-else role="list" class="divide-y divide-gray-200">
          <li v-for="comment in recentComments" :key="comment.id">
            <div class="block hover:bg-gray-50">
              <div class="px-4 py-4 sm:px-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center min-w-0 space-x-3">
                    <div class="flex-shrink-0">
                      <div v-if="comment.expand?.user?.avatar" class="h-10 w-10 rounded-full overflow-hidden">
                        <img
                            :src="`${pocketbaseUrl}/api/files/users/${comment.expand.user.id}/${comment.expand.user.avatar}`"
                            :alt="comment.expand?.user?.name || 'User'"
                            class="h-full w-full object-cover"
                        />
                      </div>
                      <div v-else class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-medium">
                        {{ comment.expand?.user?.name ? comment.expand.user.name.charAt(0).toUpperCase() : (comment.expand?.user?.email ? comment.expand.user.email.charAt(0).toUpperCase() : 'U') }}
                      </div>
                    </div>
                    <p class="truncate text-sm font-medium text-primary-600">
                      {{ comment.expand?.user?.name || comment.expand?.user?.email || 'Utilisateur inconnu' }}
                    </p>
                  </div>
                  <div class="flex-shrink-0 text-sm text-gray-500">
                    {{ formatRelativeTime(comment.created) }}
                  </div>
                </div>
                <div class="mt-2 sm:flex sm:justify-between">
                  <div class="flex flex-col">
                    <p class="text-sm text-gray-900">
                      {{ comment.content }}
                    </p>
                    <p v-if="comment.expand?.post" class="mt-1 text-sm text-gray-500">
                      Sur l'article :
                      <NuxtLink :to="`/blog/${comment.expand.post.slug}`" class="font-medium text-primary-600">
                        {{ comment.expand.post.title }}
                      </NuxtLink>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li v-if="recentComments.length === 0">
            <div class="px-4 py-4 sm:px-6 text-center text-gray-500">
              Aucun commentaire trouvé
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'
import { FileText, Folder, Users, MessageSquare, Loader2 } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useAdminStore } from '~/stores/admin'

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

const isLoading = ref(true)
const stats = ref({
  postsCount: 0,
  categoriesCount: 0,
  usersCount: 0,
  commentsCount: 0
})
const recentPosts = ref([])
const recentActivities = ref([])
const recentComments = ref([])

onMounted(async () => {
  try {
    await loadDashboardData()
  } finally {
    isLoading.value = false
  }
})

async function loadDashboardData() {
  try {
    // Fetch all required data in parallel
    const [posts, categories, users, activities, comments] = await Promise.all([
      fetchPosts(),
      fetchCategories(),
      fetchUsers(),
      fetchActivities(),
      fetchComments()
    ])

    // Set stats
    stats.value = {
      postsCount: posts.length,
      categoriesCount: categories.length,
      usersCount: users.length,
      commentsCount: comments.length
    }

    // Set recent data
    recentPosts.value = posts.slice(0, 5)
    recentActivities.value = activities.slice(0, 5)
    recentComments.value = comments.slice(0, 5)
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  }
}

async function fetchPosts() {
  return await adminStore.fetchAdminPosts()
}

async function fetchCategories() {
  return await adminStore.fetchAdminCategories()
}

async function fetchUsers() {
  return await adminStore.fetchUsers()
}

async function fetchActivities() {
  return await adminStore.fetchUserActivities()
}

async function fetchComments() {
  try {
    // Fetch comments with expanded post and user
    const response = await authStore.pb.collection('comments').getFullList({
      sort: '-created',
      expand: 'post,user'
    })

    return response
  } catch (error) {
    console.error('Failed to fetch comments:', error)
    return []
  }
}

function truncateText(text, maxLength) {
  if (!text) return ''

  if (text.length <= maxLength) return text

  return text.substring(0, maxLength) + '...'
}

function formatDate(dateString) {
  const date = new Date(dateString)

  // French date formatting
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

function formatRelativeTime(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  // Less than a minute
  if (diffInSeconds < 60) {
    return 'À l\'instant'
  }

  // Less than an hour
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`
  }

  // Less than a day
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`
  }

  // Less than a week
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`
  }

  // Default to standard date format
  return formatDate(dateString)
}

function getActivityDescription(activity) {
  const type = activity.activity.type
  const data = activity.activity.data || {}

  switch (type) {
    case 'login':
      return 'S\'est connecté'
    case 'logout':
      return 'S\'est déconnecté'
    case 'profile_update':
      return 'A mis à jour son profil'
    case 'password_change':
      return 'A changé son mot de passe'
    case 'post_view':
      return `A lu l'article "${data.postTitle || 'Titre inconnu'}"`
    case 'post_like':
      return `A aimé l'article "${data.postTitle || 'Titre inconnu'}"`
    case 'post_unlike':
      return `A retiré son j'aime sur l'article "${data.postTitle || 'Titre inconnu'}"`
    case 'post_comment':
      return `A commenté l'article "${data.postTitle || 'Titre inconnu'}"`
    default:
      return 'Activité non spécifiée'
  }
}
</script>