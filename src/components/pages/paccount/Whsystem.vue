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
            <el-table-column label="项目名称" prop="itemName" width="100px"></el-table-column>
            <el-table-column label="数据量" prop="cusNum" sortable width="100px"></el-table-column>
            <el-table-column label="下发量" prop="assignNum" sortable width="100px"></el-table-column>
            <el-table-column label="呼出量" prop="expiration" sortable width="100px"></el-table-column>
            <el-table-column label="拨打量" prop="dialNum" sortable width="100px"></el-table-column>
            <el-table-column label="呼通量" prop="flux" sortable width="100px"></el-table-column>
            <el-table-column label="成功量" prop="successNum" sortable width="100px"></el-table-column>
            <el-table-column label="成功率" prop="successRate" sortable width="100px" :formatter="formatWin"></el-table-column>
            <el-table-column label="失败量" prop="failNum" sortable width="100px"></el-table-column>
            <el-table-column label="失败率" prop="failRate" sortable width="100px" :formatter="formatfail"></el-table-column>
            <el-table-column label="再呼次数" prop="againNum" sortable width="100px" :formatter="formatagainNum"></el-table-column>
            <el-table-column label="再呼率" prop="againRate" sortable width="100px" :formatter="formatagainRate"></el-table-column>
            <el-table-column label="总时长" prop="duration" sortable width="100px"></el-table-column>
            <el-table-column label="计费时长" prop="charging" sortable width="100px"></el-table-column>
            <el-table-column label="详情"  width="100px">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="handleKb(scope.$index,scope.row)">看板</el-button>
                    <el-button type="text" size="mini" @click="handleXq(scope.$index,scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        </div>

        <el-dialog title="房产教育" :visible.sync="boardDialog" center width="90%">
            <v-board :childData="childData" :seatList="seatList" :myRow="myRow" v-if="childData.length > 0"></v-board>
        </el-dialog>
        <div class="fpage">
            <el-pagination class="pagebutton" background @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="400">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import vBoard from '../../common/Board.vue'
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'
    export default {
        data(){
            return {
                boardDialog:false,
                myData:{
                    name:'',
                    num:'',
                    time:''
                },
                win:null,
                value:'',
                createtime:'',
                tableData:[],
                rowData:'',
                currentPage:1,
                pagesize:10,
                selectList:[],
                childData:[],
                seatList:[],
                myRow:null,
            }
        },
        components:{
            vBoard
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
            //获取表格数据
            getTablelist(){
                let token=this.$cookieStore.getCookie('token')
                //console.log(token)
                this.$http.get(this.$api.callee.statistics,{params:{pageIndex:1,pageSize:5,token:token}}).then(res => {
                    if(res.data.code === 0){
                        console.log(res.data)
                        this.tableData=res.data.list
                    }else{
                        this.$message.error(res.data.message)
                    }
                }).catch((e)=>{
                    console.log(e)
                })
            },
            formatWin(row,column){
                let successRate=row[column.property]
                successRate=row.successNum/row.cusNum
                if(!row.cusNum){
                    return '--'
                }else{
                    return successRate
                }
            },
            formatfail(row,column){
                let failRate=row[column.property]
                failRate=row.failNum/row.cusNum
                if(!row.cusNum){
                    return '--'
                }else{
                    return failRate
                }
            },
            formatagainNum(row,column){
                let againNum=row[column.property]
                againNum=row.dialNum-row.expiration
                return againNum
            },
            formatagainRate(row,column){
                let againRate=row[column.property]
                againRate=(row.dialNum-row.expiration)/row.cusNum
                if(!row.cusNum){
                    return '--'
                }else{
                    return againRate
                }
            },
            handleKb(index,row){
                this.myRow=row
                let token=this.$cookieStore.getCookie('token')
                let id=row.id
                this.$http.get(this.$api.callee.statisticsDetail,{params:{pageIndex:1,pageSize:5,id:id,token:token}}).then(res => {
                    if(res.data.code === 0){
                        //console.log(res.data)
                        this.childData=res.data.data
                        this.seatList=res.data.seatList
                    }else{
                        this.$message.error(res.data.message)
                    }
                }).catch((e)=>{
                    console.log(e)
                })
                this.boardDialog=true
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
            this.getTablelist()
        },
        computed:{

        }
    }
</script>
<style scoped>
    .pagebutton {
        float:right
    }
    
</style>
