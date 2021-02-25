<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <el-button size="mini" class="btn-add" @click="handleAdd()">添加广告位</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="homeAdvertiseTable"
                :data="list"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column label="spaceKey" width="120" align="center">
          <template slot-scope="scope">{{scope.row.spaceKey}}</template>
        </el-table-column>
        <el-table-column label="广告位名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime"  :formatter="dateFormatter">
        </el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime"  :formatter="dateFormatter">
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { fetchADSpaceList } from '@/services/homeAdvertise'
import moment from 'moment'
const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  name: null,
  type: null,
  endTime: null
}
const defaultTypeOptions = [
  {
    label: 'PC首页轮播',
    value: 0
  },
  {
    label: 'APP首页轮播',
    value: 1
  }
]
export default {
  name: 'homeAdvertiseList',
  title: '广告位管理',
  data () {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      typeOptions: Object.assign({}, defaultTypeOptions),
      list: null,
      total: null,
      listLoading: false,
      multipleSelection: [],
      operates: [
        {
          label: '删除',
          value: 0
        }
      ],
      operateType: null
    }
  },
  created () {
    this.getList()
  },
  methods: {
    handleResetSearch () {
      this.listQuery = Object.assign({}, defaultListQuery)
    },
    dateFormatter (row, column, value, index) {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    },
    handleSearchList () {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleSizeChange (val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    handleAdd () {
      this.$router.push({ path: '/addAdvertiseSpace' })
    },
    handleUpdate (index, row) {
      this.$router.push({ path: '/updateAdvertiseSpace', query: { id: row.id } })
    },
    getList () {
      this.listLoading = true
      fetchADSpaceList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.content
        this.total = response.content && response.content.length
      })
    }
  }
}
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
</style>
