<template>
    <div>
        <el-form :inline="true" :model="myData" class="form-inline">
            <el-form-item label="号码">
                <el-input v-model="myData.num"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="myData.status" placeholder="全部" style="margin-left:10px;">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-date-picker v-model="myData.num" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' @click="search"  style="margin-left:50px;">搜索</el-button>
            </el-form-item>
        </el-form>
        <div class="small-divider"></div>
        <div style="padding:17px 0 17px 20px">
            <el-button type="primary" @click="addTel">分配</el-button>
            <el-button type="primary" @click="addTel">释放</el-button>
            <span style="margin:0 10px 0 40px">当前外显号码使用量{{usenum}}</span><span style="margin:0 10px">未使用过外显号码{{unuse}}</span><span style="margin:0 10px">使用中外显号码{{using}}</span><span style="margin:0 10px">已停用外显号码{{stopuse}}</span>
        </div>
        <div class="divider"></div>
        <div class="table-box">
        <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width:100%;" show-header @selection-change="changeFun">
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index" label="序号" :index="indexMethod" align="center" width="200px"></el-table-column>
            <el-table-column label="号码" prop="name" width="300px" sortable></el-table-column>
            <el-table-column label="使用次数" prop="num" width="300px" sortable></el-table-column>
            <el-table-column label="状态" prop="num" width="300px" sortable></el-table-column>
            <el-table-column label="创建时间" prop="using" sortable></el-table-column>
        </el-table>
        </div>
        <div class="fpage">
            <el-pagination class="pagebutton" background @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="400">
            </el-pagination>
        </div>
        <el-dialog title="号码管理" :visible.sync="transferDialog" width="550px">
            <span>
            <el-transfer v-model="yesData" :props="{key: 'id',label: 'name'}" :titles="titles" @change="handleChange" :data="noData"></el-transfer>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="transferDialog = false">取 消</el-button>
                <el-button type="primary" @click="transferDialog = false">确 定</el-button>
            </span>
        </el-dialog>
        
    </div>
</template>
<script>
    export default {
        data(){
            return {
                usenum:1,
                unuse:2,
                using:4,
                stopuse:2,
                options:[{
                value: '选项1',
                label: '未分配'
                }, {
                value: '选项2',
                label: '已分配'
                }, {
                value: '选项3',
                label: '已开始'
                }, {
                value: '选项4',
                label: '已完成'
                }, {
                value: '选项5',
                label: '已退回'
                },{
                value: '选项6',
                label: '已暂停'
                },{
                value: '选项7',
                label: '已过期'
                }],
                transferDialog:false,
                noData: [{id:1,name:'测试1'},{id:2,name:'测试2'},{id:3,name:'测试3'}],
                yesData: [1,3],
                titles:['未关联', '已关联'],
                myData:{
                    num:'',
                    status:''
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
                selectLis:[]
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
            changeFun(val){
                this.selectList=val
                console.log(this.selectList)
            }, 
            indexMethod(index) {
                return index+1;
            },
            handleCurrentChange(currentPage) {
                this.currentPage =currentPage;
            },
            handleFp(index,row){
                console.log("分配")
                this.titles=["待使用","使用中"]
                this.transferDialog=true
            },
            search(){
                console.log('搜索')
            },
            addTel(){
                console.log('新增号码')
                this.transferDialog=true
                this.titles=["未使用","待使用"]
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
