<script setup lang="ts">
import {Button as VanButton} from 'vant'
import MobileNotice from '../components/mobile/MobileNotice.vue'
import {reactive} from 'vue'
import {RightOutlined,CarryOutOutlined,TeamOutlined,AuditOutlined,AlertOutlined,SafetyCertificateOutlined,LogoutOutlined} from '../components/mobile/icons'
import {state} from '../services/session'
import {useAccount} from '../hooks/useAccount'
import {inShell} from '../shell/runtime'

const vm=reactive(useAccount())
const links=[
 {mode:'todo',label:'我的待办',hint:'及时处理当前任务',icon:CarryOutOutlined},
 {mode:'related',label:'与我相关的工单',hint:'查看我参与的处理记录',icon:TeamOutlined},
 {mode:'review',label:'报事审核',hint:'查看报事审核申请',icon:AuditOutlined},
 {mode:'warning',label:'物业预警',hint:'关注即将超时的报事',icon:AlertOutlined},
]
</script>
<template>
 <section class="page profile-page">
  <div class="panel profile-panel"><img class="profile-art" src="../assets/images/report/repair-records.svg" alt="" /><div class="avatar">{{(state.authorization?.user.name||state.authorization?.user.username||'员').slice(0,1)}}</div><h2>{{state.authorization?.user.name||state.authorization?.user.username}}</h2><span class="profile-badge"><SafetyCertificateOutlined aria-hidden="true" />报事报修 · 员工工作台</span></div>
  <div class="panel profile-links">
   <router-link v-for="item in links" :key="item.mode" class="setting-row" :to="'/orders?mode='+item.mode"><i><component :is="item.icon" aria-hidden="true" /></i><span>{{item.label}}<small>{{item.hint}}</small></span><RightOutlined aria-hidden="true" /></router-link>
  </div>
  <MobileNotice v-if="vm.error" :message="vm.error" type="error" show-icon />
  <van-button v-if="!inShell()" block type="danger" class="logout-button" :loading="vm.loading" @click="vm.logout"><LogoutOutlined aria-hidden="true" />退出登录</van-button>
 </section>
</template>
