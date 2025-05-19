<!-- components/blog/PostCard.vue -->
<template>
  <article class="overflow-hidden rounded-lg shadow-lg bg-white">
    <!-- Featured Image -->
    <div class="relative h-48 overflow-hidden">
      <img
          v-if="post.expand?.image"
          :src="`${pocketbaseUrl}/api/files/posts/${post.id}/${post.image}`"
          :alt="post.title"
          class="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
      />
      <div
          v-else
          class="w-full h-full bg-gray-200 flex items-center justify-center"
      >
        <ImageIcon class="h-16 w-16 text-gray-400" />
      </div>

      <!-- Category badge -->
      <div
          v-if="post.expand?.category"
          class="absolute bottom-0 left-0 px-3 py-1 m-2 bg-primary-600 text-white text-sm font-medium rounded-md"
      >
        {{ post.expand.category.name }}
      </div>
    </div>

    <div class="p-4 flex flex-col h-64">
      <!-- Post Title -->
      <h2 class="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
        <NuxtLink :to="`/blog/${post.slug}`" class="hover:text-primary-600">
          {{ post.title }}
        </NuxtLink>
      </h2>

      <!-- Post Excerpt -->
      <p class="text-gray-600 mb-4 line-clamp-3">
        {{ post.excerpt }}
      </p>

      <!-- Tags -->
      <div v-if="post.tags" class="flex flex-wrap gap-2 mt-2 mb-4">
        <span
            v-for="tag in post.tags.split(',')"
            :key="tag"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800"
        >
          {{ tag.trim() }}
        </span>
      </div>

      <div class="mt-auto flex items-center justify-between">
        <!-- Author info -->
        <div class="flex items-center" v-if="post.expand?.author">
          <div class="flex-shrink-0">
            <div v-if="post.expand.author.avatar" class="h-8 w-8 rounded-full overflow-hidden">
              <img
                  :src="`${pocketbaseUrl}/api/files/users/${post.expand.author.id}/${post.expand.author.avatar}`"
                  :alt="post.expand.author.name || 'Author'"
                  class="h-full w-full object-cover"
              />
            </div>
            <div v-else class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-medium">
              {{ post.expand.author.name ? post.expand.author.name.charAt(0).toUpperCase() : (post.expand.author.email ? post.expand.author.email.charAt(0).toUpperCase() : 'A') }}
            </div>
          </div>
          <div class="ml-2">
            <p class="text-sm font-medium text-gray-900">
              {{ post.expand.author.name || post.expand.author.email }}
            </p>
            <div class="flex space-x-1 text-sm text-gray-500">
              <time :datetime="formatDate(post.created, 'ISO')">
                {{ formatDate(post.created, 'display') }}
              </time>
            </div>
          </div>
        </div>

        <!-- Read more button -->
        <NuxtLink
            :to="`/blog/${post.slug}`"
            class="inline-flex items-center px-3 py-1 text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          Lire plus
          <ArrowRight class="ml-1 h-4 w-4" />
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowRight, ImageIcon } from 'lucide-vue-next'
import { useRuntimeConfig } from 'nuxt/app'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const runtimeConfig = useRuntimeConfig()
const pocketbaseUrl = computed(() => runtimeConfig.public.pocketbaseUrl)

function formatDate(dateString, format = 'display') {
  const date = new Date(dateString)

  if (format === 'ISO') {
    return date.toISOString()
  } else {
    // French date formatting
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }
}
</script>