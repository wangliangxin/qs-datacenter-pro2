<template>
  <el-card class="form-container" shadow="never">
    <el-tree
      :data="menuTreeList"
      show-checkbox
      default-expand-all
      node-key="id"
      ref="tree"
      highlight-current
      :props="defaultProps">
    </el-tree>
    <div style="margin-top: 20px" align="center">
      <el-button type="primary" @click="handleSave()">保存</el-button>
      <el-button @click="handleClear()">清空</el-button>
    </div>

  </el-card>
</template>

<script>
import { fetchTreeList } from '@/services/menu'
import { listMenuByRole, allocMenu } from '@/services/role'

export default {
  name: 'allocMenu',
  title: '角色菜单管理',
  data () {
    return {
      menuTreeList: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      roleId: null
    }
  },
  created () {
    this.roleId = this.$route.query.roleId
    this.treeList()
    this.getRoleMenu(this.roleId)
  },
  methods: {
    treeList () {
      fetchTreeList().then(response => {
        this.menuTreeList = JSON.parse(JSON.stringify(response))
      })
    },
    getRoleMenu (roleId) {
      listMenuByRole(roleId).then(response => {
        this.$refs.tree.setCheckedKeys(response)
      })
    },
    handleSave () {
      const checkedNodes = this.$refs.tree.getCheckedNodes()
      const checkedMenuIds = []
      if (checkedNodes != null && checkedNodes.length > 0) {
        for (let i = 0; i < checkedNodes.length; i++) {
          const checkedNode = checkedNodes[i]
          checkedMenuIds.push(checkedNode.id)
          if (checkedNode.parentId !== -1 && checkedMenuIds.filter(item => checkedNode.parentId).length === 0) {
            checkedMenuIds.push(checkedNode.parentId)
          }
        }
      }
      this.$confirm('是否分配菜单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          roleId: this.roleId,
          menuIdList: checkedMenuIds
        }
        allocMenu(params).then(response => {
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
      this.$refs.tree.setCheckedKeys([])
    }
  }
}
</script>

<style scoped>

</style>
