<template>
    <div class="login-wrap">
        <div class="login-head">
            <div class="logo"><img src="../assets/logo.png" alt=""></div>
            <div class="title"><span>精准营销外呼平台</span></div>
        </div>
        <div>
            
        </div>
        <!-- <div class="mybtn"  v-show="isShow">
            <div><el-button type="primary" @click="registerBtn">注册</el-button></div>
            <div><el-button @click="loginBtn">登录</el-button></div>
        </div> -->
        <div class="login-form">
            <el-form :model="loginData" :rules="rules" ref="loginData">
                <el-form-item prop="userName"> 
                    <el-input placeholder="账号" v-model='loginData.userName'></el-input>
                </el-form-item>
                <el-form-item prop="passWord">
                    <el-input placeholder="密码" v-model='loginData.passWord' show-password></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitLogin('loginData')" @keyup.enter="submitLogin('loginData')">登录</el-button>
                </el-form-item>
                <!-- <el-form-item>
                    <el-button type="text" class="footer" @click='forgetpassword'>忘记密码？</el-button>
                </el-form-item> -->
            </el-form>
            <!-- <div>
            <el-button @click="goBack" v-if="myBackbtn">返回</el-button>
            </div> -->
        </div>
        
        
                
        
        <!-- <div v-if="showforget">
            <div class="forgetPw">
                <el-form>
                    <el-form-item>
                        <el-input placeholder="请联系工作人员：0571-88013101" disabled></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="goBack">返回</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div> -->
        <!-- <div v-if="showregister" class="register-form">
            <register></register>
            <div>
            <el-button @click="goBack" v-if="myBackbtn">返回</el-button>
            </div>
        </div> -->
    </div>
</template>
<script>
// import forgetpassword from '@/components/forgetpassword'
import register from '@/components/register';
import { mapMutations } from 'vuex'
    export default {
        data(){
            return {
                myBackbtn:false,
                //showforget:false,
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
                        {required:true,message:'请输入密码',trigger:'blur'}
                    ]
                }
            }
        },
        methods:{
            ...mapMutations(['changeLogin']),
            goBack(){
                this.myBackbtn=false
                this.isShow=true;
                this.showlogin=false;
                this.showregister=false
                //this.showforget=false
            },
            loginBtn(){
                this.myBackbtn=true
                this.isShow=!this.isShow
                this.showlogin=true
            },
            registerBtn(){
                this.myBackbtn=true
                this.isShow=!this.isShow
                this.showregister=true
            },
            submitLogin(loginData){
                let _this=this
                this.$refs[loginData].validate((valid) =>{
                    if(valid) {
                        let userName=this.loginData.userName
                        let passWord=this.loginData.passWord
                        // this.$cookieStore.setCookie( userName ,'',1800);
                        // this.$cookieStore.getCookie(userName)
                        this.$http.post(this.$api.login.login,{
                            userName,
                            passWord
                        }).then((res) => {
                                //console.log(res)
                                if(res.data.data.status=="success"){
                                    let token=this.$cookieStore.getCookie('token')
                                    _this.changeLogin({Authorization:token}) 
                                    // this.$store.commit('SET_TOKEN',token)
                                    this.$store.commit("GET_ID",res.data.data.id)
                                    this.$store.commit("GET_USER",userName)
                                    this.$store.commit("GET_ROUTER",res.data.data.router)
                                    sessionStorage.setItem('roleId',res.data.data.roleId)
                                    this.$message({
                                        message:'登录成功',
                                        type:'success'
                                    })
                                    let name=JSON.parse(sessionStorage.getItem("router"))[0].path
                                    this.$router.push({name:name})
                                }else{
                                    this.$message({
                                        message:res.data.msg,
                                        type:'error'
                                    })
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
            // forgetpassword(){
            //     this.myBackbtn=false
            //     this.showlogin=!this.showlogin
            //     this.showforget=!this.showforget
            // },
        },
        components: {
            register
        }
    }
</script>
<style scoped>
    .login-wrap {
        position: relative;
        height:100%;
        background-image: url(../assets/img/login-bg.png);
        background-size: 100%;
        background-repeat:no-repeat;
    }
    .login-head {
        position:fixed;
        width:100%;
        height:70px;
        background-color:rgba(250,250,250,0.3);
        padding:10px 0 10px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .logo{
        margin-top:10px;
        margin-left:50px;
        height:100%;
    }
    .logo img{
        height:55px
    }
    .title{
        color:#fff;
        font-size:28px;
        font-weight: bold;
        margin-right:60px;
    }
    .mybtn{
        position:absolute;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
    }
    .mybtn div .el-button{
        width:350px;
        height:50px;
        margin-bottom:20px
    }
    .login-form {
        position:absolute;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        display:flex;
        flex-direction: column;
        align-items: center
    }
    .login-form .el-button{
        width:300px;
        
    }
    .login-form .footer {
        color:#fff;
    }
    .register-form{
        position:absolute;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        display:flex;
        flex-direction: column;
        align-items: center
    }
    .register-form .el-button{
        width:400px;
        margin-top:10px; 
    }
</style>
