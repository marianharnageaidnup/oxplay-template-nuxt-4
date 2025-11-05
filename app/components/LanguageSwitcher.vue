<template>
  <div class="language-switcher">
    <select
      id="language-select"
      v-model="currentLocale"
      @change="changeLocale"
      class="language-select"
    >
      <option
        v-for="locale in availableLocales"
        :key="locale.code"
        :value="locale.code"
      >
        {{ locale.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n();
const switchLocalePath = useSwitchLocalePath();

const currentLocale = ref(locale.value);

const availableLocales = computed(() => {
  return locales.value;
});

const changeLocale = async () => {
  await setLocale(currentLocale.value);
  // Navigate to the same page in the new locale
  await navigateTo(switchLocalePath(currentLocale.value));
};
</script>

<style scoped>
.language-switcher {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
}

.language-select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  font-size: 1rem;
}

.language-select:hover {
  border-color: #999;
}

.language-select:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}
</style>
