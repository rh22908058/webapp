import jsonp from '../common/js/jsonp'
import {commonParams, options} from './config'

export function getMovies(start){
    let url="https://api.douban.com/v2/movie/top250"
    
    let data=Object.assign({},commonParams,{
        loc:108288,
        count:10,
        start:start
    })
    return jsonp(url, data, options)
}

export function searchMovies(q,start){
    let url=`https://api.douban.com/v2/movie/search?q=${q}`
    
    let data=Object.assign({},commonParams,{
        loc:108288,
        count:10,
        start
    })
    return jsonp(url, data, options)
}

export function getMovieDetail(id){
    let url=`https://api.douban.com/v2/movie/subject/${id}`
    
    let data=Object.assign({},commonParams,{
        loc:108288
    })
    return jsonp(url, data, options)
}