<script setup lang="ts">
import {reactive,ref,computed} from 'vue'
import dayjs from 'dayjs'
import {CalendarOutlined,DownOutlined,ArrowRightOutlined,ClockCircleOutlined,AccountBookOutlined,AuditOutlined,AlertOutlined,UserOutlined} from '../components/mobile/icons'
import {useHome} from '../hooks/useHome'
import {can} from '../services/session'
import {name} from '../services/labels'
const vm=reactive(useHome()),dateOpen=ref(false),projectOpen=ref(false)
const draftStart=ref(vm.start),draftEnd=ref(vm.end)
const projectName=computed(()=>name(vm.projects.find(p=>p.id===vm.state.projectId)||{})||'全部授权项目')
function openDate(){draftStart.value=vm.start;draftEnd.value=vm.end;dateOpen.value=true}
function applyDate(){vm.start=draftStart.value;vm.end=draftEnd.value;dateOpen.value=false;void vm.load()}
const dateValid=computed(()=>draftStart.value&&draftEnd.value&&draftStart.value<=draftEnd.value)
</script>
<template>
 <section class="home-page">
  <header class="home-nav"><span class="header-side"></span><van-button plain class="community-switch" @click="projectOpen=true" native-type="button">{{projectName}} <DownOutlined /></van-button><router-link to="/profile" class="header-side" aria-label="我的"><UserOutlined /></router-link></header>
  <div class="home-content">
   <van-button plain class="date-row" @click="openDate" native-type="button"><CalendarOutlined /><span>{{vm.start}} 至 {{vm.end}}</span><DownOutlined /></van-button>
   <MobileNotice v-if="vm.error" :message="vm.error" type="error" show-icon><template #action><van-button size="small" @click="vm.load" native-type="button">重试</van-button></template></MobileNotice>
   <MobileLoading :loading="vm.loading"><template v-if="vm.metrics">
    <button class="summary-panel" @click="vm.go('pool')">
     <img class="summary-bg" src="/images/report/summary-bg-mp.png" alt=""><img class="summary-icon" src="/images/report/summary-icon.png" alt="">
     <div><span>报事量</span><strong>{{vm.metrics.total}}</strong></div><div><span>报事完成率</span><strong>{{vm.completionRate}}<small>%</small></strong></div>
    </button>
    <div class="metric-grid">
     <button class="metric" @click="vm.go('unfinished')"><i><ClockCircleOutlined /></i><div><span>未完成报事</span><strong>{{vm.metrics.unfinished}}</strong></div></button>
     <button class="metric" @click="vm.go('paid')"><i><AccountBookOutlined /></i><div><span>有偿报事</span><strong>{{vm.metrics.paid}}</strong></div></button>
     <button class="metric" @click="vm.go('review')"><i><AuditOutlined /></i><div><span>报事审核</span><strong>{{vm.metrics.audit}}</strong></div></button>
     <button class="metric" @click="vm.go('warning')"><i><AlertOutlined /></i><div><span>物业预警</span><strong>{{vm.metrics.warning}}</strong></div></button>
    </div>
   </template><van-skeleton v-else-if="vm.loading" active /></MobileLoading>
   <router-link v-if="can('create')" class="create-banner" to="/create"><img src="/images/report/cta-bg-mp.png" alt=""><div><strong>发起报事</strong><span>前往 <ArrowRightOutlined /></span></div></router-link>
   <div class="quick-links"><router-link to="/orders?mode=pool">工单池 <ArrowRightOutlined /></router-link><router-link to="/orders?mode=todo">我的待办 <ArrowRightOutlined /></router-link><router-link to="/orders?mode=related">与我相关 <ArrowRightOutlined /></router-link></div>
  </div>
  <MobilePopup v-model:show="projectOpen" title="选择业务项目" class="mobile-drawer"><SelectField v-model="vm.state.projectId" aria-label="当前业务项目" clearable show-search option-filter-prop="label" placeholder="全部授权项目" :options="vm.projects.map(p=>({value:p.id,label:name(p)}))" style="width:100%" /><van-button type="primary" block class="drawer-confirm" @click="projectOpen=false" native-type="button">确定</van-button></MobilePopup>
  <MobilePopup v-model:show="dateOpen" title="统计日期" class="mobile-drawer"><BusinessForm layout="vertical"><BusinessField label="开始日期"><DateField :model-value="dayjs(draftStart)" :clearable="false" format="YYYY-MM-DD" @update:model-value="draftStart=$event!.format('YYYY-MM-DD')" /></BusinessField><BusinessField label="结束日期"><DateField :model-value="dayjs(draftEnd)" :clearable="false" format="YYYY-MM-DD" @update:model-value="draftEnd=$event!.format('YYYY-MM-DD')" /></BusinessField></BusinessForm><van-button type="primary" block :disabled="!dateValid" @click="applyDate" native-type="button">确定</van-button></MobilePopup>
 </section>
</template>
