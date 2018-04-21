export const commonParams = {
  //format: 'json'
  format: 'jsonp'
}

export const options = {

}


export const commonParamsKugou = {
  /*
  format: 'json',
  pagesize:15,
  platform:'WebFilter',
  showtype:1,
  r:'play/getdata',
  */
  format: 'json',
  platform:'WebFilter',
  showtype:1,
  json:true
}

export const optionsKugou = {
  param: 'jsonpCallback',
  prefix: 'jp'
}

export const commonParamsQQ = {
  zhidaqu:1,
  catZhida:1,
  t:0,
  flag:1,
  ie:'utf-8',
  sem:1,
  aggr:0,
  remoteplace:'txt.mqq.all',
  g_tk:5381,
  uin:0,
  inCharset:'utf-8',
  outCharset:'utf-8',
  notice:0,
  platform:'h5',
  needNewCode:1,
  tpl:3,
  page:'detail',
  type:'top',
  topid:36
}
export const commonParamsQQ_1 = {
  loginUin:0,
  hostUin:0,
  format:'json',
  inCharset:'utf8',
  outCharset:'utf-8',
  notice:0,
  platform:'yqq',
  needNewCode:0,
  uin:0,
  guid:3663184244,
  cid:205361747
}
export const optionsQQ = {
  /*
  pagesize:15,
  platform:'WebFilter',
  showtype:1
  MusicJsonCallback
  */
  param: 'jsonpCallback',
  prefix: 'jp'
}
export const optionsQQ_1 = {
  param: 'MusicJsonCallback'
}
