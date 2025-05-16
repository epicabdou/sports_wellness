<!-- pages/category/[slug].vue -->
<template>
  <div>
    <div v-if="loading" class="text-center py-16">
      <Loader class="w-10 h-10 text-primary-600 mx-auto animate-spin" />
      <p class="mt-4 text-gray-600">Loading category...</p>
    </div>

    <div v-else-if="error" class="text-center py-16">
      <AlertCircle class="w-12 h-12 text-red-500 mx-auto" />
      <p class="mt-4 text-gray-800 text-lg">Failed to load category</p>
      <p class="text-gray-600">{{ error }}</p>
      <NuxtLink to="/blog" class="mt-6 inline-flex btn btn-primary">
        Back to Blog
      </NuxtLink>
    </div>

    <div v-else>
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold">{{ category.name }}</h1>
        <p v-if="category.description" class="mt-4 text-xl text-gray-600">
          {{ category.description }}
        </p>

        <div class="mt-8 flex flex-wrap gap-4">
          <NuxtLink
              to="/blog"
              class="px-4 py-2 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
          >
            All
          </NuxtLink>
          <NuxtLink
              v-for="cat in categories"
              :key="cat.id"
              :to="`/category/${cat.slug}`"
              class="px-4 py-2 rounded-full transition-colors"
              :class="cat.slug === category.slug ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
          >
            {{ cat.name }}
          </NuxtLink>
        </div>
      </div>

      <div class="mt-12">
        <div v-if="loadingPosts" class="text-center py-16">
          <Loader class="w-10 h-10 text-primary-600 mx-auto animate-spin" />
          <p class="mt-4 text-gray-600">Loading articles...</p>
        </div>

        <div v-else-if="posts.length === 0" class="text-center py-16">
          <p class="text-gray-600">No articles available in this category yet. Check back soon!</p>
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Loader, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-vue-next';

const route = useRoute();
const { pb, getCategories, getPostsByCategory } = usePocketBase();

// Data
const category = ref(null);
const categories = ref([]);
const posts = ref([]);
const loading = ref(true);
const loadingPosts = ref(true);
const error = ref(null);
const currentPage = ref(1);
const pageSize = 9;
const totalItems = ref(0);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize));

// Load posts for the specified page
const loadPage = async (page) => {
  loadingPosts.value = true;
  currentPage.value = page;

  try {
    if (category.value) {
      // Get posts for the current category
      const result = await getPostsByCategory(category.value.slug);
      posts.value = result.items;
      totalItems.value = result.totalItems;
    }

    loadingPosts.value = false;
  } catch (err) {
    error.value = err.message || 'Failed to load articles';
    loadingPosts.value = false;
  }
};

// Fetch category and posts on mount
onMounted(async () => {
  try {
    const slug = route.params.slug;

    // Get all categories
    const allCategories = await getCategories();
    categories.value = allCategories;

    // Find the current category by slug
    const currentCategory = allCategories.find(c => c.slug === slug);

    if (!currentCategory) {
      throw new Error('Category not found');
    }

    category.value = currentCategory;
    loading.value = false;

    // Load the first page of posts
    await loadPage(1);
  } catch (err) {
    error.value = err.message || 'Failed to load category';
    loading.value = false;
    loadingPosts.value = false;
  }
});
</script>