<template>
    <div class="itemadd">
        <el-form :inline="true" class="form-inline" :model="myData" ref="myData">
            <el-form-item label="行销名单" prop='activityName'>
                <el-input v-model="myData.activityName"></el-input>
            </el-form-item>
            <!-- <el-form-item label="任务时段">
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
            </el-form-item> -->
            <el-form-item label="有效期" prop="validityType">
                <el-select class="mySelect" v-model="myData.validityType" placeholder="全部" clearable >
                    <el-option v-for="item in validityType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status2">
                <el-select v-model="myData.status2" placeholder="全部" style="margin-left:10px;">
                    <el-option v-for="item in statusType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' size="small" @click="getActivityList">搜索</el-button>
                <el-button size="small" @click="resetForm('myData')">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="divider"></div>
        <div class="table-box">
        <el-table :data="tableData" style="width:100%;" show-header :header-cell-style="tableHeaderStyle" border>
            <el-table-column type="index" label="序号" :index="indexMethod" align="center" width="100px"></el-table-column>
            <el-table-column label="行销名单" prop="activityName"></el-table-column>
            <el-table-column label="数据量" prop="num" ></el-table-column>
            <el-table-column label="开始时间" prop="startTime">
                <template slot-scope="scope">
                    {{scope.row.startTime | date()}}
                </template>
            </el-table-column>
            <el-table-column label="结束时间" prop="endTime"  >
                <template slot-scope="scope">
                    {{scope.row.endTime | date()}}
                </template>
            </el-table-column>
            <el-table-column label="有效期" prop="validity">
                <template slot-scope="scope">
                    <span style="color:red" v-if="scope.row.validity<0">无效</span>
                    <span v-else>{{scope.row.validity}}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" sortable>
                <template  slot-scope="scope">
                    <el-button type="text" style="color:red" v-if="scope.row.status===2||scope.row.status===3">进行中</el-button>
                    <el-button type="text" v-if="scope.row.status===4">已完成</el-button>
                </template> 
            </el-table-column>
            <el-table-column label="操作" width="350px" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="callSuccess(scope.$index,scope.row)" :disabled="scope.row.validity<0?true:false">呼叫成功</el-button>
                    <el-button type="primary" size="mini" @click="callBarring(scope.row)" :disabled="scope.row.validity<0?true:false">拒接</el-button>
                    <el-button type="primary" size="mini" @click="busyTone(scope.row)" :disabled="scope.row.validity<0?true:false">忙音/关机</el-button>
                    <el-button type="primary" size="mini" @click="otherPhone(scope.row)" :disabled="scope.row.validity<0?true:false">其他</el-button>
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
                total:1,
                myData:{
                    pageIndex:1,
                    pageSize:10,
                    status:3,
                    activityName:null,
                    status2:null,
                    validityType:null
                },  
                count:1,
                selectName:'',
                firmName:[],
                search:'',
                activityShow:false,
                activityList:[],
                
                value:'', 
                statusType: [{
                    value: '5',
                    label: '进行中'
                },{
                    value:'4',
                    label:'已完成'
                }],
                validityType: [
                {
                    value:0,
                    label:'无效'
                },
                {
                    value: 1,
                    label: '0~3天'
                }, {
                    value: 2,
                    label: '3~5天'
                },{
                    value:3,
                    label:'5~10天'
                },{
                    value:4,
                    label:'10~15天'
                },{
                    value:5,
                    label:'大于15天'
                }],
                tableData:[]
            }
        },
        methods:{
            //初始化
            init (){
                
            },
            resetForm(myData){
                this.$refs[myData].resetFields()
                this.getActivityList()
            },
            handleCurrentChange(val) {
                this.myData.pageIndex=val;
                this.getActivityList()
            },
            handleSizeChange(val){
                this.myData.pageSize=val;
                this.getActivityList()
            },
            //获取活动列表
            getActivityList(){
                // if (this.time!==null){
                //    this.myData.cstartTime=this.time[0];
                //    this.myData.cendTime =this.time[1];
                // }else{
                //     delete this.myData.cstartTime
                //     delete this.myData.cendTime
                // }
                 
                let params=this.myData
                  
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
            
            callSuccess(index,row) {
                let activityId=row.activityId
                this.$router.push({name:'recalldetail',query:{activityId:activityId,intention:5}})
            },
            callBarring(row){
                let activityId=row.activityId
                this.$router.push({name:'recalldetail',query:{activityId:activityId,intention:6}})
            },
            busyTone(row){
                let activityId=row.activityId
                this.$router.push({name:'recalldetail',query:{activityId:activityId,intention:7}})
            },
            otherPhone(row){
                let activityId=row.activityId
                this.$router.push({name:'recalldetail',query:{activityId:activityId,intention:8}})
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