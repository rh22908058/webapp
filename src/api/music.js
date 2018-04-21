import jsonp from '../common/js/jsonp'
import {commonParamsKugou, optionsKugou,commonParamsQQ, optionsQQ,commonParamsQQ_1,optionsQQ_1} from './config'
import axios from 'axios'

export function test(){
    /*酷狗音乐 */
    //歌曲URL，无歌词，可用
    //let url='http://m.kugou.com/app/i/getSongInfo.php?cmd=playInfo&hash=CB7EE97F4CC11C4EA7A1FA4B516A5D97'
    //歌曲HASH,这里必须带keyword，可用!!!
    //let url='http://mobilecdn.kugou.com/api/v3/search/song?keyword=的&page=1&pagesize=20&showtype=1'
    //歌曲HASH,可以不带keyword
    //let url='http://songsearch.kugou.com/song_search_v2?pagesize=20&platform=WebFilter'
    //let url='http://songsearch.kugou.com/song_search_v2?callback=jQuery19107655316341116605_1497970603262&keyword=%E5%91%A8%E6%9D%B0%E4%BC%A6&page=1&pagesize=1&userid=-1&clientver=&platform=WebFilter&tag=em&filter=2&iscorrection=1&privilege_filter=0'
    //歌曲URL，带歌词,用！！！
    //let url='http://www.kugou.com/yy/index.php?r=play/getdata&hash=CB7EE97F4CC11C4EA7A1FA4B516A5D97'
    //歌词
    //let url="http://lyrics.kugou.com/search?ver=1&man=yes&client=pc&keyword=Impossible&duration=228022&hash="
    //歌单
    //let url='http://m.kugou.com/plist/index&json=true'
    //新歌,有hash,用！！！
    //let url='http://m.kugou.com/?json=true'
    //排行榜
    //let url='http://m.kugou.com/rank/list&json=true'
    //热门搜索关键字
    //let url='http://mobilecdn.kugou.com/api/v3/search/hot?format=json&plat=0&count=30'
    /*
    let data=Object.assign({},commonParamsKugou,{
    })
    return jsonp(url, data, optionsKugou)
    */

    //return getHash('d')
    //return getSong('CB7EE97F4CC11C4EA7A1FA4B516A5D97')
    //return getNewList()
}
//////
//搜狗音乐的获取要通过两步，一是以pagesize,keyword(关键字，可忽略)为参数发送GET请求获取到lists数组
//lists数组中的每个元素都对应着一首歌曲(包含hash和album_id，但是没有url)
//二是以歌曲的hash和album_id为参数发送GET请求，响应数据的data属性中有play_url字段为这首歌曲的url。

//获取page为起始索引的一组lists，参数中指定数据类型为format:json，还要指定pagesize和platform
//返回一个get请求的Promise，响应数据中包含lists

