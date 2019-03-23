<template>
    <div>
        <el-form :inline="true" class="form-inline" v-model="searchList">
            <el-form-item label="企业名称">
                <el-input v-model="searchList.name"></el-input>
            </el-form-item>
            <el-form-item label="登录账号">
                <el-input v-model="searchList.account"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select class="mySelect" v-model="value" placeholder="请选择" style="margin-left:10px; width:150px;">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' style="margin-left:50px;">搜索</el-button>
            </el-form-item>
        </el-form>
        <div class="small-divider"></div>
        <div style="padding:17px 40px 20px 17px"><el-button type="primary" @click="outExe">导出</el-button></div>
        <div class="divider"></div>
        <!--table表格-->
        <div class="table-box">
        <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width:100%;" show-header @selection-change="changeFun">
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index" label="序号" :index="indexMethod" align="center"></el-table-column>
            <el-table-column label="企业名称" prop="name"></el-table-column>
            <el-table-column label="登陆账号" prop="num" sortable></el-table-column>
            <el-table-column label="创建时间" prop="xfnum" sortable></el-table-column>
            <el-table-column label="账户有效期" prop="hcnum" sortable></el-table-column>
            <el-table-column label="税号" prop="bdnum" sortable></el-table-column>
            <el-table-column label="营业执照" prop="htnum" sortable>
                <img src="../../../assets/logo.png" alt="" style="widht:30px;height:50px" preview preview-text="描述">
            </el-table-column>
            <el-table-column label="状态" sortable>
                <template  slot-scope="scope">
                    <span style="color:red" v-if="scope.row.status===0">待审核</span>
                    <span v-if="scope.row.status===1">试用中</span>
                    <span v-if="scope.row.status===2">使用中</span>
                    <span v-if="scope.row.status===3">已打回</span>
                    <span v-if="scope.row.status===4">冻结中</span>
                </template> 
            </el-table-column>
            <el-table-column label="操作" width='250px'>
                <template slot-scope="scope">
                    <el-button type="text" size="mini" v-if="scope.row.status===0" @click="handlesy(scope.$index,scope.row)">试用</el-button>
                    <el-button type="text" size="mini" v-if="scope.row.status!==2" @click="handletg(scope.$index,scope.row)">通过</el-button>
                    <el-button type="text" size="mini" v-if="scope.row.status!==3" @click="handledh(scope.$index,scope.row)">打回</el-button>
                    <el-button type="text" size="mini" v-if="scope.row.status!==4" @click="handledj(scope.$index,scope.row)">冻结</el-button>
                    <el-button type="text" size="mini" v-if="scope.row.status===4 " @click="handlejd(scope.$index,scope.row)">解冻</el-button>
                    <el-button type="text" size="mini" @click="handleXq(scope.$index,scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        </div>
        <div class="fpage">
            <el-pagination class="pagebutton" background @current-change="handleCurrentChange" :current-page="currentPage"  layout="total, sizes, prev, pager, next, jumper" :total="400">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                searchList:{
                    name:'',
                    account:''
                },
                value:'',
                options:[{
                    value: '选项1',
                    label: '待审核'
                }, {
                    value: '选项2',
                    label: '使用'
                },{
                    value:'选项3',
                    label:'使用中'
                }],
                tableData:[{
                    name:'aa',
                    num:234,
                    xfnum:23,
                    hcnum:333,
                    bdnum:4556,
                    htnum:455,
                    cgnum:34545,
                    status:0
                },{
                    name:'aa',
                    num:234,
                    xfnum:23,
                    hcnum:333,
                    bdnum:4556,
                    htnum:455,
                    cgnum:34545,
                    status:1
                },{
                    name:'aa',
                    num:234,
                    xfnum:23,
                    hcnum:333,
                    bdnum:4556,
                    htnum:455,
                    cgnum:34545,
                    status:2
                },{
                    name:'aa',
                    num:234,
                    xfnum:23,
                    hcnum:333,
                    bdnum:4556,
                    htnum:455,
                    cgnum:34545,
                    status:1
                }],
                currentPage:1,
                pagesize:10,
                selectList:[]
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
                    const tHeader = ['企业名称','登陆账号', '创建时间','账户有效期','税号','营业执照'];
                    const filterVal = ['name', 'num', 'xfnum','hcnum','bdnum','htnum','cgnum'];
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
            handleCurrentChange(currentPage) {
                this.currentPage =currentPage;
            },
            handlesy(index,row){
                console.log(row.status)
                this.tableData[index].status=1
            },
            handletg(index,row){
                this.tableData[index].status=2
            },
            handledh(index,row){
                this.tableData[index].status=3
            },
            handledj(index,row){
                this.tableData[index].status=4
            },
            handlejd(index,row){
                this.tableData[index].status=0
            },
            handleXq(index,row){
                console.log("x详情")
                this.$router.push({name:'zhdetail',params:{userId:'wish'}})
            },
            
        },
        created(){

        }
    }
</script>
<style scoped>
    .pagebutton {
        float:right
    }
    
</style>
