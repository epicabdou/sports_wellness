<!-- layouts/admin.vue -->
<!-- layouts/admin.vue (updated with newsletter link) -->
<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Off-canvas menu for mobile -->
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog as="div" class="relative z-40 md:hidden" @close="sidebarOpen = false">
        <TransitionChild
            as="template"
            enter="transition-opacity ease-linear duration-300"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leave-from="opacity-100"
            leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </TransitionChild>

        <div class="fixed inset-0 flex z-40">
          <TransitionChild
              as="template"
              enter="transition ease-in-out duration-300 transform"
              enter-from="-translate-x-full"
              enter-to="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leave-from="translate-x-0"
              leave-to="-translate-x-full"
          >
            <DialogPanel class="relative flex-1 flex flex-col max-w-xs w-full bg-primary-800">
              <TransitionChild
                  as="template"
                  enter="ease-in-out duration-300"
                  enter-from="opacity-0"
                  enter-to="opacity-100"
                  leave="ease-in-out duration-300"
                  leave-from="opacity-100"
                  leave-to="opacity-0"
              >
                <div class="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                      type="button"
                      class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      @click="sidebarOpen = false"
                  >
                    <span class="sr-only">Fermer la barre latérale</span>
                    <X class="h-6 w-6 text-white" />
                  </button>
                </div>
              </TransitionChild>

              <div class="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div class="flex-shrink-0 flex items-center px-4">
                  <span class="text-white font-bold text-xl">Administration</span>
                </div>
                <nav class="mt-5 px-2 space-y-1">
                  <NuxtLink
                      v-for="item in navigation"
                      :key="item.name"
                      :to="item.href"
                      :class="[
                      isCurrentRoute(item.href)
                        ? 'bg-primary-900 text-white'
                        : 'text-white hover:bg-primary-700',
                      'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                    ]"
                  >
                    <component :is="item.icon" class="mr-4 flex-shrink-0 h-6 w-6 text-primary-300" />
                    {{ item.name }}
                  </NuxtLink>
                </nav>
              </div>

              <div class="flex-shrink-0 flex border-t border-primary-700 p-4">
                <NuxtLink to="/" class="flex-shrink-0 group block">
                  <div class="flex items-center">
                    <div>
                      <div v-if="authStore.userAvatar" class="h-10 w-10 rounded-full overflow-hidden">
                        <img :src="authStore.userAvatar" alt="Avatar" class="h-full w-full object-cover">
                      </div>
                      <div v-else class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-medium">
                        {{ authStore.user.name ? authStore.user.name.charAt(0).toUpperCase() : authStore.user.email.charAt(0).toUpperCase() }}
                      </div>
                    </div>
                    <div class="ml-3">
                      <p class="text-base font-medium text-white">
                        {{ authStore.user.name || authStore.user.email }}
                      </p>
                      <p class="text-sm font-medium text-primary-200">
                        Retour au site
                      </p>
                    </div>
                  </div>
                </NuxtLink>
              </div>
            </DialogPanel>
          </TransitionChild>
          <div class="flex-shrink-0 w-14" aria-hidden="true">
            <!-- Force sidebar to shrink to fit close icon -->
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div class="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div class="flex-1 flex flex-col min-h-0 bg-primary-800">
        <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div class="flex items-center flex-shrink-0 px-4">
            <span class="text-white font-bold text-xl">Administration</span>
          </div>
          <nav class="mt-5 flex-1 px-2 space-y-1">
            <NuxtLink
                v-for="item in navigation"
                :key="item.name"
                :to="item.href"
                :class="[
                isCurrentRoute(item.href)
                  ? 'bg-primary-900 text-white'
                  : 'text-white hover:bg-primary-700',
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
              ]"
            >
              <component :is="item.icon" class="mr-3 flex-shrink-0 h-6 w-6 text-primary-300" />
              {{ item.name }}
            </NuxtLink>
          </nav>
        </div>
        <div class="flex-shrink-0 flex border-t border-primary-700 p-4">
          <NuxtLink to="/" class="flex-shrink-0 w-full group block">
            <div class="flex items-center">
              <div>
                <div v-if="authStore.userAvatar" class="h-9 w-9 rounded-full overflow-hidden">
                  <img :src="authStore.userAvatar" alt="Avatar" class="h-full w-full object-cover">
                </div>
                <div v-else class="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-medium">
                  {{ authStore.user.name ? authStore.user.name.charAt(0).toUpperCase() : authStore.user.email.charAt(0).toUpperCase() }}
                </div>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-white">
                  {{ authStore.user.name || authStore.user.email }}
                </p>
                <p class="text-xs font-medium text-primary-200">
                  Retour au site
                </p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="md:pl-64 flex flex-col flex-1">
      <div class="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
        <button
            type="button"
            class="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            @click="sidebarOpen = true"
        >
          <span class="sr-only">Ouvrir la barre latérale</span>
          <Menu class="h-6 w-6" />
        </button>
      </div>

      <main class="flex-1">
        <div class="py-6">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <!-- Page content -->
            <slot />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  FileText,
  Folder,
  Activity,
  Mail
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const route = useRoute()
const sidebarOpen = ref(false)

const navigation = [
  { name: 'Tableau de bord', href: '/admin', icon: LayoutDashboard },
  { name: 'Articles', href: '/admin/posts', icon: FileText },
  { name: 'Catégories', href: '/admin/categories', icon: Folder },
  { name: 'Utilisateurs', href: '/admin/users', icon: Users },
  { name: 'Activités', href: '/admin/activities', icon: Activity },
  { name: 'Newsletter', href: '/admin/newsletter', icon: Mail },
]

function isCurrentRoute(path) {
  return route.path === path || (path !== '/admin' && route.path.startsWith(path))
}
</script>