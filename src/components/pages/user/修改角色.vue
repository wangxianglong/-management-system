<template>
	<el-row>
		<el-col :span="12" :offset="6">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="角色名" prop="roleName">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
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
				<el-button type="primary" @click="updateRole">提交</el-button>
			</div>
		</el-col>
	</el-row>
</template>

<script>
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
                    roleDescription: [
                        { required: true, message: '请填写价格', trigger: 'blur' }
                    ],

                },

                options:[],
			}
		},
		mounted(){
            this.searchTree()
		},
		methods: {
		    searchTree(){
				this.addForm.name=this.$route.query.name;
				this.$http.get(this.$api.role.treeList).then(res=>{
				//console.log(res)
				this.data2=res.data.treeList;
				this.searchTreeId();
				})
            },
            searchTreeId(){
                var id = this.$route.query.id;
                let params={
                    id:id,
				}
				this.$http.get(this.$api.role.selectTreeId,{params:params}).then(res=>{
					console.log(res)
					this.$refs.tree.setCheckedKeys(res.data.list);
				})
            },
            updateRole(){
                let id = this.$route.query.id;
                let checked  = this.$refs.tree.getCheckedKeys();
                this.$refs.addForm.validate((valid) => {
			        if(valid){
			            let params={
			                id:id,
							roleName:this.addForm.name,
							ids:checked,
						}
						this.$http.post(this.$api.role.updateRole,params).then(res=>{
							if(res.data.code==0){
                                    this.$message({
                                        message:res.data.msg,
                                        type:'success'
                                    });
                                    this.$router.push('/roleList')
								}else{
                                    this.$message({
                                        message:'修改失败',
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
