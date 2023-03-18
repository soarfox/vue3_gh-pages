import { createApp } from 'vue'
import { createPinia } from 'pinia'
// 安裝完vue axios套件後, 需要引用它們
import axios from 'axios'
import VueAxios from 'vue-axios'

import App from './App.vue'
// 因為index.js中有export default router這個檔案, 故在此可以引入使用
import router from './router'

// 將Vite專案預設的css註解掉
// import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
// 安裝完vue axios套件後, 需要透過app.use方法來使用它們
app.use(VueAxios, axios)
app.mount('#app')
