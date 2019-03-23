import Vue from 'vue';
import axios from 'axios';

Vue.prototype.$http = axios;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 1000 * 10;

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

axios.interceptors.request.use(function (config) { // axios 拦截器 需要调接口之前调用下 比如判断用户是否登录
   //  加逻辑
//    if()else 
    return config;
}, function (err) {
    return Promise.reject(err);
});
axios.interceptors.response.use(function (response) { // 接口之后调用
     //  加逻辑
//    if()else 
    return response;
}, function (err) {
    return Promise.reject(err);
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