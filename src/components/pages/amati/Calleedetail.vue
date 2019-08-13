<template>
    <div class="itemadd">
        <el-form :inline="true" class="form-inline" :model="myData" ref="myData">
            <!-- <el-form-item label="姓氏" prop="firstName">
                <el-input placeholder="请输入名称" v-model="myData.firstName"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-select v-model="myData.sex" placeholder="请选择" style="margin-left:10px;">
                    <el-option v-for="item in sexType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item> -->
            <!-- <el-form-item label="意向">
                <el-select v-model="myData.intention" placeholder="请选择" style="margin-left:10px;">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="电话号码：" prop="phoneNum">
                <el-input placeholder="请输入号码" v-model="myData.phoneNum"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' size="small" @click="getActivityList">搜索</el-button>
                <el-button size="small" @click="resetForm('myData')">重置</el-button>
            </el-form-item>
            
        </el-form>
        <div class="small-divider"></div>
        <div style="padding:17px 40px 17px 20px">
            <el-button type="primary" @click="goback">返回</el-button>
        </div>
        <div class="divider"></div>
        <div class="table-box">
        <el-table :data="tableData" style="width:100%;" show-header :header-cell-style="tableHeaderStyle" border>
            <el-table-column type="index" label="序号" :index="indexMethod" align="center" width="100px"></el-table-column>
            <el-table-column label="姓氏/性别" prop="cName" sortable width="150px"></el-table-column>
            <el-table-column label="电话" prop="phoneNum" sortable width="150px">
                <template slot-scope="scope">
                    <span v-if="scope.row.desensitization === 0">{{scope.row.phoneNum}}</span>
                    <span v-if="scope.row.desensitization === 1">{{scope.row.phoneNum | placePhone()}}</span>
                </template>
            </el-table-column>
            <el-table-column label="省份" prop="provide" sortable></el-table-column>
            <el-table-column label="地市" prop="area" sortable></el-table-column>
            <el-table-column label="呼叫次数" prop="callNum"></el-table-column>
            <!-- <el-table-column label="最后拨打时间" prop="lastCallTime" sortable width="200px"></el-table-column>
            <el-table-column label="通话时长" prop="callDuration" sortable width="200px"></el-table-column> -->
            <!-- <el-table-column label="客户有效期" sortable>
                <el-button type="text" @click="whdialog">失效</el-button>
            </el-table-column> -->
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="makeCall(scope.$index,scope.row)" :disabled="isDisabled"><i class="el-icon-phone"></i>外呼</el-button>
                </template>
            </el-table-column>
        </el-table>
        </div>
        <!--分页导航-->
        <div class="fpage">
            <el-pagination class="pagebutton" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20,30,100]" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <video id="preview" :style="{display:'none'}"></video>
        <video id="remote" :style="{display:'none'}"></video>
        <!-- <audio ref='player' autoplay='autoplay' loop style="display: none"></audio> -->
        <!-- 普通，移动 -->
        <el-dialog title="呼叫号码" :visible.sync="showcalleeDialog" width="700px" :before-close="beforClose">
            <div class='dialogTitle'>
                <span style="color:red;margin:0 20px">{{promptMessage}}</span>
            </div>
            <div class="header">
                <div>客户信息</div>
            </div>
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="姓名">
                    <template>
                        <span>{{form.cName}}</span>
                    </template>
                </el-form-item>
                <el-form-item label="手机">
                    <span v-if="form.desensitization===0">{{form.phoneNum}}</span>
                    <span v-if="form.desensitization===1">{{form.phoneNum | placePhone()}}</span>
                </el-form-item>
                <el-form-item label="意向">
                    <el-radio-group v-model="form.intention">
                        <el-radio :label="1">A</el-radio>
                        <el-radio :label="2">B</el-radio>
                        <el-radio :label="3">C</el-radio>
                        <el-radio :label="4">D</el-radio>
                        <el-radio :label="6">拒接</el-radio>
                        <el-radio :label="7">忙音/关机</el-radio>
                        <el-radio :label="8">其他</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" maxLength="50" show-word-limit='true' v-model="form.comment" size="medium" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入备注"></el-input>
                </el-form-item>
                <el-form-item label="话术">
                    <el-input type="textarea" v-model="form.content"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="saveEdit">保存</el-button>
                    <el-button type="danger" @click="hangup"><i class="el-icon-phone-outline"></i>挂断</el-button>
                    <el-button type="primary" @click="nextMakeCall" v-if="showBtn">拨打下一个</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 联通，电信弹框 -->
        <el-dialog title="呼叫号码" :visible.sync="handleCalleeDialog" width="700px" :before-close="handleBeforClose">
            <div class='dialogTitle' v-if="entRow.type===3">
                <div>请使用：<span>{{phoneNum}}</span></div>
                <div>拨打：<span>{{telx | showPhone()}}</span><span v-show="show">{{time}}s</span><el-button size=mini v-show="!show" @click="getCode">重新获取</el-button></div>
            </div>
            <div class='dialogTitle' v-if="entRow.type===2">
                <span>正在转接 </span><span style="color:red">{{entRow.cName}}，{{entRow.phoneNum}}</span>
            </div>
            <div class="header">
                <div>客户信息</div>
            </div>
            <el-form ref="phoneCallForm" :model="phoneCallForm" label-width="80px" :rules="rules">
                <el-form-item label="客户姓名">
                    <template>
                        <el-input v-model='phoneCallForm.cName' size='small' style='width:50%'></el-input>
                    </template>
                </el-form-item>
                <el-form-item label="客户手机">
                    <el-input v-model='phoneCallForm.phoneNum' size='small' style='width:50%'></el-input>
                </el-form-item>
                <el-form-item label="客户意向" prop='intention'>
                    <el-radio-group v-model="phoneCallForm.intention">
                        <el-radio :label="1">A</el-radio>
                        <el-radio :label="2">B</el-radio>
                        <el-radio :label="3">C</el-radio>
                        <el-radio :label="4">D</el-radio>
                        <el-radio :label="6">拒接</el-radio>
                        <el-radio :label="7">忙音/关机</el-radio>
                        <el-radio :label="8">其他</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" maxLength="50" show-word-limit='true' v-model="phoneCallForm.comment" size="medium" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入备注"></el-input>
                </el-form-item>
                <el-form-item label="话术">
                    <el-input type="textarea" v-model="phoneCallForm.content"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="submitBtn" @click="subPhoneCallForm('phoneCallForm')">提 交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
    require('@/api/hxwpapi-v3.2.4.min');
    import store from '../../../store.js'
    export default {
        data(){
            return {
                rules:{
                    intention:[
                        {required:true,message:'请填写意向',trigger:'blur'},
                    ],
                },
                isDisabled:false,
                showcalleeDialog:false,
                showBtn:true,
                form:{},
                promptMessage:'',
                showcalleeDialog:false,
                myData:{
                    pageIndex:1,
                    pageSize:10,
                    activityId:this.$route.query.activityId,
                    status:2,
                    phoneNum:null
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
                sexType: [{
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
                activityId:null,
                phoneNum:sessionStorage.getItem('phoneNum'),
                states:'',
                sessionId:null,
                phoneCallForm:{},
                handleCalleeDialog:false,
                time:'',
                show:true,
                timer:null,
                entRow:'',
                telx:''
            }
        },
        destroyed(){
            window.theWebPhone.logout()
        },
        mounted(){
            window.theWebPhone=new HxWebPhone('preview', 'remote', (e)=>{
                console.log("phone evt: " + JSON.stringify(e));
                switch (e.Evt) {
                case theWebPhone.EvtTypes.UpdateState:
                    window.wpState = e.state;
                    switch (e.state) {
                        case theWebPhone.States.Offline:
                            console.log('offLine')
                            break;
                        case theWebPhone.States.Login:
                            console.log('login')
                            break;
                        case theWebPhone.States.Idle:
                            this.states = theWebPhone.States.Idle
                            console.log('IDle')
                            if(e.msg == 'Normal release'){
                                if(this.sessionId != null){
                                    let params = {sessionId:this.sessionId}
                                    this.$http.get(this.$api.amati.updateTelDetail,{params:params}).then( res=>{
                                        if(res.data.code === 0){
                                            this.sessionId = null
                                        }
                                    })
                                }
                                
                            }
                            break;
                        case theWebPhone.States.Init:
                            this.states = theWebPhone.States.Init
                            console.log('Init')
                            if(e.cid != null){
                                this.getTicket(e)
                            }
                            break;
                        case theWebPhone.States.Alert:
                            this.states = theWebPhone.States.Alert
                            console.log('Alert')
                            
                            if(e.cid != null){
                                this.getTicket(e)
                            }
                            
                            break;
                        case theWebPhone.States.Connected:
                            this.states = theWebPhone.States.Connected
                            console.log('Connected')
                            
                            if(e.cid != null){
                                this.getTicket(e)
                            }
                            break;
                    }
                    break;
                }
            })
            
            window.theWebPhone .login ("outcall.chinawjhs.com", this.phoneNum, "1234", "cs")
            
            //console.log("登陆了")
            if(window.theWebPhone.States.Idle === window.wpState){
                this.isDisabled=true      
            }
        },
        watch: {
            states(newState, oldState) {
                    if (newState == theWebPhone.States.Init) {
                        this.promptMessage = '请稍等，正在为您接通电话'
                    }
                    if (newState == theWebPhone.States.Alert) {
                        this.promptMessage = '正在拨打电话，请稍等'
                    }
                    if (newState == theWebPhone.States.Connected) {
                        this.promptMessage = '电话已接通'
                    }  
                    if (newState == theWebPhone.States.Idle) {
                        this.promptMessage = '电话空闲中'
                    }  
            } 
        },
        methods:{
            // 电信号码拨打框
            handleBeforClose(){

            },
            subPhoneCallForm(phoneCallForm){
                this.$refs[phoneCallForm].validate((valid)=>{
                    if(valid) {
                        this.handleCalleeDialog=false
                        this.time=''
                        let params=this.phoneCallForm
                        params.customerId=this.entRow.customerId
                        this.$http.post(this.$api.amati.updateCustomer,params).then(res =>{
                            if(res.data.code===0){
                                //console.log(res)
                                this.$message({
                                    message:res.data.msg,
                                    type:'success'
                                })
                                this.getActivityList()
                                this.phoneCallForm={}
                            }else{
                                this.$message({
                                    message:res.data.msg,
                                    type:'error'
                                })
                            }
                        }).catch(error => {
                            console.log("出错了")
                        }) 
                    }else{
                        console.log('error submit!!')
                        return false
                    }
                })
            },
            // 倒计时
            getCode(){
                const TIME_COUNT = 180;
                if (!this.timer) {
                   this.time = TIME_COUNT;
                   this.show = true;
                   this.timer = setInterval(() => {
                   if (this.time > 0 && this.time <= TIME_COUNT) {
                     this.time--;
                   } else {
                     this.show = false;
                     clearInterval(this.timer);
                     this.timer = null;
                   }
                   }, 1000)
                }
            }, 
            //初始化
            init (){
                
            },
            getTicket(e){
                let params = {}
                params.customerId = this.form.cId
                params.itemId = this.form.itemId
                params.remoteUrl = this.form.phoneNum
                params.callIdx = e.cid
                params.entId = sessionStorage.getItem('entId')
                params.localUrl = sessionStorage.getItem('phoneNum')
                params.agentId = sessionStorage.getItem('userName')
                //console.log('aaaaaaaaaaaaaaaa',sessionStorage.getItem('userName'))
                this.$http.post(this.$api.amati.insertTelDetail,params).then( res => {
                    console.log(res)
                    if(res.data.code === 0 ){
                        this.sessionId = res.data.sessionId
                    }
                })
            },
            resetForm(myData){
                this.$refs[myData].resetFields()
                this.getActivityList()
            },
            goback(){
                this.$router.push({name:'callee'})
            },
            // user(){
            //      
            //     this.$http.post(this.$api.login.seatLogin,{token:token}).then( res =>{
            //     if(res.data.code===0){
            //         console.log(res)
            //     }
            //     }).catch(error=>{
            //     console.log(error)
            //     })
            // },
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
                let params=this.myData
                this.$http.get(this.$api.amati.getDataList,{params:params}).then(res =>{
                    if(res.data.code===0){
                        this.tableData=res.data.list
                        console.log(this.tableData)
                        this.total=res.data.count
                        console.log(this.total)
                    }
                }).catch(error => {
                    console.log("出错了")
                })
            },
            //挂断
            hangup(){
                window.theWebPhone.hangup()
                this.$message.success('电话已挂断')
            },
            indexMethod(index) {
                return index+1;
            },
            
            makeCall(index,row) {
                if(row.type == 4 || row.type == 5 || row.type == 1){
                    window.theWebPhone.hangup()
                    this.dialogVisible=true
                    //console.log(row,index)
                    this.index=index
                    let customerId=row.customerId
                    this.activityId=row.activityId
                    let params={customerId:customerId,activityId:this.activityId,pageIndex:1,pageSize:30}
                    this.$http.get(this.$api.amati.getDataDetail,{params:params}).then(res =>{
                        //console.log('cs',res)
                        if(res.data.code===0){
                            //console.log('1',res)
                            this.form=res.data.data
                            this.showcalleeDialog=true
                            let customerId=this.form.customerId
                            let huashuNo=this.form.huashuNo
                            let params={customerId:customerId,huashuNo:huashuNo}
                            this.$http.post(this.$api.amati.callCustomer,params).then(res => {
                                if(res.data.code===0){
                                    //console.log(res)
                                    if(res.data.telx!=null){
                                        this.telx = res.data.telx
                                        window.theWebPhone .dial(this.telx,0)
                                    }else{
                                        window.theWebPhone .dial(this.form.phoneNum,0)
                                    } 
                                }else{
                                    alert(res.data.msg)
                                }
                            })
                        }
                    }).catch(error => {
                        console.log("出错了",error)
                    })
                    let total=this.tableData.length-1
                    if(this.index == this.total-1){
                        this.showBtn=false 
                    }else{
                        this.showBtn=true 
                    }
                    this.isSave=false 
                }else if(row.type == 3){
                    this.entRow=row
                    this.phoneCallForm.content = this.entRow.content
                    let customerId=this.entRow.customerId
                    let seatPhone=this.phoneNum
                    let params={customerId:customerId,seatPhone:seatPhone}
                    this.$http.post(this.$api.amati.callCustomer,params).then(res => {
                        if(res.data.code===0){
                            this.telx = res.data.telx
                            this.getCode()
                            this.handleCalleeDialog=true
                        }else{
                            alert(res.data.msg)
                        }
                    })
                }else if(row.type == 2) {
                    this.entRow=row
                    this.phoneCallForm.content = this.entRow.content
                    let customerId=this.entRow.customerId
                    let seatPhone=this.phoneNum
                    let params={customerId:customerId,seatPhone:seatPhone}
                    this.$http.post(this.$api.amati.callCustomer,params).then(res => {
                        if(res.data.code===0){
                            this.handleCalleeDialog=true
                            let params2={dataId:this.entRow.dataId,seatPhone:seatPhone}
                            params2.customerId = this.entRow.cId
                            params2.itemId = this.entRow.itemId
                            params2.remoteUrl = this.entRow.phoneNum
                            params2.entId = sessionStorage.getItem('entId')
                            params2.localUrl = sessionStorage.getItem('phoneNum')
                            params2.agentId = sessionStorage.getItem('userName')
                            this.$http.post(this.$api.amati.call,params2).then(res=>{
                                if(res.data.code===0){
                                    this.$message({
                                        message:'电话正在转接，请稍后',
                                        type:'success'
                                    })
                                    
                                }else{
                                    alert(res.data.msg)
                                }
                            })
                        }else{
                            alert(res.data.msg)
                        }
                    })
                    
                }
            },
            beforClose(){
                if(!this.isSave){
                    this.$message.warning('未保存')
                    return
                }
                this.showcalleeDialog=false
                this.index=null
                this.getActivityList()
                window.theWebPhone.hangup()
            },
            // whdialog(){
            //     this.showcalleeDialog=true
            // },
            // afterload(){

            // },
            nextMakeCall(){
                console.log(this.index)
                if(!this.isSave){
                    this.$message({
                        message:'未保存',
                        type:'error'
                    })
                    return
                }
                window.theWebPhone.hangup()
                
                //console.log(index+"a")
                let total=this.tableData.length-1
                //console.log(index+"b")
                //console.log(total)
                this.index++
                let customerId=this.tableData[this.index].customerId
                let params={customerId:customerId,activityId:this.activityId,pageIndex:1,pageSize:30}
                this.$http.get(this.$api.amati.getDataDetail,{params:params}).then(res =>{
                    if(res.data.code===0){
                        this.form=res.data.data
                        let customerId=this.form.customerId
                        let huashuNo=this.form.huashuNo
                        let params={customerId:customerId,huashuNo:huashuNo}
                        this.$http.post(this.$api.amati.callCustomer,params).then(res => {
                            if(res.data.code===0){
                                if(res.data.telx!=null){
                                    this.telx = res.data.telx
                                    window.theWebPhone .dial(this.telx,0)
                                }else{
                                    window.theWebPhone .dial(this.form.phoneNum,0)
                                } 
                            }else{
                                alert(res.data.msg)
                            }
                        }) 
                    }
                }).catch(error => {
                    console.log(error)
                })
                this.isSave=false
                 if(this.index == this.total-1){
                    this.showBtn=false
                    return
                } 
                
            },
            saveEdit(){
                let intention=this.form.intention
                if(!intention){
                    this.$message({
                        message:'请选择意向',
                        type:'error'
                    })
                    return
                }
                this.isSave=true
                let comment = this.form.comment
                let customerId=this.tableData[this.index].customerId
                let params={customerId:customerId,intention:intention,comment:comment,status:3}
                this.$http.post(this.$api.amati.updateCustomer,params).then(res =>{
                    if(res.data.code===0){
                        //console.log(res)
                        this.$message({
                            message:res.data.msg,
                            type:'success'
                        })
                        // this.getActivityList()
                    }else{
                        this.$message({
                            message:res.data.msg,
                            type:'error'
                        })
                    }
                }).catch(error => {
                    console.log("出错了")
                }) 
            }
        },
        created(){
            this.init(
                this.getActivityList(),
                // this.user()
            )
        },
        computed : {
            
        }
    }
</script>
<style scoped>
    .pagebutton {
        float:right
    }
        .header
    {
        width:100%;
        height:36px;
        line-height: 36px;
        text-align:center;
        position:relative;
        font-weight:bold;
        color:#888
    }
    .header div:before,.header div:after
    {
        position:absolute;
        background:#ccc;
        content:"";
        height:1px;
        top:50%;
        width:40%;
    }
    .header div:before{left:10px;}
    .header div:after{right:10px;}
    .submitBtn{
        display:block;
        margin:0 40% 0 37%
    }
    .dialogTitle{
        font-size:16px
    }
    .dialogTitle div{
        padding:10px
    }
    .dialogTitle div span:nth-child(1){
        text-decoration:underline
    }
    .dialogTitle>div:nth-child(2)>span:nth-child(1){
        padding:20px;
        font-size:38px;
        color:#64d050;
        margin:0 20px;
    }
</style>