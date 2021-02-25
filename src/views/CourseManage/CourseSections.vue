<template>
  <section class="course-sections">
    <div class="header">
      <el-page-header @back="() => this.$router.back()" :content="course.courseName"/>
      <el-button type="primary" icon="el-icon-plus" @click="handleShowAddSection">添加阶段</el-button>
    </div>
    <el-tree :data="sections" :props="treeProps" draggable :allow-drop="allowDrop" @node-drop="handleSort" v-loading="loading" element-loading-text="数据加载中...">
      <div class="inner" slot-scope="{ data, node }">
        <span>{{ node.label }}</span>
        <!-- section -->
        <span class="actions" v-if="data.sectionName">
          <el-button size="small" @click.stop="handleEditSection(data)">编辑</el-button>
          <el-button size="small" type="primary" @click.stop="handleShowAddLesson(data)">添加课时</el-button>
          <el-button size="small" @click.stop="handleShowToggleStatus(data)">{{ statusMapping[data.status] }}</el-button>
        </span>
        <!-- lesson -->
        <span class="actions" v-else>
          <el-button size="small" @click.stop="handleEditLesson(data, node.parent.data)">编辑</el-button>
          <!-- TODO: 上传视频 -->
          <el-button size="small" type="success" @click="uploadVedio(data)">上传视频</el-button>
          <el-button size="small" @click.stop="handleShowToggleStatus(data)">{{ statusMapping[data.status] }}</el-button>
        </span>
      </div>
    </el-tree>
    <el-dialog  class="toggle-dialog" title="提示" :visible.sync="showToggleStatusForm" width="30%">
      <header class="toggle-header">
        <i class="el-icon-info"></i>
        <span>当前状态：{{ toggleStatusForm.data && statusMapping[toggleStatusForm.data.status] }}</span>
      </header>
      <el-form label-position="right" label-width="110px" :model="toggleStatusForm">
        <el-form-item label="状态变更为：">
          <el-select v-model="toggleStatusForm.status" style="width: 100%">
            <el-option v-for="item in Object.keys(statusMapping)" :key="item" :label="statusMapping[item]" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showToggleStatusForm = false">取 消</el-button>
        <el-button type="primary" @click="handleToggleStatus">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog class="add-dialog" title="章节信息" :visible.sync="showAddSection">
      <el-form label-position="right" label-width="80px" ref="addSectionForm" :model="addSectionForm" :rules="addSectionFormRules">
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="addSectionForm.courseName" disabled></el-input>
        </el-form-item>
        <el-form-item label="章节名称" prop="sectionName">
          <el-input v-model="addSectionForm.sectionName"></el-input>
        </el-form-item>
        <el-form-item label="章节描述" prop="description">
          <el-input type="textarea" v-model="addSectionForm.description"></el-input>
        </el-form-item>
        <el-form-item label="章节排序" prop="orderNum">
          <el-input v-model="addSectionForm.orderNum" type="number">
            <template slot="append">数字控制排序，数字越大越靠后</template>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddSection = false">取 消</el-button>
        <el-button type="primary" @click="handleAddSection">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog class="add-dialog" title="课时基本信息" :visible.sync="showAddLesson">
      <el-form label-position="right" label-width="110px" ref="addLessonForm" :model="addLessonForm" :rules="addLessonFormRules">
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="addLessonForm.courseName" disabled></el-input>
        </el-form-item>
        <el-form-item label="章节名称" prop="sectionName">
          <el-input v-model="addLessonForm.sectionName" disabled></el-input>
        </el-form-item>
        <el-form-item label="课时名称" prop="theme">
          <el-input v-model="addLessonForm.theme"></el-input>
        </el-form-item>
        <el-form-item label="时长" prop="duration">
          <el-input v-model="addLessonForm.duration" type="number">
            <template slot="append">分钟</template>
          </el-input>
        </el-form-item>
        <el-form-item label="是否开放试听" prop="isFree">
          <el-switch v-model="addLessonForm.isFree"></el-switch>
        </el-form-item>
        <el-form-item label="课时排序" prop="orderNum">
          <el-input v-model="addLessonForm.orderNum" type="number">
            <template slot="append">数字控制排序，数字越大越靠后</template>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddLesson = false">取 消</el-button>
        <el-button type="primary" @click="handleAddLesson">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
