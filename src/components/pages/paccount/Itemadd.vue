<template>
    <div class="itemadd">
        <el-form :inline="true" class="form-inline" :model="myData">
            <el-form-item label="行销名单">
                <el-input placeholder="请输入行销名单" v-model="myData.activityName"></el-input>
            </el-form-item>
            <el-form-item label="状态" v-if="roleId!=3">
                <el-select class="mySelect" v-model="myData.status" placeholder="全部" style="margin-left:10px;">
                    <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
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
            <!-- <el-form-item label="开始时间：">
                <el-date-picker v-model="myData.startTime" type="date" placeholder="选择日期时间" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间：">
                <el-date-picker v-model="myData.endTime" type="date" placeholder="选择日期时间" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item> -->
            <!-- <el-form-item label="有效期">
                <el-select class="mySelect" v-model="myData.status" placeholder="全部" style="margin-left:10px;">
                    <el-option v-for="item in timeValidity" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item>
                <el-button type='primary' style="margin-left:50px;" @click="getTablelist">搜索</el-button>
            </el-form-item>
        </el-form>
        <div class="small-divider"></div>
        <!--获取行销名单-->
        <div style="padding:20px">
            <!-- <el-button type="primary" v-if="roleId==1" @click='getActivity'>获取行销名单</el-button> -->
            <el-button type="primary" @click='addActivity'>新增行销名单</el-button>
            <el-button type="primary" v-if="roleId==1" @click='copyActivity'>复制行销名单</el-button>
        </div>
        <!--弹框-->
        <el-dialog title="新建行销名单" :visible.sync="addNewitemdialog" width="600px">
            <el-form :model="form" label-width="100px" class="formPage" label-position='left' ref="form">
                <el-form-item label="行销名单名称">
                    <el-input v-model="form.activityName" placeholder="请输入行销名单名称"></el-input>
                </el-form-item>
                <el-form-item label="话术">
                    <el-input type="textarea" :rows="4" placeholder="请输入话术内容" v-model="form.content">
                    </el-input>
                </el-form-item>
                <el-form-item label="名单有效时间">
                <template>
                    <el-date-picker
                            v-model="listTime"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                    >
                    </el-date-picker>
                </template>
            </el-form-item>
                <el-form-item label="上传文件">
                    <el-upload action="api/uploadExcel" :before-upload="beforeUpload" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess" :before-remove="beforeRemove">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <span style="margin-left:5px"><a href="/template.xls">导入请先下载最新模板</a></span>
                        <div slot="tip" class="el-upload__tip">只能上传xls文件，且不超过2MB</div>
                        <!-- <div slot="tip" class="el-upload-list__item-name">{{form.excelFileName}}</div> -->
                    </el-upload>
                </el-form-item>
                <el-form-item class='ruleBox' label="*注意事项*" style='border:1px solid red;color:red'>
                    <span>
                        1. 为保证导入成功，导入前请下载最新模版；<br>
                        2. 单次导入名单数据不可超过2MB；<br>
                        3. 联系号码为阿拉伯数字，同一行只能有一个号码；<br>
                        4. 联系号码不可超过12位，超过12位视为无效号码，自动过滤；<br>
                    </span>
                </el-form-item>
                <el-form-item size="medium" class="formBtn">
                    <el-button type="primary" @click="add('form')">确认</el-button>
                </el-form-item>
            </el-form> 
        </el-dialog>
        <el-dialog title="复制行销名单" :visible.sync="copyDialog" width="500px">
            <div>
                <span>行销名单名称：</span>
                <el-input label="行销名单名称" v-model="copyActivityName" style="width:300px" clearable></el-input>
            </div>
            <div style="margin-top:20px">
                <span style="margin-left:50px">有效期:</span>
                <el-date-picker
                        v-model="copyListTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        style="width:300px"
                >
                </el-date-picker>
                
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click = "copyDialog =false">取消</el-button>
                <el-button type="primary" @click = "showCopyActivity">确认</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="activityShow">
            <el-table :data="activityList" style="width:100%;" show-header v-loading='loading' :header-cell-style="tableHeaderStyle">
                <el-table-column label="行销名单名" prop="activityName"></el-table-column>
                <el-table-column label="行销名单ID" prop="activityId"></el-table-column>
                <el-table-column label="开始时间" prop="activityBeginDate"></el-table-column>
                <el-table-column label="结束时间" prop="activityEndDate"></el-table-column>
                <el-table-column label="行销名单号码" prop="showNumber"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="addActivity(scope.row)">获取</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <div class="divider"></div>
        <div class="table-box">
        <el-table :data="tableData" style="width:100%;" show-header :header-cell-style="tableHeaderStyle" v-loading="loading" element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)" @current-change="clickChange">
            <el-table-column label="" align="center" width="50" v-if="roleId==1">
                <template slot-scope="scope">
                    <el-radio :label="scope.row" v-model="selected">&nbsp;</el-radio>
                </template>
            </el-table-column>
            <el-table-column type="index" label="序号" :index="indexMethod" align="center"></el-table-column>
            <el-table-column label="行销名单" prop="activityName"></el-table-column>
            <el-table-column label="来源" prop="type">
                <template slot-scope="scope">
                    <span v-if="scope.row.type===1">移动</span>
                    <span v-if="scope.row.type===2">联通</span>
                    <span v-if="scope.row.type===3">电信</span>
                    <span v-if="scope.row.type===4">内部名单</span>
                    <span v-if="scope.row.type===5">外部名单</span>
                </template>
            </el-table-column>
            <el-table-column label="数据量" prop="orderNum">
                <template slot-scope="scope">
                    <el-button type="text" @click="numDetail(scope.row)">{{scope.row.orderNum}}</el-button>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime">
                <template slot-scope="scope">
                    {{scope.row.createTime | date(hour)}}
                </template>
            </el-table-column>
            <el-table-column label="开始时间" prop="startTime" >
                <template slot-scope="scope">
                    {{scope.row.startTime*1000 | date()}}
                </template>
            </el-table-column>
            <el-table-column label="结束时间" prop="endTime" >
                <template slot-scope="scope">
                    {{scope.row.endTime*1000 | date()}}
                </template>
            </el-table-column>
            <el-table-column label="有效期" prop="validity">
                <template slot-scope="scope">
                    <span style="color:red" v-if="scope.row.validity<0">无效</span>
                    <span v-else>{{scope.row.validity}}</span>
                </template>
            </el-table-column>
            <el-table-column label="分配去向" v-if="roleId!=3">
                <template  slot-scope="scope">
                    <span style="color:red" v-if="scope.row.status===0">未分配</span>
                    <span v-if="scope.row.status!==0">{{scope.row.company}}</span>
                </template> 
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <!-- <el-button type="primary" size="mini" :disabled="scope.row.status !== 0" @click="taskEdit(scope.$index,scope.row)">分配任务</el-button> -->
                    <el-button type="primary" size="mini" :disabled="scope.row.status !== 0" @click="deleteActivity(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        </div>
        <!--编辑弹框-->
        <!-- <el-dialog title="分配任务" :visible.sync="dialogVisible" width="30%">
            <div style="border-top:1px solid #ccc;border-bottom:1px solid #ccc;height:100px;padding:20px 0 20px 40px">
                <p style="margin-bottom:20px"><span style="margin-right:40px">行销名单名称</span>{{activityName}}<span></span></p>
                <p style="margin-bottom:20px"><span style="margin-right:55px">数据量</span>{{orderNum}}<span></span></p>
                <p>
                    <span style="margin-right:20px">公司名</span>
                    <el-select v-model="userId" filterable placeholder="请选择">
                        <el-option
                        v-for="item in firmName"
                        :key="item.id"
                        :label="item.company"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog> -->
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
                copyActivityName:'',
                copyDialog:false,
                selected:'', 
                fileList:[],
                files:'',
                form:{
                    activityName:'',
                    content:'',
                    excelFileName:'',
                    
                },
                listTime:null,
                copyListTime:null,
                addNewitemdialog:false,
                time:null,
                hour:true,
                loading:false,
                myData:{
                    pageIndex:1,
                    pageSize:10,
                }, 
                userId:null,
                rowData:'',
                //activityName:'',
                //orderNum:'',
                selectName:'',
                //firmName:[],//公司名，账户
                search:'',
                activityShow:false,
                activityList:[],//行销名单列表
                //dialogVisible:false,
                value:'', 
                timeValidity:[{
                    value: '0',
                    label: '无效'
                }, {
                    value: '1',
                    label: '3'
                }],
                options2: [{
                    value: '0',
                    label: '未分配'
                }, {
                    value: '5',
                    label: '已分配'
                }],
                tableData:[],//表格数据
                total:1,
                roleId:sessionStorage.getItem('roleId')
            }
        },
        methods:{
            numDetail(row){
                let activityId=row.activityId
                this.$router.push({name:'numberPool',query:{activityId:activityId}})
            },
            clickChange(val){
                this.selected = val
            },
            //获取表格列表
            getTablelist(){
                if (this.time!==null){
                   this.myData.cstartTime=this.time[0];
                   this.myData.cendTime =this.time[1];
                }else{
                    delete this.myData.cstartTime
                    delete this.myData.cendTime
                }
                this.loading=true
                let token=this.$cookieStore.getCookie('token')
                //console.log(token)
                let params=this.myData
                params.token=token
                this.$http.get(this.$api.platform.list,{params:params}).then(res => {
                    if(res.data.code === 0){
                        //console.log(res.data)
                        this.tableData=res.data.list
                        this.total=res.data.count
                        this.loading=false
                    }else{
                        this.$message.error(res.data.message)
                    }
                }).catch((e)=>{
                    console.log(e)
                })
            },
            //获取行销名单列表
            getActivity(){
                this.$http.post(this.$api.platform.activityList).then(res=>{
                    if(res.data.code === 0){
                        //console.log(res.data)
                        this.activityList=res.data.param.resultList
                        //console.log(this.activityList)
                        this.activityShow=true; 
                    }else{
                        this.$message.error(res.data.msg)
                    }
                }).catch((e) => {
                    console.log(e) 
                })
            },
            addActivity(row){
                this.loading=true
                const that=this
                this.rowData=row
                let params={activityId:this.rowData.activityId}
                //console.log(this.rowData)
                this.$http.post(this.$api.platform.activity,params).then(res=>{
                    //console.log(res)
                    if(res.data.code===0){
                        //that.tableData=res.data.param.resultList 
                        this.activityShow=false;
                        this.getTablelist()
                        this.loading=false
                    }
                }).catch(function (error) {
                    console.log(error)
                })
            },
            indexMethod(index) {
                return index+1;
            },
            handleCurrentChange(val) {
                this.myData.pageIndex =val;
                this.getTablelist()
            },
            handleSizeChange(val){
                this.myData.pageSize=val;
                this.getTablelist()
            },
            taskEdit(index,row) {
                this.dialogVisible=true
                this.rowData=row
                this.activityName=row.activityName
                this.orderNum=row.orderNum
                this.$http.get(this.$api.platform.company).then(
                    res => {
                        this.firmName=res.data.list
                    }
                ).catch(err => {
                    console.log("err")
                })
                
            },
            saveEdit(){
                this.$http.post(this.$api.platform.projectUpdate,
                    {
                        id:this.rowData.id,
                        userId:this.userId,
                        status:1
                    }).then(
                    res => {
                        this.dialogVisible=false
                        if(res.data.code===0){
                            this.getTablelist()
                            this.$message({
                                message:'分配成功',
                                type:'success'
                            });
                        }
                    }
                ).catch(err => {
                    console.log("err")
                })
                
                //this.rowData.status=1
            },
            // 复制行销名单
            copyActivity(){
                if(this.selected===''){
                    this.$message.warning('请选择行销名单')
                    return
                }
                if(this.selected.type===2){
                    this.$message.error('数据来源联通，无法复制')
                    return
                }
                this.copyDialog=true
            },
            showCopyActivity(){
                //console.log("aaaaaaaa",this.selected)
                let id=this.selected.id
                let activityName=this.copyActivityName
                if(this.copyListTime == null){
                    this.$message.warning('请输入有效期')
                    return
                }
                let startTime = this.copyListTime[0]
                let endTime = this.copyListTime[1]
                let token=this.$cookieStore.getCookie('token')
                if(activityName ===''){
                    this.$message.warning('请输入行销名单名')
                    return
                }
                let params={id:id,activityName:activityName,token:token,startTime:startTime,endTime:endTime}
                this.$http.post(this.$api.platform.copyActivity,params).then(res => {
                    if(res.data.code === 0){
                        this.getTablelist()
                        this.$message.success(res.data.msg)
                        this.selected = ''
                        this.copyDialog=false
                    }else{
                        this.$message.error(res.data.msg)
                    }
                }).catch((err) => {
                    console.log(err)
                })
                
            },
            // 新增行销名单
            addActivity(){
                this.addNewitemdialog = true
            },
            add(form){
                //console.log('上传'+this.form.excelFileName)
                if (this.listTime!==null){
                   this.form.startTime=this.listTime[0];
                   this.form.endTime =this.listTime[1];
                }else{
                    this.$message.warning('请选择要上传的名单有效期！')
                    return false
                }
                if(this.form.excelFileName == ""){
                    this.$message.warning('请选择要上传的文件！')
                    return false
                }
                if(this.form.activityName == "" || this.form.content == ""){
                    this.$message.warning('请输入行销名单名称和话术')
                    return false
                }
                this.addNewitemdialog = false
                this.loading=true
                this.form.token=this.$cookieStore.getCookie('token')
                let params=this.form
                this.$http.post(this.$api.platform.createActivity,params).then(res =>{
                    if(res.data.code===0){
                        //console.log(res)
                        this.getTablelist()
                        this.loading=false
                        this.$message.success('新建行销名单成功')
                    }
                }) 
            },
            handleSuccess(res,file){
                this.form.excelFileName = res.fileName;
            },
            beforeUpload(file){
                //console.log(file,'文件');
                const extension = file.name.split('.')[1] === 'xls'
                const extension2 = file.name.split('.')[1] === 'xlsx'
                const isLt2M = file.size / 1024 / 1024 < 2
                if (!extension && !extension2) {
                    this.$message.warning('上传模板只能是 xls、xlsx格式!')
                    return
                }
                if (!isLt2M) {
                    this.$message.warning('上传模板大小不能超过 2MB!')
                    return
                }
                
                // return false // 返回false不会自动上传
            },
            handleRemove(file) {
                //console.log(file, fileList);
            },
            handlePreview(file) {
                //console.log(file);
            },
            beforeRemove(file) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            //删除行销名单
            deleteActivity(row){
                this.$confirm('此操作将永久删除'+row.activityName, '是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let id = row.id
                    let params = {id:id}
                    this.$http.get(this.$api.platform.deleteActivity,{params:params}).then( res=> {
                        if(res.data.code ===0){
                            this.$message({
                                message:res.data.msg,
                                type:'success'
                            })
                            this.getTablelist()
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                })
            }
        },
        created(){
           this.getTablelist()
           //console.log(this.myData.status)
        },
        computed:{
            
        }
    }
</script>
<style scoped>
    
    .pagebutton {
        float:right
    }
    .formBtn {
        text-align: center;
        margin:10px 0 0 -50px
    }
    .ruleBox {
        color:red !important
    }   
</style>