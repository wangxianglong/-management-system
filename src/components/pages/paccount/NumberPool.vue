<template>
    <div class="itemadd">
        <el-form :inline="true" class="form-inline" :model="myData" ref="myData">
            <el-form-item label="姓氏" prop="firstName">
                <el-input placeholder="请输入名称" v-model="myData.firstName"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-select v-model="myData.sex" placeholder="请选择" style="margin-left:10px;">
                    <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="电话号码" prop="phoneNum">
                <el-input placeholder="请输入电话号码" v-model="myData.phoneNum"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' size="small" @click="getDataList">搜索</el-button>
                <el-button size="small" @click="resetForm('myData')">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="small-divider"></div>
        <div style="padding:17px 0 17px 20px">
            <el-button type="primary" @click="goBack">返回</el-button>
        </div>
        <div class="divider"></div>
        <div class="table-box">
        <el-table :data="tableData" style="width:100%;" show-header :header-cell-style="tableHeaderStyle" border>
            <el-table-column type="index" label="序号" :index="indexMethod" align="center"></el-table-column>
            <el-table-column label="姓氏/性别" prop="cName"></el-table-column>
            <el-table-column label="电话" prop="phoneNum">
                <template slot-scope="scope">
                    <span v-if="scope.row.desensitization === 0">{{scope.row.phoneNum}}</span>
                    <span v-if="scope.row.desensitization === 1">{{scope.row.phoneNum | placePhone()}}</span>
                </template>
            </el-table-column>
            <el-table-column label="省份" prop="provide"></el-table-column>
            <el-table-column label="地市" prop="area"></el-table-column>
            <el-table-column label="呼叫次数" prop="callNum"></el-table-column>
            <el-table-column label="最后拨打时间" prop="lastCallTime">
                <template slot-scope="scope">
                    <span>{{scope.row.lastCallTime | date(true)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="通话时长" prop="callDuration"></el-table-column>
            <!-- <el-table-column label="客户有效期" sortable>
                <el-button type="text" @click="whdialog">失效</el-button>
            </el-table-column> -->
            <!-- <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="detail(scope.$index,scope.row)">详情</el-button>
                </template>
            </el-table-column> -->
        </el-table>
        </div>
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
                myData:{
                    pageIndex:1,
                    pageSize:10,
                    activityId:this.$route.query.activityId,
                    firstName:'',
                    sex:'',
                    phoneNum:''
                },  
                options2: [{
                    value: '先生',
                    label: '先生'
                }, {
                    value: '女士',
                    label: '女士'
                }],
                tableData:[],
                total:1
            }
        },
        mounted(){
            
        },
        methods:{
            //初始化
            init (){
                
            },
            resetForm(myData){
                this.$refs[myData].resetFields()
                this.getDataList()
            },
            handleCurrentChange(val) {
                this.myData.pageIndex=val;
                this.getDataList()
            },
            handleSizeChange(val){
                this.myData.pageSize=val;
                this.getDataList()
            },
            //获取活动列表
            getDataList(){
                let params=this.myData
                this.$http.get(this.$api.platform.getDataList,{params:params}).then(res => {
                    if(res.data.code===0){
                        this.tableData=res.data.list
                        this.total=res.data.count
                    }
                }).catch((err) =>{
                    console.log(err)
                })
            },
            // detail(index,row){},
            indexMethod(index) {
                return index+1;
            },
            goBack(){
                this.$router.push({path:"/itemadd"})
            }
        },
        created(){
            this.init(
                this.getDataList(),
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
</style>