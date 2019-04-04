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
                  <div><span style="font-size:14px">欢迎你，网聚管理员</span></div>
                  <div class="sss"><img src="../../assets/sss.png"></div>
                </div>
                <div class="close">
                  <div class="return"><img src="../../assets/return.png"></div> 
                  <div><span @click="logout" style="font-size:14px">退出系统</span></div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
    import bus from '../common/bus';
    export default {
        data() {
          return {
              tabPosition: 'left',
              collapse:true
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
                  
                    this.$router.push({name:'login'})
                });
          },
        },
        mounted(){
            if(document.body.clientWidth < 1500){
                this.collapseChage();
            }
        }
    };
</script>
<style lang="scss" scoped>
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
