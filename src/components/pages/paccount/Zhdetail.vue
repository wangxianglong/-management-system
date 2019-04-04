<template>
    <div>
        <el-form :inline="true" class="form-inline" v-model="searchList">
            <el-form-item label="用户名称">
                <el-input v-model="searchList.name"></el-input>
            </el-form-item>
            
            <el-form-item label="分机号码">
                <el-input v-model="searchList.account"></el-input>
            </el-form-item>
            <el-form-item label="角色">
                <el-select class="mySelect" v-model="value" placeholder="请选择" style="margin-left:10px; width:150px;">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' style="margin-left:50px;">搜索</el-button>
            </el-form-item>
        </el-form>
        <div class="small-divider"></div>
        <div style="padding:17px 0 17px 20px">
            <el-button type="primary" @click="goBack">返回</el-button>
            <el-button type="primary" @click="addPhone">新增</el-button>
        </div>
        <!--弹框-->
        <el-dialog title="新增号码" :visible.sync="addDialog" width="500px">
            <div class="small-divider"></div>
            <div class="radioGroup">
                <span style="margin-right:30px">账号类型</span>
                <el-radio-group v-model="radio" @change="changeHandler">
                    <el-radio label="坐席"></el-radio>
                    <el-radio label="班长"></el-radio>
                    <el-radio label="质检"></el-radio>
                </el-radio-group>
             </div>
             <div class="small-divider" style="margin-bottom:10px"></div>
             <el-form :model="addformList" label-width="100px" size="small">
                 <el-form-item label="用户名/账号">
                    <el-input v-model="addformList.username"></el-input>
                 </el-form-item>
                 <el-form-item label="密码">
                     <el-input v-model="addformList.password"></el-input>
                 </el-form-item>
                 <el-form-item label="坐席姓名">
                     <el-input v-model="addformList.name" placeholder="请输入姓名"></el-input>
                 </el-form-item>
                 <el-form-item label="手机号码">
                     <el-input v-model="addformList.tel" placeholder="请输入手机号码"></el-input>
                 </el-form-item>
                 <el-form-item label="关联班长" v-if="isShow">
                     <el-select v-model="value" placeholder="请选择">
                         <el-option v-for="item in phoneList" :key="item.value" :label="item.num" :value="item.value"></el-option>
                     </el-select>
                 </el-form-item>
             </el-form>
             <div class="small-divider"></div>
             <span slot="footer">
                <el-button @click="addDialog = false">取 消</el-button>
                <el-button type="primary" @click="add">确 定</el-button>
            </span>
        </el-dialog>
        <div class="divider"></div>
        <!--table表格-->
        <div class="table-box">
        <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width:100%;" show-header>
            <el-table-column type="index" label="序号" :index="indexMethod" align="center"></el-table-column>
            <el-table-column label="用户名称" prop="name" sortable></el-table-column>
            <el-table-column label="姓名" prop="num" sortable></el-table-column>
            <el-table-column label="角色" prop="xfnum" sortable></el-table-column>
            <el-table-column label="分机号码" prop="hcnum" sortable></el-table-column>
            <el-table-column label="创建时间" prop="bdnum" sortable></el-table-column>
            <el-table-column label="最近登录时间" prop="htnum" sortable></el-table-column>
            <el-table-column label="登录IP" prop="cgnum" sortable></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="handleAmend(scope.$index,scope.row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        </div>
        <!--修改弹框-->
        <el-dialog title="修改号码" :visible.sync="amendDialog" width="500px">
            <div class="small-divider"></div>
            <div class="radioGroup">
                <span style="margin-right:30px">账号类型</span>
                <el-radio-group v-model="radio1" @change="changeHandler">
                    <el-radio label="坐席"></el-radio>
                    <el-radio label="班长"></el-radio>
                    <el-radio label="质检"></el-radio>
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
                         <el-option v-for="item in phoneList" :key="item.value" :label="item.num" :value="item.value"></el-option>
                     </el-select>
                 </el-form-item>
             </el-form>
             <div class="small-divider"></div>
             <span slot="footer">
                <el-button @click="amendDialog = false">取 消</el-button>
                <el-button type="primary" @click="amend">确 定</el-button>
            </span>
        </el-dialog>
        <div class="fpage">
            <el-pagination class="pagebutton" background @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="400">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                searchList:{
                    name:'',
                    account:''
                },
                isShow:true,
                phoneList:[{
                    value:"选项1",
                    num :123344
                }],
                addformList:{
                    username:'',
                    password:'',
                    name:'',
                    tel:''
                },
                amendformList:{
                    username:'',
                    password:'',
                    name:'',
                    tel:''
                },
                radio1:'坐席',
                radio:"坐席",
                addDialog:false,
                amendDialog:false,
                value:'',
                options:[{
                    value: '选项1',
                    label: '坐席'
                }, {
                    value: '选项2',
                    label: '质检'
                },{
                    value:'选项3',
                    label:'班长'
                }],
                tableData:[{
                    name:'aa',
                    num:234,
                    xfnum:23,
                    hcnum:333,
                    bdnum:4556,
                    htnum:455,
                    cgnum:34545,
                },{
                    name:'aa',
                    num:234,
                    xfnum:23,
                    hcnum:333,
                    bdnum:4556,
                    htnum:455,
                    cgnum:34545,
                },{
                    name:'aa',
                    num:234,
                    xfnum:23,
                    hcnum:333,
                    bdnum:4556,
                    htnum:455,
                    cgnum:34545,
                },{
                    name:'aa',
                    num:234,
                    xfnum:23,
                    hcnum:333,
                    bdnum:4556,
                    htnum:455,
                    cgnum:34545,
                }],
                currentPage:1,
                pagesize:10,
            }
        },
        methods:{
            //获取列表
            getTableList(){
                let agentId=this.$route.query.agentId
                let params={roleId:3,agentId:agentId,pageIndex:1,pageSize:5}
                this.$http.get(this.$api.platform.userList,{params:params}).then(res=>{
                    if(res.data.code===0){
                        console.log(res)
                    }
                }).catch(error=>{
                    console.log(error)
                })
            },
            //新增号码
            add(){
                this.addDialog = false
                
            },
            addPhone(){
                this.addDialog=true;
            },
            //修改号码
            amend(){
                this.amendDialog = false
            },
            handleAmend(index,row){
                this.amendDialog=true;
            },
            changeHandler(value){
                 if(value=="坐席"){
                     this.isShow=true
                 }else{
                     this.isShow=false
                 }
            },
            indexMethod(index) {
                return index+1;
            },
            handleCurrentChange(currentPage) {
                this.currentPage =currentPage;
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
