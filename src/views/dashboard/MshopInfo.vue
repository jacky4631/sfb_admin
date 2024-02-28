<template>
  <el-row :gutter="10" class="panel-group">
    <el-col :xs="16" :sm="16" :lg="8" class="card-panel-col">
      <div class="card-panel">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-weight: bolder">项目信息</span>
          </div>
          <div class="text item">
            <span style="font-weight: bolder">mshop基于当前流行技术组合的前后端分离商城系统：</span>
            SpringBoot2+Jpa+MybatisPlus+SpringSecurity
            的前后端分离的商城系统，
            包含商城、拼团、砍价、商户管理、 秒杀、优惠券、积分、分销、会员、充值、门店核销等功能。
          </div>
          <div class="text item">
            <span style="font-weight: bolder">技术选型：</span>
            SpringBoot2、mybatis、MyBatis-Plus
            、SpringSecurity、JPA 、Druid 、Slf4j 、Fastjson
            、JWT 、Redis 、Quartz 、Mysql 、swagger 、WxJava
            、Lombok 、Hutool
            、Mapstruct 、Redisson 、Rocketmq
          </div>
          <div class="text item">
            <span style="font-weight: bolder">gitee：</span><a target="_blank" href="">访问码云</a>
          </div>
          <div class="text item">
            <span style="font-weight: bolder">github：</span><a target="_blank" href="">访问github</a>
          </div>
          <div class="text item">
            <span style="font-weight: bolder">小程序演示：</span>关注上面公众号之后，选择mshop小程序体验即可
          </div>
          <div class="text item">
            <span style="font-weight: bolder;color: red">如果想体验手机端商户管理功能，记得去后台会员管理，搜索找到自己，
            然后编辑设置商户管理员开启即可，然后刷新个人中心即可体验</span>
          </div>
        </el-card>
      </div>
    </el-col>
    <el-col :xs="16" :sm="16" :lg="8" class="card-panel-col">
      <div class="card-panel">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-weight: bolder">开源+VIP说明</span>
          </div>
          <div class="text item">
            <span style="font-weight: bolder">开源版：</span>是整个商城的管理后台（后台已经封装好了图片素材库、编辑器、配置等等组件），
            它可以用于所有的Web应用程序，如网站商城管理后台，网站会员中心，CMS，CRM，OA等等，
            当然，您也可以对它进行深度定制，以做出更强系统。
          </div>
        </el-card>
      </div>
    </el-col>
    <el-col :xs="16" :sm="16" :lg="8" class="card-panel-col">
      <div class="card-panel">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-weight: bolder">更新日志</span>
          </div>
          <div class="text item">
            <span style="font-weight: bolder">（预计4月初发布）mshop2.1版本(已上演示版的公众号/H5版本) 更新如下：</span>
          </div>
          <div class="text item">
            1、单门店升级为多门店）
          </div>
          <div class="text item">
            2、充值新增充值方案
          </div>
          <div class="text item">
            3、打通小程序与公众号账号
          </div>
          <div class="text item">
            4、新增微信app支付
          </div>
          <div class="text item">
            5、会员等级升级新增手动解锁
          </div>
          <div class="text item">
            6、app分销海报与商品详情海报新增了邀请码
          </div>
          <div class="text item">
            7、app注册新增了邀请码形成分销关系）
          </div>
          <div class="text item">
            8、后台素材按照时间排序#I1C6MK
          </div>
          <div class="text item">
            9、商品分类新增判断自己不能选择自己作为父级#I1C5AP
          </div>
          <div class="text item">
            10、修复订单详情昵称不显示问题#I1C055
          </div>
          <div class="text item">
            11、修复导入微信地址必须要刷新的问题#I1CCEJ
          </div>
          <div class="text item">
            12、修复当设置最大抵扣积为0的导致积分不能抵扣的问题
          </div>
          <div class="text item">
            13、优化订单详情腾讯key的提示
          </div>
          <div class="text item">
            14、优化订单列表新增门店标识
          </div>
          <div class="text item">
            <span style="font-weight: bolder">（2020-03-15）2.0.X修复优化版本 发布更新如下：</span>
          </div>
          <div class="text item">
            1、修复后台上传图片点击图片预览关闭按钮不显示的问题#I1B8RB
          </div>
          <div class="text item">
            2、后台新增物流快递查询
          </div>
          <div class="text item">
            3、修复后台不能一次删除多个商品分类且优化删除分类#I1BASM
          </div>
          <div class="text item">
            4、修复商品管理/管理商品/待上架产品删除问题#I1B9O7
          </div>
          <div class="text item">
            5、微信支付新增小程序渠道,修复小程序与其他支付appid冲突问题，后台微信支付配置移除appid选项
          </div>
          <div class="text item">
            6、后台微信菜单与自动回复显示字体调整
          </div>
          <div class="text item">
            7、后台订单列表修改为状态栏展示
          </div>
          <div class="text item">
            8、微信授权与小程序授权优化及其确认订单优化
          </div>
          <div class="text item">
            9、新增公众号获取微信地址权限
          </div>
          <div class="text item">
            10、修复打开图片素材库的标红警告#I1BLJM
          </div>
          <div class="text item">
            11、修复后台订单详情时间显示不对的问题#I1BLV6
          </div>
          <div class="text item">
            12、修复提交订单页面选取优惠时显示优惠券有效期错乱#I1BHA1
          </div>
          <div class="text item">
            13、修复PC端图片素材“删除分组标红警告 #I1BNII
          </div>
          <div class="text item">
            14、小程序增加下拉刷新功能#I1AHAX
          </div>
          <div class="text item">
            15、修复小程序首页--促销单品--更多 报错#I1AA47
          </div>
          <div class="text item">
            <span style="font-weight: bolder">（2020-03-07）mshop2.0版本 发布更新如下：</span>
          </div>
          <div class="text item">
            1、优化代码结构与名称，修改get请求参数其统一继承分页参数
          </div>
          <div class="text item">
            2、新增redis监听未付款30分钟取消功能与7天自动收货功能，mq队列作为备选(注释掉)
          </div>
          <div class="text item">
            3、新增门店到店核销功能
          </div>
          <div class="text item">
            4、新增分销全局开关#I19HB1
          </div>
          <div class="text item">
            5、积分新增消费限制#I19TUR
          </div>
          <div class="text item">
            6、新增充值功能#I18V5D
          </div>
          <div class="text item">
            7、后台菜单调整，新增财务模块
          </div>
          <div class="text item">
            8、优化后台配置赋值写法
          </div>
          <div class="text item">
            9、修复管理后台新增表单之后如果直接再新增数据导致默认数据缺失问题#I1AFBK
          </div>
          <div class="text item">
            10、修复提交购物车可能查询多条数据的问题
          </div>
          <div class="text item">
            11、后台登陆背景图固定#I1A0LS
          </div>
          <div class="text item">
            12、增加常量与枚举优化硬编码问题
          </div>
          <div class="text item">
            13、微信支付、公众号、模板消息修改
          </div>
          <div class="text item">
            14、修复代码生成器不全的问题#I1AIO4
          </div>
          <div class="text item">
            15、修复营销产品拼团等轮播图不能修改的问题#I1AHXR
          </div>
          <div class="text item">
            16、移除mshop-monitor模块
          </div>
          <div class="text item">
            17、修复退货理由文字错误#I1AQ7D
          </div>
          <div class="text item">
            18、修复新增分类的图片自动显示上次一次的图片#I1AQBK
          </div>
          <div class="text item">
            19、新增微信jssdk接口返回所需js权限
          </div>
          <div class="text item">
            20、新增余额充值变动模板消息通知
          </div>
          <div class="text item">
            21、首页数据缓存优化
          </div>
          <div class="text item">
            22、新增未支付订单显示到期时间
          </div>
          <div class="text item">
            23、修复加入购物车购买后，后台订单中的商品信息数据重复#I1AXNX
          </div>
          <div class="text item">
            24、修复后台-管理商品-规格属性 属性无法删除问题#I1AYL2
          </div>
          <div class="text item">
            25、修复公众号商品直接微信分享标题不显示的问题#I1AX0R
          </div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>
<script>

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .text {
    font-size: 12px;
  }

  .item {
    margin-bottom: 10px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: auto;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shopping {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
