<template>
    <div>
        <el-form :inline="true" class="form-inline" :model="myData" ref ="myData">
            <el-form-item label="企业名称" prop = "company">
                <el-input v-model="myData.company"></el-input>
            </el-form-item>
            <el-form-item label="登录账号" prop = "userName">
                <el-input v-model="myData.userName"></el-input>
            </el-form-item>
            <el-form-item label="代理商" prop = "agentName">
                <el-input v-model="myData.agentName"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop = "status">
                <el-select class="mySelect" v-model="myData.status" placeholder="请选择">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' style="margin-left:50px;" @click="getTableList" size="small">搜索</el-button>
                <el-button @click="resetForm('myData')" size="small">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="small-divider"></div>
        <div style="padding:17px 40px 20px 17px">
            <el-button type="primary" @click="addClient" v-if='roleId==1 || roleId==23 || roleId==25'>新增客户</el-button>
            <el-button type="primary" @click="outExe">导出</el-button>
        </div>
        <div class="divider"></div>
        <!--table表格-->
        <div class="table-box">
        <el-table :data="tableData" style="width:100%;" show-header :header-cell-style="tableHeaderStyle" @selection-change="changeFun" border>
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="企业ID" prop="entId"></el-table-column>
            <el-table-column label="企业名称" prop="company" width="180px">
                <template slot-scope="scope">
                    <el-badge :value="scope.row.balance<500?'账户余额不足':''" class="item">
                        <span>{{scope.row.company}}</span>
                    </el-badge>
                </template>
            </el-table-column>
            <el-table-column label="所属代理商" prop="agentName" width="120px"></el-table-column>
            <el-table-column label="登陆账号" prop="userName" width="120px"></el-table-column>
            <el-table-column label="登陆密码" prop="passWord"></el-table-column>
            <el-table-column label="联系人" prop="contacts">
            </el-table-column>
            <el-table-column label="电话" prop="phoneNum" width="120px"></el-table-column>
            <el-table-column label="邮箱" prop="email" width="180px"></el-table-column>
            <el-table-column label="创建时间" prop="createTime" sortable width="160px">
                <template slot-scope="scope">
                    {{scope.row.createTime | date(1)}}
                </template>
            </el-table-column>
            <!-- <el-table-column label="账户有效期" prop="validity" sortable width="120px">
                <template slot-scope="scope">
                    {{scope.row.validity | time()}}
                </template>
            </el-table-column> -->
            <el-table-column label="税号" prop="taxNumber" width="160px"></el-table-column>
            <el-table-column label="营业执照" >
                <template slot-scope="scope">
                    <el-popover
                            placement="right"
                            title=""
                            trigger="click">
                        <img slot="reference" :src="url+scope.row.businessLicense" :alt="url+scope.row.businessLicense" style="max-height: 100px;max-width: 200px">
                        <img :src="url+scope.row.businessLicense" >
                    </el-popover>
                    <!-- <img :src="url+scope.row.businessLicense" style="widht:30px;height:50px"> -->
                </template>
            </el-table-column>
            <el-table-column label="状态" >
                <template  slot-scope="scope">
                    <span style="color:red" v-if="scope.row.status===3">待审核</span>
                    <span v-if="scope.row.status===1">使用中</span>
                    <span style="color:red" v-if="scope.row.status===2">停用中</span>
                    <!-- <span v-if="scope.row.status===2">试用中</span> -->
                    <!-- <span v-if="scope.row.status===0">待认证</span> -->
                    <!-- <span v-if="scope.row.status===4">冻结中</span> -->
                </template> 
            </el-table-column>
            <el-table-column label="操作" width="150px">
                <template slot-scope="scope">
                    <!-- <el-button type="text" size="mini" v-if="scope.row.status===0" @click="handlesy(scope.row)">试用</el-button> -->
                    <el-button type="primary" size="small" v-if="(scope.row.status===3 && roleId==1) || (scope.row.status===3 && roleId==23) || (scope.row.status===3 && roleId==25)" @click="handletg(scope.row)" >通过</el-button>
                    <!-- <el-button type="text" size="mini" v-if="scope.row.status===3" @click="handledh(scope.row)">打回</el-button> -->
                    <!-- <el-button type="text" size="mini" v-if="scope.row.status===1" @click="handledj(scope.row)">冻结</el-button>
                    <el-button type="text" size="mini" v-if="scope.row.status===4 " @click="handlejd(scope.row)">解冻</el-button> -->
                    <el-button type="primary" size="small" @click="handleXq(scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        </div>
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
                total:1,
                myData:{
                    pageIndex:1,
                    pageSize:10,
                    roleId:3,
                    company:'',
                    userName:'',
                    status:'',
                    agentName:''
                },
                value:'',
                options:[
                {
                    value: '0',
                    label: '待认证'
                }, {
                    value: '1',
                    label: '使用中'
                },{
                    value:'3',
                    label:'待审核'
                }],
                tableData:[],
                
                selectList:[],
                url:'http://47.99.37.96:88',
                roleId:sessionStorage.getItem('roleId')
            }
        },
        methods:{
            resetForm(myData){
                this.$refs[myData].resetFields()
                this.getTableList()
            },
            addClient(){
                this.$router.push({path:'/approve'})
            },
            //表格选中事件
            changeFun(val){
                this.selectList=val.concat()
                let filters = this.$root.$options.filters
                for (let item of this.selectList) {
                    item.createTime=filters.date(item.createTime,true)
                }
                console.log(val)
                console.log(this.selectList)
                // this.$set(this.selectList.map(val => filters.date(val.createTime)))
            }, 
            //导出
            outExe() {
                this.$confirm('此操作将导出excel文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    
                    this.excelData = this.selectList//你要导出的数据list。
                    this.export2Excel()
                }).catch(() => {

                });
            },
            export2Excel() {
                require.ensure([], () => {
                    const {export_json_to_excel} = require('@/vendor/Export2Excel');
                    const tHeader = ['企业名称','登陆账号', '登陆密码','联系人','电话','邮箱','创建时间','税号'];
                    const filterVal = ['company', 'userName','passWord','contacts','phoneNum','email', 'createTime','taxNumber'];
                    const list = this.excelData;
                    const data = this.formatJson(filterVal, list);
                    export_json_to_excel(tHeader, data, '客户管理');
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },
            // indexMethod(index) {
            //     return index+1;
            // },
            handleCurrentChange(val) {
                this.myData.pageIndex =val;
                this.getTableList()
            },
            handleSizeChange(val){
                this.myData.pageSize=val;
                this.getTableList()
            },
            getTableList(){
                // 
                let params=this.myData
                this.$http.get(this.$api.platform.userList,{params:params}).then(res=>{
                    if(res.data.code===0){
                        console.log(res)
                        this.tableData=res.data.list
                        this.total=res.data.count
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            // handlesy(row){
            //     // console.log(row.status)
            //     // this.tableData[index].status=1
            //     let id=row.id
            //     let params={id:id,status:2}
            //     this.$http.post(this.$api.platform.update,params).then(res=>{
            //         if(res.data.code===0){
            //             this.getTableList()
            //         }
            //     }).catch(error=>{
            //         console.log(error)
            //     })
            // },
            handletg(row){
                //this.tableData[index].status=2
                let id=row.id
                let params={id:id,status:2}
                this.$http.post(this.$api.platform.update,params).then(res=>{
                    if(res.data.code===0){
                        this.getTableList()
                    }
                }).catch(error=>{
                    console.log(error)
                })
            },
            // handledh(row){
            //     //this.tableData[index].status=3
            //     let id=row.id
            //     let params={id:id,status:0}
            //     this.$http.post(this.$api.platform.update,params).then(res=>{
            //         if(res.data.code===0){
            //             this.getTableList()
            //         }
            //     }).catch(error=>{
            //         console.log(error)
            //     })
            // },
            // handledj(row){
            //     //this.tableData[index].status=4
            //     let id=row.id
            //     let params={id:id,status:4}
            //     this.$http.post(this.$api.platform.update,params).then(res=>{
            //         if(res.data.code===0){
            //             this.getTableList()
            //         }
            //     }).catch(error=>{
            //         console.log(error)
            //     })
            // },
            // handlejd(row){
            //     //this.tableData[index].status=0
            //     let id=row.id
            //     let params={id:id,status:1}
            //     this.$http.post(this.$api.platform.update,params).then(res=>{
            //         if(res.data.code===0){
            //             this.getTableList()
            //         }
            //     }).catch(error=>{
            //         console.log(error)
            //     })
            // },
            handleXq(row){
                //console.log(row)
                let entId=row.entId
                this.$router.push({name:'zhdetail',query:{entId:entId}})
            },
            
        },
        created(){
            this.getTableList()
        }
    }
</script>
<style scoped>
    .pagebutton {
        float:right
    }
    .el-popover{
        height:500px;
        overflow: auto;
    }
    .item {
        margin-top: 10px;
        margin-right: 60px;
    }
</style>
