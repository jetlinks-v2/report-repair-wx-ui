<script setup lang="ts">
import {Button as VanButton} from 'vant'
import {useRoute,useRouter} from 'vue-router'
import {computed} from 'vue'
import {HomeOutlined,UnorderedListOutlined,PlusOutlined,UserOutlined,LeftOutlined} from './components/mobile/icons'
import {can} from './services/session'
import {orderListTitle} from './services/navigation'
import {actionNames} from './services/labels'
const route=useRoute(),router=useRouter()
const login=computed(()=>route.path==='/login'),home=computed(()=>route.path==='/'),detail=computed(()=>!['/','/orders','/profile','/login'].includes(route.path))
const title=computed(()=>route.path==='/create'?'发起报事':route.params.action?actionNames[String(route.params.action)]||'处理工单':route.params.id?'工单详情':route.path==='/profile'?'我的':orderListTitle(route.query.mode||'pool'))
function back(){if(router.options.history.state.back)router.back();else void router.replace('/')}
</script>
<template>
 <div class="app-shell">
  <header v-if="!login&&!home" class="topbar">
   <van-button plain class="back-button" aria-label="返回" @click="back" native-type="button"><LeftOutlined /></van-button>
   <h1>{{title}}</h1><router-link v-if="route.path==='/orders'&&can('create')" class="header-side" to="/create" aria-label="发起报事"><PlusOutlined /></router-link><span v-else class="header-side"></span>
  </header>
  <main><router-view /></main>
  <nav v-if="!login&&!detail" class="bottom-nav" aria-label="主导航">
   <router-link to="/" :class="{active:home}"><HomeOutlined /><span>工作台</span></router-link>
   <router-link to="/orders?mode=pool" :class="{active:route.path==='/orders'}"><UnorderedListOutlined /><span>工单</span></router-link>
   <router-link to="/profile" :class="{active:route.path==='/profile'}"><UserOutlined /><span>我的</span></router-link>
  </nav>
 </div>
</template>
