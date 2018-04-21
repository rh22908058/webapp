//匹配如[00:30.75]的歌词播放时间
const timeExp=/\[(\d{2}):(\d{2})\.(\d{2})\]/g

const STATE_PAUSE = 0
const STATE_PLAYING = 1
const STATE_DESTORY = 2

export default class Song {
  constructor({id, singer, name, duration, image, url, origin_lyrics, hash,handler=()=>{}}) {
    this.id = id
    this.singer = singer
    this.name = name
    this.duration = duration
    this.image = image
    this.url = url
    this.origin_lyrics=origin_lyrics
    this.hash=hash
    this.handler=handler
    if(this.origin_lyrics){
      this.lines=[]
      this.state=STATE_PAUSE
      this.curLine=0
      this._initLyrics()
    }
  }
  _initLyrics(){ 
    //原始歌词字符串按'\n'换行符分组
    const lines = this.origin_lyrics.split('\n')
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      //匹配出当前行歌词时间字符串，如‘[00:46.17]’
      let result = timeExp.exec(line)
      if (result) {
        //去掉当前行的时间并去空格，这就留下了纯歌词
        const txt = line.replace(timeExp, '').trim()
        //将时间\歌词作为属性封装对象，存入每行歌词数组。
        if (txt) {
          this.lines.push({
            //这里需要将时间字符串转换为时间戳(表示为毫秒数的时间)
            time: result[1] * 60 * 1000 + result[2] * 1000 + (result[3] || 0) * 10,
            txt
          })
        }
      }
    }
    this.lines.sort((a, b) => {
      return a.time - b.time
    })
  }
  //查询当前时间戳对应的行数
  _findCurNum(time) {
    for (let i = 0; i < this.lines.length; i++) {
      if (time <= this.lines[i].time) {
        return i
      }
    }
    return this.lines.length - 1
  }
  //对当前行调用回调函数handler，将歌词\行数对象作为参数传入，在使用时需要自定义满足这个参数格式的回调函数
  _callHandler(i) {
    if (i < 0) {
      return
    }
    console.log(this.handler)
    this.handler({
      txt: this.lines[i].txt,
      lineNum: i
    })
  }
  //计算出当前行歌词需要播放的时间（单位都是毫秒数时间戳），以此设置定时器调用回调函数并且行数加一，再递归调用播放下一行
  _playRest() {
    let line = this.lines[this.curNum]
    //line.time是当前行播放完后的时间戳，+new Date()-this.startStamp是播放到当前行瞬间的时间戳
    //new Date()返回一个字符串，用'+'直接转换为时间戳
    let delay = line.time - (+new Date() - this.startStamp)
    //将定时器变量设为类属性，方便再其他方法中清除
    this.timer = setTimeout(() => {
      //调用播放完当前行的回调函数并跳到下一行，如果没播放到末尾则递归调用播放下一行
      this._callHandler(this.curNum++)
      if (this.curNum < this.lines.length && this.state === STATE_PLAYING) {
        this._playRest()
      }
    }, delay)
  }
  //播放歌词,startTime是从xx毫秒处开始播放
  play(startTime=0,skipLast) {
    if (!this.lines.length) {
      return
    }
    this.state = STATE_PLAYING
    //查找到当前开始播放的歌词行数
    this.curNum = this._findCurNum(startTime)

    //计算歌曲真正开始从头播放的时间戳，也就是当前时间戳减去已经播放的歌曲长度
    this.startStamp = +new Date() - startTime

    if (!skipLast) {
      console.log('callhandler:'+this.curNum)
      this._callHandler(this.curNum - 1)
    }
    //清除定时器，重新调用播放的内部方法
    if (this.curNum < this.lines.length) {
      clearTimeout(this.timer)
      this._playRest()
    }
  }

  togglePlay() {
    var now = +new Date()
    if (this.state === STATE_PLAYING) {
      this.stop()
      console.log('stop')
      this.pauseStamp = now
    } else {
      this.state = STATE_PLAYING
      console.log(`${(this.pauseStamp || now) - (this.startStamp || now)}`)
      this.play((this.pauseStamp || now) - (this.startStamp || now), false)
      this.pauseStamp = 0
    }
  }
  seek(offset) {
    this.play(offset,false)
    console.log('seek:'+offset)
  }
  stop() {
    this.state = STATE_PAUSE
    clearTimeout(this.timer)
  }
  destroy() {
    this.state = STATE_DESTORY
    this.pauseStamp=null
    clearTimeout(this.timer) 
  }
}

export function createSong(musicData) {
  return new Song({
    id : musicData.album_id,
    singer : musicData.author_name,
    name : musicData.song_name,
    duration : musicData.timelength,
    image : musicData.img,
    url : musicData.play_url,
    origin_lyrics : musicData.lyrics,
    hash : musicData.hash
  })
}
export function createSongV(musicData) {
  return new Song({
    id : musicData.id,
    singer : musicData.singer,
    name : musicData.name,
    duration : musicData.duration,
    image : musicData.image,
    url : musicData.url,
    origin_lyrics : musicData.origin_lyrics,
    hash : musicData.hash,
    handler : musicData.handler
  })
}

