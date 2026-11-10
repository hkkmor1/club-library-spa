<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

withDefaults(
  defineProps<{
    bordered?: boolean
    compact?: boolean
  }>(),
  {
    bordered: true,
    compact: false,
  },
)
</script>

<template>
  <div
    class="card bg-base-100 shadow-md transition-shadow hover:shadow-lg"
    :class="{ 'card-border border-base-300': bordered, 'card-sm': compact }"
  >
    <div v-if="$slots.header" class="px-6 pt-5 pb-2 border-b border-base-200">
      <slot name="header"></slot>
    </div>

    <div class="card-body" v-bind="$attrs">
      <slot>
        <p class="text-base-content/60 italic">Контент відсутній</p>
      </slot>
    </div>

    <div v-if="$slots.footer" class="card-actions justify-end px-6 pb-5 pt-2 border-t border-base-200">
      <slot name="footer"></slot>
    </div>
  </div>
</template>