<script setup lang="ts">
import {reactive} from 'vue'
import {state} from '../services/session'
import {useSession} from '../hooks/useSession'
const vm=reactive(useSession())
</script>
<template><section class="page"><h1>我的</h1><div class="panel profile-panel"><div class="avatar">{{(state.authorization?.user.name||'员').slice(0,1)}}</div><h2>{{state.authorization?.user.name||state.authorization?.user.username}}</h2></div><div class="panel"><router-link class="setting-row" to="/orders?mode=todo">我的待办 <span>→</span></router-link><router-link class="setting-row" to="/orders?mode=related">与我相关的工单 <span>→</span></router-link><router-link class="setting-row" to="/orders?mode=review">报事审核 <span>→</span></router-link><router-link class="setting-row" to="/orders?mode=warning">物业预警 <span>→</span></router-link></div><van-button block type="danger" :loading="vm.loading" @click="vm.logout" native-type="button">退出登录</van-button></section></template>
