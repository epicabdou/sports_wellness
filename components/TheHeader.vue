<!-- components/TheHeader.vue with fixed Menu component -->
<template>
  <header class="bg-white shadow">
    <div class="container-custom">
      <div class="flex justify-between items-center py-4">
        <!-- Logo and brand -->
        <div class="flex items-center space-x-2">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <Dumbbell class="h-8 w-8 text-primary-600" />
            <span class="text-xl font-bold text-gray-900">Fitness & Wellness</span>
          </NuxtLink>
        </div>

        <!-- Navigation -->
        <nav class="hidden md:flex space-x-6">
          <NuxtLink
              v-for="category in categories"
              :key="category.id"
              :to="`/category/${category.slug}`"
              class="text-gray-600 hover:text-primary-600 transition-colors font-medium"
          >
            {{ category.name }}
          </NuxtLink>
          <NuxtLink to="/about" class="text-gray-600 hover:text-primary-600 transition-colors font-medium">
            About
          </NuxtLink>
        </nav>

        <!-- Mobile menu button -->
        <div class="flex md:hidden">
          <button @click="isOpen = !isOpen" class="text-gray-500 hover:text-primary-600">
            <Menu v-if="!isOpen" class="h-6 w-6" />
            <X v-else class="h-6 w-6" />
          </button>
        </div>

        <!-- User actions -->
        <div class="hidden md:flex items-center space-x-4">
          <div v-if="authStore.isAuthenticated">
            <!-- Fixed Menu component with as="div" prop -->
            <Menu as="div" class="relative">
              <MenuButton class="flex items-center space-x-1 text-gray-600 hover:text-primary-600">
                <UserCircle class="h-6 w-6" />
                <span>{{ authStore.user?.name }}</span>
                <ChevronDown class="h-4 w-4" />
              </MenuButton>
              <transition
                  enter-active-class="transition duration-100 ease-out"
                  enter-from-class="transform scale-95 opacity-0"
                  enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-75 ease-in"
                  leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform scale-95 opacity-0"
              >
                <MenuItems class="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div class="px-1 py-1">
                    <MenuItem v-slot="{ active }">
                      <NuxtLink
                          to="/admin"
                          :class="[
                          active ? 'bg-primary-100 text-primary-900' : 'text-gray-700',
                          'group flex w-full items-center rounded-md px-2 py-2 text-sm'
                        ]"
                      >
                        Dashboard
                      </NuxtLink>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <button
                          @click="handleLogout"
                          :class="[
                          active ? 'bg-primary-100 text-primary-900' : 'text-gray-700',
                          'group flex w-full items-center rounded-md px-2 py-2 text-sm'
                        ]"
                      >
                        Logout
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>
          <div v-else class="flex space-x-4">
            <NuxtLink to="/login" class="text-gray-600 hover:text-primary-600">Log in</NuxtLink>
            <NuxtLink to="/register" class="btn btn-primary">Sign up</NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="isOpen" class="md:hidden">
      <div class="container-custom px-2 pt-2 pb-3 space-y-1">
        <NuxtLink
            v-for="category in categories"
            :key="category.id"
            :to="`/category/${category.slug}`"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
            @click="isOpen = false"
        >
          {{ category.name }}
        </NuxtLink>
        <NuxtLink
            to="/about"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
            @click="isOpen = false"
        >
          About
        </NuxtLink>

        <div class="pt-4 pb-3 border-t border-gray-200">
          <div v-if="authStore.isAuthenticated" class="space-y-1">
            <NuxtLink
                to="/admin"
                class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                @click="isOpen = false"
            >
              Dashboard
            </NuxtLink>
            <button
                @click="handleLogout"
                class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
          <div v-else class="space-y-1">
            <NuxtLink
                to="/login"
                class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                @click="isOpen = false"
            >
              Log in
            </NuxtLink>
            <NuxtLink
                to="/register"
                class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                @click="isOpen = false"
            >
              Sign up
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Menu, MenuItem, MenuItems, MenuButton } from '@headlessui/vue';
import { Dumbbell, Menu as MenuIcon, X, UserCircle, ChevronDown } from 'lucide-vue-next';

const { authStore, logout, getCategories } = usePocketBase();
const router = useRouter();
const isOpen = ref(false);
const categories = ref([]);

const handleLogout = () => {
  logout();
  router.push('/');
};

onMounted(async () => {
  try {
    categories.value = await getCategories();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
});
</script>