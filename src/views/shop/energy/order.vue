<template>
  <div class="app-container" style="position: relative; height: calc(100vh - 117px);">
    <div class="container">
      <!--工具栏-->
      <div class="head-container">

        <!-- 搜索 -->
        <el-input v-model="search" clearable placeholder="输入订单号" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
        <el-input v-model="query.uid" clearable placeholder="输入用户id" style="width: 150px;" class="filter-item" @keyup.enter.native="toQuery" />
        <el-input v-model="logId" clearable placeholder="热度记录id" style="width: 150px;" class="filter-item" @keyup.enter.native="toQuery" />
        <el-select v-model="platform" clearable placeholder="平台" class="filter-item" style="width: 130px">
          <el-option v-for="item in platformOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <el-select v-model="hb" clearable placeholder="是否拆红包" class="filter-item" style="width: 130px">
          <el-option v-for="item in hbOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <el-select v-model="paid" clearable placeholder="生成订单" class="filter-item" style="width: 130px">
          <el-option v-for="item in paidOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <el-date-picker
          v-model="createTime"
          :default-time="['00:00:00','23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
        <!-- 新增 -->
        <el-button
          type="danger"
          class="filter-item"
          size="mini"
          icon="el-icon-refresh"
          @click="toQuery"
        >刷新</el-button>
      </div>
      <eForm ref="form" :is-add="isAdd" />
      <!--表格渲染-->
      <el-table ref="multipleTable" v-loading="loading" :data="data" size="small" style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column :selectable="checkboxT" type="selection" width="50" />
        <el-table-column prop="id" label="id"/>
        <el-table-column prop="uid" label="用户id"/>
        <el-table-column prop="logId" label="热度记录id" />
        <el-table-column prop="releaseTime" label="发放时间" width="135">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.releaseTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="unlockTime" label="拆红包时间" width="135">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.unlockTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="hb" label="已拆红包">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.hb === 1" style="cursor: pointer" :type="'success'">是</el-tag>
            <el-tag v-else style="cursor: pointer" :type=" 'warning' ">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="paid" label="生成订单">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.paid === 1" style="cursor: pointer" :type="'success'">是</el-tag>
            <el-tag v-else style="cursor: pointer" :type=" 'warning' ">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="platform" label="平台">
          <template slot-scope="scope">
            <span v-if="scope.row.platform == 'jd'">京东</span>
            <span v-else-if="scope.row.platform == 'pdd'">拼多多</span>
            <span v-else-if="scope.row.platform == 'dy'">抖音</span>
            <span v-else-if="scope.row.platform == 'vip'">唯品会</span>
            <span v-else>淘宝</span>
          </template>
        </el-table-column>
        <el-table-column prop="releaseMoney" label="金额（元）" width="135" />
        <el-table-column prop="orderId" label="订单号" width="220"/>
        <el-table-column prop="createTime" label="创建时间" width="135">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="修改时间" width="135">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column v-if="checkPermission(['admin','ENERGY_ALL','ENERGY_EDIT','ENERGY_DELETE'])" label="操作" width="200" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.logType == 2"
              v-permission="['admin','ENERGY_ALL','ENERGY_EDIT']"
              size="mini"
              type="danger"
              @click="modifyFee(scope.row)"
            >修改佣金</el-button>
            <el-dropdown size="mini" split-button type="primary" trigger="click">
              操作
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item >
                  <el-popover
                    :ref="scope.row.id"
                    v-permission="['admin','ENERGY_ALL','ENERGY_DELETE']"
                    placement="top"
                    width="180"
                  >
                    <p>确定删除本条数据吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                      <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete([scope.row.id])">确定</el-button>
                    </div>
                    <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                  </el-popover>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-footer class="footer-contains">
      <div class="footer-search">
        <el-checkbox v-model="printChecked" @change="batchSelection" style="margin-right: 20px;"></el-checkbox>
        <el-select v-model="batchExport" @change="handleExportOption" clearable placeholder="批量导出" class="filter-item" style="width: 130px">
          <el-option
            v-for="item in exportOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <!--分页组件-->
      <el-pagination
        :total="total"
        :current-page="page + 1"
        style="margin-top: 8px;"
        layout="total, prev, pager, next, jumper, sizes"
        @size-change="sizeChange"
        @current-change="pageChange" />
    </el-footer>
  </div>
</template>

