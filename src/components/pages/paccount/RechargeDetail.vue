<template>
    <div>
        <el-form :inline="true" :model="myData" class="form-inline" ref="myData">
            <el-form-item label="日期">
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
            <el-form-item label="状态" prop="status">
                <el-select v-model="myData.status" placeholder="请选择" style="margin-left:10px;">
                    <el-option v-for="item in statusType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="金额" prop="amount">
                <el-input v-model="myData.amount"></el-input>
            </el-form-item> -->
            <el-form-item>
                <el-button type='primary' @click="getTableList"  size="small">搜索</el-button>
                <el-button @click="resetForm('myData')" size="small">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="small-divider"></div>
        <!--获取活动-->
        <div style="padding:20px">
            <el-button v-if="roleId==1" type="primary" @click='goBack'>返回</el-button>
        </div>
        <div class="divider"></div>
        <div class="table-box">
        <el-table :data="tableData" style="width:100%;" show-header :header-cell-style="tableHeaderStyle" v-loading='loading' element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)" border>
            <el-table-column type="index" label="序号" :index="indexMethod" align="center" width="100px;"></el-table-column>
            <el-table-column label="事项" prop="content" width="100px"></el-table-column>
            <el-table-column label="金额(元)" prop="amount"></el-table-column>
            <el-table-column label="时间" prop="create_time">
                <template slot-scope="scope">
                    <span>{{scope.row.createTime | date(true)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="提交人" prop="submitter"></el-table-column>
            <el-table-column label="充值方式" prop="type">
                <template slot-scope="scope">
                    <span v-if = 'scope.row.type===1'>支付宝</span>
                    <span v-if = 'scope.row.type===2'>微信</span>
                    <span v-if = 'scope.row.type===3'>银行卡</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" prop="status">
                <template slot-scope="scope">
                    <el-button type='text' style='color:red' v-if = "scope.row.status===1">待审核</el-button>
                    <el-button type="text" v-if = "scope.row.status===2">充值成功</el-button>
                    <el-button type="text" v-if = "scope.row.status===3">退回</el-button>
                </template>
            </el-table-column>
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
                tableData:[
                ],
                total:1,
                myData:{
                    pageIndex:1,
                    pageSize:10,
                    amount:'',
                    status:'',
                    startTime:'',
                    endTime:''
                },
                statusType:[
                    {
                        value:1,
                        label:'待审核'
                    },
                    {
                        value:2,
                        label:'充值成功'
                    },
                    {
                        value:3,
                        label:'退回'
                    }
                ],
                time:null,
                userId:'',
                roleId:sessionStorage.getItem('roleId')
            }
        },
        methods:{
            resetForm(myData){
                this.$refs[myData].resetFields()
                this.time = null
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
                if (this.time!==null){
                   this.myData.startTime=this.time[0];
                   this.myData.endTime =this.time[1];
                }else{
                    delete this.myData.startTime
                    delete this.myData.endTime
                }
                 
                if(window.location.href.split('?').length!==1){
                    this.userId=this.$route.query.userId
                }else{
                    this.userId=sessionStorage.getItem('agentId')
                }
                let params=this.myData
                  
                params.userId=this.userId
                this.$http.get(this.$api.platform.rechargeDetail,{params:params}).then(res=>{
                    if(res.data.code===0){
                        console.log(res)
                        this.tableData=res.data.list
                        this.total=res.data.count
                        this.loading=false
                    }
                })
            },
            goBack(){
                this.$router.push({path:'/rechargeManagement'})
            }
            
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
</style>

