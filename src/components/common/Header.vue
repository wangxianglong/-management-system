<template>
  <div class="paContainer">
    <div class="pa-header">
      <el-row>
        <el-col :span="24">
          <div class="grid-content">
            <div class="header">
              <div class="header-left">
                <div class="line" @click="collapseChage"><img src="../../assets/line.png"></div>
                <div class="info">精准营销外呼平台</div>
              </div>
              <div class="header-right">
                <div class="user">
                  <div class="myself"><img src="../../assets/myself.png"></div>
                  <div style="font-size:14px">
                    <span>欢迎你，</span>
                    <el-dropdown trigger="click" @command="handleCommand">
                      <span class="el-dropdown-link">
                        {{userName}}
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="a">修改密码</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                  <div class="sss"><img src="../../assets/sss.png"></div>
                </div>
                <div class="close">
                  <div class="return"><img src="../../assets/return.png"></div> 
                  <div style="cursor: pointer;"><span @click="logout" style="font-size:14px">退出系统</span></div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <!--修改弹框-->
      <el-dialog title="修改密码" :visible.sync="amendDialog" width="500px" :before-close="handleClose">
          <div style="margin-bottom:10px">
              <span>旧密码:</span>
              <el-input type="passWord" v-model='oldPassWord' placeholder="请输入密码" style="width:300px" size="small" maxLength='12' minlength='8'></el-input>
          </div>
          <div style="margin-bottom:10px">
              <span>新密码:</span>
              <el-input type="passWord" v-model='passWord' placeholder="请输入密码" style="width:300px" size="small" maxLength='12' minlength='8'></el-input>
          </div>
          <div style="margin-bottom:10px">
              <span>确认新密码:</span>
              <el-input type="passWord" v-model='newPassWord' placeholder="请输入密码" style="width:300px" size="small" maxLength='12' minlength='8'></el-input>
          </div>
          <span slot="footer">
              <el-button @click="amendDialog = false">取 消</el-button>
              <el-button type="primary" @click="amendPassword">确 定</el-button>
          </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
    import bus from '../common/bus';
    export default {
        data() {
          return {
              tabPosition: 'left',
              collapse:true,
              userName:null,
              amendDialog:false,
              oldPassWord:null,
              passWord:null,
              newPassWord:null,
              id:sessionStorage.getItem('id')
          };
        },
        methods: {
          // 侧边栏折叠
          collapseChage(){
              this.collapse = !this.collapse;
              bus.$emit('collapse', this.collapse);
          },
          //退出登录
          logout () {
            this.$confirm('确定退出登录吗？', '提示')
                .then(() => {
                    //this.$store.commit('LOGOUT')
                    this.$cookieStore.delCookie('token')
                    this.$router.replace({name:'login'})
                }).catch(()=>{
                  
                });
          },
          handleCommand(command) {
            this.amendDialog=true
          },
          handleClose(){
            this.oldPassWord=null
            this.passWord=null
            this.newPassWord=null
            this.amendDialog=false
          },
          amendPassword(){
            if(this.passWord===this.newPassWord && this.passWord!=null){
              let params={oldPassword:this.oldPassWord,passWord:this.passWord,id:this.id}
              this.$http.post(this.$api.user.updatePassword,params).then(res => {
                this.$message.success(res.data.msg)
                this.amendDialog=false
              })
            }else{
              this.$message('请确认密码')
            }
            
          }
        },
        mounted(){
            if(document.body.clientWidth < 1500){
                this.collapseChage();
            }
            this.userName=sessionStorage.getItem("userName");
        }
    };
</script>
<style lang="scss" scoped>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-row {
    border-bottom:4px solid #ebebeb;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #000000;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 50px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .paContainer{
    width:100%;
  }
  .header {
    width:100%;
    padding:5px 0 5px 0;
    display:flex;
    justify-content: space-between;
    .header-left {
      display:flex;
      align-items: center;
      padding-left:20px;
      .line {
        margin-right:10px;
        padding-top:5px;
        cursor: pointer
      }
      .info {
      
        font-size:18px;
        font-weight: bold;
      }
    }
    .header-right {
      display:flex;
      padding-right:20px;
      img{
        width:15px;
      }
      .user {
        display:flex;
        align-items:center;
        margin-right:10px;
        div {
          margin-right:5px;
        }
        .myself {
          padding-top:5px;
        }
        .sss {
          padding-top:15px;
          img {
            width:18px
          }
        }
      }
      .close {
        display:flex;
        align-items: center;
        .return {
          margin-right:5px;
          margin-top:5px;
          img {
            width:18px;
          }

        }
      }
    }
  }
</style>
