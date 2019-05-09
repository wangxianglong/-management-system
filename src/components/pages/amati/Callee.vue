<template>
    <div class="itemadd">
        <el-form :inline="true" class="form-inline" v-model="myData">
            <el-form-item label="活动名">
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
                <el-select v-model="myData.status2" placeholder="全部" style="margin-left:10px;">
                    <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' style="margin-left:50px;" @click="getActivityList">搜索</el-button>
            </el-form-item>
        </el-form>
        <div class="divider"></div>
        <div class="table-box">
        <el-table :data="tableData" style="width:100%;" show-header >
            <el-table-column type="index" label="序号" :index="indexMethod" align="center" width="100px"></el-table-column>
            <el-table-column label="活动名" prop="activityName" sortable></el-table-column>
            <el-table-column label="数据量" prop="num" sortable></el-table-column>
            <el-table-column label="开始时间" prop="startTime" sortable>
                <template slot-scope="scope">
                    {{scope.row.startTime | date(1)}}
                </template>
            </el-table-column>
            <el-table-column label="结束时间" prop="endTime" sortable>
                <template slot-scope="scope">
                    {{scope.row.endTime | date(1)}}
                </template>
            </el-table-column>
            <el-table-column label="状态" sortable>
                <template  slot-scope="scope">
                    <el-button type="text" style="color:red" v-if="scope.row.status===2||scope.row.status===3">进行中</el-button>
                    <el-button type="text" v-if="scope.row.status===4">已完成</el-button>
                </template> 
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="taskEdit(scope.$index,scope.row)">进入外呼</el-button>
                    <!-- <el-button type="text">回退剩余数据</el-button> -->
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
                time:null,
                myData:{
                    pageIndex:1,
                    pageSize:10,
                    status:2
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
                this.myData.pageIndex=val;
                this.getItemlist()
            },
            handleSizeChange(val){
                this.myData.pageSize=val;
                this.getItemlist()
            },
            //获取活动列表
            getActivityList(){
                if (this.time!==null){
                   this.myData.startTime=this.time[0];
                   this.myData.endTime =this.time[1];
                }else{
                    delete this.myData.startTime
                    delete this.myData.endTime
                }
                let token=this.$cookieStore.getCookie('token')
                let params=this.myData
                params.token=token
                this.$http.get(this.$api.amati.seatActive,{params:params}).then(res =>{
                    if(res.data.code===0){
                        this.tableData=res.data.list
                        //console.log(this.tableData)
                        this.total=res.data.count
                    }
                }).catch(error => {
                    console.log("出错了")
                })
            },
            //获取活动
            getActivity(){
                
            },
            
            indexMethod(index) {
                return index+1;
            },
            
            taskEdit(index,row) {
                //console.log(row);//每行的数据
                //console.log(row.name)//获取活动名
                //console.log(row.num)//获取数据量
                this.dialogVisible=true
                this.name=row.name
                this.num=row.num
                let activityId=row.activityId
                this.$router.push({name:'calleedetail',query:{activityId:activityId}})
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