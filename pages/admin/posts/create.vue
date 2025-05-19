<!-- pages/admin/posts/create.vue -->
<template>
  <div>
    <div class="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
      <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
        Créer un nouvel article
      </h1>
      <div class="mt-3 sm:mt-0 sm:ml-4">
        <NuxtLink
            to="/admin/posts"
            class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <ArrowLeft class="mr-2 h-5 w-5" />
          Retour à la liste
        </NuxtLink>
      </div>
    </div>

    <div class="mt-6">
      <form @submit.prevent="savePost">
        <div class="shadow sm:rounded-md sm:overflow-hidden">
          <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
            <!-- Title and Slug -->
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label for="title" class="block text-sm font-medium text-gray-700">Titre <span class="text-red-500">*</span></label>
                <div class="mt-1">
                  <input
                      id="title"
                      v-model="formData.title"
                      type="text"
                      class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                      @input="generateSlug"
                  />
                </div>
              </div>
              <div>
                <label for="slug" class="block text-sm font-medium text-gray-700">Slug URL <span class="text-red-500">*</span></label>
                <div class="mt-1 flex rounded-md shadow-sm">
                  <input
                      id="slug"
                      v-model="formData.slug"
                      type="text"
                      class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
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

            <!-- Category and Status -->
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label for="category" class="block text-sm font-medium text-gray-700">Catégorie <span class="text-red-500">*</span></label>
                <div class="mt-1">
                  <select
                      id="category"
                      v-model="formData.category"
                      class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                  >
                    <option value="" disabled>Sélectionnez une catégorie</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                </div>
              </div>
              <div>
                <label for="status" class="block text-sm font-medium text-gray-700">Statut</label>
                <div class="mt-1">
                  <select
                      id="status"
                      v-model="formData.isPublished"
                      class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option :value="true">Publié</option>
                    <option :value="false">Brouillon</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Tags -->
            <div>
              <label for="tags" class="block text-sm font-medium text-gray-700">Tags (séparés par des virgules)</label>
              <div class="mt-1">
                <input
                    id="tags"
                    v-model="formData.tags"
                    type="text"
                    class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="sport, santé, nutrition, ..."
                />
              </div>
            </div>

            <!-- Excerpt -->
            <div>
              <label for="excerpt" class="block text-sm font-medium text-gray-700">Extrait <span class="text-red-500">*</span></label>
              <div class="mt-1">
                <textarea
                    id="excerpt"
                    v-model="formData.excerpt"
                    rows="3"
                    class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                ></textarea>
              </div>
              <p class="mt-2 text-sm text-gray-500">Un court extrait qui apparaîtra sur la liste des articles.</p>
            </div>

            <!-- Featured Image -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Image à la une</label>
              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div class="space-y-1 text-center">
                  <div class="relative">
                    <div v-if="imagePreview" class="mb-4 flex justify-center">
                      <img :src="imagePreview" alt="Preview" class="h-48 w-auto object-cover rounded-md" />
                      <button
                          @click="removeImage"
                          type="button"
                          class="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      >
                        <X class="h-4 w-4" />
                      </button>
                    </div>
                    <svg v-else class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="flex text-sm text-gray-600">
                    <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                      <span>Téléverser une image</span>
                      <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="handleImageChange" accept="image/*" />
                    </label>
                    <p class="pl-1">ou glisser-déposer</p>
                  </div>
                  <p class="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 5MB</p>
                </div>
              </div>
            </div>

            <!-- Content Editor -->
            <div>
              <label for="content" class="block text-sm font-medium text-gray-700">Contenu <span class="text-red-500">*</span></label>
              <div class="mt-1">
                <div class="border border-gray-300 rounded-md overflow-hidden">
                  <!-- Toolbar -->
                  <div class="bg-gray-50 p-2 flex flex-wrap gap-1 border-b border-gray-300">
                    <!-- Bold -->
                    <button
                        @click.prevent="applyFormat('bold')"
                        class="p-1 hover:bg-gray-200 rounded"
                        :class="{ 'bg-gray-200': isFormatActive('bold') }"
                        title="Gras"
                    >
                      <Bold class="h-5 w-5" />
                    </button>

                    <!-- Italic -->
                    <button
                        @click.prevent="applyFormat('italic')"
                        class="p-1 hover:bg-gray-200 rounded"
                        :class="{ 'bg-gray-200': isFormatActive('italic') }"
                        title="Italique"
                    >
                      <Italic class="h-5 w-5" />
                    </button>

                    <!-- Heading -->
                    <div class="relative">
                      <button
                          @click.prevent="showHeadingMenu = !showHeadingMenu"
                          class="p-1 hover:bg-gray-200 rounded flex items-center"
                          title="Titres"
                      >
                        <Heading class="h-5 w-5" />
                        <ChevronDown class="h-3 w-3 ml-1" />
                      </button>
                      <div
                          v-if="showHeadingMenu"
                          class="absolute z-10 mt-1 w-36 bg-white rounded-md shadow-lg"
                      >
                        <div class="py-1">
                          <button
                              v-for="level in [1, 2, 3, 4]"
                              :key="level"
                              @click.prevent="applyHeading(level); showHeadingMenu = false"
                              class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Titre {{ level }}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div class="w-px h-6 bg-gray-300 mx-1"></div>

                    <!-- List -->
                    <button
                        @click.prevent="applyFormat('insertUnorderedList')"
                        class="p-1 hover:bg-gray-200 rounded"
                        title="Liste à puces"
                    >
                      <List class="h-5 w-5" />
                    </button>

                    <!-- Numbered List -->
                    <button
                        @click.prevent="applyFormat('insertOrderedList')"
                        class="p-1 hover:bg-gray-200 rounded"
                        title="Liste numérotée"
                    >
                      <ListOrdered class="h-5 w-5" />
                    </button>

                    <div class="w-px h-6 bg-gray-300 mx-1"></div>

                    <!-- Link -->
                    <button
                        @click.prevent="createLink"
                        class="p-1 hover:bg-gray-200 rounded"
                        title="Insérer un lien"
                    >
                      <Link class="h-5 w-5" />
                    </button>

                    <!-- Quote -->
                    <button
                        @click.prevent="applyFormat('formatBlock', '<blockquote>')"
                        class="p-1 hover:bg-gray-200 rounded"
                        title="Citation"
                    >
                      <Quote class="h-5 w-5" />
                    </button>
                  </div>

                  <!-- Editor -->
                  <div
                      ref="editor"
                      contenteditable="true"
                      class="min-h-[400px] p-4 focus:outline-none prose max-w-none"
                      @input="updateContent"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div class="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-between">
            <span v-if="error" class="text-red-500 text-sm self-center">{{ error }}</span>
            <div class="flex space-x-2">
              <NuxtLink
                  to="/admin/posts"
                  class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Annuler
              </NuxtLink>
              <button
                  type="submit"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  :disabled="isSubmitting"
              >
                <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSubmitting ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- Link Dialog -->
    <Dialog :open="showLinkDialog" @close="showLinkDialog = false" class="relative z-10">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" />

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div>
              <div class="mt-3 text-center sm:mt-0 sm:text-left">
                <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-900">
                  Ajouter un lien
                </DialogTitle>

                <div class="mt-4">
                  <div class="space-y-4">
                    <div>
                      <label for="link-text" class="block text-sm font-medium text-gray-700">Texte du lien</label>
                      <input
                          id="link-text"
                          v-model="linkData.text"
                          type="text"
                          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label for="link-url" class="block text-sm font-medium text-gray-700">URL</label>
                      <input
                          id="link-url"
                          v-model="linkData.url"
                          type="url"
                          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </div>

                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                      type="button"
                      class="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                      @click="insertLink"
                  >
                    Insérer
                  </button>
                  <button
                      type="button"
                      class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                      @click="showLinkDialog = false"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useRuntimeConfig } from 'nuxt/app'
