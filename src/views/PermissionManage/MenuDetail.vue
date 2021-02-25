<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="menu"
             :rules="rules"
             ref="menuFrom"
             label-width="150px">
      <el-form-item label="菜单名称：" prop="name">
        <el-input v-model="menu.name"></el-input>
      </el-form-item>
      <el-form-item label="菜单路径：" prop="href">
        <el-input v-model="menu.href"></el-input>
      </el-form-item>
      <el-form-item label="上级菜单：">
        <el-select v-model="menu.parentId"
                   placeholder="请选择菜单">
          <el-option
            v-for="item in selectMenuList"
            :key="item.id"
            :label="item.title"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述：" prop="description">
        <el-input v-model="menu.description"></el-input>
      </el-form-item>
      <el-form-item label="前端图标：" prop="icon">
        <el-input v-model="menu.icon" style="width: 80%"></el-input>
      </el-form-item>
      <el-form-item label="是否显示：">
        <el-radio-group v-model="menu.shown">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序：">
        <el-input v-model="menu.orderNum"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('menuFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('menuFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { fetchList, saveOrUpdate, getMenu } from '@/services/menu'

const defaultMenu = {
  description: '',
  parentId: -1,
  name: '',
  icon: '',
  shown: 0,
  orderNum: 0
}
export default {
  name: 'MenuDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      menu: Object.assign({}, defaultMenu),
      selectMenuList: [],
      rules: {
        description: [
          { required: true, message: '请输入菜单描述', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '请输入前端图标', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    getMenu(this.$route.query.id || -1).then(response => {
      if (this.isEdit) {
        this.menu = response.data.menuInfo
      } else {
        this.menu = Object.assign({}, defaultMenu)
      }
      this.selectMenuList = response.data.parentMenuList.map(item => {
        return { id: item.id, title: item.name }
      })
      this.selectMenuList.unshift({ id: -1, title: '无上级菜单' })
    })
  },
  methods: {
    getSelectMenuList () {
      fetchList(0, { pageSize: 100, pageNum: 1 }).then(response => {
        this.selectMenuList = response.data.list
        this.selectMenuList.unshift({ id: 0, title: '无上级菜单' })
      })
    },
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              saveOrUpdate(this.menu).then(response => {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                })
                this.$router.back()
              })
            } else {
              saveOrUpdate(this.menu).then(response => {
                this.$refs[formName].resetFields()
                this.resetForm(formName)
                this.$message({
                  message: '提交成功',
                  type: 'success',
                  duration: 1000
                })
                this.$router.back()
              })
            }
          })
        } else {
          this.$message({
            message: '验证失败',
            type: 'error',
            duration: 1000
          })
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.menu = Object.assign({}, defaultMenu)
      this.getSelectMenuList()
    }
  }
}
</script>

<style scoped>

</style>
