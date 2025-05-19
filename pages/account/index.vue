<!-- pages/account/index.vue -->
<template>
  <div class="py-10">
    <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">
        Mon compte
      </h1>

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

      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Informations personnelles
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              Gérez vos informations personnelles et votre mot de passe.
            </p>
          </div>

          <div v-if="!isEditing">
            <Button @click="isEditing = true" variant="primary" size="sm">
              Modifier
            </Button>
          </div>
        </div>

        <!-- Profile information -->
        <div class="border-t border-gray-200">
          <div v-if="isEditing" class="px-4 py-5 sm:p-6">
            <form @submit.prevent="updateProfile" class="space-y-6">
              <div class="flex flex-col sm:flex-row sm:space-x-6">
                <div class="mb-6 sm:mb-0 flex flex-col items-center">
                  <div class="w-24 h-24 overflow-hidden rounded-full bg-gray-100 mb-2">
                    <img
                        v-if="avatarPreview || userAvatar"
                        :src="avatarPreview || userAvatar"
                        alt="Avatar Preview"
                        class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center bg-primary-100 text-primary-800 text-3xl font-semibold">
                      {{ user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase() }}
                    </div>
                  </div>

                  <label class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                    <span>Changer d'avatar</span>
                    <input
                        type="file"
                        class="sr-only"
                        accept="image/*"
                        @change="handleAvatarChange"
                    />
                  </label>
                </div>

                <div class="flex-1 space-y-4">
                  <FormInput
                      v-model="formData.name"
                      type="text"
                      label="Nom complet"
                      placeholder="Votre nom"
                  />

                  <FormInput
                      :value="user.email"
                      type="email"
                      label="Adresse email"
                      disabled
                      help-text="L'adresse email ne peut être modifiée"
                  />

                  <FormInput
                      v-model="formData.phoneNumber"
                      type="tel"
                      label="Numéro de téléphone"
                      placeholder="Votre numéro de téléphone"
                  />
                </div>
              </div>

              <div class="flex justify-end space-x-3">
                <Button
                    @click="cancelEditing"
                    variant="outline"
                    type="button"
                >
                  Annuler
                </Button>

                <Button
                    type="submit"
                    variant="primary"
                    :loading="isLoading"
                >
                  Enregistrer
                </Button>
              </div>
            </form>
          </div>

          <div v-else>
            <dl>
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">
                  Photo de profil
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div class="flex items-center">
                    <div class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
                      <img
                          v-if="userAvatar"
                          :src="userAvatar"
                          alt="Avatar"
                          class="h-full w-full object-cover"
                      />
                      <div v-else class="h-full w-full flex items-center justify-center bg-primary-100 text-primary-800 text-xl font-semibold">
                        {{ user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase() }}
                      </div>
                    </div>
                  </div>
                </dd>
              </div>

              <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">
                  Nom complet
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {{ user.name || 'Non renseigné' }}
                </dd>
              </div>

              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">
                  Adresse email
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {{ user.email }}
                </dd>
              </div>

              <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">
                  Numéro de téléphone
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {{ user.phoneNumber || 'Non renseigné' }}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <!-- Password change section -->
      <div class="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Modifier le mot de passe
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            Changez votre mot de passe actuel pour un nouveau.
          </p>
        </div>

        <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
          <form @submit.prevent="changePassword" class="space-y-4">
            <FormInput
                v-model="passwordData.oldPassword"
                type="password"
                label="Mot de passe actuel"
                required
                :error="passwordErrors.oldPassword"
            />

            <FormInput
                v-model="passwordData.newPassword"
                type="password"
                label="Nouveau mot de passe"
                required
                :error="passwordErrors.newPassword"
            />

            <FormInput
                v-model="passwordData.passwordConfirm"
                type="password"
                label="Confirmez le nouveau mot de passe"
                required
                :error="passwordErrors.passwordConfirm"
            />

            <div class="flex justify-end">
              <Button
                  type="submit"
                  variant="primary"
                  :loading="isChangingPassword"
              >
                Changer le mot de passe
              </Button>
            </div>
          </form>
        </div>
      </div>

      <!-- User Activity section -->
      <div class="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Activités récentes
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            Vos dernières activités sur le site.
          </p>
        </div>

        <div class="border-t border-gray-200">
          <div v-if="isLoadingActivities" class="px-4 py-10 flex justify-center">
            <Loader2 class="h-8 w-8 text-primary-500 animate-spin" />
          </div>

          <div v-else-if="activities.length === 0" class="px-4 py-5 sm:px-6 text-center text-gray-500">
            Aucune activité trouvée
          </div>

          <ul v-else role="list" class="divide-y divide-gray-200">
            <li v-for="activity in activities" :key="activity.id" class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <ActivityIcon :type="activity.activity.type" />
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">
                      {{ getActivityDescription(activity) }}
                    </p>
                    <p class="text-sm text-gray-500">
                      {{ formatDate(activity.created) }}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          </ul>

          <div v-if="activities.length > 0" class="px-4 py-3 border-t border-gray-200 text-center">
            <Button
                variant="outline"
                size="sm"
                @click="loadMoreActivities"
                :loading="isLoadingMore"
                :disabled="noMoreActivities"
            >
              {{ noMoreActivities ? 'Aucune autre activité' : 'Voir plus' }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineAsyncComponent } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'
