<template>
    <div class="appindex">
        <el-row :gutter="20">
            <el-col :span="24" >
                <div class="grid-content bg-purple oneFloor">
                    <span>项目</span>
                    <el-select class="mySelect" v-model="value" placeholder="全部" style="margin-left:30px;">
                        <el-option v-for="item in options" :key="item.id" :label="item.itemName" :value="item.id"></el-option>
                    </el-select>
                    <!-- <el-radio-group v-model="radio3" style="margin-left:10px;">
                        <el-radio label="昨天"></el-radio>
                        <el-radio label="今日"></el-radio>
                        <el-radio label="本周"></el-radio>
                        <el-radio label="本月"></el-radio>
                        <el-radio label="全年"></el-radio>
                    </el-radio-group>
                    <div class="block" style="margin-left:30px;">
                        <el-date-picker
                        v-model="value4"
                        type="daterange"
                        range-separator="~"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                        </el-date-picker>
                    </div> -->
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="fourbox">
            <el-col :span="6">
                <div class="grid-content bg-purple wjhsInfo">
                    <div class="one">
                        <strong>营销总量</strong>
                        <el-tooltip placement="top">
                        <div slot="content">坐席拨打的用户量</div>
                            <i class="el-icon-info"></i>
                        </el-tooltip>
                    </div>
                    <div class="two" style="padding:20px"><span>{{statistics.expiration | toString}}</span></div>
                    <!-- <div class="three-box">
                    <div class="three">
                        <span style="color:#aaa;margin-right:10px">同比</span>
                        <i class="el-icon-caret-top" style="color:green;margin-right:10px"></i>
                        <span>12%</span>
                        <span style="margin:0 10px 0 20px;">环比</span>
                        <i class="el-icon-caret-bottom" style="color:red;margin-right:10px"></i>
                        <span>11%</span>
                    </div>
                    </div>
                    <div class="four"><span class="buding">营销总量</span><span>2500</span></div> -->
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple wjhsInfo">  
                    <div class="one">
                        <strong>外呼次数</strong>
                        <el-tooltip placement="top">
                            <div slot="content">坐席拨打电话的次数</div>
                            <i class="el-icon-info"></i>
                        </el-tooltip>
                    </div>
                    <div class="two" style="padding:20px"><span>{{statistics.dialNum | toString}}</span></div>
                    <!-- <div class="four"><span class="buding">呼通率</span><span>60%</span></div> -->
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple wjhsInfo">
                    <div class="one">
                        <strong>呼叫成功率</strong>
                        <el-tooltip placement="top">
                        <div slot="content">呼通15s以及以上通话量<br/>占全部呼叫次数的比</div>
                            <i class="el-icon-info"></i>
                        </el-tooltip>
                    </div>
                    <div class="two" style="padding:20px"><span>{{statistics.cusNum?statistics.successNum/statistics.cusNum:'--' | toString}}</span></div>
                    <!-- <div class="three-box">
                        <el-progress :percentage="78" :text-inside="true" :stroke-width="12" style="width:100%"></el-progress>
                    </div>
                    <div class="four">
                        <div class="three">
                            <span style="color:#aaa;margin-right:10px">同比</span>
                            <i class="el-icon-caret-top" style="color:green;margin-right:10px"></i>
                            <span>12%</span>
                            <span style="margin:0 10px 0 20px;">环比</span>
                            <i class="el-icon-caret-bottom" style="color:red;margin-right:10px"></i>
                            <span>11%</span>
                        </div>
                    </div> -->
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple wjhsInfo">
                    <div class="one">
                        <strong>拨打时长</strong>
                        <el-tooltip placement="top">
                        <div slot="content">通话累计时长</div>
                            <i class="el-icon-info"></i>
                        </el-tooltip>
                    </div>
                    <div class="two" style="padding:20px"><span>{{statistics.duration | toString}}</span></div>
                    <!-- <div class="four"><span class="buding">累积拨打时长</span><span>1D 15H 24M 34S</span></div> -->
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="6">
                <div class="grid-content bg-purple twoFloor" style="height:400px">
                    <div class="floor-title">
                        <strong>漏斗模型</strong>
                        <el-tooltip placement="top">
                            <div slot="content">数据量：可外呼用户<br/>下发量：已下发给坐席的用户<br/>营销量：坐席拨打的用户<br/>呼通量：呼通15s以及以上用户<br/>成功量：通话质量标记为A、B的用户</div>
                            <i class="el-icon-info"></i>
                        </el-tooltip>
                    </div>
                    <div id="chartmainfunnel" style="height:350px"></div>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple" style="height:400px">
                    <div class="floor-title">
                        <strong>通话时长&占比</strong>
                        <el-tooltip placement="top">
                            <div slot="content">各区间通话次数所占总呼<br/>通量的比</div>
                            <i class="el-icon-info"></i>
                        </el-tooltip>
                    </div>
                    <div style="padding-right:50px">
                        <div id="chartmainbar" style="height:300px"> </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple" style="height:400px">
                    <div class="floor-title">
                        <strong>通话次数&坐席排名</strong>
                        <el-tooltip placement="top">
                        <div slot="content">坐席按照通话次数和意向客户<br/>（通话质量标记为A、B的用户）排名</div>
                            <i class="el-icon-info"></i>
                        </el-tooltip>
                    </div>
                    <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" width="100%" show-header>
                        <el-table-column type="index" label="序号" :index="indexMethod" align="center"></el-table-column>
                        <el-table-column label="坐席" prop="user_name" width="150px"></el-table-column>
                        <el-table-column label="呼叫次数" prop="callNum"></el-table-column>
                        <el-table-column label="意向数" prop="intention"></el-table-column>
                    </el-table>
                    <div class="fpage">
                        <el-pagination class="pagebutton" small @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20,30,100]" layout=" prev, pager, next" :total="total">
                        </el-pagination>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="lineChart">
            <el-col :span="24">
                <div class="grid-content bg-purple">
                    <div class="floor-title">
                        <strong>营销量&时间</strong>
                        <el-tooltip placement="top">
                        <div slot="content">不同时间段坐席营销量趋势</div>
                            <i class="el-icon-info"></i>
                        </el-tooltip>
                    </div>
                    <div id="chartmainline" style="height:400px"></div> 
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    // 引入柱状图组件
    require('echarts/lib/chart/bar')
    require('echarts/lib/chart/pie')
    require('echarts/lib/chart/funnel')
    // 引入提示框和title组件
    require('echarts/lib/component/tooltip')
    require('echarts/lib/component/title')
    export default {
    data() {
      return {
          chartmainfunnel:null,
          chartmainbar:null,
          chartmainline:null,
          statistics:{},
          total:1,
          num:1500,
        radio3: '今日',
        value4: [new Date(), new Date()],
        options: [{
          value: '选项1',
          label: '全部'
        }, {
          value: '选项2',
          label: '项目1'
        },{
          value:'选项3',
          label:'项目2'
        }],
        value: '',
        currentPage:1,
        pageSize:5,
        tableData:[],
        optionline:{
            color:['rgb(55,161,255)'],
            
            tooltip:{},
            xAxis:{
                data:['8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00']
            },
            yAxis: {
                
            },
            series: [{
                name: '时间',
                type: 'bar',
                barWidth:'40%',
                barColor:'blue',
                data: []
            }]
        },
        barData:[],
        optionbar:{
                color:['#f0657d','#f9d248','#53ca76','#40cbca','#41a2fc'],
                 tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ",
                    
                },
                legend: {
                    orient: 'vertical',
                    x: 'right',
                    y:'center',
                    data:['未接通','00:01～00:15','00:16～00:30','00:31～02:00','2:00以上']
                },
                // graphic: [{ //环形图中间添加文字
                //     type: 'text', //通过不同top值可以设置上下显示
                //     left: 'center',
                //     top: '45%',
                //     style: {
                //         text: '总通话时长'+'\n'+`12:32'24"`,
                //         textAlign: 'center',
                //         fill: '#000', //文字的颜色
                //         width: 30,
                //         height: 30,
                //         fontSize: 20,
                //         fontFamily: "Microsoft YaHei"
                //     },
                // }],
                
                series: [
                    {
                        name:'访问来源',
                        type:'pie',
                        radius: ['70%', '90%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center',
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '20',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        itemStyle:{
                            borderWidth:5,
                            borderColor:'#fff'
                        },
                        data:[
                            
                        ]
                    }
                ]
            
        },
        optionfunnel:{
            color:['#64a6e5','#80cd59','#edca67','#e19362','#df685b'],
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}"
            },
            
            legend: {
                data: ['数据量','下发量','营销量','呼通量','成功量'],
                bottom:0,
                
            },
            calculable: true,
            series: [
                {
                    name:'漏斗图',
                    type:'funnel',
                    left: '10%',
                    top:20,
                    //x2: 80,
                    
                    width: '70%',
                    // height: {totalHeight} - y - y2,
                    min: 0,
                    max: 300,
                    minSize: '0',
                    maxSize: '100%',
                    sort: 'descending',
                    gap: 2,
                    label: {
                        show: true,
                        position: 'inside'
                    },
                    labelLine: {
                        length: 10,
                        lineStyle: {
                            width: 1,
                            type: 'solid'
                        }
                    },
                    itemStyle: {
                        borderColor: '#fff',
                        borderWidth: 1
                    },
                    emphasis: {
                        label: {
                            fontSize: 20
                        }
                    },
                    data: []
                }
            ]
        }
      }
        
    },
    
    mounted() {
        this.drawLine()
    },
    methods: {
        indexMethod(index) {
            return index+1;
        },
        handleCurrentChange(val) {
            this.currentPage =val;
            this.getDataList()
        },
        handleSizeChange(val){
            this.pageSize=val;
            this.getDataList()
        },
        getDataList(){
            let token=this.$cookieStore.getCookie('token')
            let params={token:token,pageIndex:this.currentPage,pageSize:this.pageSize}
            this.$http.get(this.$api.platform.index,{params:params}).then(res=>{
                if(res.data.code===0){
                    console.log(res)
                    this.chartmainbar.setOption({
                        series:[{
                            data:res.data.data
                        }]
                    })
                    
                    this.tableData=res.data.seatList
                    
                    this.statistics=res.data.statistics
                    let arr=[{name:'数据量'},{name:'下发量'},{name:'营销量'},{name:'呼通量'},{name:'成功量'}]
                    arr[0].value=this.statistics.cusNum
                    arr[1].value=this.statistics.assignNum
                    arr[2].value=this.statistics.expiration
                    arr[3].value=this.statistics.flux
                    arr[4].value=this.statistics.successNum
                    //console.log(arr)
                    this.chartmainfunnel.setOption({
                        series:[{
                            data:arr
                        }]
                    })
                    this.chartmainline.setOption({
                        series:[{
                            data:res.data.timeData.series[0].data
                        }]
                    })
                }
            }).catch(error=>{
                console.log(error)
            })
        },
        getItemList(){
            let token=this.$cookieStore.getCookie('token')
            let pageSize=200
            let pageIndex=1
            let params={pageSize:pageSize,pageIndex:pageIndex,token:token}
            this.$http.get(this.$api.platform.itemList,{params:params}).then(res=>{
                if(res.data.code===0){
                    //console.log(res)
                    this.options=res.data.list
                }
            })
        },
        drawLine() {
            let that=this
            this.chartmainline=this.$echarts.init(document.getElementById('chartmainline'))
            this.chartmainline.setOption(this.optionline)
            this.chartmainbar=this.$echarts.init(document.getElementById('chartmainbar'))
            this.chartmainbar.setOption(this.optionbar);
            this.chartmainfunnel=this.$echarts.init(document.getElementById('chartmainfunnel'))
            this.chartmainfunnel.setOption(this.optionfunnel)
            setTimeout(()=>{
                window.addEventListener('resize', function () {
                that.chartmainline.resize()
                that.chartmainbar.resize()
                that.chartmainfunnel.resize()
                })
            },10)
            
        },
    },
    created(){
        this.getDataList()
        this.getItemList()
    }
  }
