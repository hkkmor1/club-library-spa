import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useLibraryStore } from '@/stores/library.store'
import { useAuthStore } from '@/stores/auth.store'
import type { Book, BookGenre, ReadingStatus } from '@/types/library'

export type SortField = 'rating' | 'year'

export function useLibrary() {
  const libraryStore = useLibraryStore()
  const authStore = useAuthStore()

  const { books, shelf, notes } = storeToRefs(libraryStore)
  const { readerName } = storeToRefs(authStore)

  const selectedGenre = ref<BookGenre | 'ALL'>('ALL')
  const sortBy = ref<SortField>('rating')

  const genres: BookGenre[] = ['Антиутопія', 'Технічна література', 'Фантастика', 'Детектив']

  const filteredAndSortedBooks = computed<Book[]>(() => {
    const filtered =
      selectedGenre.value === 'ALL'
        ? [...books.value]
        : books.value.filter((book) => book.genre === selectedGenre.value)

    return filtered.sort((a, b) => b[sortBy.value] - a[sortBy.value])
  })

  const detailedShelf = computed(() => {
    return shelf.value
      .map((item) => {
        const book = books.value.find((b) => b.isbn === item.isbn)
        return book ? { ...item, book } : null
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
  })

  const personalNotes = computed(() => {
    return notes.value
      .filter((n) => n.authorName === readerName.value)
      .map((note) => {
        const book = books.value.find((b) => b.isbn === note.isbn)
        return {
          ...note,
          bookTitle: book ? book.title : note.isbn,
        }
      })
  })

  function findBookByIsbn(isbn: string): Book | undefined {
    return books.value.find((b) => b.isbn === isbn)
  }

  function getNotesByIsbn(isbn: string) {
    return notes.value.filter((n) => n.isbn === isbn)
  }

  function isBookInShelf(isbn: string): boolean {
    return shelf.value.some((item) => item.isbn === isbn)
  }

  function addBookToShelf(isbn: string, status: ReadingStatus = 'reading'): void {
    libraryStore.upsertShelfItem(isbn, status)
  }

  function changeBookStatus(isbn: string, status: ReadingStatus): void {
    libraryStore.upsertShelfItem(isbn, status)
  }

  function removeBookFromShelf(isbn: string): void {
    libraryStore.removeShelfItem(isbn)
  }

  function createPersonalNote(isbn: string, content: string): void {
    if (!readerName.value || !content.trim()) return
    libraryStore.addNote(isbn, readerName.value, content)
  }

  function editPersonalNote(id: string, content: string): void {
    libraryStore.updateNote(id, content)
  }

  function removePersonalNote(id: string): void {
    libraryStore.deleteNote(id)
  }

  function getCoverGradient(hue: number): string {
    const safeHue = (hue % 30) + 15
    return `linear-gradient(135deg, hsl(${safeHue}, 35%, 42%), hsl(${safeHue - 5}, 40%, 26%))`
  }

  return {
    books,
    shelf,
    notes,
    genres,
    selectedGenre,
    sortBy,
    filteredAndSortedBooks,
    detailedShelf,
    personalNotes,
    findBookByIsbn,
    getNotesByIsbn,
    isBookInShelf,
    addBookToShelf,
    changeBookStatus,
    removeBookFromShelf,
    createPersonalNote,
    editPersonalNote,
    removePersonalNote,
    getCoverGradient,
  }
}