<template>
    <div>
        <el-form :inline="true" :model="myData" class="form-inline">
            <el-form-item label="企业名称">
                <el-select v-model="myData.ext" placeholder="请填写企业名称" clearable>
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
        <div class="divider"></div>
        <div class="table-box">
        <el-table :data="tableData" style="width:100%;" show-header v-loading='loading' element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
            <el-table-column type="index" label="序号" :index="indexMethod" align="center"></el-table-column>
            <el-table-column label="企业Id" prop="ent_id"></el-table-column>
            <el-table-column label="企业名称" prop="company"></el-table-column>
            <el-table-column label="创建时间" prop="create_time">
                <template slot-scope="scope">
                    {{scope.row.create_time | date(true)}}
                </template>
            </el-table-column>
            <el-table-column label="座席数" prop="seat_count"></el-table-column>
            <el-table-column label="端口数" prop="ext_count"></el-table-column>
            <el-table-column label="项目数量" prop="project_count"></el-table-column>
            <!-- <el-table-column label="结束时间" prop="EndTime">
                <template slot-scope="scope">
                    {{scope.row.EndTime | date(true)}}
                </template>
            </el-table-column> -->
            <el-table-column label="话单条数" prop="call_count"></el-table-column>
            <!-- <el-table-column label="通话时长(秒)" prop="timeLong"></el-table-column> -->
            <el-table-column label="通话时长(分)">
                <template slot-scope="scope">
                    <span>{{scope.row.time_long/60 | numFilter()}}</span>
                </template>
            </el-table-column>
            <el-table-column label="通话费用">
                <template slot-scope="scope">
                    <span>{{scope.row.voice_amount2 !== null?scope.row.voice_amount2:scope.row.voice_amount}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type='primary' size="mini" @click='trafficDetail(scope.row)'>详情</el-button>
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
            }
        },
        mounted(){
        },
        methods:{
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
                let token=this.$cookieStore.getCookie('token')
                let params=this.myData
                params.token=token
                this.$http.get(this.$api.platform.getTelList,{params:params}).then(res=>{
                    if(res.data.code===0){
                        console.log(res)
                        this.tableData=res.data.list
                        this.total=res.data.count
                        this.loading=false
                    }
                })
            },
            trafficDetail(row){
                let entId = row.ent_id
                this.$router.push({path:'/telephonetraffic',query:{entId:entId}})
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

