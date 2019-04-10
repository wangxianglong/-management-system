<template>
    <div class="itemadd">
        <el-form :inline="true" class="form-inline" :model="myData">
            <el-form-item label="活动名">
                <el-input placeholder="请输入活动名" v-model="myData.activityName"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select class="mySelect" v-model="myData.status" placeholder="全部" style="margin-left:10px;">
                    <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-date-picker v-model="myData.createTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="开始时间：">
                <el-date-picker v-model="myData.startTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间：">
                <el-date-picker v-model="myData.endTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' style="margin-left:50px;" @click="goSearch">搜索</el-button>
            </el-form-item>
        </el-form>
        <div class="small-divider"></div>
        <!--获取活动-->
        <div style="padding:20px"><el-button type="primary" @click='getActivity'>获取活动</el-button></div>
        <el-dialog :visible.sync="activityShow">
            <el-table :data="activityList" style="width:100%;" show-header>
                <el-table-column label="活动名" prop="activityName"></el-table-column>
                <el-table-column label="活动ID" prop="activityId"></el-table-column>
                <el-table-column label="开始时间" prop="activityBeginDate"></el-table-column>
                <el-table-column label="结束时间" prop="activityEndDate"></el-table-column>
                <el-table-column label="活动号码" prop="showNumber"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="addActivity(scope.row)" v-loading="loading">获取</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <div class="divider"></div>
        <div class="table-box">
        <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width:100%;" show-header v-loading="loading" element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
            <el-table-column type="index" label="序号" :index="indexMethod" align="center"></el-table-column>
            <el-table-column label="活动名" prop="activityName"></el-table-column>
            <el-table-column label="数据量" prop="orderNum" sortable></el-table-column>
            <el-table-column label="创建时间" prop="createTime" sortable>
                <template slot-scope="scope">
                    {{scope.row.createTime | date(hour)}}
                </template>
            </el-table-column>
            <el-table-column label="开始时间" prop="startTime" sortable></el-table-column>
            <el-table-column label="结束时间" prop="endTime" sortable></el-table-column>
            <el-table-column label="状态" sortable>
                <template  slot-scope="scope">
                    <el-button type="text" size="mini" style="color:red" v-if="scope.row.status===0">未分配</el-button>
                    <el-button type="text" size="mini" v-if="scope.row.status===1">已分配</el-button>
                </template> 
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" :disabled="scope.row.status == 1" @click="taskEdit(scope.$index,scope.row)">分配任务</el-button>
                </template>
            </el-table-column>
        </el-table>
        </div>
        <!--编辑弹框-->
        <el-dialog title="分配任务" :visible.sync="dialogVisible" width="30%">
            <div style="border-top:1px solid #ccc;border-bottom:1px solid #ccc;height:100px;padding:20px 0 20px 40px">
                <p style="margin-bottom:20px"><span style="margin-right:40px">活动名称</span>{{activityName}}<span></span></p>
                <p style="margin-bottom:20px"><span style="margin-right:55px">数据量</span>{{orderNum}}<span></span></p>
                <p>
                    <span style="margin-right:20px">公司名</span>
                    <el-select v-model="userId" filterable placeholder="请选择">
                        <el-option
                        v-for="item in firmName"
                        :key="item.id"
                        :label="item.company"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
        <!--分页导航-->
        <div class="fpage">
            <el-pagination class="pagebutton" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20,30,100]" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    
    export default {
        data(){
            return { 
                hour:true,
                loading:true,
                myData:{
                    id:null,
                    activityName:null,
                    createTime:null,
                    startTime:null,
                    endTime:null,
                    status:null
                }, 
                userId:null,
                rowData:'',
                activityName:'',
                orderNum:'',
                selectName:'',
                firmName:[],//公司名，账户
                search:'',
                activityShow:false,
                activityList:[],//活动列表
                dialogVisible:false,
                value:'', 
                currentPage:1,
                pageSize:10,
                options2: [{
                    value: '0',
                    label: '未分配'
                }, {
                    value: '1',
                    label: '已分配'
                }],
                tableData:[],//表格数据
                total:1,
            }
        },
        methods:{
            //搜索
            goSearch(){
                
            },
            //获取表格列表
            getTablelist(){
                let token=this.$cookieStore.getCookie('token')
                //console.log(token)
                this.$http.get(this.$api.platform.list,{params:{pageIndex:this.currentPage,pageSize:this.pageSize,token:token}}).then(res => {
                    if(res.data.code === 0){
                        console.log(res.data)
                        this.tableData=res.data.list
                        this.total=res.data.count
                        this.loading=false
                    }else{
                        this.$message.error(res.data.message)
                    }
                }).catch((e)=>{
                    console.log(e)
                })
            },
            //获取活动列表
            getActivity(){
                this.$http.post(this.$api.platform.activityList).then(res=>{
                    if(res.data.code === 0){
                        //console.log(res.data)
                        this.activityList=res.data.param.resultList
                        //console.log(this.activityList)
                        this.activityShow=true; 
                    }else{
                        this.$message.error(res.data.message)
                    }
                }).catch((e) => {
                    console.log(e) 
                })
            },
            addActivity(row){
                const that=this
                this.rowData=row
                let params={activityId:this.rowData.activityId}
                //console.log(this.rowData)
                this.$http.post(this.$api.platform.activity,params).then(res=>{
                    //console.log(res)
                    if(res.data.code===0){
                        //that.tableData=res.data.param.resultList 
                        console.log(this.tableData)
                        this.activityShow=false;
                        this.getTablelist()
                    }
                }).catch(function (error) {
                    console.log(error)
                })
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
                this.getTableList()
            },
            taskEdit(index,row) {
                //console.log(row);//每行的数据
                //console.log(row.name)//获取活动名
                //console.log(row.num)//获取数据量
                this.dialogVisible=true
                this.rowData=row
                this.activityName=row.activityName
                this.orderNum=row.orderNum
                this.$http.get(this.$api.platform.company).then(
                    res => {
                        console.log(res)
                        this.firmName=res.data.list
                    }
                ).catch(err => {
                    console.log("err")
                })
                
            },
            saveEdit(){
                console.log(this.rowData.id)
                console.log(this.userId)
                this.$http.post(this.$api.platform.update,
                    {
                        id:this.rowData.id,
                        userId:this.userId,
                        status:1
                    }).then(
                    res => {
                        this.dialogVisible=false
                        if(res.data.code===0){
                            this.getTablelist()
                        }
                    }
                ).catch(err => {
                    console.log("err")
                })
                
                //this.rowData.status=1
            }
            
        },
        created(){
           this.getTablelist()
           //console.log(this.myData.status)
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