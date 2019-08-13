export default {
    minute2hour (time) {
        let hour;
        hour = (time % 60 === 0) ? time / 60 : (time / 60).toFixed(1);
        return hour;
    },
    cutstring (str, len) {
        let newstr;
        newstr = str.length > len ? (str.substring(0, len) + ' ...') : str;
        return newstr;
    },
    date (time, hour) { // 把时间戳格式:若有参返回年-月-日时:分:秒 若无参返回 年-月-日
        if (!time) {
            return '';
        }
        let y, m, d, date, h, ms, s, data, hours;
        date = new Date(time);
        y = date.getFullYear();
        m = date.getMonth() + 1;
        d = date.getDate();
        h = date.getHours();
        ms = date.getMinutes();
        s = date.getSeconds();
        data = y + '-' + format(m) + '-' + format(d) + '';
        hours = format(h) + ':' + format(ms) + ':' + format(s);
        if (hour) {
            return data + ' ' + hours;
        } else {
            return data;
        }
        function format (num) {
            if (parseInt(num) < 10) {
                num = '0' + num;
            }
            return num;
        }
    },
    // 格式化时间
    formatDate (date) { // 把时间戳格式:若有参返回年-月-日时:分:秒 若无参返回 年-月-日
        return (date + '').replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3');
    },
    dates (time, hour) { // 把时间戳格式:若有参返回年-月-日时:分:秒 若无参返回 年-月-日
        if (!time) {
            return '';
        }
        let y, m, d, date, h, ms, s, data, hours;
        date = new Date(time);
        y = date.getFullYear();
        m = date.getMonth() + 1;
        d = date.getDate();
        h = date.getHours();
        ms = date.getMinutes();
        s = date.getSeconds();
        data = '【' + y + '】' + '年' + '【' + format(m) + '】' + '月' + '【' + format(d) + '】' + '日';
        hours = format(h) + ':' + format(ms) + ':' + format(s);
        if (hour) {
            return data + ' ' + hours;
        } else {
            return data;
        }
        function format (num) {
            if (parseInt(num) < 10) {
                num = '0' + num;
            }
            return num;
        }
    },
    time (StatusMinute) {
        var day = parseInt(StatusMinute / 60 / 24);
        var hour = parseInt(StatusMinute / 60 % 24);
        var min = parseInt(StatusMinute % 60);
        StatusMinute = '';
        if (day > 0) {
            StatusMinute = day + '天';
        }
        if (hour > 0) {
            StatusMinute += hour + '小时';
        }
        if (min > 0) {
            StatusMinute += parseFloat(min) + '分钟';
        }
        return StatusMinute;
    },
    // 全局千位符
    toString (v) {
        return parseInt(v).toLocaleString();
        // return v.toLocaleString();
    },
    // 数字转金额显示
    numToCash (value, num = 2, isToFixed = 1) {
        if (value === '-') {
            return '-';
        }
        // 返回处理后的值
        value = parseFloat(value);
        if (value === null || value === undefined || value === '' || value === 0 || value === !NaN || !value) {
            value = 0;
            return value.toFixed(num);
        } else {
            value = value.toFixed(num);
            let end = value.split('.')[1];
            let start = value.split('.')[0];
            let arr = [];

            start = start.split('').reverse();
            start.map(function (elem, index) {
                arr.push(elem);
                if (index % 3 === 2 && index !== value.length - 1 && index !== start.length - 1) {
                    arr.push(',');
                }
            });

            start = arr.reverse().join('');
            if (isToFixed) {
                return start + '.' + end;
            } else {
                return start;
            }
        }
    },
    //保留小数后两位
    numFilter(value) {
        let realVal = Number(value).toFixed(2)
        return Number(realVal)
    },
    //隐藏号码中间四位
    placePhone(num){
        if(num.toString().length === 11){
            return num.toString().replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
        }else{
            return num.toString().replace(/^(\d{4})\d{4}(\d{4})$/, '$1****$2')
        }
    },
    showPhone(num){
        return num.toString().replace(/^(\d{3})(\d{4})(\d{4})$/, '$1 $2 $3');
    },
    // numFormat(value){
    //     if(!value) return '0.00';
	// 		/*原来用的是Number(value).toFixed(0)，这样取整时有问题，例如0.51取整之后为1，感谢Nils指正*/
	// 		var intPart =  Number(value)|0; //获取整数部分
	// 		var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断

	// 		var floatPart = ".00"; //预定义小数部分
	// 		var value2Array = value.split(".");

	// 		//=2表示数据有小数位
	// 		if(value2Array.length == 2) {
	// 			floatPart = value2Array[1].toString(); //拿到小数部分

	// 			if(floatPart.length == 1) { //补0,实际上用不着
	// 				return intPartFormat + "." + floatPart + '0';
	// 			} else {
	// 				return intPartFormat + "." + floatPart;
	// 			}

	// 		} else {
	// 			return intPartFormat + floatPart;
	// 		}
    // }

};
