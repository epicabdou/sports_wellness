<!-- pages/blog/[slug].vue -->
<template>
  <div>
    <div v-if="isLoading" class="flex justify-center py-20">
      <Loader2 class="h-12 w-12 text-primary-500 animate-spin" />
    </div>

    <div v-else-if="error" class="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <Alert type="error" :title="error" />
      <div class="mt-8 text-center">
        <Button @click="$router.push('/blog')">
          Retour aux articles
        </Button>
      </div>
    </div>

    <div v-else-if="post" class="bg-white overflow-hidden">
      <!-- Post Header -->
      <div class="relative">
        <div class="h-64 sm:h-80 md:h-96 w-full bg-gray-100">
          <img
              v-if="post.image"
              :src="`${pocketbaseUrl}/api/files/posts/${post.id}/${post.image}`"
              :alt="post.title"
              class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <ImageIcon class="h-24 w-24 text-gray-300" />
          </div>
        </div>

        <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-black/25 to-transparent flex items-end">
          <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
            <div
                v-if="post.expand?.category"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-600 text-white mb-4"
            >
              {{ post.expand.category.name }}
            </div>

            <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              {{ post.title }}
            </h1>

            <div class="mt-4 flex items-center">
              <div v-if="post.expand?.author" class="flex items-center">
                <div class="flex-shrink-0">
                  <div v-if="post.expand.author.avatar" class="h-10 w-10 rounded-full overflow-hidden">
                    <img
                        :src="`${pocketbaseUrl}/api/files/users/${post.expand.author.id}/${post.expand.author.avatar}`"
                        :alt="post.expand.author.name || 'Author'"
                        class="h-full w-full object-cover"
                    />
                  </div>
                  <div v-else class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-medium">
                    {{ post.expand.author.name ? post.expand.author.name.charAt(0).toUpperCase() : (post.expand.author.email ? post.expand.author.email.charAt(0).toUpperCase() : 'A') }}
                  </div>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-white">
                    {{ post.expand.author.name || post.expand.author.email }}
                  </p>
                  <div class="flex space-x-1 text-xs text-gray-300">
                    <time :datetime="formatDate(post.created, 'ISO')">
                      {{ formatDate(post.created, 'display') }}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Post Content -->
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Excerpt -->
        <div class="border-l-4 border-primary-500 pl-4 italic text-lg text-gray-600 mb-8">
          {{ post.excerpt }}
        </div>

        <!-- Content -->
        <div class="prose prose-lg max-w-none">
          <!-- Using v-html with PocketBase's content -->
          <div v-html="post.content"></div>
        </div>

        <!-- Tags -->
        <div v-if="post.tags" class="mt-10 flex flex-wrap gap-2">
          <span
              v-for="tag in post.tags.split(',')"
              :key="tag"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
          >
            #{{ tag.trim() }}
          </span>
        </div>

        <!-- Like button -->
        <div class="mt-10 flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button
                @click="toggleLike"
                class="inline-flex items-center space-x-2 text-gray-500 hover:text-red-500"
                :class="{ 'text-red-500': post.userHasLiked }"
            >
              <Heart :class="{ 'fill-current': post.userHasLiked }" class="h-6 w-6" />
              <span>{{ post.likesCount }}</span>
            </button>

            <button
                @click="scrollToComments"
                class="inline-flex items-center space-x-2 text-gray-500 hover:text-primary-500"
            >
              <MessageSquare class="h-6 w-6" />
              <span>{{ post.comments?.length || 0 }}</span>
            </button>
          </div>

          <div class="flex space-x-2">
            <button
                @click="shareOnFacebook"
                class="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-gray-100"
            >
              <Facebook class="h-5 w-5" />
            </button>

            <button
                @click="shareOnTwitter"
                class="p-2 rounded-full text-gray-500 hover:text-blue-400 hover:bg-gray-100"
            >
              <Twitter class="h-5 w-5" />
            </button>

            <button
                @click="shareOnLinkedIn"
                class="p-2 rounded-full text-gray-500 hover:text-blue-700 hover:bg-gray-100"
            >
              <Linkedin class="h-5 w-5" />
            </button>
          </div>
        </div>

        <!-- Related posts -->
        <div v-if="relatedPosts.length > 0" class="mt-16">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">
            Articles similaires
          </h2>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <PostCard
                v-for="relatedPost in relatedPosts"
                :key="relatedPost.id"
                :post="relatedPost"
            />
          </div>
        </div>

        <!-- Comments section -->
        <div ref="commentsSection" class="mt-16 pt-6 border-t border-gray-200">
          <Comments :comments="post.comments || []" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRuntimeConfig } from 'nuxt/app'
