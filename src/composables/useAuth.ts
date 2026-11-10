import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

export function useAuth() {
  const authStore = useAuthStore()
  const { readerName, isAuthenticated } = storeToRefs(authStore)
  const router = useRouter()
  const route = useRoute()

  function login(name: string): void {
    if (!name.trim()) return
    authStore.setReader(name)

    const redirectPath = typeof route.query.redirect === 'string' ? route.query.redirect : '/shelf/reading'
    router.push(redirectPath)
  }

  function logout(): void {
    authStore.clearReader()
    router.push('/login')
  }

  function requireAuthOrRedirect(targetPath: string): boolean {
    if (!isAuthenticated.value) {
      router.push({
        path: '/login',
        query: { redirect: targetPath },
      })
      return false
    }
    return true
  }

  return {
    readerName,
    isAuthenticated,
    login,
    logout,
    requireAuthOrRedirect,
  }
}