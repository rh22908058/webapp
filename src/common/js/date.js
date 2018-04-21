/*模块化导出函数*/
export function formatDate(date, fmt) {
    /*用正则表达式遍历字符串*/
    /*匹配字符串y+,有年的表达式*/
    if (/(y+)/.test(fmt)) {
        /*将yyyy替换为实际的年，RegExp.$1可以指定到上面正则表达式第一个小括号的匹配结果;date.getFullYear()是一个4位年份数字*/
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    /*定义一个正则表达式为属性的对象，将月日时分秒的正则映射给相应的date方法*/
    let o = {
            /*date.getMonth月份计算从0开始*/
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
    }
    /*遍历正则规则对象，分别匹配替换月日时分秒*/
    for (let k in o) {
        /*这里用`${}`来表示拼接字符串*/
        if (new RegExp(`(${k})`).test(fmt)) {
            /*获取实际的月日时分秒字符串值*/
            let str = o[k] + ''
                /*如果正则时间类型长度是1，直接显示结果字符串，如果不是则补零*/
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
        }
    }
    return fmt
}

/*对字符串左侧补零*/
function padLeftZero(str) {
    /*前面加'00'再依据字符串长度截取即可*/
    return ('00' + str).substr(str.length)
}