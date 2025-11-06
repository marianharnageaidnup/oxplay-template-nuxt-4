<script setup>
  const { locales, setLocale } = useI18n();
</script>

<template>
  <div>
    <p>Lang Switcher</p>
    <div class="flex gap-2">
      <button class="bg-amber-100 p-2" v-for="locale in locales" @click="setLocale(locale.code)">
        {{ locale.name }}
      </button>
    </div>
  </div>
</template>
