<template>
    <div>
        <el-form :inline="true" :model="myData" class="form-inline" ref="myData">
            
            <el-form-item label="公司名称" prop="company">
                <el-input v-model="myData.company"></el-input>
            </el-form-item>
            
            <el-form-item label="状态" prop="status">
                <el-select v-model="myData.status" placeholder="请选择" style="margin-left:10px;">
                    <el-option v-for="item in statusType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' @click="getTableList"  style="margin-left:50px;" size="small">搜索</el-button>
                <el-button  @click="resetForm('myData')" size="small">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="divider"></div>
        <div class="table-box">
        <el-table :data="tableData" style="width:100%;" show-header v-loading='loading' :header-cell-style="tableHeaderStyle" element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
            <el-table-column type="index" label="序号" :index="indexMethod" align="center"></el-table-column>
            <el-table-column label="企业ID" prop="ent_id" ></el-table-column>
            <el-table-column label="企业名称" prop="company" width="150px"></el-table-column>
            <el-table-column label="坐席费(元/个)" prop="seatFee" ></el-table-column>
            <el-table-column label="语音费(元/分)" prop="voiceFee" ></el-table-column>
            <el-table-column label="套餐费(元)" prop="set">
                <template slot-scope="scope">
                    <span>{{scope.row.set === 1?'850':'0'}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column label="待审核坐席费" prop="amount"  width='120px'></el-table-column>
            <el-table-column label="待审核语音费" prop="amount"  width='120px'></el-table-column>
            <el-table-column label="待审核套餐费" prop="amount" width='120px'></el-table-column> -->
            <el-table-column label="提交时间" prop="createTime" width="150px">
                <template slot-scope="scope">
                    <span>{{scope.row.createTime | date(true)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" prop="status">
                <template slot-scope="scope">
                    <el-button type='text' style='color:red' v-if = "scope.row.status===1">待审核</el-button>
                    <el-button type="text" v-if = "scope.row.status===2">通过</el-button>
                    <el-button style="color:red" type="text" v-if = "scope.row.status===3">退回</el-button>
                    <el-button style="color:red" type="text" v-if = "scope.row.status===4">已过期</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200px">
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
                    company:null,
                    status:null
                },
                time:null,
                statusType: [{
                    value: '1',
                    label: '待审核'
                }, {
                    value: '2',
                    label: '通过'
                },{
                    value: '3',
                    label: '退回'
                },{
                    value:'4',
                    label:'已过期'
                }],
            }
        },
        methods:{
            resetForm(myData){
                this.$refs[myData].resetFields()
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
                //    this.myData.startTime=this.time[0];
                //    this.myData.endTime =this.time[1];
                // }else{
                //     delete this.myData.startTime
                //     delete this.myData.endTime
                // }
                 
                let params=this.myData
                  
                this.$http.get(this.$api.platform.selectSingle,{params:params}).then(res=>{
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
                this.$http.post(this.$api.platform.updateSingle,params).then(res => {
                    if(res.data.code === 0){
                        this.$message.success(res.data.msg)
                        this.getTableList()
                    }
                })
            },
            retreat(row){
                let params = row
                params.status = 3
                this.$http.post(this.$api.platform.updateSingle,params).then(res => {
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

