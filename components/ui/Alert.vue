<!-- components/ui/Alert.vue -->
<template>
  <div
      class="rounded-md p-4"
      :class="[
      type === 'success' ? 'bg-green-50' : '',
      type === 'info' ? 'bg-blue-50' : '',
      type === 'warning' ? 'bg-yellow-50' : '',
      type === 'error' ? 'bg-red-50' : ''
    ]"
  >
    <div class="flex">
      <div class="flex-shrink-0">
        <CheckCircle v-if="type === 'success'" class="h-5 w-5 text-green-400" />
        <InfoIcon v-else-if="type === 'info'" class="h-5 w-5 text-blue-400" />
        <AlertTriangle v-else-if="type === 'warning'" class="h-5 w-5 text-yellow-400" />
        <AlertCircle v-else-if="type === 'error'" class="h-5 w-5 text-red-400" />
      </div>
      <div class="ml-3">
        <h3
            v-if="title"
            class="text-sm font-medium"
            :class="[
            type === 'success' ? 'text-green-800' : '',
            type === 'info' ? 'text-blue-800' : '',
            type === 'warning' ? 'text-yellow-800' : '',
            type === 'error' ? 'text-red-800' : ''
          ]"
        >
          {{ title }}
        </h3>
        <div
            class="text-sm mt-2"
            :class="[
            type === 'success' ? 'text-green-700' : '',
            type === 'info' ? 'text-blue-700' : '',
            type === 'warning' ? 'text-yellow-700' : '',
            type === 'error' ? 'text-red-700' : ''
          ]"
        >
          <slot></slot>
        </div>
        <div v-if="dismissible" class="mt-4">
          <div class="-mx-2 -my-1.5 flex">
            <button
                class="px-2 py-1.5 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
                :class="[
                type === 'success' ? 'text-green-800 hover:bg-green-100 focus:ring-green-600' : '',
                type === 'info' ? 'text-blue-800 hover:bg-blue-100 focus:ring-blue-600' : '',
                type === 'warning' ? 'text-yellow-800 hover:bg-yellow-100 focus:ring-yellow-600' : '',
                type === 'error' ? 'text-red-800 hover:bg-red-100 focus:ring-red-600' : ''
              ]"
                @click="$emit('dismiss')"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CheckCircle, InfoIcon, AlertTriangle, AlertCircle } from 'lucide-vue-next'

defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'info', 'warning', 'error'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  dismissible: {
    type: Boolean,
    default: false
  }
})

defineEmits(['dismiss'])
</script>