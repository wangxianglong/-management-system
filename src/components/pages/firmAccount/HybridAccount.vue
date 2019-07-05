<template>
    <div>
        <el-form :inline="true" class="form-inline" v-model="myData">
            <el-form-item label="企业名称">
                <el-input v-model="myData.userName"></el-input>
            </el-form-item>
            
            <el-form-item label="手机号">
                <el-input v-model="myData.phoneNum"></el-input>
            </el-form-item>
            <!-- <el-form-item label="注册时间">
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
            </el-form-item> -->
            <!-- <el-form-item label="角色">
                <el-select class="mySelect" v-model="myData.roleId" placeholder="请选择" style="margin-left:10px; width:150px;">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item>
                <el-button type='primary' style="margin-left:50px;" @click="getTablelist">搜索</el-button>
            </el-form-item>
        </el-form>
        <!-- <div class="small-divider"></div>
        <div style="padding:17px 0 17px 20px">
           
        </div> -->
        <!--弹框-->
        <el-dialog title="当前配置坐席号" :visible.sync="seatDialog" width="450px" :modal="false">
            <div style="word-wrap:break-word">{{seats}}</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="seatDialog = false">取 消</el-button>
                <el-button type="primary" @click='nowSeat'>确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="新增座席" :visible.sync="dialogbox" width="500px">
            <div class="small-divider"></div>
            <div class="radioGroup">
                <span style="margin-right:30px">账号类型</span>
                <el-radio-group v-model="radio" >
                    <el-radio :label="4">班长</el-radio>
                    <el-radio :label="5">座席</el-radio>
                    <el-radio :label="6">质检</el-radio>
                </el-radio-group>
             </div>
            <div class="small-divider" style="margin-bottom:10px"></div>
            <div class="myInput">
                <el-form :model="formList" label-width="100px" size="small" ref="formList">
                <!-- <el-form-item label="用户名/账号" prop="userName">
                <el-input v-model="formList.userName"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="passWord">
                    <el-input type="passWord" v-model="formList.passWord"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="realName">
                    <el-input v-model="formList.realName" placeholder="请输入姓名"></el-input>
                </el-form-item> -->
                <el-form-item label="端口号" prop="phoneNum" v-if="radio!=4">
                    <el-select v-model="formList.phoneNum" placeholder="请选择">
                        <el-option v-for="item in phoneNumList" :key="item.Number" :label="item.Number" :value="item.Number"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关联班长" v-if="radio===5 || radio===6" prop="agentId">
                    <el-select v-model="formList.agentId" placeholder="请选择" @change="selectGet">
                        <el-option v-for="item in amonitorList" :key="item.id" :label="item.userName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                </el-form>
            </div>
            
            <div class="small-divider"></div>
            <span slot="footer">
                <el-button @click="dialogbox = false">取 消</el-button>
                <el-button type="primary" @click="add('formList')">确 定</el-button>
            </span>
        </el-dialog>
        <div class="divider"></div>
        <!--table表格-->
        <div class="table-box">
        <el-table :data="tableData" style="width:100%;" show-header :header-cell-style="tableHeaderStyle">
            <!-- <el-table-column type="index" label="序号" :index="indexMethod" align="center"></el-table-column> -->
            <el-table-column label="企业ID" prop='entId'></el-table-column>
            <el-table-column label="企业名称" prop='company'></el-table-column>
            <el-table-column label="联系人" prop='contacts'></el-table-column>
            <el-table-column label="手机号" prop='phoneNum'></el-table-column>
            <el-table-column label="外显数量" prop="numberCount">
                <template slot-scope="scope">
                    <el-button type="text" @click="seeNumBerCount(scope.row)">{{scope.row.numberCount}}</el-button>
                </template>
            </el-table-column>
            <el-table-column label="名单分配">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="activityAllocation(scope.row)">分配</el-button>
                </template>
            </el-table-column>
            <el-table-column label="座席配置" width="100px">
                <template slot-scope="scope">
                    <span style="color:red" v-if="scope.row.monitorCount === 0">无</span>
                    <span v-else>有</span>
                    <el-button type='primary' @click="addAccount(scope.row)" size='mini'>配置</el-button>
                </template>
            </el-table-column>
            <el-table-column label="价格配置" width="120px">
                <template slot-scope="scope">
                    <span style="color:red" v-if="scope.row.priceCount === 0">无</span>
                    <span v-else>有</span>
                    <el-button type='primary' @click="priceSet(scope.row)" size='mini'>配置</el-button>
                </template>
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.status === 1">启用</span>
                    <span style="color:red" v-if="scope.row.status === 2">停用</span>
                    <span style="color:red" v-if="scope.row.status === 3">待审核</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200px">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.status === 2" type="primary" size="mini" @click="usingBtn(scope.row)">启用</el-button>
                    <el-button v-if="scope.row.status === 1" type="danger" size="mini" @click="stopBtn(scope.row)">停用</el-button>
                    <el-button type="text" size="mini" @click="detail(scope.row)" :disabled="scope.row.monitorCount === 0 || scope.row.priceCount === 0 || scope.row.numberCount===0">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        </div>
        <!--弹框-->
        <el-dialog title="分配行销名单" :visible.sync="activityDialog" width="40%">
            <span>
                <el-checkbox-group v-model="checkList">
                    <el-checkbox style="width:25%" v-for="activityitem in activity" :label="activityitem" :key="activityitem.id">{{activityitem.activityName}}({{activityitem.orderNum}})</el-checkbox>
                </el-checkbox-group>
            </span>
            <div style="margin-top:20px">
                <div><span>名单价格：</span><el-input type="text" style="width:30%" size="mini" v-model="dataFee"></el-input>元/个</div>
                <div style="margin-top:10px"><span>模型定制：</span><el-input type="text" style="width:30%" size="mini" v-model='modelCount'></el-input>个</div>
                <div style="margin-top:10px"><span>模型定价：</span><el-input type="text" style="width:30%" size="mini" v-model='modelFee'></el-input>元/个</div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="activityDialog = false">取 消</el-button>
                <el-button type="primary" @click="addActivity">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="是否更新价格" :visible.sync="priceUpdateDialog" width="40%" :modal="false">
            <p>当前价格配置</p>
            <p >坐席费:{{nowPrice.seatFee}}元/个</p>
            <p >语音费:{{nowPrice.voiceFee}}元/分</p>
            <p >套餐费:{{nowPrice.set===1?850:0}}元</p>
            
            <span slot="footer" class="dialog-footer">
                <el-button @click="priceUpdateDialog = false">取 消</el-button>
                <el-button type="primary" @click='priceUpdate'>确 定</el-button>
            </span>
        </el-dialog>   
        <el-dialog title="价格配置" :visible.sync="priceDialog" width="40%">
            <el-tabs v-model="priceType" type="card" @tab-click="handleClick">
                <el-tab-pane label="按分钟计费" name="first">
                    <div>
                        <p>座席费：<el-input type='text' size="mini" v-model="seatFee" style="width:30%"></el-input>元/个</p>
                        <p style="margin-top:10px">语音费：<el-input type='text' size="mini" v-model="voiceFee" style="width:30%"></el-input>元/分</p>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="套餐计费" name="second">
                    <div>
                        <span>包月套餐：</span>
                        <el-radio-group v-model="set">
                            <el-radio :label="1">
                                <el-tooltip effect="dark" content="850套餐费，包含5000分钟，超过按0.15元/分计算" placement="bottom-start">
                                    <el-button type="text">850</el-button>
                                </el-tooltip>
                            </el-radio>
                            <!-- <el-radio :label="2">
                                <el-tooltip effect="dark" content="1000月费" placement="bottom-start">
                                    <el-button type="text">1000</el-button>
                                </el-tooltip>
                            </el-radio>
                            <el-radio :label="3">
                                <el-tooltip effect="dark" content="2000月费" placement="bottom-start">
                                    <el-button type="text">2000</el-button>
                                </el-tooltip>
                            </el-radio> -->
                        </el-radio-group>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <span style="color:red;float:right">价格配置次月生效</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="priceDialog = false">取 消</el-button>
                <el-button type="primary" @click='savePrice'>确 定</el-button>
            </span>
        </el-dialog>
        <div class="fpage">
            <el-pagination class="pagebutton" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20,30,100]" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                seats:'',
                seatDialog:false,
                priceUpdateDialog:false,
                seatFee:'',
                voiceFee:'',
                set:null,
                priceType:"first",
                priceDialog:false,
                checkList:[],
                dataFee:'',
                modelCount:'',
                modelFee:'',
                activity:[],
                activityDialog:false,
                time:null,
                myData:{
                    pageIndex:1,
                    pageSize:10,
                    roleId:3
                },
                isShow:true,
                amonitorList:[],
                phoneNumList:[],
                formList:{
                    userName:'',
                    passWord:'',
                    realName:'',
                    phoneNum:'',
                    agentId:''
                },
                radio:4,
                dialogbox:false,
                value:'',
                options:[{
                    value:3,
                    label:"全部"
                },{
                    value: '5',
                    label: '坐席'
                }, {
                    value: '6',
                    label: '质检'
                },{
                    value:'4',
                    label:'班长'
                }],
                tableData:[],
                total:1,
                selectId:null,
                count:1,
                entRow:{},
                nowPrice:{
                    seatFee:'',
                    voiceFee:'',
                    set:''
                }
            }
        },
        methods:{
            //tabs事件
            handleClick(tab, event) {
                this.seatFee=null
                this.voiceFee=null
                this.set=null
            },
            selectGet(vId){//这个vId也就是value值
                this.formList.obj = this.amonitorList.find((item)=>{//这里的userList就是上面遍历的数据源
                    return item.id === vId;//筛选出匹配数据
            });
                console.log(this.formList.obj.id);//我这边的name就是对应label的
            },
            handleCurrentChange(val) {
                this.myData.pageIndex =val;
                this.getTablelist()
            },
            handleSizeChange(val){
                this.myData.pageSize=val;
                this.getTablelist()
            },
            getTablelist(){
                if(this.time!==null){
                    this.myData.startTime=this.time[0]
                    this.myData.endTime=this.time[1]
                }else{
                    delete this.myData.startTime
                    delete this.myData.endTime
                }
                // let token=this.$cookieStore.getCookie('token')
                let params=this.myData
                // params.token=token
                this.$http.get(this.$api.firm.userList,{params:params}).then(res=>{
                    if(res.data.code===0){
                        //console.log(res)
                        this.tableData=res.data.list
                        this.total=res.data.count
                    }
                })
            },
            
            // indexMethod(index) {
            //     return index+1;
            // },
            //坐席配置
            addAccount(row){
                this.entRow=row
                let agentId=row.id
                let params={pageIndex:0,pageSize:10000,agentId:agentId}
                this.$http.get(this.$api.platform.agendList,{params:params}).then(res=>{
                    if(res.data.code===0){
                        console.log(res)
                        this.amonitorList=res.data.list
                        if(this.entRow.monitorCount !== 0){
                            this.seatDialog = true
                            let params2={id:agentId}
                            this.$http.get(this.$api.platform.userDetail,{params:params2}).then(res => {
                                if(res.data.code === 0){
                                    this.seats = res.data.seats.toString()
                                }
                            })
                        }else{
                            this.dialogbox = true
                        }
                    }
                }) 
                this.$http.get(this.$api.user.getExtNumber,{}).then(res => {
                    if(res.data.code===0){
                        this.phoneNumList=res.data.list
                    }
                })
                
            },
            nowSeat(){
                this.dialogbox = true
            },
            add(formList){
                let id=this.entRow.id
                let entId=this.entRow.entId
                let roleId=this.radio
                let phoneNum=this.formList.phoneNum
                if(this.radio===5 || this.radio===6){
                    this.formList.agentId=this.formList.obj.id
                    console.log(this.formList.agentId)
                }else{
                    this.formList.agentId=this.entRow.id
                }
                let params={roleId:roleId,phoneNum:phoneNum,agentId:this.formList.agentId,entId:entId,id:id}
                this.$http.post(this.$api.platform.addUser,params).then(res=>{
                    if(res.data.code===0){
                        //console.log(res)
                        this.getTablelist()
                    }
                }).catch(error=>{
                    console.log(error)
                })
                this.$refs['formList'].resetFields();
                this.dialogbox  = false
                this.seatDialog = false
            }, 
            //名单配置
            activityAllocation(row){
                this.entRow=row
                if(this.count===0){
                    this.$message.error('当前没有可分配名单')
                    return
                }
                this.activityDialog=true
                let token=this.$cookieStore.getCookie('token')
                //let status=this.$route.query.status
                //console.log(token)
                
                let params={pageIndex:1,pageSize:200,token:token,status:0}
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
            
            //获取可分配名单
            getuserActivity(){
                let token=this.$cookieStore.getCookie('token')
                //console.log(token)
                let params={pageIndex:1,pageSize:200,token:token,status:0}
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
            //选中名单
            addActivity(){
                if(this.dataFee==='' || this.modelCount==='' || this.modelFee===''){
                    this.$message.error('请全部填写')
                    return
                }
                let ids=this.checkList.map(v=>v.id)
                this.$http.post(this.$api.platform.projectUpdate,
                    {
                        ids:ids,
                        userId:this.entRow.id,
                        status:1,
                        dataFee:this.dataFee,
                        modelCount:this.modelCount,
                        modelFee:this.modelFee
                    }).then(
                    res => {
                        if(res.data.code===0){
                            this.$message({
                                message:'分配成功',
                                type:'success'
                            });
                            this.activityDialog =false
                            this.checkList=[]
                            this.dataFee=''
                            this.modelCount=''
                            this.modelFee=''
                        }else{
                            this.$message.error(res.data.msg)
                        }
                    }
                ).catch(err => {
                    console.log("err")
                })
            },
            getSwitch(){
                // :disabled="scope.row.monitorCount === 0 || scope.row.priceCount === 0 || scope.row.numberCount===0"
                if(this.entRow.numberCount === 0){
                    return 1
                }else if(this.entRow.monitorCount === 0){
                    return 2
                }else if(this.entRow.priceCount === 0){
                    return 3
                }
            },
            usingBtn(row){
                this.entRow = row
                switch (this.getSwitch()) {
                    case 1:
                        this.$message.warning('请配置外显号');
                        break;
                    case 2:
                        this.$message.warning('请配置班长/坐席');
                        break;
                    case 3:
                        this.$message.warning('请配置价格');
                        break;
                    default:
                        let entId = row.entId
                        let params = {entId:entId,enable:true}
                        this.$http.get(this.$api.user.entEnable,{params:params}).then(res => {
                            if(res.data.code ===0){
                                this.getTablelist()
                                this.$message.success(res.data.msg)
                            }
                        }).catch(error => {
                            alert(error)
                        })
                }
            },
            stopBtn(row){
                let entId = row.entId
                let params = {entId:entId,enable:false}
                this.$http.get(this.$api.user.entEnable,{params:params}).then(res => {
                    if(res.data.code ===0){
                        this.getTablelist()
                        this.$message.success(res.data.msg)
                    }
                }).catch(error => {
                    alert(error)
                })
            },
            //价格配置
            priceSet(row){
                // this.$confirm('此操作将修改价格'+'', '是否继续?', '提示', {
                //     confirmButtonText: '确定',
                //     cancelButtonText: '取消',
                //     type: 'warning'
                // }).then(() => {
                //     // let userId = row.id
                //     // let params = {userId:userId}
                //     // this.$http.get(this.$api.platform.delete,{params:params}).then( res=> {
                //     //     if(res.data.code ===0){
                //     //         this.$message({
                //     //             message:res.data.msg,
                //     //             type:'success'
                //     //         })
                //     //         this.getTableList()
                //     //     }
                //     // })
                    
                    
                // }).catch(() => {
                //     this.$message({
                //         type: 'info',
                //         message: '已取消修改'
                //     });          
                // })
                
                this.entRow = row
                if(this.entRow.priceCount !== 0){
                    let userId = this.entRow.id
                    let params = {userId:userId}
                    this.$http.get(this.$api.platform.selectSingle,{params:params}).then( res => {
                        if(res.data.code === 0){
                            this.nowPrice = res.data.data
                            this.priceUpdateDialog = true
                        }
                    })
                }else{
                    this.priceDialog = true
                }
                
                
            },
            priceUpdate(){
                this.priceDialog = true
            },
            
            savePrice(){
                let userId = this.entRow.id
                let params = {
                    userId:userId,
                }
                if(this.priceType == 'first'){
                    if(this.seatFee =='' ||this.voiceFee ==''){
                        this.$message.warning('请填写价格')
                        return
                    }
                    params.seatFee = this.seatFee
                    params.voiceFee = this.voiceFee
                }else if(this.priceType == 'second'){
                    params.set = this.set
                }
                // let params = this.nowPrice
                // params.userId = userId
                if(this.entRow.priceCount == 0){
                    this.$http.post(this.$api.platform.insertSingle,params).then(res => {
                        if(res.data.code === 0){
                            this.$message.success(res.data.msg)
                            this.priceDialog = false
                            this.priceUpdateDialog = false
                            this.getTablelist()
                        }
                    })
                }else{
                    params.id=this.nowPrice.id
                    this.$http.post(this.$api.platform.updateSingle,params).then(res => {
                        if(res.data.code === 0){
                            this.$message.success(res.data.msg)
                            this.priceDialog = false
                            this.priceUpdateDialog = false
                            this.getTablelist()
                        }
                    })
                }
            },
            seeNumBerCount(row){
                let userId=row.id
                this.$router.push({path:'/exontotal',query:{userId:userId}})
            },
            // 详情
            detail(row){
                let id=row.id
                this.$router.push({path:'/hybridDetail',query:{id:id}})
            },
        },
        created(){
            this.getTablelist()
            this.getuserActivity()
        }
    }
</script>
<style scoped>
    .pagebutton {
        float:right
    }
    .radioGroup {
        text-align: center;
    }
    .myInput{
       margin-left:50px
        
    }
</style>
