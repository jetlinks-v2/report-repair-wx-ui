<script setup lang="ts">
import {computed} from 'vue'
const props=defineProps<{status?:number}>()
const current=computed(()=>props.status===undefined?0:props.status===0?1:[2,4,5].includes(props.status)?3:2)
</script>
<template><van-steps :active="current" class="order-steps"><van-step v-for="name in ['发起报事','分派','处理','完成']" :key="name">{{name}}</van-step></van-steps></template>
