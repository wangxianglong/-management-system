<template>
    <div>
        <el-form :inline="true" :model="myData" class="form-inline" ref="myData">
            <el-form-item label="选择坐席" prop="userName" v-if="roleId !=5">
                <!-- <el-select v-model="myData.ext" placeholder="请选择坐席" clearable>
                    <el-option v-for="item in phoneNumList" :key="item.Number" :label="item.Number" :value="item.Number"></el-option>
                </el-select> -->
                <el-input v-model="myData.userName" placeholder="请输入坐席号"></el-input>
            </el-form-item>
            <el-form-item label="通话号码" prop="phoneNum">
                <el-input v-model="myData.phoneNum"></el-input>
            </el-form-item>
            <el-form-item label="通话时间">
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
            <el-form-item label="时长设置" prop="timeLongType">
                <el-select v-model="myData.timeLongType" placeholder="请选择">
                    <el-option v-for="item in timeSet" :key="item.set" :label="item.label" :value="item.set"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="意向" prop="intention">
                <el-select v-model="myData.intention" placeholder="请选择意向">
                    <el-option v-for="item in intentionList" :key="item.type" :label="item.label" :value="item.type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' @click="getTableList"  style="margin-left:50px;" size="small">搜索</el-button>
                <el-button type='primary' @click="resetForm('myData')" size="small">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="small-divider"></div>
        <!--获取活动-->
        <div style="padding:20px">
            <el-button type="primary" @click="outExe">导出</el-button>
            <el-button v-if="roleId==1" type="primary" @click='$router.go(-1)'>返回</el-button>
        </div>
        <div class="divider"></div>
        <div class="table-box">
        <el-table :data="tableData" style="width:100%;" show-header :header-cell-style="tableHeaderStyle" v-loading='loading' element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)" border>
            <el-table-column type="index" label="序号" :index="indexMethod" align="center" width="120px"></el-table-column>
            <el-table-column label="项目名称" prop="item_name" width="150px"></el-table-column>
            <el-table-column label="座席号" prop="user_name" width="150px"></el-table-column>
            <el-table-column label="使用人" prop="real_name" width="150px"></el-table-column>
            <el-table-column label="端口/外显号" prop="ext" width="120px"></el-table-column>
            <el-table-column label="通话号码" prop="phoneNum" width="150px">
                <template slot-scope="scope">
                    <el-popover placement='top-start' width="200" trigger="hover" :content="scope.row.comment" :disabled="scope.row.comment?false:true">
                        <el-button type="text" slot="reference" v-if="scope.row.desensitization === 0">{{scope.row.phoneNum}}</el-button>
                        <el-button type="text" slot="reference" v-if="scope.row.desensitization === 1">{{scope.row.phoneNum | placePhone()}}</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="开始时间" prop="StartTime" width="160px">
                <template slot-scope="scope">
                    {{scope.row.StartTime | date(true)}}
                </template>
            </el-table-column>
            <el-table-column label="结束时间" prop="EndTime" width="160px">
                <template slot-scope="scope">
                    {{scope.row.EndTime | date(true)}}
                </template>
            </el-table-column>
            
            <el-table-column label="通话时长(秒)" prop="timeLong" width="120px"></el-table-column>
            <el-table-column label="意向" prop="intention">
                <template slot-scope="scope">
                    <span v-if='scope.row.intention === 1'>A</span>
                    <span v-if='scope.row.intention === 2'>B</span>
                    <span v-if='scope.row.intention === 3'>C</span>
                    <span v-if='scope.row.intention === 4'>D</span>
                    <span v-if='scope.row.intention === 6'>拒接</span>
                    <span v-if='scope.row.intention === 7'>忙音/关机</span>
                    <span v-if='scope.row.intention === 8 || scope.row.intention == null'>其他</span>
                </template>
            </el-table-column>
            <!-- <el-table-column label="通话时长(分)">
                <template slot-scope="scope">
                    <span>{{scope.row.timeLong/60 | numFilter()}}</span>
                </template>
            </el-table-column> -->
            <!-- <el-table-column label="通话费用" prop="fee"></el-table-column> -->
            <el-table-column label="录音" prop="path" width="350px" align="center">
                <template slot-scope="scope">
                    <div class='audio-box'>
                        <vAudio :theUrl="scope.row.path" v-if="reFresh"/>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        </div>
        <div class="fpage">
            <el-pagination class="pagebutton" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20,30,100]" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
        <!-- <div v-for="(item, index) in audios" :key="index">
            <vAudio :theUrl="item.url" :theControlList="item.controlList"/>
        </div> -->
    </div>
