import jsonp from '../common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function getBooks(start){
    let url="https://api.douban.com/v2/book/search"
    
    let data=Object.assign({},commonParams,{
        count:10,
        start,
        tag:'热门'
    })
    return jsonp(url, data, options)
}
/*
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
*/

export function searchBooks(q,start){
    let url='https://api.douban.com/v2/book/search'
    
    let data=Object.assign({},commonParams,{
        count:10,
        start,
        q
    })
    return jsonp(url, data, options)
}
export function getBook(id){
    let url=`https://api.douban.com/v2/book/${id}`
    
    let data=Object.assign({},commonParams,{
    })
    return jsonp(url, data, options)
}