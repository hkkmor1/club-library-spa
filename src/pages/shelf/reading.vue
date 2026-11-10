<script setup lang="ts">
import { definePage } from 'unplugin-vue-router/runtime'
import { useLibrary } from '@/composables/useLibrary'
import type { ReadingStatus } from '@/types/library'
import BaseCard from '@/components/BaseCard.vue'

definePage({
  name: 'shelf-reading',
  meta: {
    requiresAuth: true,
  },
})

const { detailedShelf, changeBookStatus, removeBookFromShelf } = useLibrary()

function handleStatusToggle(isbn: string, current: ReadingStatus): void {
  const nextStatus: ReadingStatus = current === 'reading' ? 'completed' : 'reading'
  changeBookStatus(isbn, nextStatus)
}
</script>

<template>
  <section class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-bold">Книги на полиці ({{ detailedShelf.length }})</h2>
      <RouterLink to="/" class="btn btn-sm btn-outline">
        Додати книги з каталогу
      </RouterLink>
    </div>

    <TransitionGroup
      v-if="detailedShelf.length > 0"
      name="list"
      tag="div"
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <BaseCard v-for="entry in detailedShelf" :key="entry.isbn" class="space-y-3">
        <template #header>
          <div class="flex justify-between items-center">
            <span
              class="badge font-semibold"
              :class="entry.status === 'completed' ? 'badge-secondary' : 'badge-accent'"
            >
              {{ entry.status === 'completed' ? 'Прочитано' : 'Читаю зараз' }}
            </span>
            <span class="text-xs text-base-content/50">Додано: {{ entry.addedAt }}</span>
          </div>
        </template>

        <RouterLink :to="`/books/${entry.isbn}`" class="text-lg font-bold hover:underline">
          {{ entry.book.title }}
        </RouterLink>
        <p class="text-sm text-base-content/70">{{ entry.book.author }} ({{ entry.book.year }})</p>

        <template #footer>
          <div class="flex flex-wrap gap-2 w-full justify-between items-center">
            <button
              type="button"
              class="btn btn-xs btn-primary"
              @click="handleStatusToggle(entry.isbn, entry.status)"
            >
              Змінити на «{{ entry.status === 'reading' ? 'Прочитано' : 'Читаю зараз' }}»
            </button>

            <button
              type="button"
              class="btn btn-xs btn-ghost text-error"
              @click="removeBookFromShelf(entry.isbn)"
            >
              Видалити
            </button>
          </div>
        </template>
      </BaseCard>
    </TransitionGroup>

    <div v-else class="alert bg-base-200 border border-base-300">
      <span>Ваша полиця порожня. Перейдіть у каталог, щоб додати першу книгу.</span>
    </div>
  </section>
</template>