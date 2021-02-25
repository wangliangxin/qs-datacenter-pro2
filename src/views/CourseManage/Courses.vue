<template>
  <section class="courses">
    <el-form class="actions" :inline="true" :model="filter">
      <el-form-item class="input-title" label="课程名称">
        <el-input v-model="filter.courseName" type="search" placeholder="课程名称"/>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="filter.status" placeholder="课程状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="上架" value="1"></el-option>
          <el-option label="下架" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">查询</el-button>
      </el-form-item>
      <el-form-item class="btn-add">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新建课程</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="courses" v-loading="loading" element-loading-text="数据加载中...">
      <el-table-column prop="id" label="ID" width="50"></el-table-column>
      <el-table-column prop="courseName" label="课程名称"></el-table-column>
      <el-table-column prop="price" label="价格" align="center" min-width="140" :formatter="priceFormatter"></el-table-column>
      <el-table-column prop="sortNum" label="排序" align="center" min-width="100"></el-table-column>
      <el-table-column prop="status" label="状态" align="center" min-width="120">
        <template slot-scope="scope">
          <i class="status status-success" title="上架" v-if="scope.row.status === 1"></i>
          <i class="status status-danger" title="下架" v-else-if="scope.row.status === 0"></i>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="260">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" v-if="scope.row.status === 1" @click="handleToggleStatus(scope.row)">下架</el-button>
          <el-button size="mini" type="success" v-else-if="scope.row.status === 0" @click="handleToggleStatus(scope.row)">上架</el-button>
          <el-button size="mini" @click="handleNavigate('CourseItem', scope.row.id)">编辑</el-button>
          <el-button size="mini" @click="handleNavigate('CourseSections', scope.row.id)">内容管理</el-button>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
export default {
  name: 'Courses',
  title: '课程管理',
  data () {
    const filter = {
      courseName: '',
      status: ''
    }

    return {
      filter,
      courses: [],
      loading: false
    }
  },
  created () {
    this.loadCourses()
  },
  methods: {
    loadCourses () {
      // start loading
      this.loading = true

      // request data
      return this.$services.course.getQueryCourses(this.filter)
        .then(data => {
          this.courses = data.records
          // stop loading
          this.loading = false
        })
        .catch(err => {
          // handle error
          this.$message(err)
          this.loading = false
        })
    },

    handleFilter () {
      this.loadCourses()
    },

    handleAdd () {
      this.$router.push({ name: 'CourseItem', params: { courseId: 'new' } })
    },

    handleToggleStatus (item) {
      const toggledStatus = 1 - item.status
      this.$services.course
        .changeState(item.id, toggledStatus)
        .then(() => {
          item.status = toggledStatus
        })
    },

    handleNavigate (name, id) {
      this.$router.push({ name, params: { courseId: id } })
    },

    priceFormatter (row, column, value, index) {
      return `¥${value}`
    }
  }
}
</script>

<style lang="scss">
.courses {
  .actions {
    display: flex;
    align-items: flex-end;
  }

  .input-title {
    .el-form-item__content {
      min-width: 22vw;
    }
  }

  .btn-add {
    margin-left: auto;
  }
}
</style>
