<script setup lang="ts">
import {ToolOutlined} from '../components/mobile/icons'
import MobileLoading from '../components/mobile/MobileLoading.vue'
import MobileNotice from '../components/mobile/MobileNotice.vue'
import SelectField from '../components/mobile/SelectField.vue'
import BusinessField from '../components/mobile/BusinessField.vue'
import BusinessForm from '../components/mobile/BusinessForm.vue'
import DateField from '../components/mobile/DateField.vue'
import {Button as VanButton} from 'vant'
import {Field as VanField} from 'vant'
import {Radio as VanRadio} from 'vant'
import {RadioGroup as VanRadioGroup} from 'vant'
import {Stepper as VanStepper} from 'vant'
import {reactive} from 'vue'
import dayjs from 'dayjs'
import {useAction} from '../hooks/useAction'
import {can} from '../services/session'
import {actionNames,reviewNames,time,money} from '../services/labels'
import MediaInput from '../components/MediaInput.vue'
import MediaPreview from '../components/MediaPreview.vue'
import SignaturePad from '../components/SignaturePad.vue'
import OrderSteps from '../components/OrderSteps.vue'
const reviewLabel=(kind:string)=>reviewNames[kind]||kind
const model=useAction(),vm=reactive(model)
function setForm(instance:unknown){model.formRef.value=instance as typeof model.formRef.value}
</script>
<template><section class="page form-page"><MobileNotice v-if="vm.error" :message="vm.error" type="error" show-icon /><MobileLoading :loading="vm.loading"><template v-if="vm.order"><OrderSteps :status="vm.order.status" /><div class="order-context"><strong>{{vm.order.number}}</strong><p>{{vm.order.description||vm.order.title}}</p></div>
 <BusinessForm :ref="setForm" :model="vm.input" :rules="vm.rules" layout="horizontal" @submit="vm.save"><div class="panel form-card"><h2 class="icon-heading"><ToolOutlined />{{actionNames[vm.action]}}信息</h2>
 <BusinessField v-if="['finish','quote','close'].includes(vm.action)" label="关单类型"><SelectField :model-value="vm.action==='close'?'close':'finish'" :disabled="vm.order.paid||vm.readOnly" :options="[{value:'finish',label:'正常关单'},...can('close')?[{value:'close',label:'非正常关单'}]:[]]" @change="vm.changeType" /></BusinessField>
 <template v-if="vm.action==='quote'||vm.action==='finish'&&vm.order.paid"><BusinessField label="材料费" :name="vm.action==='quote'?'materialAmount':undefined"><van-stepper v-model="vm.input.materialAmount" :min="0" :precision="2" :disabled="vm.action==='finish'" /></BusinessField><BusinessField label="人工费" :name="vm.action==='quote'?'artificialAmount':undefined"><van-stepper v-model="vm.input.artificialAmount" :min="0" :precision="2" :disabled="vm.action==='finish'" /></BusinessField><p>合计费用：¥ {{money(Number(vm.input.materialAmount||0)+Number(vm.input.artificialAmount||0))}}</p></template>
 <BusinessField v-if="['dispatch','transfer'].includes(vm.action)" label="责任人" name="assignedUserId"><SelectField v-model="vm.input.assignedUserId" :options="vm.peopleOptions" show-search option-filter-prop="label" placeholder="选择获授权的维修员工" /></BusinessField>
 <template v-if="vm.action==='follow'&&vm.order.status===7||vm.action==='changeLevel'"><BusinessField label="报事等级" name="levelId"><SelectField v-model="vm.input.levelId" :options="vm.levels" placeholder="请选择报事等级" /></BusinessField></template>
 <template v-if="vm.action==='changeCategory'"><BusinessField label="报事分类" name="categoryId"><SelectField v-model="vm.input.categoryId" :options="vm.categories" placeholder="请选择第三级分类" /></BusinessField><BusinessField label="报事标签" name="labelIds"><SelectField v-model="vm.input.labelIds" multiple :options="vm.labels" /></BusinessField></template>
 <template v-if="vm.action==='delay'"><p>原完成时限：{{time(vm.order.finishDeadline)}}</p><BusinessField label="延期时间至" name="delayUntil"><DateField :model-value="vm.input.delayUntil?dayjs(vm.input.delayUntil):undefined" show-time @update:model-value="vm.input.delayUntil=$event?.valueOf()" /></BusinessField></template>
 <template v-if="vm.action==='review'"><BusinessField label="审核申请" name="reviewId"><SelectField v-model="vm.input.reviewId" :options="vm.eligibleReviews.map(r=>({value:r.id,label:reviewLabel(r.kind)+' · '+r.applicantName}))" /></BusinessField><div v-for="r in vm.eligibleReviews.filter(r=>r.id===vm.input.reviewId)" :key="r.id" class="review-context"><p>申请原因：{{r.reason||'—'}}</p><p v-if="r.delayUntil">延期至：{{time(r.delayUntil)}}</p><p v-if="r.targetLevel">目标等级：{{r.targetLevel.name}}</p></div><BusinessField label="审核结果"><van-radio-group v-model="vm.input.approved"><van-radio :name="true">通过</van-radio><van-radio :name="false">不通过</van-radio></van-radio-group></BusinessField></template>
 <BusinessField v-if="['delay','abandonApply','changeLevel'].includes(vm.action)||vm.action==='review'&&vm.input.approved===false" :label="vm.reasonLabel" name="reason"><van-field v-model="vm.input.reason" :rows="3" :maxlength="vm.reasonLimit" show-count  type="textarea" autosize /></BusinessField>
 <template v-if="vm.action==='callback'"><BusinessField label="回访方式" name="callbackMethod"><van-radio-group v-model="vm.input.callbackMethod"><van-radio v-for="s in ['电话','登门','现场','短信']" :key="s" :name="s">{{s}}</van-radio></van-radio-group></BusinessField><BusinessField label="回访结果" name="callbackResult"><van-radio-group v-model="vm.input.callbackResult"><van-radio name="有效">有效</van-radio><van-radio name="无效">无效</van-radio></van-radio-group></BusinessField><BusinessField label="回访人" name="callbackPerson"><van-field v-model="vm.input.callbackPerson" :maxlength="128" /></BusinessField><BusinessField label="回访时间" name="callbackTime"><DateField :model-value="vm.input.callbackTime?dayjs(vm.input.callbackTime):undefined" show-time @update:model-value="vm.input.callbackTime=$event?.valueOf()" /></BusinessField><BusinessField label="是否返工"><van-radio-group v-model="vm.input.rework"><van-radio :name="false">通过</van-radio><van-radio :name="true">返工</van-radio></van-radio-group></BusinessField></template>
 <template v-if="['callback','evaluate','ownerEvaluate'].includes(vm.action)"><BusinessField label="满意度" name="satisfactionId"><SelectField v-model="vm.input.satisfactionId" :options="vm.satisfaction" /></BusinessField><BusinessField label="评价标签"><SelectField v-model="vm.input.evaluationLabelIds" multiple :options="vm.evaluationLabels" /></BusinessField></template>
 <template v-if="['sign','ownerEvaluate'].includes(vm.action)"><BusinessField label="业主姓名" name="ownerName"><van-field v-model="vm.input.ownerName" :maxlength="128" /></BusinessField><BusinessField label="业主联系方式" name="ownerPhone"><van-field v-model="vm.input.ownerPhone" type="tel" :maxlength="64" /></BusinessField></template>
 <BusinessField v-if="vm.action==='sign'" label="业主签字" name="signatureFileId"><SignaturePad @capture="vm.uploadSignature" /><MediaInput :ids="vm.input.signatureFileId?[vm.input.signatureFileId]:[]" :names="vm.names" :loading="vm.uploading" single @files="$event[0]&&vm.uploadSignature($event[0])" @remove="vm.input.signatureFileId=undefined" @preview="vm.openPreview" /></BusinessField>
 <BusinessField v-if="vm.showContent" :label="vm.content.label" name="description"><van-field v-model="vm.input.description" :rows="4" :maxlength="vm.content.max" :disabled="vm.readOnly" show-count  type="textarea" autosize /></BusinessField>
 <BusinessField v-if="['follow','finish','quote','close'].includes(vm.action)" label="回复语" :name="vm.readOnly?undefined:'replyId'"><van-field v-if="vm.readOnly" :model-value="vm.input.reply" disabled /><SelectField v-else v-model="vm.input.replyId" :options="vm.replies" /></BusinessField>
 <BusinessField v-if="!['accept','grab','toPaid','sign','changeCategory','changeLevel','delay','abandonApply'].includes(vm.action)" :label="vm.action==='follow'&&vm.order.status===7?'到场照片':'附件'" name="attachmentIds"><MediaInput :ids="vm.input.attachmentIds" :names="vm.names" :loading="vm.uploading" :disabled="vm.readOnly" @files="vm.uploadFiles" @remove="vm.input.attachmentIds=vm.input.attachmentIds.filter(id=>id!==$event)" @preview="vm.openPreview" /></BusinessField>
 </div><div class="form-submit"><van-button type="primary" block native-type="submit" size="large" :loading="vm.saving" :disabled="vm.uploading||vm.loading||!vm.allowed">确认{{actionNames[vm.action]}}</van-button></div></BusinessForm></template></MobileLoading><MediaPreview :preview="vm.preview" @close="vm.closePreview" /></section></template>