export default {
  name: 'CourseSections',
  title: '课程结构',
  data () {
    const treeProps = {
      label: item => {
        return item.sectionName || item.theme
      },
      children: 'lessonDTOS'
    }
    const allowDrop = (drag, drop, type) => {
      return drag.data.sectionId === drop.data.sectionId && type !== 'inner'
    }

    const statusMapping = {
      0: '已隐藏',
      1: '待更新',
      2: '已更新'
    }

    const toggleStatusForm = {
      status: 0
    }

    const addSectionForm = {
      courseId: undefined,
      courseName: '',
      sectionName: '',
      description: '',
      orderNum: 0
    }

    const addSectionFormRules = {
      courseName: [
        { required: true, message: '请输入课程名称', trigger: 'blur' },
        { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
      ],
      sectionName: [
        { required: true, message: '请输入章节名称', trigger: 'blur' },
        { min: 3, max: 40, message: '长度在 3 到 40 个字符', trigger: 'blur' }
      ],
      description: [
        { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
      ],
      orderNum: []
    }

    const addLessonForm = {
      courseId: undefined,
      courseName: '',
      sectionId: undefined,
      sectionName: '',
      theme: '',
      duration: undefined,
      isFree: false,
      orderNum: 0
    }

    const addLessonFormRules = {
      courseName: [
        { required: true, message: '请输入课程名称', trigger: 'blur' },
        { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
      ],
      sectionName: [
        { required: true, message: '请输入章节名称', trigger: 'blur' },
        { min: 3, max: 40, message: '长度在 3 到 40 个字符', trigger: 'blur' }
      ],
      theme: [
        { required: true, message: '请输入课时名称', trigger: 'blur' },
        { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
      ],
      duration: [
        { required: true, message: '请输入课时时长', trigger: 'blur' }
      ],
      isFree: [
        { required: true, trigger: 'blur' }
      ],
      orderNum: []
    }

    return {
      course: {},
      sections: [],
      treeProps,
      allowDrop,
      statusMapping,
      toggleStatusForm,
      showToggleStatusForm: false,
      addSectionForm,
      addSectionFormRules,
      showAddSection: false,
      addLessonForm,
      addLessonFormRules,
      showAddLesson: false,
      loading: false
    }
  },
  created () {
    this.$breadcrumbs = [{ name: 'Courses', text: '课程管理' }, { text: '课程结构' }]
    const id = this.$route.params.courseId
    if (!id) return this.redirectToError()

    this.loading = true
    Promise.all([
      this.loadCourse(id),
      this.loadSections(id)
    ]).then(() => {
      this.loading = false
    }).catch(() => {
      this.redirectToError()
      this.loading = false
    })
  },
  methods: {
    uploadVedio (data) {
      this.$services.course.getCourseById(data.courseId)
        .then(course => {
          this.$router.push({ name: 'VideoOptions', params: { courseId: data.courseId, courseName: course.courseName, lessonId: data.id, lessonName: data.theme } })
        })
    },
    loadCourse (id) {
      return this.$services.course.getCourseById(id)
        .then(data => {
          this.course = data
          this.addSectionForm.courseId = data.id
          this.addSectionForm.courseName = data.courseName
          this.addLessonForm.courseId = data.id
          this.addLessonForm.courseName = data.courseName
        })
    },
    loadSections (courseId) {
      return this.$services.section.getSectionAndLesson(courseId)
        .then(data => {
          this.sections = data
          this.loading = false
        })
    },
    handleSort (drag, drop, type, event) {
      const isSection = typeof drag.data.lessonDTOS !== 'undefined'
      Promise.all(drop.parent.childNodes.map((item, i) => {
        if (isSection) {
          return this.$services.section.saveOrUpdateSection({ id: item.data.id, orderNum: i })
        }
        return this.$services.lesson.saveOrUpdate({ id: item.data.id, orderNum: i })
      })).then(() => {
        this.$message({ message: '排序成功' })
      })
    },
    handleShowToggleStatus (data) {
      this.toggleStatusForm.id = data.id
      this.toggleStatusForm.status = data.status.toString()
      this.toggleStatusForm.data = data
      this.showToggleStatusForm = true
    },
    handleToggleStatus () {
      if (this.toggleStatusForm.data.sectionName) {
        // update section status
        this.$services.section.saveOrUpdateSection(this.toggleStatusForm)
          .then(() => {
            this.toggleStatusForm.data.status = this.toggleStatusForm.status
            this.toggleStatusForm = {}
            this.showToggleStatusForm = false
          })
      } else {
        // update lesson status
        this.$services.lesson.saveOrUpdate(this.toggleStatusForm)
          .then(() => {
            this.toggleStatusForm.data.status = this.toggleStatusForm.status
            this.toggleStatusForm = {}
            this.showToggleStatusForm = false
          })
      }
    },
    handleShowAddSection () {
      this.addSectionForm = {
        courseId: this.addSectionForm.courseId,
        courseName: this.addSectionForm.courseName
      }
      this.showAddSection = true
    },
    handleAddSection () {
      this.$refs.addSectionForm.validate(valid => {
        if (!valid) return false
        this.$services.section.saveOrUpdateSection(this.addSectionForm)
          .then(data => {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.showAddSection = false
            return this.loadSections(this.addSectionForm.courseId)
          })
          .then(() => {
            // reset form
            this.addSectionForm.sectionName = ''
            this.addSectionForm.description = ''
            this.addSectionForm.orderNum = 0
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err.message
            })
          })
      })
    },
    handleEditSection (section) {
      this.addSectionForm = Object.assign(this.addSectionForm, section)
      this.showAddSection = true
    },
    handleShowAddLesson (section) {
      this.addLessonForm.sectionId = section.id
      this.addLessonForm.sectionName = section.sectionName
      this.showAddLesson = true
    },
    handleAddLesson () {
      this.$refs.addLessonForm.validate(valid => {
        if (!valid) return false
        this.$services.lesson.saveOrUpdate(this.addLessonForm)
          .then(data => {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.showAddLesson = false
            return this.loadSections(this.addLessonForm.courseId)
          })
          .then(() => {
            // reset form
            this.addLessonForm.theme = ''
            this.addLessonForm.duration = undefined
            this.addLessonForm.isFree = false
            this.addLessonForm.orderNum = 0
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err.message
            })
          })
      })
    },
    handleEditLesson (lesson, section) {
      this.addLessonForm = Object.assign(this.addLessonForm, lesson)
      this.addLessonForm.sectionName = section.sectionName
      this.showAddLesson = true
    },
    redirectToError () {
      // TODO: Error components
      this.$router.replace({ path: '/not-found' })
    }
  }
}
</script>

<style lang="scss">
@import '../../theme';

.course-sections {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .el-tree {
    margin-top: 20px;
  }

  .el-tree, .el-tree__empty-block {
    min-height: 80vh;
  }

  .el-tree-node__content {
    height: auto;
  }

  .el-tree-node__expand-icon {
    padding: 15px;
    font-size: 20px;
  }

  .inner {
    display: flex;
    flex: 1 0 0;
    align-items: center;
    box-sizing: border-box;
    padding: 9px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  .el-tree-node__children {
    background-color: lighten($body-bg, 5);

    .el-tree-node__expand-icon {
      padding: 12px;
    }

    .inner {
      padding-top: 6px;
      padding-bottom: 6px;
    }
  }

  .actions {
    margin-left: auto;
  }

  .add-dialog {
    .el-form {
      width: 90%;
      max-width: 660px;
      margin: 0 auto;
    }
  }

  .toggle-header {
    margin-bottom: 20px;
    text-align: center;

    i {
      display: block;
      margin-bottom: 20px;
      font-size: 50px;
    }

    span {
      display: block;
      font-size: 20px;
    }
  }
}
</style>
