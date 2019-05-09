<template>
    <div>
        <el-form :inline="true" class="form-inline" v-model="myData">
            <el-form-item label="企业名称">
                <el-input v-model="myData.company"></el-input>
            </el-form-item>
            <el-form-item label="登录账号">
                <el-input v-model="myData.userName"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select class="mySelect" v-model="myData.status" placeholder="请选择" style="margin-left:10px; width:150px;">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' style="margin-left:50px;" @click="getTableList">搜索</el-button>
            </el-form-item>
        </el-form>
        <div class="small-divider"></div>
        <div style="padding:17px 40px 20px 17px"><el-button type="primary" @click="outExe">导出</el-button></div>
        <div class="divider"></div>
        <!--table表格-->
        <div class="table-box">
        <el-table :data="tableData" style="width:100%;" show-header @selection-change="changeFun">
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index" label="序号" :index="indexMethod" align="center"></el-table-column>
            <el-table-column label="企业名称" prop="company"></el-table-column>
            <el-table-column label="登陆账号" prop="userName" sortable ></el-table-column>
            <el-table-column label="创建时间" prop="createTime" sortable width="150px">
                <template slot-scope="scope">
                    {{scope.row.createTime | date(1)}}
                </template>
            </el-table-column>
            <el-table-column label="账户有效期" prop="validity" sortable width="120px">
                <template slot-scope="scope">
                    {{scope.row.validity | time()}}
                </template>
            </el-table-column>
            <el-table-column label="税号" prop="taxNumber" sortable></el-table-column>
            <el-table-column label="营业执照" sortable>
                <template slot-scope="scope">
                    <img :src="url+scope.row.businessLicense" style="widht:30px;height:50px" preview preview-text="描述">
                </template>
            </el-table-column>
            <el-table-column label="状态" sortable>
                <template  slot-scope="scope">
                    <span style="color:red" v-if="scope.row.status===3">待审核</span>
                    <span v-if="scope.row.status===1">使用中</span>
                    <!-- <span v-if="scope.row.status===2">试用中</span> -->
                    <span v-if="scope.row.status===0">待认证</span>
                    <!-- <span v-if="scope.row.status===4">冻结中</span> -->
                </template> 
            </el-table-column>
            <el-table-column label="操作" width='250px'>
                <template slot-scope="scope">
                    <!-- <el-button type="text" size="mini" v-if="scope.row.status===0" @click="handlesy(scope.row)">试用</el-button> -->
                    <el-button type="text" size="mini" v-if="scope.row.status===3" @click="handletg(scope.row)">通过</el-button>
                    <el-button type="text" size="mini" v-if="scope.row.status===3" @click="handledh(scope.row)">打回</el-button>
                    <!-- <el-button type="text" size="mini" v-if="scope.row.status===1" @click="handledj(scope.row)">冻结</el-button>
                    <el-button type="text" size="mini" v-if="scope.row.status===4 " @click="handlejd(scope.row)">解冻</el-button> -->
                    <el-button type="text" size="mini" @click="handleXq(scope.row)">详情</el-button>
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
                },
                value:'',
                options:[{
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
                url:'http://47.99.37.96:88'
            }
        },
        methods:{
            //表格选中事件
            changeFun(val){
                this.selectList=val
                //console.log(this.selectList)
            }, 
            //导出
            outExe() {
                this.$confirm('此操作将导出excel文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.excelData = this.selectList //你要导出的数据list。
                    this.export2Excel()
                }).catch(() => {

                });
            },
            export2Excel() {
                require.ensure([], () => {
                    const {export_json_to_excel} = require('@/vendor/Export2Excel');
                    const tHeader = ['企业名称','登陆账号', '创建时间','账户有效期','税号'];
                    const filterVal = ['company', 'userName', 'createTime','validity','taxNumber'];
                    const list = this.excelData;
                    const data = this.formatJson(filterVal, list);
                    export_json_to_excel(tHeader, data, '账户管理');
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },
            indexMethod(index) {
                return index+1;
            },
            handleCurrentChange(val) {
                this.myData.pageIndex =val;
                this.getTableList()
            },
            handleSizeChange(val){
                this.myData.pageSize=val;
                this.getTableList()
            },
            getTableList(){
                //let token=this.$cookieStore.getCookie('token')
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
                let params={id:id,status:1}
                this.$http.post(this.$api.platform.update,params).then(res=>{
                    if(res.data.code===0){
                        this.getTableList()
                    }
                }).catch(error=>{
                    console.log(error)
                })
            },
            handledh(row){
                //this.tableData[index].status=3
                let id=row.id
                let params={id:id,status:0}
                this.$http.post(this.$api.platform.update,params).then(res=>{
                    if(res.data.code===0){
                        this.getTableList()
                    }
                }).catch(error=>{
                    console.log(error)
                })
            },
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
                console.log(row)
                let agentId=row.id
                this.$router.push({name:'zhdetail',query:{agentId:agentId}})
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
    
</style>
