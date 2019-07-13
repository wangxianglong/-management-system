<template>
    <div class="approve">
        <el-form :model="form" label-width="100px" class="formPage" label-position='right' :rules="rules" ref="form">
            <div class="title">新增客户</div>
            <div class="boxSize">
                <!-- <el-form-item label="公司名称">
                    <span>{{form.company}}</span>
                </el-form-item>
                <el-form-item label="状态">
                    <span v-if="form.status===0">未审核</span>
                    <span v-if="form.status===3">已提交</span>
                </el-form-item> -->
                <!-- <el-form-item label="账号时限">
                    <span>3</span>
                </el-form-item> -->
                <el-form-item prop="company" label="公司名称：">
                    <el-input placeholder="公司名称" v-model='form.company'></el-input>
                </el-form-item>
                <el-form-item prop="contacts" label="联系人">
                    <el-input placeholder="账号" v-model="form.contacts"></el-input>
                </el-form-item>
                <el-form-item prop="phoneNum" label="手机号：">
                    <el-input placeholder="手机号" v-model="form.phoneNum"></el-input>
                </el-form-item>
                <!-- <el-form-item prop="passWord" label="密码：">
                    <el-input placeholder="密码" v-model='form.passWord' show-password></el-input>
                </el-form-item> -->
                <el-form-item prop="email" label="邮箱：">
                    <el-input placeholder="邮箱" v-model="form.email"></el-input>
                </el-form-item>
                <el-form-item prop="bankAccount" label="银行账户：">
                    <el-input placeholder="银行账户" v-model='form.bankAccount'></el-input>
                </el-form-item>
                <el-form-item label="公司税号：" prop="taxNumber">
                    <el-input v-model="form.taxNumber"></el-input>
                </el-form-item>
                <el-form-item label="营业执照" prop="businessLicense" style="margin:20px 0">
                    <el-upload
                        class="avatar-uploader"
                        action="api/upload"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        >
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </div>
            <!-- <div class="title">管理员</div>
            <div class="boxSize">
                <el-form-item label="唯一标识">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="账号名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="创建时间">
                    <span>3</span>
                </el-form-item>
                <el-form-item label="账号密码">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="确认密码">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="手机号码">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
            </div> -->
            <el-form-item size="medium" class="formBtn">
                <!-- <el-button>重置</el-button> -->
                <el-button type="primary" @click="mySure('form')" style="width:100px">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                form:{
                    company:null,
                    taxNumber:null,
                    businessLicense:null
                },
                imageUrl:null,
                rules:{
                    phoneNum:[
                        {required:true,message:'请输入您的手机号',trigger:'blur'},
                    ],
                    contacts:[
                        {required:true,message:'请输入联系人',trigger:'blur'},
                        // { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change'}
                    ],
                    email:[
                         { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                    ],
                    bankAccount:[
                        {required:true,message:'请输入您的银行账户',trigger:'blur'}
                    ],
                    type: [
                        { required: true, message: '请选择类型', trigger: 'change' }
                    ],
                    company:[
                        {required:true,message:'请输入您的公司名称',trigger:'blur'}
                    ],
                    taxNumber: [
                        { required: true, message: '请填写公司税号', trigger: 'blur' },
                        { min: 15, max: 20, message: '请填写正确公司税号', trigger: 'blur' }
                    ],
                    businessLicense: [
                        { required: true, message: '请上传营业执照', trigger: 'blur' }
                    ],
                }
            }
        },
        methods:{
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
                this.form.businessLicense=res.imgPath;
            },
            //beforeAvatarUpload(file) {
                // const isJPG = file.type === 'image/jpeg';
                // const isLt2M = file.size / 1024 / 1024 < 2;
                // if (!isJPG) {
                // this.$message.error('上传头像图片只能是 JPG 格式!');
                // }
                // if (!isLt2M) {
                // this.$message.error('上传头像图片大小不能超过 2MB!');
                // }
                // return isJPG && isLt2M;
            //},
            handleRemove(){
                
            },
            // getDetail(){
            //      
            //     let params={token:token}
            //     this.$http.get(this.$api.firm.approve,{params:params}).then(res=>{
            //         if(res.data.code===0){
            //             console.log(res)
            //             this.form=res.data.user
            //         }
            //     })
            // },
            mySure(formName){
                // this.$refs[formName].validate((valid) => {
                // if (valid) {
                //     alert('submit!');
                // } else {
                //     console.log('error submit!!');
                //     return false;
                // }
                // });
                this.$refs[formName].validate((valid)=>{
                    if(valid) {
                        let params=this.form
                         this.$http.post(this.$api.user.register,params).then(res=>{
                             if(res.data.code === 0) {
                                 this.$message.success(res.data.msg)
                                 this.$router.push({path:'/zhsystem'})
                             }
                         })
                    }else{
                        console.log('error submit!!')
                        return false
                    }
                })
                
            }
        },
        created(){
            // this.getDetail()
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
        padding-left:120px
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
        margin-top:10px
    }
</style>
