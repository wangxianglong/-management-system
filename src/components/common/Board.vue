<template>
    <div id="board">
        <el-row type="flex" justify="space-between">
            <el-col :span="5">
                <div class="callnum">
                    <span style="margin-right:30px">呼通量</span>
                    <span>
                        <strong>{{myRow.flux}}</strong>
                        /
                        <span style="font-size:14px">{{myRow.cusNum}}</span>
                    </span>
                </div>
                <div class="callratio">
                    <div style="margin-right:30px;"><p style="color:#ccc;font-size:14px">呼通率</p><strong style="font-size:28px">{{myRow.flux/2}}%</strong></div>
                    <div><el-progress type="circle" :percentage="myRow.flux/2" :width="80" :stroke-width="13"></el-progress></div>
                </div>
            </el-col>
            <el-col :span="5">
                <div class="callnum">
                    <span style="margin-right:30px">拨打量</span>
                    <span>
                        <strong>{{myRow.dialNum}}</strong>
                        /
                        <span style="font-size:14px">{{myRow.cusNum}}</span>
                    </span>
                </div>
                <div class="callratio">
                    <div style="margin-right:30px;"><p style="color:#ccc;font-size:14px">拨打率</p><strong style="font-size:28px">{{myRow.dialNum/2}}%</strong></div>
                    <div><el-progress type="circle" :percentage="myRow.dialNum/2" :width="80" :stroke-width="13"></el-progress></div>
                </div>
            
            </el-col>
            <el-col :span="5">
                <div class="callnum">
                    <span style="margin-right:30px">成功量</span>
                    <span>
                        <strong>{{myRow.successNum}}</strong>
                        /
                        <span style="font-size:14px">{{myRow.cusNum}}</span>
                    </span>
                </div>
                <div class="callratio">
                    <div style="margin-right:30px;"><p style="color:#ccc;font-size:14px">成功率</p><strong style="font-size:28px">{{myRow.successNum}}%</strong></div>
                    <div><el-progress type="circle" :percentage="myRow.successNum/2" :width="80" :stroke-width="13"></el-progress></div>
                </div>
            
            </el-col>
            <el-col :span="5">
                <div class="callnum">
                    <span style="margin-right:30px">失败量</span>
                    <span>
                        <strong>{{myRow.failNum}}</strong>
                        /
                        <span style="font-size:14px">{{myRow.cusNum}}</span>
                    </span>
                </div>
                <div class="callratio">
                    <div style="margin-right:30px;"><p style="color:#ccc;font-size:14px">失败率</p><strong style="font-size:28px">{{myRow.failNum}}%</strong></div>
                    <div><el-progress type="circle" :percentage="myRow.failNum/2" :width="80" :stroke-width="13"></el-progress></div>
                </div>
            
            </el-col>
            <el-col :span="5">
                <div class="callnum">
                    <span style="margin-right:30px">再呼次数</span>
                    <span>
                        <strong>{{myRow.againNum}}</strong>
                        /
                        <span style="font-size:14px">{{myRow.cusNum}}</span>
                    </span>
                </div>
                <div class="callratio">
                    <div style="margin-right:50px;"><p style="color:#ccc;font-size:14px">再呼率</p><strong style="font-size:28px">{{myRow.againNum/2}}%</strong></div>
                    <div><el-progress type="circle" :percentage="myRow.againNum/2" :width="80" :stroke-width="13"></el-progress></div>
                </div>
            
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="9">
                <div class="grid-content">
                    <div class="floor-title">
                        <strong>通话时长&占比</strong>
                        <el-tooltip placement="top">
                            <div slot="content">各区间通话次数所占总呼<br/>通量的比</div>
                            <i class="el-icon-info"></i>
                        </el-tooltip>
                    </div>
                    <div>
                        <div id="chartmainbar" style="height:350px"> </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content">
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
            <el-col :span="7">
                <div class="grid-content" style="height:400px">
                    <div class="floor-title">
                        <strong>通话次数&意向客户排名</strong>
                        <el-tooltip placement="top">
                        <div slot="content">坐席按照通话次数和意向客户<br/>（通话质量标记为A、B的用户）排名</div>
                            <i class="el-icon-info"></i>
                        </el-tooltip>
                    </div>
                    <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" width="100%" show-header>
                        <el-table-column type="index" :index="indexMethod" align="center"></el-table-column>
                        <el-table-column label="坐席" prop="user_name"></el-table-column>
                        <el-table-column label="呼叫次数" prop="callNum"></el-table-column>
                        <el-table-column label="意向数" prop="intention"></el-table-column>
                    </el-table>
                    <div class="fpage">
                        <el-pagination class="pagebutton" small @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[12,100,300,400]" :pager-count="5" :page-size="12" layout=" prev, pager, next" :total="400">
                        </el-pagination>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="lineChart">
            <el-col :span="24">
                <div class="grid-content">
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
    require('echarts/lib/chart/line')
    // 引入提示框和title组件
    require('echarts/lib/component/tooltip')
    require('echarts/lib/component/title')
    export default {
        props:['childData','seatList','myRow'],
        data(){
            return {
                callRatio:82,
                currentPage:1,
                pagesize:6,
                tableData:this.seatList,
                optionline:{
                    color:['#f0657d','#41a2fc'],
                    title: {
                        text: '通话时长vs成功量'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['通话时长(分)','成功量(次)'],
                        bottom:0
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '7%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00']
                    },
                    yAxis: [
                        {
                            name:'通话时长',
                            type: 'value',
                            splitLine:{
				        	    show:false
				            },
                        },
                        {
                            name:'成功量',
                            type:'value',
                            splitLine:{
				        	    show:false
				            },
                        }
                        
                    ],
                    series: [
                        {
                            name:'通话时长(分)',
                            type:'line',
                            tooltip:{
                                trigger:'axis'
                            },
                            yAxisIndex:0,
                            data:[220, 182, 191, 234, 290, 330, 310,222,334,44,444,555,666,666]
                        },
                        {
                            name:'成功量(次)',
                            type:'line',
                            tooltip:{
                                trigger:'axis'
                            },
                            yAxisIndex:1,
                            data:[3, 4, 7, 9, 3, 5, 6,7,4,9,7,5,6,8,8]
                        },
                    ]
                },
                optionbar:{
                        color:['#f0657d','#f9d248','#53ca76','#40cbca','#41a2fc'],
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b}: {c} ({d}%)",
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
                                radius: ['50%', '70%'],
                                center:['40%','50%'],
                                avoidLabelOverlap: false,
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'center',
                                    },
                                    emphasis: {
                                        show: true,
                                        textStyle: {
                                            fontSize: '16',
                                            fontWeight: 'bold'
                                        }
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false,
                                    }
                                },
                                itemStyle:{
                                    borderWidth:5,
                                    borderColor:'#fff'
                                },
                                data:this.childData
                            }
                        ]
                    
                },
                optionfunnel:{
                    color:['#64a6e5','#80cd59','#edca67','#e19362','#df685b'],
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
        created(){
            // console.log(this.childData)
            // console.log(this.seatList)
            //console.log(this.myRow.againNum)
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
    #board{
        font-size:16px
    }
    .callnum{
        display:flex;
    }
    .callratio{
        display:flex;
        align-items: center
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
