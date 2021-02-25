<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <el-button size="mini" class="btn-add" @click="handleAdd()">添加广告</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="homeAdvertiseTable"
                :data="list"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column label="id" width="120" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="广告名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="广告位置" width="200" align="center">
          <template slot-scope="scope">{{getSpaceName(scope.row.spaceId)}}</template>
        </el-table-column>
        <el-table-column label="广告图片" width="120" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.img"></template>
        </el-table-column>
        <el-table-column label="时间" width="250" align="center">
          <template slot-scope="scope">
            <p>开始时间：{{scope.row.startTime | formatTime}}</p>
            <p>到期时间：{{scope.row.endTime | formatTime}}</p>
          </template>
        </el-table-column>
        <el-table-column label="上线/下线" width="120" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleUpdateStatus(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.status">
            </el-switch>
          </template>
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
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { fetchADList, updateADStatus, fetchADSpaceList } from '@/services/homeAdvertise'
import moment from 'moment'
const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  name: null,
  type: null,
  endTime: null
}
export default {
  name: 'homeAdvertiseList',
  title: '广告管理',
  data () {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      typeOptions: [],
      typeMap: {},
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
    fetchADSpaceList().then(response => {
      this.typeOptions = response.content.map(item => {
        this.typeMap[item.id] = item
        return { label: item.name, value: item.id }
      })
      this.getList()
    })
  },
  filters: {
    formatTime (time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  methods: {
    getSpaceName (spaceId) {
      if (!spaceId) {
        return ''
      }
      return this.typeMap[spaceId] && this.typeMap[spaceId].name
    },
    handleResetSearch () {
      this.listQuery = Object.assign({}, defaultListQuery)
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
    handleUpdateStatus (index, row) {
      this.$confirm('是否要修改上线/下线状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateADStatus({ id: row.id, status: row.status }).then(response => {
          this.getList()
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'success',
          message: '已取消操作!'
        })
        this.getList()
      })
    },
    handleAdd () {
      this.$router.push({ path: '/addAdvertise' })
    },
    handleUpdate (index, row) {
      this.$router.push({ path: '/updateAdvertise', query: { id: row.id } })
    },
    getList () {
      this.listLoading = true
      fetchADList(this.listQuery).then(response => {
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
