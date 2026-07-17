<template>
  <router-view />
</template>

<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'App'
})

const store = useStore()
const router = useRouter()
</script>
