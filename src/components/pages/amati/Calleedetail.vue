<template>
    <div class="itemadd">
        <el-form :inline="true" class="form-inline" v-model="searchList">
            <el-form-item label="姓氏">
                <el-input placeholder="请输入名称" v-model="searchList.taskname"></el-input>
            </el-form-item>
            <el-form-item label="性别">
                <el-select v-model="value" placeholder="请选择" style="margin-left:10px;">
                    <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="通话时长">
                <el-select v-model="value" placeholder="请选择" style="margin-left:10px;">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' style="margin-left:50px;">搜索</el-button>
            </el-form-item>
        </el-form>
        <div class="small-divider"></div>
        <div style="padding:17px 40px 17px 20px">
            <el-button type="primary" @click="goback">返回</el-button>
        </div>
        <div class="divider"></div>
        <div class="table-box">
        <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width:100%;" show-header >
            <el-table-column type="index" label="序号" :index="indexMethod" align="center" width="100px"></el-table-column>
            <el-table-column label="姓氏/性别" prop="orderNum" sortable></el-table-column>
            <el-table-column label="电话" prop="orderMargin" sortable></el-table-column>
            <el-table-column label="省份" prop="createTime" sortable></el-table-column>
            <el-table-column label="地市" prop="startTime" sortable></el-table-column>
            <el-table-column label="呼叫次数" prop="endTime" sortable></el-table-column>
            <el-table-column label="最后拨打时间" prop="endTime" sortable></el-table-column>
            <el-table-column label="通话时长" prop="endTime" sortable></el-table-column>
            <el-table-column label="客户有效期" sortable>
                <el-button type="text" @click="whdialog">失效</el-button>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="taskEdit(scope.$index,scope.row)">外呼</el-button>
                </template>
            </el-table-column>
        </el-table>
        </div>
        <!--分页导航-->
        <div class="fpage">
            <el-pagination class="pagebutton" background @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="400">
            </el-pagination>
        </div>
        <el-dialog title="呼叫主席" :visible.sync="showcalleeDialog" width="600px">
            <el-form ref="form" :model="form" label-width="60px">
            <span style="color:red;margin:0 20px">外显({{form.tel}})</span><span>电话正在拨打中......{{form.time}}</span>
            <el-form-item label="姓名">
                <el-radio-group v-model="form.gender">
                <el-radio label="先生"></el-radio>
                <el-radio label="女士"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="手机">
                <el-input type="text" v-model="form.phone" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-checkbox-group v-model="form.type">
                    <el-checkbox label="已成交" name="type"></el-checkbox>
                    <el-checkbox label="A" name="type"></el-checkbox>
                    <el-checkbox label="B" name="type"></el-checkbox>
                    <el-checkbox label="C" name="type"></el-checkbox>
                    <el-checkbox label="D" name="type"></el-checkbox>
                    <el-checkbox label="未接通" name="type"></el-checkbox>
                    <el-checkbox label="其他" name="type" disabled></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item>
                <el-input type="textarea" v-model="form.desc" size="medium"></el-input>
            </el-form-item>
            <el-form-item label="话术">
                <el-input type="textarea" v-model="form.desc"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button>加载上一个</el-button>
                <el-button type="primary" @click="onSubmit">保存并拨打下一个</el-button>
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
                form:{
                    tel:1234444,
                    time:222,
                    phone:"",
                    desc:'',
                    type:["其他"],
                    desc:''
                },
                showcalleeDialog:false,
                searchList:{
                    taskname:'',
                    activityname:'',
                    time:''
                },  
                count:1,
                selectName:'',
                firmName:[],
                search:'',
                activityShow:false,
                activityList:[],
                dialogVisible:false,
                value:'', 
                currentPage:1,
                pagesize:10,
                name:'',
                num:'',
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
                    value: '选项1',
                    label: '先生'
                }, {
                    value: '选项2',
                    label: '女士'
                }],
                tableData:[{
                    activityName:'aa',
                    orderNum:234,
                    orderMargin:23,
                    createTime:333,
                    startTime:4556,
                    endTime:455,
                    status:0
                },{
                    activityName:'aa',
                    orderNum:234,
                    orderMargin:23,
                    createTime:333,
                    startTime:4556,
                    endTime:455,
                    status:1
                },{
                    activityName:'aa',
                    orderNum:234,
                    orderMargin:23,
                    createTime:333,
                    startTime:4556,
                    endTime:455,
                    status:2
                },{
                    activityName:'aa',
                    orderNum:234,
                    orderMargin:23,
                    createTime:333,
                    startTime:4556,
                    endTime:455,
                    status:1
                }]
            }
        },
        methods:{
            //初始化
            init (){
                
            },
            goback(){
                this.$router.push({name:'callee'})
            },
            //获取活动列表
            getActivityList(){
                console.log("发送请求")
            },
            //获取活动
            getActivity(){
                
            },
            
            indexMethod(index) {
                return index+1;
            },
            handleCurrentChange(currentPage) {
                this.currentPage =currentPage;
            },
            taskEdit(index,row) {
                //console.log(row);//每行的数据
                //console.log(row.name)//获取活动名
                //console.log(row.num)//获取数据量
                this.dialogVisible=true
                this.name=row.name
                this.num=row.num
                this.showcalleeDialog=true
            },
            saveEdit(index){
                this.dialogVisible=false 
                
            },
            whdialog(){
                this.showcalleeDialog=true
            },
            onSubmit(){
                console.log("保存")
            }
        },
        created(){
            this.init(
                this.getActivityList()
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