<template>
    <div>
        <el-form :inline="true" :model="myData" class="form-inline">
            <el-form-item label="号码">
                <el-input v-model="myData.showNumber"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="myData.status" placeholder="全部" style="margin-left:10px;">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="创建时间">
                <el-date-picker v-model="myData.num" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item> -->
            <el-form-item>
                <el-button type='primary' @click="getTableList"  style="margin-left:50px;">搜索</el-button>
            </el-form-item>
        </el-form>
        <div class="small-divider"></div>
        <div style="padding:17px 0 17px 20px">
            <el-button type="primary" @click="goBack" v-if='roleId == 1'>返回</el-button>
        </div>
        <div class="divider"></div>
        <div class="table-box">
        <el-table :data="tableData" style="width:100%;" show-header>
            <!-- <el-table-column type="selection"></el-table-column> -->
            <el-table-column type="index" label="序号" :index="indexMethod" align="center" width="200px"></el-table-column>
            <el-table-column label="号码" prop="showNumber"></el-table-column>
            <el-table-column label="使用次数" prop="useNum"></el-table-column>
            <el-table-column label="显示方式" prop="unDo">
                <template>
                    <el-button type="text">轮播</el-button>
                </template>
            </el-table-column>
            <el-table-column label="状态" sortable>
                <template  slot-scope="scope">
                    <el-button type="text" style="color:red" v-if="scope.row.status===0">未使用</el-button>
                    <el-button type="text" v-if="scope.row.status===1">使用中</el-button>
                    <el-button type="text" style="color:#000" v-if="scope.row.status===2">已停用</el-button>
                </template> 
            </el-table-column>
            <!-- <el-table-column label="创建时间" prop="using" sortable></el-table-column> -->
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.status!=1" @click="startUse(scope.row)">启用</el-button>
                    <el-button type="text" v-if="scope.row.status!=2&&scope.row.status!=0" @click="stopUse(scope.row)">停用</el-button>
                    <el-button style='color:red' type="text"  v-if='roleId == 1' @click="delNum(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        </div>
        <div class="fpage">
            <el-pagination class="pagebutton" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10,20,30,100]" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <!-- <el-dialog title="号码管理" :visible.sync="transferDialog" width="550px">
            <span>
            <el-transfer v-model="yesData" :props="{key: 'id',label: 'name'}" :titles="titles" @change="handleChange" :data="noData"></el-transfer>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="transferDialog = false">取 消</el-button>
                <el-button type="primary" @click="transferDialog = false">确 定</el-button>
            </span>
        </el-dialog> -->
        
    </div>
</template>
<script>
    export default {
        data(){
            return {
                roleId:sessionStorage.getItem('roleId'),
                usenum:1,
                unuse:2,
                using:4,
                stopuse:2,
                options:[{
                value: '0',
                label: '未使用'
                }, {
                value: '1',
                label: '使用中'
                }, {
                value: '2',
                label: '已停用'
                }],
                //transferDialog:false,
                // noData: [{id:1,name:'测试1'},{id:2,name:'测试2'},{id:3,name:'测试3'}],
                // yesData: [1,3],
                // titles:['未关联', '已关联'],
                myData:{
                    pageIndex:1,
                    pageSize:10,
                },
                // value:'',
                // createtime:'',
                tableData:[],
                //selectList:[],
                total:1,   
                userId:''
            }
        },
        methods:{
            // handleChange(value, direction, movedKeys) {
            // console.log(value, direction, movedKeys);
            //  //可以通过direction回调right/left 来进行操作，right：把数字移到右边，left把数据移到左边
            //  if(direction === "right") {
                
            //  }
            //  if(direction === "left") {
                
            //  }
                
            // },
            // changeFun(val){
            //     this.selectList=val
            //     console.log(this.selectList)
            // }, 
            indexMethod(index) {
                return index+1;
            },
            handleCurrentChange(val) {
                this.myData.pageIndex =val;
                this.getTableList()
            },
            handleSizeChange(val){
                this.myData.pageSize=val;
                this.getTableList()
            },
            // handleFp(index,row){
            //     console.log("分配")
            //     this.titles=["待使用","使用中"]
            //     this.transferDialog=true
            // },
            // addTel(){
            //     console.log('新增号码')
            //     this.transferDialog=true
            //     this.titles=["未使用","待使用"]
            // }
            //获取表格列表
            getTableList(){
                if(window.location.href.split('?').length!==1){
                    this.userId=this.$route.query.userId
                }else{
                    this.userId=sessionStorage.getItem('agentId')
                }
                let token=this.$cookieStore.getCookie('token')
                let params=this.myData
                params.userId = this.userId
                params.token=token
                this.$http.get(this.$api.firm.numList,{params:params}).then(res=>{
                    if(res.data.code===0){
                        console.log(res)
                        this.tableData=res.data.list
                        this.total=res.data.count
                    }
                })
            },
            startUse(row){
                let id=row.id
                let params={status:1,id:id}
                this.$http.post(this.$api.firm.update,params).then(res=>{
                    if(res.data.code===0){
                        this.getTableList()
                    }
                })
            },
            stopUse(row){
                let id=row.id
                let params={status:2,id:id}
                this.$http.post(this.$api.firm.update,params).then(res=>{
                    if(res.data.code===0){
                        this.getTableList()
                    }
                })
            },
            delNum(row){
                this.$confirm('此操作将永久删除'+row.showNumber, '是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let id = row.id
                    let params = {id:id}
                    this.$http.get(this.$api.platform.numberDelete,{params:params}).then( res=> {
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
            },
            goBack(){
                this.$router.push({path:'/exontotal'})
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
</style>
