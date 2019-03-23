<template>
    <div>
        <el-form :inline="true" :model="myData" class="form-inline">
            <el-form-item label="企业名称">
                <el-input v-model="myData.name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' @click="search"  style="margin-left:50px;">搜索</el-button>
            </el-form-item>
        </el-form>
        <div class="small-divider"></div>
        <div style="padding:17px 0 17px 20px"><el-button type="primary" @click="addTel">新增号码</el-button></div>
        <div class="divider"></div>
        <div class="table-box">
        <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width:100%;" show-header>
            <el-table-column type="index" label="序号" :index="indexMethod" align="center" width="100px;"></el-table-column>
            <el-table-column label="企业名称" prop="name" width="200px"></el-table-column>
            <el-table-column label="外显量" prop="num" width="200px"></el-table-column>
            <el-table-column label="使用中" prop="using" width="200px"></el-table-column>
            <el-table-column label="未使用" prop="unuse" width="200px"></el-table-column>
            <el-table-column label="已停用" prop="stopped" width="200px"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="handleFp(scope.$index,scope.row)">分配</el-button>
                </template>
            </el-table-column>
        </el-table>
        </div>
        <div class="fpage">
            <el-pagination class="pagebutton" background @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="400">
            </el-pagination>
        </div>
        <!--新增号码-->
        <el-dialog title="号码管理" :visible.sync="transferDialog" width="550px">
            <span>
            <el-transfer v-model="yesData" :props="{key: 'id',label: 'name'}" :titles="['未使用', '待使用']" @change="handleChange" :data="noData"></el-transfer>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="transferDialog = false">取 消</el-button>
                <el-button type="primary" @click="transferDialog = false">确 定</el-button>
            </span>
        </el-dialog>
        <!--分配任务-->
        <el-dialog title="号码管理" :visible.sync="tasktransferDialog" width="550px">
            <span>
            <el-transfer v-model="rightData" :props="{key: 'id',label: 'name'}" :titles="['待使用','使用中']" @change="myOperate" :data="leftData"></el-transfer>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="tasktransferDialog = false">取 消</el-button>
                <el-button type="primary" @click="tasktransferDialog = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                transferDialog:false,
                noData: [{id:1,name:'测试1'},{id:2,name:'测试2'},{id:3,name:'测试3'}],
                yesData: [1,3],
                tasktransferDialog:false,
                leftData: [{id:1,name:'测试1'},{id:2,name:'测试2'},{id:3,name:'测试3'}],
                rightData: [],
                myData:{
                    name:''
                },
                value:'',
                createtime:'',
                tableData:[{
                    name:'aa',
                    num:234,
                    using:10,
                    unuse:4,
                    stopped:3
                },{
                    name:'aa',
                    num:234,
                    using:10,
                    unuse:4,
                    stopped:3
                },{
                    name:'aa',
                    num:234,
                    using:10,
                    unuse:4,
                    stopped:3
                },{
                    name:'aa',
                    num:234,
                    using:10,
                    unuse:4,
                    stopped:3
                }],
                currentPage:1,
                pagesize:10,
            }
        },
        methods:{
            handleChange(value, direction, movedKeys) {
            console.log(value, direction, movedKeys);
             //可以通过direction回调right/left 来进行操作，right：把数字移到右边，left把数据移到左边
             if(direction === "right") {
                
             }
             if(direction === "left") {
                
             }
                
            },
            myOperate(value, direction, movedKeys) {
            console.log(value, direction, movedKeys);
             //可以通过direction回调right/left 来进行操作，right：把数字移到右边，left把数据移到左边
             if(direction === "right") {
                
             }
             if(direction === "left") {
                
             }
                
            },

            indexMethod(index) {
                return index+1;
            },
            handleCurrentChange(currentPage) {
                this.currentPage =currentPage;
            },
            handleFp(index,row){
                console.log("分配")
                this.tasktransferDialog=true
            },
            search(){
                console.log('搜索')
            },
            addTel(){
                console.log('新增号码')
                this.transferDialog=true
            }
        },
        created(){

        }
    }
</script>
<style scoped>
    .pagebutton {
        float:right
    }
</style>
