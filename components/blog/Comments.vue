<!-- components/blog/Comments.vue (corrigé) -->
<template>
  <div>
    <h3 class="text-lg font-medium text-gray-900 mb-4">
      Commentaires ({{ comments.length }})
    </h3>

    <!-- Comment form -->
    <div v-if="authStore.isLoggedIn" class="mb-8">
      <form @submit.prevent="submitComment">
        <FormInput
            v-model="newComment"
            type="text"
            placeholder="Ajouter un commentaire..."
            :error="commentError"
            required
        />
        <div class="mt-2 flex justify-end">
          <Button
              :loading="isSubmitting"
              :disabled="!newComment || !newComment.trim()"
              type="submit"
          >
            Commenter
          </Button>
        </div>
      </form>
    </div>

    <!-- Login prompt -->
    <div v-else class="mb-8 p-4 bg-gray-50 rounded-md">
      <p class="text-gray-700">
        <NuxtLink to="/auth/login" class="text-primary-600 hover:text-primary-700">
          Connectez-vous
        </NuxtLink>
        pour ajouter un commentaire.
      </p>
    </div>

    <!-- Comments list -->
    <div v-if="comments && comments.length > 0" class="space-y-6">
      <div
          v-for="comment in comments"
          :key="comment.id"
          class="p-4 bg-gray-50 rounded-md"
      >
        <!-- ... contenu inchangé ... -->
      </div>
    </div>

    <!-- No comments message -->
    <div v-else class="p-4 text-center text-gray-500">
      Aucun commentaire pour l'instant. Soyez le premier à commenter !
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useBlogStore } from '~/stores/blog'
import Button from '~/components/ui/Button.vue'
import FormInput from '~/components/ui/FormInput.vue'

const props = defineProps({
  comments: {
    type: Array,
    default: () => []
  }
})

const authStore = useAuthStore()
const blogStore = useBlogStore()

const newComment = ref('')
const commentError = ref('')
const isSubmitting = ref(false)

async function submitComment() {
  if (!newComment.value || !newComment.value.trim()) {
    commentError.value = 'Le commentaire ne peut pas être vide'
    return
  }

  commentError.value = ''
  isSubmitting.value = true

  try {
    await blogStore.createComment(newComment.value)
    newComment.value = ''
  } catch (error) {
    commentError.value = error?.message || 'Erreur lors de l\'ajout du commentaire'
  } finally {
    isSubmitting.value = false
  }
}
</script>