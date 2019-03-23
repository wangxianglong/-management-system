/**
 * 工具类的全局函数定义
 */

// 把时间戳数值格式输出为'yyyyMMdd'格式
const parseDate = (obj) => {
    if (obj === '' || obj == null) {
        return '';
    }
    const date = new Date(obj);
    const y = 1900 + date.getYear();
    const m = '0' + (date.getMonth() + 1);
    const d = '0' + date.getDate();
    return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length);
};

// 手机号验证
const verifyMobile = (value) => {
    if (!(/^1[3456789]\d{9}$/.test(value))) {
        return false;
    } else {
        return true;
    }
};

// 身份证号验证
const verifyIdCard = (code) => {
    if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(code))) {
        return false;
    } else {
        return true;
    }
};

// 保留N位小数
const toFixedFn = (value, n) => {
    if (value % 1 === 0) {
        return value;
    } else {
        return value.toFixed(n).replace(/0+$/g, '');
    }
};

const inputOnlyOnePoint = (v) => {
    v = v.replace(/[^\d.]/g, '').replace(/^\./g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
    return v;
};

let downloadFile = (that, url, pa, name, type) => {
    that.$http({
        method: type,
        url: url,
        responseType: 'blob',
        data: pa
    }).then(res => {
        // let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'}, name);
        // let objectUrl = URL.createObjectURL(blob);
        // window.location.href = objectUrl;
        let blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'});
        let downloadElement = document.createElement('a');
        let href = window.URL.createObjectURL(blob); // 创建下载的链接
        downloadElement.href = href;
        downloadElement.download = name; // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
    });
};

// 定义外部输出
export default {
    parseDate,
    verifyMobile,
    toFixedFn,
    verifyIdCard,
    downloadFile,
    inputOnlyOnePoint
};
