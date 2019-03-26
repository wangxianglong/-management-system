<template>
    <div>
        <el-form :inline="true" class="form-inline" v-model="myData">
            <el-form-item label="项目名称:">
                <el-input placeholder="请输入用户名" v-model="myData.name"></el-input>
            </el-form-item>
            <el-form-item label="创建时间：">
                <el-date-picker class='dateInput' v-model="myData.time" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' style="margin-left:50px;" @click="gosearch">搜索</el-button>
            </el-form-item>
        </el-form>
        <div class="small-divider"></div>
        <div style="padding:17px 0 17px 20px"><el-button type="primary" @click="outExe">导出</el-button></div>
        <div class="divider"></div>
        <!--table表格-->
        <div class="table-box">
        <el-table id="out-table" :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width:2000px;padding:10px;" show-header @selection-change="changeFun">
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index" label="序号" :index="indexMethod" align="center" width="70px"></el-table-column>
            <el-table-column label="项目名称" prop="name" width="100px"></el-table-column>
            <el-table-column label="数据量" prop="num" sortable width="100px"></el-table-column>
            <el-table-column label="下发量" prop="xfnum" sortable width="100px"></el-table-column>
            <el-table-column label="呼出量" prop="hcnum" sortable width="100px"></el-table-column>
            <el-table-column label="拨打量" prop="bdnum" sortable width="100px"></el-table-column>
            <el-table-column label="呼通量" prop="htnum" sortable width="100px"></el-table-column>
            <el-table-column label="成功量" prop="cgnum" sortable width="100px"></el-table-column>
            <el-table-column label="成功率" prop="win" sortable width="100px"></el-table-column>
            <el-table-column label="失败量" prop="sbnum" sortable width="100px"></el-table-column>
            <el-table-column label="失败率" prop="failure" sortable width="100px"></el-table-column>
            <el-table-column label="再呼次数" prop="againnum" sortable width="100px"></el-table-column>
            <el-table-column label="再呼率" prop="againx" sortable width="100px"></el-table-column>
            <el-table-column label="总时长" prop="ztotal" sortable width="100px"></el-table-column>
            <el-table-column label="计费时长" prop="timetotal" sortable width="100px"></el-table-column>
            <el-table-column label="详情"  width="100px">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="handleKb(scope.$index,scope.row)">看板</el-button>
                    <el-button type="text" size="mini" @click="handleXq(scope.$index,scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        </div>
        <div class="fpage">
            <el-pagination class="pagebutton" background @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="400">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'
    export default {
        data(){
            return {
                myData:{
                    name:'',
                    num:'',
                    time:''
                },
                value:'',
                createtime:'',
                tableData:[{
                    name:'aa',
                    num:234,
                    xfnum:23,
                    hcnum:333,
                    bdnum:4556,
                    htnum:455,
                    cgnum:34545,
                    win:'50%',
                    sbnum:356,
                    failure:"30%",
                    againnum:35456,
                    againx:333,
                    ztotal:100000,
                    timetotal:"00:00:00"
                },{
                    name:'aa',
                    num:234,
                    xfnum:23,
                    hcnum:333,
                    bdnum:4556,
                    htnum:455,
                    cgnum:34545,
                    win:'50%',
                    sbnum:356,
                    failure:"30%",
                    againnum:35456,
                    againx:333,
                    ztotal:100000,
                    timetotal:"00:00:00"
                },{
                    name:'aa',
                    num:234,
                    xfnum:23,
                    hcnum:333,
                    bdnum:4556,
                    htnum:455,
                    cgnum:34545,
                    win:'50%',
                    sbnum:356,
                    failure:"30%",
                    againnum:35456,
                    againx:333,
                    ztotal:100000,
                    timetotal:"00:00:00"
                },{
                    name:'aa',
                    num:234,
                    xfnum:23,
                    hcnum:333,
                    bdnum:4556,
                    htnum:455,
                    cgnum:34545,
                    win:'50%',
                    sbnum:356,
                    failure:"30%",
                    againnum:35456,
                    againx:333,
                    ztotal:100000,
                    timetotal:"00:00:00"
                },{
                    name:'aa',
                    num:234,
                    xfnum:23,
                    hcnum:333,
                    bdnum:4556,
                    htnum:455,
                    cgnum:34545,
                    win:'50%',
                    sbnum:356,
                    failure:"30%",
                    againnum:35456,
                    againx:333,
                    ztotal:100000,
                    timetotal:"00:00:00"
                },{
                    name:'aa',
                    num:234,
                    xfnum:23,
                    hcnum:333,
                    bdnum:4556,
                    htnum:455,
                    cgnum:34545,
                    win:'50%',
                    sbnum:356,
                    failure:"30%",
                    againnum:35456,
                    againx:333,
                    ztotal:100000,
                    timetotal:"00:00:00"
                },{
                    name:'aa',
                    num:234,
                    xfnum:23,
                    hcnum:333,
                    bdnum:4556,
                    htnum:455,
                    cgnum:34545,
                    win:'50%',
                    sbnum:356,
                    failure:"30%",
                    againnum:35456,
                    againx:333,
                    ztotal:100000,
                    timetotal:"00:00:00"
                },{
                    name:'aa',
                    num:234,
                    xfnum:23,
                    hcnum:333,
                    bdnum:4556,
                    htnum:455,
                    cgnum:34545,
                    win:'50%',
                    sbnum:356,
                    failure:"30%",
                    againnum:35456,
                    againx:333,
                    ztotal:100000,
                    timetotal:"00:00:00"
                },{
                    name:'aa',
                    num:234,
                    xfnum:23,
                    hcnum:333,
                    bdnum:4556,
                    htnum:455,
                    cgnum:34545,
                    win:'50%',
                    sbnum:356,
                    failure:"30%",
                    againnum:35456,
                    againx:333,
                    ztotal:100000,
                    timetotal:"00:00:00"
                },{
                    name:'aa',
                    num:234,
                    xfnum:23,
                    hcnum:333,
                    bdnum:4556,
                    htnum:455,
                    cgnum:34545,
                    win:'50%',
                    sbnum:356,
                    failure:"30%",
                    againnum:35456,
                    againx:333,
                    ztotal:100000,
                    timetotal:"00:00:00"
                },{
                    name:'aa',
                    num:234,
                    xfnum:23,
                    hcnum:333,
                    bdnum:4556,
                    htnum:455,
                    cgnum:34545,
                    win:'50%',
                    sbnum:356,
                    failure:"30%",
                    againnum:35456,
                    againx:333,
                    ztotal:100000,
                    timetotal:"00:00:00"
                },{
                    name:'aa',
                    num:234,
                    xfnum:23,
                    hcnum:333,
                    bdnum:4556,
                    htnum:455,
                    cgnum:34545,
                    win:'50%',
                    sbnum:356,
                    failure:"30%",
                    againnum:35456,
                    againx:333,
                    ztotal:100000,
                    timetotal:"00:00:00"
                }],
                rowData:'',
                currentPage:1,
                pagesize:10,
                selectList:[]
            }
        },
        methods:{
            gosearch(){
                //this.searchList=this.tableData
            },
            indexMethod(index) {
                return index+1;
            },
            handleCurrentChange(currentPage) {
                this.currentPage =currentPage;
            },
            handleKb(index,row){
                console.log("kanban")
            },
            handleXq(index,row){
                console.log("x详情")
                this.$router.push({name:'whdetail',params:{userId:'wish'}})
            },
            //表格选中事件
            changeFun(val){
                this.selectList=val
                console.log(this.selectList)
            }, 
            //导出
            outExe() {
                this.$confirm('此操作将导出excel文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.excelData = this.selectList //你要导出的数据list。
                    this.export2Excel()
                }).catch(() => {

                });
            },
            export2Excel() {
                require.ensure([], () => {
                    const {export_json_to_excel} = require('@/vendor/Export2Excel');
                    const tHeader = ['项目名称','数据量', '下发量','呼出量','拨打量','呼通量','成功量','失败量','失败率','再呼次数','再呼率','总时长','计费时长'];
                    const filterVal = ['name', 'num', 'xfnum','hcnum','bdnum','htnum','cgnum','win','sbnum','failure','againnum','againx','ztotal','timetotal'];
                    const list = this.excelData;
                    const data = this.formatJson(filterVal, list);
                    export_json_to_excel(tHeader, data, '外呼统计');
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },
        },
        created(){
            
        }
    }
</script>
<style scoped>
    .pagebutton {
        float:right
    }
    
</style>
