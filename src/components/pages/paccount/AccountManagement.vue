<template>
    <div>
        <el-form :inline="true" :model="myData" class="form-inline" ref="myData">
            <el-form-item label="账号" prop="userName">
                <el-input v-model="myData.userName"></el-input>
            </el-form-item>
            <el-form-item label="角色名称" prop="roleId">
                <el-select v-model="myData.roleId" placeholder="请选择">
                    <el-option v-for="item in roleNameList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="通话时间">
                <template>
                    <el-date-picker
                            v-model="time"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd hh:mm:ss"
                    >
                    </el-date-picker>
                </template>
            </el-form-item> -->
            <el-form-item label="使用人" prop="realName">
                <el-input v-model="myData.realName"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' @click="getTableList"  size="small">搜索</el-button>
                <el-button  @click="resetForm('myData')"  size="small">重置</el-button>
            </el-form-item>
        </el-form>
         <div class="small-divider"></div>
        <div style="padding:20px">
            <el-button type="primary" @click='addUsing'>创建管理账户</el-button>
        </div>
        <!--弹框-->
        <el-dialog title="新增管理账户" :visible.sync="addNewUsing" width="30%" :close-on-click-modal="false">
            <el-form :model="form" :rules='rules' label-width="20%" class="formPage" label-position='right' ref="form">
                <el-form-item label="账号" prop="userName">
                    <el-input placeholder="请输入账号" v-model="form.userName">
                    </el-input>
                </el-form-item>
                <el-form-item label="密码" prop="passWord">
                    <el-input type="passWord" placeholder="请输入密码" v-model="form.passWord">
                    </el-input>
                </el-form-item>
                <el-form-item label="角色名称" prop="roleId">
                    <el-select v-model="form.roleId" placeholder="请选择">
                        <el-option v-for="item in roleNameList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
                    </el-select>    
                </el-form-item>
                <el-form-item label="使用人" prop="realName">
                    <el-input v-model="form.realName"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="phoneNum">
                    <el-input v-model="form.phoneNum"></el-input>
                </el-form-item>
                <el-form-item size="medium" align='center'>
                    <el-button @click="addNewUsing = false">取 消</el-button>
                    <el-button type="primary" @click="add('form')">提交审核</el-button>
                </el-form-item>
            </el-form> 
        </el-dialog>
        <div class="divider"></div>
        <div class="table-box">
        <el-table :data="tableData" style="width:100%;" show-header :header-cell-style="tableHeaderStyle" v-loading='loading' element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
            <el-table-column type="index" label="序号" :index="indexMethod" align="center"></el-table-column>
            <el-table-column label="账号" prop="userName"></el-table-column>
            <el-table-column label="密码" prop="passWord"></el-table-column>
            <el-table-column label="使用人" prop="realName">
            </el-table-column>
            <el-table-column label="联系方式" prop="phoneNum"></el-table-column>
            <el-table-column label="角色权限" prop="roleName"></el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span v-if='scope.row.status===3' style="color:red">待审核</span>
                    <span v-if='scope.row.status===1'>通过</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200px">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" v-if='scope.row.status===3' @click="passUsing(scope.row)">审核通过</el-button>
                    <el-button type="danger" size="mini" @click="deleteUsing(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        </div>
        <div class="fpage">
            <el-pagination class="pagebutton" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20,30,100]" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
        <!-- <div v-for="(item, index) in audios" :key="index">
            <vAudio :theUrl="item.url" :theControlList="item.controlList"/>
        </div> -->
    </div>
</template>
<script>
    export default {
        data(){
            return {
                form:{},
                roleNameList:[],
                addNewUsing:false,
                phoneNumList:[],
                loading:false,
                tableData:[],
                total:1,
                myData:{
                    pageIndex:1,
                    pageSize:10,
                    userName:'',
                    roleId:'',
                    realName:''
                },
                time:null,
                rules:{
                    userName:[
                        { required:true, message:'请输入账号名称',trigger:'blur'},
                        { min: 2, max: 7, message: '长度在 2 到 7 个字符', trigger: 'blur' }
                    ],
                    passWord:[
                        { required:true, message:'请输入账号密码',trigger:'blur'},
                    ],
                    roleId:[
                        { required:true, message:'请选择角色名称',trigger:'blur'},
                    ],
                    realName:[
                        { required:true, message:'请填写使用人',trigger:'blur'},
                    ],
                    phoneNum:[
                        { required:true, message:'请填写联系方式',trigger:'blur'},
                    ] 
                }
            }
        },
        mounted(){
            this.$http.get(this.$api.role.roleList).then(res => {
                this.roleNameList = res.data.roleList
            })
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
                 
                let params=this.myData
                let company = "网聚海数"
                  
                params.company = company
                this.$http.get(this.$api.user.userList,{params:params}).then(res=>{
                    if(res.data.code===0){
                        console.log(res)
                        this.tableData=res.data.list
                        this.total=res.data.count
                        this.loading=false
                    }
                })
            },
            addUsing(){
                this.addNewUsing = true
            },
            add(form){
                this.$refs[form].validate((valid) => {
                    if(valid){
                        let params = this.form
                        this.$http.post(this.$api.user.userSave,params).then(res => {
                            if(res.data.code===0){
                                this.$message.success('提交成功')
                                this.addNewUsing = false
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
                
            },
            passUsing(row){
                let id=row.id
                let params={id:id,status:1}
                this.$http.post(this.$api.platform.update,params).then(res=>{
                    if(res.data.code===0){
                        this.getTableList()
                    }
                }).catch(error=>{
                    console.log(error)
                })
            },
            deleteUsing(row){
                this.$confirm('此操作将永久删除'+row.userName+'账号', '是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let userId = row.id
                    let params = {userId:userId}
                    this.$http.get(this.$api.platform.delete,{params:params}).then( res=> {
                        if(res.data.code ===0){
                            this.$message({
                                message:res.data.msg,
                                type:'success'
                            })
                            this.getTableList()
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
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

