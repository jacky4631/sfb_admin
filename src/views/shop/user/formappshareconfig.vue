<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="'APP分享图配置'" width="900px">

      <el-card :bordered="false">
        <el-form label-width="130px" >
          <el-row :gutter="24">
            <el-col :span="24">
                <MaterialList v-model="slider_image"  type="image" :num="15" :width="150" :height="150" />
            </el-col>
          </el-row>

        </el-form>
      </el-card>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="handleSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { setAppShareConfig, getAppShareConfig } from '@/api/mwUser'

import MaterialList from '@/components/material'
export default {
  components: { MaterialList },
  data() {
    return {
      dialog: false,
      slider_image: [],
      loading: false,
    }
  },
  mounted () {
    this.getInfo();
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
        this.$message.warning("请添加图片信息！");
        return;
      }

      setAppShareConfig(this.slider_image).then(async res => {
        this.resetForm()
        this.$notify({
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
      this.$refs['form'].resetFields()
      this.slider_image = []
    }
  }
}
</script>