import {
  ArrowLeft,
  X,
  Bold,
  Italic,
  Heading,
  ChevronDown,
  List,
  ListOrdered,
  Link,
  Quote
} from 'lucide-vue-next'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
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

const router = useRouter()
const authStore = useAuthStore()
const adminStore = useAdminStore()
const runtimeConfig = useRuntimeConfig()

// États
const formData = ref({
  title: '',
  slug: '',
  category: '',
  tags: '',
  excerpt: '',
  content: '',
  isPublished: false
})

const categories = ref([])
const isSubmitting = ref(false)
const error = ref('')
const imageFile = ref(null)
const imagePreview = ref(null)

// États de l'éditeur
const editor = ref(null)
const showHeadingMenu = ref(false)
const showLinkDialog = ref(false)
const linkData = ref({
  text: '',
  url: ''
})
const selectionRange = ref(null)

onMounted(async () => {
  // Récupérer les catégories
  try {
    categories.value = await adminStore.fetchAdminCategories()
  } catch (err) {
    console.error('Failed to fetch categories:', err)
    error.value = 'Erreur lors du chargement des catégories'
  }

  // Initialize editor click outside handler
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      showHeadingMenu.value = false
    }
  })
})

// Méthodes pour générer un slug à partir du titre
function generateSlug() {
  if (!formData.value.title) return

  formData.value.slug = formData.value.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Supprimer les caractères spéciaux
      .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
      .replace(/--+/g, '-') // Éviter les tirets multiples
      .trim() // Supprimer les espaces au début et à la fin
}

