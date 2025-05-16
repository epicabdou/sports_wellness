<!-- pages/admin/posts/edit/[id].vue -->
<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">{{ isNewPost ? 'Create New Post' : 'Edit Post' }}</h1>
      <div class="flex space-x-4">
        <button
            @click="router.push('/admin/posts')"
            class="btn btn-outline inline-flex items-center"
        >
          <X class="h-4 w-4 mr-2" />
          Cancel
        </button>
        <button
            @click="saveAsDraft"
            class="btn btn-secondary inline-flex items-center"
            :disabled="isSaving"
        >
          <Save class="h-4 w-4 mr-2" />
          Save Draft
        </button>
        <button
            @click="publishPost"
            class="btn btn-primary inline-flex items-center"
            :disabled="isSaving || !isFormValid"
        >
          <Send class="h-4 w-4 mr-2" />
          {{ isNewPost ? 'Publish' : 'Update' }}
        </button>
      </div>
    </div>

    <div v-if="error" class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
      {{ error }}
    </div>

    <div v-if="isLoading" class="flex justify-center py-20">
      <Loader class="w-10 h-10 text-primary-600 animate-spin" />
    </div>

    <form v-else @submit.prevent="publishPost" class="space-y-8">
      <!-- Two-column layout for larger screens -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main content column -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Title input -->
          <div class="card p-6">
            <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
                id="title"
                v-model="form.title"
                type="text"
                required
                placeholder="Post title"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                @input="generateSlug"
            />
          </div>

          <!-- Content textarea -->
          <div class="card p-6">
            <label for="content" class="block text-sm font-medium text-gray-700 mb-1">Content (Markdown)</label>
            <textarea
                id="content"
                v-model="form.content"
                rows="15"
                required
                placeholder="Write your post content here using Markdown..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            ></textarea>
            <div class="mt-2 flex justify-between text-sm text-gray-500">
              <span>Supports Markdown formatting</span>
              <button
                  type="button"
                  @click="showPreview = !showPreview"
                  class="text-primary-600 hover:text-primary-500"
              >
                {{ showPreview ? 'Hide preview' : 'Show preview' }}
              </button>
            </div>
          </div>

          <!-- Content preview -->
          <div v-if="showPreview" class="card p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Content Preview</h3>
            <div class="prose prose-sm sm:prose-base max-w-none border p-4 rounded-md bg-gray-50">
              <div v-html="renderedContent"></div>
            </div>
          </div>

          <!-- Excerpt -->
          <div class="card p-6">
            <label for="excerpt" class="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea
                id="excerpt"
                v-model="form.excerpt"
                rows="3"
                required
                placeholder="Write a brief summary of your post..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            ></textarea>
            <p class="mt-1 text-sm text-gray-500">
              This will be displayed on the blog listing page and in search results.
            </p>
          </div>
        </div>

        <!-- Sidebar column -->
        <div class="space-y-6">
          <!-- Featured image -->
          <div class="card p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Featured Image</h3>

            <div v-if="form.featured_image || previewImage" class="mb-4">
              <img
                  :src="previewImage || getImageUrl(form.featured_image)"
                  alt="Featured image preview"
                  class="w-full h-48 object-cover rounded-md"
              />
            </div>

            <div v-else class="mb-4 border-2 border-dashed border-gray-300 rounded-md h-48 flex items-center justify-center">
              <div class="text-center">
                <ImageIcon class="h-12 w-12 text-gray-400 mx-auto" />
                <p class="mt-1 text-sm text-gray-500">No image selected</p>
              </div>
            </div>

            <input
                type="file"
                ref="fileInput"
                accept="image/*"
                class="hidden"
                @change="handleImageUpload"
            />

            <div class="flex space-x-2">
              <button
                  type="button"
                  @click="$refs.fileInput.click()"
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {{ form.featured_image ? 'Change Image' : 'Select Image' }}
              </button>
              <button
                  v-if="form.featured_image || previewImage"
                  type="button"
                  @click="removeImage"
                  class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- Slug -->
          <div class="card p-6">
            <label for="slug" class="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <div class="flex rounded-md shadow-sm">
              <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                /blog/
              </span>
              <input
                  id="slug"
                  v-model="form.slug"
                  type="text"
                  required
                  placeholder="post-url-slug"
                  class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <p class="mt-1 text-sm text-gray-500">
              This will be used as the URL for your post.
            </p>
          </div>

          <!-- Category -->
          <div class="card p-6">
            <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
                id="category"
                v-model="form.category"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="" disabled>Select a category</option>
              <option
                  v-for="category in categories"
                  :key="category.id"
                  :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
            <div class="mt-2 flex justify-between items-center">
              <p class="text-sm text-gray-500">
                Choose a category for your post.
              </p>
              <button
                  type="button"
                  @click="showCategoryModal = true"
                  class="text-sm text-primary-600 hover:text-primary-500"
              >
                + New Category
              </button>
            </div>
          </div>

          <!-- Tags -->
          <div class="card p-6">
            <label for="tags" class="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <div class="relative">
              <input
                  id="tags"
                  v-model="tagInput"
                  type="text"
                  placeholder="Add tags (press Enter to add)"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  @keydown.enter.prevent="addTag"
              />
              <button
                  type="button"
                  @click="addTag"
                  class="absolute right-1 top-1 p-1 text-gray-400 hover:text-gray-600"
              >
                <PlusCircle class="h-5 w-5" />
              </button>
            </div>

            <div v-if="form.tags && form.tags.length > 0" class="mt-2 flex flex-wrap gap-2">
              <div
                  v-for="(tag, index) in form.tags"
                  :key="index"
                  class="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
              >
                <span class="text-gray-800">{{ tag }}</span>
                <button
                    type="button"
                    @click="removeTag(index)"
                    class="ml-1 text-gray-400 hover:text-gray-600"
                >
                  <X class="h-3 w-3" />
                </button>
              </div>
            </div>

            <p class="mt-2 text-sm text-gray-500">
              Tags help users find your content.
            </p>
          </div>

          <!-- Publishing options -->
          <div class="card p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Publishing Options</h3>

            <div class="space-y-4">
              <div class="flex items-center">
                <input
                    id="published"
                    v-model="form.published"
                    type="checkbox"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label for="published" class="ml-2 block text-sm text-gray-900">
                  Publish immediately
                </label>
              </div>

              <div v-if="form.published">
                <label for="published_date" class="block text-sm font-medium text-gray-700 mb-1">
                  Publication date
                </label>
                <input
                    id="published_date"
                    v-model="form.published_date"
                    type="datetime-local"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                <p class="mt-1 text-sm text-gray-500">
                  Leave empty to use current date and time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>

    <!-- New Category Modal -->
    <Teleport to="body">
      <Transition
          enter-active-class="ease-out duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="ease-in duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
      >
        <div v-if="showCategoryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div class="relative bg-white rounded-lg max-w-md w-full p-6">
            <button
                @click="showCategoryModal = false"
                class="absolute top-3 right-3 text-gray-400 hover:text-gray-500"
            >
              <X class="h-5 w-5" />
            </button>

            <h3 class="text-lg font-medium text-gray-900 mb-4">Create New Category</h3>

            <div v-if="categoryError" class="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {{ categoryError }}
            </div>

            <form @submit.prevent="createCategory" class="space-y-4">
              <div>
                <label for="categoryName" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                    id="categoryName"
                    v-model="newCategory.name"
                    type="text"
                    required
                    placeholder="Category name"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    @input="generateCategorySlug"
                />
              </div>

              <div>
                <label for="categorySlug" class="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                    id="categorySlug"
                    v-model="newCategory.slug"
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
                    v-model="newCategory.description"
                    rows="3"
                    placeholder="Brief description of this category"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>

              <div class="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    @click="showCategoryModal = false"
                    class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                    type="submit"
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    :disabled="isSavingCategory"
                >
                  {{ isSavingCategory ? 'Creating...' : 'Create Category' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { Loader, X, Save, Send, Trash2, ImageIcon, PlusCircle } from 'lucide-vue-next';
import { marked } from 'marked';

const route = useRoute();
const router = useRouter();
const { pb, getCategories, createPost, updatePost } = usePocketBase();

// State variables
const isLoading = ref(false);
const isSaving = ref(false);
const error = ref(null);
const categories = ref([]);
const showPreview = ref(false);
const previewImage = ref(null);
const fileInput = ref(null);
const showCategoryModal = ref(false);
const isSavingCategory = ref(false);
const categoryError = ref(null);
const tagInput = ref('');

// Form data
const form = ref({
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  featured_image: null,
  category: '',
  author: '',
  published: false,
  published_date: new Date().toISOString().slice(0, 16),
  tags: []
});

// New category form
const newCategory = ref({
  name: '',
  slug: '',
  description: ''
});

// Computed values
const isNewPost = computed(() => {
  return route.params.id === 'new';
});

const isFormValid = computed(() => {
  return (
      form.value.title.trim() !== '' &&
      form.value.slug.trim() !== '' &&
      form.value.content.trim() !== '' &&
      form.value.excerpt.trim() !== '' &&
      form.value.category.trim() !== ''
  );
});

const renderedContent = computed(() => {
  if (!form.value.content) return '';
  return marked(form.value.content);
});

// Methods
const generateSlug = () => {
  if (!form.value.title) return;
  form.value.slug = form.value.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
};

const generateCategorySlug = () => {
  if (!newCategory.value.name) return;
  newCategory.value.slug = newCategory.value.name
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Preview the image
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.value = e.target.result;
  };
  reader.readAsDataURL(file);

  // Store the file for upload
  form.value.featured_image = file;
};

const removeImage = () => {
  form.value.featured_image = null;
  previewImage.value = null;
  if (fileInput.value) {
    fileInput.value.value = null;
  }
};

const getImageUrl = (fileName) => {
  if (!fileName || typeof fileName === 'object') return '';
  return `${pb.baseUrl}/api/files/${fileName}`;
};

const addTag = () => {
  const tag = tagInput.value.trim();
  if (!tag) return;

  if (!form.value.tags) {
    form.value.tags = [];
  }

  if (!form.value.tags.includes(tag)) {
    form.value.tags.push(tag);
  }

  tagInput.value = '';
};

const removeTag = (index) => {
  form.value.tags.splice(index, 1);
};

const createCategory = async () => {
  try {
    isSavingCategory.value = true;
    categoryError.value = null;

    const category = await pb.collection('categories').create(newCategory.value);

    // Update categories list and select the new category
    categories.value.push(category);
    form.value.category = category.id;

    showCategoryModal.value = false;
    newCategory.value = { name: '', slug: '', description: '' };
  } catch (err) {
    categoryError.value = err.message || 'Failed to create category';
  } finally {
    isSavingCategory.value = false;
  }
};

const saveAsDraft = async () => {
  form.value.published = false;
  await savePost();
};

const publishPost = async () => {
  if (form.value.published && !form.value.published_date) {
    form.value.published_date = new Date().toISOString();
  }

  await savePost();
};

const savePost = async () => {
  try {
    isSaving.value = true;
    error.value = null;

    const formData = new FormData();

    // Add all form fields
    for (const [key, value] of Object.entries(form.value)) {
      if (key === 'featured_image' && typeof value === 'object' && value !== null) {
        // Only add the file if it's a new file
        formData.append('featured_image', value);
      } else if (key === 'tags' && Array.isArray(value)) {
        // Handle tags array as JSON string
        formData.append('tags', JSON.stringify(value));
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    }

    // Set the author to current user if it's a new post
    if (isNewPost.value) {
      formData.append('author', pb.authStore.model.id);
    }

    let result;
    if (isNewPost.value) {
      result = await createPost(formData);
    } else {
      result = await updatePost(route.params.id, formData);
    }

    // Redirect back to posts list after successful save
    router.push('/admin/posts');
  } catch (err) {
    error.value = err.message || 'Failed to save post';
    isSaving.value = false;
  }
};

// Load data on mount
onMounted(async () => {
  try {
    isLoading.value = true;
    error.value = null;

    // Fetch categories
    const categoriesData = await getCategories();
    categories.value = categoriesData;

    // If editing an existing post, fetch it
    if (!isNewPost.value) {
      const post = await pb.collection('posts').getOne(route.params.id);

      // Map post data to form
      form.value = {
        title: post.title || '',
        slug: post.slug || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        featured_image: post.featured_image || null,
        category: post.category || '',
        author: post.author || '',
        published: post.published || false,
        published_date: post.published_date ? new Date(post.published_date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        tags: post.tags || []
      };
    } else {
      // For new posts, set the default values
      form.value.author = pb.authStore.model.id;
    }

    isLoading.value = false;
  } catch (err) {
    error.value = err.message || 'Failed to load data';
    isLoading.value = false;
  }
});

// Auto-update slug when title changes
watch(
    () => form.value.title,
    (newTitle, oldTitle) => {
      // Only auto-generate slug if it's a new post or the slug is empty
      // or if the slug was previously auto-generated from the title
      if (
          isNewPost.value ||
          form.value.slug === '' ||
          form.value.slug === oldTitle
              .toLowerCase()
              .replace(/[^\w\s]/gi, '')
              .replace(/\s+/g, '-')
      ) {
        generateSlug();
      }
    }
);
</script>

<script>
// Set the layout for this page
export default {
  layout: 'admin'
};
</script>