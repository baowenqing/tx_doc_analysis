import {createApp} from 'vue'
import {createPinia} from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import lodash from "lodash";
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(ElementPlus, {
    locale: zhCn
})

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

if (window) {
    // window.$enums=enums
    window._ = lodash

}

app.config.globalProperties.$_ = lodash


app.mount('#app')
