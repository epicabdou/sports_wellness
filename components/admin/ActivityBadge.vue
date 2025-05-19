<!-- components/admin/ActivityBadge.vue -->
<template>
  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="badgeClass">
    <component :is="icon" v-if="icon" class="-ml-0.5 mr-1.5 h-3 w-3" />
    {{ getActivityLabel(type) }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import {
  LogIn,
  LogOut,
  UserCheck,
  Key,
  FileText,
  Heart,
  MessageSquare,
  Activity
} from 'lucide-vue-next'

const props = defineProps({
  type: {
    type: String,
    required: true
  }
})

// Déterminer la classe CSS du badge en fonction du type d'activité
const badgeClass = computed(() => {
  switch (props.type) {
    case 'login':
      return 'bg-green-100 text-green-800'
    case 'logout':
      return 'bg-blue-100 text-blue-800'
    case 'profile_update':
      return 'bg-purple-100 text-purple-800'
    case 'password_change':
      return 'bg-yellow-100 text-yellow-800'
    case 'post_view':
      return 'bg-gray-100 text-gray-800'
    case 'post_like':
      return 'bg-red-100 text-red-800'
    case 'post_unlike':
      return 'bg-pink-100 text-pink-800'
    case 'post_comment':
      return 'bg-indigo-100 text-indigo-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
})

// Déterminer l'icône à afficher en fonction du type d'activité
const icon = computed(() => {
  switch (props.type) {
    case 'login':
      return LogIn
    case 'logout':
      return LogOut
    case 'profile_update':
      return UserCheck
    case 'password_change':
      return Key
    case 'post_view':
      return FileText
    case 'post_like':
    case 'post_unlike':
      return Heart
    case 'post_comment':
      return MessageSquare
    default:
      return Activity
  }
})

// Obtenir un libellé lisible pour le type d'activité
function getActivityLabel(type) {
  switch (type) {
    case 'login':
      return 'Connexion'
    case 'logout':
      return 'Déconnexion'
    case 'profile_update':
      return 'Mise à jour profil'
    case 'password_change':
      return 'Changement MDP'
    case 'post_view':
      return 'Lecture article'
    case 'post_like':
      return 'J\'aime'
    case 'post_unlike':
      return 'Retrait j\'aime'
    case 'post_comment':
      return 'Commentaire'
    default:
      return 'Activité'
  }
}
</script>