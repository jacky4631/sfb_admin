<template>
  <div class="app-container promoter-page">
    <header class="page-heading">
      <div>
        <h1>分销配置</h1>
        <p>管理分销开关、返佣比例和邀请奖励规则</p>
      </div>
    </header>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      size="small"
      label-position="left"
      label-width="230px"
      class="promoter-form"
    >
      <section class="settings-section">
        <div class="section-heading">
          <h2>功能开关</h2>
          <p>设置会员和分销相关功能是否对用户开放</p>
        </div>

        <el-form-item label="多会员开关">
          <div class="field-control">
            <el-radio-group v-model="form.store_multi_vip_open">
              <el-radio :value="1">开启</el-radio>
              <el-radio :value="2">关闭</el-radio>
            </el-radio-group>
            <span class="field-hint">控制“我的特权多会员”功能</span>
          </div>
        </el-form-item>
        <el-form-item label="分销开关">
          <div class="field-control">
            <el-radio-group v-model="form.store_brokerage_open">
              <el-radio :value="1">开启</el-radio>
              <el-radio :value="2">关闭</el-radio>
            </el-radio-group>
            <span class="field-hint">控制订单分销和会员升级分销</span>
          </div>
        </el-form-item>
        <el-form-item label="登录强制跳转邀请码页面">
          <div class="field-control">
            <el-radio-group v-model="form.login_must_code">
              <el-radio :value="1">开启</el-radio>
              <el-radio :value="2">关闭</el-radio>
            </el-radio-group>
            <span class="field-hint">关闭后，App 登录时会跳过邀请码页面</span>
          </div>
        </el-form-item>
      </section>

      <section class="settings-section">
        <div class="section-heading">
          <h2>返佣与拆红包</h2>
          <p>配置平台返佣比例及 App 端展示的红包金额规则</p>
        </div>

        <el-form-item label="淘宝扣除服务费后比例">
          <div class="field-control">
            <el-input v-model="form.tk_tb_rebate_scale" class="medium-input" />
            <span class="field-unit">%</span>
            <span class="field-hint">建议设置在 80–90 之间</span>
          </div>
        </el-form-item>
        <el-form-item label="拆红包比例">
          <div class="field-control">
            <el-input v-model="form.tk_hb_rebate_scale" class="medium-input" />
            <span class="field-unit">%</span>
            <span class="field-hint">建议设置为 70；优先使用“会员管理 → 会员等级”的比例</span>
          </div>
        </el-form-item>
        <el-form-item label="拆红包显示倍数区间">
          <div class="field-control">
            <el-input v-model="form.tk_hb_min_times" class="short-input" />
            <span class="field-unit">倍</span>
            <span class="range-separator">至</span>
            <el-input v-model="form.tk_hb_max_times" class="short-input" />
            <span class="field-unit">倍</span>
            <span class="field-hint">建议设置在 0.5–10 之间，决定 App 展示的红包金额范围</span>
          </div>
        </el-form-item>
        <el-form-item label="星选会员加盟分红">
          <div class="field-control field-control--wrap">
            <span class="field-prefix">一级</span>
            <el-input v-model="form.store_brokerage_ratio" class="medium-input" />
            <span class="field-unit">%</span>
            <span class="field-prefix field-prefix--second">二级</span>
            <el-input v-model="form.store_brokerage_two" class="medium-input" />
            <span class="field-unit">%</span>
            <span class="field-hint field-hint--break">用于 App“星选会员”加盟返佣</span>
          </div>
        </el-form-item>
      </section>

      <section class="settings-section">
        <div class="section-heading">
          <h2>邀请奖励</h2>
          <p>设置邀请用户奖励和每日红包数量上限</p>
        </div>

        <el-form-item label="邀请用户奖励">
          <div class="field-control field-control--wrap">
            <span class="field-prefix">邀请前</span>
            <el-input v-model="form.spread_user_count" class="short-input" />
            <span class="field-unit">人</span>
            <span class="field-prefix field-prefix--second">每人奖励</span>
            <el-input v-model="form.spread_user_hb" class="short-input" />
            <span class="field-unit">元</span>
          </div>
        </el-form-item>
        <el-form-item label="每天拆红包数量">
          <div class="field-control">
            <el-input v-model="form.spread_hb_count_config" class="medium-input" />
            <span class="field-hint">各平台分别计算；建议谨慎设置，避免被刷单</span>
          </div>
        </el-form-item>
      </section>

      <div class="form-actions">
        <el-button type="primary" size="large" @click="doSubmit">保存配置</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { get, add } from '@/api/mwSystemConfig'

