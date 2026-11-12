<script setup lang="ts">
import MobileLoading from '../components/mobile/MobileLoading.vue'
import MobileNotice from '../components/mobile/MobileNotice.vue'
import SelectField from '../components/mobile/SelectField.vue'
import MobilePopup from '../components/mobile/MobilePopup.vue'
import BusinessField from '../components/mobile/BusinessField.vue'
import BusinessForm from '../components/mobile/BusinessForm.vue'
import {Button as VanButton} from 'vant'
import {Empty as VanEmpty} from 'vant'
import {Search as VanSearch} from 'vant'
import {reactive,ref} from 'vue'
import {FilterOutlined,ReloadOutlined} from '../components/mobile/icons'
import {useOrderList} from '../hooks/useOrderList'
import {reviewNames,name} from '../services/labels'
import OrderCard from '../components/OrderCard.vue'
const vm=reactive(useOrderList()),filterOpen=ref(false)
function selectStatus(status:number){vm.status=status;vm.search()}
</script>
<template>
 <section class="page list-page">
  <div class="list-toolbar">
   <div v-if="!['review','warning','unfinished'].includes(vm.mode)" class="status-tabs" role="tablist" :aria-label="vm.mode==='todo'?'待办类型':'工单状态'"><van-button v-for="tab in vm.tabs" :key="tab.value" plain role="tab" :aria-selected="vm.status===tab.value" :class="{selected:vm.status===tab.value}" @click="selectStatus(tab.value)" native-type="button">{{tab.value===-1&&vm.mode!=='todo'?'全部':tab.label}}</van-button></div>
   <div v-else-if="vm.mode==='review'" class="status-tabs" role="tablist" aria-label="审核状态"><van-button v-for="tab in [{value:1,label:'待审核'},{value:2,label:'审核通过'},{value:3,label:'审核不通过'}]" :key="tab.value" plain role="tab" :aria-selected="vm.reviewStatus===tab.value" :class="{selected:vm.reviewStatus===tab.value}" @click="vm.reviewStatus=tab.value;vm.search()" native-type="button">{{tab.label}}</van-button></div>
   <div v-else-if="vm.mode==='warning'" class="status-tabs" role="tablist" aria-label="预警类型"><van-button v-for="tab in [{value:'soon',label:'即将超时'},{value:'overdue',label:'已超时'}]" :key="tab.value" plain role="tab" :aria-selected="vm.warning===tab.value" :class="{selected:vm.warning===tab.value}" @click="vm.warning=tab.value;vm.search()" native-type="button">{{tab.label}}</van-button></div>
   <div class="search-filter-shell"><van-search v-model="vm.keyword" placeholder="编号 / 描述 / 报事人" clearable @search="vm.search" /><van-button plain class="filter-entry" aria-label="筛选工单" @click="filterOpen=true" native-type="button"><FilterOutlined />筛选<span v-if="vm.state.projectId||vm.reviewKind" class="filter-dot"></span></van-button></div>
  </div>
  <div class="list-content">
   <MobileNotice v-if="vm.error" :message="vm.error" type="error" show-icon />
   <p v-if="vm.purpose" class="list-purpose">{{vm.purpose}}</p><div class="list-caption"><span class="list-total">共 {{vm.total}} 条记录</span><van-button plain size="small" aria-label="刷新工单" @click="vm.load(false)" native-type="button"><ReloadOutlined /></van-button></div>
   <MobileLoading :loading="vm.loading"><div class="order-list"><OrderCard v-for="order in vm.rows" :key="order.reviewId||order.id" :order="order" :actions="vm.cardActions(order)" @open="vm.open" @action="vm.perform" /></div><van-empty v-if="!vm.loading&&!vm.rows.length" description="暂无符合条件的工单" /></MobileLoading>
   <van-button v-if="vm.rows.length<vm.total" block :loading="vm.loading" @click="vm.load(true)" native-type="button">加载更多</van-button><p v-else-if="vm.rows.length" class="list-end">没有更多了</p>
  </div>
  <MobilePopup v-model:show="filterOpen" title="筛选工单" class="mobile-drawer"><BusinessForm layout="vertical" class="list-filters"><BusinessField label="业务项目"><SelectField v-model="vm.state.projectId" clearable show-search option-filter-prop="label" placeholder="全部授权项目" :options="vm.projects.map(p=>({value:p.id,label:name(p)}))" /></BusinessField><BusinessField v-if="!['review','warning','unfinished'].includes(vm.mode)" :label="vm.mode==='todo'?'待办类型':'工单状态'"><SelectField v-model="vm.status" :options="vm.tabs" @change="vm.search" /></BusinessField><BusinessField v-if="vm.mode==='review'" label="审核类型"><SelectField v-model="vm.reviewKind" clearable placeholder="全部审核类型" :options="Object.entries(reviewNames).map(([value,label])=>({value,label}))" @change="vm.search" /></BusinessField></BusinessForm><van-button type="primary" block @click="filterOpen=false;vm.search()" native-type="button">确定</van-button></MobilePopup>
 </section>
</template>
