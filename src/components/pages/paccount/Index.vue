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
        <el-row :gutter="20">
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
                    <div class="two"><span>6,560</span></div>
                    <div class="three-box">
                        
                    </div>
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
                    <div class="two"><span>0D 15H 24M 54S</span></div>
                    <div class="three-box">
                    
                    </div>
                    <div class="four"><span class="buding">累积拨打时长</span><span>1D 15H 24M 34S</span></div>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="6">
                <div class="grid-content bg-purple twoFloor">
                    <div><strong>漏斗模型</strong><i class="el-icon-mobile-phone"></i></div>
                    
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple">
                    
                </div>
            </el-col>
            <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
        </el-row>
        <el-row :gutter="20" class="lineChart">
            <el-col :span="24">
                <div class="grid-content bg-purple">
                    <div id="myChart" style="height:400px"></div> 
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    // 引入基本模板
    let echarts = require('echarts/lib/echarts')
    // 引入柱状图组件
     require('echarts/lib/chart/bar')
    require('echarts/lib/chart/pie')
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
        
      }
    },
    
    mounted() {
        this.drawLine()
        
    },
    methods: {
        drawLine() {
            let myChart=echarts.init(document.getElementById('myChart'))
            myChart.setOption({
                color:['blue'],
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
            })
        }, 
    }
  }
</script>
<style lang="scss" scoped>
   .appindex {
        background: #ebebeb;
        height:100%;
        padding-bottom:50px;
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
      font-size:24px;
      margin-top:10px;
  }
  .wjhsInfo .three-box {
      height:80px;
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
</style>
