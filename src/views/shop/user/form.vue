<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="650px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
      <el-form-item label="用户昵称">
        <el-input v-model="form.nickname" :disabled="true" style="width: 150px;" />
        &nbsp;真实姓名<el-input v-model="form.realName" style="width: 150px;" />
      </el-form-item>
      <el-form-item label="上级uid">
        <el-input v-model="form.spreadUid" style="width: 150px;" />
          &nbsp;手机号码
          <el-input v-model="form.phone" style="width: 150px;" />
      </el-form-item>
      <el-form-item label="邀请码">
        <el-input v-model="form.code" style="width: 150px;" />
        &nbsp;追单号
        <el-input v-model="form.additionalNo" style="width: 150px;" />
      </el-form-item>
      <el-form-item label="淘宝pid">
        <el-input v-model="form.tbPid" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="用户备注">
        <el-input v-model="form.mark" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="淘店等级" prop="form.level">
        <el-select v-model="form.level" style="width: 178px" placeholder="请选择会员级别">
          <el-option v-for="item in levelOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <el-date-picker
          v-model="form.expired"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
        />
      </el-form-item>
      <el-form-item label="京店等级" prop="form.levelJd">
        <el-select v-model="form.levelJd" style="width: 178px" placeholder="请选择会员级别">
          <el-option v-for="item in levelOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <el-date-picker
          v-model="form.expiredJd"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
        />
      </el-form-item>
      <el-form-item label="多店等级" prop="form.levelPdd">
        <el-select v-model="form.levelPdd" style="width: 178px" placeholder="请选择会员级别">
          <el-option v-for="item in levelOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <el-date-picker
          v-model="form.expiredPdd"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
        />
      </el-form-item>

      <el-form-item label="抖店等级" prop="form.levelDy">
        <el-select v-model="form.levelDy" style="width: 178px" placeholder="请选择会员级别">
          <el-option v-for="item in levelOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <el-date-picker
          v-model="form.expiredDy"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
        />
      </el-form-item>
      <el-form-item label="唯店等级" prop="form.levelVip">
        <el-select v-model="form.levelVip" style="width: 178px" placeholder="请选择会员级别">
          <el-option v-for="item in levelOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <el-date-picker
          v-model="form.expiredVip"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/mwUser'
import md5 from 'js-md5';
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      levelOptions: [
        { key: 3, display_name: '普通' },
        { key: 5, display_name: '店主' }
      ],
      loading: false, dialog: false,
      form: {
        uid: '',
        realName: '',
        mark: '',
        nickname: '',
        additionalNo: '',
        phone: '',
        level: 3,
        levelJd: 3,
        levelPdd: 3,
        levelDy: 3,
        levelVip: 3,
        spreadUid: '',
        expired: '',
        tbPid: '',
        jdPid: '',
        pddPid: '',
        code: ''
      },
      rules: {
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.loading = true
      if (this.isAdd) {
        this.doAdd()
      } else this.doEdit()
    },
    doAdd() {
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      edit(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        uid: '',
        realName: '',
        mark: '',
        additionalNo: '',
        nickname: '',
        phone: '',
        level: 3,
        levelJd: 3,
        levelPdd: 3,
        levelDy: 3,
        levelVip: 3,
        spreadUid: 0,
        expired: '',
        tbPid: '',
        jdPid: '',
        pddPid: '',
        code: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
