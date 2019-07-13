<template>
    <div>
        <el-form :inline="true" class="form-inline" :model="myData">
            <el-form-item label="项目名称:">
                <el-input placeholder="请输入项目名称" v-model="myData.itemName" clearabled></el-input>
            </el-form-item>
            <!-- <el-form-item label="创建时间：">
                <el-date-picker class='dateInput' v-model="myData.time" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item> -->
            <el-form-item>
                <el-button type='primary' @click="getTablelist" size="mini">搜索</el-button>
            </el-form-item>
        </el-form>
        <div class="small-divider"></div>
        <div style="padding:17px 0 17px 20px">
            <el-button type="primary" @click="outExe">导出</el-button>
        </div>
        <div class="divider"></div>
        <!--table表格-->
        <div class="table-box">
        <el-table id="out-table" :data="tableData" show-header :header-cell-style="tableHeaderStyle" @selection-change="changeFun" v-loading="loading" element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index" label="序号" :index="indexMethod" align="center" width="70px"></el-table-column>
            <el-table-column label="项目名称" prop="itemName" width="100px"></el-table-column>
            <el-table-column label="数据量" prop="cusNum" ></el-table-column>
            <el-table-column label="下发量" prop="assignNum" ></el-table-column>
            <el-table-column label="呼出量" prop="expiration"></el-table-column>
            <el-table-column label="拨打量" prop="dialNum"></el-table-column>
            <el-table-column label="呼通量" prop="flux" ></el-table-column>
            <el-table-column label="成功量" prop="successNum" ></el-table-column>
            <el-table-column label="成功率" prop="successRate"  >
                <template slot-scope="scope">
                    {{scope.row.cusNum?scope.row.successNum/scope.row.cusNum:'0' | numFilter}}
                </template>
            </el-table-column>
            <el-table-column label="失败量" prop="failNum" ></el-table-column>
            <el-table-column label="失败率" prop="failRate" >
                <template slot-scope="scope">
                    {{scope.row.cusNum?scope.row.failNum/scope.row.cusNum:'0' | numFilter}}
                </template>
            </el-table-column>
            <el-table-column label="再呼次数" prop="againNum" width="100px">
                <template slot-scope="scope">
                    {{scope.row.dialNum-scope.row.expiration}}
                </template>
            </el-table-column>
            <!-- <el-table-column label="再呼率" prop="againRate" sortable width="100px">
                <template slot-scope="scope">
                    {{scope.row.cusNum?(scope.row.dialNum-scope.row.expiration)/scope.row.cusNum:'0' | numFilter}}
                </template>
            </el-table-column>
            <el-table-column label="总时长" prop="duration" sortable width="100px"></el-table-column> -->
            <el-table-column label="计费时长(分)" prop="charging" width="120px"></el-table-column>
            <el-table-column label="详情"  width="100px">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="handleKb(scope.$index,scope.row)">看板</el-button>
                    <!-- <el-button type="text" size="mini" @click="handleXq(scope.$index,scope.row)">详情</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        </div>

        <el-dialog :title="title" :visible.sync="boardDialog" center width="90%">
            <v-board :child-data="childData" v-if="reFresh" ></v-board>
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
               
                reFresh:false,
                loading:false,
                boardDialog:false,
                myData:{
                    pageIndex:1,
                    pageSize:10,
                },
                win:null,
                value:'',
                createtime:'',
                tableData:[],
                selectList:[],
                childData:{
                    
                },
                total:1,
                
                
                
                title:''
            }
        },
        watch:{
            childData:{
                function(){
                    
                }
            }
        },
        components:{
            vBoard
        },
        methods:{
            indexMethod(index) {
                return index+1;
            },
            handleCurrentChange(val) {
                this.myData.pageIndex =val;
                this.getTablelist()
            },
            handleSizeChange(val){
                this.myData.pageSize=val;
                this.getTablelist()
            },
            //获取表格数据
            getTablelist(){
                this.loading=true
                 
                //console.log(token)
                let params=this.myData
                  
                this.$http.get(this.$api.callee.statistics,{params:params}).then(res => {
                    if(res.data.code === 0){
                        console.log(res.data)
                        this.tableData=res.data.list
                        this.total=res.data.count
                    }else{
                        this.$message.error(res.data.msg)
                    }
                    this.loading=false
                }).catch((e)=>{
                    console.log(e)
                })
            },
            
            handleKb(index,row){
                this.reFresh = false
                
                this.title = row.itemName
                this.childData.myRow=row
                this.childData.arr=[{name:'数据量'},{name:'下发量'},{name:'营销量'},{name:'呼通量'},{name:'成功量'}]
                this.childData.arr[0].value=this.childData.myRow.cusNum
                this.childData.arr[1].value=this.childData.myRow.assignNum
                this.childData.arr[2].value=this.childData.myRow.expiration
                this.childData.arr[3].value=this.childData.myRow.flux
                this.childData.arr[4].value=this.childData.myRow.successNum
                 
                let id=row.id
                this.$http.get(this.$api.callee.statisticsDetail,{params:{pageIndex:1,pageSize:5,id:id}}).then(res => {
                    if(res.data.code === 0){
                        console.log('请求的data',res.data)
                        this.childData.optionbarData=res.data.data
                        this.childData.seatList=res.data.seatList
                        this.childData.durationList=res.data.durationList
                        this.childData.sucList=res.data.sucList
                        this.$nextTick( ()=>{
                            this.reFresh = true
                        })
                        this.boardDialog=true
                    }else{
                        this.$message.error(res.data.message)
                    }
                    console.log('父组件的',this.childData)
                }).catch((e)=>{
                    console.log(e)
                })
                
            },
            // handleXq(index,row){
            //     console.log("x详情")
            //     this.$router.push({name:'whdetail',params:{userId:'wish'}})
            // },
            //表格选中事件
            changeFun(val){
                this.selectList=val
                //console.log(this.selectList)
            }, 
            //导出
            outExe() {
                if(this.selectList == ''){
                    this.$message.warning('请勾选数据')
                    return
                }
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
                    const tHeader = ['项目名称','数据量', '下发量','呼出量','拨打量','呼通量','成功量','成功率','失败量','失败率','再呼次数','再呼率','总时长','计费时长'];
                    const filterVal = ['itemName', 'cusNum', 'assignNum','expiration','dialNum','flux','successNum','successRate','failNum','failRate','againNum','againRate','duration','charging'];
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
