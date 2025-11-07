<template>
  <ClientOnly>
    <div class="flex flex-col items-center justify-center gap-y-4">
      <div
        v-if="userStore.isAuthenticated"
        class="flex flex-col items-center justify-center gap-y-4"
      >
        <h1>{{ $t('title') }}</h1>
        <LanguageSwitcher />
        <p>
          Is user Logedin:
          <span
            class="p-2 rounded-md"
            :class="userStore.isAuthenticated ? 'bg-green-500' : 'bg-red-500'"
            >{{ userStore.isAuthenticated }}</span
          >
        </p>
        <button @click="handleLogout" class="p-2 bg-blue-400 cursor-pointer">logout</button>
      </div>
      <div v-if="!userStore.isAuthenticated">
        <form @submit.prevent="handleLogin" class="flex flex-col gap-y-2 border rounded-md p-4">
          <input v-model="formData.email" type="text" required placeholder="USER" class="p-2" />
          <input
            v-model="formData.password"
            type="password"
            required
            placeholder="PASSWORD"
            class="p-2"
          />
          <button type="submit" :disabled="isLoading" class="p-2 bg-blue-400">Login</button>
        </form>

        <div class="text-center py-10">
          <h2 class="mb-2">Register</h2>
          <button @click="handleRegister" type="button" class="p-2 w-full bg-yellow-400">
            Register
          </button>
        </div>
      </div>

      <div v-if="userStore.isAuthenticated" class="flex flex-col gap-y-2 p-4 border rounded-md">
        <p>
          Username: <span class="font-bold">{{ userStore.username }}</span>
        </p>
        <p>
          Balance: <span class="font-bold">{{ userStore.balance }} {{ userStore.currency }}</span>
        </p>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import type { LoginPayload } from '~/types/auth';

  const userStore = useUserStore();
  const { login, logout, register, isLoading } = useAuth();
  const formData = reactive<LoginPayload>({
    email: '',
    password: '',
  });

  const handleLogin = async () => {
    const result = await login({
      email: formData.email,
      password: formData.password,
    });

    console.log('Login Response:', {
      success: result.success,
      message: result.message,
      errors: result.errors,
    });
  };

  const handleRegister = async () => {
    const result = await register({
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
      captcha: '',
      currency: 'IDR',
      phone: '',
      referral_code: '',
      captcha_type: '',
      captcha_key: '',
    });

    console.log('Login Response:', {
      success: result.success,
      message: result.message,
      errors: result.errors,
    });
  };

  const handleLogout = async () => {
    await logout();
  };
</script>
