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
        <!--弹框-->
        <!-- <el-dialog :title="dialogTitle" :visible.sync="dialogbox" width="40%">
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
        </el-dialog> -->
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
                    {{scope.row.createTime | date}}
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
                // dialogTitle:'',
                // isShow:true,
                // phoneList:[{
                //     value:"选项1",
                //     num :123344
                // }],
                // formList:{
                //     username:'',
                //     password:'',
                //     name:'',
                //     tel:''
                // },
                // radio:"坐席",
                // dialogbox:false,
                // value:'',
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
                total:1
            }
        },
        methods:{
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
            // changeHandler(value){
            //      if(value=="坐席"){
            //          this.isShow=true
            //      }else{
            //          this.isShow=false
            //      }
            // },
            indexMethod(index) {
                return index+1;
            },
            // handlexg(index,row){
            //     console.log("修改")
            //     this.dialogbox=true;
            //     this.dialogTitle="修改号码"
            // },
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
    /* .radioGroup {
        text-align: center;
        padding:10px 0 5px 0
    } */
</style>
