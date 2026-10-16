<template>
  <elFrame :src="sqlApi" />
</template>
<script setup>
import { computed } from 'vue'
import elFrame from '@/components/Iframe/index'

const baseUrl = import.meta.env.VITE_BASE_API || ''
const sqlApi = computed(() => baseUrl + '/druid/index.html')
</script>
