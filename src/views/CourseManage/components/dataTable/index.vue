<template>
<div>
  <el-table
    ref="multipleTable"
    :data="tableData"
    tooltip-effect="dark"
    style="width: 100%"
    stripe
    @selection-change="handleSelectionChange"
    v-loading="listLoading"
    >
    <el-table-column
    align = 'center'
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
    show-overflow-tooltip
    align = 'center'
      label="文件名称"
      width="120">
      <template slot-scope="scope">{{ scope.row.fileName }}</template>
    </el-table-column>
    <el-table-column
      prop="fileType"
      label="文件类型"
      align = 'center'
      sortable
      width="100">
    </el-table-column>
    <el-table-column
      prop="fileTime"
      label="音频时长(s)"
      align = 'center'
      sortable
       width="120"> 
       
    </el-table-column>
    <el-table-column
      prop="filePath"
      label="文件路径"
      align = 'center'
      show-overflow-tooltip
       width="140">
    </el-table-column>
     <el-table-column
      prop="fileSize"
      label="文件大小(kb)"
      align = 'center'
      sortable
       width="140">
    </el-table-column>
     <el-table-column
      prop="lastAccessedTime"
      align = 'center'
      label="创建时间"
      sortable
       show-overflow-tooltip
       width="200">
    </el-table-column>
     <el-table-column
      prop="lastModifiedTime"
      align = 'center'
      label="最近修改时间"
      sortable
       show-overflow-tooltip
       width="200">
    </el-table-column>
     <el-table-column
      prop="fileBool"
      label="是否是鼾声"
      align = 'center'
      show-overflow-tooltip
      width="120">
    </el-table-column>

     <el-table-column
      label="操作"
      align = 'center'
       min-width="320">
       <template>
           <el-button type="success" size='mini' icon="el-icon-view" >预览</el-button>
           <el-button type="warning" size='mini'  icon="el-icon-download" >下载</el-button>
           <el-button type="primary" size='mini' icon="el-icon-edit">编辑</el-button>
           <el-button type="danger" size='mini' icon="el-icon-delete">删除</el-button>
       </template>

    </el-table-column>
  </el-table>
<!-- 
  <div style="margin-top: 20px">
    <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button>
    <el-button @click="toggleSelection()">取消选择</el-button>
  </div> -->
  <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.current"
        :page-size="listQuery.size"
        :page-sizes="[10,15,20]"
        :total="total">
      </el-pagination>
    </div>

</div>
</template>

<script>
import { getQueryCourses } from '@/services/course'
  export default {
    data() {
      return {
        tableData: [],
        multipleSelection: [],
        listQuery:{
            current: 1,
            size: 10
        },
        listLoading: true,
        total: ''
      }
    },
    created(){
        this.getData()
    },
    methods: {
        getData(){
            getQueryCourses(this.listQuery).then(res=>{
                this.listLoading = true
                console.log(res.content.records)
                // var {fileName, filePath, fileSize, fileTime, fileType , lastAccessedTime, lastModifiedTime,fileBool} = res.content.records
                this.tableData = res.content.records
                this.total = res.content.total

                setTimeout(() => {
                    this.listLoading = false
                }, 0.25*1000);
                

                // console.log(this.tableData)
            })
        },
    //   toggleSelection(rows) {
    //     if (rows) {
    //       rows.forEach(row => {
    //         this.$refs.multipleTable.toggleRowSelection(row);
    //       });
    //     } else {
    //       this.$refs.multipleTable.clearSelection();
    //     }
    //   },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSizeChange(val){
          this.listQuery.size = val
          this.getData()
      },
      handleCurrentChange(val){
          this.listQuery.current = val
          this.getData()
      }
    }
  }
</script>

<style  scoped>
.pagination-container{
    margin-top: 20px;
}
</style>