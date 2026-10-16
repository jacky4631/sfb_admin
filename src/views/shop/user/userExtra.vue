<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" v-model="dialog" title="更多信息" width="1000px">
          <el-table
            :data="tableData"
            border
            style="width: 100%">

            <el-table-column
              prop="uid"
              label="uid"
              width="80">
            </el-table-column>
            <el-table-column
              prop="name"
              label="平台"
              width="80">
              <template #default="scope">
                <div>
                  <el-tag v-if="scope.row.name == 'sfb'" style="background-color: #85c577; color: white">苏分宝</el-tag>
                  <el-tag v-else  style="background-color: #B68567; color: white">{{scope.row.name}}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="openId"
              label="微信openId(unionId)"
              width="280">
            </el-table-column>
            <el-table-column
              prop="tbPid"
              label="淘宝pid"
              width="120">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" :show-overflow-tooltip="true" width="180">
              <template #default="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="修改时间" :show-overflow-tooltip="true" width="180">
              <template #default="scope">
                <span>{{ parseTime(scope.row.updateTime) }}</span>
              </template>
            </el-table-column>
          </el-table>
  </el-dialog>
</template>

<script>
import checkPermission from '@/utils/permission.js'
import initData from '@/mixins/crud.js'
import { formatTime } from '@/utils/index.js'
import {getUserExtra} from "@/api/mwUser.js";
export default {
  name:'UserExtra',
  components: {},
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      extra:{},
      tableData: [],
      form: {
        uid: '',
        nickname: ''
      },
      rules: {
        unique: [
          { required: true, message: 'please enter', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    formatTime,
    checkPermission,
    beforeInit() {
      return true
    },
    getUserExtra(uid) {
      getUserExtra(uid).then(res=>{

        console.log(res)
        this.tableData = res.union ||[]
        this.extra = res.extra||{};

      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })

    }
  }
}
</script>

<style scoped>

</style>
