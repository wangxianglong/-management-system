exports.install = function (Vue, options) {
    Vue.prototype.tableHeaderStyle = function (){//全局函数1
        return 'background:#f2f2f2;color:#000;font-weight:700;white-space: nowrap;'
     };
 };