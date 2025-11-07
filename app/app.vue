<template>
  <ClientOnly>
    <div v-if="userStore.isLoading" class="flex items-center justify-center min-h-screen">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"
      ></div>
      <p class="ml-4 text-gray-600">Loading...</p>
    </div>
    <template v-else>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
  const userStore = useUserStore();
</script>
