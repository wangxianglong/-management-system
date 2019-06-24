<template>
    <div class="itemadd">
        <el-form :inline="true" class="form-inline" v-model="myData">
            <!-- <el-form-item label="任务名">
                <el-input placeholder="请输入任务名称" v-model="myData.taskname"></el-input>
            </el-form-item> -->
            <el-form-item label="行销名单">
                <el-input v-model="myData.activityName"></el-input>
            </el-form-item>
            <el-form-item label="任务时段">
                <template>
                    <el-date-picker 
                            v-model="time" 
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                    >
                    </el-date-picker>
                </template>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="myData.status" placeholder="全部" style="margin-left:10px;">
                    <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' style="margin-left:50px;" @click='getActivityList'>搜索</el-button>
            </el-form-item>
        </el-form>
        <div class="divider"></div>
        <div class="table-box">
        <el-table :data="tableData" style="width:100%;" show-header v-loading="loading" element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
            <el-table-column type="index" label="序号" :index="indexMethod" align="center" width="100px"></el-table-column>
            <el-table-column label="行销名单" prop="activityName" sortable></el-table-column>
            <el-table-column label="数据量" prop="orderNum" sortable></el-table-column>
            <el-table-column label="开始时间" prop="startTime" sortable></el-table-column>
            <el-table-column label="结束时间" prop="endTime" sortable></el-table-column>
            <el-table-column label="状态" sortable>
                <template  slot-scope="scope">
                    
                    <el-button type="text" v-if="scope.row.status===2||scope.row.status===3">进行中</el-button>
                    <el-button type="text" style="color:#000" v-if="scope.row.status===4">已完成</el-button>
                </template> 
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="taskEdit(scope.$index,scope.row)">进入外呼</el-button>
                    <!--<el-button type="text" @click="taskEdit(scope.$index,scope.row)">回退剩余数据</el-button>-->
                </template>
            </el-table-column>
        </el-table>
        </div>
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
                loading:false,
                time:null,
                myData:{
                    pageIndex:1,
                    pageSize:10,
                },  
                count:1,
                selectName:'',
                firmName:[],
                search:'',
                activityShow:false,
                activityList:[],
                dialogVisible:false,
                value:'', 
                
                name:'',
                num:'',
                options2: [{
                    value: '5',
                    label: '进行中'
                }, {
                    value: '4',
                    label: '已完成'
                }],
                total:1,
                tableData:[]
            }
        },
        methods:{
            //初始化
            init (){
                
            },
            handleCurrentChange(val) {
                this.myData.pageIndex =val;
                this.getActivityList()
            },
            handleSizeChange(val){
                this.myData.pageSize=val;
                this.getActivityList()
            },
            //获取表格列表
            getActivityList(){
                this.loading=true
                if(this.time!==null){
                    this.myData.starteTime=this.time[0]
                    this.myData.endTime=this.time[1]
                }else{
                    delete this.myData.starteTime
                    delete this.myData.endTime
                }
                let token=this.$cookieStore.getCookie('token')
                let params=this.myData
                params.token=token
                this.$http.get(this.$api.monitor.taskAssign,{params:params}).then(res =>{
                    if(res.data.code===0){
                        //console.log(res)
                        this.tableData=res.data.list
                        this.total=res.data.count
                        this.loading=false
                    }
                })
            },
            //获取行销名单
            getActivity(){
                
            },
            
            indexMethod(index) {
                return index+1;
            },
            
            taskEdit(index,row) {
                //console.log(row);//每行的数据
                //console.log(row.name)//获取行销名单
                //console.log(row.num)//获取数据量
                this.dialogVisible=true
                this.name=row.name
                this.num=row.num
                let id=row.activityId
                let status=row.status
                //console.log(status)
                //console.log(id)
                this.$router.push({name:'taskdetail',query:{id:id,status:status}})
            },
            saveEdit(index){
                this.dialogVisible=false 
                
            },
        },
        created(){
            this.init(
                this.getActivityList()
            )
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