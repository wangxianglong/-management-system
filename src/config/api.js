//登录
const login={
    login:'api/login'
}
//平台账户
const platform={
    list:'api/project/projectList', //获取列表
    activityList:'api/activity/activityList',  //获取活动列表
    activity:'api/activity/getActivity', //获取活动
    company:'api/user/companyList',  //获取公司名称
    update:'api/project/update'     //分配任务
}
//企业账户
const firm= {
    itemList:'api/item/list',        //获取项目列表
    addItem:'api/item/save',          //新建项目
}
//外呼
const callee={
    
}
export default {
    platform,
    login,
    callee,
    firm
}