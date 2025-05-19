<!-- layouts/default.vue (corrigé) -->
<!-- layouts/default.vue (updated with newsletter link) -->
<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo and site name -->
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <NuxtLink to="/" class="text-primary-600 font-bold text-xl">
                Sport & Bien-être
              </NuxtLink>
            </div>

            <!-- Navigation links for larger screens -->
            <nav class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NuxtLink to="/"
                        class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                        :class="route.path === '/' ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
              >
                Accueil
              </NuxtLink>

              <NuxtLink to="/blog"
                        class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                        :class="route.path.startsWith('/blog') ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
              >
                Blog
              </NuxtLink>

              <NuxtLink to="/categories"
                        class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                        :class="route.path.startsWith('/categories') ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
              >
                Catégories
              </NuxtLink>

              <NuxtLink to="/newsletter"
                        class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                        :class="route.path.startsWith('/newsletter') ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
              >
                Newsletter
              </NuxtLink>
            </nav>
          </div>

          <!-- Right side buttons -->
          <div class="flex items-center">
            <!-- Search button -->
            <button
                @click="isSearchOpen = true"
                class="p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <Search class="h-5 w-5" />
            </button>

            <!-- User dropdown or login button -->
            <div class="ml-4 relative flex-shrink-0">
              <div v-if="authStore.isLoggedIn">
                <button
                    @click="isUserMenuOpen = !isUserMenuOpen"
                    class="flex text-sm rounded-full focus:outline-none"
                >
                  <span class="sr-only">Ouvrir le menu utilisateur</span>
                  <div v-if="authStore.userAvatar" class="h-8 w-8 rounded-full overflow-hidden">
                    <img :src="authStore.userAvatar" alt="Avatar" class="h-full w-full object-cover">
                  </div>
                  <div v-else class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-medium">
                    {{ authStore.user?.name ? authStore.user.name.charAt(0).toUpperCase() : (authStore.user?.email ? authStore.user.email.charAt(0).toUpperCase() : 'U') }}
                  </div>
                </button>

                <!-- User dropdown menu -->
                <HeadlessTransitionRoot
                    enter="transition ease-out duration-100"
                    enter-from="transform opacity-0 scale-95"
                    enter-to="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leave-from="transform opacity-100 scale-100"
                    leave-to="transform opacity-0 scale-95"
                    :show="isUserMenuOpen"
                >
                  <div
                      v-if="isUserMenuOpen"
                      class="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                  >
                    <NuxtLink
                        to="/account"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        @click="isUserMenuOpen = false"
                    >
                      Mon Compte
                    </NuxtLink>

                    <NuxtLink
                        v-if="authStore.isAdmin"
                        to="/admin"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        @click="isUserMenuOpen = false"
                    >
                      Administration
                    </NuxtLink>

                    <button
                        @click="logout"
                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Déconnexion
                    </button>
                  </div>
                </HeadlessTransitionRoot>
              </div>

              <div v-else>
                <NuxtLink to="/auth/login" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                  Connexion
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-grow">
      <div class="py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <slot />
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="border-t border-gray-200 pt-8 flex flex-col items-center">
          <p class="mt-2 text-base text-gray-500">
            © 2025 Sport & Bien-être. Tous droits réservés.
          </p>
          <div class="mt-4 flex space-x-6">
            <a href="#" class="text-gray-400 hover:text-gray-500">
              <span class="sr-only">Facebook</span>
              <FacebookIcon class="h-6 w-6" />
            </a>
            <a href="#" class="text-gray-400 hover:text-gray-500">
              <span class="sr-only">Instagram</span>
              <InstagramIcon class="h-6 w-6" />
            </a>
            <a href="#" class="text-gray-400 hover:text-gray-500">
              <span class="sr-only">Twitter</span>
              <TwitterIcon class="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>

    <!-- Search Modal -->
    <Dialog :open="isSearchOpen" @close="isSearchOpen = false" class="relative z-10">
      <div class="fixed inset-0 bg-black bg-opacity-25" aria-hidden="true" />

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
              Rechercher
            </DialogTitle>

            <div class="mt-4">
              <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Rechercher des articles..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  @keyup.enter="search"
              />
            </div>

            <div class="mt-4">
              <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-primary-100 px-4 py-2 text-sm font-medium text-primary-900 hover:bg-primary-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  @click="search"
              >
                Rechercher
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Dialog,
  DialogPanel,
  DialogTitle
} from '@headlessui/vue'
import {
  Search,
  FacebookIcon,
  InstagramIcon,
  TwitterIcon
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isUserMenuOpen = ref(false)
const isSearchOpen = ref(false)
const searchQuery = ref('')

onMounted(() => {
  // Initialiser l'état du store d'authentification
  if (!authStore.pb) {
    try {
      const { $pb } = useNuxtApp()
      if ($pb) {
        authStore.pb = $pb

        // Si l'utilisateur est déjà connecté dans PocketBase, mettre à jour le store
        if ($pb.authStore.isValid) {
          authStore.user = $pb.authStore.model
        }
      }
    } catch (error) {
      console.error('Error initializing auth store:', error)
    }
  }
})

function logout() {
  isUserMenuOpen.value = false
  authStore.logout()
}

function search() {
  if (searchQuery.value.trim()) {
    isSearchOpen.value = false
    router.push(`/blog/search?q=${encodeURIComponent(searchQuery.value.trim())}`)
    searchQuery.value = ''
  }
}
</script>