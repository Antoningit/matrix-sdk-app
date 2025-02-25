<template>
  <div id="app">
    <nav>
      <router-link v-if="matrixStore.client == null" to="/">Login</router-link>
      <router-link v-else to="/chats">Chats</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useMatrixStore } from './store/store';

const matrixStore = useMatrixStore();
</script>

<style scoped>
nav {
  padding: 10px;
  background: #42b983;
  text-align: center;
}

nav a {
  color: white;
  text-decoration: none;
  margin: 0 10px;
  font-weight: bold;
}

nav a.router-link-active {
  text-decoration: underline;
}
</style>