// Gestion de l'image
function handleImageChange(event) {
  const file = event.target.files[0]
  if (!file) return

  // Vérifier le type de fichier
  if (!file.type.match('image.*')) {
    error.value = 'Veuillez sélectionner une image'
    return
  }

  // Vérifier la taille du fichier (max 5 Mo)
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'La taille de l\'image ne doit pas dépasser 5 Mo'
    return
  }

  imageFile.value = file
  error.value = ''

  // Créer un aperçu de l'image
  const reader = new FileReader()
  reader.onload = e => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

function removeImage() {
  imageFile.value = null
  imagePreview.value = null
}

// Fonctions d'édition
function updateContent() {
  if (editor.value) {
    formData.value.content = editor.value.innerHTML
  }
}

function applyFormat(command, value = null) {
  document.execCommand(command, false, value)
  editor.value.focus()
  updateContent()
}

function isFormatActive(format) {
  return document.queryCommandState(format)
}

function applyHeading(level) {
  const tag = `h${level}`
  document.execCommand('formatBlock', false, `<${tag}>`)
  editor.value.focus()
  updateContent()
}

function createLink() {
  // Sauvegarder la sélection actuelle
  selectionRange.value = window.getSelection().getRangeAt(0)
  linkData.value.text = window.getSelection().toString()
  linkData.value.url = ''
  showLinkDialog.value = true
}

function insertLink() {
  if (!linkData.value.url) {
    return
  }

  // Restaurer la sélection
  if (selectionRange.value) {
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(selectionRange.value)

    // Si aucun texte n'est sélectionné, utiliser l'URL comme texte
    if (linkData.value.text.trim() === '') {
      linkData.value.text = linkData.value.url
    }

    // Créer le lien
    document.execCommand('insertHTML', false, `<a href="${linkData.value.url}" target="_blank">${linkData.value.text}</a>`)

    // Mettre à jour le contenu
    updateContent()
  }

  // Fermer la boîte de dialogue
  showLinkDialog.value = false
}

// Enregistrer l'article
async function savePost() {
  if (!formData.value.title || !formData.value.slug || !formData.value.category || !formData.value.excerpt) {
    error.value = 'Veuillez remplir tous les champs obligatoires'
    return
  }

  isSubmitting.value = true
  error.value = ''

  try {
    // Créer un FormData pour envoyer les données
    const postFormData = new FormData()

    // Ajouter les champs du formulaire
    for (const [key, value] of Object.entries(formData.value)) {
      if (key !== 'image') {
        postFormData.append(key, value)
      }
    }

    // Ajouter l'image si présente
    if (imageFile.value) {
      postFormData.append('image', imageFile.value)
    }

    // Créer l'article
    const newPost = await adminStore.createPost(postFormData)

    // Rediriger vers la page d'édition de l'article
    router.push(`/admin/posts/edit/${newPost.id}`)
  } catch (err) {
    console.error('Failed to create post:', err)
    error.value = err.message || 'Erreur lors de la création de l\'article'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style>
.prose h1 {
  font-size: 2em;
  margin-top: 0;
  margin-bottom: 0.5em;
  font-weight: bold;
}

.prose h2 {
  font-size: 1.5em;
  margin-top: 1em;
  margin-bottom: 0.5em;
  font-weight: bold;
}

.prose h3 {
  font-size: 1.25em;
  margin-top: 1em;
  margin-bottom: 0.5em;
  font-weight: bold;
}

.prose h4 {
  font-size: 1.1em;
  margin-top: 1em;
  margin-bottom: 0.5em;
  font-weight: bold;
}

.prose p {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.prose ul, .prose ol {
  padding-left: 2em;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.prose blockquote {
  border-left: 4px solid #e2e8f0;
  padding-left: 1em;
  margin-left: 0;
  font-style: italic;
}

.prose a {
  color: #4f46e5;
  text-decoration: underline;
}
</style>