import { Loader2, Heart, MessageSquare, ImageIcon, Facebook, Twitter, Linkedin } from 'lucide-vue-next'
import { useBlogStore } from '~/stores/blog'
import { useAuthStore } from '~/stores/auth'
import Alert from '~/components/ui/Alert.vue'
import Button from '~/components/ui/Button.vue'
import PostCard from '~/components/blog/PostCard.vue'
import Comments from '~/components/blog/Comments.vue'

const route = useRoute()
const blogStore = useBlogStore()
const authStore = useAuthStore()

const runtimeConfig = useRuntimeConfig()
const pocketbaseUrl = computed(() => runtimeConfig.public.pocketbaseUrl)

const post = ref(null)
const isLoading = ref(true)
const error = ref(null)
const relatedPosts = ref([])
const commentsSection = ref(null)

onMounted(async () => {
  const { slug } = route.params

  if (!slug) {
    error.value = "L'URL de l'article est invalide."
    isLoading.value = false
    return
  }

  try {
    // Fetch post data
    const postData = await blogStore.fetchPostBySlug(slug)
    post.value = postData

    // Fetch related posts after getting the current post
    if (post.value?.expand?.category) {
      await fetchRelatedPosts(post.value.expand.category.id, post.value.id)
    }
  } catch (err) {
    error.value = err.message || "Impossible de charger l'article."
  } finally {
    isLoading.value = false
  }
})

async function fetchRelatedPosts(categoryId, currentPostId) {
  try {
    // Get posts in the same category
    const postsInCategory = await blogStore.getPostsByCategory(categoryId)

    // Filter out the current post and limit to 3 related posts
    relatedPosts.value = postsInCategory
        .filter(post => post.id !== currentPostId)
        .slice(0, 3)
  } catch (err) {
    console.error('Failed to fetch related posts:', err)
  }
}

async function toggleLike() {
  if (!authStore.isLoggedIn) {
    // Redirect to login if not logged in
    const currentPath = route.fullPath
    return navigateTo(`/auth/login?redirect=${encodeURIComponent(currentPath)}`)
  }

  try {
    await blogStore.toggleLike()
  } catch (err) {
    console.error('Failed to toggle like:', err)
  }
}

function scrollToComments() {
  commentsSection.value.scrollIntoView({ behavior: 'smooth' })
}

function shareOnFacebook() {
  const url = encodeURIComponent(window.location.href)
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
}

function shareOnTwitter() {
  const url = encodeURIComponent(window.location.href)
  const text = encodeURIComponent(post.value.title)
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank')
}

function shareOnLinkedIn() {
  const url = encodeURIComponent(window.location.href)
  const title = encodeURIComponent(post.value.title)
  window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`, '_blank')
}

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

<style lang="postcss">
/* Additional styling for the post content from PocketBase */
.prose img {
  @apply rounded-lg shadow-md;
}

.prose h2 {
  @apply text-primary-700 mt-12 mb-4;
}

.prose h3 {
  @apply text-primary-600 mt-8 mb-3;
}

.prose blockquote {
  @apply border-secondary-500 text-secondary-700 italic;
}

.prose a {
  @apply text-primary-600 font-medium;
}

.prose ul li::marker {
  @apply text-primary-500;
}

.prose ol li::marker {
  @apply text-primary-500 font-bold;
}
</style>