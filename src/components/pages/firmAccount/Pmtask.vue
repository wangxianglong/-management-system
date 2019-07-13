<template>
    <div class="itemadd">
        <el-form :inline="true" class="form-inline" :model="myData">
            <el-form-item label="班长名">
                <el-input placeholder="请输入班长名" size="small" v-model="myData.userName" clearable></el-input>
            </el-form-item>
            <!--
            <el-form-item label="数据量">
                <el-input v-model="searchList.activityname"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select class="mySelect" v-model="value" placeholder="全部" style="margin-left:10px;">
                    <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开始时间">
                <el-date-picker v-model="searchList.time" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
                <el-date-picker v-model="searchList.time" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            -->
            <el-form-item>
                <el-button type='primary' @click="getTablelist" size="small">搜索</el-button>
            </el-form-item>
            
        </el-form>
        <div class="small-divider"></div>
        <div style="padding:20px">
            <el-button type="primary" @click='assignedBtn'>分配</el-button>
            <!--<el-button type="primary" @click='returnBtn'>退回</el-button>-->
            <!--<el-button type="primary" @click='amendBtn'>修改</el-button>-->
            <el-button type="primary" @click='backBtn'>返回</el-button>
            <span style="margin-left:40px">当前可分配客户量：{{count}}</span>
        </div>
        <div class="divider"></div>
        <!--弹框-->
        <el-dialog title="批量分配" :visible.sync="taskDialog" width="30%">
            <span>当前勾选班长 {{num1}} 人</span>
            <span>平均每人分配</span>
            <input type="text" :placeholder="holder" v-model="myNum" class="dialogInput">
            <span>条数据</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="taskDialog = false">取 消</el-button>
            <el-button type="primary" @click="assignedTasks">确 定</el-button>
        </span>
        </el-dialog>
        <!--
        <el-dialog title="批量退回" :visible.sync="returnDialog" width="30%">
            <span>当前勾选坐席 {{num2}} 人</span>
            <span>确定退回全部  {{num2}}  条数据？</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="returnDialog = false">取 消</el-button>
            <el-button type="primary" @click="goReturn">确 定</el-button>
        </span>
        </el-dialog>
        
        <el-dialog title="批量删除" :visible.sync="deleteDialog" width="30%">
            <span>当前勾选坐席 {{num4}} 人</span>
            <span>可删除项目坐席 {{num5}} 确认删除？</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="deleteDialog = false">取 消</el-button>
            <el-button type="primary" @click="myDelete">确 定</el-button>
        </span>
        </el-dialog>
        
        <el-dialog title="修改" :visible.sync="amendDialog" width="30%">
            <span>当前坐席 可修改数据量 范围</span> 
            <input type="text" placeholder="1005~29067" class="dialogInput">
            <span>确认修改？</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="amendDialog = false">取 消</el-button>
            <el-button type="primary" @click="amend">确 定</el-button>
        </span>
        </el-dialog>
        -->
        <div class="table-box">
        <el-table :data="tableData" :row-key="getRowKeys" style="width:100%;" show-header :header-cell-style="tableHeaderStyle" @selection-change="handleSelectionChange" ref="multipleTable">
            <el-table-column type="selection" :reserve-selection="true"></el-table-column>
            <!--<el-table-column type="index" label="序号" :index="indexMethod" align="center" width="300px"></el-table-column>-->
            <el-table-column label="班长" prop="userName" align="center"></el-table-column>
            <el-table-column label="客户量" prop="num" sortable align="center"></el-table-column>
            <!--
            <el-table-column label="状态" sortable align="center"> 
                <template  slot-scope="scope">
                    <el-button type="text" style="color:red" v-if="scope.row.status===0">已完成</el-button>
                    <el-button type="text" v-if="scope.row.status===1">拨打中</el-button>
                    <el-button type="text" style="color:#000" v-if="scope.row.status===2">未完成</el-button>
                </template> 
            </el-table-column>
            
            <el-table-column label="任务开始时间" prop="startTime" sortable></el-table-column>
            <el-table-column label="任务结束时间" prop="endTime" sortable></el-table-column>
            
            <el-table-column label="修改时间">
                <template slot-scope="scope">
                    <el-button type="text" @click="taskEdit(scope.$index,scope.row)">2019-2-12</el-button>
                </template>
            </el-table-column>
            -->
        </el-table>
        </div>
        <!--分页导航-->
        <div class="fpage">
            <el-pagination class="pagebutton" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20,30,100]" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
    </div>
