<script setup lang="ts" generic="T">
defineSlots<{
  item(props: { item: T; index: number }): any
  empty(props: {}): any
}>()

withDefaults(
  defineProps<{
    items: T[]
    keyField: keyof T
    gridClass?: string
  }>(),
  {
    gridClass: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  },
)
</script>

<template>
  <div>
    <TransitionGroup v-if="items.length > 0" name="list" tag="div" :class="gridClass">
      <div v-for="(item, index) in items" :key="String(item[keyField])">
        <slot name="item" :item="item" :index="index"></slot>
      </div>
    </TransitionGroup>

    <div v-else class="alert alert-info shadow-sm">
      <slot name="empty">
        <span>Список порожній.</span>
      </slot>
    </div>
  </div>
</template>