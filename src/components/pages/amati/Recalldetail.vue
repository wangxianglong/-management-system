<template>
    <div class="itemadd">
        <el-form :inline="true" class="form-inline" v-model="myData">
            <el-form-item label="姓氏">
                <el-input placeholder="请输入名称" v-model="myData.firstName"></el-input>
            </el-form-item>
            <el-form-item label="性别">
                <el-select v-model="myData.sex" placeholder="请选择" style="margin-left:10px;">
                    <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="状态">
                <el-select v-model="value" placeholder="请选择" style="margin-left:10px;">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="通话时长">
                <el-input v-model="myData.taskname"></el-input>
            </el-form-item>
            <el-form-item label="呼叫次数">
                <el-input v-model="myData.taskname"></el-input>
            </el-form-item>
            <el-form-item label="最后拨打时间">
                <el-input v-model="myData.taskname"></el-input>
            </el-form-item>
            <el-form-item label="号码后四位">
                <el-input v-model="myData.taskname"></el-input>
            </el-form-item> -->
            <el-form-item>
                <el-button type='primary' style="margin-left:50px;" @click="getActivityList">搜索</el-button>
            </el-form-item>
        </el-form>
        <div class="small-divider"></div>
        <div style="padding:17px 40px 17px 20px">
            <el-button type="primary" @click="goback">返回</el-button>
        </div>
        <div class="divider"></div>
        <div class="table-box">
        <el-table :data="tableData" style="width:100%;" show-header >
            <el-table-column type="index" label="序号" :index="indexMethod" align="center" width="100px"></el-table-column>
            <el-table-column label="姓氏/性别" prop="cName" sortable width="150px"></el-table-column>
            <el-table-column label="电话" prop="phoneNum" sortable width="150px"></el-table-column>
            <el-table-column label="省份" prop="provide" sortable></el-table-column>
            <el-table-column label="地市" prop="area" sortable></el-table-column>
            <el-table-column label="呼叫次数" prop="callNum" sortable width="200px"></el-table-column>
            <el-table-column label="最后拨打时间" prop="lastCallTime" sortable width="200px">
                <template slot-scope="scope">
                    {{scope.row.lastCallTime | date(1)}}
                </template>
            </el-table-column>
            <el-table-column label="通话时长" prop="callDuration" sortable width="200px"></el-table-column>
            <!-- <el-table-column label="客户有效期" sortable>
                <el-button type="text" @click="whdialog">失效</el-button>
            </el-table-column> -->
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="taskEdit(scope.$index,scope.row)">外呼</el-button>
                </template>
            </el-table-column>
        </el-table>
        </div>
        <!--分页导航-->
        <div class="fpage">
            <el-pagination class="pagebutton" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20,30,100]" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog title="呼叫主席" :visible.sync="showcalleeDialog" width="600px" :before-close="beforClose">
            <el-form ref="form" :model="form" label-width="60px">
            <span style="color:red;margin:0 20px">电话正在拨打中......{{form.time}}</span>
            <el-form-item label="姓名">
                <template>
                    <span>{{form.cName}}</span>
                </template>
            </el-form-item>
            <el-form-item label="手机">
                <span>{{form.phoneNum}}</span>
            </el-form-item>
            <el-form-item label="意向">
                <el-radio-group v-model="form.intention">
                    <el-radio :label="1">A</el-radio>
                    <el-radio :label="2">B</el-radio>
                    <el-radio :label="3">C</el-radio>
                    <el-radio :label="4">D</el-radio>
                    <el-radio :label="5">未接通</el-radio>
                    <el-radio :label="6">其他</el-radio>
                </el-radio-group>
                <!-- <el-checkbox-group v-model="intention">
                    <el-checkbox label="1">A</el-checkbox>
                    <el-checkbox label="B"></el-checkbox>
                    <el-checkbox label="C"></el-checkbox>
                    <el-checkbox label="D"></el-checkbox>
                    <el-checkbox label="未接通"></el-checkbox>
                    <el-checkbox label="其他"></el-checkbox>
                </el-checkbox-group> -->
            </el-form-item>
            <!-- <el-form-item>
                <el-input type="textarea" v-model="form.desc" size="medium"></el-input>
            </el-form-item> -->
            <el-form-item label="话术">
                <el-input type="textarea" v-model="form.content"></el-input>
            </el-form-item>
            <el-form-item>
                <!-- <el-button type="primary" @click="afterload">加载上一个</el-button> -->
                <el-button type="primary" @click="saveEdit">保存</el-button>
                <el-button type="primary" @click="onSubmit" v-if="showBtn">拨打下一个</el-button>
            </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>

    export default {
        data(){
            return {
                showcalleeDialog:false,
                showBtn:true,
                form:{
                    tel:1234444,
                    time:222,
                    phone:"",
                    desc:'',
                    type:["其他"],
                    intention:''
                },
                showcalleeDialog:false,
                myData:{
                    pageIndex:1,
                    pageSize:10,
                    status:3
                },  
                total:1,
                count:1,
                selectName:'',
                firmName:[],
                search:'',
                activityShow:false,
                activityList:[],
                dialogVisible:false,
                value:'', 
                
                options:[{
                    value:'选项1',
                    label:'已完成'
                },{
                    value:'选项2',
                    label:'有意向'
                },{
                    value:'选项3',
                    label:'已失败'
                },{
                    value:'选项4',
                    label:'已拉黑'
                },{
                    value:'选项5',
                    label:'未接通'
                },{
                    value:'选项6',
                    label:'约下次'
                },{
                    value:'选项7',
                    label:'其他'
                }],
                options2: [{
                    value: '先生',
                    label: '先生'
                }, {
                    value: '女士',
                    label: '女士'
                }],
                tableData:[],
                isSave:false,
                customerId:null,
                row:null,
                index:null,
                activityId:null
            }
        },
        methods:{
            //初始化
            init (){
                
            },
            goback(){
                this.$router.push({name:'recall'})
            },
            user(){
                let token=this.$cookieStore.getCookie('token')
                this.$http.post(this.$api.login.seatLogin,{token:token}).then( res =>{
                if(res.data.code===0){
                    console.log(res)
                }
                }).catch(error=>{
                console.log(error)
                })
            },
            handleCurrentChange(val) {
                this.myData.pageIndex=val;
                this.getActivityList()
            },
            handleSizeChange(val){
                this.myData.pageSize=val;
                this.getActivityList()
            },
            //获取活动列表
            getActivityList(){
                let token=this.$cookieStore.getCookie('token')
                let params=this.myData
                params.token=token
                this.$http.get(this.$api.amati.getDataList,{params:params}).then(res =>{
                    if(res.data.code===0){
                        this.tableData=res.data.list
                        this.total=res.data.count
                    }
                }).catch(error => {
                    console.log("出错了")
                })
            },
            indexMethod(index) {
                return index+1;
            },
            taskEdit(index,row) {
                //console.log(row);//每行的数据
                //console.log(row.name)//获取活动名
                //console.log(row.num)//获取数据量
                this.dialogVisible=true
                // this.name=row.name
                // this.num=row.num
                // this.row=row
                this.index=index
                //console.log(this.index)
                this.customerId=row.customerId
                this.activityId=row.activityId
                let params={customerId:this.customerId,activityId:this.activityId,pageIndex:1,pageSize:5}
                this.$http.get(this.$api.amati.getDataDetail,{params:params}).then(res =>{
                    if(res.data.code===0){
                        //console.log(res)
                        this.form=res.data.data
                        this.showcalleeDialog=true
                        let activityId=this.form.activityId
                        let customerId=this.form.customerId
                        let provideId=this.form.provideId
                        let token=this.$cookieStore.getCookie('token')
                        this.$http.post(this.$api.amati.call,{token:token,activityId:activityId,customerId:customerId,provideId:provideId}).then(res=>{
                            if(res.data.code===0){
                                this.$message({
                                    message:'电话正在转接，请稍后',
                                    type:'success'
                                })
                            }else{
                                alert(res.data.msg)
                            }
                        })
                    }
                }).catch(error => {
                    console.log("出错了")
                }) 
                let total=this.tableData.length-1
                if(this.index===total){
                    this.showBtn=false 
                }else{
                    this.showBtn=true 
                }
                
                this.isSave=false
            },
            beforClose(){
                if(!this.isSave){
                    alert("未保存")
                    return
                }
                this.showcalleeDialog=false
                this.index=null
                //console.log(this.index)
            },
            // whdialog(){
            //     this.showcalleeDialog=true
            // },
            // afterload(){

            // },
            onSubmit(){
                if(!this.isSave){
                    alert("请先保存")
                    return
                }
                this.index++
                //console.log(index+"a")
                let total=this.tableData.length-1
                //console.log(index+"b")
                //console.log(total)
                
                let customerId=this.tableData[this.index].customerId
                let params={customerId:customerId,activityId:this.activityId,pageIndex:1,pageSize:5}
                this.$http.get(this.$api.amati.getDataDetail,{params:params}).then(res =>{
                    if(res.data.code===0){
                        this.form=res.data.data
                        let activityId=this.form.activityId
                        let customerId=this.form.customerId
                        let provideId=this.form.provideId
                        let token=this.$cookieStore.getCookie('token')
                        this.$http.post(this.$api.amati.call,{token:token,activityId:activityId,customerId:customerId,provideId:provideId}).then(res=>{
                            if(res.data.code===0){
                                this.$message({
                                    message:'电话正在转接，请稍后',
                                    type:'success'
                                })
                            }else{
                                alert(res.data.msg)
                            }
                        })
                    }
                }).catch(error => {
                    console.log("出错了")
                })
                this.isSave=false
                 if(this.index==total){
                    this.showBtn=false
                    return
                } 
                
            },
            saveEdit(){
                this.isSave=true
                let intention=this.form.intention
                if(!intention){
                    alert('请选择意向')
                    return
                }
                let params={customerId:this.customerId,intention:intention}
                this.$http.post(this.$api.amati.updateCustomer,params).then(res =>{
                    if(res.data.code===0){
                        //console.log(res)
                        
                    }
                }).catch(error => {
                    console.log("出错了")
                }) 
                
            }
        },
        created(){
            this.init(
                this.getActivityList(),
                this.user()
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
</style>