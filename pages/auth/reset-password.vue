<!-- pages/auth/reset-password.vue -->
<template>
  <div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Réinitialiser votre mot de passe
        </h2>
      </div>

      <div v-if="error" class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <AlertCircle class="h-5 w-5 text-red-400" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Erreur</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ error }}</p>
            </div>
          </div>
          <div class="ml-auto pl-3">
            <div class="-mx-1.5 -my-1.5">
              <button @click="error = ''" type="button" class="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none">
                <span class="sr-only">Fermer</span>
                <XIcon class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="success" class="rounded-md bg-green-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <CheckCircle class="h-5 w-5 text-green-400" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">Succès</h3>
            <div class="mt-2 text-sm text-green-700">
              <p>{{ success }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!resetComplete" class="mt-8">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form @submit.prevent="resetPassword" class="space-y-6">
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                Nouveau mot de passe
                <span class="text-red-500">*</span>
              </label>
              <div class="mt-1">
                <input
                    id="password"
                    v-model="password"
                    name="password"
                    type="password"
                    autocomplete="new-password"
                    required
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Nouveau mot de passe"
                />
              </div>
              <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
              <p v-else class="mt-1 text-xs text-gray-500">Le mot de passe doit contenir au moins 8 caractères</p>
            </div>

            <div>
              <label for="passwordConfirm" class="block text-sm font-medium text-gray-700">
                Confirmer le mot de passe
                <span class="text-red-500">*</span>
              </label>
              <div class="mt-1">
                <input
                    id="passwordConfirm"
                    v-model="passwordConfirm"
                    name="passwordConfirm"
                    type="password"
                    autocomplete="new-password"
                    required
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Confirmer le mot de passe"
                />
              </div>
              <p v-if="passwordConfirmError" class="mt-1 text-sm text-red-600">{{ passwordConfirmError }}</p>
            </div>

            <div>
              <button
                  type="submit"
                  :disabled="isLoading || !isFormValid"
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Réinitialiser le mot de passe
              </button>
            </div>
          </form>
        </div>
      </div>

      <div v-else class="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <CheckCircle class="h-6 w-6 text-green-600" />
        </div>
        <h3 class="mt-3 text-lg font-medium text-gray-900">Mot de passe réinitialisé avec succès !</h3>
        <p class="mt-2 text-sm text-gray-500">
          Votre mot de passe a été réinitialisé. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
        </p>
        <div class="mt-5">
          <NuxtLink to="/auth/login">
            <button
                type="button"
                class="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Aller à la page de connexion
            </button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { XIcon, CheckCircle, AlertCircle } from 'lucide-vue-next'

// Définir les métadonnées de la page pour utiliser le middleware guest
definePageMeta({
  middleware: ['guest']
})

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const token = ref('')
const password = ref('')
const passwordConfirm = ref('')
const error = ref('')
const success = ref('')
const isLoading = ref(false)
const resetComplete = ref(false)

// Validation
const passwordError = computed(() => {
  if (!password.value) return ''

  if (password.value.length < 8) {
    return 'Le mot de passe doit contenir au moins 8 caractères'
  }

  return ''
})

const passwordConfirmError = computed(() => {
  if (!passwordConfirm.value) return ''

  if (password.value !== passwordConfirm.value) {
    return 'Les mots de passe ne correspondent pas'
  }

  return ''
})

const isFormValid = computed(() => {
  return (
      password.value &&
      passwordConfirm.value &&
      !passwordError.value &&
      !passwordConfirmError.value &&
      token.value
  )
})

onMounted(() => {
  // Récupérer le token de réinitialisation depuis l'URL
  token.value = route.query.token || ''

  if (!token.value) {
    error.value = 'Token de réinitialisation manquant. Veuillez utiliser le lien envoyé dans votre email.'
  }
})

async function resetPassword() {
  if (!isFormValid.value) return

  isLoading.value = true
  error.value = ''
  success.value = ''

  try {
    await authStore.confirmPasswordReset(
        token.value,
        password.value,
        passwordConfirm.value
    )

    resetComplete.value = true
    success.value = 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.'
  } catch (err) {
    error.value = err.message || 'Erreur lors de la réinitialisation du mot de passe. Veuillez réessayer.'
  } finally {
    isLoading.value = false
  }
}
</script>