import { Loader2 } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useUserStore } from '~/stores/user'
import Alert from '~/components/ui/Alert.vue'
import Button from '~/components/ui/Button.vue'
import FormInput from '~/components/ui/FormInput.vue'

// Lazy load the activity icon component
const ActivityIcon = defineAsyncComponent(() =>
    import('~/components/account/ActivityIcon.vue')
)

// Use auth store to get user info
const authStore = useAuthStore()
const userStore = useUserStore()
const runtimeConfig = useRuntimeConfig()

// Computed properties
const user = computed(() => authStore.user || {})
const userAvatar = computed(() => authStore.userAvatar)

// Reactive refs for the form
const isEditing = ref(false)
const formData = ref({
  name: '',
  phoneNumber: ''
})
const avatarFile = ref(null)
const avatarPreview = ref(null)
const isLoading = ref(false)
const error = ref('')
const success = ref('')

// Password change
const passwordData = ref({
  oldPassword: '',
  newPassword: '',
  passwordConfirm: ''
})
const passwordErrors = ref({
  oldPassword: '',
  newPassword: '',
  passwordConfirm: ''
})
const isChangingPassword = ref(false)

// Activities
const activities = ref([])
const isLoadingActivities = ref(false)
const isLoadingMore = ref(false)
const activitiesPage = ref(1)
const activitiesPerPage = 5
const noMoreActivities = ref(false)

// Set up form data when component mounts
onMounted(async () => {
  formData.value = {
    name: user.value.name || '',
    phoneNumber: user.value.phoneNumber || ''
  }

  await loadActivities()
})

