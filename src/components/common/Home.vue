<template>
    <div class="wrapper">
        <div class="componentBox">
            <v-sidebar></v-sidebar>
            <v-head></v-head>
        </div>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <div class="content">
                <transition name="move" mode="out-in">
                    <keep-alive :include="tagsList">
                        <router-view></router-view>
                    </keep-alive>
                </transition>
            </div>
        </div>
    </div>
</template>
<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    import bus from './bus';
    export default {
        data(){
            return {
                tagsList: [],
                collapse: false
            }
        },
        components:{
            vHead,vSidebar
        },
        created(){
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })    
        },
        methods:{
            
        }
    }
</script>
<style scoped>
    .componentBox{
        display:flex; 
        height:100%
    }
</style>
