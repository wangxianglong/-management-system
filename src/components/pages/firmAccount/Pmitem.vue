<template>
    <div class="itemadd">
        <el-form :inline="true" class="form-inline" v-model="tableData">
            <el-form-item label="项目名">
                <el-input placeholder="请输入项目名称" v-model="search"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select class="mySelect" v-model="value" placeholder="全部" style="margin-left:10px;">
                    <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-date-picker v-model="tableData.crdate" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="开始时间：">
                <el-date-picker v-model="tableData.stdate" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间：">
                <el-date-picker v-model="tableData.jsdate" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' style="margin-left:50px;">搜索</el-button>
            </el-form-item>
        </el-form>
        <div class="small-divider"></div>
        <div style="padding:20px">
            <el-button type="primary" @click='outExe'>导出</el-button>
            <el-button type="primary" @click='addItem'>新建项目</el-button>
            <span style="margin-left:40px">当前未分配活动：{{count}}</span>
        </div>
        <!--弹框-->
        <el-dialog title="新建项目" :visible.sync="addNewitemdialog" width="30%">
            <span><el-input placeholder="请输入项目名称" v-model="itemName"></el-input></span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addNewitemdialog = false">取 消</el-button>
                <el-button type="primary" @click="add">确 定</el-button>
            </span>
        </el-dialog>
        <div class="divider"></div>
        <!--表格-->
        <div class="table-box">
        <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width:100%;" show-header >
            <el-table-column label="项目名" prop="itemName"></el-table-column>
            <el-table-column label="活动量" prop="num" sortable></el-table-column>
            <el-table-column label="创建时间" prop="createTime" sortable></el-table-column>
            <el-table-column label="状态" sortable>
                <template  slot-scope="scope">
                    <el-button type="text" style="color:red" v-if="scope.row.status===0">未分配</el-button>
                    <el-button type="text" v-if="scope.row.status===1">进行中</el-button>
                    <el-button type="text" style="color:#000" v-if="scope.row.status===2">已完成</el-button>
                </template> 
            </el-table-column>
            <el-table-column label="详情" width="150px">
                <template slot-scope="scope">
                    <el-button type="text" @click="delBtn(scope.row)" v-if="scope.row.status===0">删除</el-button>
                    <el-button type="text" @click="coreView(scope.row)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        </div>
        <!--分页导航-->
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
                itemName:"测试项目",  
                addNewitemdialog:false,
                count:1,
                selectName:'',
                search:'',
                activityShow:false,
                activityList:[],
                dialogVisible:false,
                value:'', 
                currentPage:1,
                pagesize:10,
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
                newItem:{},
                tableData:[]
            }
        },
        methods:{
            //初始化
            init (){
                
            },
            //获取项目列表
            getItemlist(){
                let token=this.$cookieStore.getCookie('token')
                let params={pageSize:5,pageIndex:1,token:token}
                this.$http.get(this.$api.firm.itemList,{params:params}).then(res=>{
                    if(res.data.code===0){
                        //console.log(res)
                        this.tableData=res.data.list
                    }
                })
            },
            //新建项目
            addItem(){
                this.addNewitemdialog=true
            },
            add(){
                //console.log(this.itemName)
                let token=this.$cookieStore.getCookie('token')
                let params={itemName:this.itemName,token:token}
                this.$http.post(this.$api.firm.addItem,params).then(res =>{
                    if(res.data.code===0){
                        //console.log(res)
                        this.addNewitemdialog = false
                        this.getItemlist()
                        // this.newItem=res.data
                        // this.tableData.unshift(this.newItem)
                    }
                })
                
            },
            // indexMethod(index) {
            //     return index+1;
            // },
            handleCurrentChange(currentPage) {
                this.currentPage =currentPage;
            },
            coreView(row) {
                //console.log(row);//每行的数据
                //console.log(row.name)//获取活动名
                //console.log(row.num)//获取数据量
                //console.log(row.id)
                let id=row.id
                
                this.$router.push({name:'pmdetail',query:{id:id}})
            },
            delBtn(row){
                this.tableData.splice(row,1)
            },
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
                    const tHeader = ['活动名','数据量', '剩余量','创建时间','开始时间','结束时间'];
                    const filterVal = ['activityName', 'orderNum', 'orderMargin','createTime',' startTime','endTime'];
                    const list = this.excelData;
                    const data = this.formatJson(filterVal, list);
                    export_json_to_excel(tHeader, data, '项目管理');
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },
        },
        created(){
            this.init(
                this.getItemlist() 
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