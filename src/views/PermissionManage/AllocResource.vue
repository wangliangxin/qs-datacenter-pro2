<template>
  <el-card class="form-container" shadow="never">
    <div v-for="(cate,index) in allResourceCate" :class="index===0?'top-line':null" :key="'cate'+cate.id">
      <el-row class="table-layout" style="background: #F2F6FC;">
        <el-checkbox v-model="cate.selected"
                     :indeterminate="isIndeterminate(cate.id)"
                     @change="handleCheckAllChange(cate)">
          {{cate.name}}
        </el-checkbox>
      </el-row>
      <el-row class="table-layout">
        <el-col :span="8" v-for="resource in getResourceByCate(cate.id)" :key="resource.id" style="padding: 4px 0">
          <el-checkbox v-model="resource.selected" @change="handleCheckChange(resource)">
            {{resource.name}}
          </el-checkbox>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 20px" align="center">
      <el-button type="primary" @click="handleSave()">保存</el-button>
      <el-button @click="handleClear()">清空</el-button>
    </div>

  </el-card>
</template>

<script>
import { fetchAllResourceList } from '@/services/resource'
import { listAllCate } from '@/services/resourceCategory'
import { allocResource, listResourceByRole } from '@/services/role'

export default {
  name: 'allocResource',
  title: '角色资源管理',
  data () {
    return {
      roleId: null,
      allResource: null,
      allResourceCate: null
    }
  },
  created () {
    this.roleId = this.$route.query.roleId
    this.getAllResourceCateList()
  },
  methods: {
    getAllResourceList () {
      fetchAllResourceList().then(response => {
        this.allResource = response.data
        for (let i = 0; i < this.allResource.length; i++) {
          this.allResource[i].selected = false
        }
        this.getResourceByRole(this.roleId)
      })
    },
    getAllResourceCateList () {
      listAllCate(this.$route.query.roleId).then(response => {
        this.allResourceCate = response.data
        for (let i = 0; i < this.allResourceCate.length; i++) {
          this.allResourceCate[i].selected = false
        }
        this.getAllResourceList()
      })
    },
    getResourceByCate (categoryId) {
      const cateResource = []
      if (this.allResource == null) return null
      for (let i = 0; i < this.allResource.length; i++) {
        const resource = this.allResource[i]
        if (resource.categoryId === categoryId) {
          cateResource.push(resource)
        }
      }
      return cateResource
    },
    getResourceByRole (roleId) {
      listResourceByRole(roleId).then(response => {
        const allocResource = response.data
        this.allResource.forEach(item => {
          item.selected = this.getResourceChecked(item.id, allocResource)
        })
        this.allResourceCate.forEach(item => {
          item.selected = this.isAllChecked(item.id)
        })
        this.$forceUpdate()
      })
    },
    getResourceChecked (resourceId, allocResource) {
      if (allocResource == null || allocResource.length === 0) return false
      let result = false
      for (let i = 0; i < allocResource.length; i++) {
        if (allocResource[i].resourceList) {
          allocResource[i].resourceList.forEach(item => {
            if (!result && item.id === resourceId && item.selected) {
              result = true
            }
          })
        }
      }

      return result
    },
    isIndeterminate (categoryId) {
      const cateResources = this.getResourceByCate(categoryId)
      if (cateResources == null) return false
      let checkedCount = 0
      for (let i = 0; i < cateResources.length; i++) {
        if (cateResources[i].selected === true) {
          checkedCount++
        }
      }
      return !(checkedCount === 0 || checkedCount === cateResources.length)
    },
    isAllChecked (categoryId) {
      const cateResources = this.getResourceByCate(categoryId)
      if (cateResources == null) return false
      let checkedCount = 0
      for (let i = 0; i < cateResources.length; i++) {
        if (cateResources[i].selected === true) {
          checkedCount++
        }
      }
      if (checkedCount === 0) {
        return false
      }
      return checkedCount === cateResources.length
    },
    handleSave () {
      this.$confirm('是否分配资源？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const checkedResourceIds = []
        if (this.allResource != null && this.allResource.length > 0) {
          this.allResource.forEach(item => {
            if (item.selected) {
              checkedResourceIds.push(item.id)
            }
          })
        }
        const params = {
          roleId: this.roleId,
          resourceIdList: checkedResourceIds
        }
        allocResource(params).then(response => {
          this.$message({
            message: '分配成功',
            type: 'success',
            duration: 1000
          })
          this.$router.back()
        })
      })
    },
    handleClear () {
      this.allResourceCate.forEach(item => {
        item.selected = false
      })
      this.allResource.forEach(item => {
        item.selected = false
      })
      this.$forceUpdate()
    },
    handleCheckAllChange (cate) {
      const cateResources = this.getResourceByCate(cate.id)
      for (let i = 0; i < cateResources.length; i++) {
        cateResources[i].selected = cate.selected
      }
      this.$forceUpdate()
    },
    handleCheckChange (resource) {
      this.allResourceCate.forEach(item => {
        if (item.id === resource.categoryId) {
          item.selected = this.isAllChecked(resource.categoryId)
        }
      })
      this.$forceUpdate()
    }
  }
}
</script>

<style scoped>
  .table-layout {
    padding: 20px;
    border-left: 1px solid #DCDFE6;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
  }

  .top-line {
    border-top: 1px solid #DCDFE6;
  }
</style>
