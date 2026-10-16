<template>
  <div class="app-container finance-page tools-tab-page">
  <el-tabs v-model="activeName" class="tools-tabs">
    <el-tab-pane class="tool-settings-pane" label="邮箱配置" name="first">
      <Config />
    </el-tab-pane>
    <el-tab-pane class="tool-settings-pane" label="发送邮件" name="second">
      <Send />
    </el-tab-pane>
    <el-tab-pane class="tool-settings-pane" label="使用说明" name="third">
      <div>
        <blockquote class="my-blockquote"> 邮件服务器配置</blockquote>
        <pre class="my-code">
 # 邮件服务器的SMTP地址，可选，默认为smtp
 # 邮件服务器的SMTP端口，可选，默认465或者25
 # 发件人（必须正确，否则发送失败）
 # 用户名，默认为发件人邮箱前缀
 # 密码（注意，某些邮箱需要为SMTP服务单独设置密码，如QQ和163等等）
 # 是否开启ssl，默认开启</pre>
        <blockquote class="my-blockquote">更多帮助</blockquote>
        <pre class="my-code">更多帮助请查看文档：<a style="color:#009688" href="http://hutool.mydoc.io/#text_319499" target="_black">hutool工具包</a></pre>
      </div>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Config from './config.vue'
import Send from './send.vue'

const activeName = ref('second')
</script>

<style scoped>
</style>
