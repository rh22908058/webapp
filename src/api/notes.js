import jsonp from '../common/js/jsonp'
import {commonParams, options} from './config'

export function getNotes(start){
    let url="https://api.douban.com/v2/event/list"
    
    let data=Object.assign({},commonParams,{
        loc:108288,
        count:10,
        start:start
    })
    return jsonp(url, data, options)
}