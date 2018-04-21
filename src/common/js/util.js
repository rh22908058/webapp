/*解析url参数*/
/*ex:  ?id=12345&a=b  return Object{id:12345,a:b}*/
export function urlParse() {
    /*获取url中的参数部分*/
    let url = window.location.search
    let obj = {}
        /*匹配一个参数*/
    let reg = /[?&][^?&]+=[^&?]+/g
        /*这里并没有采用整体匹配，然后用小括号取值的方式，而是采用分段匹配，这样arr就是一个匹配了所有参数的数组*/
    let arr = url.match(reg)
        //['?id=12345','&a=b']
    if (arr) {
        arr.forEach((item) => {
            //将一个参数字符串去掉首字符，然后按等号分割成键值对数组
            let tempArr = item.substring(1).split('=')
                /*url中的参数，需要decode*/
            let key = decodeURIComponent(tempArr[0])
            let val = decodeURIComponent(tempArr[1])
                //将键值对保存进对象
            obj[key] = val
        })
    }
    return obj
}

export function debounce(func, delay) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

let elementStyle = document.createElement('div').style

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()

export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

export function cloneObject(obj) {
    if(typeof obj === "object") {
        if(obj instanceof Array) {
            var newArr = obj.slice()
            return newArr
        } else {
            var newObj = {}
            for(var key in obj) {
                newObj[key] = cloneObject(obj[key])
            }
            return newObj
        }
    } else {
        return obj
    }
}