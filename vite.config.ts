import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig({
 base:'/repair-h5/',plugins:[vue({template:{compilerOptions:{isCustomElement:tag=>tag==='altcha-widget'}}})],
 resolve:{dedupe:['vue']},server:{host:'127.0.0.1',port:9304,strictPort:true,
 proxy:process.env.H5_API_PROXY?{'/api':{target:process.env.H5_API_PROXY,changeOrigin:true,rewrite:path=>path.replace(/^\/api/,'')}}:undefined},
})
