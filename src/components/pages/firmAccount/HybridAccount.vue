<template>
    <div>
        <el-form :inline="true" class="form-inline" v-model="myData">
            <el-form-item label="用户名称">
                <el-input v-model="myData.userName"></el-input>
            </el-form-item>
            
            <el-form-item label="手机号">
                <el-input v-model="myData.phoneNum"></el-input>
            </el-form-item>
            <el-form-item label="注册时间">
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
            <el-form-item label="角色">
                <el-select class="mySelect" v-model="myData.roleId" placeholder="请选择" style="margin-left:10px; width:150px;">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' style="margin-left:50px;" @click="getTablelist">搜索</el-button>
            </el-form-item>
        </el-form>
        <div class="small-divider"></div>
        <div style="padding:17px 0 17px 20px">
           <el-button type='primary' @click="addAccount">新增</el-button>
        </div>
        <!--弹框-->
        <el-dialog title="新增号码" :visible.sync="dialogbox" width="40%">
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
            <el-form :model="formList" label-width="200px" size="small" ref="formList">
                <el-form-item label="用户名/账号" prop="userName">
                <el-input v-model="formList.userName"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="passWord">
                    <el-input type="passWord" v-model="formList.passWord"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="realName">
                    <el-input v-model="formList.realName" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="phoneNum">
                    <el-input v-model="formList.phoneNum" placeholder="请输入手机号码"></el-input>
                </el-form-item>
                <el-form-item label="关联班长" v-if="isShow" prop="agentId">
                    <el-select v-model="formList.agentId" placeholder="请选择" @change="selectGet">
                        <el-option v-for="item in phoneList" :key="item.id" :label="item.userName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="small-divider"></div>
            <span slot="footer">
                <el-button @click="dialogbox = false">取 消</el-button>
                <el-button type="primary" @click="add('formList')">确 定</el-button>
            </span>
        </el-dialog>
        <div class="divider"></div>
        <!--table表格-->
        <div class="table-box">
        <el-table :data="tableData" style="width:100%;" show-header>
            <el-table-column type="index" label="序号" :index="indexMethod" align="center"></el-table-column>
            <el-table-column label="用户名称" prop="userName" sortable></el-table-column>
            <el-table-column label="姓名" prop="realName" sortable></el-table-column>
            <el-table-column label="角色">
                <template slot-scope="scope">
                    <span v-if="scope.row.roleId===4">班长</span>
                    <span v-if="scope.row.roleId===5">坐席</span>
                    <span v-if="scope.row.roleId===6">质检</span>
                </template>
            </el-table-column>
            <el-table-column label="分机号码" prop="phoneNum" sortable></el-table-column>
            <el-table-column label="创建时间" prop="createTime" sortable>
                <template slot-scope="scope">
                    {{scope.row.createTime | date(true)}}
                </template>
            </el-table-column>
            <el-table-column label="最近登录时间" prop="lastLoginTime" sortable></el-table-column>
            <!-- <el-table-column label="登录IP" prop="cgnum" sortable></el-table-column> -->
            <!-- <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="handleAmend(scope.$index,scope.row)">修改</el-button>
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
                time:null,
                myData:{
                    pageIndex:1,
                    pageSize:10,
                    roleId:3
                },
                isShow:true,
                phoneList:[{
                    value:"选项1",
                    num :123344
                }],
                formList:{
                    userName:'',
                    passWord:'',
                    realName:'',
                    phoneNum:'',
                    agentId:''
                },
                radio:5,
                dialogbox:false,
                value:'',
                options:[{
                    value:3,
                    label:"全部"
                },{
                    value: '5',
                    label: '坐席'
                }, {
                    value: '6',
                    label: '质检'
                },{
                    value:'4',
                    label:'班长'
                }],
                tableData:[],
                total:1,
                selectId:null,
            }
        },
        methods:{
            selectGet(vId){//这个vId也就是value值
                this.formList.obj = this.phoneList.find((item)=>{//这里的userList就是上面遍历的数据源
                    return item.id === vId;//筛选出匹配数据
            });
                console.log(this.formList.obj.id);//我这边的name就是对应label的
            },
            handleCurrentChange(val) {
                this.myData.pageIndex =val;
                this.getTablelist()
            },
            handleSizeChange(val){
                this.myData.pageSize=val;
                this.getTablelist()
            },
            getTablelist(){
                if(this.time!==null){
                    this.myData.startTime=this.time[0]
                    this.myData.endTime=this.time[1]
                }else{
                    delete this.myData.startTime
                    delete this.myData.endTime
                }
                let token=this.$cookieStore.getCookie('token')
                let params=this.myData
                params.token=token
                this.$http.get(this.$api.firm.userList,{params:params}).then(res=>{
                    if(res.data.code===0){
                        //console.log(res)
                        this.tableData=res.data.list
                        this.total=res.data.count
                    }
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
            addAccount(){
                let agentId=JSON.parse(sessionStorage.getItem("agentId"))
                let params={pageIndex:0,pageSize:10000,agentId:agentId}
                this.$http.get(this.$api.platform.agendList,{params:params}).then(res=>{
                    if(res.data.code===0){
                        console.log(res)
                        this.phoneList=res.data.list
                        this.dialogbox = true
                    }
                })   
            },
            add(formList){
                let id=JSON.parse(sessionStorage.getItem("agentId"))
                let roleId=this.radio
                let userName=this.formList.userName
                let passWord=this.formList.passWord
                let realName=this.formList.realName
                let phoneNum=this.formList.phoneNum
                if(this.isShow){
                    this.formList.agentId=this.formList.obj.id
                    //console.log(this.selectId)
                }
                let params={roleId:roleId,userName:userName,passWord:passWord,realName:realName,phoneNum:phoneNum,agentId:this.formList.agentId,id:id}
                this.$http.post(this.$api.platform.addUser,params).then(res=>{
                    if(res.data.code===0){
                        //console.log(res)
                        this.getTablelist()
                    }
                }).catch(error=>{
                    console.log(error)
                })
                this.$refs['formList'].resetFields();
                this.dialogbox  = false
            }, 
        },
        created(){
            this.getTablelist()
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
