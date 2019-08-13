<template>
    <div class="approve">
        <el-form :model="form" label-width="140px" class="formPage" label-position='right'>
            <div class="title">客户详情</div>
            <div class="boxSize">
                <el-form-item label="企业Id">
                    <el-input  v-model='form.user.entId' readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="企业名称">
                    <el-input v-model="form.user.company" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="班长/座席">
                    <el-input type="textarea" :rows=3 v-model="form.seats" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="座席单价">
                    <span style="color:red">{{form.price.seatFee}}元/个</span>
                </el-form-item>
                <el-form-item label="语音费">
                    <span style="color:red">{{form.price.voiceFee}}元/分</span>
                </el-form-item>
                <!-- <el-form-item prop="passWord" label="密码：">
                    <el-input placeholder="密码" v-model='form.passWord' show-password></el-input>
                </el-form-item> -->
                <el-form-item label="配置行销名单/价格">
                    <ul v-for="item in form.priceActivity" :key='item.id'>
                        <li>
                            <span>活动名:{{item.activity_name}}&nbsp;&nbsp;&nbsp;</span><span style="color:red">名单单价:{{item.data_fee}}元/个&nbsp;&nbsp;&nbsp;</span>
                            <span>模型定制:{{item.model_count}}个&nbsp;&nbsp;&nbsp;</span><span style="color:red">模型定价:{{item.model_fee}}元/个</span>
                        </li>
                    </ul>
                </el-form-item>
                <el-form-item label="套餐费">
                    <span style="color:red">{{form.price.set === 1?'850元':'0元'}}</span>
                </el-form-item>
            </div>
            <el-form-item size="medium" class="formBtn">
                <el-button type="primary" @click="goBack" style="width:100px">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                form:{
                    user:{
                        entId:'',
                        company:''
                    },
                    seats:[],
                    priceActivity:[],
                    numbers:[],
                    price:{}
                },
            }
        },
        mounted(){
            
        },
        methods:{
            getForm(){
                let id = this.$route.query.id
                let params = {id:id}
                this.$http.get(this.$api.platform.userDetail,{params:params}).then(res => {
                    if(res.data.code === 0){
                        this.form.user = res.data.user
                        this.form.seats = res.data.seats
                        this.form.priceActivity = res.data.priceActivity
                        this.form.numbers = res.data.numbers
                        this.form.price = res.data.price
                        console.log(this.form)
                    }
                })
            },
            goBack(){
                this.$router.push({path:'/hybridAccount'})
            }
        },
        created(){
            this.getForm()
        }
    }
</script>
<style scoped>
    .approve {
        padding:20px 0;
        background:#fff;
        position:relative
    }
    .el-form .el-form-item {
        margin-bottom:5px;
    }
    .title {
        margin:17px 0 17px 20px
    }
    .boxSize {
        border:1px solid #ddd;
        margin:0 auto;
        padding:5px;
        
    }
    .boxSize .el-input{
        width:400px;
    }
    .formPage{
        background-color:#eee;
        width:800px;
        position:absolute;
        top:20px;
        left:20px
    }
    .avatar-uploader {
        width:180px;
        height:250px;
        border: 1px dashed #d9d9d9;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 180px;
        height: 250px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 180px;
        height: 250px;
        display: block;
    }
    .formBtn {
        text-align: center;
        margin:10px 0 0 -50px
    }
    .el-input{
        margin-top:10px;
        color:#000
    }
    input[disabled]{
        color:red;
        opacity: 1;
    }
    ul {
        background: #fff;
        padding-left:18px
    }
    ul>li {
        list-style: none
    }
</style>
