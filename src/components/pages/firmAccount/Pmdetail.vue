<template>
    <div>
        <el-form :inline="true" :model="myData" class="form-inline" ref="myData">
            <el-form-item label="行销名单" prop="activityName">
                <el-input v-model="myData.activityName" placeholder="请输入行销名单名"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="myData.status" placeholder="请选择" style="margin-left:10px;">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="创建时间:">
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
            <el-form-item label="有效期" prop="validityType">
                <el-select class="mySelect" v-model="myData.validityType" placeholder="全部" clearable >
                    <el-option v-for="item in validityType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="开始时间：" prop="starteTime">
                <el-date-picker v-model="myData.starteTime" type="date" placeholder="选择日期时间" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间：" prop="endTime">
                <el-date-picker v-model="myData.endTime" type="date" placeholder="选择日期时间" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item> -->
            <el-form-item>
                <el-button type='primary' @click="getactivityList" size="small">搜索</el-button>
                <el-button @click="resetForm('myData')" size="small">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="small-divider"></div>
        <div style="padding:17px 40px 17px 20px">
            <el-button type="primary" @click="outExe">导出</el-button>
            <el-button type="primary" @click="fpActivity">分配行销名单</el-button>
            <el-button type="primary" @click="goBack">返回</el-button>
            <span style="margin-left:40px">当前可分配行销名单：{{count}}</span>
        </div>
        <div class="divider"></div>
        <!--弹框-->
        <el-dialog title="分配行销名单" :visible.sync="activityDialog" width="40%">
            <span>
                <el-checkbox-group v-model="checkList">
                    <el-checkbox style="width:25%" v-for="activityitem in activity" :label="activityitem" :key="activityitem.id">{{activityitem.activityName}}({{activityitem.orderNum}})</el-checkbox>
                </el-checkbox-group>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="activityDialog = false">取 消</el-button>
                <el-button type="primary" @click="addActivity">确 定</el-button>
            </span>
        </el-dialog>
        <!--表格-->
        <div class="table-box">
        <el-table :data="tableData" style="width:100%;" show-header :header-cell-style="tableHeaderStyle">
            <el-table-column type="index" label="序号" :index="indexMethod" align="center"></el-table-column>
            <el-table-column label="行销名单" prop="activityName" align="center"></el-table-column>
            <el-table-column label="数据量" prop="orderNum" sortable align="center"></el-table-column>
            <el-table-column label="创建时间" prop="createTime" sortable align="center">
                <template slot-scope="scope">
                    {{scope.row.createTime | date(true)}}
                </template>
            </el-table-column>
            <el-table-column label="开始时间" prop="startTime" sortable align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.startTime*1000 | date()}}</span>
                </template>
            </el-table-column>
            <el-table-column label="结束时间" prop="endTime" sortable align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.endTime*1000 | date()}}</span>
                </template>
            </el-table-column>
            <el-table-column label="有效期" prop="validity">
                <template slot-scope="scope">
                    <span style="color:red" v-if="scope.row.validity<0">无效</span>
                    <span v-else>{{scope.row.validity}}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" sortable>
                <template  slot-scope="scope">
                    <el-button type="text" style="color:red" v-if="scope.row.status===1">未开始</el-button>
                    <el-button type="text" v-if="scope.row.status===2">进行中</el-button>
                    <el-button type="text" style="color:#000" v-if="scope.row.status===3">已完成</el-button>
                </template> 
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="taskEdit(scope.row)" :disabled="scope.row.validity<0?true:false">分配任务</el-button>
                </template>
            </el-table-column>
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
                total:1,
                myData:{
                    pageIndex:1,
                    pageSize:10,
                    activityName:'',
                    status:'',
                    cstartTime:'',
                    cendTime:'',
                    validityType:''
                },
                checkList:[],
                activity:[],
                activityDialog:false,
                count:1,
                options: [{
                    value: '1',
                    label: '未开始'
                }, {
                    value: '2',
                    label: '进行中'
                },{
                    value: '3',
                    label: '已完成'
                },{
                    value: '选项4',
                    label: '未通过'
                }],
                validityType: [
                {
                    value:0,
                    label:'无效'
                },
                {
                    value: 1,
                    label: '0~3天'
                }, {
                    value: 2,
                    label: '3~5天'
                },{
                    value:3,
                    label:'5~10天'
                },{
                    value:4,
                    label:'10~15天'
                },{
                    value:5,
                    label:'大于15天'
                }],
                tableData:[],
                ids:null,
            }
        },
        mounted(){
            
        },
        methods:{
            resetForm(myData){
                this.$refs[myData].resetFields()
                this.time=null
                this.getactivityList()
            },
            indexMethod(index) {
                return index+1;
            },
            handleCurrentChange(val) {
                this.myData.pageIndex =val;
                this.getactivityList()
            },
            handleSizeChange(val){
                this.myData.pageSize=val;
                this.getactivityList()
            },
            //获取table列表
            getactivityList(){
                if (this.time!==null){
                   this.myData.cstartTime=this.time[0];
                   this.myData.cendTime =this.time[1];
                }else{
                    delete this.myData.cstartTime
                    delete this.myData.cendTime
                }
                 
                //console.log(token)
                let params=this.myData
                  
                if(this.$route.query.id!==undefined){
                    sessionStorage.setItem('itemId',this.$route.query.id)
                    
                }
                params.itemId=sessionStorage.getItem('itemId')
                this.$http.get(this.$api.platform.list,{params:params}).then(res => {
                    if(res.data.code === 0){
                        //console.log(res.data)
                        this.tableData=res.data.list
                        this.total=res.data.count
                    }else{
                        this.$message.error(res.data.message)
                    }
                }).catch((e)=>{
                    console.log(e)
                })
            },
            // handleFp(index,row){
            //     console.log("分配")
            // },
            // search(){
            //     console.log('搜索')
            // },
            // addTel(){
            //     console.log('新增号码')
            // },
            //分配行销名单
            fpActivity(){
                if(this.count===0){
                    this.$message.error('当前没有可分配行销名单')
                    return
                }
                this.activityDialog=true
                 
                //let status=this.$route.query.status
                //console.log(token)
                
                let params={pageIndex:1,pageSize:100,  status:1}
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
                //console.log(this.checkList.map(v=>v.id).join())
                let ids=this.checkList.map(v=>v.id).join()
                let params = {ids:ids}
                if(this.$route.query.id!==undefined){
                    sessionStorage.setItem('itemId',this.$route.query.id)
                }
                params.itemId=sessionStorage.getItem('itemId')
                //console.log(itemId)
                this.$http.post(this.$api.firm.newItem,params).then(res => {
                    if(res.data.code === 0){
                        //console.log(res.data)
                        this.activityDialog = false
                        this.getactivityList()
                        this.getuserActivity()
                    }else{
                        this.$message.error(res.data.msg)
                    }
                }).catch((e)=>{
                    console.log(e)
                }) 
            },
            goBack(){
                this.$router.push({name:'pmitem'})
            },
            //获取可分配行销名单
            getuserActivity(){
                 
                //console.log(token)
                let params={pageIndex:1,pageSize:200,  status:1}
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
            //导出
            outExe() {
                this.$confirm('此操作将导出excel文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.excelData = this.tableData //你要导出的数据list。
                    this.export2Excel()
                }).catch(() => {

                });
            },
            export2Excel() {
                require.ensure([], () => {
                    const {export_json_to_excel} = require('@/vendor/Export2Excel');
                    const tHeader = ['行销名单名','数据量', '创建时间','开始时间','结束时间'];
                    const filterVal = ['activityName', 'orderNum', 'createTime','startTime','endTime'];
                    const list = this.excelData;
                    const data = this.formatJson(filterVal, list);
                    export_json_to_excel(tHeader, data, '项目管理详情');
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },
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