const formRef = ref(null)

const form = reactive({
  tk_hb_min_times: 0.5,
  tk_hb_max_times: 10,
  tk_hb_rebate_scale: 50,
  tk_tb_rebate_scale: 90,
  store_multi_vip_open: 2,
  store_brokerage_open: 2,
  login_must_code: 2,
  store_brokerage_ratio: 0,
  store_brokerage_two: 0,
  spread_user_count: 5,
  spread_user_hb: 0.4,
  spread_hb_count_config: 5
})

const rules = {}

const initData = () => {
  get().then(rese => {
    rese.content.forEach(key => {
      const keyName = key.menuName
      const newValue = key.value
      if (keyName in form) {
        form[keyName] = newValue
      }
    })

    form.store_multi_vip_open = parseInt(form.store_multi_vip_open)
    form.store_brokerage_open = parseInt(form.store_brokerage_open)
    form.login_must_code = parseInt(form.login_must_code)
  })
}

const checkPermission = () => {
  // Permission check logic
}

const doSubmit = () => {
  add(form).then(res => {
    ElMessage({ message: '设置成功', type: 'success' })
  }).catch(err => {
    console.log(err.response?.data?.message)
  })
}

onMounted(() => {
  initData()
})
</script>

<style scoped lang="scss">
.promoter-page {
  width: auto;
  min-height: 100%;
  margin: 20px;
  padding: 28px 36px 36px;
}

.page-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 22px;
  border-bottom: 1px solid var(--el-border-color-lighter);

  h1 {
    margin: 0;
    color: var(--el-text-color-primary);
    font-size: 20px;
    font-weight: 600;
    line-height: 1.4;
  }

  p {
    margin: 6px 0 0;
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }
}

.settings-section {
  padding: 24px 0 8px;
  border-bottom: 1px solid var(--el-border-color-extra-light);

  &:last-of-type {
    border-bottom: 0;
  }
}

.section-heading {
  margin: 0 0 20px;

  h2 {
    margin: 0;
    color: var(--el-text-color-primary);
    font-size: 15px;
    font-weight: 600;
    line-height: 1.5;
  }

  p {
    margin: 4px 0 0;
    color: var(--el-text-color-secondary);
    font-size: 12px;
  }
}

.promoter-form {
  padding-top: 4px;

  :deep(.el-form-item) {
    margin-bottom: 22px;
  }

  :deep(.el-form-item__label) {
    color: var(--el-text-color-regular);
    font-weight: 500;
  }
}

.field-control {
  display: flex;
  min-height: 32px;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.medium-input {
  width: 180px;
}

.short-input {
  width: 112px;
}

.field-unit,
.field-prefix,
.range-separator {
  color: var(--el-text-color-regular);
  white-space: nowrap;
}

.field-prefix--second {
  margin-left: 12px;
}

.field-hint {
  color: var(--el-text-color-secondary);
  font-size: 12px;
  line-height: 1.5;
}

.field-hint--break {
  flex-basis: 100%;
  margin-left: 0;
}

.form-actions {
  padding: 24px 0 4px 230px;
}

@media (max-width: 768px) {
  .promoter-page {
    margin: 12px;
    padding: 22px 18px;
  }

  .promoter-form {
    :deep(.el-form-item) {
      display: block;
      margin-bottom: 18px;
    }

    :deep(.el-form-item__label) {
      display: block;
      width: 100% !important;
      line-height: 1.5;
      text-align: left;
    }

    :deep(.el-form-item__content) {
      margin-left: 0 !important;
    }
  }

  .form-actions {
    padding-left: 0;
  }
}
</style>
