<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin">
      <input v-model="homeserver" placeholder="Домашний сервер" required />
      <input v-model="username" placeholder="Логин" required />
      <input v-model="password" type="password" placeholder="Пароль" required />
      <button type="submit" :disabled="matrixStore.isLoading">
        {{ matrixStore.isLoading ? 'Загрузка...' : 'Войти' }}
      </button>
    </form>

    <div v-if="matrixStore.isLoading" class="loader"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMatrixStore } from '@/store/store';
import { useRouter } from 'vue-router';

const matrixStore = useMatrixStore();
const router = useRouter();
const homeserver = ref('https://matrix.org');
const username = ref('');
const password = ref('');

const handleLogin = async () => {
  await matrixStore.login(homeserver.value, username.value, password.value);
  router.push('/chats');
};
</script>

<style scoped>
.loader {
  width: 40px;
  height: 40px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 10px auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
