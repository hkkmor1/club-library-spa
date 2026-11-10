import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'club_library_reader_name'

export const useAuthStore = defineStore('auth', () => {
  const readerName = ref<string>(localStorage.getItem(STORAGE_KEY) ?? '')

  const isAuthenticated = computed<boolean>(() => readerName.value.trim().length > 0)

  watch(readerName, (newName) => {
    if (newName.trim()) {
      localStorage.setItem(STORAGE_KEY, newName.trim())
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  })

  function setReader(name: string): void {
    readerName.value = name.trim()
  }

  function clearReader(): void {
    readerName.value = ''
  }

  return {
    readerName,
    isAuthenticated,
    setReader,
    clearReader,
  }
})