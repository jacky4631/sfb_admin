<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" title="查看分销下级" width="1400px">
    <el-card>
      <div slot="header">
        <span>{{ form.nickname }}的下级</span>
      </div>
      <el-tabs type="border-card" @tab-click="handleClick" v-model="activeName">
        <el-tab-pane label="一级" name="first">
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
              prop="avatar"
              label="头像"
              width="80">
              <template slot-scope="scope">
                <a :href="scope.row.avatar" style="color: rgb(64, 158, 255)" target="_blank"><img :src="scope.row.avatar" alt="点击打开" class="el-avatar"></a>
              </template>
            </el-table-column>
            <el-table-column
              prop="phone"
              label="手机号"
              width="110">
            </el-table-column>
            <el-table-column
              prop="nickname"
              label="昵称"
              width="130">
            </el-table-column>
            <el-table-column
              prop="level"
              label="淘店"
              width="80">
              <template slot-scope="scope">
                <div>
                  <el-tag v-if="scope.row.level == 5" style="background-color: #8A77C5; color: white">店主</el-tag>
                  <el-tag v-else  style="background-color: #B68567; color: white">普通</el-tag>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              prop="levelJd"
              label="京店"
              width="80">
              <template slot-scope="scope">
                <div>
                  <el-tag v-if="scope.row.levelJd == 5" style="background-color: #8A77C5; color: white">店主</el-tag>
                  <el-tag v-else  style="background-color: #B68567; color: white">普通</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="levelPdd"
              label="多店"
              width="80">
              <template slot-scope="scope">
                <div>
                  <el-tag v-if="scope.row.levelPdd == 5" style="background-color: #8A77C5; color: white">店主</el-tag>
                  <el-tag v-else  style="background-color: #B68567; color: white">普通</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="levelDy"
              label="抖店"
              width="80">
              <template slot-scope="scope">
                <div>
                  <el-tag v-if="scope.row.levelDy == 5" style="background-color: #8A77C5; color: white">店主</el-tag>
                  <el-tag v-else  style="background-color: #B68567; color: white">普通</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="levelVip"
              label="唯店"
              width="80">
              <template slot-scope="scope">
                <div>
                  <el-tag v-if="scope.row.levelVip == 5" style="background-color: #8A77C5; color: white">店主</el-tag>
                  <el-tag v-else  style="background-color: #B68567; color: white">普通</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="time"
              label="加入时间"
              width="180">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="二级" name="second">
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
              prop="avatar"
              label="头像"
              width="80">
              <template slot-scope="scope">
                <a :href="scope.row.avatar" style="color: rgb(64, 158, 255)" target="_blank"><img :src="scope.row.avatar" alt="点击打开" class="el-avatar"></a>
              </template>
            </el-table-column>
            <el-table-column
              prop="phone"
              label="手机号"
              width="110">
            </el-table-column>
            <el-table-column
              prop="nickname"
              label="昵称"
              width="130">
            </el-table-column>
            <el-table-column
              prop="level"
              label="淘店"
              width="80">
              <template slot-scope="scope">
                <div>
                  <el-tag v-if="scope.row.level == 5" style="background-color: #8A77C5; color: white">店主</el-tag>
                  <el-tag v-else  style="background-color: #B68567; color: white">普通</el-tag>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              prop="levelJd"
              label="京店"
              width="80">
              <template slot-scope="scope">
                <div>
                  <el-tag v-if="scope.row.levelJd == 5" style="background-color: #8A77C5; color: white">店主</el-tag>
                  <el-tag v-else  style="background-color: #B68567; color: white">普通</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="levelPdd"
              label="多店"
              width="80">
              <template slot-scope="scope">
                <div>
                  <el-tag v-if="scope.row.levelPdd == 5" style="background-color: #8A77C5; color: white">店主</el-tag>
                  <el-tag v-else  style="background-color: #B68567; color: white">普通</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="levelDy"
              label="抖店"
              width="80">
              <template slot-scope="scope">
                <div>
                  <el-tag v-if="scope.row.levelDy == 5" style="background-color: #8A77C5; color: white">店主</el-tag>
                  <el-tag v-else  style="background-color: #B68567; color: white">普通</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="levelVip"
              label="唯店"
              width="80">
              <template slot-scope="scope">
                <div>
                  <el-tag v-if="scope.row.levelVip == 5" style="background-color: #8A77C5; color: white">店主</el-tag>
                  <el-tag v-else  style="background-color: #B68567; color: white">普通</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="time"
              label="加入时间"
              width="180">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </el-dialog>
</template>

<script>
import { add, edit, getSpread } from '@/api/mwUser'
import { parseTime } from '@/utils/index'
export default {
  props: {
    // isAdd: {
    //   type: Boolean,
    //   required: true
    // }
  },
  data() {
    return {
      loading: false, dialog: false, expressInfo: [],
      activeName: "first",
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
  mounted() {
   // this.express()
  },
  methods: {
    handleClick(tab, event) {
      this.spread(this.form.uid)
    },
    parseTime,
    cancel() {
      this.dialog = false
    },
    spread(uid) {
      var grade = 0;
      if(this.activeName == 'second') grade = 1
      let params ={
        uid,
        grade
      }

      getSpread(params).then(res=>{

        console.log(res)
        this.tableData = res

      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })

    }
  }
}
</script>

<style scoped>
  .text {
    font-size: 12px;
  }

  .item {
    padding: 6px 0;
  }

</style>
