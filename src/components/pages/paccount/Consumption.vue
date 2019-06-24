<template>
    <div>
        <el-form :inline="true" :model="myData" class="form-inline">
            <!-- <el-form-item label="客户电话">
                <el-input v-model="searchList.name"></el-input>
            </el-form-item> -->
            <!-- <el-form-item label="营销情况">
                <el-select v-model="myData.intention" placeholder="请选择" style="margin-left:10px;">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="企业ID">
                <el-input v-model="myData.ent_id"></el-input>
            </el-form-item>
            <el-form-item label="名称">
                <el-input v-model="myData.company"></el-input>
            </el-form-item>
            <el-form-item label="数据量">
                <el-input v-model="myData.data_count"></el-input>
            </el-form-item>
            <el-form-item label="座席数">
                <el-input v-model="myData.seat_count"></el-input>
            </el-form-item>
            <el-form-item label="语言时长">
                <el-input v-model="myData.time_long"></el-input>
            </el-form-item>
            <!-- <el-form-item label="通话时长：">
                <el-input v-model="tableData.stdate"></el-input>
            </el-form-item> -->
            <el-form-item>
                <el-button type='primary' @click="getTableList"  style="margin-left:50px;">搜索</el-button>
            </el-form-item>
        </el-form>
        <div class="divider"></div>
        <div class="table-box">
        <el-table :data="tableData" style="width:100%;" show-header @selection-change="changeFun" v-loading='loading' element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
            <!-- <el-table-column type="selection"></el-table-column> -->
            <el-table-column type="index" label="序号" :index="indexMethod" align="center"></el-table-column>
            <el-table-column label="企业ID" prop="ent_id" width="100px"></el-table-column>
            <el-table-column label="名称" prop="company"></el-table-column>
            <el-table-column label="数据量" prop="data_count"></el-table-column>
            <el-table-column label="数据费(元)" prop="data_amount"></el-table-column>
            <el-table-column label="座席数" prop="seat_count"></el-table-column>
            <el-table-column label="座席费(元)" prop="seat_fee"></el-table-column>
            <el-table-column label="语音时长" prop="time_long"></el-table-column>
            <el-table-column label="语音费(元)" prop="voice_amount" width="100px"></el-table-column>
            <el-table-column label="定制费(元)" prop="model_amount"></el-table-column>
            <!-- <el-table-column label="其他" prop='others'>
            </el-table-column> -->
            <el-table-column label="累积消费金额(元)" prop='consume_total'  width="130px">
                <template slot-scope="scope">
                    <span>{{scope.row.consume_total | toString()}}</span>
                </template>
            </el-table-column>
            <el-table-column label="余额(元)" prop="balance">
                <template slot-scope="scope">
                    <span>{{scope.row.balance | toString()}}</span>
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
                },
                time:null,
                agentId:''
            }
        },
        methods:{
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
                    console.log(1)
                   this.myData.startTime=this.time[0];
                   this.myData.endTime =this.time[1];
                }else{
                    delete this.myData.startTime
                    delete this.myData.endTime
                }
                if(sessionStorage.getItem('agentId') == 1){
                    this.agentId = null
                }else{
                    this.agentId=sessionStorage.getItem('agentId')
                }
                let token=this.$cookieStore.getCookie('token')
                let params=this.myData
                params.token=token
                params.id = this.agentId
                this.$http.get(this.$api.platform.consumeStat,{params:params}).then(res=>{
                    if(res.data.code===0){
                        console.log(res)
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
</style>

