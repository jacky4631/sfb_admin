<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" v-model="dialog" :title="'APP分享图配置'" width="900px">

      <el-card :bordered="false">
        <el-form label-width="130px" >
          <el-row :gutter="24">
            <el-col :span="24">
                <MaterialList v-model="slider_image"  type="image" :num="15" :width="150" :height="150" />
            </el-col>
          </el-row>

        </el-form>
      </el-card>
    <template #footer><div class="dialog-footer">
      <el-button link @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="handleSubmit">确认</el-button>
    </div>
  </template>
</el-dialog>
</template>

<script>
import { ElNotification, ElMessage } from 'element-plus'
import { setAppShareConfig, getAppShareConfig } from '@/api/mwUser.js'

import MaterialList from '@/components/material/index.vue'
export default {
  components: { MaterialList },
  data() {
    return {
      dialog: false,
      slider_image: [],
      loading: false,
    }
  },
  watch: {
    // 组件常驻不销毁，每次打开重新拉取配置，避免关闭后数据丢失
    dialog(val) {
      if (val) {
        this.getInfo()
      }
    }
  },
  methods: {
    // 详情
    async getInfo () {
      let that = this;
      let images = await getAppShareConfig()
        console.log('data:'+images)
        if(images){
          that.slider_image = images;
        }
    },


    // 提交
    handleSubmit (name) {
      if(this.slider_image.length ===0){
        ElMessage.warning("请添加图片信息！");
        return;
      }

      setAppShareConfig(this.slider_image).then(async res => {
        this.resetForm()
        ElNotification({
          title: '操作成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(res => {

      })
    },

    cancel() {
      this.resetForm()
    },

    resetForm() {
      this.dialog = false
      // 模板里没有 ref="form"，用可选链防止报错；不清空 slider_image，下次打开由 getInfo 重新拉取
      this.$refs['form']?.resetFields()
    }
  }
}
</script>
