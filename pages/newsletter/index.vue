<!-- pages/newsletter/index.vue -->
<template>
  <div class="py-10 bg-gradient-to-b from-primary-50 to-white">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
          <span class="block">Restez en forme</span>
          <span class="block text-primary-600">avec notre newsletter personnalisée</span>
        </h1>
        <p class="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
          Recevez des conseils adaptés à votre profil et vos objectifs, pour rester en forme et prendre soin de votre santé.
        </p>
      </div>

      <div class="mt-12 bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="px-6 py-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">
            Inscrivez-vous à notre newsletter
          </h2>

          <Alert
              v-if="error"
              type="error"
              :title="error"
              dismissible
              @dismiss="error = ''"
          />

          <Alert
              v-if="success"
              type="success"
              :title="success"
              dismissible
              @dismiss="success = ''"
          />

          <form @submit.prevent="submitForm" class="space-y-6">
            <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Nom complet <span class="text-red-500">*</span></label>
                <div class="mt-1">
                  <input
                      id="name"
                      v-model="formData.name"
                      type="text"
                      required
                      class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Votre nom"
                  />
                </div>
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email <span class="text-red-500">*</span></label>
                <div class="mt-1">
                  <input
                      id="email"
                      v-model="formData.email"
                      type="email"
                      required
                      class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="exemple@email.com"
                  />
                </div>
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700">Téléphone <span class="text-red-500">*</span></label>
                <div class="mt-1">
                  <input
                      id="phone"
                      v-model="formData.phone"
                      type="tel"
                      required
                      class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="+33 6 12 34 56 78"
                  />
                </div>
              </div>

              <div>
                <label for="city" class="block text-sm font-medium text-gray-700">Ville <span class="text-red-500">*</span></label>
                <div class="mt-1">
                  <input
                      id="city"
                      v-model="formData.city"
                      type="text"
                      required
                      class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Votre ville"
                  />
                </div>
              </div>

              <div>
                <label for="age" class="block text-sm font-medium text-gray-700">Âge</label>
                <div class="mt-1">
                  <input
                      id="age"
                      v-model="formData.age"
                      type="number"
                      min="1"
                      max="120"
                      class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Votre âge"
                  />
                </div>
              </div>

              <div class="sm:col-span-2 sm:flex sm:justify-between space-y-4 sm:space-y-0">
                <div>
                  <label for="weight" class="block text-sm font-medium text-gray-700">Poids (kg)</label>
                  <div class="mt-1">
                    <input
                        id="weight"
                        v-model="formData.weight"
                        type="number"
                        min="1"
                        max="300"
                        class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="Votre poids en kg"
                    />
                  </div>
                </div>

                <div>
                  <label for="height" class="block text-sm font-medium text-gray-700">Taille (cm)</label>
                  <div class="mt-1">
                    <input
                        id="height"
                        v-model="formData.height"
                        type="number"
                        min="50"
                        max="250"
                        class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="Votre taille en cm"
                    />
                  </div>
                </div>
              </div>

              <div class="sm:col-span-2">
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                        id="conscient"
                        v-model="formData.conscient"
                        type="checkbox"
                        required
                        class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="conscient" class="font-medium text-gray-700">Je consens à recevoir la newsletter <span class="text-red-500">*</span></label>
                    <p class="text-gray-500">En cochant cette case, j'accepte de recevoir des emails personnalisés selon mon profil. Je peux me désabonner à tout moment.</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end">
              <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                S'inscrire
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900">Conseils personnalisés</h3>
          <p class="mt-2 text-base text-gray-500">Recevez des conseils adaptés à votre âge, poids et taille pour un parcours de bien-être sur mesure.</p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900">Contenu régulier</h3>
          <p class="mt-2 text-base text-gray-500">Une fois par semaine, retrouvez nos meilleurs conseils et actualités sur le sport et le bien-être.</p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900">Confidentialité garantie</h3>
          <p class="mt-2 text-base text-gray-500">Vos données sont sécurisées et ne seront jamais partagées avec des tiers sans votre consentement.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'
import Alert from '~/components/ui/Alert.vue'

const authStore = useAuthStore()

const formData = ref({
  name: '',
  email: '',
  phone: '',
  city: '',
  age: '',
  weight: '',
  height: '',
  conscient: false
})

const isSubmitting = ref(false)
const error = ref('')
const success = ref('')

async function submitForm() {
  if (!formData.value.conscient) {
    error.value = 'Vous devez consentir à recevoir la newsletter pour vous inscrire.'
    return
  }

  isSubmitting.value = true
  error.value = ''
  success.value = ''

  try {
    const pb = authStore.getPocketBaseInstance()
    if (!pb) {
      throw new Error('Erreur de connexion au serveur.')
    }

    // Préparer les données pour l'envoi
    const newsletterData = {
      name: formData.value.name,
      email: formData.value.email,
      phone: formData.value.phone,
      city: formData.value.city,
      conscient: formData.value.conscient,
      age: formData.value.age || null,
      weight: formData.value.weight || null,
      height: formData.value.height || null
    }

    // Envoyer les données
    await pb.collection('newsletter').create(newsletterData)

    // Réinitialiser le formulaire
    formData.value = {
      name: '',
      email: '',
      phone: '',
      city: '',
      age: '',
      weight: '',
      height: '',
      conscient: false
    }

    success.value = 'Félicitations ! Vous êtes maintenant inscrit à notre newsletter personnalisée.'
  } catch (err) {
    console.error('Newsletter subscription error:', err)

    if (err.response?.data?.email?.message) {
      error.value = 'Cette adresse email est déjà utilisée.'
    } else if (err.response?.data?.phone?.message) {
      error.value = 'Ce numéro de téléphone est déjà utilisé.'
    } else {
      error.value = err.message || 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>