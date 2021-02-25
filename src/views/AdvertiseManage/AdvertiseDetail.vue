<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="homeAdvertise"
             :rules="rules"
             ref="homeAdvertiseFrom"
             label-width="150px"
             size="small">
      <el-form-item label="广告名称：" prop="name">
        <el-input v-model="homeAdvertise.name" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="广告位置：">
        <el-select v-model="homeAdvertise.spaceId">
          <el-option
            v-for="type in typeOptions"
            :key="type.value"
            :label="type.label"
            :value="type.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间：" prop="startTime">
        <el-date-picker
          type="datetime"
          placeholder="选择日期"
          v-model="homeAdvertise.startTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="到期时间：" prop="endTime">
        <el-date-picker
          type="datetime"
          placeholder="选择日期"
          v-model="homeAdvertise.endTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="上线/下线：">
        <el-radio-group v-model="homeAdvertise.status">
          <el-radio :label="0">下线</el-radio>
          <el-radio :label="1">上线</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="广告图片：">
        <course-image
          :content="homeAdvertise.img && [homeAdvertise.img]"
          :get-urls="getCourseImgUrl"
          ref="courseCoverRef"
          max="150K"
          tipInfo="建议尺寸：230*300px，JPG、PNG格式，图片小于150K"
        />
      </el-form-item>
      <el-form-item label="广告链接：" prop="link">
        <el-input v-model="homeAdvertise.link" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="广告备注：">
        <el-input
          class="input-width"
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="homeAdvertise.text">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('homeAdvertiseFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('homeAdvertiseFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import CourseImage from '@/components/CourseImage.vue'
import { saveOrUpdateAdvertise, getAdvertise, fetchADSpaceList } from '@/services/homeAdvertise'

const defaultHomeAdvertise = {
  name: null,
  spaceId: '',
  img: null,
  startTime: null,
  endTime: null,
  status: 0,
  link: null,
  text: null,
  sort: 0
}
export default {
  name: 'HomeAdvertiseDetail',
  components: { CourseImage },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      homeAdvertise: {},
      rules: {
        name: [
          { required: true, message: '请输入广告名称', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
        ],
        link: [
          { required: true, message: '请输入广告链接', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择开始时间', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '请选择到期时间', trigger: 'blur' }
        ],
        img: [
          { required: true, message: '请选择广告图片', trigger: 'blur' }
        ]
      },
      typeOptions: []
    }
  },
  created () {
    if (this.isEdit) {
      getAdvertise(this.$route.query.id).then(response => {
        this.homeAdvertise = response.content
      })
    } else {
      this.homeAdvertise = Object.assign({}, defaultHomeAdvertise)
    }
    fetchADSpaceList(this.listQuery).then(response => {
      this.typeOptions = response.content.map(item => { return { value: item.id, label: item.name, name: item.name } })
    })
  },
  methods: {
    getCourseImgUrl (urls) {
      this.homeAdvertise.img = urls && urls[0].name
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
              saveOrUpdateAdvertise(this.homeAdvertise).then(response => {
                this.$refs[formName].resetFields()
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                })
                this.$router.back()
              })
            } else {
              saveOrUpdateAdvertise(this.homeAdvertise).then(response => {
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
