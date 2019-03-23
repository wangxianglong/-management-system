<template>
    <div class="register-form">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="email">
            <el-input placeholder="电子邮箱" v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input placeholder="密码" v-model='ruleForm.password' show-password></el-input>
        </el-form-item>
        <el-form-item prop="firmname">
            <el-input placeholder="公司名称" v-model='ruleForm.firmname'></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="register('ruleForm')">下一步</el-button>
        </el-form-item>
    </el-form>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                ruleForm: {
                    email:'',
                    password:'',
                    firmname:''
                },
                rules:{
                    email:[
                        {required:true,message:'请输入您的邮箱',trigger:'blur'},
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change'}
                    ],
                    password:[
                        {required:true,message:'请输入您的密码',trigger:'blur'}
                    ],
                    firmname:[
                        {required:true,message:'请输入您的公司名称',trigger:'blur'}
                    ]
                }
            }
        },
        methods:{
            register(formName) {
                this.$refs[formName].validate((valid) =>{
                    if(valid) {
                        this.$message({
                            type:'success',
                            message:'注册成功'
                        })
                        this.$router.push({name:'index'})
                    }else {
                        console.log('error')
                        return false;
                    }
                })
            }
        }
    }
</script>
<style>
    .register-form{
        position:absolute;
        top:40%;
        left:40%;
        display:flex;
        flex-direction: column;
        align-items: center
    }
    .register-form .el-button{
        width:400px;
        margin-top:10px; 
    }
</style>