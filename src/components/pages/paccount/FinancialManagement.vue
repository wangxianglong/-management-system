<template>
    <div>
        <el-form :inline="true" :model="myData" class="form-inline" ref="myData">
            <!-- <el-form-item label="客户电话">
                <el-input v-model="searchList.name"></el-input>
            </el-form-item> -->
            <!-- <el-form-item label="营销情况">
                <el-select v-model="myData.intention" placeholder="请选择" style="margin-left:10px;">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item> -->
            <!-- <el-form-item label="企业ID">
                <el-input v-model="myData.ent_id"></el-input>
            </el-form-item> -->
            <el-form-item label="企业名称" prop="company">
                <el-input v-model="myData.company"></el-input>
            </el-form-item>
            <!-- <el-form-item label="充值金额">
                <el-input v-model="myData.amount"></el-input>
            </el-form-item> -->
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
            <el-form-item>
                <el-button type='primary' @click="getTableList"  size="small">搜索</el-button>
                <el-button @click="resetForm('myData')"  size="small">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="divider"></div>
        <div class="table-box">
        <el-table :data="tableData" style="width:100%;" show-header :header-cell-style="tableHeaderStyle" v-loading='loading' element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)" border>
            <el-table-column type="index" label="序号" :index="indexMethod" align="center"></el-table-column>
            <el-table-column label="企业ID" prop="ent_id" width="100px"></el-table-column>
            <el-table-column label="名称" prop="company"></el-table-column>
            <el-table-column label="所属代理商" prop="agent_name"></el-table-column>
            <el-table-column label="充值金额" prop="amount"></el-table-column>
            <el-table-column label="事项说明" prop="content"></el-table-column>
            <el-table-column label="提交时间" prop="createTime" width="160px">
                <template slot-scope="scope">
                    <span>{{scope.row.createTime | date(true)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="支付方式" prop="type">
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
            <el-table-column label="操作" width="200px" align="center">
                <template slot-scope="scope">
                    <el-button v-if='scope.row.status === 1' type="primary" size="mini" @click="moderate(scope.row)">审核通过</el-button>
                    <el-button v-if='scope.row.status === 2' type="text" size="mini">已通过</el-button>
                    <el-button v-if='scope.row.status === 1' type="danger" size="mini" @click="retreat(scope.row)">退回</el-button>
                    <el-button v-if='scope.row.status === 3' type="text" size="mini" style="color:red">已退回</el-button>
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
                    company:'',
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
                 
                let params=this.myData
                  
                this.$http.get(this.$api.platform.rechargeDetail,{params:params}).then(res=>{
                    if(res.data.code===0){
                        //console.log(res)
                        this.tableData=res.data.list
                        this.total=res.data.count
                        this.loading=false
                    }
                })
            },
            moderate(row){
                let params = row
                params.status = 2
                this.$http.post(this.$api.platform.rechargeUpdate,params).then(res => {
                    if(res.data.code === 0){
                        this.$message.success(res.data.msg)
                        this.getTableList()
                    }
                })
            },
            retreat(row){
                let params = row
                params.status = 3
                this.$http.post(this.$api.platform.rechargeUpdate,params).then(res => {
                    if(res.data.code === 0){
                        this.$message.success(res.data.msg)
                        this.getTableList()
                    }
                })
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

