<template>
    <div>
        <el-form :inline="true" :model="myData" class="form-inline">
            <el-form-item label="选择坐席">
                <el-select v-model="myData.ext" placeholder="请选择坐席" clearable>
                    <el-option v-for="item in phoneNumList" :key="item.Number" :label="item.Number" :value="item.Number"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="通话号码">
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
                            value-format="yyyy-MM-dd hh:mm:ss"
                    >
                    </el-date-picker>
                </template>
            </el-form-item>
            <el-form-item label="时长设置">
                <el-select v-model="myData.timeLongType" placeholder="请选择">
                    <el-option v-for="item in timeSet" :key="item.type" :label="item.label" :value="item.type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' @click="getTableList"  style="margin-left:50px;">搜索</el-button>
            </el-form-item>
        </el-form>
        <div class="small-divider"></div>
        <!--获取活动-->
        <div style="padding:20px">
            <el-button v-if="roleId==1" type="primary" @click='goBack'>返回</el-button>
        </div>
        <div class="divider"></div>
        <div class="table-box">
        <el-table :data="tableData" style="width:100%;" show-header v-loading='loading' element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
            <el-table-column type="index" label="序号" :index="indexMethod" align="center"></el-table-column>
            <el-table-column label="项目名称" prop="item_name"></el-table-column>
            <el-table-column label="座席号" prop="user_name"></el-table-column>
            <el-table-column label="端口号" prop="ext"></el-table-column>
            <el-table-column label="开始时间" prop="StartTime">
                <template slot-scope="scope">
                    {{scope.row.StartTime | date(true)}}
                </template>
            </el-table-column>
            <el-table-column label="结束时间" prop="EndTime">
                <template slot-scope="scope">
                    {{scope.row.EndTime | date(true)}}
                </template>
            </el-table-column>
            <el-table-column label="通话号码" prop="phoneNum"></el-table-column>
            <el-table-column label="通话时长(秒)" prop="timeLong"></el-table-column>
            <!-- <el-table-column label="通话时长(分)">
                <template slot-scope="scope">
                    <span>{{scope.row.timeLong/60 | numFilter()}}</span>
                </template>
            </el-table-column> -->
            <el-table-column label="通话费用" prop="fee"></el-table-column>
            <el-table-column label="录音" prop="path" width="290px" align="center">
                <template slot-scope="scope">
                    <div class='audio-box'>
                        <vAudio v-if="scope.row.path" :theUrl="scope.row.path" />
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
                timeSet:[
                    {
                        type:1,
                        label:'60s以内'
                    },
                    {
                        type:2,
                        label:'60s~180s'
                    },
                    {
                        type:3,
                        label:'180s以上'
                    }
                ],
                
                phoneNumList:[],
                loading:false,
                tableData:[],
                total:1,
                myData:{
                    pageIndex:1,
                    pageSize:10,
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
                console.log(row.path)
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
                let token=this.$cookieStore.getCookie('token')
                let params=this.myData
                params.token=token
                params.entId = this.entId
                this.$http.get(this.$api.platform.getTelDetail,{params:params}).then(res=>{
                    if(res.data.code===0){
                        console.log(res)
                        this.tableData=res.data.list
                        this.total=res.data.count
                        this.loading=false
                    }
                })
            },
            goBack(){
                this.$router.push({path:'/telephoneManagement'})
            }
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
    .audio {
        width:200px;
        
    }
    .audioBox{
        display:flex;
        align-items: center;
        width:200px;
        height:30px
    }
    
 

</style>

