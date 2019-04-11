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
        <el-table id="out-table" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width:2000px;padding:10px;" show-header @selection-change="changeFun">
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index" label="序号" :index="indexMethod" align="center" width="70px"></el-table-column>
            <el-table-column label="项目名称" prop="itemName" width="100px"></el-table-column>
            <el-table-column label="数据量" prop="cusNum" sortable width="100px"></el-table-column>
            <el-table-column label="下发量" prop="assignNum" sortable width="100px"></el-table-column>
            <el-table-column label="呼出量" prop="expiration" sortable width="100px"></el-table-column>
            <el-table-column label="拨打量" prop="dialNum" sortable width="100px"></el-table-column>
            <el-table-column label="呼通量" prop="flux" sortable width="100px"></el-table-column>
            <el-table-column label="成功量" prop="successNum" sortable width="100px"></el-table-column>
            <el-table-column label="成功率" prop="successRate" sortable width="100px">
                <template slot-scope="scope">
                    {{scope.row.cusNum?scope.row.successNum/scope.row.cusNum:'-'}}
                </template>
            </el-table-column>
            <el-table-column label="失败量" prop="failNum" sortable width="100px"></el-table-column>
            <el-table-column label="失败率" prop="failRate" sortable width="100px">
                <template slot-scope="scope">
                    {{scope.row.cusNum?scope.row.failNum/scope.row.cusNum:'-'}}
                </template>
            </el-table-column>
            <el-table-column label="再呼次数" prop="againNum" sortable width="100px">
                <template slot-scope="scope">
                    {{scope.row.dialNum-scope.row.expiration}}
                </template>
            </el-table-column>
            <el-table-column label="再呼率" prop="againRate" sortable width="100px">
                <template slot-scope="scope">
                    {{scope.row.cusNum?(scope.row.dialNum-scope.row.expiration)/scope.row.cusNum:'-'}}
                </template>
            </el-table-column>
            <el-table-column label="总时长" prop="duration" sortable width="100px"></el-table-column>
            <el-table-column label="计费时长" prop="charging" sortable width="100px"></el-table-column>
            <el-table-column label="详情"  width="100px">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="handleKb(scope.$index,scope.row)">看板</el-button>
                    <!-- <el-button type="text" size="mini" @click="handleXq(scope.$index,scope.row)">详情</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        </div>

        <el-dialog title="房产教育" :visible.sync="boardDialog" center width="90%">
            <v-board :childData="childData" :seatList="seatList" :myRow="myRow" :sucList="sucList" :durationList="durationList" :arr='arr' v-if="childData.length > 0"></v-board>
        </el-dialog>
        <div class="fpage">
            <el-pagination class="pagebutton" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20,30,100]" layout="total, sizes, prev, pager, next, jumper" :total="total">
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
                pageSize:10,
                selectList:[],
                childData:[],
                seatList:[],
                myRow:null,
                total:1,
                durationList:[],
                sucList:[],
                arr:[]
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
            handleCurrentChange(val) {
                this.currentPage =val;
                this.getTablelist()
            },
            handleSizeChange(val){
                this.pageSize=val;
                this.getTablelist()
            },
            //获取表格数据
            getTablelist(){
                let token=this.$cookieStore.getCookie('token')
                //console.log(token)
                let pageSize=this.pageSize
                let pageIndex=this.currentPage
                this.$http.get(this.$api.callee.statistics,{params:{pageIndex:pageIndex,pageSize:pageSize,token:token}}).then(res => {
                    if(res.data.code === 0){
                        console.log(res.data)
                        this.tableData=res.data.list
                        this.total=res.data.count
                    }else{
                        this.$message.error(res.data.message)
                    }
                }).catch((e)=>{
                    console.log(e)
                })
            },
            
            handleKb(index,row){
                this.myRow=row
                this.arr=[{name:'数据量'},{name:'下发量'},{name:'营销量'},{name:'呼通量'},{name:'成功量'}]
                this.arr[0].value=this.myRow.cusNum
                this.arr[1].value=this.myRow.assignNum
                this.arr[2].value=this.myRow.expiration
                this.arr[3].value=this.myRow.flux
                this.arr[4].value=this.myRow.successNum
                console.log(this.arr)
                row.againNum=row.dialNum-row.expiration
                let token=this.$cookieStore.getCookie('token')
                let id=row.id
                this.$http.get(this.$api.callee.statisticsDetail,{params:{pageIndex:1,pageSize:5,id:id,token:token}}).then(res => {
                    if(res.data.code === 0){
                        console.log(res.data)
                        this.childData=res.data.data
                        this.seatList=res.data.seatList
                        this.durationList=res.data.durationList
                        this.sucList=res.data.sucList
                    }else{
                        this.$message.error(res.data.message)
                    }
                }).catch((e)=>{
                    console.log(e)
                })
                this.boardDialog=true
            },
            // handleXq(index,row){
            //     console.log("x详情")
            //     this.$router.push({name:'whdetail',params:{userId:'wish'}})
            // },
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
