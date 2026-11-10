<script setup lang="ts">
import { definePage } from 'unplugin-vue-router/runtime'
import { useLibrary } from '@/composables/useLibrary'
import BaseCard from '@/components/BaseCard.vue'
import ScopedList from '@/components/ScopedList.vue'

definePage({
  name: 'catalog',
})

const {
  genres,
  selectedGenre,
  sortBy,
  filteredAndSortedBooks,
  isBookInShelf,
  getCoverGradient,
} = useLibrary()
</script>

<template>
  <section class="space-y-6">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-base-200 p-6 rounded-box">
      <div>
        <h1 class="text-3xl font-bold text-primary">Публічний каталог клубу</h1>
        <p class="text-base-content/70 mt-1">
          Обирайте книги, переглядайте рецензії учасників та формуйте власну полицю
        </p>
      </div>

      <div class="flex flex-wrap gap-3 items-center">
        <label class="form-control w-44">
          <div class="label py-1">
            <span class="label-text text-xs font-semibold">Жанр</span>
          </div>
          <select v-model="selectedGenre" class="select select-bordered select-sm">
            <option value="ALL">Усі жанри</option>
            <option v-for="genre in genres" :key="genre" :value="genre">
              {{ genre }}
            </option>
          </select>
        </label>

        <label class="form-control w-48">
          <div class="label py-1">
            <span class="label-text text-xs font-semibold">Сортування</span>
          </div>
          <select v-model="sortBy" class="select select-bordered select-sm">
            <option value="rating">За рейтингом клубу</option>
            <option value="year">За роком видання</option>
          </select>
        </label>
      </div>
    </div>

    <ScopedList :items="filteredAndSortedBooks" key-field="isbn">
      <template #item="{ item: book }">
        <BaseCard class="gap-3">
          <template #header>
            <div
              class="h-36 rounded-lg flex flex-col justify-between p-4 text-white shadow-inner"
              :style="{ background: getCoverGradient(book.coverHue) }"
            >
              <div class="flex justify-between items-center">
                <span class="badge badge-neutral badge-sm">{{ book.genre }}</span>
                <span class="badge badge-warning badge-sm font-bold">★ {{ book.rating }}</span>
              </div>
              <p class="text-xs opacity-80 font-mono">ISBN: {{ book.isbn }}</p>
            </div>
          </template>

          <h2 class="card-title text-lg leading-snug">{{ book.title }}</h2>
          <p class="text-sm text-base-content/80 font-medium">
            {{ book.author }} • <span class="text-base-content/60">{{ book.year }} р.</span>
          </p>
          <p class="text-sm text-base-content/70 line-clamp-2">
            {{ book.annotation }}
          </p>

          <template #footer>
            <div class="flex justify-between items-center w-full">
              <span v-if="isBookInShelf(book.isbn)" class="badge badge-success badge-outline text-xs">
                У вашій полиці
              </span>
              <span v-else class="text-xs text-base-content/50">Не додано</span>

              <RouterLink
                :to="`/books/${book.isbn}`"
                class="btn btn-primary btn-sm"
              >
                Детальніше
              </RouterLink>
            </div>
          </template>
        </BaseCard>
      </template>

      <template #empty>
        <span>За обраним жанром книг не знайдено.</span>
      </template>
    </ScopedList>
  </section>
</template>