<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" title="更多信息" width="1000px">
      <el-form ref="form" :model="extra" size="small" label-width="100px">
        <el-form-item label="淘店体验">
            <div>
              <el-tag v-if="extra.level == null || extra.level == 0" style="background-color: #B68567; color: white">否</el-tag>
              <el-tag v-else-if="extra.level == 5" style="background-color: #8A77C5; color: white">是</el-tag>
              <el-tag v-else="extra.level == 99" style="background-color: #e72525; color: white">已过期</el-tag>
              {{ extra.expired != null ? '过期时间:' +extra.expired : '' }}
            </div>
        </el-form-item>
        <el-form-item label="京店体验">
          <div>
            <el-tag v-if="extra.levelJd == null || extra.levelJd == 0" style="background-color: #B68567; color: white">否</el-tag>
            <el-tag v-else-if="extra.levelJd == 5" style="background-color: #8A77C5; color: white">是</el-tag>
            <el-tag v-else="extra.levelJd == 99" style="background-color: #e72525; color: white">已过期</el-tag>
            {{ extra.expiredJd != null ? '过期时间:' +extra.expiredJd : '' }}
          </div>
        </el-form-item>
        <el-form-item label="多店体验">
          <div>
            <el-tag v-if="extra.levelPdd == null || extra.levelPdd == 0" style="background-color: #B68567; color: white">否</el-tag>
            <el-tag v-else-if="extra.levelPdd == 5" style="background-color: #8A77C5; color: white">是</el-tag>
            <el-tag v-else="extra.levelPdd == 99" style="background-color: #e72525; color: white">已过期</el-tag>
            {{ extra.expiredPdd != null ? '过期时间:' +extra.expiredPdd : '' }}
          </div>
        </el-form-item>
        <el-form-item label="抖店体验">
          <div>
            <el-tag v-if="extra.levelDy == null || extra.levelDy == 0" style="background-color: #B68567; color: white">否</el-tag>
            <el-tag v-else-if="extra.levelDy == 5" style="background-color: #8A77C5; color: white">是</el-tag>
            <el-tag v-else="extra.levelDy == 99" style="background-color: #e72525; color: white">已过期</el-tag>
            {{ extra.expiredDy != null ? '过期时间:' +extra.expiredDy : '' }}
          </div>
        </el-form-item>
        <el-form-item label="唯品店体验">
          <div>
            <el-tag v-if="extra.levelVip == null || extra.levelVip == 0" style="background-color: #B68567; color: white">否</el-tag>
            <el-tag v-else-if="extra.levelVip == 5" style="background-color: #8A77C5; color: white">是</el-tag>
            <el-tag v-else="extra.levelVip == 99" style="background-color: #e72525; color: white">已过期</el-tag>
            {{ extra.expiredVip != null ? '过期时间:' +extra.expiredVip : '' }}
          </div>
        </el-form-item>
      </el-form>

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
              <template slot-scope="scope">
                <div>
                  <el-tag v-if="scope.row.name == 'sfb'" style="background-color: #85c577; color: white">苏分宝</el-tag>
                  <el-tag v-else  style="background-color: #B68567; color: white">{{scope.row.name}}}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="openId"
              label="微信openId"
              width="280">
            </el-table-column>
            <el-table-column
              prop="tbPid"
              label="淘宝pid"
              width="120">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" :show-overflow-tooltip="true" width="180">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="修改时间" :show-overflow-tooltip="true" width="180">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.updateTime) }}</span>
              </template>
            </el-table-column>
          </el-table>
  </el-dialog>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/crud'
import { formatTime } from '@/utils/index'
import {getUserExtra} from "@/api/mwUser";
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
