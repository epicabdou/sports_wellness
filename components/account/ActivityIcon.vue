<!-- components/account/ActivityIcon.vue -->
<template>
  <div
      class="h-8 w-8 rounded-full flex items-center justify-center"
      :class="[
      type === 'login' ? 'bg-green-100' : '',
      type === 'logout' ? 'bg-blue-100' : '',
      type === 'profile_update' ? 'bg-purple-100' : '',
      type === 'password_change' ? 'bg-yellow-100' : '',
      type === 'post_view' ? 'bg-gray-100' : '',
      type === 'post_like' ? 'bg-red-100' : '',
      type === 'post_unlike' ? 'bg-red-50' : '',
      type === 'post_comment' ? 'bg-indigo-100' : '',
      'bg-gray-100'
    ]"
  >
    <component
        :is="iconComponent"
        class="h-5 w-5"
        :class="[
        type === 'login' ? 'text-green-600' : '',
        type === 'logout' ? 'text-blue-600' : '',
        type === 'profile_update' ? 'text-purple-600' : '',
        type === 'password_change' ? 'text-yellow-600' : '',
        type === 'post_view' ? 'text-gray-600' : '',
        type === 'post_like' ? 'text-red-600' : '',
        type === 'post_unlike' ? 'text-red-400' : '',
        type === 'post_comment' ? 'text-indigo-600' : '',
        'text-gray-600'
      ]"
    />
  </div>
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

const iconComponent = computed(() => {
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
      return Heart
    case 'post_unlike':
      return Heart
    case 'post_comment':
      return MessageSquare
    default:
      return Activity
  }
})
</script>