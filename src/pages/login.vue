<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { definePage } from 'unplugin-vue-router/runtime'
import { useAuth } from '@/composables/useAuth'
import BaseCard from '@/components/BaseCard.vue'

definePage({
  name: 'login',
})

const route = useRoute()
const { login } = useAuth()

const nameInput = ref<string>('')
const errorMsg = ref<string>('')

function handleSubmit(): void {
  if (nameInput.value.trim().length < 2) {
    errorMsg.value = 'Введіть коректне ім’я читача (мінімум 2 символи).'
    return
  }
  errorMsg.value = ''
  login(nameInput.value)
}
</script>

<template>
  <div class="max-w-md mx-auto mt-10">
    <BaseCard class="space-y-4">
      <template #header>
        <h1 class="text-2xl font-bold text-primary">Вхід до читацького клубу</h1>
      </template>

      <div v-if="route.query.redirect" class="alert alert-warning text-xs">
        <span>Для доступу до сторінки «{{ route.query.redirect }}» необхідно авторизуватися.</span>
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text font-medium">Ім'я читача</span>
          </div>
          <input
            v-model="nameInput"
            type="text"
            placeholder="Наприклад, Маргарита"
            class="input input-bordered w-full"
          />
        </label>

        <p v-show="errorMsg" class="text-error text-xs font-semibold">
          {{ errorMsg }}
        </p>

        <button type="submit" class="btn btn-primary w-full">
          Увійти до кабінету
        </button>
      </form>
    </BaseCard>
  </div>
</template>