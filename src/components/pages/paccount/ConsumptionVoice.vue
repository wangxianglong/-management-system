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
        </div>
        <div class="divider"></div>
        <div class="table-box">
        <el-table :data="tableData" style="width:100%;" show-header :header-cell-style="tableHeaderStyle" v-loading='loading' element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)" border>
            <el-table-column type="index" label="序号" :index="indexMethod" align="center" width="50"></el-table-column>
            <el-table-column label="所属班长" prop="creator"></el-table-column>
            <el-table-column label="所属坐席" prop="amount"></el-table-column>
            <el-table-column label="通话开始时间" prop="time">
                 <template slot-scope="scope">
                    <span>{{scope.row.time}}</span>
                    <!-- <el-button size="mini" v-if="scope.row.type==='定制费'" @click="addModelBtn" style="float:right">增加</el-button>
                    <el-button size="mini" v-if="scope.row.type==='调账'" @click="manualRecBtn" style="float:right">调账</el-button> -->
                </template>
            </el-table-column>
            <el-table-column label="通话结束时间" prop="time">
                 <template slot-scope="scope">
                    <span>{{scope.row.time}}</span>
                </template>
            </el-table-column>
            <el-table-column label="通话时长(秒)" prop="time">
                 <template slot-scope="scope">
                    <span>{{scope.row.time}}</span>
                </template>
            </el-table-column>
            <el-table-column label="费用(元)" prop="reason">
                <template slot-scope="scope">
                    <span>{{scope.row.reason}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="consumerItem(scope.row)">查看</el-button>
                </template>
            </el-table-column> -->
        </el-table>
        </div>
        <!--弹框-->
        <!-- <el-dialog title="调账" :visible.sync="manualRecDialog" width="40%" :close-on-click-modal="false" :destroy-on-close="true">
            <div class="divider"></div>
            <el-form :model="form" :rules='rules' label-width="30%" class="formPage" label-position='right' ref="form">
                <el-form-item label="企业：" prop="userId">
                    <el-input  v-model="form.userId" class='myInput' disabled>
                    </el-input>
                </el-form-item>
                <el-form-item label="调账人：" prop="creator">
                    <el-input v-model="form.creator" class='myInput'></el-input>
                </el-form-item>
                <el-form-item label="调账金额：" prop="amount">
                    <el-input type="number" v-model="form.amount" class='myInput'></el-input>
                </el-form-item>
                <el-form-item label="调账理由：" prop="reason">
                    <el-input type="textarea" v-model="form.reason" class='myInput'></el-input>
                </el-form-item>
                <el-form-item size="medium">
                    <el-button @click="manualRecDialog = false">取 消</el-button>
                    <el-button type="primary" @click="manualRec('form')">提交</el-button>
                </el-form-item>
            </el-form> 
        </el-dialog> -->
        
        <!-- <div class="fpage">
            <el-pagination class="pagebutton" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20,30,100]" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div> -->
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
                    modelName:[
                        { required:true, message:'请输入模型名称',trigger:'blur'},
                    ],
                    modelFee:[
                        { required:true, message:'请选择模型价格',trigger:'blur'},
                    ],
                    creator:[
                        { required:true, message:'请填写创建人',trigger:'blur'},
                    ],
                    amount:[
                        { required:true, message:'请填写调账金额',trigger:'blur'},
                    ],
                    reason:[
                        { required:true, message:'请填写调账理由',trigger:'blur'},
                    ],
                },
                // total:1,
                myData:{
                    pageIndex:1,
                    pageSize:10,
                },
                time:'',
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
            // handleCurrentChange(val) {
            //     this.myData.pageIndex=val;
            //     this.getTableList()
            // },
            // handleSizeChange(val){
            //     this.myData.pageSize=val;
            //     this.getTableList()
            // },
            //获取表格列表
            getTableList(){
                // if (this.time!==''){
                //    this.myData.startTime=this.time[0];
                //    this.myData.endTime =this.time[1];
                // }else{
                //     this.myData.startTime =null;
                //     this.myData.endTime = null
                // }
                // this.loading=true
                // let params=this.myData
                // params.id = this.$route.query.id
                // this.$http.get(this.$api.platform.consumeStat,{params:params}).then(res=>{
                //     if(res.data.code===0){
                //         this.tableData=res.data.list
                //         this.total=res.data.count
                //         this.loading=false
                //     }
                // })
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
    .myColor{
        color:red
    }
    .myInput{
        width:60%
    }
</style>