// Handle avatar file change
function handleAvatarChange(event) {
  const file = event.target.files[0]
  if (!file) return

  // Check file type
  if (!file.type.startsWith('image/')) {
    error.value = 'Le fichier doit être une image'
    return
  }

  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'La taille de l\'image ne doit pas dépasser 5 Mo'
    return
  }

  avatarFile.value = file

  // Create a preview
  const reader = new FileReader()
  reader.onload = e => {
    avatarPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

// Update profile
async function updateProfile() {
  isLoading.value = true
  error.value = ''
  success.value = ''

  try {
    const updateData = {
      name: formData.value.name,
      phoneNumber: formData.value.phoneNumber
    }

    // Add avatar if selected
    if (avatarFile.value) {
      updateData.avatar = avatarFile.value
    }

    await userStore.updateUserProfile(updateData)

    isEditing.value = false
    success.value = 'Profil mis à jour avec succès'

    // Reset avatar preview and file
    avatarPreview.value = null
    avatarFile.value = null
  } catch (err) {
    error.value = err.message || 'Erreur lors de la mise à jour du profil'
  } finally {
    isLoading.value = false
  }
}

// Cancel editing
function cancelEditing() {
  isEditing.value = false
  avatarPreview.value = null
  avatarFile.value = null

  // Reset form data
  formData.value = {
    name: user.value.name || '',
    phoneNumber: user.value.phoneNumber || ''
  }
}

// Change password
async function changePassword() {
  // Reset errors
  passwordErrors.value = {
    oldPassword: '',
    newPassword: '',
    passwordConfirm: ''
  }

  // Validate
  let isValid = true

  if (!passwordData.value.oldPassword) {
    passwordErrors.value.oldPassword = 'Veuillez saisir votre mot de passe actuel'
    isValid = false
  }

  if (!passwordData.value.newPassword) {
    passwordErrors.value.newPassword = 'Veuillez saisir un nouveau mot de passe'
    isValid = false
  } else if (passwordData.value.newPassword.length < 8) {
    passwordErrors.value.newPassword = 'Le mot de passe doit contenir au moins 8 caractères'
    isValid = false
  }

  if (!passwordData.value.passwordConfirm) {
    passwordErrors.value.passwordConfirm = 'Veuillez confirmer votre nouveau mot de passe'
    isValid = false
  } else if (passwordData.value.newPassword !== passwordData.value.passwordConfirm) {
    passwordErrors.value.passwordConfirm = 'Les mots de passe ne correspondent pas'
    isValid = false
  }

  if (!isValid) return

  isChangingPassword.value = true
  error.value = ''
  success.value = ''

  try {
    await userStore.changePassword(
        passwordData.value.oldPassword,
        passwordData.value.newPassword,
        passwordData.value.passwordConfirm
    )

    success.value = 'Mot de passe mis à jour avec succès'

    // Reset form
    passwordData.value = {
      oldPassword: '',
      newPassword: '',
      passwordConfirm: ''
    }
  } catch (err) {
    error.value = err.message || 'Erreur lors du changement de mot de passe'
  } finally {
    isChangingPassword.value = false
  }
}

// Load user activities
async function loadActivities() {
  isLoadingActivities.value = true

  try {
    const userActivities = await userStore.fetchUserActivities()
    activities.value = userActivities.slice(0, activitiesPerPage)

    // Check if there are more activities
    noMoreActivities.value = userActivities.length <= activitiesPerPage
  } catch (err) {
    console.error('Failed to load activities:', err)
  } finally {
    isLoadingActivities.value = false
  }
}

// Load more activities
async function loadMoreActivities() {
  if (noMoreActivities.value) return

  isLoadingMore.value = true

  try {
    const nextPage = activitiesPage.value + 1
    const start = nextPage * activitiesPerPage

    const userActivities = await userStore.fetchUserActivities()
    const moreActivities = userActivities.slice(start, start + activitiesPerPage)

    if (moreActivities.length > 0) {
      activities.value = [...activities.value, ...moreActivities]
      activitiesPage.value = nextPage
    }

    // Check if there are more activities
    noMoreActivities.value = start + activitiesPerPage >= userActivities.length
  } catch (err) {
    console.error('Failed to load more activities:', err)
  } finally {
    isLoadingMore.value = false
  }
}

// Get human-readable activity description
function getActivityDescription(activity) {
  const type = activity.activity.type
  const data = activity.activity.data || {}

  switch (type) {
    case 'login':
      return 'Connexion au compte'
    case 'logout':
      return 'Déconnexion du compte'
    case 'profile_update':
      return 'Mise à jour du profil'
    case 'password_change':
      return 'Changement de mot de passe'
    case 'post_view':
      return `Lecture de l'article "${data.postTitle || 'Titre inconnu'}"`
    case 'post_like':
      return `J'aime sur l'article "${data.postTitle || 'Titre inconnu'}"`
    case 'post_unlike':
      return `Retrait du j'aime sur l'article "${data.postTitle || 'Titre inconnu'}"`
    case 'post_comment':
      return `Commentaire sur l'article "${data.postTitle || 'Titre inconnu'}"`
    default:
      return 'Activité non spécifiée'
  }
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString)

  // French date and time formatting
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>