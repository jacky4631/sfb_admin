<template>
  <elFrame :src="swaggerApi" />
</template>
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import elFrame from '@/components/Iframe/index'

const store = useStore()
const swaggerApi = computed(() => store.getters.swaggerApi)
</script>
