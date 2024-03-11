<template>
  <div class="app-container" style="position: relative; height: calc(100vh - 117px);">
    <div class="container">
      <!--工具栏-->
      <div class="head-container">

        <!-- 搜索 -->
        <el-input v-model="query.uid" clearable placeholder="输入用户uid" style="width: 150px;" class="filter-item" @keyup.enter.native="toQuery" />
        <el-input v-model="query.oid" clearable placeholder="输入用户oid" style="width: 150px;" class="filter-item" @keyup.enter.native="toQuery" />
        <el-select v-model="platform" clearable placeholder="平台" class="filter-item" style="width: 130px">
          <el-option v-for="item in platformOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <el-select v-model="type" clearable placeholder="类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in typeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
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

      <!--表格渲染-->
      <el-table ref="multipleTable" v-loading="loading" :data="data" size="small" style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column prop="id" label="id"/>
        <el-table-column prop="uid" label="用户id"/>
        <el-table-column prop="oid" label="用户oid"/>
        <el-table-column prop="energy" label="热度">
          <template slot-scope="scope">
            <div v-if="scope.row.type === 1">+{{ scope.row.energy }}</div>
            <div v-else >-{{ scope.row.energy }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="platform" label="平台"/>
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
        layout="total, prev, pager, next, sizes"
        @size-change="sizeChange"
        @current-change="pageChange" />
    </el-footer>
  </div>
</template>

<script>
  import checkPermission from '@/utils/permission'
  import initData from '@/mixins/crud'
  import { formatTime } from '@/utils'

  export default {
    components: { },
    mixins: [initData],
    data() {
      return {
        delLoading: false,
        platform: '',
        type: '',
        uid: '',
        oid: '',
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
        typeOptions: [
          { key: '1', display_name: '增加' },
          { key: '2', display_name: '减少' },
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
        this.url = 'api/energy/log'
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
        if(this.type != null && this.type != '') {
          this.params.type = this.type;
        }
        if(this.uid != null && this.uid != '') {
          this.params.uid = this.uid;
        }
        if(this.oid != null && this.oid != '') {
          this.params.oid = this.oid;
        }
        const query = this.query
        const type = query.type
        const value = query.value
        if (type && value) { this.params[type] = value }
        return true
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
