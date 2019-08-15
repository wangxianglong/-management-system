<template>
    <div>
        <el-form :inline="true" :model="myData" class="form-inline" ref="myData">
            <el-form-item label="消费日期" prop="time">
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
            <el-form-item>
                <el-button type='primary' @click="getTableList"  size="mini">搜索</el-button>
                <el-button @click="resetForm('myData')" size="mini">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="small-divider"></div>
        <div style="padding:17px 0 17px 20px">
            <el-button type="primary" size="small" @click="$router.go(-1)">返回</el-button>
            <el-button type="danger" size="small" @click="modelStopBtn" style="float:right;margin-right:50px;width:100px">是否继续使用</el-button>
        </div>
        <div class="divider"></div>
        <div class="table-box">
        <el-table :data="tableData" style="width:100%;" show-header :header-cell-style="tableHeaderStyle" v-loading='loading' element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)" border>
            <el-table-column type="index" label="序号" :index="indexMethod" align="center" width="50"></el-table-column>
            <el-table-column label="模型名称" prop="model_name"></el-table-column>
            <el-table-column label="记录人" prop="logger"></el-table-column>
            <el-table-column label="记录日期" prop="log_time">
                <template slot-scope="scope">
                    <span>{{scope.row.log_time | date(true)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="记录状态" prop="is_used">
                <template slot-scope="scope">
                    <span v-if="scope.row.is_used===0" style='color:red'>停用</span>
                    <span v-if="scope.row.is_used===1">使用</span>
                </template>
            </el-table-column>
            <!-- <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="consumerItem(scope.row)">继续启用</el-button>
                </template>
            </el-table-column> -->
        </el-table>
        </div>
        <!--弹框-->
        <el-dialog title="停用" :visible.sync="modelStopDialog" width="40%" :close-on-click-modal="false" :destroy-on-close="true">
            <div class="divider"></div>
            <el-form :model="form" :rules='rules' label-width="30%" class="formPage" label-position='right' ref="form">
                <el-form-item label="记录人：" prop="logger">
                    <el-input v-model="form.logger" class='myInput'></el-input>
                </el-form-item>
                <el-form-item label="状态：" prop="isUsed">
                    <el-radio-group v-model="form.isUsed">
                        <el-radio :label="0">停用</el-radio>
                        <el-radio :label="1">使用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item size="medium">
                    <el-button @click="modelStopDialog = false">取 消</el-button>
                    <el-button type="danger" @click="modelStop('form')">提交</el-button>
                </el-form-item>
            </el-form> 
        </el-dialog>
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
                rules:{
                    logger:[
                        { required:true, message:'请填写记录人',trigger:'blur'},
                    ],
                    isUsed:[
                        { required:true, message:'请选择使用状态',trigger:'blur'},
                    ],
                },
                total:1,
                myData:{
                    pageIndex:1,
                    pageSize:10,
                },
                time:'',
                modelStopDialog:false,
                form:{}
            }
        },
        methods:{
            resetForm(myData) {
                this.$refs[myData].resetFields();
                this.time=''
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
                if (this.time!==''){
                   this.myData.startTime=this.time[0];
                   this.myData.endTime =this.time[1];
                }else{
                    this.myData.startTime =null;
                    this.myData.endTime = null
                }
                this.loading=true
                let params=this.myData
                params.modelId=this.$route.query.modelId
                this.$http.get(this.$api.platform.modelConfiglistLog,{params:params}).then(res=>{
                    if(res.data.code===0){
                        this.tableData=res.data.list
                        this.total=res.data.count
                        this.loading=false
                    }
                })
            },
            modelStopBtn(){
                this.modelStopDialog=true
            },
            modelStop(){
                let params=this.form
                params.modelId=this.$route.query.modelId
                this.$http.post(this.$api.platform.modelConfiginsertLog,params).then(res=>{
                    if(res.data.code===0){
                        this.$message.success(res.data.msg)
                        this.getTableList()
                        this.modelStopDialog=false
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
    .myColor{
        color:red
    }
    .myInput{
        width:60%
    }
</style>