<script>
  import checkPermission from '@/utils/permission'
  import initData from '@/mixins/crud'
  import { del } from '@/api/mwUserEnergy'
  import { formatTime } from '@/utils'
  import eForm from './form'

  export default {
    components: { eForm},
    mixins: [initData],
    data() {
      return {
        delLoading: false,
        status: '',
        rank: '',
        platform: '',
        hb: '',
        paid: '',
        uid: '',
        logId: '',
        search: '',
        createTime: '',
        checkList: [],
        printChecked: false,
        batchHandle: '',
        batchExport: '',
        listContent: [],
        platformOptions: [
          { key: 'tb', display_name: '淘宝' },
          { key: 'jd', display_name: '京东' },
          { key: 'pdd', display_name: '拼多多' },
          { key: 'dy', display_name: '抖音' },
          { key: 'vip', display_name: '唯品会' },
        ],
        hbOptions: [
          { key: '1', display_name: '已拆' },
          { key: '0', display_name: '未拆' },
        ],
        paidOptions: [
          { key: '1', display_name: '已生成' },
          { key: '0', display_name: '未生成' },
        ],
        exportOptions: [
          {value: '', label: '批量导出'},
          {value: '0', label: '导出全部'},
          {value: '1', label: '导出选中'},
        ],

      }
    },
    created() {
      this.$nextTick(() => {
        this.init()
      })
    },
    methods: {
      formatTime,
      checkPermission,
      beforeInit() {
        this.url = 'api/energy/order'
        const sort = 'id,desc'
        this.params = {
          page: this.page,
          size: this.size,
          sort: sort,
          releaseTime: this.createTime,
          listContent: this.listContent
        }

        if(this.platform != null && this.platform != '') {
          this.params.platform = this.platform;
        }
        if(this.hb != null && this.hb != '') {
          this.params.hb = this.hb;
        }
        if(this.paid != null && this.paid != '') {
          this.params.paid = this.paid;
        }
        if(this.refund != null && this.refund != '') {
          this.params.refund = this.refund;
        }
        if(this.uid != null && this.uid != '') {
          this.params.uid = this.uid;
        }
        if(this.search != null && this.search != '') {
          this.params.orderId = this.search;
        }
        if(this.logId != null && this.logId != '') {
          this.params.logId = this.logId;
        }
        const query = this.query
        const type = query.type
        const value = query.value
        if (type && value) { this.params[type] = value }
        return true
      },
      subDelete(id) {
        this.delLoading = true
        del(id).then(res => {
          this.delLoading = false
          this.$refs[id].doClose()
          this.dleChangePage()
          this.init()
          this.$notify({
            title: '删除成功',
            type: 'success',
            duration: 2500
          })
        }).catch(err => {
          this.delLoading = false
          this.$refs[id].doClose()
          console.log(err.response.data.message)
        })
      },
      modifyFee(data) {
        this.isAdd = true
        const _this = this.$refs.form
        _this.form = {
          id: data.id,
          releaseMoney: data.releaseMoney,
        }
        _this.dialog = true
      },
      add() {
        this.isAdd = true
        this.$refs.form.dialog = true
      },
      handleSelectionChange(val) {
        this.checkList = val;
        let orderPrice = 0, storeNum = 0, orderNum = 0, userNum = 0;
        if(val.length !=0 ){
          this.printChecked = true;
          let user = [];
          val.forEach((item,index)=>{
            orderNum += 1;
            orderPrice += item.totalPrice;
            storeNum += item.totalNum;
            user.push(item.userDTO.nickname);
          })
          user = Array.from(new Set(user));

        }else {
          this.printChecked = false;
        }
      },
      batchSelection(val){
        let rows = this.data;
        if (val) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleExportOption(val){
        let list = this.checkList;
        this.page = 0;
        this.size = 10000;
        switch (val) {
          case "0":
            this.listContent = "";
            this.beforeInit();
            this.downloadMethod();
            break;
          case "1":
            if(list.length == 0){
              this.$message({
                message: '请选择订单',
                type: 'warning'
              });
            }else {
              this.listContent = [];
              list.forEach((item) => {
                this.listContent.push(item.orderId);
              })
              this.listContent = JSON.stringify(this.listContent);
              this.beforeInit();
              this.downloadMethod();
            }
            break;
          default:
            break;
        }
        this.batchExport = "";
      },
      checkboxT(row, rowIndex) {
        return row.id !== 1
      },
    }
  }
</script>

<style scoped lang="scss">
  .container {
    height: calc(100% - 80px);
    position: absolute;
    overflow: auto;
    width: calc(100% - 20px);

    .order-caculate {
      font-size: 14px;
      color: #909399;
      border-top: 1px solid #f0f0f0;
      padding: 20px 10px;
      .caculate-title {
        display: inline-block;
        margin-right: 50px;
      }
      .caculate-num {
        font-size: 20px;
        color: #ff4949;
      }
    }

    .el-table th {
      background-color: #fafafa;
    }
  }

  .footer-contains {
    position: absolute;
    display: -ms-flexbox;
    display: flex;
    background-color: #f6f6f6;
    bottom: 0;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    z-index: 999;
    padding: 0 20px 0 13px;
  }

  /*打印单样式编辑*/
  .order-list {
    /*  height: 297mm;*/
    margin: 0 auto;
    width: 210mm;

    .order-title {
      height: 16mm;
      line-height: 16mm;
      font-size: 8mm;
      font-weight: bolder;
      text-align: center;
    }
    .order-info {
      span {
        display: inline-block;
        padding: 0 0 10px 0;
        font-size: 3mm;
      }
      span.info {
        width: 60mm;
      }
    }
    .el-table--small th, .el-table--small td {
      padding: 4px 0;
    }
  }
</style>
