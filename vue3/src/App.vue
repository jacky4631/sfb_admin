<template>
  <router-view />
</template>

<script setup>
import { useRouter } from 'vue-router'

defineOptions({
  name: 'App'
})

const router = useRouter()
</script>
