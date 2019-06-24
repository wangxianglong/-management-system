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
                <el-input v-model="myData.provide"></el-input>
            </el-form-item>
            <el-form-item label="名称">
                <el-input v-model="myData.area"></el-input>
            </el-form-item>
            <el-form-item label="充值金额">
                <el-input v-model="myData.rechargeTotal"></el-input>
            </el-form-item>
            <el-form-item label="充值次数">
                <el-input v-model="myData.area"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' @click="getTableList"  style="margin-left:50px;">搜索</el-button>
            </el-form-item>
        </el-form>
        <div class="divider"></div>
        <div class="table-box">
        <el-table :data="tableData" style="width:100%;" show-header v-loading='loading' element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
            <el-table-column label="企业ID" prop="entId" width="100px"></el-table-column>
            <el-table-column label="名称" prop="company"></el-table-column>
            <el-table-column label="充值金额" prop="rechargeTotal">
                <template slot-scope="scope">
                    <span>{{scope.row.rechargeTotal | toString()}}</span>
                </template>
            </el-table-column>
            <el-table-column label="充值次数" prop="rechargeCount"></el-table-column>
            <el-table-column label="消费金额" prop="consumeTotal"></el-table-column>
            <el-table-column label="余额" prop="balance">
                <template slot-scope="scope">
                    <span>{{scope.row.balance | toString()}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="topUp(scope.row)">充值</el-button>
                    <el-button type="text" size="mini" @click="detail(scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        </div>
        <!--弹框-->
        <el-dialog title="充值" :visible.sync="topUpDialog" width="30%" :close-on-click-modal="false">
            <el-form :model="form" label-width="20%" ref='form' :rules="rules">
                <el-form-item prop="entId" label="企业Id">
                    <el-input placeholder="企业Id" v-model='form.entId' disabled></el-input>
                </el-form-item>
                <el-form-item prop="company" label="企业名称">
                    <el-input placeholder="企业名称" v-model="form.company" disabled></el-input>
                </el-form-item>
                <el-form-item prop="amount" label="充值金额">
                    <el-input placeholder="充值金额" v-model="form.amount"></el-input>
                </el-form-item>
                <el-form-item prop="type" label="充值方式">
                    <el-radio-group v-model="form.type">
                        <el-radio :label="1">支付宝</el-radio>
                        <el-radio :label="2">微信</el-radio>
                        <el-radio :label="3">银行卡</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="content" label="事项说明">
                    <el-input type="textarea" placeholder="事项说明" :rows=2 v-model="form.content"></el-input>
                </el-form-item>
                <el-form-item prop="submitter" label="提交人">
                    <el-input placeholder="输入提交人" v-model="form.submitter"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="topUpDialog = false">取 消</el-button>
                    <el-button type="primary" @click="saveRecharge('form')">提交审核</el-button>
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
                form:{
                },
                topUpDialog:false,
                loading:false,
                tableData:[
                    {
                        entId:1,
                        company:'测试',
                        name:222,
                        type:3,
                        aaa:33,
                        toName:'测试' 
                    }
                ],
                total:1,
                myData:{
                    pageIndex:1,
                    pageSize:10,
                    roleId:3
                },
                time:null,
                entRow:{},
                rules:{
                    amount:[
                        {required:true,message:'请填写充值金额',trigger:'blur'}
                    ],
                    type:[
                        {required:true,message:'请选择充值方式',trigger:'blur'}
                    ],
                    content:[
                        {required:true,message:'请填写事项说明',trigger:'blur'}
                    ],
                    submitter:[
                        {required:true,message:'请填写提交人',trigger:'blur'}
                    ]
                }
            }
        },
        methods:{
            
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
                let params=this.myData
                this.$http.get(this.$api.platform.userList,{params:params}).then(res=>{
                    if(res.data.code===0){
                        console.log(res)
                        this.tableData=res.data.list
                        this.total=res.data.count
                        this.loading=false
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            //表格选中事件
            // changeFun(val){
            //     this.selectList=val
            //     //console.log(this.selectList)
            // }, 
            topUp(row){
                this.form.entId = row.entId
                this.form.company = row.company
                this.form.userId = row.id
                this.topUpDialog=true
            },
            detail(row){
                let userId = row.id
                this.$router.push({path:'/rechargeDetail',query:{userId:userId}})
            },
            saveRecharge(form){
                this.$refs[form].validate((valid) => {
                    if(valid){
                        let token=this.$cookieStore.getCookie('token')
                        let params=this.form
                        params.status = 1
                        params.token=token
                        this.$http.post(this.$api.platform.recharge,params).then(res=>{
                            if(res.data.code===0){
                                this.$message.success(res.data.msg)
                                this.$refs[form].resetFields()
                                this.topUpDialog = false
                                this.getTableList()
                            }else{
                                this.$message.error('提交失败')
                            }
                        })
                    }else{
                        console.log('error submit!!');
                        return false;
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

