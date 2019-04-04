<template>
    <div>
        <div style="padding:17px 40px 20px 17px">
            <el-button type="primary">联通</el-button>
            <el-button type="primary">移动</el-button>
            <el-button type="primary">电信</el-button>
        </div>
        <div class="small-divider" style="margin-bottom:10px"></div>
        <!-- <el-form :inline="true" class="form-inline" v-model="searchList">
            <el-form-item label="状态">
                <el-select class="mySelect" v-model="value" placeholder="全部" style="margin-left:10px; width:150px;">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' style="margin-left:50px;">搜索</el-button>
            </el-form-item>
        </el-form>
        <div class="small-divider"></div> -->
        <div style="padding:17px 40px 20px 17px">
            <!-- <el-button type="primary">批量删除</el-button> -->
            <el-button type="primary" @click="addBtn">添加</el-button>
            <!-- <span style="margin-left:40px">剩余联/信/移账户量2/3/4</span>
            <span style="margin-left:20px">为匹配账户量 2</span> -->
        </div>
        <el-dialog title="添加账号" :visible.sync="addDialog" width="30%">
            <el-form :model="user">
                <el-form-item prop="username" label="账号"> 
                    <el-input placeholder="账号" v-model='user.cuccId' style="width:300px"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input placeholder="密码" v-model='user.cuccPwd' show-password style="width:300px"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="add">确 定</el-button>
            </span>
        </el-dialog>
        <div class="divider"></div>
        <!--table表格-->
        <div class="table-box">
        <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width:100%;" show-header>
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index" label="序号" :index="indexMethod" align="center"></el-table-column>
            <el-table-column label="联通账户" prop="cuccId"></el-table-column>
            <el-table-column label="关联状态">
                <template  slot-scope="scope">
                    <el-button type="text" style="color:red" v-if="scope.row.status===0">未使用</el-button>
                    <el-button type="text" v-if="scope.row.status===1">使用中</el-button>
                </template> 
            </el-table-column>
            <!-- <el-table-column label="关联账户" prop="xfnum" sortable></el-table-column> -->
            <!-- <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="handlesy(scope.$index,scope.row)">修改</el-button>
                    <el-button type="text" size="mini" @click="handletg(scope.$index,scope.row)">关联</el-button>
                </template>
            </el-table-column> -->
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
                user:{
                    cuccId:null,
                    cuccPwd:null
                },
                addDialog:false,
                searchList:{
                    name:'',
                    account:''
                },
                value:'',
                options:[{
                    value: '选项1',
                    label: '全部'
                }, {
                    value: '选项2',
                    label: '已关联'
                },{
                    value:'选项3',
                    label:'未关联'
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
            indexMethod(index) {
                return index+1;
            },
            handleCurrentChange(currentPage) {
                this.currentPage =currentPage;
            },
            getTableList(){
                this.$http.get(this.$api.cucc.cuccUserList).then(res=>{
                    if(res.data.code===0){
                        //console.log(res)
                        this.tableData=res.data.list
                        this.addDialog=false
                    }
                })
            },
            addBtn(){
                this.addDialog=true
            },
            add(){
                let params={cuccId:this.user.cuccId,cuccPwd:this.user.cuccPwd}
                this.$http.post(this.$api.cucc.save,params).then(res=>{
                    if(res.data.code===0){
                        //console.log(res)
                        //this.tableData=res.data.list
                    }
                })
            }
            // handlesy(index,row){
            //     console.log("kanban")
            // },
            // handletg(index,row){
            //     console.log("kanban")
            // },
            
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
    
</style>
