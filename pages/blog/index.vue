<!-- pages/blog/index.vue -->
<template>
  <div>
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold">Latest Articles</h1>
      <p class="mt-4 text-xl text-gray-600">
        Discover the latest insights, tips, and stories about fitness and wellness.
      </p>

      <div class="mt-8 flex flex-wrap gap-4">
        <NuxtLink
            to="/blog"
            class="px-4 py-2 rounded-full transition-colors"
            :class="!currentCategory ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
        >
          All
        </NuxtLink>
        <NuxtLink
            v-for="category in categories"
            :key="category.id"
            :to="`/category/${category.slug}`"
            class="px-4 py-2 rounded-full transition-colors"
            :class="currentCategory === category.slug ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
        >
          {{ category.name }}
        </NuxtLink>
      </div>
    </div>

    <div class="mt-12">
      <div v-if="loading" class="text-center py-16">
        <Loader class="w-10 h-10 text-primary-600 mx-auto animate-spin" />
        <p class="mt-4 text-gray-600">Loading articles...</p>
      </div>

      <div v-else-if="error" class="text-center py-16">
        <AlertCircle class="w-12 h-12 text-red-500 mx-auto" />
        <p class="mt-4 text-gray-800 text-lg">Failed to load articles</p>
        <p class="text-gray-600">{{ error }}</p>
      </div>

      <div v-else-if="posts.length === 0" class="text-center py-16">
        <p class="text-gray-600">No articles available yet. Check back soon!</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <PostCard
            v-for="post in posts"
            :key="post.id"
            :post="post"
        />
      </div>

      <!-- Pagination -->
      <div v-if="posts.length > 0" class="mt-12 flex justify-center">
        <nav class="inline-flex rounded-md shadow">
          <button
              v-if="currentPage > 1"
              @click="loadPage(currentPage - 1)"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50"
          >
            <ChevronLeft class="w-5 h-5" />
          </button>
          <div class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
            Page {{ currentPage }} of {{ totalPages }}
          </div>
          <button
              v-if="currentPage < totalPages"
              @click="loadPage(currentPage + 1)"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50"
          >
            <ChevronRight class="w-5 h-5" />
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Loader, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-vue-next';

const route = useRoute();
const { getPosts, getCategories, getPostsByCategory } = usePocketBase();

// Data
const posts = ref([]);
const categories = ref([]);
const loading = ref(true);
const error = ref(null);
const currentPage = ref(1);
const pageSize = 9;
const totalItems = ref(0);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize));
const currentCategory = computed(() => route.params.slug);

// Load posts for the specified page
const loadPage = async (page) => {
  loading.value = true;
  currentPage.value = page;

  try {
    let result;

    if (currentCategory.value) {
      // If we're in a category page, use the category filter
      result = await getPostsByCategory(currentCategory.value);
    } else {
      // Otherwise, get all published posts
      result = await getPosts(
          'published=true',
          '-published_date',
          'category,author'
      );
    }

    posts.value = result.items;
    totalItems.value = result.totalItems;
    loading.value = false;
  } catch (err) {
    error.value = err.message || 'Failed to load articles';
    loading.value = false;
  }
};

// Fetch posts and categories on mount
onMounted(async () => {
  try {
    // Get categories for the filter
    const categoriesResult = await getCategories();
    categories.value = categoriesResult;

    // Load the first page of posts
    await loadPage(1);
  } catch (err) {
    error.value = err.message || 'Failed to load content';
    loading.value = false;
  }
});
</script>