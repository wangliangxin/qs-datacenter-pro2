<template>
  <div class="image-div">
    <el-upload
      class="upload-demo"
      :action="uploadAction"
      :multiple="false"
      :limit="1"
      :before-upload="beforeUpload"
      :on-success="uploadSuccess"
      :on-remove="removeSuccess"
      :on-exceed="exceedFile"
      :file-list="fileList"
      list-type="picture-card">
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    <el-tag type="info" v-if="tipInfo">{{tipInfo}}</el-tag>
  </div>
</template>
<script>
export default {
  name: 'ClassImage',
  data () {
    return {
      uploadAction: process.env.VUE_APP_API_BASE + '/course/upload',
      fileList: []
    }
  },
  props: ['content', 'getUrls', 'max', 'tipInfo'],
  mounted () {
    // this && this.initImage()
  },
  watch: {
    content: {
      handler: function (val, oldval) {
        this.initImage(val)
      },
      deep: true// 对象内部的属性监听，也叫深度监听
    }
  },
  methods: {
    initImage (url) {
      if (this.content && this.content.length > 0) {
        this.fileList = [
          {
            name: 'image',
            url: this.content
          }
        ]
      } else {
        this.fileList = []
      }
    },
    beforeUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'

      if (!(isJPG || isPNG)) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!')
        return false
      }

      let Max = `${this.max}`
      Max = Max.toUpperCase()
      if (Max && Max.indexOf('K') >= 0) {
        const isLt = file.size / 1024 < parseInt(Max.replace('K', ''))
        if (!isLt) {
          this.$message.error('上传图片大小不能超过 ' + Max + '!')
          return false
        }
      } else if (Max && Max.indexOf('M') >= 0) {
        const isLt = file.size / 1024 / 1024 < parseInt(Max.replace('M', ''))
        if (!isLt) {
          this.$message.error('上传图片大小不能超过 ' + Max + '!')
          return false
        }
      }
      return true
    },
    uploadSuccess (res, file) {
      // this.fileList.push({
      //     name: file.name,
      //     url: res.content
      // });
      this.content = [res.data]
      this.returnUrlArr()
    },
    removeSuccess (file) {
      // let removeIndex = null;
      // this.fileList.map( (item, index) => {
      //     if (item.name === file.name) {
      //         removeIndex = index
      //     }
      // })

      // this.fileList.splice(removeIndex, 1);
      this.content = []

      this.returnUrlArr()
    },
    exceedFile () {
      this.$message.error('每个板块只能上传一张图片！请先移除图片再上传')
    },
    returnUrlArr () {
      // this.urls = this.fileList.map(item => {
      //     return item.url
      // });

      this.getUrls(this.content)
    }

  }
}
</script>
<style>
  .image-div {
    .el-tag--info {
      margin-top: 10px;
    }
  }
</style>
