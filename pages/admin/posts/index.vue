<!-- pages/admin/posts/index.vue -->
<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">Manage Posts</h1>
      <NuxtLink to="/admin/posts/new" class="btn btn-primary inline-flex items-center">
        <Plus class="h-4 w-4 mr-2" />
        New Post
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
        <div class="flex-grow">
          <label for="search" class="sr-only">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search class="h-5 w-5 text-gray-400" />
            </div>
            <input
                id="search"
                v-model="searchQuery"
                type="text"
                placeholder="Search posts..."
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div class="flex space-x-4">
          <div>
            <label for="categoryFilter" class="sr-only">Category</label>
            <select
                id="categoryFilter"
                v-model="categoryFilter"
                class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
            >
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <div>
            <label for="statusFilter" class="sr-only">Status</label>
            <select
                id="statusFilter"
                v-model="statusFilter"
                class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Data table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="py-20 text-center">
        <Loader class="w-10 h-10 text-primary-600 mx-auto animate-spin" />
        <p class="mt-4 text-gray-600">Loading posts...</p>
      </div>

      <div v-else-if="filteredPosts.length === 0" class="py-20 text-center">
        <FileX class="w-12 h-12 text-gray-400 mx-auto" />
        <p class="mt-4 text-gray-600">No posts found</p>
        <NuxtLink to="/admin/posts/new" class="mt-4 inline-flex btn btn-primary">
          Create your first post
        </NuxtLink>
      </div>

      <div v-else>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Post
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="post in filteredPosts" :key="post.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
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
                  <div class="text-sm font-medium text-gray-900">
                    {{ post.title }}
                  </div>
                  <div class="text-sm text-gray-500">
                    /blog/{{ post.slug }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">
                {{ getCategoryName(post.category) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                >
                  {{ post.published ? 'Published' : 'Draft' }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(post.published ? post.published_date : post.created) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-3">
                <NuxtLink
                    v-if="post.published"
                    :to="`/blog/${post.slug}`"
                    target="_blank"
                    class="text-gray-400 hover:text-gray-700"
                    title="View"
                >
                  <Eye class="h-5 w-5" />
                </NuxtLink>
                <NuxtLink
                    :to="`/admin/posts/edit/${post.id}`"
                    class="text-indigo-600 hover:text-indigo-900"
                    title="Edit"
                >
                  <Edit class="h-5 w-5" />
                </NuxtLink>
                <button
                    @click="confirmDelete(post)"
                    class="text-red-600 hover:text-red-900"
                    title="Delete"
                >
                  <Trash2 class="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">{{ startIndex + 1 }}</span> to
                <span class="font-medium">{{ Math.min(endIndex, totalPosts) }}</span> of
                <span class="font-medium">{{ totalPosts }}</span> results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                    @click="prevPage"
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''"
                >
                  <span class="sr-only">Previous</span>
                  <ChevronLeft class="h-5 w-5" />
                </button>

                <button
                    v-for="page in visiblePageNumbers"
                    :key="page"
                    @click="goToPage(page)"
                    :class="[
                    page === currentPage
                      ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                  ]"
                >
                  {{ page }}
                </button>

                <button
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''"
                >
                  <span class="sr-only">Next</span>
                  <ChevronRight class="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition
          enter-active-class="ease-out duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="ease-in duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
      >
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div class="relative bg-white rounded-lg max-w-md w-full p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Delete Post</h3>
            <p class="text-gray-500 mb-4">Are you sure you want to delete "{{ postToDelete?.title }}"? This action cannot be undone.</p>

            <div class="flex justify-end space-x-3">
              <button
                  @click="showDeleteModal = false"
                  class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                  @click="deletePost"
                  class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  :disabled="isDeleting"
              >
                {{ isDeleting ? 'Deleting...' : 'Delete' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { Plus, Search, FileText, Eye, Edit, Trash2, Loader, FileX, ChevronLeft, ChevronRight } from 'lucide-vue-next';

const { pb, getPosts, getCategories, deletePost: apiDeletePost } = usePocketBase();

// State variables
const posts = ref([]);
const categories = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref('');
const categoryFilter = ref('');
const statusFilter = ref('');
const currentPage = ref(1);
const pageSize = 10;
const totalPosts = ref(0);
const showDeleteModal = ref(false);
const postToDelete = ref(null);
const isDeleting = ref(false);

// Computed properties
const filteredPosts = computed(() => {
  let result = [...posts.value];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query)
    );
  }

  // Apply category filter
  if (categoryFilter.value) {
    result = result.filter(post => post.category === categoryFilter.value);
  }

  // Apply status filter
  if (statusFilter.value === 'published') {
    result = result.filter(post => post.published);
  } else if (statusFilter.value === 'draft') {
    result = result.filter(post => !post.published);
  }

  return result;
});

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return filteredPosts.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredPosts.value.length / pageSize);
});

const startIndex = computed(() => {
  return (currentPage.value - 1) * pageSize;
});

const endIndex = computed(() => {
  return startIndex.value + paginatedPosts.value.length;
});

const visiblePageNumbers = computed(() => {
  const pages = [];
  const maxVisiblePages = 5;

  if (totalPages.value <= maxVisiblePages) {
    // Show all pages if there are fewer pages than the maximum visible
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    // Show a subset of pages with the current page in the middle
    const middleIndex = Math.floor(maxVisiblePages / 2);
    let startPage = currentPage.value - middleIndex;
    let endPage = currentPage.value + middleIndex;

    // Adjust if we're at the beginning or end
    if (startPage < 1) {
      startPage = 1;
      endPage = maxVisiblePages;
    } else if (endPage > totalPages.value) {
      endPage = totalPages.value;
      startPage = totalPages.value - maxVisiblePages + 1;
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  }

  return pages;
});

// Methods
const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId);
  return category ? category.name : 'Uncategorized';
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getImageUrl = (fileName) => {
  if (!fileName) return '';
  return `${pb.baseUrl}/api/files/${fileName}`;
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const goToPage = (page) => {
  currentPage.value = page;
};

const confirmDelete = (post) => {
  postToDelete.value = post;
  showDeleteModal.value = true;
};

const deletePost = async () => {
  if (!postToDelete.value) return;

  try {
    isDeleting.value = true;
    await apiDeletePost(postToDelete.value.id);

    // Remove the deleted post from the list
    posts.value = posts.value.filter(p => p.id !== postToDelete.value.id);

    showDeleteModal.value = false;
    postToDelete.value = null;
  } catch (err) {
    error.value = err.message || 'Failed to delete post';
  } finally {
    isDeleting.value = false;
  }
};

// Load data on mount
onMounted(async () => {
  try {
    loading.value = true;

    // Fetch categories
    const categoriesData = await getCategories();
    categories.value = categoriesData;

    // Fetch posts
    const postsData = await getPosts('', '-created', 'category,author');
    posts.value = postsData.items;
    totalPosts.value = postsData.totalItems;

    loading.value = false;
  } catch (err) {
    error.value = err.message || 'Failed to load data';
    loading.value = false;
  }
});

// Reset to page 1 when filters change
watch([searchQuery, categoryFilter, statusFilter], () => {
  currentPage.value = 1;
});
</script>

<script>
// Set the layout for this page
export default {
  layout: 'admin'
};
</script>