</script>
<style lang="scss" scoped>
   .appindex {
        background: #ebebeb;
   }
    .el-row {
    width:100%;
    margin-bottom: 20px;
    padding-left:20px;
    &:first-child {
        margin-bottom:0;
    }
    &:last-child {
        margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #fff;
  }
  .bg-purple {
    background: #fff;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .oneFloor {
        padding:10px 0 17px 20px;
        display:flex;
        align-items: center;      
  }
  .el-radio-button__inner {
      border:none; 
  }
  .wjhsInfo {
      
      padding:20px 20px 5px 20px;
      margin-top:20px;
  }
  .wjhsInfo .one{
      
      display:flex;
      justify-content: space-between
  }
  .wjhsInfo .two{
      font-size:25px;
      margin-top:10px;
  }
  .wjhsInfo .three-box {
      height:40px;
      display: flex;
      align-items: center
  }
  .wjhsInfo .three {
      display:flex;
      align-items: center;
  }
  .wjhsInfo .four {
      margin:5px 0 5px 0;
      border-top:1px solid #000;
  }
  .wjhsInfo .four .buding{
      margin-right:10px;
  }
  .floor-title{
      display:flex;
      justify-content: space-between;
      padding:10px 20px
  }
  .fpage{
      float:right;
      padding:10px 0
  }

</style>