</template>
<script>
import vAudio from '../../common/VueAudio'
    export default {
        data(){
            return {
                reFresh:false,
                timeSet:[
                    {
                        set:1,
                        label:'60s以内'
                    },
                    {
                        set:2,
                        label:'60s~180s'
                    },
                    {
                        set:3,
                        label:'180s以上'
                    }
                ],
                intentionList:[
                    {
                        type:1,
                        label:'A'
                    },
                    {
                        type:2,
                        label:'B'
                    },
                    {
                        type:3,
                        label:'C'
                    },
                    {
                        type:4,
                        label:'D'
                    },
                    {
                        type:6,
                        label:'拒接'
                    },
                    {
                        type:7,
                        label:'忙音/关机'
                    },
                    {
                        type:8,
                        label:'其他'
                    },
                ],
                phoneNumList:[],
                loading:false,
                tableData:[],
                total:1,
                myData:{
                    pageIndex:1,
                    pageSize:10,
                    userName:"",
                    phoneNum:'',
                    startTime:'',
                    endTime:'',
                    timeLongType:'',
                    intention:''
                },
                time:null,
                entId:'',
                roleId:sessionStorage.getItem('roleId')
            }
        },
        components:{
            vAudio
        },
        mounted(){
            this.$http.get(this.$api.user.getExtNumber,{}).then(res => {
                if(res.data.code===0){
                    this.phoneNumList=res.data.list
                }
            })
        },
        methods:{
            audioPlay(row){
                //console.log(row.path)
                if(row.path === undefined){
                    this.$message.error('没有录音文件')
                }else{
                    this.$refs.audio.play()
                }
            },
            indexMethod(index) {
                return index+1;
            },
            handleCurrentChange(val) {
                this.myData.pageIndex=val;
                this.getTableList()
            },
            handleSizeChange(val){
                this.myData.pageSize=val;
                this.getTableList()
            },
            //获取表格列表
            getTableList(){
                this.reFresh = false
                this.loading=true
                if (this.time!==null){
                   this.myData.startTime=this.time[0];
                   this.myData.endTime =this.time[1];
                }else{
                    delete this.myData.startTime
                    delete this.myData.endTime
                }
                if(window.location.href.split('?').length!==1){
                    this.entId=this.$route.query.entId
                }else{
                    this.entId=sessionStorage.getItem('entId')
                }
                 
                let params=this.myData
                  
                params.entId = this.entId
                this.$http.get(this.$api.platform.getTelDetail,{params:params}).then(res=>{
                    if(res.data.code===0){
                        //console.log(res)
                        this.tableData=res.data.list
                        this.total=res.data.count
                        this.loading=false
                        this.$nextTick( ()=>{
                            this.reFresh = true
                        })
                    }
                })
            },
            resetForm(myData){
                this.$nextTick(()=>{})
                this.$refs[myData].resetFields();
                this.time = null
                this.getTableList()
            },
            //导出
            outExe() {
                function copyArr(arr){
                    return arr.map((e)=>{
                        if(typeof e === 'object'){
                            return Object.assign({},e)
                        }else{
                            return e
                        }
                    })
                }
                let excelList = copyArr(this.tableData)
                let filters = this.$root.$options.filters
                for (let item of excelList) {
                    item.phoneNum=filters.placePhone(item.phoneNum)
                    item.StartTime=filters.date(item.StartTime,true)
                    item.EndTime=filters.date(item.EndTime,true)
                    switch (item.intention) {
                        case 1:
                            item.intention = "A";
                            break;
                        case 2:
                            item.intention = "B";
                            break;
                        case 3:
                            item.intention = "C";
                            break;
                        case 4:
                            item.intention = "D";
                            break;
                        case 6:
                            item.intention = "拒接";
                            break;
                        case 7:
                            item.intention = "忙音/关机";
                            break;
                        default:
                            item.intention = "其他";
                    }
                }
                this.$confirm('此操作将导出excel文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    
                    this.excelData = excelList//你要导出的数据list。
                    this.export2Excel()
                }).catch(() => {

                });
            },
            export2Excel() {
                require.ensure([], () => {
                    const {export_json_to_excel} = require('@/vendor/Export2Excel');
                    const tHeader = ['项目名称','坐席号', '端口号','开始时间','结束时间','通话号码','备注','通话时长(秒)','意向','录音'];
                    const filterVal = ['item_name', 'user_name','ext','StartTime','EndTime','phoneNum', 'comment','timeLong','intention','path'];
                    const list = this.excelData;
                    const data = this.formatJson(filterVal, list);
                    export_json_to_excel(tHeader, data, '话单详情');
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },
        },
        created(){
            this.getTableList()
        },
        
    }
</script>
<style scoped>
    .pagebutton {
        float:right
    }
    
    .audioBox{
        
    }
    
 

</style>

