<template>
    <div id="board">
        <el-row type="flex" justify="space-between">
            <el-col :span="5">
                <div class="callnum">
                    <span style="margin-right:50px">呼通量</span>
                    <span>
                        <strong>82000</strong>
                        /
                        <span style="font-size:14px">100000</span>
                    </span>
                </div>
                <div class="callratio">
                    <div style="margin-right:50px;"><p style="color:#ccc;font-size:14px">呼通率</p><strong style="font-size:28px">{{callRatio}}</strong></div>
                    <div><el-progress type="circle" :percentage="callRatio" width="80" stroke-width="13"></el-progress></div>
                </div>
            </el-col>
            <el-col :span="4">
                <div>a</div>
            
            </el-col>
            <el-col :span="4">
                <div>a</div>
            
            </el-col>
            <el-col :span="4">
                <div>a</div>
            
            </el-col>
            <el-col :span="5">
                <div>a</div>
            
            </el-col>
        </el-row>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                callRatio:82
            }
        }
    }
</script>
<style lang="scss" scoped>
    #board{
        font-size:18px
    }
    .callnum{
        display:flex;
    }
    .callratio{
        display:flex
    }
</style>
