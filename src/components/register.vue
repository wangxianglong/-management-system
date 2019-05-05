<template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="phoneNum">
            <el-input placeholder="手机号" v-model="ruleForm.phoneNum"></el-input>
        </el-form-item>
        <el-form-item prop="userName">
            <el-input placeholder="账号" v-model="ruleForm.userName"></el-input>
        </el-form-item>
        <el-form-item prop="passWord">
            <el-input placeholder="密码" v-model='ruleForm.passWord' show-password></el-input>
        </el-form-item>
        <el-form-item prop="company">
            <el-input placeholder="公司名称" v-model='ruleForm.company'></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="register('ruleForm')">下一步</el-button>
        </el-form-item>
        
    </el-form>
</template>
<script> 
    export default{
        data(){
            return {
                ruleForm: {
                    
                },
                rules:{
                    phoneNum:[
                        {required:true,message:'请输入您的账号',trigger:'blur'},
                    ],
                    userName:[
                        {required:true,message:'请输入您的手机号',trigger:'blur'},
                        // { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change'}
                    ],
                    passWord:[
                        {required:true,message:'请输入您的密码',trigger:'blur'}
                    ],
                    company:[
                        {required:true,message:'请输入您的公司名称',trigger:'blur'}
                    ]
                }
            }
        },
        methods:{
            register(formName) {
                this.$refs[formName].validate((valid) =>{
                    if(valid) {
                        let params=this.ruleForm
                        this.$http.post(this.$api.user.register,params).then(res=>{
                            //console.log(res)
                            if(res.data.code===0){
                                //console.log(res)
                                this.$http.post(this.$api.login.login,{
                                    userName:this.ruleForm.userName,
                                    passWord:this.ruleForm.passWord
                                }).then((res) => {
                                        console.log(res)
                                        if(res.data.data.status=='success'){ 
                                            let token=this.$cookieStore.getCookie('token') 
                                            this.$store.commit('SET_TOKEN',token)
                                            this.$store.commit("GET_USER",this.ruleForm.userName)
                                            this.$store.commit("GET_ROUTER",res.data.data.router)
                                            this.$message({
                                                type:'success',
                                                message:'注册成功'
                                            })
                                            let name=JSON.parse(sessionStorage.getItem("router"))[0].path
                                            this.$router.push({name:name})
                                            //console.log(token)
                                        }else{
                                            this.$message({
                                                type:'error',
                                                message:res.data.data.msg
                                            })
                                        }
                                    }).catch(function(error){
                                        console.log(error)
                                    })
                                
                            }else{
                                this.$message({
                                    type:'error',
                                    message:res.data.msg
                                })
                            }
                        })
                        
                    }else {
                        console.log('error')
                        return false;
                    }
                })
            }
        }
    }
</script>
<style scoped>
    .el-button{
        width:400px;
        margin-top:10px; 
    }
</style>
