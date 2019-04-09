<template>
    <div>
        <el-form :inline="true" :model="searchList" class="form-inline">
            <el-form-item label="客户电话">
                <el-input v-model="searchList.name"></el-input>
            </el-form-item>
            <el-form-item label="营销情况">
                <el-select v-model="value" placeholder="请选择" style="margin-left:10px;">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="省份">
                <el-input v-model="tableData.crdate"></el-input>
            </el-form-item>
            <el-form-item label="城市">
                <el-input v-model="tableData.stdate"></el-input>
            </el-form-item>
            <el-form-item label="外呼时间">
                <el-date-picker v-model="tableData.jsdate" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="坐席名称">
                <el-input v-model="tableData.stdate"></el-input>
            </el-form-item>
            <el-form-item label="通话时长：">
                <el-input v-model="tableData.stdate"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' @click="search"  style="margin-left:50px;">搜索</el-button>
            </el-form-item>
        </el-form>
        <div class="small-divider"></div>
        <div style="padding:17px 40px 17px 20px">
            <el-button type="primary" @click="loadRecord">下载录音</el-button>
        </div>
        <div class="divider"></div>
        <div class="table-box">
        <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width:100%;" show-header>
            <el-table-column type="index" label="序号" :index="indexMethod" align="center"></el-table-column>
            <el-table-column label="客户电话" prop="phone_num"></el-table-column>
            <el-table-column label="营销情况" prop="intention"></el-table-column>
            <el-table-column label="省份" prop="provide"></el-table-column>
            <el-table-column label="城市" prop="area"></el-table-column>
            <el-table-column label="姓氏/性别" prop="cName"></el-table-column>
            <el-table-column label="外呼时间" prop="startTime"></el-table-column>
            <el-table-column label="坐席" prop="agend_id"></el-table-column>
            <el-table-column label="通话时长" prop="callDuration" sortable width="100px"></el-table-column>
            <el-table-column label="呼叫次数" prop="callNum"></el-table-column>
            <el-table-column label="质检评级" sortable width="100px">
                <template  slot-scope="scope">
                    <el-button type="text" style="color:red" v-if="scope.row.level===0">优</el-button>
                    <el-button type="text" v-if="scope.row.status===1">良</el-button>
                    <el-button type="text" v-if="scope.row.status===2">一般</el-button>
                    <el-button type="text" v-if="scope.row.status===3">差</el-button>
                </template> 
            </el-table-column>
            <el-table-column label="备注" prop="endTime"></el-table-column>
            <el-table-column label="操作" width="300px">
                <template slot-scope="scope" style="text-align:center">
                    <div class="audioBox">
                        <el-button type="text" @click="particulars(scope.row)">详情</el-button>
                        <audio src="/i/song.ogg" controls="controls" style="width:200px;height:30px">
                        Your browser does not support the audio element.
                        </audio>
                    </div>
                    
                    <!--
                    <div class="in-audio">
                        <audio src="http://sc1.111ttt.com/2017/4/05/10/298101104389.mp3" id="audio"></audio>
                        <div class="progress">
                        <mu-slider v-model="value" class="progress-item" v-on:change="changeprogress" />
                        </div>
                        <div class="play" v-on:click="startaudio">播放</div>
                        <div class="stop" v-on:click="stopaudio">暂停</div>
                        <div class="time">{{currentminutetime}}:{{currentsecondtime}} / {{allminutetime}}:{{allsecondtime}}</div>
                    </div>
                    -->
                </template>
            </el-table-column>
        </el-table>
        </div>
        <div class="fpage">
            <el-pagination class="pagebutton" background @current-change="handleCurrentChange" :current-page="currentPage" layout="total, sizes, prev, pager, next, jumper" :total="400">
            </el-pagination>
        </div>
        <!--详情-->
        <el-dialog title="修改" :visible.sync="particularsDialog" width="600px">
            <el-form ref="form" :model="form" label-width="80px" label-position="right">
                <el-form-item label="营销情况">
                    <el-select v-model="form.status" placeholder="请选择">
                        <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="坐席反馈">
                    <el-input type="textarea" v-model="form.desc"></el-input>
                </el-form-item>
                <el-form-item label="质检评级">
                    <el-select v-model="form.deji" placeholder="请选择">
                        <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="质检反馈">
                    <el-input type="textarea" v-model="form.desc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="particularsDialog = false">取 消</el-button>
                <el-button type="primary" @click="particularsDialog = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                form:{
                    desc:'',
                    status:'',
                    deji:''
                },
               particularsDialog:false,
                options2: [{
                    value: '选项1',
                    label: '成功'
                }, {
                    value: '选项2',
                    label: '下次再呼'
                },{
                    value: '选项3',
                    label: '拉黑'
                },{
                    value: '选项4',
                    label: '其他'
                },{
                    value: '选项5',
                    label: '未保存'
                },{
                    value: '选项6',
                    label: '失败'
                }],
                options1:[{
                    value: '选项1',
                    label: '优'
                }, {
                    value: '选项2',
                    label: '良'
                },{
                    value: '选项3',
                    label: '一般'
                },{
                    value: '选项4',
                    label: '差'
                }],
                options: [{
                    value: '选项1',
                    label: '成功'
                }, {
                    value: '选项2',
                    label: '下次再呼'
                },{
                    value: '选项3',
                    label: '拉黑'
                },{
                    value: '选项4',
                    label: '其他'
                },{
                    value: '选项5',
                    label: '未保存'
                },{
                    value: '选项6',
                    label: '失败'
                }],
                searchList:{
                    name:''
                },
                value:'',
                createtime:'',
                tableData:[],
                currentPage:1,
                pagesize:10,
            }
        },
        methods:{
            indexMethod(index) {
                return index+1;
            },
            handleCurrentChange(currentPage) {
                this.currentPage =currentPage;
            },
            search(){
                console.log('搜索')
            },
            //获取表格列表
            getTableList(){
                let token=this.$cookieStore.getCookie('token')
                let params={token:token}
                this.$http.get(this.$api.firm.recordList,{params:params}).then(res=>{
                    if(res.data.code===0){
                        console.log(res)
                        this.tableData=res.data.list
                    }
                })
            },
            particulars(row){
                this.particularsDialog=true
            },
            loadRecord(){

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
        align-items: center
    }
</style>

