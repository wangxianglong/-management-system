<template>
    <div>
        <el-form :inline="true" class="form-inline" v-model="myData">
            <el-form-item label="用户名称">
                <el-input v-model="myData.userName"></el-input>
            </el-form-item>
            
            <el-form-item label="分机号码">
                <el-input v-model="myData.phoneNum"></el-input>
            </el-form-item>
            <el-form-item label="角色">
                <el-select class="mySelect" v-model="myData.roleId" placeholder="请选择" style="margin-left:10px; width:150px;">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' style="margin-left:50px;" @click="getTableList">搜索</el-button>
            </el-form-item>
        </el-form>
        <div class="small-divider"></div>
        <div style="padding:17px 0 17px 20px">
            <el-button type="primary" v-if = "roleId == 1" @click="goBack">返回</el-button>
            <!-- <el-button type="primary" @click="addPhone">新增</el-button> -->
        </div>
        <!--弹框-->
        <el-dialog title="新增号码" :visible.sync="addDialog" width="500px">
            <div class="small-divider"></div>
            <div class="radioGroup">
                <span style="margin-right:30px">账号类型</span>
                <el-radio-group v-model="radio" @change="changeHandler">
                    <el-radio :label="5">坐席</el-radio>
                    <el-radio :label="4">班长</el-radio>
                    <el-radio :label="6">质检</el-radio>
                </el-radio-group>
             </div>
             <div class="small-divider" style="margin-bottom:10px"></div>
             <el-form :model="addformList" label-width="100px" size="small" ref="addformList">
                 <el-form-item label="用户名/账号" prop="userName" >
                    <el-input v-model="addformList.userName"></el-input>
                 </el-form-item>
                 <el-form-item label="密码" prop="passWord">
                     <el-input type="passWord" v-model="addformList.passWord"></el-input>
                 </el-form-item>
                 <el-form-item label="姓名" prop="realName">
                     <el-input v-model="addformList.realName" placeholder="请输入姓名"></el-input>
                 </el-form-item>
                 <el-form-item label="手机号码" prop="phoneNum">
                     <el-input v-model="addformList.phoneNum" placeholder="请输入手机号码"></el-input>
                 </el-form-item>
                 <el-form-item label="关联班长" v-if="isShow" prop="agentId">
                     <el-select v-model="addformList.agentId" placeholder="请选择"  @change="selectGet">
                         <el-option v-for="item in phoneList" :key="item.id" :label="item.userName" :value="item.id"></el-option>
                     </el-select>
                 </el-form-item>
             </el-form>
             <div class="small-divider"></div>
             <span slot="footer">
                <el-button @click="addDialog = false">取 消</el-button>
                <el-button type="primary" @click="add('addformList')">确 定</el-button>
            </span>
        </el-dialog>
        <div class="divider"></div>
        <!--table表格-->
        <div class="table-box">
        <el-table :data="tableData" style="width:100%;" show-header>
            <el-table-column type="index" label="序号" :index="indexMethod" align="center"></el-table-column>
            <el-table-column label="用户名称" prop="userName" ></el-table-column>
            <el-table-column label="用户密码" prop="passWord" ></el-table-column>
            <el-table-column label="姓名" prop="realName" ></el-table-column>
            <el-table-column label="角色">
                <template slot-scope="scope">
                    <span v-if="scope.row.roleId===4">班长</span>
                    <span v-if="scope.row.roleId===5">座席</span>
                    <span v-if="scope.row.roleId===6">质检</span>
                </template>
            </el-table-column>
            <el-table-column label="端口号" prop="phoneNum" ></el-table-column>
            <el-table-column label="创建时间" prop="createTime" >
                <template slot-scope="scope">
                    <span>{{scope.row.createTime | date(true)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="最近登录时间" prop="lastLoginTime" ></el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span v-if='scope.row.status===1'>启用</span>
                    <span style='color:red' v-if='scope.row.status===2'>停用</span>
                </template>
            </el-table-column>
            <!-- <el-table-column label="登录IP" prop="cgnum" sortable></el-table-column> -->
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" v-if='scope.row.status===2' @click="startUsing(scope.row)">启用</el-button>
                    <el-button type="danger" size="mini" v-if='scope.row.status===1' @click="stopUsing(scope.row)">停用</el-button>
                    <!-- <el-button type="text" size="mini" @click="loginUsing(scope.row)">登录</el-button> -->
                    <el-button type="text" size="mini" v-if = "roleId == 1" @click="deleteUsing(scope.row)">注销</el-button>
                </template>
            </el-table-column>
        </el-table>
        </div>
        <!--修改弹框-->
        <!-- <el-dialog title="修改号码" :visible.sync="amendDialog" width="500px">
            <div class="small-divider"></div>
            <div class="radioGroup">
                <span style="margin-right:30px">账号类型</span>
                <el-radio-group v-model="radio1" @change="changeHandler">
                    <el-radio :label="5">坐席</el-radio>
                    <el-radio :label="4">班长</el-radio>
                    <el-radio :label="6">质检</el-radio>
                </el-radio-group>
             </div>
             <div class="small-divider" style="margin-bottom:10px"></div>
             <el-form :model="amendformList" label-width="100px" size="small">
                 <el-form-item label="用户名/账号">
                    <el-input v-model="amendformList.username"></el-input>
                 </el-form-item>
                 <el-form-item label="密码">
                     <el-input v-model="amendformList.password"></el-input>
                 </el-form-item>
                 <el-form-item label="姓名">
                     <el-input v-model="amendformList.name" placeholder="请输入姓名"></el-input>
                 </el-form-item>
                 <el-form-item label="手机号码">
                     <el-input v-model="amendformList.tel" placeholder="请输入手机号码"></el-input>
                 </el-form-item>
                 <el-form-item label="关联班长" v-if="isShow">
                     <el-select v-model="value" placeholder="请选择">
                         <el-option v-for="item in phoneList" :key="item.id" :label="item.realName" :value="item.id"></el-option>
                     </el-select>
                 </el-form-item>
             </el-form>
             <div class="small-divider"></div>
             <span slot="footer">
                <el-button @click="amendDialog = false">取 消</el-button>
                <el-button type="primary" @click="amend">确 定</el-button>
            </span>
        </el-dialog> -->
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
                myData:{
                    pageIndex:1,
                    pageSize:10,
                    roleId:3,
                },
                phoneList:[],
                isShow:true,
                addformList:{},
                // amendformList:{
                //     username:'',
                //     password:'',
                //     name:'',
                //     tel:''
                // },
                radio1:5,
                radio:5,
                addDialog:false,
                //amendDialog:false,
                value:'',
                options:[{
                    value: '5',
                    label: '坐席'
                }, {
                    value: '6',
                    label: '质检'
                },{
                    value:'4',
                    label:'班长'
                },{
                    value:3,
                    label:'全部'
                }],
                tableData:[],
                total:1,
                agentId:'',
                roleId:sessionStorage.getItem('roleId')
            }
        },
        methods:{
            selectGet(vId){//这个vId也就是value值
                this.addformList.obj = this.phoneList.find((item)=>{//这里的userList就是上面遍历的数据源
                    return item.id === vId;//筛选出匹配数据
            });
                console.log(this.addformList.obj.id);//我这边的name就是对应label的
            },
            handleCurrentChange(val) {
                this.myData.pageIndex =val;
                this.getTableList()
            },
            handleSizeChange(val){
                this.myData.pageSize=val;
                this.getTableList()
            },
            //获取列表
            getTableList(){
                if(window.location.href.split('?').length!==1){
                    this.agentId=this.$route.query.agentId
                }else{
                    this.agentId=sessionStorage.getItem('agentId')
                }
                let params=this.myData
                params.agentId = this.agentId
                this.$http.get(this.$api.platform.userList,{params:params}).then(res=>{
                    if(res.data.code===0){
                        //console.log(res)
                        if(res.data.list){
                            this.tableData=res.data.list
                            this.total=res.data.count
                        }
                    }
                }).catch(error=>{
                    console.log(error)
                })
            },
            //新增号码
            add(addformList){
                let id=this.myData.agentId
                let roleId=this.radio
                let userName=this.addformList.userName
                let passWord=this.addformList.passWord
                let realName=this.addformList.realName
                let phoneNum=this.addformList.phoneNum
                if(this.isShow){
                    this.addformList.agentId=this.addformList.obj.id
                    //console.log(this.selectId)
                }
                let params={roleId:roleId,userName:userName,passWord:passWord,realName:realName,phoneNum:phoneNum,agentId:this.addformList.agentId,id:id}
                this.$http.post(this.$api.platform.addUser,params).then(res=>{
                    if(res.data.code===0){
                        //console.log(res)
                        this.getTableList()
                    }
                }).catch(error=>{
                    console.log(error)
                })
                this.$refs['addformList'].resetFields();
                this.addDialog = false
            }, 
            addPhone(){
                let params={pageIndex:0,pageSize:10000,agentId:this.myData.agentId}
                this.$http.get(this.$api.platform.agendList,{params:params}).then(res=>{
                    if(res.data.code===0){
                        //console.log(res)
                        this.phoneList=res.data.list
                        this.addDialog = true
                    }
                })  
            },
            //操作
            startUsing(row){
                let userId = row.id
                let enable = true
                let params = {userId:userId,enable:enable}
                this.$http.get(this.$api.platform.userEnable,{params:params}).then( res=> {
                    if(res.data.code ===0){
                        this.$message({
                            message:res.data.msg,
                            type:'success'
                        })
                        this.getTableList()
                    }
                })
            },
            stopUsing(row){
                let userId = row.id
                let enable = false
                let params = {userId:userId,enable:enable}
                this.$http.get(this.$api.platform.userEnable,{params:params}).then( res=> {
                    if(res.data.code ===0){
                        this.$message({
                            message:res.data.msg,
                            type:'success'
                        })
                        this.getTableList()
                    }
                })
            },
            loginUsing(row){
                // let userName=row.userName
                // let passWord=row.passWord
                // this.$http.post(this.$api.login.login,{
                //     userName,
                //     passWord
                // }).then( res => {
                //     if(res.data.data.status=="success"){
                //         this.$store.commit("GET_ID",res.data.data.id)
                //         this.$store.commit("GET_USER",userName)
                //         this.$store.commit("GET_ROUTER",res.data.data.router)
                //         sessionStorage.setItem('roleId',res.data.data.roleId)
                //         sessionStorage.setItem('phoneNum',res.data.data.phoneNum)
                //         this.$message({
                //             message:'登录成功',
                //             type:'success'
                //         })
                //         let name=JSON.parse(sessionStorage.getItem("router"))[0].path
                //         this.$router.push({name:name})
                //     }else{
                //         this.$message({
                //             message:res.data.data.msg,
                //             type:'error'
                //         })  
                //     }
                // })
            },
            deleteUsing(row){
                this.$confirm('此操作将永久注销'+row.userName+'坐席和对应'+row.phoneNum+'端口号', '是否继续?', '提示', {
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
                        message: '已取消注销'
                    });          
                })
            },
            changeHandler(value){
                 if(value=="5"){
                     this.isShow=true
                 }else{
                     this.isShow=false
                 }
            },
            indexMethod(index) {
                return index+1;
            },
            goBack(){
                this.$router.push({name:'zhsystem'})
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
    .radioGroup {
        text-align: center;
        padding:10px 0 5px 0
    }
</style>