//酷狗方案2，可以不指定keyword，带歌词，这里需要指定参数format:json
/*
function _getHashs(){
    let url='http://mobilecdn.kugou.com/api/v3/search'
    let data=Object.assign({},commonParamsKugou,optionsKugou,{
        keyword:'d'
    })
    return jsonp(url, data, optionsKugou)
}
*/
//返回一个Promise数组，这是一组以指定hash和album_id为参数的GET请求，响应数据数组中每个元素的data属性都包含了play_url作为歌曲的URL
/*
export function getMusics(){
    let songs
    let resultHashArr
    let resultMusics
    let commonUrl='http://www.kugou.com/yy/index.php'
    //then()返回的是一个新的Promise。
    //链式then(resolve)中，如果resolve中都是同步操作，则下一个then立即执行；如果resolve中有异步操作(如promise)，则下一个then等待异步操作的结果后才会执行。
    //then(resolve)的resolve参数方法中如果不返回数据，则下一个then(resolve)的resolve参数方法无法从其参数res获取到上一个then的执行结果。
    //then(resolve)的resolve参数方法中如果返回异步操作(如返回一个promise)，则下一个then(resolve)的resolve参数方法的res参数就是这个promise而不是异步操作的结果
    //then(resolve)的resolve参数方法中如果返回同步操作值，则下一个then(resolve)的resolve参数方法的res参数是上一个then的返回结果。

    return _getHashs().then((res)=>{
        //将响应的lists数组提取出hash和album_id重建新数组
        resultHashArr=res.data.lists.map((item)=>{
            return {FileHash:item.FileHash,album_id:item.AlbumID}
        })
        //对数组中的所有元素以r,format,hash,album_id为参数发送GET请求，重建获得这些GET请求的promise数组
        //这里的then(resolve)的resolve方法并没有返回数据但是有异步操作，下一个then(resolve)的resolve方法res参数没有意义(因为上一个then没有返回值)
        //为了将promise数组传递出去，用变量保存，在下一个then中从变量中提取并用Promise.all包装，这样外部方法调用时就可以直接作为promise使用。
        //在then方法中不可以返回嵌套then中的数据，因为then是异步的。
        //promise数组必须用Promise.all包转，这样就可以直接执行Promise.all().then()
        resultMusics=resultHashArr.map((item)=>{
            let data=Object.assign({},{r:'play/getdata'},commonParamsKugou,{
                hash:item.FileHash,
                album_id:item.album_id
            })
            return jsonp(commonUrl, data, optionsKugou)
        })
    }).then(()=>{
        //返回一个Promise.all，后续then(resolve)中resolve方法的res参数直接就是异步操作的结果
        //而返回一个promise，后续then(resolve)中resolve方法的res参数仍然是返回的promise
        return Promise.all(resultMusics)
    })
}
*/
/*
function test(){
    let pp
    let p= new Promise((resolve,reject)=>{
        setTimeout(()=>{

        },0)
    })
    let ppp=p.then(res=>{
        pp= new Promise((resolve,reject)=>{
            setTimeout(()=>{

            },0)
        })
        return pp
    })
    return ppp==pp
}
*/
//返回一个Promise数组，这是一组以指定hash和album_id为参数的GET请求，响应数据数组中每个元素的data属性都包含了play_url作为歌曲的URL
/*
export function getMusicsV(){
    let songs
    let resultHashArr
    let resultMusics
    let commonUrl='http://m.kugou.com/app/i/getSongInfo.php'
    
    return _getHashsV().then((res)=>{
        console.log(res)
        resultHashArr=res.data.info.map((item)=>{
            return {FileHash:item.hash}
        })
        resultMusics=resultHashArr.map((item)=>{
            let data=Object.assign({},{cmd:'playInfo'},commonParamsKugou,{
                hash:item.FileHash
            })
            return jsonp(commonUrl, data, optionsKugou)
        })
    }).then(()=>{
        return Promise.all(resultMusics)
    })
}
*/
//////
/*查找指定keyword的一组hash */
export function getHash(keyword,page,pagesie){ 
  const url = '/api/getHash'
  const data =Object.assign({},commonParamsKugou,{
    keyword,
    format:'json',
    showtype:1,
    page,
    pagesie
  })
  return axios.get(url, {
    params: data
  })
}
//获取新歌列表(包括hash)
export function getNewList(){ 
  const url = '/api/getNewList'
  const data =Object.assign({},commonParamsKugou,{
    format:'json',
    json:'true'
  })
  return axios.get(url, {
    params: data
  })
}
//获取指定hash值的song
export function getSong(hash){ 
  const url = '/api/getSong'
  const data =Object.assign({},commonParamsKugou,{
    hash,
    r:'play/getdata'
  })
  return axios.get(url, {
    params: data
  })
}
export function getMusics(){
    let resultHashArr
    let resultMusics
    
    return getNewList().then((res)=>{
        resultHashArr=res.data.data.map((item)=>{
            return {hash:item.hash}
        })
        resultMusics=resultHashArr.map((item)=>{
            return getSong(item.hash)
        })
    }).then(()=>{
        return Promise.all(resultMusics)
    })
}
