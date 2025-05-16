<!-- pages/admin/index.vue -->
<template>
  <div>
    <h1 class="text-3xl font-bold">Admin Dashboard</h1>
    <p class="mt-2 text-gray-600">Manage your blog content and monitor performance.</p>

    <!-- Dashboard stats -->
    <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Posts</p>
            <p class="mt-1 text-3xl font-semibold text-gray-900">{{ stats.totalPosts }}</p>
          </div>
          <div class="p-3 rounded-full bg-primary-100">
            <FileText class="h-6 w-6 text-primary-600" />
          </div>
        </div>
        <div class="mt-4">
          <NuxtLink to="/admin/posts" class="text-sm font-medium text-primary-600 hover:text-primary-500">
            View all posts
            <span aria-hidden="true"> &rarr;</span>
          </NuxtLink>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Published Posts</p>
            <p class="mt-1 text-3xl font-semibold text-gray-900">{{ stats.publishedPosts }}</p>
          </div>
          <div class="p-3 rounded-full bg-green-100">
            <Check class="h-6 w-6 text-green-600" />
          </div>
        </div>
        <div class="mt-4">
          <NuxtLink to="/admin/posts?filter=published" class="text-sm font-medium text-primary-600 hover:text-primary-500">
            View published posts
            <span aria-hidden="true"> &rarr;</span>
          </NuxtLink>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Draft Posts</p>
            <p class="mt-1 text-3xl font-semibold text-gray-900">{{ stats.draftPosts }}</p>
          </div>
          <div class="p-3 rounded-full bg-yellow-100">
            <Edit3 class="h-6 w-6 text-yellow-600" />
          </div>
        </div>
        <div class="mt-4">
          <NuxtLink to="/admin/posts?filter=draft" class="text-sm font-medium text-primary-600 hover:text-primary-500">
            View draft posts
            <span aria-hidden="true"> &rarr;</span>
          </NuxtLink>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Categories</p>
            <p class="mt-1 text-3xl font-semibold text-gray-900">{{ stats.categoriesCount }}</p>
          </div>
          <div class="p-3 rounded-full bg-indigo-100">
            <FolderOpen class="h-6 w-6 text-indigo-600" />
          </div>
        </div>
        <div class="mt-4">
          <NuxtLink to="/admin/categories" class="text-sm font-medium text-primary-600 hover:text-primary-500">
            Manage categories
            <span aria-hidden="true"> &rarr;</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Recent posts and quick actions -->
    <div class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Recent Posts</h2>
          </div>
          <div class="divide-y divide-gray-200">
            <div v-if="loading" class="p-6 text-center">
              <Loader class="w-8 h-8 text-primary-600 mx-auto animate-spin" />
              <p class="mt-2 text-gray-600">Loading recent posts...</p>
            </div>

            <div v-else-if="recentPosts.length === 0" class="p-6 text-center">
              <p class="text-gray-600">No posts available yet.</p>
            </div>

            <div v-else v-for="post in recentPosts" :key="post.id" class="p-6 hover:bg-gray-50">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <img
                        v-if="post.featured_image"
                        :src="getImageUrl(post.featured_image)"
                        :alt="post.title"
                        class="h-10 w-10 rounded object-cover"
                    />
                    <div v-else class="h-10 w-10 rounded bg-primary-100 flex items-center justify-center">
                      <FileText class="h-5 w-5 text-primary-600" />
                    </div>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-sm font-medium text-gray-900">{{ post.title }}</h3>
                    <div class="mt-1 flex items-center">
                      <span class="text-xs text-gray-500">
                        {{ post.expand?.category?.name || 'Uncategorized' }}
                      </span>
                      <span class="mx-1 text-gray-500">&middot;</span>
                      <span class="text-xs text-gray-500">
                        {{ post.published ? 'Published' : 'Draft' }}
                      </span>
                      <span v-if="post.published_date" class="mx-1 text-gray-500">&middot;</span>
                      <span v-if="post.published_date" class="text-xs text-gray-500">
                        {{ formatDate(post.published_date) }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <NuxtLink
                      :to="`/admin/posts/edit/${post.id}`"
                      class="text-gray-400 hover:text-primary-600"
                      title="Edit post"
                  >
                    <Edit2 class="h-5 w-5" />
                  </NuxtLink>
                  <NuxtLink
                      v-if="post.published"
                      :to="`/blog/${post.slug}`"
                      target="_blank"
                      class="text-gray-400 hover:text-primary-600"
                      title="View post"
                  >
                    <ExternalLink class="h-5 w-5" />
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-gray-200">
            <NuxtLink to="/admin/posts" class="text-sm font-medium text-primary-600 hover:text-primary-500">
              View all posts
              <span aria-hidden="true"> &rarr;</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <div>
        <div class="bg-white rounded-lg shadow">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Quick Actions</h2>
          </div>
          <div class="p-6 space-y-4">
            <NuxtLink to="/admin/posts/new" class="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div class="p-2 rounded-full bg-primary-100">
                <PlusCircle class="h-5 w-5 text-primary-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-900">New Post</p>
                <p class="text-xs text-gray-500">Create a new blog post</p>
              </div>
            </NuxtLink>

            <NuxtLink to="/admin/categories/new" class="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div class="p-2 rounded-full bg-primary-100">
                <FolderPlus class="h-5 w-5 text-primary-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-900">New Category</p>
                <p class="text-xs text-gray-500">Create a new category</p>
              </div>
            </NuxtLink>

            <NuxtLink to="/admin/profile" class="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div class="p-2 rounded-full bg-primary-100">
                <UserCircle class="h-5 w-5 text-primary-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-900">Edit Profile</p>
                <p class="text-xs text-gray-500">Update your profile information</p>
              </div>
            </NuxtLink>
          </div>
        </div>

        <div class="mt-6 bg-white rounded-lg shadow">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Tips</h2>
          </div>
          <div class="p-6">
            <div class="space-y-4 text-sm text-gray-600">
              <div class="flex">
                <div class="flex-shrink-0">
                  <LightbulbOutline class="h-5 w-5 text-yellow-500" />
                </div>
                <p class="ml-3">Use tags to make your articles more discoverable.</p>
              </div>
              <div class="flex">
                <div class="flex-shrink-0">
                  <LightbulbOutline class="h-5 w-5 text-yellow-500" />
                </div>
                <p class="ml-3">Add high-quality images to make your posts more engaging.</p>
              </div>
              <div class="flex">
                <div class="flex-shrink-0">
                  <LightbulbOutline class="h-5 w-5 text-yellow-500" />
                </div>
                <p class="ml-3">Write clear and concise excerpts to attract more readers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { FileText, Check, Edit3, FolderOpen, Edit2, ExternalLink, PlusCircle, FolderPlus, UserCircle } from 'lucide-vue-next';
import { LightbulbOutline } from '@heroicons/vue/outline';

const { getPosts, getCategories, pb } = usePocketBase();

// Data
const recentPosts = ref([]);
const allPosts = ref([]);
const categories = ref([]);
const loading = ref(true);

// Computed stats
const stats = computed(() => {
  return {
    totalPosts: allPosts.value.length,
    publishedPosts: allPosts.value.filter(post => post.published).length,
    draftPosts: allPosts.value.filter(post => !post.published).length,
    categoriesCount: categories.value.length
  };
});

// Format dates
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Get image URL from PocketBase
const getImageUrl = (fileName) => {
  if (!fileName) return '';
  return `${pb.baseUrl}/api/files/${fileName}`;
};

// Fetch data on mount
onMounted(async () => {
  try {
    const postsResult = await getPosts('', '-created', 'category,author');
    allPosts.value = postsResult.items;
    recentPosts.value = postsResult.items.slice(0, 5);

    const categoriesResult = await getCategories();
    categories.value = categoriesResult;

    loading.value = false;
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
    loading.value = false;
  }
});
</script>

<script>
// Set the layout for this page
export default {
  layout: 'admin'
};
</script>