<!-- pages/admin/categories.vue -->
<template>
  <div>
    <div class="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
      <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
        Gestion des catégories
      </h1>
      <div class="mt-3 sm:mt-0 sm:ml-4">
        <button
            @click="showCreateModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon class="mr-2 h-5 w-5" />
          Nouvelle catégorie
        </button>
      </div>
    </div>

    <!-- Liste des catégories -->
    <div class="mt-8">
      <div v-if="isLoading" class="flex justify-center py-10">
        <Loader2 class="h-8 w-8 text-primary-500 animate-spin mx-auto" />
      </div>

      <div v-else-if="categories.length === 0" class="text-center py-10">
        <FolderIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune catégorie</h3>
        <p class="mt-1 text-sm text-gray-500">
          Commencez par créer une nouvelle catégorie.
        </p>
        <div class="mt-6">
          <button
              @click="showCreateModal = true"
              type="button"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Nouvelle catégorie
          </button>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="category in categories" :key="category.id" class="bg-white overflow-hidden shadow rounded-lg">
          <div class="h-48 w-full bg-gray-200 relative">
            <img
                v-if="category.image"
                :src="`${pocketbaseUrl}/api/files/categories/${category.id}/${category.image}`"
                :alt="category.name"
                class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <FolderIcon class="h-16 w-16 text-gray-400" />
            </div>

            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <h3 class="text-lg font-medium text-white">{{ category.name }}</h3>
            </div>
          </div>

          <div class="px-4 py-5 sm:p-6">
            <div class="mt-1 text-sm text-gray-600">
              {{ category.description || 'Aucune description' }}
            </div>
            <div class="mt-2 text-sm text-gray-500">
              Slug: {{ category.slug }}
            </div>

            <div class="mt-4 flex justify-end space-x-3">
              <button
                  @click="editCategory(category)"
                  class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PencilIcon class="mr-1.5 h-4 w-4" />
                Modifier
              </button>
              <button
                  @click="confirmDeleteCategory(category)"
                  class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <TrashIcon class="mr-1.5 h-4 w-4" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de création/édition de catégorie -->
    <Dialog :open="showCreateModal || !!editingCategory" @close="closeEditModal" class="relative z-10">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" />

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div>
              <div class="mt-3 text-center sm:mt-0 sm:text-left">
                <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-900">
                  {{ editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie' }}
                </DialogTitle>

                <div class="mt-4">
                  <form @submit.prevent="saveCategory" class="space-y-4">
                    <div>
                      <label for="name" class="block text-sm font-medium text-gray-700">Nom *</label>
                      <div class="mt-1">
                        <input
                            id="name"
                            v-model="categoryForm.name"
                            type="text"
                            required
                            class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder="Nom de la catégorie"
                        />
                      </div>
                    </div>

                    <div>
                      <label for="slug" class="block text-sm font-medium text-gray-700">Slug *</label>
                      <div class="mt-1">
                        <div class="flex rounded-md shadow-sm">
                          <input
                              id="slug"
                              v-model="categoryForm.slug"
                              type="text"
                              required
                              class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              placeholder="Slug URL-friendly"
                          />
                          <button
                              type="button"
                              @click="generateSlug"
                              class="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            Générer
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                      <div class="mt-1">
                        <textarea
                            id="description"
                            v-model="categoryForm.description"
                            rows="3"
                            class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder="Description de la catégorie"
                        ></textarea>
                      </div>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700">Image</label>
                      <div class="mt-1 flex items-center">
                        <div class="h-32 w-32 overflow-hidden rounded-md bg-gray-100">
                          <img
                              v-if="imagePreview"
                              :src="imagePreview"
                              alt="Preview"
                              class="h-full w-full object-cover"
                          />
                          <div v-else-if="editingCategory && editingCategory.image" class="h-full w-full">
                            <img
                                :src="`${pocketbaseUrl}/api/files/categories/${editingCategory.id}/${editingCategory.image}`"
                                :alt="editingCategory.name"
                                class="h-full w-full object-cover"
                            />
                          </div>
                          <div v-else class="h-full w-full flex items-center justify-center">
                            <FileImage class="h-12 w-12 text-gray-300" />
                          </div>
                        </div>
                        <div class="ml-4">
                          <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                            <span>{{ editingCategory && editingCategory.image ? 'Changer d\'image' : 'Uploader une image' }}</span>
                            <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                class="sr-only"
                                accept="image/*"
                                @change="handleImageChange"
                            />
                          </label>
                          <p class="text-xs text-gray-500">PNG, JPG ou WEBP</p>
                          <button
                              v-if="imagePreview || (editingCategory && editingCategory.image)"
                              type="button"
                              @click="removeImage"
                              class="mt-2 text-sm text-red-600 hover:text-red-900"
                          >
                            Supprimer l'image
                          </button>
                        </div>
                      </div>
                    </div>

                    <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                      <button
                          type="submit"
                          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                          :disabled="isFormSubmitting"
                      >
                        <svg v-if="isFormSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {{ editingCategory ? 'Mettre à jour' : 'Créer' }}
                      </button>
                      <button
                          type="button"
                          class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                          @click="closeEditModal"
                          :disabled="isFormSubmitting"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>

    <!-- Modal de confirmation de suppression -->
    <Dialog :open="showDeleteModal" @close="cancelDelete" class="relative z-10">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" />

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <TriangleAlert class="h-6 w-6 text-red-600" />
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  Supprimer la catégorie
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.
                  </p>
                  <p v-if="categoryToDelete" class="mt-2 font-medium text-gray-900">
                    {{ categoryToDelete.name }}
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                  @click="deleteCategory"
                  class="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  :disabled="isDeleting"
              >
                <svg v-if="isDeleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Supprimer
              </button>
              <button
                  @click="cancelDelete"
                  class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                  :disabled="isDeleting"
              >
                Annuler
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'
import {
  Loader2,
  PlusIcon,
  FolderIcon,
  PencilIcon,
  TrashIcon,
  FileImage,
  TriangleAlert
} from 'lucide-vue-next'
import {
  Dialog,
  DialogPanel,
  DialogTitle
} from '@headlessui/vue'
import { useAuthStore } from '~/stores/auth'
import { useAdminStore } from '~/stores/admin'

// Définir les métadonnées de la page
definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
  meta: {
    requiresAuth: true,
    requiresAdmin: true
  }
})

