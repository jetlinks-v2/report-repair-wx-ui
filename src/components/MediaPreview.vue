<script setup lang="ts">
import MobilePopup from './mobile/MobilePopup.vue'
defineProps<{preview?:{url:string;type:string;name:string}}>()
defineEmits<{close:[]}>()
</script>
<template><MobilePopup :show="!!preview" title="附件预览" @close="$emit('close')"><template v-if="preview"><img v-if="preview.type.startsWith('image/')" :src="preview.url" :alt="preview.name" class="preview-image"><video v-else-if="preview.type.startsWith('video/')" :src="preview.url" controls class="preview-image" playsinline /><audio v-else-if="preview.type.startsWith('audio/')" :src="preview.url" controls /><a v-else :href="preview.url" :download="preview.name">下载 {{preview.name}}</a></template></MobilePopup></template>
