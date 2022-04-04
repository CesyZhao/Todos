import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import '@arco-design/web-vue/dist/arco.css';

const app = createApp(App)

app.use(createPinia())

app.use(ArcoVueIcon)

app.mount('#app')
