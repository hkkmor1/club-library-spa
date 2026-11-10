import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Book, ShelfItem, BookNote, ReadingStatus } from '@/types/library'

const SHELF_STORAGE_KEY = 'club_library_shelf'
const NOTES_STORAGE_KEY = 'club_library_notes'

const INITIAL_BOOKS: Book[] = [
  {
    isbn: '978-966-2355-57-4',
    title: '1984',
    author: 'Джордж Орвелл',
    authorBio: 'Британський письменник і публіцист, автор всесвітньо відомих антиутопій.',
    genre: 'Антиутопія',
    year: 1949,
    rating: 4.9,
    annotation: 'Історія Вінстона Сміта, який живе під постійним наглядом Старшого Брата і намагається зберегти власну свідомість та свободу думки.',
    coverHue: 22,
  },
  {
    isbn: '978-617-548-112-7',
    title: 'HTML, CSS та JavaScript все в одному для чайників',
    author: 'Пол Макфедріс',
    authorBio: 'Технічний письменник, автор понад дев’яноста посібників з програмування та вебтехнологій.',
    genre: 'Технічна література',
    year: 2023,
    rating: 4.7,
    annotation: 'Практичний посібник зі створення сучасних вебсайтів: від базової розмітки та стилізації до інтерактивних скриптів.',
    coverHue: 34,
  },
  {
    isbn: '978-617-12-9244-9',
    title: 'Проєкт «Аве Марія»',
    author: 'Енді Вейр',
    authorBio: 'Американський письменник, майстер твердої наукової фантастики та автор роману «Марсіянин».',
    genre: 'Фантастика',
    year: 2021,
    rating: 4.9,
    annotation: 'Шкільний учитель прокидається на космічному кораблі без спогадів про себе, але з місією врятувати Землю від глобальної катастрофи.',
    coverHue: 28,
  },
  {
    isbn: '978-966-2355-61-1',
    title: 'Колгосп тварин',
    author: 'Джордж Орвелл',
    authorBio: 'Британський письменник і есеїст, який тонко досліджував природу влади та пропаганди.',
    genre: 'Антиутопія',
    year: 1945,
    rating: 4.8,
    annotation: 'Сатирична притча про ферму, де тварини виганяють власника заради рівності, але поступово опиняються під новою диктатурою.',
    coverHue: 18,
  },
  {
    isbn: '978-966-917-345-2',
    title: 'Пригоди Шерлока Холмса',
    author: 'Артур Конан Дойл',
    authorBio: 'Шотландський письменник і лікар, творець класичного образу лондонського приватного детектива.',
    genre: 'Детектив',
    year: 1892,
    rating: 4.8,
    annotation: 'Збірка детективних оповідань про розслідування Шерлока Холмса та його вірного друга доктора Ватсона за допомогою дедуктивного методу.',
    coverHue: 40,
  },
]

const INITIAL_NOTES: BookNote[] = []

export const useLibraryStore = defineStore('library', () => {
  const books = ref<Book[]>(INITIAL_BOOKS)

  const savedShelf = localStorage.getItem(SHELF_STORAGE_KEY)
  const shelf = ref<ShelfItem[]>(savedShelf ? JSON.parse(savedShelf) : [])

  const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY)
  const notes = ref<BookNote[]>(savedNotes ? JSON.parse(savedNotes) : INITIAL_NOTES)

  watch(
    shelf,
    (newShelf) => {
      localStorage.setItem(SHELF_STORAGE_KEY, JSON.stringify(newShelf))
    },
    { deep: true },
  )

  watch(
    notes,
    (newNotes) => {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(newNotes))
    },
    { deep: true },
  )

  function upsertShelfItem(isbn: string, status: ReadingStatus = 'reading'): void {
    const existing = shelf.value.find((item) => item.isbn === isbn)
    if (existing) {
      existing.status = status
    } else {
      shelf.value.push({
        isbn,
        status,
        addedAt: new Date().toISOString().slice(0, 10),
      })
    }
  }

  function removeShelfItem(isbn: string): void {
    shelf.value = shelf.value.filter((item) => item.isbn !== isbn)
  }

  function addNote(isbn: string, authorName: string, content: string): void {
    notes.value.unshift({
      id: `note-${Date.now()}`,
      isbn,
      authorName,
      content: content.trim(),
      updatedAt: new Date().toISOString().slice(0, 10),
    })
  }

  function updateNote(id: string, content: string): void {
    const target = notes.value.find((n) => n.id === id)
    if (target) {
      target.content = content.trim()
      target.updatedAt = new Date().toISOString().slice(0, 10)
    }
  }

  function deleteNote(id: string): void {
    notes.value = notes.value.filter((n) => n.id !== id)
  }

  return {
    books,
    shelf,
    notes,
    upsertShelfItem,
    removeShelfItem,
    addNote,
    updateNote,
    deleteNote,
  }
})