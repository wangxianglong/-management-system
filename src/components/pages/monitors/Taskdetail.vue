<template>
    <div class="itemadd">
        <el-form :inline="true" class="form-inline" v-model="myData">
            <el-form-item label="坐席名">
                <el-input placeholder="请输入任务名称" v-model="myData.userName"></el-input>
            </el-form-item>
            <!-- <el-form-item label="客户量">
                <el-input v-model="myData.activityname"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select class="mySelect" v-model="value" placeholder="全部" style="margin-left:10px;">
                    <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开始时间">
                <el-date-picker v-model="myData.time" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
                <el-date-picker v-model="myData.time" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item> -->
            <el-form-item>
                <el-button type='primary' style="margin-left:50px;" @click="getActivityList">搜索</el-button>
            </el-form-item>
        </el-form>
        <div class="small-divider"></div>
        <div style="padding:20px">
            <el-button type="primary" @click='assignedBtn'>分配</el-button>
            <!--
            <el-button type="primary" @click='returnBtn'>退回</el-button>
            <el-button type="primary" @click='amendBtn'>修改</el-button>
            -->
            <el-button type="primary" @click='backBtn'>返回</el-button>
            <span style="margin-left:40px">当前可分配客户量：{{count}}</span>
        </div>
        <div class="divider"></div>
        <!--弹框-->
        <el-dialog title="批量分配" :visible.sync="taskDialog" width="30%">
            <span>当前勾选坐席 {{num1}} 人</span>
            <span>平均每人分配</span>
            <input type="text" class="dialogInput" v-model="myNum" :placeholder="holder">
            <span>条数据</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="taskDialog = false">取 消</el-button>
            <el-button type="primary" @click="assignedTasks">确 定</el-button>
        </span>
        </el-dialog>
        <!--
        <el-dialog title="批量退回" :visible.sync="returnDialog" width="30%">
            <span>当前勾选坐席 {{num2}} 人</span>
            <span>确定退回全部  {{num3}}  条数据？</span>
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
        <el-table :data="tableData" :row-key="getRowKeys" style="width:100%;" show-header @selection-change="handleSelectionChange" ref="multipleTable">
            <el-table-column type="selection" :reserve-selection="true"></el-table-column>
            <el-table-column type="index" label="序号" :index="indexMethod" align="center"></el-table-column>
            <el-table-column label="坐席" prop="userName" align="center"></el-table-column>
            <el-table-column label="客户量" prop="num" align="center"></el-table-column>
            <!--
            <el-table-column label="任务开始时间" prop="startTime" sortable></el-table-column>
            <el-table-column label="任务结束时间" prop="endTime" sortable></el-table-column>
            <el-table-column label="状态" sortable>
                <template  slot-scope="scope">
                    <el-button type="text" style="color:red" v-if="scope.row.status===0">已完成</el-button>
                    <el-button type="text" v-if="scope.row.status===1">拨打中</el-button>
                    <el-button type="text" style="color:#000" v-if="scope.row.status===2">未完成</el-button>
                </template> 
            </el-table-column>
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
            <el-pagination class="pagebutton" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20,30,100]" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>

    export default {
        data(){
            return {
                myNum:null,
                multipleSelection:[],
                taskDialog:false,
                num1:null, 
                // returnDialog:false,
                // num2:12,
                // num3:123,
                // deleteDialog:false,
                // num4:3,
                // num5:2,
                // amendDialog:false,
                myData:{
                    pageIndex:1,
                    pagesize:10,
                    activityId:this.$route.query.id,
                    status:this.$route.query.status
                },  
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
                options2: [{
                    value: '选项1',
                    label: '全部'
                }, {
                    value: '选项2',
                    label: '项目1'
                },{
                    value:'选项3',
                    label:'项目2'
                }],
                holder:null,
                tableData:[],
                total:1
            }
        },
        methods:{
            //初始化
            init (){
                
            },
            getRowKeys(row){
                return row.id
            },
            handleSelectionChange(val){
                var that=this
                this.multipleSelection=val
                //console.log(this.multipleSelection)
            },
            handleCurrentChange(val) {
                this.myData.pageIndex =val;
                this.getActivityList()
            },
            handleSizeChange(val){
                this.myData.pageSize=val;
                this.getActivityList()
            },
            //获取表格列表
            getActivityList(){
                let token=this.$cookieStore.getCookie('token')
                let params=this.myData
                params.token=token
                this.$http.get(this.$api.monitor.seatList,{params:params}).then(res =>{
                    if(res.data.code===0){
                        console.log(res.data)
                        this.tableData=res.data.list
                        this.count=res.data.count
                        this.total=res.data.pageCount
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
                let token=this.$cookieStore.getCookie('token')
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
                let params={token:token,num:num,ids:ids,activityId:activityId}
                //console.log(activityId)
                this.$http.post(this.$api.monitor.assignSeat,params).then(res=>{
                    if(res.data.code===0){
                        console.log(res)
                        //this.tableData=res.data.list
                        this.taskDialog=false
                        let token=this.$cookieStore.getCookie('token')
                        let id=this.$route.query.id
                        let status=3
                        //console.log(id)
                        this.$http.get(this.$api.monitor.seatList,{params:{token:token,activityId:id,status:status}}).then(res =>{
                            if(res.data.code===0){
                                console.log(res.data)
                                this.tableData=res.data.list
                                this.count=res.data.count
                            }
                        }) 
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
                
                this.$refs.multipleTable.clearSelection()
            },
            // //退回
            // returnBtn(){
            //     this.returnDialog=true
            // },
            // goReturn(){
            //     this.returnDialog=false
            // },
            // //删除
            // myDelete(){
            //     this.deleteDialog=false
            // },
            // //修改
            // amendBtn(){
            //     this.amendDialog=true
            // },
            // amend(){
            //     this.amendDialog=false
            // },
            backBtn(){
                this.$router.push({name:'taskmanagement'})
            },
            indexMethod(index) {
                return index+1;
            },
            
            // taskEdit(index,row) {
            //     //console.log(row);//每行的数据
            //     //console.log(row.name)//获取活动名
            //     //console.log(row.num)//获取数据量
            //     this.dialogVisible=true
            //     this.name=row.name
            //     this.num=row.num
            // },
            // saveEdit(index){
            //     this.dialogVisible=false 
                
            // },
        },
        created(){
            this.init(
                this.getActivityList()
            )
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