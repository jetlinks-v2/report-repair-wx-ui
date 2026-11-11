<script setup lang="ts">
import {reactive} from 'vue'
import {useIntake} from '../hooks/useIntake'
import MediaInput from '../components/MediaInput.vue'
import MediaPreview from '../components/MediaPreview.vue'
import OrderSteps from '../components/OrderSteps.vue'
const model=useIntake(),formRef=model.formRef,vm=reactive(model)
</script>
<template><section class="page form-page"><OrderSteps /><MobileNotice v-if="vm.error" :message="vm.error" type="error" show-icon /><BusinessForm ref="formRef" :model="vm.input" :rules="vm.rules" layout="horizontal" @submit="vm.submit"><div class="source-tabs"><van-radio-group v-model="vm.input.reportSource"><van-radio :name="1">物业自查</van-radio><van-radio :name="2">业主报事</van-radio></van-radio-group></div><div class="panel form-card"><h2>报事信息</h2>

 <BusinessField label="业务项目" name="businessProjectId"><SelectField v-model="vm.input.businessProjectId" :options="vm.projectOptions" placeholder="请选择业务项目" show-search option-filter-prop="label" /></BusinessField>
 <MobileLoading :loading="vm.loading"><BusinessField label="报事分类" name="categoryId"><SelectField v-model="vm.path" :options="vm.tree" placeholder="请选择第三级分类"  tree /></BusinessField>
 <BusinessField label="报事渠道" name="channelId"><SelectField v-model="vm.input.channelId" :options="vm.channels" placeholder="请选择渠道" /></BusinessField>
 <BusinessField v-if="vm.flags.showReportLabel" label="报事标签" name="labelIds"><SelectField v-model="vm.input.labelIds" multiple :options="vm.labels" placeholder="请选择标签" /></BusinessField>
 <BusinessField v-if="vm.flags.showReportDescriptionChoice" label="描述选择"><SelectField v-model="vm.input.descriptionChoiceIds" multiple :options="vm.descriptions" placeholder="选择常用描述" /></BusinessField>
 <BusinessField v-if="vm.flags.showReportPosition" label="报事位置"><van-radio-group v-model="vm.input.positionType"><van-radio :name="1">公区</van-radio><van-radio :name="2">室内</van-radio></van-radio-group></BusinessField>
 <BusinessField v-if="vm.flags.showReportPosition" label="区域 / 楼栋 / 房间"><SelectField v-model="vm.spacePath" clearable change-on-select :options="vm.spaceOptions" placeholder="请逐层选择区域、楼栋或房间"  tree /></BusinessField>
 <BusinessField v-if="vm.flags.showReportDetailLocation" label="详细位置"><van-field v-model="vm.input.location" :maxlength="500" placeholder="补充具体位置" /></BusinessField>
 <BusinessField v-if="vm.deviceEnabled" label="关联设备"><SelectField v-model="vm.input.deviceId" :options="vm.devices.map(d=>({value:d.id,label:d.name}))" clearable show-search :filter-option="false" :loading="vm.deviceLoading" placeholder="搜索项目设备" @search="vm.searchDevices" /></BusinessField>
 <BusinessField v-if="vm.flags.showReportUrgency" label="紧急程度"><SelectField v-model="vm.input.urgency" clearable :options="[{value:1,label:'一般'},{value:2,label:'紧急'},{value:3,label:'非常紧急'}]" /></BusinessField>
 <h2 class="form-section-title">问题描述</h2><BusinessField v-if="vm.flags.showProblemDescription" label="问题描述"><van-field v-model="vm.manual" :rows="4" :maxlength="800" show-count placeholder="请描述现场问题"  type="textarea" autosize /></BusinessField>
 <div v-if="vm.input.descriptionChoiceIds.length" class="description-preview">{{vm.description}}</div>
 <h2 class="form-section-title">联系信息</h2><BusinessField label="报事人" name="contactName"><van-field v-model="vm.input.contactName" :maxlength="64" placeholder="填写报事人姓名" /></BusinessField>
 <BusinessField label="联系电话" name="contactPhone"><van-field v-model="vm.input.contactPhone" type="tel" :maxlength="32" /></BusinessField>
 <BusinessField v-if="vm.flags.showMediaUpload" label="图片 / 视频 / 附件" class="stacked-field"><MediaInput :ids="vm.input.attachmentIds" :names="vm.names" :loading="vm.uploading" @files="vm.uploadFiles" @remove="vm.input.attachmentIds=vm.input.attachmentIds.filter(id=>id!==$event)" @preview="vm.openPreview" /></BusinessField>
 </MobileLoading></div><div class="form-submit"><van-button type="primary" native-type="submit" block size="large" :loading="vm.saving" :disabled="vm.loading||vm.uploading">提交报事</van-button></div></BusinessForm><MediaPreview :preview="vm.preview" @close="vm.closePreview" /></section></template>