</template>
<script>

    export default {
        data(){
            return {
                total:1,
                holder:null,
                selectList:[],
                myNum:null,
                taskDialog:false,
                num1:12, 
                //returnDialog:false,
                //num2:12,
                //deleteDialog:false,
                //num4:3,
                //num5:2,
                //amendDialog:false,
                myData:{
                    pageIndex:1,
                    pageSize:10,
                    activityId:this.$route.query.id,
                    status:this.$route.query.status
                }, 
                multipleSelection:[],
                count:1,
                selectName:'',
                firmName:[],
                search:'',
                activityShow:false,
                activityList:[],
                dialogVisible:false,
                value:'', 
                
                name:'',
                num:'',
                // options2: [{
                //     value: '选项1',
                //     label: '未分配'
                // }, {
                //     value: '选项2',
                //     label: '已分配'
                // },{
                //     value: '选项3',
                //     label: '已开始'
                // },{
                //     value: '选项4',
                //     label: '已完成'
                // },{
                //     value: '选项5',
                //     label: '已退回'
                // },{
                //     value: '选项6',
                //     label: '已暂停'
                // },{
                //     value: '选项7',
                //     label: '已过期'
                // }],
                
                tableData:[],
                //taskId:null,
            }
        },
        methods:{
            //初始化
            init (){
                
            },
            getRowKeys(row){
                return row.id
            },
            //表格选中事件
            handleSelectionChange(val){
                var that=this
                this.multipleSelection=val
                //console.log(this.multipleSelection)
            }, 
            handleCurrentChange(val) {
                this.myData.pageIndex =val;
                this.getTablelist()
            },
            handleSizeChange(val){
                this.myData.pageSize=val;
                this.getTablelist()
            },
            //获取表格列表
            getTablelist(){
                 
                let params=this.myData
                  
                //console.log(status+'jia')
                //console.log(activityId)
                this.$http.get(this.$api.firm.monitorList,{params:params}).then(res=>{
                    if(res.data.code===0){
                        //console.log(res)
                        this.tableData=res.data.list
                        this.total=res.data.pageCount
                        this.count=res.data.count
                        //let arr=this.tableData
                        // if(status==1){
                        //     for(let i=0;i<this.tableData.length;i++){
                        //         //this.tableData[i].num=0
                        //         this.$set(this.tableData[i],'num',0)
                        //         //console.log("aaa")
                        //     } 
                        // }
                        
                    }
                })
            },
            //分配
            assignedBtn(){
                if (this.multipleSelection.length === 0) {
                    this.$message({
                        message: '请至少勾选一项，再进行操作',
                        type: 'warning'
                    });
                    
                } else {
                    this.num1=this.multipleSelection.length
                    this.taskDialog=true
                    
                }
            },
            assignedTasks(){
                if(this.myNum*this.num1>this.count){
                    this.$message.warning('分配数量不足')
                    return false
                }
                var arr=this.multipleSelection
                let multis=[]
                for(var i=0;i<arr.length;i++){
                    multis.push(arr[i].id);
                    //console.log(multis)
                }
                let activityId=this.$route.query.id
                let num=this.myNum
                let ids=multis
                //console.log(ids)
                let params={activityId:activityId,num:num,ids:ids}
                //console.log(activityId)
                this.$http.post(this.$api.firm.assignMonitor,params).then(res=>{
                    if(res.data.code===0){
                        //this.tableData=res.data.list
                        this.taskDialog=false
                        this.getTablelist()
                    }
                })
                
                this.$refs.multipleTable.clearSelection()
            },
            //退回
            // returnBtn(){
            //     if (this.multipleSelection.length === 0) {
            //         this.$message({
            //             message: '请至少勾选一项，再进行操作',
            //             type: 'warning'
            //         });
                    
            //     } else {
            //         this.num2=this.multipleSelection.length
            //         this.returnDialog=true
            //     }
            // },
            // goReturn(){
            //     this.returnDialog=false
            // },
            //删除
            // myDelete(){
            //     this.deleteDialog=false
            // },
            //修改
            // amendBtn(){
            //     this.amendDialog=true
            // },
            // amend(){
            //     this.amendDialog=false
            // },
            backBtn(){
                this.$router.push({name:'pmdetail'})
            },
            // indexMethod(index) {
            //     return index+1;
            // },
            // taskEdit(index,row) {
            //     //console.log(row);//每行的数据
            //     //console.log(row.name)//获取活动名
            //     //console.log(row.num)//获取数据量
            //     this.dialogVisible=true
            //     this.name=row.name
            //     this.num=row.num
            //     this.$router.push({name:''})
            // },
            // saveEdit(index){
            //     this.dialogVisible=false 
                
            // },
            // getId(){
            //     var routerParams=this.$route.params.id
            //     this.taskId=routerParams
            //     //console.log(this.taskId)
            // }
        },
        created(){
            this.init(
                //this.getId(),
                //this.getTablelist(),
            )
        },
        mounted(){
            this.getTablelist()
        },
        watch:{
            //'$route':'getId'
        },
        computed:{
            
        }
    }
</script>
<style scoped>
    .pagebutton {
        float:right
    }
    .dialogInput {
        width:80px
    }
</style>