<template>
  <section class="users">
    <el-form class="actions" :model="filter" label-position="top" inline>
      <!-- <el-form-item label="ID">
        <el-input v-model="filter.id" placeholder="请输入用户 ID"/>
      </el-form-item> -->
      <el-form-item label="手机号">
        <el-input v-model="filter.username" placeholder="请输入手机号"/>
      </el-form-item>
      <el-form-item label="注册时间">
        <el-date-picker
          v-model="filter.created"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          range-separator="至"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="users" v-loading="loading" element-loading-text="数据加载中...">
      <el-table-column prop="id" label="用户ID" width="100"></el-table-column>
      <el-table-column label="头像" min-width="50">
        <template slot-scope="scope">
          <img class="avatar" :src="scope.row.portrait || '//www.lgstatic.com/thumbnail_100x100/i/image2/M01/5E/65/CgotOVszSAOANi0LAAAse2IVWAE693.jpg'" :alt="scope.row.name">
        </template>
      </el-table-column>
      <el-table-column prop="name" label="用户名" min-width="150"></el-table-column>
      <el-table-column prop="phone" label="手机号" min-width="150"></el-table-column>

      <el-table-column prop="createTime" label="注册时间" min-width="180" :formatter="dateFormatter"></el-table-column>
      <el-table-column prop="status" label="状态" align="center" min-width="120">
        <template slot-scope="scope">
          <i class="status status-success" title="正常" v-if="scope.row.status === 'ENABLE'" @click="handleToggleStatus(scope.row)"></i>
          <i class="status status-danger" title="禁用" v-else-if="scope.row.status === 'DISABLE'" ></i>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="120">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 'ENABLE'" size="mini" type="text" @click="handleToggleStatus(scope.row)">{{ scope.row.status == 'ENABLE' ? '禁用' : '启用' }}</el-button>
          <el-button size="mini"
                     type="text"
                     @click="handleSelectRole(scope.$index, scope.row)">分配角色
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="users.length" layout="total, sizes, prev, pager, next, jumper" @size-change="handlePageSizeChange" @current-change="handleCurrentPageChange" :current-page="page" :page-sizes="[20, 30, 50]" :page-size="size" :total="total"/>
    <el-dialog
      title="分配角色"
      :visible.sync="allocDialogVisible"
      width="30%">
      <el-select v-model="allocRoleIds" multiple placeholder="请选择" size="small" style="width: 80%">
        <el-option
          v-for="item in allRoleList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="allocDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleAllocDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </section>

</template>

<script>
import { getRoleByAdmin, getRolesById, allocRole } from '@/services/login'
import moment from 'moment'
export default {
  name: 'Users',
  title: '用户管理',
  data () {
    const pickerOptions = {
      shortcuts: [
        {
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }
      ]
    }

    const filter = {
      id: '',
      username: '',
      created: null,
      last_login: null
    }

    return {
      pickerOptions,
      filter,
      users: [],
      total: 0,
      size: 20,
      page: 1,
      loading: false,
      allocAdminId: '',
      allocDialogVisible: false,
      allocRoleIds: [],
      allRoleList: []
    }
  },
  created () {
    // initial data
    this.loadUsers()
  },
  methods: {
    loadUsers () {
      // toggle loading
      this.loading = true

      // paginate
      const params = { currentPage: this.page, pageSize: this.size }

      // // sort
      // if (this.sort) params._sort = this.sort
      // if (this.order) params._order = this.order
      // // search
      // if (this.search) params.q = this.filter.search

      // filter
      if (this.filter.id) params.id = this.filter.id
      if (this.filter.username) params.phone = this.filter.username
      if (this.filter.created) {
        params.startCreateTime = this.filter.created[0]
        params.startCreateTime.setHours(0)
        params.startCreateTime.setMinutes(0)
        params.startCreateTime.setSeconds(0)

        params.endCreateTime = this.filter.created[1]
        params.endCreateTime.setHours(23)
        params.endCreateTime.setMinutes(59)
        params.endCreateTime.setSeconds(59)
      } if (this.filter.last_login) {
        params.startUpdateTime = this.filter.last_login[0]
        params.endUpdateTime = this.filter.last_login[1]
      }

      // request data
      return this.$services.user.getUserList(params)
        .then(res => {
          // response
          this.users = res.records
          this.total = res.total
          // toggle loading
          this.loading = false
        })
        .catch(err => {
          // handle error
          console.error(err)
          this.loading = false
        })
    },

    handleCurrentPageChange (page) {
      this.page = page
      this.loadUsers()
    },

    handlePageSizeChange (size) {
      this.size = size
      this.loadUsers()
    },

    handleFilter () {
      this.loadUsers()
    },

    handleToggleStatus (item) {
      this.$services.user
        .forbidUser(item.id)
        .then(res => Object.assign(item, res.data))
    },

    handleAdd () {
      this.$message({ message: '尚未规划此功能' })
    },

    dateFormatter (row, column, value, index) {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    },
    handleSelectRole (index, row) {
      this.allocAdminId = row.id
      this.allocDialogVisible = true
      this.getRoleListByAdmin(row.id)
    },
    getRoleListByAdmin (id) {
      getRoleByAdmin().then(response => {
        this.allRoleList = response.data.map(item => {
          return { id: item.id, name: item.name }
        })
      })
      getRolesById(id).then(response => {
        const allocRoleList = response.data
        this.allocRoleIds = []
        if (allocRoleList != null && allocRoleList.length > 0) {
          for (let i = 0; i < allocRoleList.length; i++) {
            this.allocRoleIds.push(allocRoleList[i].id)
          }
        }
      })
    },
    handleAllocDialogConfirm () {
      allocRole({
        userId: this.allocAdminId,
        roleIdList: this.allocRoleIds
      }).then(response => {
        this.$message({
          message: '分配成功！',
          type: 'success'
        })
        this.allocDialogVisible = false
      })
    }
  }
}
</script>

<style lang="scss">
.users {
  .actions {
    display: flex;
    align-items: flex-end;

    label {
      line-height: 1;
    }
  }

  .btn-add {
    margin-left: auto;
    margin-right: 0;
  }

  .avatar {
    margin-right: 10px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    box-sizing: border-box;
    vertical-align: middle;
  }

  .name {
    display: inline-block;
    line-height: 30px;
    vertical-align: middle;
  }

  .el-pagination {
    margin-top: 30px;
    text-align: right;
  }
}
</style>
