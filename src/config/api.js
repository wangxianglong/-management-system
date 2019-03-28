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
    newItem:'api/item/distribution',     //分配活动
    //userList:'api/user/userList',        //任务列表
    monitorList:'api/user/monitorList',   //班长列表
    assignMonitor:'api/project/assignMonitor'  //分配班长任务
}
//班长
const monitor={
    taskAssign:'api/project/taskAssign',         //班长任务管理
    seatList:'api/user/seatList',               //班长详情
    assignSeat:'api/project/assignSeat'         //分配任务
}
//坐席
const amati={
    seatActive:'api/project/seatActive',       //坐席外呼
    getDataList:'api/call/getDataList',         //坐席外呼详情
    getDataDetail:'api/call/getDataDetail',     //外呼
    updateCustomer:'api/call/updateCustomer'    //保存
}
//外呼
const callee={
    
}
export default {
    platform,
    login,
    callee,
    firm,
    monitor,
    amati
}