<!-- pages/blog/[slug].vue -->
<template>
  <div>
    <div v-if="loading" class="text-center py-16">
      <Loader class="w-10 h-10 text-primary-600 mx-auto animate-spin" />
      <p class="mt-4 text-gray-600">Loading article...</p>
    </div>

    <div v-else-if="error" class="text-center py-16">
      <AlertCircle class="w-12 h-12 text-red-500 mx-auto" />
      <p class="mt-4 text-gray-800 text-lg">Failed to load article</p>
      <p class="text-gray-600">{{ error }}</p>
      <NuxtLink to="/blog" class="mt-6 inline-flex btn btn-primary">
        Back to Blog
      </NuxtLink>
    </div>

    <article v-else class="max-w-4xl mx-auto">
      <!-- Article header -->
      <header>
        <div class="flex items-center text-sm text-gray-500 mb-4">
          <NuxtLink
              :to="`/category/${post.expand?.category?.slug}`"
              class="text-primary-600 font-medium hover:underline"
          >
            {{ post.expand?.category?.name }}
          </NuxtLink>
          <span class="mx-2">•</span>
          <time :datetime="formatISODate(post.published_date)">
            {{ formatDate(post.published_date) }}
          </time>
        </div>

        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
          {{ post.title }}
        </h1>

        <p class="mt-4 text-xl text-gray-600">
          {{ post.excerpt }}
        </p>

        <div class="mt-6 flex items-center">
          <img
              v-if="post.expand?.author?.avatar"
              :src="getImageUrl(post.expand.author.avatar)"
              :alt="post.expand?.author?.name"
              class="w-12 h-12 rounded-full object-cover"
          />
          <div v-else class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
            <User class="w-6 h-6 text-primary-600" />
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900">{{ post.expand?.author?.name }}</p>
          </div>
        </div>
      </header>

      <!-- Featured image -->
      <div class="mt-8 rounded-lg overflow-hidden">
        <img
            :src="getImageUrl(post.featured_image)"
            :alt="post.title"
            class="w-full h-auto"
        />
      </div>

      <!-- Content -->
      <div class="mt-10 prose prose-lg max-w-none">
        <div v-html="renderedContent"></div>
      </div>

      <!-- Tags -->
      <div v-if="post.tags && post.tags.length > 0" class="mt-8">
        <h3 class="text-lg font-semibold mb-2">Related Topics</h3>
        <div class="flex flex-wrap gap-2">
          <span
              v-for="(tag, index) in post.tags"
              :key="index"
              class="bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- Share buttons -->
      <div class="mt-8 pt-8 border-t">
        <h3 class="text-lg font-semibold mb-4">Share this article</h3>
        <div class="flex space-x-4">
          <button
              @click="shareOnTwitter"
              class="flex items-center space-x-2 text-gray-700 hover:text-blue-500"
          >
            <Twitter class="h-5 w-5" />
            <span>Twitter</span>
          </button>
          <button
              @click="shareOnFacebook"
              class="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
          >
            <Facebook class="h-5 w-5" />
            <span>Facebook</span>
          </button>
          <button
              @click="shareOnLinkedIn"
              class="flex items-center space-x-2 text-gray-700 hover:text-blue-700"
          >
            <Linkedin class="h-5 w-5" />
            <span>LinkedIn</span>
          </button>
          <button
              @click="copyLink"
              class="flex items-center space-x-2 text-gray-700 hover:text-primary-600"
          >
            <Link class="h-5 w-5" />
            <span>{{ linkCopied ? 'Link copied!' : 'Copy link' }}</span>
          </button>
        </div>
      </div>

      <!-- Related posts -->
      <div class="mt-12 pt-8 border-t">
        <h2 class="text-2xl font-bold mb-6">You might also like</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PostCard
              v-for="post in relatedPosts"
              :key="post.id"
              :post="post"
              :compact="true"
          />
        </div>
      </div>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Loader, AlertCircle, User, Twitter, Facebook, Linkedin, Link } from 'lucide-vue-next';
import { marked } from 'marked';

const route = useRoute();
const { getPost, getPosts, pb } = usePocketBase();

// Data
const post = ref(null);
const relatedPosts = ref([]);
const loading = ref(true);
const error = ref(null);
const linkCopied = ref(false);

// Computed
const renderedContent = computed(() => {
  if (!post.value?.content) return '';
  return marked(post.value.content);
});

// Format dates
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatISODate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString();
};

// Get image URL from PocketBase
const getImageUrl = (fileName) => {
  if (!fileName) return '';
  return `${pb.baseUrl}/api/files/${fileName}`;
};

// Social sharing functions
const shareOnTwitter = () => {
  if (!post.value) return;
  const url = window.location.href;
  const text = `Check out "${post.value.title}" on Fitness & Wellness Blog`;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
};

const shareOnFacebook = () => {
  if (!post.value) return;
  const url = window.location.href;
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
};

const shareOnLinkedIn = () => {
  if (!post.value) return;
  const url = window.location.href;
  const title = post.value.title;
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank');
};

const copyLink = () => {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    linkCopied.value = true;
    setTimeout(() => {
      linkCopied.value = false;
    }, 2000);
  });
};

// Fetch post and related posts
onMounted(async () => {
  try {
    const slug = route.params.slug;
    post.value = await getPost(slug);

    // Fetch related posts from the same category
    if (post.value?.category) {
      const relatedResult = await getPosts(
          `category="${post.value.category}" && id!="${post.value.id}" && published=true`,
          'random()',
          'category,author'
      );
      relatedPosts.value = relatedResult.items.slice(0, 3);
    }

    loading.value = false;
  } catch (err) {
    error.value = err.message || 'Failed to load article';
    loading.value = false;
  }
});
</script>