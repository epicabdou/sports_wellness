<!-- components/blog/PostCard.vue -->
<template>
  <article class="bg-white rounded-lg shadow overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow">
    <!-- Featured image -->
    <div class="aspect-w-16 aspect-h-9 overflow-hidden">
      <NuxtLink :to="`/blog/${post.slug}`">
        <img
            v-if="post.featured_image"
            :src="getImageUrl(post.featured_image)"
            :alt="post.title"
            class="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
        />
        <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
          <ImageOff class="h-8 w-8 text-gray-400" />
        </div>
      </NuxtLink>
    </div>

    <!-- Content -->
    <div class="p-6 flex-grow flex flex-col">
      <!-- Category & date -->
      <div class="flex items-center text-sm text-gray-500 mb-2">
        <NuxtLink
            v-if="post.expand?.category"
            :to="`/category/${post.expand.category.slug}`"
            class="text-primary-600 hover:text-primary-700 font-medium"
        >
          {{ post.expand.category.name }}
        </NuxtLink>
        <span v-else>Uncategorized</span>

        <span class="mx-2">•</span>

        <time v-if="post.published_date" :datetime="formatISODate(post.published_date)">
          {{ formatDate(post.published_date) }}
        </time>
        <span v-else class="italic">Draft</span>
      </div>

      <!-- Title -->
      <h3 class="text-xl font-semibold mb-3 text-gray-900">
        <NuxtLink :to="`/blog/${post.slug}`" class="hover:text-primary-600 transition-colors">
          {{ post.title }}
        </NuxtLink>
      </h3>

      <!-- Excerpt -->
      <p v-if="!compact" class="text-gray-600 mb-4 flex-grow">
        {{ truncateExcerpt(post.excerpt, 120) }}
      </p>

      <!-- Author -->
      <div class="flex items-center mt-3">
        <div v-if="post.expand?.author" class="flex items-center">
          <div class="flex-shrink-0">
            <img
                v-if="post.expand.author.avatar"
                :src="getImageUrl(post.expand.author.avatar)"
                :alt="post.expand.author.name"
                class="h-8 w-8 rounded-full object-cover"
            />
            <div v-else class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
              <UserCircle class="h-4 w-4 text-primary-600" />
            </div>
          </div>
          <div class="ml-2">
            <p class="text-sm font-medium text-gray-900">{{ post.expand.author.name }}</p>
          </div>
        </div>
        <div v-else class="ml-auto">
          <NuxtLink :to="`/blog/${post.slug}`" class="text-sm text-primary-600 hover:text-primary-700 font-medium">
            Read more <span aria-hidden="true">→</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { ImageOff, UserCircle } from 'lucide-vue-next';
import { usePocketBase } from '~/composables/usePocketBase';

const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  compact: {
    type: Boolean,
    default: false
  }
});

const { pb } = usePocketBase();

// Format dates
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

const formatISODate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString();
};

// Truncate excerpt
const truncateExcerpt = (text, length) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

// Get image URL from PocketBase
const getImageUrl = (fileName) => {
  if (!fileName) return '';
  return `${pb.baseUrl}/api/files/${fileName}`;
};
</script>