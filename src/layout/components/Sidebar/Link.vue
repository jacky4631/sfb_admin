<template>
  <component :is="linkComponent" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { isExternal } from '@/utils/validate.js'

defineOptions({
  name: 'AppLink'
})

const props = defineProps({
  to: {
    type: String,
    required: true
  }
})

const isExternalLink = computed(() => isExternal(props.to))

const linkComponent = computed(() => isExternalLink.value ? 'a' : 'router-link')

const linkProps = (url) => {
  if (isExternal(url)) {
    return {
      href: url,
      target: '_blank',
      rel: 'noopener'
    }
  }
  return {
    to: url
  }
}
</script>
