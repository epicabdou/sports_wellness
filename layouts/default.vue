<!-- layouts/default.vue -->
<template>
  <div class="min-h-screen flex flex-col">
    <TheHeader />
    <main class="flex-grow container-custom py-8">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>

<script setup>
// Layout components imported automatically
</script>