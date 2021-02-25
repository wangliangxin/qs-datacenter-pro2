<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <el-button
        class="btn-add"
        @click="handleAddMenu()"
        size="mini">
        添加菜单
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="menuTable"
                style="width: 100%"
                :data="list"
                v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="菜单名称" align="center" min-width="100">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="菜单级数" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.level | levelFilter}}</template>
        </el-table-column>
        <el-table-column label="前端图标" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.icon}}</template>
        </el-table-column>
        <el-table-column label="排序" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.orderNum }}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { fetchList, deleteMenu, updateHidden } from '@/services/menu'

export default {
  name: 'menuList',
  title: '菜单管理',
  data () {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 5
      },
      parentId: 0
    }
  },
  created () {
    this.resetParentId()
    this.getList()
  },
  watch: {
    $route (route) {
      this.resetParentId()
      this.getList()
    }
  },
  methods: {
    resetParentId () {
      this.listQuery.pageNum = 1
      if (this.$route.query.parentId != null) {
        this.parentId = this.$route.query.parentId
      } else {
        this.parentId = 0
      }
    },
    handleAddMenu () {
      this.$router.push('/addMenu')
    },
    getList () {
      this.listLoading = true
      fetchList(this.parentId, this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data
      })
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
    handleHiddenChange (index, row) {
      updateHidden(row.id, { hidden: row.hidden }).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        })
      })
    },
    handleShowNextLevel (index, row) {
      this.$router.push({ path: '/menu', query: { parentId: row.id } })
    },
    handleUpdate (index, row) {
      this.$router.push({ path: '/updateMenu', query: { id: row.id } })
    },
    handleDelete (index, row) {
      this.$confirm('是否要删除该菜单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenu(row.id).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          })
          this.getList()
        })
      })
    }
  },
  filters: {
    levelFilter (value) {
      if (value === 0) {
        return '一级'
      } else if (value === 1) {
        return '二级'
      }
    },
    disableNextLevel (value) {
      if (value === 0) {
        return false
      } else {
        return true
      }
    }
  }
}
</script>

<style scoped>

</style>
