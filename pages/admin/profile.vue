<!-- pages/admin/profile.vue -->
<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Your Profile</h1>

    <div v-if="loading" class="text-center py-16">
      <Loader class="w-10 h-10 text-primary-600 mx-auto animate-spin" />
      <p class="mt-4 text-gray-600">Loading profile...</p>
    </div>

    <div v-else-if="error" class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
      {{ error }}
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Profile details -->
      <div class="md:col-span-2 space-y-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4">Profile Details</h2>

          <div v-if="updateSuccess" class="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            Profile updated successfully!
          </div>

          <form @submit.prevent="updateProfile" class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                  id="email"
                  v-model="user.email"
                  type="email"
                  disabled
                  class="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm"
              />
              <p class="mt-1 text-sm text-gray-500">Email cannot be changed.</p>
            </div>

            <div>
              <label for="bio" class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                  id="bio"
                  v-model="form.bio"
                  rows="4"
                  placeholder="Tell readers about yourself"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              ></textarea>
            </div>

            <div class="flex justify-end">
              <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="isSaving"
              >
                {{ isSaving ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Change password -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4">Change Password</h2>

          <div v-if="passwordSuccess" class="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            Password updated successfully!
          </div>

          <div v-if="passwordError" class="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {{ passwordError }}
          </div>

          <form @submit.prevent="changePassword" class="space-y-6">
            <div>
              <label for="oldPassword" class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                  id="oldPassword"
                  v-model="passwordForm.oldPassword"
                  type="password"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                  id="newPassword"
                  v-model="passwordForm.password"
                  type="password"
                  required
                  minlength="8"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              <p class="mt-1 text-sm text-gray-500">Minimum 8 characters</p>
            </div>

            <div>
              <label for="passwordConfirm" class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                  id="passwordConfirm"
                  v-model="passwordForm.passwordConfirm"
                  type="password"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div class="flex justify-end">
              <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="isChangingPassword || !passwordsMatch"
              >
                {{ isChangingPassword ? 'Updating...' : 'Update Password' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Avatar and author info -->
      <div class="space-y-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4">Profile Picture</h2>

          <div class="mb-4 flex flex-col items-center">
            <div class="h-32 w-32 rounded-full overflow-hidden bg-gray-100 mb-3">
              <img
                  v-if="avatarPreview || user.avatar"
                  :src="avatarPreview || getImageUrl(user.avatar)"
                  alt="Profile Picture"
                  class="h-full w-full object-cover"
              />
              <div v-else class="h-full w-full flex items-center justify-center">
                <UserCircle class="h-16 w-16 text-gray-400" />
              </div>
            </div>

            <div class="flex space-x-2">
              <input
                  type="file"
                  ref="fileInput"
                  accept="image/*"
                  class="hidden"
                  @change="handleAvatarUpload"
              />
              <button
                  @click="$refs.fileInput.click()"
                  class="text-sm btn btn-outline"
              >
                {{ user.avatar ? 'Change' : 'Upload' }}
              </button>
              <button
                  v-if="user.avatar || avatarPreview"
                  @click="removeAvatar"
                  class="text-sm text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </div>

          <p class="text-sm text-gray-500">
            This image will be displayed on your author profile and posts.
          </p>
        </div>

        <!-- Author info -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4">Author Preview</h2>

          <div class="border p-4 rounded-md">
            <div class="flex items-center space-x-4">
              <div class="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                <img
                    v-if="avatarPreview || user.avatar"
                    :src="avatarPreview || getImageUrl(user.avatar)"
                    alt="Profile Picture"
                    class="h-full w-full object-cover"
                />
                <div v-else class="h-full w-full flex items-center justify-center">
                  <UserCircle class="h-6 w-6 text-gray-400" />
                </div>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">{{ form.name || user.name }}</h3>
                <p class="text-sm text-gray-500">Author</p>
              </div>
            </div>

            <div v-if="form.bio" class="mt-4 text-sm text-gray-600">
              {{ form.bio }}
            </div>
            <div v-else class="mt-4 text-sm text-gray-400 italic">
              Add a bio to tell readers about yourself.
            </div>
          </div>
        </div>

        <!-- Posts stats -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4">Your Stats</h2>

          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Total Posts</span>
              <span class="font-semibold">{{ userStats.totalPosts }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Published Posts</span>
              <span class="font-semibold">{{ userStats.publishedPosts }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Draft Posts</span>
              <span class="font-semibold">{{ userStats.draftPosts }}</span>
            </div>
            <div class="border-t pt-4 mt-4">
              <NuxtLink to="/admin/posts" class="text-primary-600 hover:text-primary-700 font-medium">
                View all posts
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Loader, UserCircle } from 'lucide-vue-next';

const { pb, getPosts } = usePocketBase();

// Data
const user = ref({});
const loading = ref(true);
const error = ref(null);
const avatarPreview = ref(null);
const fileInput = ref(null);
const isSaving = ref(false);
const isChangingPassword = ref(false);
const updateSuccess = ref(false);
const passwordSuccess = ref(false);
const passwordError = ref(null);
const userPosts = ref([]);

// Forms
const form = ref({
  name: '',
  bio: ''
});

const passwordForm = ref({
  oldPassword: '',
  password: '',
  passwordConfirm: ''
});

// Computed properties
const passwordsMatch = computed(() => {
  return passwordForm.value.password === passwordForm.value.passwordConfirm;
});

const userStats = computed(() => {
  return {
    totalPosts: userPosts.value.length,
    publishedPosts: userPosts.value.filter(post => post.published).length,
    draftPosts: userPosts.value.filter(post => !post.published).length
  };
});

// Methods
const getImageUrl = (fileName) => {
  if (!fileName) return '';
  return `${pb.baseUrl}/api/files/${fileName}`;
};

const handleAvatarUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Preview the image
  const reader = new FileReader();
  reader.onload = (e) => {
    avatarPreview.value = e.target.result;
  };
  reader.readAsDataURL(file);

  // Store the file for upload
  form.value.avatar = file;
};

const removeAvatar = () => {
  form.value.avatar = null;
  avatarPreview.value = null;
  if (fileInput.value) {
    fileInput.value.value = null;
  }
};

const updateProfile = async () => {
  try {
    isSaving.value = true;
    updateSuccess.value = false;
    error.value = null;

    const formData = new FormData();

    // Add all form fields
    formData.append('name', form.value.name);

    if (form.value.bio !== undefined) {
      formData.append('bio', form.value.bio);
    }

    if (form.value.avatar) {
      formData.append('avatar', form.value.avatar);
    } else if (form.value.avatar === null && user.value.avatar) {
      // If avatar was removed, send empty string to remove it
      formData.append('avatar', '');
    }

    // Update user profile
    const updatedUser = await pb.collection('users').update(user.value.id, formData);
    user.value = updatedUser;

    // Reset preview
    avatarPreview.value = null;

    updateSuccess.value = true;
    setTimeout(() => {
      updateSuccess.value = false;
    }, 3000);
  } catch (err) {
    error.value = err.message || 'Failed to update profile';
  } finally {
    isSaving.value = false;
  }
};

const changePassword = async () => {
  try {
    if (!passwordsMatch.value) {
      passwordError.value = 'Passwords do not match';
      return;
    }

    isChangingPassword.value = true;
    passwordSuccess.value = false;
    passwordError.value = null;

    // Update password
    await pb.collection('users').update(user.value.id, {
      password: passwordForm.value.password,
      passwordConfirm: passwordForm.value.passwordConfirm,
      oldPassword: passwordForm.value.oldPassword
    });

    // Reset form
    passwordForm.value = {
      oldPassword: '',
      password: '',
      passwordConfirm: ''
    };

    passwordSuccess.value = true;
    setTimeout(() => {
      passwordSuccess.value = false;
    }, 3000);
  } catch (err) {
    passwordError.value = err.message || 'Failed to change password';
  } finally {
    isChangingPassword.value = false;
  }
};

// Load data on mount
onMounted(async () => {
  try {
    loading.value = true;

    // Get current user
    if (pb.authStore.isValid) {
      user.value = pb.authStore.model;

      // Initialize form with user data
      form.value = {
        name: user.value.name || '',
        bio: user.value.bio || ''
      };

      // Get user posts
      const postsData = await getPosts(`author="${user.value.id}"`);
      userPosts.value = postsData.items;
    } else {
      error.value = 'You are not authenticated';
    }

    loading.value = false;
  } catch (err) {
    error.value = err.message || 'Failed to load profile';
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