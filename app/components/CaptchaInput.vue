<template>
  <div class="mb-4">
    <label v-if="label" class="block text-sm mb-1">{{ label }}</label>
    <div class="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
      <input
        v-model="localValue"
        type="text"
        class="w-full h-full p-2 text-center border rounded-md transition-colors focus:outline-none focus:border-blue-500"
        :class="invalid ? 'border-red-500' : 'border-gray-300'"
        autocomplete="off"
        placeholder="Enter captcha"
        @blur="$emit('blur')"
      />

      <button
        type="button"
        class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white text-2xl transition-colors hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
        :disabled="isLoading"
        @click="fetchCaptcha"
      >
        <span :class="{ 'animate-spin': isLoading }">↻</span>
      </button>

      <div class="relative w-full pb-[30%] overflow-hidden rounded-md bg-gray-800">
        <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center">
          <span class="text-2xl animate-spin">⟳</span>
        </div>
        <img
          v-else-if="captchaImage"
          :src="captchaImage"
          alt="CAPTCHA"
          class="absolute inset-0 w-full h-full object-contain"
        />
      </div>
    </div>
    <p v-if="invalid && error" class="mt-1 text-sm text-red-500">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted } from 'vue';
  import { logger } from '~/utils/logger';

  const props = defineProps<{
    label?: string;
    invalid?: boolean;
    error?: string;
    modelValue?: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'update:captchaKey', key: string): void;
    (e: 'blur'): void;
  }>();

  const config = useRuntimeConfig();
  const localValue = ref(props.modelValue || '');
  const captchaImage = ref('');
  const isLoading = ref(false);

  watch(localValue, (newValue) => {
    emit('update:modelValue', newValue);
  });

  watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue !== localValue.value) {
        localValue.value = newValue || '';
      }
    }
  );

  const fetchCaptcha = async () => {
    isLoading.value = true;
    try {
      const response = await $fetch<{ img: string; key: string }>(
        `${config.public.apiBaseUrl}/auth/captcha`
      );

      captchaImage.value = response.img;
      emit('update:captchaKey', response.key);
    } catch (error) {
      logger.error('Failed to fetch CAPTCHA', error);
    } finally {
      isLoading.value = false;
    }
  };

  const reset = () => {
    localValue.value = '';
    emit('update:modelValue', '');
    fetchCaptcha();
  };

  onMounted(() => {
    fetchCaptcha();
  });

  defineExpose({
    reset,
    fetchCaptcha,
  });
</script>
