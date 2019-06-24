<template>
	<el-row>
		<el-col :span="12" :offset="6">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="角色名" prop="roleName">
					<el-input v-model="addForm.name" auto-complete="off" style="width: 33%"></el-input>
				</el-form-item>
				<el-form-item label="角色权限">
					<el-tree
							:data="data2"
							show-checkbox
							ref="tree"
							node-key="id">
					</el-tree>
				</el-form-item>
			</el-form>

			<div class="footer">
				<el-button type="danger" @click="goBack">返回</el-button>
				<el-button type="primary" @click="addRole">提交</el-button>
			</div>
		</el-col>
	</el-row>
</template>

<script>
    //import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    //import API from '../../api/api_role';

	export default {
		data() {
			return {
                data2: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },

                addForm: {
                    name: '',
                },
                addFormRules: {
                    name: [
                        { required: true, message: '请填写角色名', trigger: 'blur' }
                    ],
                },
                options:[],
			}
		},
		mounted(){
			this.$http.get(this.$api.role.treeList).then(res=>{
				//console.log(res)
				this.data2=res.data.treeList;
			})
		},
		methods: {
			goBack(){
				this.$router.push({path:'/roleList'})
			},
            addRole(){
                var checked  = this.$refs.tree.getCheckedKeys();
                this.$refs.addForm.validate((valid) => {
			        if(valid){
			            let params={
			                roleName:this.addForm.name,
                            ids : checked,
						}
						this.$http.post(this.$api.role.addRole,params).then(res=>{
							//console.log(checked);
							console.log(res)
								if(res.data.code===0){
                                    this.$message({
                                        message:'添加成功',
                                        type:'success'
                                    });
                                    this.$router.push('/roleList')
								}else{
                                    this.$message({
                                        message:'添加失败',
                                        type:'error'
                                    });
								}
						})

					}else {
                        this.$message({
                            message:'有数据没有填写完成',
                            type:'error'
                        });
					}
				})
			},
		}
	}

</script>

<style scoped>
	.footer{
		margin: 50px 0;
		text-align: center;
	}
</style>
