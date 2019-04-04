<template>
    <div>
        <el-form :inline="true" class="form-inline" v-model="searchList">
            <el-form-item label="用户名称">
                <el-input v-model="searchList.name"></el-input>
            </el-form-item>
            
            <el-form-item label="手机号">
                <el-input v-model="searchList.account"></el-input>
            </el-form-item>
            <el-form-item label="注册时间">
                <el-date-picker v-model="searchList.time" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="状态">
                <el-select class="mySelect" v-model="value" placeholder="请选择" style="margin-left:10px; width:150px;">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' style="margin-left:50px;">搜索</el-button>
            </el-form-item>
        </el-form>
        <div class="small-divider"></div>
        <!--弹框-->
        <el-dialog :title="dialogTitle" :visible.sync="dialogbox" width="40%">
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
             <el-form :model="formList" label-width="200px" size="small">
                 <el-form-item label="用户名/账号">
                    <el-input v-model="formList.username"></el-input>
                 </el-form-item>
                 <el-form-item label="密码">
                     <el-input v-model="formList.password"></el-input>
                 </el-form-item>
                 <el-form-item label="坐席姓名">
                     <el-input v-model="formList.name" placeholder="请输入姓名"></el-input>
                 </el-form-item>
                 <el-form-item label="分机号码">
                     <el-input v-model="formList.tel" placeholder="请输入手机号码"></el-input>
                 </el-form-item>
                 <el-form-item label="关联分机" v-if="isShow">
                     <el-select v-model="value" placeholder="请选择">
                         <el-option v-for="item in phoneList" :key="item.value" :label="item.num" :value="item.value"></el-option>
                     </el-select>
                 </el-form-item>
             </el-form>
             <div class="small-divider"></div>
             <span slot="footer">
                <el-button @click="dialogbox = false">取 消</el-button>
                <el-button type="primary" @click="dialogbox = false">确 定</el-button>
            </span>
        </el-dialog>
        <div class="divider"></div>
        <!--table表格-->
        <div class="table-box">
        <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width:100%;" show-header>
            <el-table-column type="index" label="序号" :index="indexMethod" align="center"></el-table-column>
            <el-table-column label="用户名称" prop="name" sortable></el-table-column>
            <el-table-column label="坐席姓名" prop="num" sortable></el-table-column>
            <el-table-column label="角色" prop="xfnum" sortable></el-table-column>
            <el-table-column label="分机号码" prop="hcnum" sortable></el-table-column>
            <el-table-column label="创建时间" prop="bdnum" sortable></el-table-column>
            <el-table-column label="最近登录时间" prop="htnum" sortable></el-table-column>
            <el-table-column label="登录IP" prop="cgnum" sortable></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="handlexg(scope.$index,scope.row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        </div>
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
                dialogTitle:'',
                isShow:true,
                phoneList:[{
                    value:"选项1",
                    num :123344
                }],
                formList:{
                    username:'',
                    password:'',
                    name:'',
                    tel:''
                },
                radio:"坐席",
                dialogbox:false,
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
            getTablelist(){
                this.$http.get(this.$api.firm.userList).then(res=>{
                    if(res.data.code===0){
                        console.log(res)
                    }
                })
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
            handlexg(index,row){
                console.log("修改")
                this.dialogbox=true;
                this.dialogTitle="修改号码"
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
