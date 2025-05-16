<!-- pages/admin/categories/index.vue -->
<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">Manage Categories</h1>
      <button @click="showAddModal = true" class="btn btn-primary inline-flex items-center">
        <Plus class="h-4 w-4 mr-2" />
        New Category
      </button>
    </div>

    <!-- Categories list -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="py-20 text-center">
        <Loader class="w-10 h-10 text-primary-600 mx-auto animate-spin" />
        <p class="mt-4 text-gray-600">Loading categories...</p>
      </div>

      <div v-else-if="categories.length === 0" class="py-20 text-center">
        <FolderX class="w-12 h-12 text-gray-400 mx-auto" />
        <p class="mt-4 text-gray-600">No categories found</p>
        <button @click="showAddModal = true" class="mt-4 inline-flex btn btn-primary">
          Create your first category
        </button>
      </div>

      <div v-else>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Slug
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Posts
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="category in categories" :key="category.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">
                {{ category.name }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ category.slug }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
              {{ category.description || 'No description' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ getCategoryPostCount(category.id) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-3">
                <NuxtLink
                    :to="`/category/${category.slug}`"
                    target="_blank"
                    class="text-gray-400 hover:text-gray-700"
                    title="View"
                >
                  <Eye class="h-5 w-5" />
                </NuxtLink>
                <button
                    @click="editCategory(category)"
                    class="text-indigo-600 hover:text-indigo-900"
                    title="Edit"
                >
                  <Edit class="h-5 w-5" />
                </button>
                <button
                    @click="confirmDelete(category)"
                    class="text-red-600 hover:text-red-900"
                    title="Delete"
                    :disabled="getCategoryPostCount(category.id) > 0"
                >
                  <Trash2
                      class="h-5 w-5"
                      :class="{ 'opacity-50 cursor-not-allowed': getCategoryPostCount(category.id) > 0 }"
                  />
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Category Modal -->
    <Teleport to="body">
      <Transition
          enter-active-class="ease-out duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="ease-in duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
      >
        <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div class="relative bg-white rounded-lg max-w-md w-full p-6">
            <button
                @click="cancelEdit"
                class="absolute top-3 right-3 text-gray-400 hover:text-gray-500"
            >
              <X class="h-5 w-5" />
            </button>

            <h3 class="text-lg font-medium text-gray-900 mb-4">
              {{ isEditing ? 'Edit Category' : 'Create New Category' }}
            </h3>

            <div v-if="error" class="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {{ error }}
            </div>

            <form @submit.prevent="saveCategory" class="space-y-4">
              <div>
                <label for="categoryName" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                    id="categoryName"
                    v-model="form.name"
                    type="text"
                    required
                    placeholder="Category name"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    @input="generateSlug"
                />
              </div>

              <div>
                <label for="categorySlug" class="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                    id="categorySlug"
                    v-model="form.slug"
                    type="text"
                    required
                    placeholder="category-slug"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                <p class="mt-1 text-sm text-gray-500">
                  This will be used as the URL for this category.
                </p>
              </div>

              <div>
                <label for="categoryDescription" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    id="categoryDescription"
                    v-model="form.description"
                    rows="3"
                    placeholder="Brief description of this category"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>

              <div class="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    @click="cancelEdit"
                    class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                    type="submit"
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    :disabled="isSaving"
                >
                  {{ isSaving ? (isEditing ? 'Saving...' : 'Creating...') : (isEditing ? 'Save Changes' : 'Create Category') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

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
            <h3 class="text-lg font-medium text-gray-900 mb-2">Delete Category</h3>
            <p class="text-gray-500 mb-4">Are you sure you want to delete "{{ categoryToDelete?.name }}"? This action cannot be undone.</p>

            <div class="flex justify-end space-x-3">
              <button
                  @click="showDeleteModal = false"
                  class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                  @click="deleteCategory"
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
import { ref, computed, onMounted } from 'vue';
import { Plus, Loader, FolderX, Eye, Edit, Trash2, X } from 'lucide-vue-next';

const { pb, getCategories, getPosts } = usePocketBase();

// State variables
const categories = ref([]);
const posts = ref([]);
const loading = ref(true);
const error = ref(null);
const showAddModal = ref(false);
const showDeleteModal = ref(false);
const categoryToDelete = ref(null);
const isEditing = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);

// Form data
const form = ref({
  name: '',
  slug: '',
  description: ''
});

// Initialize the form for creating or editing
const initForm = (category = null) => {
  if (category) {
    form.value = {
      name: category.name,
      slug: category.slug,
      description: category.description || ''
    };
    isEditing.value = true;
  } else {
    form.value = {
      name: '',
      slug: '',
      description: ''
    };
    isEditing.value = false;
  }
};

// Generate slug from name
const generateSlug = () => {
  if (!form.value.name) return;
  form.value.slug = form.value.name
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
};

// Get post count for a category
const getCategoryPostCount = (categoryId) => {
  return posts.value.filter(post => post.category === categoryId).length;
};

// Edit a category
const editCategory = (category) => {
  initForm(category);
  showAddModal.value = true;
};

// Cancel editing or creating
const cancelEdit = () => {
  showAddModal.value = false;
  error.value = null;
  setTimeout(() => {
    initForm();
  }, 300);
};

// Save a category (create or update)
const saveCategory = async () => {
  try {
    isSaving.value = true;
    error.value = null;

    if (isEditing.value) {
      // Find the current category being edited
      const currentCategory = categories.value.find(cat => cat.slug === form.value.slug && cat.name !== form.value.name);

      // Check if slug is already taken by another category
      if (currentCategory) {
        error.value = 'This slug is already in use. Please choose a different one.';
        isSaving.value = false;
        return;
      }

      // Update the category
      const categoryId = categoryToEdit.value.id;
      await pb.collection('categories').update(categoryId, form.value);

      // Update the local list
      const index = categories.value.findIndex(cat => cat.id === categoryId);
      if (index !== -1) {
        categories.value[index] = { ...categories.value[index], ...form.value };
      }
    } else {
      // Check if slug is already taken
      const existingCategory = categories.value.find(cat => cat.slug === form.value.slug);
      if (existingCategory) {
        error.value = 'This slug is already in use. Please choose a different one.';
        isSaving.value = false;
        return;
      }

      // Create a new category
      const newCategory = await pb.collection('categories').create(form.value);
      categories.value.push(newCategory);
    }

    // Close the modal and reset form
    showAddModal.value = false;
    setTimeout(() => {
      initForm();
    }, 300);
  } catch (err) {
    error.value = err.message || 'Failed to save category';
  } finally {
    isSaving.value = false;
  }
};

// Confirm delete
const confirmDelete = (category) => {
  // Check if category has posts
  if (getCategoryPostCount(category.id) > 0) {
    alert('Cannot delete a category that has posts. Please reassign or delete the posts first.');
    return;
  }

  categoryToDelete.value = category;
  showDeleteModal.value = true;
};

// Delete a category
const deleteCategory = async () => {
  if (!categoryToDelete.value) return;

  try {
    isDeleting.value = true;
    await pb.collection('categories').delete(categoryToDelete.value.id);

    // Remove the deleted category from the list
    categories.value = categories.value.filter(cat => cat.id !== categoryToDelete.value.id);

    showDeleteModal.value = false;
    categoryToDelete.value = null;
  } catch (err) {
    error.value = err.message || 'Failed to delete category';
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

    // Fetch posts to get counts for each category
    const postsData = await getPosts();
    posts.value = postsData.items;

    loading.value = false;
  } catch (err) {
    error.value = err.message || 'Failed to load data';
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