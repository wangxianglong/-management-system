<template>
    <div class="forgetPw">
        <el-form>
            <el-form-item>
                <el-input placeholder="请联系工作人员：0571-88013101" disabled></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="goLogin">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                // ruleForm: {
                //     email:'',
                // },
                // rules:{
                //     email:[
                //         {required:true,message:'请输入您的邮箱',trigger:'blur'},
                //         { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change'}
                //     ],  
                // }
            }
        },
        methods:{
            // goLogin(formName){
            //     this.$refs[formName].validate((valid) =>{
            //         if(valid) {
            //             this.$message({
            //                 type:'success',
            //                 message:'新密码 已经发送到您的邮箱 /手机中 请查收'
            //             });
            //             this.$router.push({name:'login'})
            //         }else {
            //             console.log('error submit');
            //             return false
            //         }
            //     })
            // }
            goLogin(){
                
            }
        }
    }
</script>
<style>
    .forgetPw{
        position:absolute;
        top:40%;
        left:40%;
        display:flex;
        flex-direction: column;
        align-items: center
    }
    .forgetPw .el-button{
        width:400px;
        margin-top:10px; 
    }
</style>