<template>
  <div class="flex items-center gap-2 p-4">
    <select
      id="language-select"
      v-model="currentLocale"
      @change="changeLocale"
      class="px-2 py-2 border border-gray-300 rounded hover:border-gray-600 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 cursor-pointer text-base transition-colors"
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
  await navigateTo(switchLocalePath(currentLocale.value));
};
</script>
