<template>
  <section class="course-item">
    <div class="header">
      <el-page-header @back="() => this.$router.back()" :content="pathTitle"/>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </div>
    <el-form ref="form" :model="course" :rules="rules" label-width="140px">
      <el-card shadow="never" v-loading="loading" element-loading-text="数据加载中...">
        <header slot="header">基本信息</header>
        <el-form-item label="名称" prop="courseName">
          <el-input v-model="course.courseName" type="text" maxlength="50" show-word-limit/>
        </el-form-item>
        <el-form-item label="简介" prop="brief">
          <el-input v-model="course.brief" type="text" maxlength="100" show-word-limit/>
        </el-form-item>
        <el-form-item label="讲师姓名" prop="teacherDTO.teacherName">
          <el-input v-model="course.teacherDTO.teacherName" type="text" maxlength="50" show-word-limit/>
        </el-form-item>
        <el-form-item label="职位" prop="teacherDTO.position">
          <el-input v-model="course.teacherDTO.position" type="text" maxlength="50" show-word-limit/>
        </el-form-item>
        <el-form-item label="讲师简介" prop="teacherDTO.description">
          <el-input v-model="course.teacherDTO.description" type="text" maxlength="100" show-word-limit/>
        </el-form-item>
        <el-form-item label="课程概述" prop="previewFirstField" class="form-control-summary">
          <el-input v-model="course.previewFirstField" type="text" maxlength="20" show-word-limit/>
          <el-input v-model="course.previewSecondField" prop="previewSecondField" type="text" maxlength="20"
                    show-word-limit/>
        </el-form-item>
        <el-form-item label="课程封面" prop="courseImgUrl">
          <course-image
            :content="course.courseImgUrl && [course.courseImgUrl]"
            :get-urls="getCourseImgUrl"
            ref="courseCoverRef"
            max="150K"
            tipInfo="建议尺寸：230*300px，JPG、PNG格式，图片小于150K"
          >
          </course-image>
        </el-form-item>
        <el-form-item label="解锁封面" prop="courseImgUrl">
          <course-image
            :content="course.courseListImg && [course.courseListImg]"
            :get-urls="getCourseListImg"
            ref="unlockCoverRef"
            max="150K"
            tipInfo="建议尺寸：750*422px，JPG、PNG格式，图片小于150K"
          >
          </course-image>
        </el-form-item>
        <el-form-item label="课程排序" prop="sortNum">
          <el-input v-model="course.sortNum" type="number">
            <template slot="append">数字控制排序，数字越大越靠后</template>
          </el-input>
        </el-form-item>
      </el-card>

      <el-card shadow="never" v-loading="loading" element-loading-text="数据加载中...">
        <header slot="header">销售信息</header>
        <el-form-item label="售卖价格" prop="discounts" type="number">
          <el-input v-model="course.discounts">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品原价">
          <el-input v-model="course.price" type="number">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="销量">
          <el-input v-model="course.sales" type="number">
            <template slot="append">单</template>
          </el-input>
        </el-form-item>
        <el-form-item label="活动标签" prop="discountsTag">
          <el-input v-model="course.discountsTag" type="text" maxlength="4" show-word-limit/>
        </el-form-item>
      </el-card>
      <el-card shadow="never" v-loading="loading" element-loading-text="数据加载中...">
        <header slot="header">秒杀活动</header>
        <el-form-item label="限时秒杀开关" prop="acitivityCourse">
          <el-switch
            v-model="course.activityCourse"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item
          label="开始时间" prop="beginTime" type="number"
          v-if="course.activityCourse"
        >
          <el-date-picker
            v-model="course.activityCourseDTO.beginTime"
            type="datetime"
            placeholder="选择日期时间"
            default-time="12:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="结束时间" prop="endTime" type="number"
          v-if="course.activityCourse"
        >
          <el-date-picker
            v-model="course.activityCourseDTO.endTime"
            type="datetime"
            placeholder="选择日期时间"
            default-time="12:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="秒杀价"
          v-if="course.activityCourse"
        >
          <el-input v-model="course.activityCourseDTO.amount" type="number">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="秒杀库存"
          v-if="course.activityCourse"
        >
          <el-input v-model="course.activityCourseDTO.stock" type="number">
            <template slot="append">个</template>
          </el-input>
        </el-form-item>
      </el-card>
      <el-card shadow="never" v-loading="loading" element-loading-text="数据加载中...">
        <header slot="header">课程详情</header>
        <Editor
          ref="editorRef"
          uploadType="uploadFile"
          v-model="course.courseDescriptionMarkDown"
          :options="editorOptions"
          :visible="editorVisible"
          previewStyle="vertical"
          height="500px"
        />
      </el-card>

      <div class="actions">
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </el-form>
  </section>
