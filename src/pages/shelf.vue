<script setup lang="ts">
import { definePage } from 'unplugin-vue-router/runtime'
import { useAuth } from '@/composables/useAuth'

definePage({
  name: 'shelf-layout',
  meta: {
    requiresAuth: true,
  },
})

const { readerName } = useAuth()
</script>

<template>
  <div class="space-y-6">
    <div class="bg-base-200 border border-base-300 p-6 rounded-box flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold">Читацький кабінет: {{ readerName }}</h1>
        <p class="text-sm text-base-content/70">
          Керуйте власною полицею та особистими нотатками до книг
        </p>
      </div>

      <div class="join">
        <RouterLink to="/shelf/reading" class="btn btn-sm join-item">
          Моя полиця
        </RouterLink>
        <RouterLink to="/shelf/notes" class="btn btn-sm join-item">
          Мої нотатки
        </RouterLink>
      </div>
    </div>

    <RouterView />
  </div>
</template>