<!-- pages/index.vue -->
<template>
  <div>
    <!-- Hero section -->
    <section class="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
      <div class="container-custom">
        <div class="max-w-3xl">
          <h1 class="text-4xl md:text-5xl font-bold leading-tight">
            Empowering Your Fitness & Wellness Journey
          </h1>
          <p class="mt-4 text-xl">
            Expert advice, inspirational stories, and actionable tips for a healthier lifestyle.
          </p>
          <div class="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <NuxtLink to="/category/fitness" class="btn bg-white text-primary-600 hover:bg-gray-100">
              Explore Fitness Tips
            </NuxtLink>
            <NuxtLink to="/category/nutrition" class="btn bg-transparent border-2 border-white hover:bg-white hover:text-primary-600">
              Nutrition Guides
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured posts -->
    <section class="py-12">
      <div class="container-custom">
        <h2 class="text-3xl font-bold mb-8">Featured Articles</h2>

        <div v-if="loading" class="text-center py-16">
          <Loader class="w-10 h-10 text-primary-600 mx-auto animate-spin" />
          <p class="mt-4 text-gray-600">Loading featured articles...</p>
        </div>

        <div v-else-if="error" class="text-center py-16">
          <AlertCircle class="w-12 h-12 text-red-500 mx-auto" />
          <p class="mt-4 text-gray-800 text-lg">Failed to load articles</p>
          <p class="text-gray-600">{{ error }}</p>
        </div>

        <div v-else-if="featuredPosts.length === 0" class="text-center py-16">
          <p class="text-gray-600">No featured articles available yet. Check back soon!</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PostCard
              v-for="post in featuredPosts"
              :key="post.id"
              :post="post"
          />
        </div>

        <div class="mt-8 text-center">
          <NuxtLink to="/blog" class="btn btn-primary">
            View All Articles
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Categories section -->
    <section class="py-12 bg-gray-50">
      <div class="container-custom">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <h2 class="text-3xl font-bold">Explore Categories</h2>
          <p class="mt-4 text-gray-600">
            Discover content tailored to your fitness and wellness interests
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="category in categories" :key="category.id" class="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
            <NuxtLink :to="`/category/${category.slug}`" class="block p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ category.name }}</h3>
              <p class="text-gray-600">{{ category.description || `Explore our ${category.name} articles and guides` }}</p>
              <div class="mt-4 flex items-center text-primary-600">
                <span>Browse articles</span>
                <ArrowRight class="ml-2 w-4 h-4" />
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="py-12 bg-primary-50">
      <div class="container-custom">
        <div class="bg-white shadow-xl rounded-lg p-8 md:p-10 max-w-4xl mx-auto">
          <div class="text-center mb-6">
            <h2 class="text-2xl md:text-3xl font-bold">Stay Updated with Our Newsletter</h2>
            <p class="mt-2 text-gray-600">
              Get the latest fitness tips, wellness advice, and exclusive content delivered to your inbox.
            </p>
          </div>

          <form @submit.prevent="subscribeToNewsletter" class="mt-6">
            <div class="flex flex-col md:flex-row gap-4">
              <input
                  type="email"
                  v-model="newsletterEmail"
                  placeholder="Your email address"
                  class="flex-grow bg-gray-50 border border-gray-300 text-gray-900 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
              />
              <button type="submit" class="btn btn-primary py-3">
                Subscribe
              </button>
            </div>
            <p class="mt-2 text-sm text-gray-500">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Loader, AlertCircle, ArrowRight } from 'lucide-vue-next';

// PocketBase composables
const { getPosts, getCategories } = usePocketBase();

// Data
const featuredPosts = ref([]);
const categories = ref([]);
const loading = ref(true);
const error = ref(null);
const newsletterEmail = ref('');

// Fetch featured posts and categories
onMounted(async () => {
  try {
    const postsResult = await getPosts('published=true', '-published_date', 'category,author');
    featuredPosts.value = postsResult.items.slice(0, 6);

    const categoriesResult = await getCategories();
    categories.value = categoriesResult;

    loading.value = false;
  } catch (err) {
    error.value = err.message || 'Failed to load content';
    loading.value = false;
  }
});

// Newsletter subscription (placeholder function)
const subscribeToNewsletter = () => {
  alert(`Thank you for subscribing with ${newsletterEmail.value}! This is a demo implementation.`);
  newsletterEmail.value = '';
};
</script>