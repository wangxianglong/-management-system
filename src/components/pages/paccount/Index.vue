<template>
    <div class="appindex">
        <el-row :gutter="20">
            <el-col :span="24" >
                <div class="grid-content bg-purple oneFloor">
                    <span>项目</span>
                    <el-select class="mySelect" v-model="value" placeholder="全部" style="margin-left:30px;">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-radio-group v-model="radio3" style="margin-left:10px;">
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
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="fourbox">
            <el-col :span="6">
                <div class="grid-content bg-purple wjhsInfo">
                    <div class="one"><span>营销总量</span><i class="el-icon-info"></i></div>
                    <div class="two"><span>1,500</span></div>
                    <div class="three-box">
                    <div class="three">
                        <span style="color:#aaa;margin-right:10px">同比</span>
                        <i class="el-icon-caret-top" style="color:green;margin-right:10px"></i>
                        <span>12%</span>
                        <span style="margin:0 10px 0 20px;">环比</span>
                        <i class="el-icon-caret-bottom" style="color:red;margin-right:10px"></i>
                        <span>11%</span>
                    </div>
                    </div>
                    <div class="four"><span class="buding">营销总量</span><span>2500</span></div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple wjhsInfo">  
                    <div class="one"><span>外呼次数</span><i class="el-icon-info"></i></div>
                    <div class="two" style="padding:20px"><span>6,560</span></div>
                    <div class="four"><span class="buding">呼通率</span><span>60%</span></div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple wjhsInfo">
                    <div class="one"><span>营销总量</span><i class="el-icon-info"></i></div>
                    <div class="two"><span>1,500</span></div>
                    <div class="three-box">
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
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple wjhsInfo">
                    <div class="one"><span>拨打时长</span><i class="el-icon-info"></i></div>
                    <div class="two" style="padding:20px"><span>0D 15H 24M 54S</span></div>
                    <div class="four"><span class="buding">累积拨打时长</span><span>1D 15H 24M 34S</span></div>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="6">
                <div class="grid-content bg-purple twoFloor" style="height:400px">
                    <div class="floor-title"><strong>漏斗模型</strong><i class="el-icon-mobile-phone"></i></div>
                    <div id="chartmainfunnel" style="height:350px"></div>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple" style="height:400px">
                    <div class="floor-title"><strong>通话时长&占比</strong><i class="el-icon-mobile-phone"></i></div>
                    <div style="padding-right:50px">
                        <div id="chartmainbar" style="height:300px"> </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple" style="height:400px">
                    <div class="floor-title"><strong>通话次数&意向客户排名</strong><i class="el-icon-mobile-phone"></i></div>
                    <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" width="100%" show-header>
                        <el-table-column type="index" :index="indexMethod" align="center"></el-table-column>
                        <el-table-column label="坐席" prop="name"></el-table-column>
                        <el-table-column label="呼叫次数" prop="num"></el-table-column>
                        <el-table-column label="意向数" prop="using"></el-table-column>
                    </el-table>
                    <div class="fpage">
                        <el-pagination class="pagebutton" small @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[12,100,300,400]" :pager-count="5" :page-size="12" layout="sizes, prev, pager, next" :total="400">
                        </el-pagination>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="lineChart">
            <el-col :span="24">
                <div class="grid-content bg-purple">
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
        pagesize:6,
        tableData:[{
                    name:'aa',
                    num:234,
                    using:10,
                    unuse:4,
                    stopped:3
                },{
                    name:'aa',
                    num:234,
                    using:10,
                    unuse:4,
                    stopped:3
                },{
                    name:'aa',
                    num:234,
                    using:10,
                    unuse:4,
                    stopped:3
                },{
                    name:'aa',
                    num:234,
                    using:10,
                    unuse:4,
                    stopped:3
        }],
        optionline:{
            color:['rgb(55,161,255)'],
            title:{text:'外呼次数'},
            tooltip:{},
            xAxis:{
                data:["9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"]
            },
            yAxis: {
                
            },
            series: [{
                name: '时间',
                type: 'bar',
                barWidth:'40%',
                barColor:'blue',
                data: [250,500,750,100,220,330,450,440,555,660,760,770]
            }]
        },
        optionbar:{
                 tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)",
                    show:false
                },
                legend: {
                    orient: 'vertical',
                    x: 'right',
                    y:'center',
                    data:['未接通',`00':01"～00':15"`,`00':16"～00':30"`,`00':31"～02':00"`,`02':01"以上`]
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
                            {value:36, name:'未接通'},
                            {value:20, name:`00':01"～00':15"`},
                            {value:36, name:`00':16"～00':30"`},
                            {value:20, name:`00':31"～02':00"`},
                            {value:36, name:`02':01"以上`}
                        ]
                    }
                ]
            
        },
        optionfunnel:{
            
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}%"
            },
            
            legend: {
                data: ['数据量','下发量','拨打量','呼通量','成功量'],
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
                    max: 13000000,
                    minSize: '20%',
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
                    data: [
                        {value: 12345678, name: '数据量'},
                        {value: 2345678, name: '下发量'},
                        {value: 345678, name: '拨打量'},
                        {value: 45678, name: '呼通量'},
                        {value: 5678, name: '成功量'}
                    ]
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
        handleCurrentChange(currentPage) {
            this.currentPage =currentPage;
        },
        drawLine() {
            let that=this
            let chartmainline=this.$echarts.init(document.getElementById('chartmainline'))
            chartmainline.setOption(this.optionline)
            let chartmainbar=this.$echarts.init(document.getElementById('chartmainbar'))
            chartmainbar.setOption(this.optionbar);
            let chartmainfunnel=this.$echarts.init(document.getElementById('chartmainfunnel'))
            chartmainfunnel.setOption(this.optionfunnel)
            window.addEventListener('resize', function () {
                chartmainline.resize()
                chartmainbar.resize()
                chartmainfunnel.resize()
            })
        },
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
      font-size:14px;
      padding:20px 20px 5px 20px;
      margin-top:20px;
  }
  .wjhsInfo .one{
      color:#aaa;
      display:flex;
      justify-content: space-between
  }
  .wjhsInfo .two{
      font-size:30px;
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
