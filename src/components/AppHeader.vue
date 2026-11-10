<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { readerName, isAuthenticated, logout } = useAuth()

const currentTheme = ref<string>('caramellatte')

watch(
  currentTheme,
  (theme) => {
    document.documentElement.setAttribute('data-theme', theme)
  },
  { immediate: true },
)
</script>

<template>
  <header class="navbar bg-base-200 border-b border-base-300 px-4 lg:px-8 sticky top-0 z-30">
    <div class="navbar-start gap-2">
      <div class="join">
        <button
          type="button"
          class="btn btn-xs btn-outline join-item"
          title="Крок назад"
          @click="router.back()"
        >
          Назад
        </button>
        <button
          type="button"
          class="btn btn-xs btn-outline join-item"
          title="Крок вперед"
          @click="router.forward()"
        >
          Вперед
        </button>
      </div>

      <RouterLink to="/" class="btn btn-ghost text-lg font-bold tracking-tight">
        Клубна Бібліотека
      </RouterLink>
    </div>

    <div class="navbar-center hidden md:flex">
      <ul class="menu menu-horizontal gap-2 px-1">
        <li>
          <RouterLink to="/" class="btn btn-sm btn-ghost">Каталог</RouterLink>
        </li>
        <li>
          <RouterLink to="/shelf/reading" class="btn btn-sm btn-ghost">
            Читацький кабінет
          </RouterLink>
        </li>
      </ul>
    </div>

    <div class="navbar-end gap-3">
      <select v-model="currentTheme" class="select select-bordered select-xs w-36">
        <option value="caramellatte">Світло-коричнева</option>
        <option value="retro">Пастельна</option>
        <option value="coffee">Темно-коричнева</option>
      </select>

      <template v-if="isAuthenticated">
        <span class="badge badge-neutral badge-lg font-medium">
          Читач: {{ readerName }}
        </span>
        <button type="button" class="btn btn-sm btn-outline" @click="logout">
          Вийти
        </button>
      </template>

      <RouterLink v-else to="/login" class="btn btn-sm btn-primary">
        Увійти
      </RouterLink>
    </div>
  </header>
</template>