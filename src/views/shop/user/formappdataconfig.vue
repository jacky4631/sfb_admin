<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="'APP基础信息配置'" width="900px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">

      <el-form-item label="好单库cms的cid*" label-width="200px">
        <el-input v-model="form.kuCid" style="width: 470px;" />
        <p style="color: red">申请链接：<a href="https://user.cms.haodanku.com/record">https://user.cms.haodanku.com/record</a></p>
        <p style="color: red">例如：https://renyigo8.kuaizhan.com/?cid=6bpB4iTC#/     kuCid=6bpB4iTC</p>
      </el-form-item>
      <el-form-item label="app分享地址*" label-width="200px">
        <el-input v-model="form.share" style="width: 470px;" />
      </el-form-item>
      <el-form-item label="app分享文字描述*" label-width="200px">
        <el-input autosize v-model="form.shareContent" type="textarea" :rows="4" style="width: 470px;" />
      </el-form-item>
      <el-form-item label="商品分享地址*" label-width="200px">
        <el-input v-model="form.shareGoods" style="width: 470px;" />
      </el-form-item>

      <el-form-item :hide-required-asterisk="true" label="登录跳过邀请码*" label-width="200px">
        <el-radio v-model="form.skipCode" :label="`1`">跳过</el-radio>
        <el-radio v-model="form.skipCode" :label="`0`">强制</el-radio>
      </el-form-item>

      <el-form-item :hide-required-asterisk="true" label="分销级别*" label-width="200px">
        <el-radio v-model="form.spreadLevel" :label="2">2级</el-radio>
        <el-radio v-model="form.spreadLevel" :label="3">3级</el-radio>
      </el-form-item>
      <el-form-item label="支付宝红包id" label-width="200px">
        <el-input v-model="form.alired" style="width: 470px;" />
      </el-form-item>
      <el-form-item label="淘宝看视频领红包url" label-width="200px">
        <el-input v-model="form.taored" style="width: 470px;" />
      </el-form-item>
      <el-form-item label="合同预览地址" label-width="200px">
        <el-input v-model="form.contractPreviewUrl" style="width: 470px;" />
      </el-form-item>

      <el-form-item label="APP首页弹窗配置" label-width="400px">
      </el-form-item>
      <el-form-item label="背景图地址*" label-width="200px">
        <el-input v-model="form.huodong.img" style="width: 470px;" />
      </el-form-item>
      <el-form-item label="活动地址*" label-width="200px">
        <el-input v-model="form.huodong.url" style="width: 470px;" />
      </el-form-item>
      <el-form-item label="活动web地址" label-width="200px">
        <el-input v-model="form.huodong.webUrl" style="width: 470px;" />
      </el-form-item>
      <el-form-item label="活动web标题" label-width="200px">
        <el-input v-model="form.huodong.title" style="width: 470px;" />
      </el-form-item>
      <el-form-item label="活动web标题颜色" label-width="200px">
        <el-input v-model="form.huodong.color" style="width: 470px;" />
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { setAppDataConfig } from '@/api/mwUser'
export default {
  props: {
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
          kuCid: "",
          share: "https://dianlb903.kuaizhan.com/3083083322",
          shareGoods: "https://dianlb903.kuaizhan.com/1386038537",
          shareContent: "推荐这个APP给你，这款连衣裙，我拿了18件，全卖了，无货源开店，日更4000+商品！\n━┉┉┉┉∞┉┉┉┉━\n下载地址：#url#\n━┉┉┉┉∞┉┉┉┉━\n#code#或应用市场搜索【#APPNAME#】下载注册",

          alired: "763052262",
          taored: "https://m.tb.cn/h.5w5TddH",
          huodong: {
            img: "https://img.alicdn.com/imgextra/i4/2053469401/O1CN01UByNgM2JJiCdivYu8_!!2053469401.png",
            color: "9A34FF",
            webUrl: "",
            title: "双11红包",
            url: "https://s.click.taobao.com/kXEoMSu"
          },
          contractPreviewUrl:"",
          yeePaySuccUrl: "https://cash.yeepay.com/newwap/pages/mobile/success",
          yeePayFailUrl: "https://cash.yeepay.com/newwap/pages/mobile/fail",
          skipCode:"1",
          spreadLevel: 3
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
      this.doEdit()
    },
    doEdit() {
      setAppDataConfig(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '操作成功',
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
        kuCid: "",
        share: "https://dianlb903.kuaizhan.com/3083083322",
        shareGoods: "https://dianlb903.kuaizhan.com/1386038537",
        shareContent: "推荐这个APP给你，这款连衣裙，我拿了18件，全卖了，无货源开店，日更4000+商品！\n━┉┉┉┉∞┉┉┉┉━\n下载地址：#url#\n━┉┉┉┉∞┉┉┉┉━\n#code#或应用市场搜索【#APPNAME#】下载注册",

        alired: "763052262",
        huodong: {
          img: "https://img.alicdn.com/imgextra/i4/2053469401/O1CN01UByNgM2JJiCdivYu8_!!2053469401.png",
          color: "9A34FF",
          webUrl: "",
          title: "双11红包",
          url: "https://s.click.taobao.com/kXEoMSu"
        },
        contractPreviewUrl:"",
        yeePaySuccUrl: "https://cash.yeepay.com/newwap/pages/mobile/success",
        yeePayFailUrl: "https://cash.yeepay.com/newwap/pages/mobile/fail",
        skipCode:"1",
        spreadLevel: 3
      }
    }
  }
}
</script>

<style scoped>

</style>
