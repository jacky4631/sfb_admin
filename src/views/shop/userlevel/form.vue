<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="600px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
      <el-form-item label="充值id">
        <el-input v-model="form.rechargeId" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="等级名称">
        <el-input v-model="form.name" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="form.type" style="width: 145px" placeholder="请选择类型" @change="changeScope">
          <el-option
            v-for="item in types"
            :key="item.key"
            :label="item.name"
            :value="item.key"
          />
        </el-select>
    </el-form-item>
      <el-form-item label="是否永久">
        <el-radio v-model="form.isForever" :label="1">是</el-radio>
        <el-radio v-model="form.isForever" :label="0" style="width: 200px;">否</el-radio>
      </el-form-item>
      <el-form-item label="有效时间(天)">
        <el-input-number v-model="form.validDate" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="会员等级">
        <el-input-number v-model="form.grade" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="自身分佣比例">
        <el-input-number v-model="form.discount" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="一级分佣比例">
        <el-input-number v-model="form.discountOne" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="二级分佣比例">
        <el-input-number v-model="form.discountTwo" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="是否显示">
        <el-radio v-model="form.isShow" :label="1">是</el-radio>
        <el-radio v-model="form.isShow" :label="0" style="width: 200px;">否</el-radio>
      </el-form-item>
      <el-form-item label="说明">
        <el-input v-model="form.explain" rows="3" type="textarea" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/mwSystemUserLevel'
import picUpload from '@/components/pic-upload'
import MaterialList from '@/components/material'
export default {
  components: { picUpload, MaterialList },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      types: [{key:'tb', name:'淘宝'}, {key:'jd', name:'京东'}, {key:'pdd', name:'拼多多'},{key:'dy', name:'抖音'},{key:'vip', name:'唯品会'}],
      loading: false, dialog: false,
      form: {
        id: '',
        rechargeId: '',
        merId: '',
        name: '',
        money: '',
        validDate: '',
        isForever: 1,
        isPay: '',
        isShow: 1,
        grade: '',
        discount: '',
        discountOne: '',
        discountTwo: '',
        image: '',
        icon: '',
        imageArr: [],
        iconArr: [],
        explain: '',
        addTime: '',
        isDel: ''
      },
      rules: {
        // grade: [
        //   { type: 'number', message: '只能输入数字', trigger: 'blur' }
        // ]
      }
    }
  },
  watch: {
    'form.imageArr': function(val) {
      if (val) {
        this.form.image = val.join(',')
      }
    },
    'form.iconArr': function(val) {
      if (val) {
        this.form.icon = val.join(',')
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
        id: '',
        rechargeId: '',
        merId: '',
        name: '',
        money: '',
        validDate: '',
        isForever: 1,
        isPay: '',
        isShow: 1,
        grade: '',
        discount: '',
        discountOne: '',
        discountTwo: '',
        image: '',
        icon: '',
        imageArr: [],
        iconArr: [],
        explain: '',
        addTime: '',
        isDel: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
