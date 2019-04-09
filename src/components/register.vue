<template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="phone">
            <el-input placeholder="手机号" v-model="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item prop="num">
            <el-input placeholder="账号" v-model="ruleForm.num"></el-input>
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
</template>
<script> 
    export default{
        data(){
            return {
                ruleForm: {
                    num:'',
                    phone:'',
                    password:'',
                    firmname:''
                },
                rules:{
                    num:[
                        {required:true,message:'请输入您的账号',trigger:'blur'},
                    ],
                    phone:[
                        {required:true,message:'请输入您的手机号',trigger:'blur'},
                        // { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change'}
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
                        let params={
                            userName:this.ruleForm.num,
                            passWord:this.ruleForm.password,
                            company:this.ruleForm.firmname,
                            phoneNum:this.ruleForm.phone
                        }
                        this.$http.post(this.$api.user.register,params).then(res=>{
                            if(res.data.code===0){
                                this.$http.post(this.$api.login.login,{
                                    userName:this.ruleForm.num,
                                    passWord:this.ruleForm.password
                                }).then((res) => {
                                        //console.log(res)
                                        if(res.status===200){ 
                                            this.$store.commit('SET_TOKEN',res.data.token)
                                            this.$store.commit("GET_USER",res.data.userName)
                                            this.$message({
                                                type:'success',
                                                message:'注册成功'
                                            })
                                            this.$router.push({name:'approve'})
                                            //console.log(token)
                                        }
                                    }).catch(function(error){
                                        console.log(error)
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
