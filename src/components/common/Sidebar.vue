<template>
    <div class="sideBar" >
        <div>
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#000"
            text-color="#fff" active-text-color="#20a0ff" unique-opened router>
            <div class="logo"><img src="../../assets/logo.png"></div>
            <template v-for="item in items">
                <template>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i class="el-icon-date"></i><span slot="title">{{ item.title }}</span>
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
                items: [
                    {    
                        index: 'index',
                        title: '首页'
                    },
                    {
                        index: 'itemadd',
                        title: '活动管理'
                    },
                    {
                        index: 'whsystem',
                        title: '外呼统计'
                    },
                    {
                        index: 'exontotal',
                        title: '外显管理'
                    },
                    {
                        index: 'zhsystem',
                        title: '账户管理'
                    },
                    {
                        index:'pmitem',
                        title:'项目管理'
                    },
                    {
                        index:'numberpublic',
                        title:'外显号码'
                    },
                    {
                        index:'recording',
                        title:'录音管理'
                    },
                    {
                        index:'hybridAccount',
                        title:'账号管理'
                    },
                    {
                        index:'approve',
                        title:'企业认证'
                    },
                    {
                        index:'taskmanagement',
                        title:'任务管理'
                    },
                    {
                        index:'callee',
                        title:'外呼'
                    },
                    {
                        index:'recall',
                        title:'重呼'
                    },
                    {
                        index:'qualitypage',
                        title:'质检'
                    },
                    {
                        index:'caccount',
                        title:'关联账号'
                    }
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
                
            }
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
        overflow-y: scroll;
        height:100%;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 200px;
    }
    .sidebar>ul {
        height:100%;
    }
    .el-menu {
        height:1000px;
    }
    .logo {
        padding:15px 10px 15px 14px;
        img{
            width:120px;
            height:40px;
        }
    }
</style>
