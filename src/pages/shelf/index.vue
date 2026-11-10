<script setup lang="ts">
import { definePage } from 'unplugin-vue-router/runtime'

definePage({
  redirect: '/shelf/reading',
  meta: {
    requiresAuth: true,
  },
})
</script>

<template>
  <div></div>
</template>