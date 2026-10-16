<template>
  <div class="hotCommodity card">
    <div class="card-header">
      <p class="title">超值拼团</p>
      <span class="more">更多</span>
    </div>
    <div class="card-body">
      <el-carousel height="170px">
        <el-carousel-item>
          <div class="goods-list">
            <div class="min-goods">
              <div class="img-box">
                <div class="tag">hot</div>
                <img
                  class="img"
                  src="https://image.xxx.com/3.jpg"
                />
              </div>
              <div class="price-box">
                <div class="y-f">
                  <span class="seckill-current">￥0.50</span>
                  <span class="original">销量133张</span>
                </div>
              </div>
              <div class="title"></div>
            </div>
            <div class="min-goods">
              <div class="img-box">
                <div class="tag">hot</div>
                <img
                  class="img"
                  src="https://image.xxx.com/3.jpg"
                />
              </div>
              <div class="price-box">
                <div class="y-f">
                  <span class="seckill-current">￥0.50</span>
                  <span class="original">销量133张</span>
                </div>
              </div>
              <div class="title"></div>
            </div>
            <div class="min-goods">
              <div class="img-box">
                <div class="tag">hot</div>
                <img
                  class="img"
                  src="https://image.xxx.com/3.jpg"
                />
              </div>
              <div class="price-box">
                <div class="y-f">
                  <span class="seckill-current">￥0.50</span>
                  <span class="original">销量133张</span>
                </div>
              </div>
              <div class="title"></div>
            </div>
            <div class="min-goods">
              <div class="img-box">
                <div class="tag">hot</div>
                <img
                  class="img"
                  src="https://image.xxx.com/3.jpg"
                />
              </div>
              <div class="price-box">
                <div class="y-f">
                  <span class="seckill-current">￥0.50</span>
                  <span class="original">销量133张</span>
                </div>
              </div>
              <div class="title"></div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
@use 'sass:math';
.y-f {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card {
  margin-top: math.div(5, 375) * 500px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  margin-left: 10px;
  margin-right: 10px;
  padding: 10px;
  margin-bottom: 5px;
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: math.div(10, 375) * 500px;
    .title {
      font-size: math.div(17, 375) * 500px;
      font-weight: 700;
    }
    .more {
      font-size: math.div(15, 375) * 500px;
      padding-left: math.div(16, 375) * 500px;
      color: #666;
    }
  }
}
.min-goods {
  width: 25%;
  background: #fff;
  .img-box {
    width: math.div(83, 375) * 500px;
    height: math.div(83, 375) * 500px;
    overflow: hidden;
    position: relative;
    .tag {
      position: absolute;
      left: 0;
      bottom: math.div(0, 375) * 500px;
      z-index: 2;
      line-height: math.div(19, 375) * 500px;
      background: linear-gradient(132deg, #f3dfb1, #f3dfb1, #ecbe60);
      border-radius: 0 math.div(9, 375) * 500px math.div(9, 375) * 500px 0;
      padding: 0 math.div(5, 375) * 500px;
      font-size: math.div(13, 375) * 500px;
      font-family: PingFang SC;
      font-weight: 700;
      color: #784f06;
    }
    .img {
      width: 100%;
      background-color: #ccc;
      display: block;
    }
  }
  .price-box {
    width: 100%;
    margin-top: math.div(5, 375) * 500px;
    .seckill-current {
      font-size: math.div(16, 375) * 500px;
      font-weight: 500;
      color: #e1212b;
    }
    .original {
      font-size: math.div(10, 375) * 500px;
      font-weight: 400;
      text-decoration: line-through;
      color: #999;
      margin-left: math.div(7, 375) * 500px;
    }
  }
}
.goods-list {
  display: flex;
  justify-content: space-between;
}
</style>
