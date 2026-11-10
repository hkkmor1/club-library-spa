<script setup lang="ts">
import { useRouter } from 'vue-router'
import { definePage } from 'unplugin-vue-router/runtime'

definePage({
  name: 'not-found',
})

const router = useRouter()
</script>

<template>
  <div class="hero min-h-[65vh] bg-base-200 border border-base-300 rounded-box">
    <div class="hero-content text-center">
      <div class="max-w-md space-y-4">
        <h1 class="text-6xl font-black text-primary">404</h1>
        <h2 class="text-2xl font-bold">Сторінку або книгу за цим ISBN не знайдено</h2>
        <p class="text-base-content/70">
          Схоже, цей том загубився між стелажами нашої бібліотеки.
        </p>
        <div class="flex justify-center gap-3 pt-2">
          <button type="button" class="btn btn-outline" @click="router.go(-1)">
            Повернутися назад
          </button>
          <RouterLink to="/" class="btn btn-primary">
            На головну до каталогу
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>