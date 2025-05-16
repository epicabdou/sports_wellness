<!-- layouts/admin.vue -->
<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-primary-700 text-white">
      <div class="container-custom py-4">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="text-xl font-bold">Fitness & Wellness Blog</NuxtLink>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/admin" class="hover:text-primary-200">Dashboard</NuxtLink>
            <NuxtLink to="/admin/posts" class="hover:text-primary-200">Posts</NuxtLink>
            <NuxtLink to="/admin/categories" class="hover:text-primary-200">Categories</NuxtLink>
            <button @click="logout" class="hover:text-primary-200">Logout</button>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-grow container-custom py-8">
      <slot />
    </main>

    <TheFooter />
  </div>
</template>

<script setup>
const { logout } = usePocketBase();
const router = useRouter();

const handleLogout = () => {
  logout();
  router.push('/login');
};
</script>