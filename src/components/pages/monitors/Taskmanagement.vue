<template>
    <div class="itemadd">
        <el-form :inline="true" class="form-inline" v-model="searchList">
            <el-form-item label="任务名">
                <el-input placeholder="请输入任务名称" v-model="searchList.taskname"></el-input>
            </el-form-item>
            <el-form-item label="活动名">
                <el-input v-model="searchList.activityname"></el-input>
            </el-form-item>
            <el-form-item label="任务时段">
                <el-date-picker v-model="searchList.time" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="value" placeholder="全部" style="margin-left:10px;">
                    <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' style="margin-left:50px;">搜索</el-button>
            </el-form-item>
        </el-form>
        <div class="divider"></div>
        <div class="table-box">
        <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width:100%;" show-header >
            <el-table-column type="index" label="序号" :index="indexMethod" align="center" width="100px"></el-table-column>
            <el-table-column label="活动名" prop="orderNum" sortable></el-table-column>
            <el-table-column label="数据量" prop="orderMargin" sortable></el-table-column>
            <el-table-column label="剩余数量" prop="createTime" sortable></el-table-column>
            <el-table-column label="开始时间" prop="startTime" sortable></el-table-column>
            <el-table-column label="结束时间" prop="endTime" sortable></el-table-column>
            <el-table-column label="状态" sortable>
                <template  slot-scope="scope">
                    <el-button type="text" style="color:red" v-if="scope.row.status===0">未开始</el-button>
                    <el-button type="text" v-if="scope.row.status===1">进行中</el-button>
                    <el-button type="text" style="color:#000" v-if="scope.row.status===2">已完成</el-button>
                </template> 
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="taskEdit(scope.$index,scope.row)">进入外呼</el-button>
                    <el-button type="text" @click="taskEdit(scope.$index,scope.row)">回退剩余数据</el-button>
                </template>
            </el-table-column>
        </el-table>
        </div>
        <!--分页导航-->
        <div class="fpage">
            <el-pagination class="pagebutton" background @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="400">
            </el-pagination>
        </div>
    </div>
</template>
<script>

    export default {
        data(){
            return {
                searchList:{
                    taskname:'',
                    activityname:'',
                    time:''
                },  
                count:1,
                selectName:'',
                firmName:[],
                search:'',
                activityShow:false,
                activityList:[],
                dialogVisible:false,
                value:'', 
                currentPage:1,
                pagesize:10,
                name:'',
                num:'',
                options2: [{
                    value: '选项1',
                    label: '全部'
                }, {
                    value: '选项2',
                    label: '项目1'
                },{
                    value:'选项3',
                    label:'项目2'
                }],
                
                tableData:[{
                    activityName:'aa',
                    orderNum:234,
                    orderMargin:23,
                    createTime:333,
                    startTime:4556,
                    endTime:455,
                    status:0
                },{
                    activityName:'aa',
                    orderNum:234,
                    orderMargin:23,
                    createTime:333,
                    startTime:4556,
                    endTime:455,
                    status:1
                },{
                    activityName:'aa',
                    orderNum:234,
                    orderMargin:23,
                    createTime:333,
                    startTime:4556,
                    endTime:455,
                    status:2
                },{
                    activityName:'aa',
                    orderNum:234,
                    orderMargin:23,
                    createTime:333,
                    startTime:4556,
                    endTime:455,
                    status:1
                }]
            }
        },
        methods:{
            //初始化
            init (){
                
            },
            //获取活动列表
            getActivityList(){
                console.log("发送请求")
            },
            //获取活动
            getActivity(){
                
            },
            
            indexMethod(index) {
                return index+1;
            },
            handleCurrentChange(currentPage) {
                this.currentPage =currentPage;
            },
            taskEdit(index,row) {
                //console.log(row);//每行的数据
                //console.log(row.name)//获取活动名
                //console.log(row.num)//获取数据量
                this.dialogVisible=true
                this.name=row.name
                this.num=row.num
                this.$router.push({name:'taskdetail'})
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