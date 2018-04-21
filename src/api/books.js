import jsonp from '../common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function getRecommands(){
    let url="https://api.douban.com/v2/book/search?tag=热门&count=10&start=10"
    
    let data=Object.assign({},commonParams,{
        host:"book.douban.com",
    })
    return jsonp(url, data, options)
}

export function getBooks(){
    let url="/api/getBooks"
    
    let data=Object.assign({},commonParams,{
        format: 'json'
    })
    return axios.get(url, {
        params: data
    }).then((res) => {
        console.log(res)
        //return Promise.resolve(res)
    })
}