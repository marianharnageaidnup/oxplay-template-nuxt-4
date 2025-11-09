<template>
  <ClientOnly>
    <div class="flex flex-col items-center justify-center gap-y-4">
      <div
        v-if="userStore.isAuthenticated"
        class="flex flex-col items-center justify-center gap-y-4"
      >
        <h1>{{ $t('title') }}</h1>
        <LazyLanguageSwitcher />
        <p>
          Is user Logedin:
          <span
            class="p-2 rounded-md"
            :class="userStore.isAuthenticated ? 'bg-green-500' : 'bg-red-500'"
            >{{ userStore.isAuthenticated }}</span
          >
        </p>

        <div class="flex flex-col gap-y-2 p-4 border rounded-md">
          <p>
            Username: <span class="font-bold">{{ userStore.username }}</span>
          </p>
          <p>
            Balance: <span class="font-bold">{{ userStore.balance }} {{ userStore.currency }}</span>
          </p>
        </div>

        <button @click="handleLogout" class="p-2 bg-blue-400 cursor-pointer">logout</button>

        <button type="button" @click="handleRefresh" class="p-2 bg-purple-400">
          Refresh auth token
        </button>
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

        <div class="text-center my-10">
          <h2 class="mb-2">Register</h2>
          <form
            @submit.prevent="handleRegister"
            class="flex flex-col gap-y-2 border rounded-md p-4 bg-blue-50"
          >
            <input
              v-model="registerFormData.username"
              type="text"
              required
              placeholder="Username"
              class="p-2 bg-white"
            />
            <input
              v-model="registerFormData.email"
              type="email"
              required
              placeholder="Email"
              class="p-2 bg-white"
            />
            <input
              v-model="registerFormData.password"
              type="password"
              required
              placeholder="Password"
              class="p-2 bg-white"
            />
            <input
              v-model="registerFormData.password_confirmation"
              type="password"
              required
              placeholder="Confirm Password"
              class="p-2 bg-white"
            />
            <input
              v-model="registerFormData.phone"
              type="tel"
              required
              placeholder="Phone"
              class="p-2 bg-white"
            />
            <select v-model="registerFormData.currency" class="p-2" required>
              <option value="IDR">IDR - Indonesian Rupiah</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
            </select>
            <input
              v-model="registerFormData.referral_code"
              type="text"
              placeholder="Referral Code (Optional)"
              class="p-2 bg-white"
            />
            <LazyCaptchaInput
              v-model="registerFormData.captcha"
              label="Enter CAPTCHA"
              :invalid="!!registerError"
              :error="registerError"
              @update:captcha-key="registerFormData.captcha_key = $event"
            />
            <button type="submit" :disabled="isLoading" class="p-2 bg-yellow-400">Register</button>
          </form>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import type { LoginPayload, RegistrationPayload } from '~/types/auth';

  const userStore = useUserStore();
  const { login, logout, register, refreshToken, isLoading } = useAuth();
  const formData = reactive<LoginPayload>({
    email: '',
    password: '',
  });

  const registerFormData = reactive<RegistrationPayload>({
    username: 'testUser',
    email: 'testUser@test.com',
    password: 'Test.1234',
    password_confirmation: 'Test.1234',
    captcha: '',
    currency: 'IDR',
    phone: '+62819555831',
    referral_code: '',
    captcha_type: 'image',
    captcha_key: '',
  });

  const registerError = ref('');

  const handleLogin = async () => {
    await login({
      email: formData.email,
      password: formData.password,
    });
  };

  const handleRegister = async () => {
    const result = await register(registerFormData);

    if (result.success) {
      alert('Registration successful!');
    } else {
      if (result.errors?.captcha && result.errors.captcha.length > 0) {
        registerError.value = result.errors.captcha[0] || 'Invalid CAPTCHA';
      } else {
        registerError.value = result.message || 'Registration failed';
      }
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleRefresh = async () => {
    await refreshToken();
  };
</script>
