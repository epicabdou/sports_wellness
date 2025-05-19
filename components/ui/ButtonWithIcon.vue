<!-- components/ui/ButtonWithIcon.vue -->
<template>
  <Button
      :variant="variant"
      :size="size"
      :disabled="disabled"
      :loading="loading"
      :block="block"
      @click="$emit('click')"
  >
    <component
        v-if="icon && typeof icon === 'object'"
        :is="icon"
        class="mr-2 h-4 w-4"
    />
    <slot></slot>
  </Button>
</template>

<script setup>
import Button from './Button.vue'

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
  icon: {
    type: [Object, null],
    default: null
  }
})

defineEmits(['click'])
</script>