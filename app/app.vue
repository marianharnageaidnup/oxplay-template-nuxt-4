<template>
  <div>
    <LanguageSwitcher />
    <h1>{{ $t('title') }}</h1>
  </div>
</template>

<script setup lang="ts">
  // Basic example of pinia state
  import { useGlobalStore } from './stores/global';
  const globalStore = useGlobalStore();

  // Access state
  console.log(globalStore.isLoading);
  console.log(globalStore.message);

  // Call actions
  globalStore.setLoading(true);
  globalStore.setMessage('Hello World');
</script>
