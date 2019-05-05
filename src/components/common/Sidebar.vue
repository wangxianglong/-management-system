<template>
    <div class="sideBar">
        <div class="sideBarBox">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse"
            text-color="#fff" active-text-color="#20a0ff" unique-opened router>
            <div class="logo"><img src="../../assets/logo.png"></div>
            <template v-for="item in items">
                <template>
                    <el-menu-item :index="item.path" :key="item.path">
                        <i class="el-icon-date"></i><span slot="title">{{ item.name }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
        </div>
    </div>
</template>
<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                items: [],
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        mounted() {
            this.items=JSON.parse(sessionStorage.getItem("router"));
            //console.log(this.items)
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
            
        }
    }
</script>
<style lang="scss" scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        
        // height:100%;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 180px;
    }
    .sideBarBox>ul {
        background-color:#000;
        
    }
    .sideBarBox{
        position:relative;
        height:100%;
        background-color:#000;
        overflow-y:auto;
        z-index:100;    
    }
    .logo {
        padding:15px 10px 15px 14px;
        img{
            width:130px;
            
        }
    }
    .el-menu-item:hover {
        background:#ccc
    }
    
</style>
