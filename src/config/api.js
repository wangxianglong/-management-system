//登录
const login={
    login:'api/login',
    seatLogin:'api/call/seatLogin',
}
//注册
const user={
    register:'api/user/register'      //注册
}
//平台账户
const platform={
    index:'api/item/index',         //首页
    itemList:'api/item/list',       //项目列表
    list:'api/project/projectList', //获取列表
    activityList:'api/activity/activityList',  //获取活动列表
    activity:'api/activity/getActivity', //获取活动
    company:'api/user/companyList',  //获取公司名称
    projectUpdate:'api/project/update' ,    //分配任务
    companyList:'api/number/componyList',    //外显管理
    save:'api/number/save',         //外显管理新增
    userList:'api/user/userList',        //账户管理
    update:'api/user/update',            //账户管理按钮接口
    addUser:'api/user/addUser',         //账户管理新增
    agendList:'api/user/agentList',         //关联班长
}
//企业账户
const firm= {
    itemList:'api/item/list',        //获取项目列表
    addItem:'api/item/save',          //新建项目
    delete:'api/item/delete',           //删除
    newItem:'api/item/distribution',     //分配活动
    userList:'api/user/userList',        //任务列表
    monitorList:'api/user/monitorList',   //班长列表
    assignMonitor:'api/project/assignMonitor',  //分配班长任务
    upLoading:'api/upload/upload',                  //上传
    approve:'api/user/detail',                      //认证
    userUpdate:'api/user/update' ,                       //认证修改
    numList:'api/number/list',       //外显号码
    update:'api/number/update',        //启用
    recordList:'api/result/getRecordList'       //录音管理                 
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
    updateCustomer:'api/call/updateCustomer',    //保存
    call:'api/call/seatMakeCallEx'
}
//外呼统计
const callee={
    statistics:'api/item/statistics',           //外呼统计
    statisticsDetail:'api/item/statisticsDetail'        //看板
}
//关联账号
const cucc={
    cuccUserList:'api/cuccConfig/cuccUserList',
    save:'api/cuccConfig/save'
}
//角色管理
const role={
    roleList:'api/role/roleList',
    treeList:'api/permission/treeList',
    addRole:'api/role/addRole',
    deleteRole:'api/role/deleteRole',
    updateRole:'api/role/updateRole',
    selectTreeId:'api/role/selectTreeId'
}
export default {
    platform,
    login,
    callee,
    firm,
    monitor,
    amati,
    cucc,
    user,
    role
}