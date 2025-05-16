<!-- pages/login.vue -->
<template>
  <div class="flex min-h-screen">
    <!-- Left side with form -->
    <div class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <NuxtLink to="/" class="inline-flex items-center justify-center space-x-2">
            <Dumbbell class="h-8 w-8 text-primary-600" />
            <span class="text-2xl font-bold text-gray-900">Fitness & Wellness</span>
          </NuxtLink>
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p class="mt-2 text-sm text-gray-600">
            Or
            <NuxtLink to="/register" class="font-medium text-primary-600 hover:text-primary-500">
              create a new account
            </NuxtLink>
          </p>
        </div>

        <div v-if="error" class="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {{ error }}
        </div>

        <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
          <div class="rounded-md shadow-sm space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                  id="email"
                  v-model="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Email address"
              />
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                  id="password"
                  v-model="password"
                  name="password"
                  type="password"
                  autocomplete="current-password"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Password"
              />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div class="text-sm">
              <NuxtLink to="/forgot-password" class="font-medium text-primary-600 hover:text-primary-500">
                Forgot your password?
              </NuxtLink>
            </div>
          </div>

          <div>
            <button
                type="submit"
                class="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                :disabled="isLoading"
            >
              <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <Loader class="h-5 w-5 text-primary-300 animate-spin" />
              </span>
              {{ isLoading ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Right side with image -->
    <div class="hidden lg:block lg:w-1/2">
      <div class="h-full bg-cover bg-center bg-no-repeat" style="background-image: url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80');">
        <div class="h-full w-full bg-black bg-opacity-30 flex items-center">
          <div class="px-12 text-white max-w-xl">
            <h2 class="text-4xl font-bold mb-4">Achieve your fitness goals with expert guidance</h2>
            <p class="text-xl">Join our community of wellness enthusiasts and stay up-to-date with the latest fitness trends, tips, and insights.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Dumbbell, Loader } from 'lucide-vue-next';

const { login } = usePocketBase();
const router = useRouter();

// Form data
const email = ref('');
const password = ref('');
const isLoading = ref(false);
const error = ref(null);

const handleLogin = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    await login(email.value, password.value);

    // Redirect to home page or dashboard
    router.push('/admin');
  } catch (err) {
    error.value = err.message || 'Failed to sign in. Please check your credentials.';
  } finally {
    isLoading.value = false;
  }
};
</script>