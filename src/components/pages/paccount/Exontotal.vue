<template>
    <div>
        <el-form :inline="true" :model="myData" class="form-inline">
            <el-form-item label="企业名称">
                <el-input v-model="myData.company"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' @click="getTableList"  style="margin-left:50px;">搜索</el-button>
            </el-form-item>
        </el-form>
        <!-- <div class="small-divider"></div>
        <div style="padding:17px 0 17px 20px"><el-button type="primary" @click="addTel">新增号码</el-button></div> -->
        <div class="divider"></div>
        <div class="table-box">
        <el-table :data="tableData" style="width:100%;" show-header>
            <el-table-column type="index" label="序号" :index="indexMethod" align="center" width="100px;"></el-table-column>
            <el-table-column label="企业名称" prop="company" width="200px"></el-table-column>
            <el-table-column label="外显量" prop="num" width="200px"></el-table-column>
            <!-- <el-table-column label="使用中" prop="using" width="200px"></el-table-column>
            <el-table-column label="未使用" prop="unuse" width="200px"></el-table-column>
            <el-table-column label="已停用" prop="stopped" width="200px"></el-table-column> -->
            <el-table-column label="外显新增">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="addBtn(scope.$index,scope.row)">新增</el-button>
                </template>
            </el-table-column>
            <el-table-column label="显示方式">
                <template>
                    <el-button type="text" size="mini">轮播</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="detail(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        </div>
        <div class="fpage">
            <el-pagination class="pagebutton" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20,30,100]" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <!--新增号码-->
        <!-- <el-dialog title="号码管理" :visible.sync="transferDialog" width="550px">
            <span>
            <el-transfer v-model="yesData" :props="{key: 'id',label: 'name'}" :titles="['未使用', '待使用']" @change="handleChange" :data="noData"></el-transfer>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="transferDialog = false">取 消</el-button>
                <el-button type="primary" @click="transferDialog = false">确 定</el-button>
            </span>
        </el-dialog> -->
        <!--分配任务-->
        <!-- <el-dialog title="号码管理" :visible.sync="tasktransferDialog" width="550px">
            <span>
            <el-transfer v-model="rightData" :props="{key: 'id',label: 'name'}" :titles="['待使用','使用中']" @change="myOperate" :data="leftData"></el-transfer>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="tasktransferDialog = false">取 消</el-button>
                <el-button type="primary" @click="tasktransferDialog = false">确 定</el-button>
            </span>
        </el-dialog> -->
        <el-dialog title="新增" :visible.sync="addDialog" width="550px">
            <span style="vertical-align:top;">外显号码：</span><el-input type="textarea" :rows="5" placeholder="请输入外显号码" v-model="addNum" style="width:300px"></el-input>
            <p style='color:red;margin-left:205px'>
                多个号码之间请用逗号隔开
            </p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialog = false">取 消</el-button>
                <el-button type="primary" @click="addItem">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                addNum:null,
                addDialog:false,
                //transferDialog:false,
                // noData: [{id:1,name:'测试1'},{id:2,name:'测试2'},{id:3,name:'测试3'}],
                // yesData: [1,3],
                // tasktransferDialog:false,
                // leftData: [{id:1,name:'测试1'},{id:2,name:'测试2'},{id:3,name:'测试3'}],
                // rightData: [],
                myData:{
                    pageIndex:1,
                    pageSize:10,
                },
                value:'',
                createtime:'',
                tableData:[],
                
                item:null,
                total:1
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
            // myOperate(value, direction, movedKeys) {
            // console.log(value, direction, movedKeys);
            //  //可以通过direction回调right/left 来进行操作，right：把数字移到右边，left把数据移到左边
            //  if(direction === "right") {
                
            //  }
            //  if(direction === "left") {
                
            //  }
                
            // },

            indexMethod(index) {
                return index+1;
            },
            handleCurrentChange(val) {
                this.myData.pageIndex =val;
                this.getTableList()
            },
            handleSizeChange(val){
                this.pageSize=val;
                this.getTableList()
            },
            // handleFp(index,row){
            //     console.log("分配")
            //     this.tasktransferDialog=true
            // },
            // addTel(){
            //     console.log('新增号码')
            //     this.transferDialog=true
            // }
            //获取表格列表
            getTableList(){
                let params=this.myData
                this.$http.get(this.$api.platform.companyList,{params:params}).then(res=>{
                    if(res.data.code===0){
                        this.tableData=res.data.list
                        this.total=res.data.count
                        //console.log(this.tableData)
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            addBtn(index,row){
                this.addDialog=true
                this.item=row
            },
            addItem(){
                let userId=this.item.id
                let showNumber=this.addNum
                let params={userId:userId,showNumber:showNumber}
                if(showNumber!==null){
                    this.$http.post(this.$api.platform.save,params).then(res=>{
                        if(res.data.code===0){
                            //console.log(res)
                            this.addDialog=false
                            this.getTableList()
                            this.$message.success(res.data.msg)
                        }else{
                            this.$message.error('操作失败')
                        }
                    })
                }else{
                    this.$message({
                        type:'error',
                        message:'请按要求输入外显号码'
                    })
                    return
                }
            },
            detail(row){
                let userId = row.id 
                this.$router.push({path:'/numberpublic',query:{userId:userId}})
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
