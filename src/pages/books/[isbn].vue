<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { definePage } from 'unplugin-vue-router/runtime'
import { useLibrary } from '@/composables/useLibrary'
import { useAuth } from '@/composables/useAuth'
import type { Book } from '@/types/library'
import BaseCard from '@/components/BaseCard.vue'

definePage({
  name: 'book-detail',
})

const route = useRoute()
const router = useRouter()

const {
  findBookByIsbn,
  getNotesByIsbn,
  isBookInShelf,
  addBookToShelf,
  getCoverGradient,
} = useLibrary()

const { isAuthenticated, requireAuthOrRedirect } = useAuth()

const currentBook = ref<Book | undefined>(undefined)

watch(
  () => (route.params as Record<string, string>).isbn,
  (newIsbn) => {
    const isbnStr = String(newIsbn || '')
    const found = findBookByIsbn(isbnStr)
    
    if (!found) {
      router.push({ path: '/not-found' })
      return
    }
    currentBook.value = found
  },
  { immediate: true },
)

const publicNotes = computed(() => {
  return currentBook.value ? getNotesByIsbn(currentBook.value.isbn) : []
})

const alreadyInShelf = computed<boolean>(() => {
  return currentBook.value ? isBookInShelf(currentBook.value.isbn) : false
})

function handleAddToShelf(): void {
  if (!currentBook.value) return
  if (!requireAuthOrRedirect(route.fullPath)) return

  addBookToShelf(currentBook.value.isbn, 'reading')
}
</script>

<template>
  <div v-if="currentBook" class="space-y-8">
    <div class="breadcrumbs text-sm">
      <ul>
        <li><RouterLink to="/">Каталог</RouterLink></li>
        <li>{{ currentBook.title }}</li>
      </ul>
    </div>

    <BaseCard class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          class="rounded-xl p-6 text-amber-50 flex flex-col justify-between min-h-60 shadow-md"
          :style="{ background: getCoverGradient(currentBook.coverHue) }"
        >
          <div class="flex justify-between">
            <span class="badge badge-neutral">{{ currentBook.genre }}</span>
            <span class="badge badge-secondary font-bold">Рейтинг: {{ currentBook.rating }}</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold">{{ currentBook.title }}</h2>
            <p class="opacity-90">{{ currentBook.author }}</p>
          </div>
          <p class="text-xs font-mono opacity-80">ISBN: {{ currentBook.isbn }}</p>
        </div>

        <div class="md:col-span-2 flex flex-col justify-between space-y-4">
          <div class="space-y-3">
            <div class="flex flex-wrap items-center gap-2">
              <h1 class="text-3xl font-bold">{{ currentBook.title }}</h1>
              <span class="badge badge-outline">{{ currentBook.year }} рік</span>
            </div>

            <div class="divider my-1">Анотація</div>
            <p class="text-base-content/80 leading-relaxed">
              {{ currentBook.annotation }}
            </p>

            <div class="divider my-1">Про автора</div>
            <p class="text-sm text-base-content/70">
              <strong class="text-base-content">{{ currentBook.author }}</strong> -
              {{ currentBook.authorBio }}
            </p>
          </div>

          <div class="pt-4 flex flex-wrap items-center gap-4">
            <button
              v-if="!alreadyInShelf"
              type="button"
              class="btn btn-primary"
              @click="handleAddToShelf"
            >
              {{ isAuthenticated ? 'Додати до полиці' : 'Додати до полиці (потрібен вхід)' }}
            </button>

            <RouterLink v-else to="/shelf/reading" class="btn btn-secondary btn-outline">
              На вашій полиці (перейти до кабінету)
            </RouterLink>
          </div>
        </div>
      </div>
    </BaseCard>

    <section class="space-y-4">
      <div class="flex justify-between items-center">
        <h3 class="text-xl font-bold">Публічні нотатки учасників клубу</h3>
        <RouterLink
          v-if="isAuthenticated"
          :to="{ path: '/shelf/notes', query: { isbn: currentBook.isbn } }"
          class="btn btn-sm btn-secondary"
        >
          Залишити власну нотатку
        </RouterLink>
      </div>

      <div v-if="publicNotes.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="note in publicNotes"
          :key="note.id"
          class="card bg-base-200 border border-base-300 shadow-xs"
        >
          <div class="card-body p-5">
            <div class="flex justify-between items-center text-xs text-base-content/60">
              <span class="font-bold text-primary">Автор: {{ note.authorName }}</span>
              <span>{{ note.updatedAt }}</span>
            </div>
            <p class="text-sm mt-2">{{ note.content }}</p>
          </div>
        </div>
      </div>

      <div v-else class="alert bg-base-200 border border-base-300">
        <span>До цієї книги ще немає публічних нотаток. Станьте першим.</span>
      </div>
    </section>
  </div>
</template>