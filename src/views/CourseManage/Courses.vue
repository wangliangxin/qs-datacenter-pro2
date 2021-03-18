<!--  -->
<template>
  <div>
    <el-row class="filterForm">
        <el-col>
           <filter-form></filter-form>
        </el-col>
    </el-row>
  
    <el-row class="dataTable">
        <data-table></data-table>
    </el-row>
  </div>
</template>

<script>
import filterForm from './components/FilterForm'
import dataTable  from './components/dataTable'
export default {
  data () {
    return {
    };
  },
  components: {
    filterForm,
    dataTable
  },
  computed: {},
  methods: {}
}

</script>
<style  scoped>
.filterForm{
  background-color: #fff;
  padding: 30px;
  margin-bottom: 10px;
}
.dataTable{
   background-color: #fff;
  padding: 30px;
  margin-bottom: 10px;
}
</style>