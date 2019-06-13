<template>
    <div>
        <el-form :inline="true" :model="myData" class="form-inline">
            <!-- <el-form-item label="客户电话">
                <el-input v-model="searchList.name"></el-input>
            </el-form-item> -->
            <!-- <el-form-item label="营销情况">
                <el-select v-model="myData.intention" placeholder="请选择" style="margin-left:10px;">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="省份">
                <el-input v-model="myData.provide"></el-input>
            </el-form-item>
            <el-form-item label="城市">
                <el-input v-model="myData.area"></el-input>
            </el-form-item>
            <el-form-item label="外呼时间">
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
            <el-form-item label="坐席名称">
                <el-input v-model="myData.realName"></el-input>
            </el-form-item>
            <!-- <el-form-item label="通话时长：">
                <el-input v-model="tableData.stdate"></el-input>
            </el-form-item> -->
            <el-form-item>
                <el-button type='primary' @click="getTableList"  style="margin-left:50px;">搜索</el-button>
            </el-form-item>
        </el-form>
        <div class="small-divider"></div>
        <div style="padding:17px 40px 17px 20px">
            <el-button type="primary" @click="outExe">导出</el-button>
        </div>
        <div class="divider"></div>
        <div class="table-box">
        <el-table :data="tableData" style="width:100%;" show-header @selection-change="changeFun" v-loading='loading' element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index" label="序号" :index="indexMethod" align="center"></el-table-column>
            <el-table-column label="客户电话" prop="phoneNum" width="100px"></el-table-column>
            <el-table-column label="营销情况" prop="intention"></el-table-column>
            <el-table-column label="省份" prop="provide"></el-table-column>
            <el-table-column label="城市" prop="area"></el-table-column>
            <el-table-column label="姓氏/性别" prop="cName"></el-table-column>
            <el-table-column label="外呼时间" prop="startTime" width="150px"></el-table-column>
            <el-table-column label="坐席" prop="realName"></el-table-column>
            <el-table-column label="通话时长" prop="callDuration" sortable width="100px"></el-table-column>
            <el-table-column label="呼叫次数" prop="callNum"></el-table-column>
            <el-table-column label="质检评级" sortable width="100px">
                <template  slot-scope="scope">
                    <el-button type="text" style="color:red" v-if="scope.row.LEVEL===0">无</el-button>
                    <el-button type="text" v-if="scope.row.LEVEL===1">优</el-button>
                    <el-button type="text" v-if="scope.row.LEVEL===2">良</el-button>
                    <el-button type="text" v-if="scope.row.LEVEL===3">一般</el-button>
                    <el-button type="text" v-if="scope.row.LEVEL===4">差</el-button>
                </template> 
            </el-table-column>
            <el-table-column label="备注" prop="content"></el-table-column>
            <!-- <el-table-column label='录音' width="250px" align="center">
                <template slot-scope="scope">
                    <div>
                        <audio ref="audio" class="audioBox"
                             
                             controls="controls"
                             autoplay="autoplay"
                             loop="loop"
                        >
                            <source :src="scope.row.record_url" type="audio/wav" />
                        </audio>
                    </div>
                </template>
            </el-table-column> -->
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="particulars(scope.row)">详情</el-button>
                    
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
            <el-pagination class="pagebutton" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20,30,100]" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
        <!--详情-->
        <el-dialog title="详情" :visible.sync="particularsDialog" width="600px">
            <el-form ref="form" :model="form" label-width="80px" label-position="right">
                <el-form-item label="营销情况">
                    <!-- <el-select v-model="form.status" placeholder="请选择">
                        <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select> -->
                    <span>{{form.intention}}</span>
                </el-form-item>
                <!-- <el-form-item label="坐席反馈">
                    <el-input type="textarea" v-model="form.desc"></el-input>
                </el-form-item> -->
                <el-form-item label="质检评级">
                    <!-- <el-select v-model="form.deji" placeholder="请选择">
                        <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select> -->
                    <span v-if="form.LEVEL===0">无</span>
                    <span v-if="form.LEVEL===1">优</span>
                    <span v-if="form.LEVEL===2">良</span>
                    <span v-if="form.LEVEL===3">一般</span>
                    <span v-if="form.LEVEL===4">差</span>
                </el-form-item>
                <el-form-item label="质检反馈">
                    <el-input type="textarea" v-model="form.content" disabled></el-input>
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
                selectList:[],
                loading:false,
                form:{
                    desc:'',
                    status:'',
                    deji:''
                },
               particularsDialog:false,
                tableData:[],
                total:1,
                myData:{
                    pageIndex:1,
                    pageSize:10,
                },
                time:null,
                audio:{
                    playing:false,
                }
            }
        },
        methods:{
            startPlayOrPause () {
                return this.audio.playing ? this.pause() : this.play()
            },
            play(){
                this.$refs.audio.play()
            },
            pause(){
                this.$refs.audio.pause()
            },
            onPlay () {
                this.audio.playing = true
            },
            onPause () {
                this.audio.playing = false
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
                    console.log(1)
                   this.myData.startTime=this.time[0];
                   this.myData.endTime =this.time[1];
                }else{
                    delete this.myData.startTime
                    delete this.myData.endTime
                }
                let token=this.$cookieStore.getCookie('token')
                let params=this.myData
                params.token=token
                this.$http.get(this.$api.firm.recordList,{params:params}).then(res=>{
                    if(res.data.code===0){
                        console.log(res)
                        this.tableData=res.data.list
                        this.total=res.data.count
                        this.loading=false
                    }
                })
            },
            //表格选中事件
            changeFun(val){
                this.selectList=val
                //console.log(this.selectList)
            }, 
            particulars(row){
                this.form=row
                this.particularsDialog=true
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
                    const tHeader = ['客户电话','省份', '城市','姓氏/性别','坐席','录音'];
                    const filterVal = ['phoneNum', 'provide', 'area','cName','realName','record_url'];
                    const list = this.excelData;
                    const data = this.formatJson(filterVal, list);
                    export_json_to_excel(tHeader, data, '下载录音');
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },
            loadRecord(){

            }
        },
        filters: {
            // 使用组件过滤器来动态改变按钮的显示
            transPlayPause(value) {
            return value ? '暂停' : '播放'
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

