import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import './style.css';
import App from './App.vue';
import { useMatrixStore } from './store/store';

const app = createApp(App);
app.use(createPinia());
app.use(router);

const matrixStore = useMatrixStore();
matrixStore.restoreSession();

app.mount('#app');
