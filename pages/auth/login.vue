<!-- pages/auth/login.vue (avec middleware guest) -->
<template>
  <div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Connexion à votre compte
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Ou
          <NuxtLink to="/auth/register" class="font-medium text-primary-600 hover:text-primary-500">
            inscrivez-vous si vous n'avez pas de compte
          </NuxtLink>
        </p>
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

      <div class="mt-8">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form @submit.prevent="login" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Adresse email</label>
              <div class="mt-1">
                <input
                    id="email"
                    v-model="email"
                    name="email"
                    type="email"
                    autocomplete="email"
                    required
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
              <div class="mt-1">
                <input
                    id="password"
                    v-model="password"
                    name="password"
                    type="password"
                    autocomplete="current-password"
                    required
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Votre mot de passe"
                />
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="text-sm">
                <NuxtLink to="/auth/forgot-password" class="font-medium text-primary-600 hover:text-primary-500">
                  Mot de passe oublié ?
                </NuxtLink>
              </div>
            </div>

            <div>
              <button
                  type="submit"
                  :disabled="isLoading"
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Se connecter
              </button>
            </div>
          </form>

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">Ou continuer avec</span>
              </div>
            </div>

            <div class="mt-6">
              <button
                  @click="handleGoogleLogin"
                  type="button"
                  :disabled="isGoogleLoading"
                  class="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg v-if="isGoogleLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z" />
                  <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z" />
                  <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5818182 23.1272727,9.90909091 L12,9.90909091 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z" />
                  <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z" />
                </svg>
                Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { XIcon, AlertCircle } from 'lucide-vue-next'

// Définir les métadonnées de la page pour utiliser le middleware guest
definePageMeta({
  middleware: ['guest']
})

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)
const isGoogleLoading = ref(false)
const redirectPath = ref('/')

// Si une redirection est spécifiée dans les paramètres de la requête, l'utiliser
if (route.query.redirect) {
  redirectPath.value = decodeURIComponent(route.query.redirect)
}

async function login() {
  if (!email.value || !password.value) {
    error.value = 'Veuillez remplir tous les champs'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    await authStore.login(email.value, password.value)
    router.push(redirectPath.value)
  } catch (err) {
    error.value = err.message || 'Erreur de connexion. Veuillez réessayer.'
  } finally {
    isLoading.value = false
  }
}

async function handleGoogleLogin() {
  isGoogleLoading.value = true
  error.value = ''

  try {
    // Vérifiez d'abord si la méthode existe
    if (typeof authStore.loginWithGoogle !== 'function') {
      throw new Error("La méthode de connexion Google n'est pas disponible. Veuillez contacter l'administrateur.")
    }

    await authStore.loginWithGoogle()
    router.push(redirectPath.value)
  } catch (err) {
    console.error('Google login error:', err)
    error.value = err.message || 'Erreur de connexion avec Google. Veuillez réessayer.'
  } finally {
    isGoogleLoading.value = false
  }
}
</script>