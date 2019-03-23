<template>
    <div class="approve">
        <el-form :model="form" label-width="100px" class="formPage" label-position='left'>
            <div class="title">公司认证</div>
            <div class="boxSize">
                <el-form-item label="公司名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="账号类型">
                    <span>已审核</span>
                </el-form-item>
                <el-form-item label="账号时限">
                    <span>3</span>
                </el-form-item>
                <el-form-item label="公司税号：">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="营业执照">
                    <el-upload
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </div>
            <div class="title">管理员</div>
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
            </div>
            <el-form-item size="medium" class="formBtn">
                <el-button>取消</el-button>
                <el-button type="primary">确认修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                form:{
                    name:'aaa',
                    imageUrl:''
                }
            }
        },
        methods:{
            handleAvatarSuccess(res, file) {
                this.form.imageUrl = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                // const isJPG = file.type === 'image/jpeg';
                // const isLt2M = file.size / 1024 / 1024 < 2;
                // if (!isJPG) {
                // this.$message.error('上传头像图片只能是 JPG 格式!');
                // }
                // if (!isLt2M) {
                // this.$message.error('上传头像图片大小不能超过 2MB!');
                // }
                // return isJPG && isLt2M;
            }
        }
    }
</script>
<style scoped>
    .approve {
        padding:20px 0;
        background:#eee;
        height:100%;
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
        background-color:#fff;
        width:800px;
        position:absolute;
        top:20px;
        left:25%
    }
    .avatar-uploader {
        width:178px;
        height:178px;
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
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .formBtn {
        text-align: center;
        margin:10px 0 0 -50px
    }
</style>