const authStore = useAuthStore()
const adminStore = useAdminStore()
const runtimeConfig = useRuntimeConfig()
const pocketbaseUrl = computed(() => runtimeConfig.public.pocketbaseUrl)

// États
const categories = ref([])
const isLoading = ref(true)

// Modal de création/édition
const showCreateModal = ref(false)
const editingCategory = ref(null)
const categoryForm = ref({
  name: '',
  slug: '',
  description: ''
})
const imageFile = ref(null)
const imagePreview = ref(null)
const isFormSubmitting = ref(false)
const removeImageFlag = ref(false)

// Modal de suppression
const showDeleteModal = ref(false)
const categoryToDelete = ref(null)
const isDeleting = ref(false)

onMounted(async () => {
  await fetchCategories()
})

// Récupérer les catégories
async function fetchCategories() {
  isLoading.value = true

  try {
    categories.value = await adminStore.fetchAdminCategories()
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  } finally {
    isLoading.value = false
  }
}

// Ouvrir le modal d'édition
function editCategory(category) {
  editingCategory.value = category
  categoryForm.value = {
    name: category.name,
    slug: category.slug,
    description: category.description || ''
  }
  imagePreview.value = null
  imageFile.value = null
  removeImageFlag.value = false
}

// Fermer le modal d'édition
function closeEditModal() {
  showCreateModal.value = false
  editingCategory.value = null
  categoryForm.value = {
    name: '',
    slug: '',
    description: ''
  }
  imagePreview.value = null
  imageFile.value = null
  removeImageFlag.value = false
}

// Générer un slug à partir du nom
function generateSlug() {
  if (!categoryForm.value.name) return

  categoryForm.value.slug = categoryForm.value.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Supprimer les caractères spéciaux
      .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
      .replace(/--+/g, '-') // Éviter les tirets multiples
      .trim() // Supprimer les espaces au début et à la fin
}

// Gérer le changement d'image
function handleImageChange(event) {
  const file = event.target.files[0]
  if (!file) return

  // Vérifier le type de fichier
  if (!file.type.match('image.*')) {
    alert('Veuillez sélectionner une image')
    return
  }

  // Vérifier la taille du fichier (max 5 Mo)
  if (file.size > 5 * 1024 * 1024) {
    alert('La taille de l\'image ne doit pas dépasser 5 Mo')
    return
  }

  imageFile.value = file
  removeImageFlag.value = false

  // Créer un aperçu de l'image
  const reader = new FileReader()
  reader.onload = e => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

// Supprimer l'image
function removeImage() {
  imageFile.value = null
  imagePreview.value = null
  removeImageFlag.value = true
}

// Sauvegarder la catégorie (création ou édition)
async function saveCategory() {
  isFormSubmitting.value = true

  try {
    const formData = new FormData()
    formData.append('name', categoryForm.value.name)
    formData.append('slug', categoryForm.value.slug)

    if (categoryForm.value.description) {
      formData.append('description', categoryForm.value.description)
    }

    if (imageFile.value) {
      formData.append('image', imageFile.value)
    }

    if (removeImageFlag.value && editingCategory.value) {
      formData.append('image', null)
    }

    if (editingCategory.value) {
      // Mise à jour d'une catégorie existante
      await adminStore.updateCategory(editingCategory.value.id, formData)
    } else {
      // Création d'une nouvelle catégorie
      await adminStore.createCategory(formData)
    }

    // Rafraîchir la liste des catégories
    await fetchCategories()

    // Fermer le modal
    closeEditModal()

    // Afficher une notification (implémentation à déterminer)
    alert(editingCategory.value ? 'Catégorie mise à jour avec succès' : 'Catégorie créée avec succès')
  } catch (error) {
    console.error('Failed to save category:', error)
    alert('Erreur: ' + error.message)
  } finally {
    isFormSubmitting.value = false
  }
}

// Confirmer la suppression d'une catégorie
function confirmDeleteCategory(category) {
  categoryToDelete.value = category
  showDeleteModal.value = true
}

// Annuler la suppression
function cancelDelete() {
  showDeleteModal.value = false
  categoryToDelete.value = null
}

// Supprimer une catégorie
async function deleteCategory() {
  if (!categoryToDelete.value) return

  isDeleting.value = true

  try {
    await adminStore.deleteCategory(categoryToDelete.value.id)

    // Rafraîchir la liste des catégories
    await fetchCategories()

    // Fermer le modal
    showDeleteModal.value = false
    categoryToDelete.value = null

    // Afficher une notification (implémentation à déterminer)
    alert('Catégorie supprimée avec succès')
  } catch (error) {
    console.error('Failed to delete category:', error)
    alert('Erreur: ' + error.message)
  } finally {
    isDeleting.value = false
  }
}
</script>