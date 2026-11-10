export type BookGenre = 'Антиутопія' | 'Технічна література' | 'Фантастика' | 'Детектив'

export type ReadingStatus = 'reading' | 'completed'

export interface Book {
  isbn: string
  title: string
  author: string
  authorBio: string
  genre: BookGenre
  year: number
  rating: number
  annotation: string
  coverHue: number
}

export interface ShelfItem {
  isbn: string
  status: ReadingStatus
  addedAt: string
}

export interface BookNote {
  id: string
  isbn: string
  authorName: string
  content: string
  updatedAt: string
}