<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
  const userStore = useUserStore();
  const { user } = useUserSession();

  // Sync nuxt-auth-utils session with Pinia store
  // Session is available immediately (SSR + client hydration)
  // No loading state needed as nuxt-auth-utils handles this internally
  watch(
    user,
    (newUser) => {
      if (newUser) {
        userStore.setUser(newUser);
      } else {
        userStore.clearUser();
      }
    },
    { immediate: true },
  );
</script>
