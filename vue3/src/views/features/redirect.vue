<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// vue-router 4 中 :path* 可重复参数是数组，需重新拼接（vue-router 3 是字符串）
const path = Array.isArray(route.params.path) ? route.params.path.join('/') : (route.params.path ?? '')
router.replace({ path: '/' + path, query: route.query })
</script>
