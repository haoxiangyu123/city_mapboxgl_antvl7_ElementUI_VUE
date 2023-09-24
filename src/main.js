import { createApp } from 'vue'
import './style.css'
// elementUi配置
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 配置vue-router
import router from './router'
// 引入初始化样式
import './main.css'

import App from './App.vue'

// 这里导出一下app
export const app=createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount('#app')