</template>

<script>
import Editor from '@/components/markdown-editor/Editor.vue'

import CourseImage from '@/components/CourseImage.vue'

export default {
  name: 'CourseItem',
  title: '营销信息',
  components: { Editor, CourseImage },
  data () {
    // const form = {
    //   title: '',
    //   excerpt: '',
    //   teacher_name: '',
    //   teacher_title: '',
    //   summary1: '',
    //   summary2: '',
    //   price: '',
    //   original_price: '',
    //   tag: '',
    //   share_img: '',
    //   share_title: '',
    //   share_text: '',
    //   content: '',
    // }

    const rules = {
      courseName: [
        { required: true, message: '请输入课程名称', trigger: 'blur' },
        { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
      ],
      brief: [
        { required: true, message: '请输入课程简介', trigger: 'blur' },
        { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
      ],
      teacherDTO: {
        teacherName: [
          { required: true, message: '请输入讲师姓名', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        position: [
          { required: true, message: '请输入讲师职位', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入讲师简介', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ]
      },
      previewFirstField: [
        { required: true, message: '请输入课程概述', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
      ],
      previewSecondField: [
        { required: true, message: '请输入课程概述', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
      ],
      sortNum: [
        { required: true, message: '请输入课程排序', trigger: 'blur' }
      ],
      discounts: [
        { required: true, message: '请输入课程售价', trigger: 'blur' }
      ],
      discountsTag: [
        { min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur' }
      ]
    }

    return {
      pathTitle: '',
      rules,
      course: {
        brief: '',
        courseDescriptionMarkDown: '',
        courseImgUrl: '',
        courseListImg: '',
        courseName: '',
        discounts: '',
        discountsTag: '',
        id: '',
        previewFirstField: '',
        previewSecondField: '',
        price: '',
        priceTag: '',
        sales: '',
        sortNum: '',
        status: '',
        teacherDTO: {},
        activityCourse: false,
        activityCourseDTO: {}
      },
      editorOptions: {},
      editorHtml: '',
      editorVisible: true,
      loading: false
    }
  },
  created () {
    const id = this.$route.params.courseId
    if (!id) return this.redirectToError()
    if (id === 'new') {
      this.pathTitle = '新增课程'
      this.$breadcrumbs = [{ name: 'Courses', text: '课程管理' }, { text: '新增课程' }]
    } else {
      this.$breadcrumbs = [{ name: 'Courses', text: '课程管理' }, { text: '营销信息' }]
      this.loadCourse(id)
    }
  },
  methods: {
    loadCourse (id) {
      this.loading = true
      this.$services.course.getCourseById(id)
        .then(data => {
          this.pathTitle = data.courseName
          this.course = Object.assign(this.course, data)
          !this.course.activityCourseDTO && (this.course.activityCourseDTO = {})
          console.log(this.course)
          this.loading = false
        })
        .catch(() => {
          this.loading = false
          this.redirectToError()
        })
    },
    handleSave () {
      this.$refs.form.validate(valid => {
        if (!valid) return false
        this.$services.course.saveOrUpdateCourse(this.course)
          .then(data => {
            this.$router.back()
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err.message
            })
          })
      })
    },
    redirectToError () {
      // TODO: Error components
      this.$router.replace({ path: '/not-found' })
    },
    getCourseImgUrl (urls) {
      this.course.courseImgUrl = urls && urls[0].name
    },
    getCourseListImg (urls) {
      this.course.courseListImg = urls && urls[0].name
    }
  }
}
</script>

<style lang="scss">
  .course-item {
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .el-card {
      margin-top: 20px;
    }

    .form-control-summary {
      .el-form-item__content {
        display: flex;
        justify-content: space-between;

        .el-input {
          width: 49%;
        }

        &:before, &:after {
          display: none;
        }
      }
    }

    .actions {
      display: flex;
      justify-content: center;

      .el-button {
        margin: 40px 20px;
      }
    }
  }
</style>
