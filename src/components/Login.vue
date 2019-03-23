<template>
    <div class="login-wrap">
        <div class="login-head">
            <div class="logo"><img src="../assets/logo.png" alt=""></div>
            <div class="title"><span>精准营销外呼平台</span></div>
        </div>
        <div class="mybtn">
            <div><el-button type="primary" @click="registerBtn" v-show="isShow">注册</el-button></div>
            <div><el-button @click="loginBtn" v-show="isShow">登录</el-button></div>
        </div>
        <div class="login-form" v-if="showlogin">
            <el-form :model="loginData" :rules="rules" ref="loginData">
                <el-form-item prop="username"> 
                    <el-input placeholder="账号" v-model='loginData.userName'></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input placeholder="密码" v-model='loginData.passWord' show-password></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitLogin('loginData')">登录</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="text" class="footer" @click='forgetpassword'>忘记密码？</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div v-if="showforget">
            <forgetpassword></forgetpassword>
        </div>
        <div v-if="showregister">
            <register></register>
        </div>
    </div>
</template>
<script>
import forgetpassword from '@/components/forgetpassword'
import register from '@/components/register'
    export default {
        data(){
            return {
                showforget:false,
                isShow:true,
                showlogin:false,
                showregister:false,
                loginData:{
                    userName:'',
                    passWord:'',
                },
                rules:{
                    userName:[
                        { required: true, message: '请输入您的账号', trigger: 'blur' }
                    ],
                    passWord:[
                        {required:true,validator:'请输入密码',trigger:'blur'}
                    ]
                }
            }
        },
        methods:{
            loginBtn(){
                this.isShow=!this.isShow
                this.showlogin=!this.showlogin
            },
            registerBtn(){
                this.isShow=!this.isShow
                this.showregister=!this.showregiste
            },
            submitLogin(loginData){
                this.$refs[loginData].validate((valid) =>{
                    if(valid) {
                        let userName=this.loginData.userName
                        let passWord=this.loginData.passWord
                        this.$cookieStore.setCookie( userName ,'',60);
                        this.$cookieStore.getCookie(userName)
                        this.$http.post(this.$api.login.login,{
                            userName,
                            passWord
                        }).then((res) => {
                                console.log(res)
                                if(res.status===200){ 
                                    this.$store.commit('SET_TOKEN',res.data.token)
                                    this.$store.commit("GET_USER",res.data.userName)
                                    this.$message({
                                        message:'登录成功',
                                        type:'success'
                                    })
                                    this.$router.push({name:'index'})
                                    //console.log(token)
                                }
                            }).catch(function(error){
                                console.log(error)
                            })
                    }else {
                        console.log('error submit');
                        return false
                    }
                })
            },
            forgetpassword(){
                this.showlogin=!this.showlogin
                this.showforget=!this.showforget
            },
        },
        components: {
            register,forgetpassword
        }
    }
</script>
<style scoped>
    .login-wrap {
        position: relative;
        height:100%;
        background-image: url(../assets/img/login-bg.jpg);
        background-size: 100%;
        background-repeat:no-repeat;
    }
    .login-head {
        position:fixed;
        width:100%;
        height:70px;
        background-color:rgba(0,0,0,0.5);
        padding:10px 0 10px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .logo{
        margin-left:60px;
        height:100%;
    }
    .logo img{
        height:70px
    }
    .title{
        color:#fff;
        font-size:28px;
        font-weight: bold;
        margin-right:60px;
    }
    .mybtn{
        position:absolute;
        top:40%;
        left:40%;
    }
    .mybtn div .el-button{
        width:350px;
        height:50px;
        margin-bottom:20px
    }
    .login-form {
        position:absolute;
        top:40%;
        left:40%;
        display:flex;
        flex-direction: column;
        align-items: center
    }
    .login-form .el-button{
        width:400px;
        
    }
    .login-form .footer {
        color:#fff;
    }
    
</style>
