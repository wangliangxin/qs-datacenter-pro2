<template>
  <div>
    <el-form
      ref="elForm"
      :model="formData"
      :rules="rules"
      size="medium"
      label-width="100px"
      label-position="left"
    >
      <el-row :gutter="15">
        <el-col :span="4">
          <el-form-item label="音频格式 :" prop="audioFormat">
            <el-select
              v-model="formData.audioFormat"
              placeholder="请选择音频格式"
              clearable
              :style="{ width: '100%' }"
            >
              <el-option
                v-for="(item, index) in audioFormatOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="15">
        <el-col :span="4">
          <el-form-item label="音频大小 :" prop="fileSizeMin">
            <el-input
              v-model="formData.fileSizeMin"
              placeholder="0"
              clearable
              :style="{ width: '100%' }"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="0.5" class="middle">
            {{ toSymbol }}    
        </el-col> 
        <el-col :span="2">
          <el-form-item label-width="0" prop="fileSizeMax">
            <el-input
              v-model="formData.fileSizeMax"
              clearable
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="0.5" class="middle">
            {{ SizeUnit }}    
        </el-col> 
      </el-row>
      <el-row :gutter="15">
        <el-col :span="4">
          <el-form-item label="音频时长 :" prop="fileTimeMin">
            <el-input
              v-model="formData.fileTimeMin"
              placeholder="0"
              clearable
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col>
         <el-col :span="0.5" class="middle">
            {{ toSymbol }}    
        </el-col> 
        <el-col :span="2">
          <el-form-item label-width="0" prop="fileTimeMax">
            <el-input
              v-model="formData.fileTimeMax"
              clearable
              :style="{ width: '100%' }"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="0.5" class="middle">
            {{ DurationUnit }}    
        </el-col> 
      </el-row>
      <el-row :gutter="15">
        <el-col :span="7">
          <el-form-item label="创建时间 :" prop="lastAccessedTime">
            <el-date-picker
              type="daterange"
              v-model="formData.lastAccessedTime"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :style="{ width: '100%' }"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              range-separator="至"
              clearable
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="15">
        <el-col :span="7">
          <el-form-item label="修改时间 :" prop="lastModifiedTime">
            <el-date-picker
              type="daterange"
              v-model="formData.lastModifiedTime"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :style="{ width: '100%' }"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              range-separator="至"
              clearable
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item size="large">
        <el-button type="primary" @click="submitForm" icon='el-icon-search'>搜索</el-button>
        <el-button @click="resetForm" icon="el-icon-refresh-right">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  components: {},
  props: [],
  data() {
    return {
      formData: {
        audioFormat: 'MP3',
        fileSizeMin: '',
        fileTimeMax: '',
        fileTimeMin: '',
        fileTimeMax: '',
        lastAccessedTime: '',
        lastModifiedTime: '',
      },
      rules: {
        audioFormat: [],
        fileSizeMin: [],
        fileTimeMax: [],
        fileTimeMin: [],
        fileTimeMax: [],
        lastAccessedTime: [],
        lastModifiedTime: [],
      },
      audioFormatOptions: [
        {
          label: "MP3",
          value: 'MP3',
        },
        {
          label: "MP4",
          value: 'MP4',
        },
      ],
      toSymbol: '~',
      SizeUnit: 'kb',
      DurationUnit: 's'
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    submitForm() {
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return ;
        console.log(this.formData)
      });
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
    },
  },
};
</script>
<style scoped>
.middle{
    line-height: 36px;
}
</style>
