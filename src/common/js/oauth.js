import axios from 'axios'

export function getToken(){
    const data={
        client_id:'0b5405e19c58e4cc21fc11a4d50aae64',
        response_type:'token',
        redirect_uri:'http://localhost:8080/#/musics'
    }
    const url='https://www.douban.com/service/auth2/auth'
    axios.get(url, {
        params: data
    })
}