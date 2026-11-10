<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, onBeforeRouteLeave } from 'vue-router'
import { definePage } from 'unplugin-vue-router/runtime'
import { useLibrary } from '@/composables/useLibrary'
import BaseCard from '@/components/BaseCard.vue'

definePage({
  name: 'shelf-notes',
  meta: {
    requiresAuth: true,
  },
})

const route = useRoute()
const {
  books,
  personalNotes,
  createPersonalNote,
  editPersonalNote,
  removePersonalNote,
} = useLibrary()

const initialIsbn =
  typeof route.query.isbn === 'string' && books.value.some((b) => b.isbn === route.query.isbn)
    ? route.query.isbn
    : (books.value[0]?.isbn ?? '')

const selectedIsbn = ref<string>(initialIsbn)
const noteContent = ref<string>('')
const editingNoteId = ref<string | null>(null)

const savedState = ref<{ isbn: string; content: string }>({
  isbn: initialIsbn,
  content: '',
})

const isDirty = computed<boolean>(() => {
  return (
    noteContent.value.trim() !== savedState.value.content.trim() ||
    selectedIsbn.value !== savedState.value.isbn
  )
})

function handleSaveNote(): void {
  if (!noteContent.value.trim() || !selectedIsbn.value) return

  if (editingNoteId.value) {
    editPersonalNote(editingNoteId.value, noteContent.value)
    editingNoteId.value = null
  } else {
    createPersonalNote(selectedIsbn.value, noteContent.value)
  }

  noteContent.value = ''
  savedState.value = {
    isbn: selectedIsbn.value,
    content: '',
  }
}

function startEditing(id: string, isbn: string, content: string): void {
  editingNoteId.value = id
  selectedIsbn.value = isbn
  noteContent.value = content
  savedState.value = { isbn, content }
}

function cancelEditing(): void {
  editingNoteId.value = null
  noteContent.value = ''
  savedState.value = {
    isbn: selectedIsbn.value,
    content: '',
  }
}

onBeforeRouteLeave(() => {
  if (isDirty.value) {
    const confirmed = window.confirm(
      'У вас є незбережені зміни у формі нотаток. Ви впевнені, що хочете залишити сторінку?',
    )
    if (!confirmed) {
      return false
    }
  }
  return true
})
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="lg:col-span-1">
      <BaseCard class="space-y-4">
        <template #header>
          <h2 class="text-lg font-bold">
            {{ editingNoteId ? 'Редагування нотатки' : 'Нова нотатка' }}
          </h2>
        </template>

        <form class="space-y-4" @submit.prevent="handleSaveNote">
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text font-medium">Книга (ISBN)</span>
            </div>
            <select
              v-model="selectedIsbn"
              class="select select-bordered select-sm w-full"
              :disabled="Boolean(editingNoteId)"
            >
              <option v-for="book in books" :key="book.isbn" :value="book.isbn">
                {{ book.title }} ({{ book.isbn }})
              </option>
            </select>
          </label>

          <label class="form-control w-full">
            <div class="label">
              <span class="label-text font-medium">Текст нотатки</span>
            </div>
            <textarea
              v-model="noteContent"
              rows="4"
              placeholder="Поділіться враженнями або цитатою..."
              class="textarea textarea-bordered w-full"
            ></textarea>
          </label>

          <p v-show="isDirty" class="text-error text-xs font-semibold">
            Увага: є незбережені зміни у формі!
          </p>

          <div class="flex gap-2">
            <button
              type="submit"
              class="btn btn-primary btn-sm flex-1"
              :disabled="!noteContent.trim()"
            >
              {{ editingNoteId ? 'Оновити' : 'Зберегти' }}
            </button>

            <button
              v-if="editingNoteId || isDirty"
              type="button"
              class="btn btn-ghost btn-sm"
              @click="cancelEditing"
            >
              Скасувати
            </button>
          </div>
        </form>
      </BaseCard>
    </div>

    <div class="lg:col-span-2 space-y-4">
      <h2 class="text-xl font-bold">Мої особисті нотатки ({{ personalNotes.length }})</h2>

      <TransitionGroup
        v-if="personalNotes.length > 0"
        name="list"
        tag="div"
        class="space-y-3"
      >
        <BaseCard v-for="note in personalNotes" :key="note.id" compact>
          <div class="flex justify-between items-start gap-4">
            <div class="space-y-1">
              <RouterLink
                :to="`/books/${note.isbn}`"
                class="font-bold text-primary hover:underline"
              >
                {{ note.bookTitle }}
              </RouterLink>
              <p class="text-xs font-mono text-base-content/50">
                ISBN: {{ note.isbn }} | Оновлено: {{ note.updatedAt }}
              </p>
              <p class="text-sm mt-2 whitespace-pre-line">{{ note.content }}</p>
            </div>

            <div class="join">
              <button
                type="button"
                class="btn btn-xs btn-outline join-item"
                @click="startEditing(note.id, note.isbn, note.content)"
              >
                Редагувати
              </button>
              <button
                type="button"
                class="btn btn-xs btn-outline join-item text-error"
                @click="removePersonalNote(note.id)"
              >
                Видалити
              </button>
            </div>
          </div>
        </BaseCard>
      </TransitionGroup>

      <div v-else class="alert bg-base-200 border border-base-300">
        <span>Ви ще не залишили жодної нотатки. Скористайтеся формою ліворуч.</span>
      </div>
    </div>
  </div>
</template>