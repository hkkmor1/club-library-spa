<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <div class="min-h-screen bg-base-100 text-base-content flex flex-col">
    <AppHeader />

    <main class="container mx-auto px-4 py-8 flex-1">
      <RouterView v-slot="{ Component }">
        <Transition mode="out-in" appear>
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    
  </div>
</template>