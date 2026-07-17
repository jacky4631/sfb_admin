<template>
  <elFrame :src="sqlApi" />
</template>
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import elFrame from '@/components/Iframe/index'

const store = useStore()
const sqlApi = computed(() => store.getters.sqlApi)
</script>
