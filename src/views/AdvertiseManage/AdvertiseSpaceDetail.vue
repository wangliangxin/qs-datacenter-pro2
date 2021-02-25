<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="homeAdvertise"
             :rules="rules"
             ref="homeAdvertiseFrom"
             label-width="150px"
             size="small">
      <el-form-item label="广告位名称：" prop="name">
        <el-input v-model="homeAdvertise.name" class="input-width"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('homeAdvertiseFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('homeAdvertiseFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
// import SingleUpload from '@/components/Upload/singleUpload'
import { saveOrUpdateAdvertiseSpace, getAdvertiseSpace } from '@/services/homeAdvertise'
const defaultHomeAdvertise = {
  name: null
}
export default {
  name: 'HomeAdvertiseDetail',
  // components: { SingleUpload },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      homeAdvertise: null,
      rules: {
        name: [
          { required: true, message: '请输入广告名称', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    if (this.isEdit) {
      getAdvertiseSpace(this.$route.query.id).then(response => {
        this.homeAdvertise = response.content
      })
    } else {
      this.homeAdvertise = Object.assign({}, defaultHomeAdvertise)
    }
  },
  methods: {
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              saveOrUpdateAdvertiseSpace(this.homeAdvertise).then(response => {
                this.$refs[formName].resetFields()
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                })
                this.$router.back()
              })
            } else {
              saveOrUpdateAdvertiseSpace(this.homeAdvertise).then(response => {
                this.$refs[formName].resetFields()
                this.homeAdvertise = Object.assign({}, defaultHomeAdvertise)
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
      this.homeAdvertise = Object.assign({}, defaultHomeAdvertise)
    }
  }
}
</script>
<style scoped>
  .input-width {
    width: 70%;
  }
</style>
