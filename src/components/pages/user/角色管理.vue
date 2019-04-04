<template>
	<section>
		<!--工具条-->
		<el-col :span="24">
			<div class="box box-danger">
				<div class="box-body row">
			<el-form :inline="true" :model="filters"   style="height: 37px">
				<el-form-item style="float:right;">
					<el-button type="primary"  @click="$router.push('/addRole')" >新增</el-button>
				</el-form-item>
			</el-form>
				</div>
			</div>
		</el-col>

		<!--列表-->
		<el-table :data="list" highlight-current-row @selection-change="selsChange" style="width: 100%;">
			<el-table-column prop="roleName" label="角色名称">
			</el-table-column>
			<el-table-column label="操作" >
				<template slot-scope="scope">
					<el-button type="text" @click="$router.push({path:'/updateRole',query:{name:scope.row.roleName,id:scope.row.id}}) ">修改</el-button>
					<el-button type="text"  @click="removeRole(scope.row.id )" circle>删除</el-button>
				</template>
			</el-table-column>
		</el-table>
	</section>
</template>

<script>
	//import NProgress from 'nprogress'
	//import API from '../../api/api_role';

	export default {
		data() {
			return {
			    time:'',
				filters: {
					name: '',
                    state:''
				},
				list: [],
				total: 1,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

			}
		},
        mounted() {
			this.searchRole();
        },
		methods: {
            searchRole(){
                this.$http.get(this.$api.role.roleList).then(res=>{
                    this.list  = res.data.roleList;//[{bId:'1',bName:'53'}]
                    this.total=res.count;
                    console.log(res);
                })
            },
			banRole(roleId){
                getData.banRole(roleId).then(res => {
                    if(res.code===0){
                        this.$message({
                            message:'操作成功',
                            type:'success'
                        });
                        this.searchRole();
                    }else{
                        this.$message({
                            message:'操作失败',
                            type:'error'
                        });
                    }
				})

			},
			handleCurrentChange(val) {
				this.page = val;
				this.searchRole();
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
            removeRole: function (id) {
                this.$confirm("确认删除该角色吗?", "提示", {type: "warning"})
                    .then(() => {
                        console.log(id)
                        let params ={
                            roleId:id,
                        }
                        this.$http.get(this.$api.role.deleteRole,{params:params}).then(res=>{
                             if (res.data.code === 0) {
                                        this.$message.success({
                                            showClose: true,
                                            message: "删除成功",
                                            duration: 1500
                                        });
                                        this.searchRole();
                                    }else{
                                        this.$message.error({
                                            showClose: true,
                                            message: res.msg,
                                            duration: 1500
                                        });
                                    }
                        })
                            .catch(function (error) {
                                console.log(error);
                                this.$message.error({
                                    showClose: true,
                                    message: "请求出现异常",
                                    duration: 2000
                                });
                            });
                    })
                    .catch(() => {
                    });
            },
		},
	}

</script>

<style scoped>

</style>
