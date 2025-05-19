<!-- components/ui/FormInput.vue -->
<template>
  <div>
    <label
        v-if="label"
        :for="id"
        class="block text-sm font-medium text-gray-700"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="mt-1 relative">
      <input
          :id="id"
          :type="type"
          :value="modelValue"
          :placeholder="placeholder"
          :required="required"
          :disabled="disabled"
          :class="[
          'block w-full rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm',
          error ? 'border-red-300' : 'border-gray-300',
          disabled ? 'bg-gray-100 cursor-not-allowed' : ''
        ]"
          @input="$emit('update:modelValue', $event.target.value)"
      />

      <div v-if="error" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <AlertCircle class="h-5 w-5 text-red-500" />
      </div>
    </div>

    <p v-if="error" class="mt-2 text-sm text-red-600">
      {{ error }}
    </p>

    <p v-else-if="helpText" class="mt-2 text-sm text-gray-500">
      {{ helpText }}
    </p>
  </div>
</template>

<script setup>
import { AlertCircle } from 'lucide-vue-next'

defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  id: {
    type: String,
    default: () => `input-${Math.random().toString(36).substring(2, 9)}`
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  helpText: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>