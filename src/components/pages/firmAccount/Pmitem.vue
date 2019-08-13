<template>
    <div class="itemadd">
        <el-form :inline="true" class="form-inline" :model="myData" ref="myData">
            <el-form-item label="项目名" prop="itemName">
                <el-input placeholder="请输入项目名称" v-model="myData.itemName"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
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
                <el-date-picker v-model="tableData.stdate" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间：">
                <el-date-picker v-model="tableData.jsdate" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item> -->
            <el-form-item>
                <el-button type='primary' size="small" @click="getItemlist">搜索</el-button>
                <el-button size="small" @click="resetForm('myData')">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="small-divider"></div>
        <div style="padding:20px">
            <el-button type="primary" @click='outExe'>导出</el-button>
            <el-button type="primary" @click='addItem'>新建项目</el-button>
            <span style="margin-left:40px">当前未分配行销名单：{{count}}</span>
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
        <el-table :data="tableData" style="width:100%;" show-header :header-cell-style="tableHeaderStyle" border>
            <el-table-column label="项目名" prop="itemName"></el-table-column>
            <el-table-column label="行销名单" prop="num" sortable></el-table-column>
            <el-table-column label="创建时间" prop="createTime" sortable>
                <template slot-scope="scope">
                    {{scope.row.createTime | date(hour)}}
                </template>
            </el-table-column>
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
            <el-pagination class="pagebutton" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20,30,100]" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                time:null,
                hour:true,
                itemName:"",  
                addNewitemdialog:false,
                count:'',
                selectName:'',
                activityShow:false,
                activityList:[],
                dialogVisible:false,
                value:'', 
                options2: [{
                    value: '0',
                    label: '未分配'
                }, {
                    value: '1',
                    label: '进行中'
                },{
                    value:'2',
                    label:'已完成'
                }],
                newItem:{},
                tableData:[],
                total:1,
                myData:{
                    pageIndex:1,
                    pageSize:10,
                    itemName:'',
                    status:'',
                    startTime:'',
                    endTime:''
                }
            }
        },
        methods:{
            //初始化
            init (){
                
            },
            resetForm(myData){
                this.$refs[myData].resetFields()
                this.time = null
                this.getItemlist()
            },
            handleCurrentChange(val) {
                this.myData.pageIndex=val;
                this.getItemlist()
            },
            handleSizeChange(val){
                this.myData.pageSize=val;
                this.getItemlist()
            },
            //获取项目列表
            getItemlist(){
                if (this.time!==null){
                   this.myData.startTime=this.time[0];
                   this.myData.endTime =this.time[1];
                }else{
                    delete this.myData.startTime
                    delete this.myData.endTime
                }
                 
                let params=this.myData
                  
                this.$http.get(this.$api.firm.itemList,{params:params}).then(res=>{
                    if(res.data.code===0){
                        console.log(res)
                        this.tableData=res.data.list
                        this.total=res.data.count
                    }
                })
            },
            //获取可分配行销名单
            getuserActivity(){
                 
                //console.log(token)
                let params={pageIndex:1,pageSize:1000,  status:1}
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
            //新建项目
            addItem(){
                this.addNewitemdialog=true
            },
            add(){
                //console.log(this.itemName)
                 
                let params={itemName:this.itemName}
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
            
            coreView(row) {
                //console.log(row);//每行的数据
                //console.log(row.name)//获取行销名单名
                //console.log(row.num)//获取数据量
                //console.log(row.id)
                let id=row.id
                this.$router.push({name:'pmdetail',query:{id:id}})
            },
            delBtn(row){
                let id=row.id
                let params={id:id}
                this.$http.get(this.$api.firm.delete,{params:params}).then(res=>{
                    if(res.data.code===0){
                        this.getItemlist()
                    }
                })
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
                    const tHeader = ['项目名','行销名单量', '创建时间','状态'];
                    const filterVal = ['itemName', 'num', 'createTime','status'];
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
                this.getItemlist(),
                this.getuserActivity()
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