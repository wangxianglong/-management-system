<template>
    <div>
        <el-form :inline="true" :model="searchList" class="form-inline">
            <el-form-item label="活动名">
                <el-input v-model="searchList.name" placeholder="请输入活动名"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="value" placeholder="请选择" style="margin-left:10px;">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-date-picker v-model="searchList.name" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="开始时间：">
                <el-date-picker v-model="searchList.name" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间：">
                <el-date-picker v-model="searchList.name" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' @click="search"  style="margin-left:50px;">搜索</el-button>
            </el-form-item>
        </el-form>
        <div class="small-divider"></div>
        <div style="padding:17px 40px 17px 20px">
            <el-button type="primary" @click="addTel">导出</el-button>
            <el-button type="primary" @click="fpActivity">分配活动</el-button>
            <el-button type="primary" @click="goBack">返回</el-button>
            <span style="margin-left:40px">当前可分配活动：{{count}}</span>
        </div>
        <div class="divider"></div>
        <!--弹框-->
        <el-dialog title="分配活动" :visible.sync="activityDialog" width="40%">
            <span>
                <el-checkbox-group v-model="checkList">
                    <el-checkbox v-for="activityitem in activity" :label="activityitem" :key="activityitem.id">{{activityitem.activityName}}</el-checkbox>
                </el-checkbox-group>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="activityDialog = false">取 消</el-button>
                <el-button type="primary" @click="addActivity">确 定</el-button>
            </span>
        </el-dialog>
        <!--表格-->
        <div class="table-box">
        <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width:100%;" show-header>
            <el-table-column type="index" label="序号" :index="indexMethod" align="center"></el-table-column>
            <el-table-column label="活动名" prop="activityName" align="center"></el-table-column>
            <el-table-column label="数据量" prop="orderNum" sortable align="center"></el-table-column>
            <el-table-column label="创建时间" prop="createTime" sortable align="center"></el-table-column>
            <el-table-column label="开始时间" prop="startTime" sortable align="center"></el-table-column>
            <el-table-column label="结束时间" prop="endTime" sortable align="center"></el-table-column>
            <el-table-column label="状态" sortable>
                <template  slot-scope="scope">
                    <el-button type="text" style="color:red" v-if="scope.row.status===1">未开始</el-button>
                    <el-button type="text" v-if="scope.row.status===2">进行中</el-button>
                    <el-button type="text" style="color:#000" v-if="scope.row.status===3">已完成</el-button>
                </template> 
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="taskEdit(scope.row)">分配任务</el-button>
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
                    name:''
                },
                checkList:[],
                activity:[],
                activityDialog:false,
                count:1,
                options: [{
                    value: '选项1',
                    label: '已提交'
                }, {
                    value: '选项2',
                    label: '待审核'
                },{
                    value: '选项3',
                    label: '异常'
                },{
                    value: '选项4',
                    label: '未通过'
                },{
                    value: '选项5',
                    label: '已通过'
                },{
                    value: '选项6',
                    label: '代理下发'
                },{
                    value: '选项7',
                    label: '已下发'
                }],
                searchList:{
                    name:''
                },
                value:'',
                createtime:'',
                tableData:[],
                currentPage:1,
                pagesize:10,
                ids:null,
            }
        },
        methods:{
            indexMethod(index) {
                return index+1;
            },
            handleCurrentChange(currentPage) {
                this.currentPage =currentPage;
            },
            handleFp(index,row){
                console.log("分配")
            },
            search(){
                console.log('搜索')
            },
            addTel(){
                console.log('新增号码')
            },
            //分配活动
            fpActivity(){
                this.activityDialog=true
                let token=this.$cookieStore.getCookie('token')
                //let status=this.$route.query.status
                //console.log(token)
                let params={pageIndex:1,pageSize:5,token:token,status:1}
                this.$http.get(this.$api.platform.list,{params:params}).then(res => {
                    if(res.data.code === 0){
                        //console.log(res)
                        this.activity=res.data.list
                    }else{
                        this.$message.error(res.data.message)
                    }
                }).catch((e)=>{
                    console.log(e)
                })
            },
            addActivity(){
                console.log(this.checkList.map(v=>v.id).join())
                let ids=this.checkList.map(v=>v.id).join()
                let itemId=this.$route.query.id
                console.log(itemId)
                this.$http.post(this.$api.firm.newItem,{ids:ids,itemId:itemId}).then(res => {
                    if(res.data.code === 0){
                        //console.log(res.data)
                        this.activityDialog = false
                        this.getactivityList()
                    }else{
                        this.$message.error(res.data.message)
                    }
                }).catch((e)=>{
                    console.log(e)
                }) 
            },
            goBack(){
                this.$router.push({name:'pmitem'})
            },
            //获取table列表
            getactivityList(){
                let token=this.$cookieStore.getCookie('token')
                //console.log(token)
                let params={pageIndex:1,pageSize:5,token:token}
                this.$http.get(this.$api.platform.list,{params:params}).then(res => {
                    if(res.data.code === 0){
                        console.log(res.data)
                        this.tableData=res.data.list
                    }else{
                        this.$message.error(res.data.message)
                    }
                }).catch((e)=>{
                    console.log(e)
                })
            },
            //获取可分配活动
            getuserActivity(){
                let token=this.$cookieStore.getCookie('token')
                //console.log(token)
                let params={pageIndex:1,pageSize:5,token:token,status:1}
                this.$http.get(this.$api.platform.list,{params:params}).then(res => {
                    if(res.data.code === 0){
                        //console.log(res)
                        this.count=res.data.count
                    }else{
                        this.$message.error(res.data.message)
                    }
                }).catch((e)=>{
                    console.log(e)
                })
            },
            //分配任务
            taskEdit(row){
                console.log(row.id)
                let  taskId=row.activityId
                let status=row.status
                this.$router.push({name:"pmtask",query:{id:taskId,status:status}})
            },
            // getId(){
            //     var routerParams=this.$route.params.id
            //     this.itemId=routerParams
            //     //console.log(this.itemId)
            // }
        },
        watch:{
            //'$route':'getId'
        },
        created(){
            this.getactivityList()
            this.getuserActivity()
            //this.getId()
        }
    }
</script>
<style scoped>
    .pagebutton {
        float:right
    }
</style>

