import Vue from 'vue';
import axios from 'axios';
import router from '../router';
//import { Loading } from 'element-ui';


Vue.prototype.$http = axios;
axios.defaults.withCredentials = true;
// axios.defaults.timeout = 1000 * 10;

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// let loading;

// let openLoading = () => {
//     loading=loading.service({
//         lock:false,
//         background:'rgba(0,0,0,0.7)'
//     })
// }

// let closeLoading = () => {
//     loading.close()
// }

axios.interceptors.request.use(function (config) {
    //openLoading()
    if(sessionStorage.getItem('token')){
        config.headers.token = sessionStorage.getItem('token')
    }
    return config;
}, function (err) {
    this.message.error({
        message: '加载超时'
    });
    return Promise.reject(err);
});
axios.interceptors.response.use(function (response) {
    //closeLoading();
    
    return response;
}, function (error) {
    if(error.response) {
        switch (error.response.status) {
            case 401:
                alert('用户验证失效')
                router.replace({
                    path:'login',
                    query:{redirect:router.currentRoute.fillPath}
                })
                break;
            case 402:
                alert('账号已登录，请重新登陆')
                router.replace({
                    path:'login',
                    query:{redirect:router.currentRoute.fillPath}
                })
                break;
        }
    }
    return Promise.reject(error);
});

// //通用方法
// export const POST = (url, params) => {
//     return axios.post(`${base}${url}`,params,
//         {
//             headers:{'contentType': 'application/json'},
//         }).then(res => res.data)
// }

// export const GET = (url, params) => {
//     return axios.get(`${base}${url}`, {
//         params: params
//     }).then(res => res.data)
// }

// export const PUT = (url, params) => {
//     return axios.put(`${base}${url}`, params).then(res => res.data)
// }

// export const DELETE = (url, params) => {
//     return axios.delete(`${base}${url}`, {
//         params: params
//     }).then(res => res.data)
// }

// export const PATCH = (url, params) => {
//     return axios.patch(`${base}${url}`, params).then(res => res.data)
// }

export default {
};