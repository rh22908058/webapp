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