<template>
    <div>
        <el-form :inline="true" class="form-inline" v-model="myData">
            <el-form-item label="客户电话">
                <el-input v-model="myData.tel"></el-input>
            </el-form-item>
            <el-form-item label="呼叫次数">
                <el-input v-model="myData.fre"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select class="mySelect" v-model="myData.status" placeholder="请选择" style="margin-left:10px;">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="拨打时间">
                <el-date-picker class='dateInput' v-model="myData.talltime" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="呼叫时间">
            <el-date-picker class='dateInput' v-model="myData.hjtime" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' style="margin-left:50px;">搜索</el-button>
            </el-form-item>
        </el-form>
        <div class="small-divider"></div>
        <div style="padding:17px 0 17px 20px">
            <el-button type="primary" @click="exportExcel">导出</el-button>
            <el-button type="primary" @click="nowLive">返回</el-button>
        </div>
        <div class="divider"></div>
        <!--table表格-->
        <div class="table-box">
        <el-table id="out-table" :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width:100%;padding:10px;" show-header border>
            <el-table-column type="index" label="序号" :index="indexMethod" align="center" width='100px'></el-table-column>
            <el-table-column label="姓氏/性别" prop="name"></el-table-column>
            <el-table-column label="电话" prop="tel"></el-table-column>
            <el-table-column label="省份" prop="province"></el-table-column>
            <el-table-column label="地市" prop="city"></el-table-column>
            <el-table-column label="呼叫次数" prop="count"></el-table-column>
            <el-table-column label="状态" prop="state"></el-table-column>
            <el-table-column label="最后拨打时间" prop="cgnum"></el-table-column>
            <el-table-column label="通话时长（s）" prop="win"></el-table-column>
            <el-table-column label="客户有效期" prop="sbnum"></el-table-column>
        </el-table>
        </div>
        <div class="fpage">
            <el-pagination class="pagebutton" background @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="400">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'
   export default {
        data(){
            return {
                myData:{
                    tel:null,
                    fre:null,
                    status:null,
                    talltime:null,
                    hjtime:null
                },
                options: [{
                    value: '选项1',
                    label: '未接通'
                }, {
                    value: '选项2',
                    label: '已接通'
                }],
                value:'',
                talltime:'',
                hjtime:'',
                tableData:[{
                    name:'aa',
                    tel:234,
                    province:23,
                    city:333,
                    count:4556,
                    state:455,
                    cgnum:34545,
                    win:'50%',
                    sbnum:356,
                },{
                    name:'aa',
                    tel:234,
                    province:23,
                    city:333,
                    count:4556,
                    state:455,
                    cgnum:34545,
                    win:'50%',
                    sbnum:356,
                },{
                    name:'aa',
                    tel:234,
                    province:23,
                    city:333,
                    count:4556,
                    state:455,
                    cgnum:34545,
                    win:'50%',
                    sbnum:356,
                },{
                    name:'aa',
                    tel:234,
                    province:23,
                    city:333,
                    count:4556,
                    state:455,
                    cgnum:34545,
                    win:'50%',
                    sbnum:356,
                }],
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
            handleKb(index,row){
                console.log("kanban")
            },
            handleXq(index,row){
                console.log("x详情")
            },
            nowLive(){
                this.$router.push('/whsystem')
            },
            //导出
            exportExcel () {
                /* generate workbook object from table */
                var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
                /* get binary string as output */
                var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
                try {
                FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'sheetjs.xlsx')
                } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
                return wbout
            },
        },
        created(){

        }
    }
</script>
<style scoped>
    .pagebutton {
        float:right
    }
</style> 
