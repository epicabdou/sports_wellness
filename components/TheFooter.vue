<!-- components/TheFooter.vue -->
<template>
  <footer class="bg-gray-900 text-white">
    <div class="container-custom py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand and description -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center space-x-2">
            <Dumbbell class="h-8 w-8 text-primary-400" />
            <span class="text-xl font-bold">Fitness & Wellness</span>
          </div>
          <p class="mt-2 text-gray-300">
            Your source for the latest fitness tips, wellness advice, and sports news.
            Stay healthy, stay informed.
          </p>
          <div class="mt-4 flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-white">
              <Instagram class="h-6 w-6" />
            </a>
            <a href="#" class="text-gray-400 hover:text-white">
              <Twitter class="h-6 w-6" />
            </a>
            <a href="#" class="text-gray-400 hover:text-white">
              <Facebook class="h-6 w-6" />
            </a>
            <a href="#" class="text-gray-400 hover:text-white">
              <Youtube class="h-6 w-6" />
            </a>
          </div>
        </div>

        <!-- Quick links -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/about" class="text-gray-400 hover:text-white transition-colors">
                About Us
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/contact" class="text-gray-400 hover:text-white transition-colors">
                Contact
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/privacy-policy" class="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/terms" class="text-gray-400 hover:text-white transition-colors">
                Terms & Conditions
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Categories -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Categories</h3>
          <ul class="space-y-2">
            <li v-for="category in categories" :key="category.id">
              <NuxtLink :to="`/category/${category.slug}`" class="text-gray-400 hover:text-white transition-colors">
                {{ category.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-8 pt-8 border-t border-gray-700 text-gray-400 text-sm">
        <div class="flex flex-col md:flex-row justify-between">
          <p>© {{ new Date().getFullYear() }} Fitness & Wellness Blog. All rights reserved.</p>
          <p class="mt-2 md:mt-0">Designed and developed with ❤️ for a healthier world</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Dumbbell, Instagram, Twitter, Facebook, Youtube } from 'lucide-vue-next';

const { getCategories } = usePocketBase();
const categories = ref([]);

onMounted(async () => {
  try {
    categories.value = await getCategories();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
});
</script>