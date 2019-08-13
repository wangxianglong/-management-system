<template>
    <div>
        <el-form :inline="true" :model="myData" class="form-inline" ref="myData">
            <el-form-item label="企业名称" prop="company">
                <el-input v-model="myData.company" clearable></el-input>
            </el-form-item>
            <el-form-item label="代理商" prop = "agentName">
                <el-input v-model="myData.agentName"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' @click="getTableList"  size="mini">搜索</el-button>
                <el-button @click="resetForm('myData')" size="small">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="divider"></div>
        <div class="table-box">
        <el-table :data="tableData" style="width:100%;" show-header :header-cell-style="tableHeaderStyle" @selection-change="changeFun" v-loading='loading' element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)" border>
            <!-- <el-table-column type="selection"></el-table-column> -->
            <el-table-column type="index" label="序号" :index="indexMethod" align="center" width="50"></el-table-column>
            <el-table-column label="企业ID" prop="ent_id" width="100px"></el-table-column>
            <el-table-column label="名称" prop="company" width="150px"></el-table-column>
            <el-table-column label="所属代理商" prop="agent_name" width="120"></el-table-column>
            <el-table-column label="数据量" prop="data_count"  width="120px"></el-table-column>
            <el-table-column label="数据费(元)" prop="data_amount" width="120px"></el-table-column>
            <el-table-column label="座席数" prop="seat_count" width="120px"></el-table-column>
            <el-table-column label="座席费(元)" prop="seat_amount" width="120px">
                <template slot-scope="scope">
                    <span>{{scope.row.seat_amount==null?'0':scope.row.seat_amount}}</span>
                </template>
            </el-table-column>
            <el-table-column label="语音时长(分)" prop="time_min" width="120px"></el-table-column>
            <el-table-column label="语音费(元)" width="120px">
                <template slot-scope="scope">
                    <span>{{scope.row.voice_amount2==0?scope.row.voice_amount:scope.row.voice_amount2}}</span>
                </template>
            </el-table-column>
            <el-table-column label="定制费(元)" prop="model_amount" width="120px">
                <template slot-scope="scope">
                    <span>{{scope.row.model_amount | toString()}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column label="其他" prop='others'>
            </el-table-column> -->
            <el-table-column label="累积消费金额(元)" prop='consume_total'  width="130px">
                <template slot-scope="scope">
                    <span>{{scope.row.consume_total | toString()}}</span>
                </template>
            </el-table-column>
            <el-table-column label="余额(元)" prop="balance">
                <template slot-scope="scope">
                    <span :class="scope.row.balance<0?'myColor':''">{{scope.row.balance | toString()}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="particulars(scope.row)">详情话单</el-button>
                </template>
            </el-table-column> -->
        </el-table>
        </div>
        <div class="fpage">
            <el-pagination class="pagebutton" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20,30,100]" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                loading:false,
                tableData:[],
                total:1,
                myData:{
                    pageIndex:1,
                    pageSize:10,
                    company:'',
                    agentName:''
                },
                time:null,
                agentId:''
            }
        },
        methods:{
            resetForm(myData) {
                this.$refs[myData].resetFields();
                this.getTableList()
            },
            indexMethod(index) {
                return index+1;
            },
            handleCurrentChange(val) {
                this.myData.pageIndex=val;
                this.getTableList()
            },
            handleSizeChange(val){
                this.myData.pageSize=val;
                this.getTableList()
            },
            //获取表格列表
            getTableList(){
                this.loading=true
                // if (this.time!==null){
                //     //console.log(1)
                //    this.myData.startTime=this.time[0];
                //    this.myData.endTime =this.time[1];
                // }else{
                //     delete this.myData.startTime
                //     delete this.myData.endTime
                // }
                if(sessionStorage.getItem('roleId') == 1 || sessionStorage.getItem('roleId').substr(0,1) == 2 ){
                    this.agentId = null
                }else{
                    this.agentId=sessionStorage.getItem('agentId')
                }
                 
                let params=this.myData
                  
                params.id = this.agentId
                this.$http.get(this.$api.platform.consumeStat,{params:params}).then(res=>{
                    if(res.data.code===0){
                        //console.log(res)
                        this.tableData=res.data.list
                        this.total=res.data.count
                        this.loading=false
                    }
                })
            },
            //表格选中事件
            changeFun(val){
                this.selectList=val
                //console.log(this.selectList)
            }, 
        },
        created(){
            this.getTableList()
        }
    }
</script>
<style scoped>
    .pagebutton {
        float:right
    }
    .audio {
        width:200px;
        
    }
    .audioBox{
        display:flex;
        align-items: center;
        width:200px;
        height:30px
    }
    .myColor{
        color:red
    }
</style>

