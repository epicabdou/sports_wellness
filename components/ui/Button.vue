<!-- Mise à jour de Button.vue avec vérifications supplémentaires -->
<template>
  <button
      type="button"
      class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
      :class="buttonClasses"
      :disabled="isDisabled"
      @click="handleClick"
  >
    <Loader2 v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" />
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary'
  },
  size: {
    type: String,
    default: 'md'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'button'
  }
})

const emit = defineEmits(['click'])

// Computed pour éviter les bugs de réactivité et les erreurs null/undefined
const isDisabled = computed(() => Boolean(props.disabled) || Boolean(props.loading))

// Computed pour les classes du bouton
const buttonClasses = computed(() => {
  const classes = []

  // Classes de variante
  if (props.variant === 'primary') {
    classes.push('bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500')
  } else if (props.variant === 'secondary') {
    classes.push('bg-secondary-100 hover:bg-secondary-200 text-secondary-800 focus:ring-secondary-500')
  } else if (props.variant === 'danger') {
    classes.push('bg-red-600 hover:bg-red-700 text-white focus:ring-red-500')
  } else if (props.variant === 'outline') {
    classes.push('bg-white hover:bg-gray-50 text-gray-700 border-gray-300 focus:ring-primary-500')
  }

  // Classes d'état
  if (isDisabled.value) {
    classes.push('opacity-50 cursor-not-allowed')
  }

  // Classes de taille
  if (props.block) {
    classes.push('w-full')
  }

  if (props.size === 'sm') {
    classes.push('px-3 py-1.5 text-xs')
  } else if (props.size === 'lg') {
    classes.push('px-6 py-3 text-base')
  }

  return classes.join(' ')
})

// Méthode pour gérer le clic
function handleClick(event) {
  if (!isDisabled.value) {
    emit('click', event)
  }
}
</script>