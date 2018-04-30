<template>
  <div class="player" v-show="currentIndex!=-1">
      <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
          <div class="head">
            <div class="back" @click="back">
                <i class="icon-circle-left"></i>
            </div>
            <div class="name">{{currentSong.name}}</div>
            <div class="singer">{{currentSong.singer}}</div>
          </div>
          <div class="image-wrapper" :class="rotateImage" :style="bgStyle">
          </div>
          <div class="lyric">
            <span class="lyric-text cur-lyric">{{curLyric}}</span>
            <span class="lyric-text">{{nextLyric}}</span>
          </div>
          <div class="progressbar-wrapper">
              <span class="time time-l">{{formatTime(currentTime/1000)}}</span>
              <div class="bar">
                <progress-bar :percent="percent" @percentChange="jump"></progress-bar>
              </div>
              <span class="time time-r">{{formatTime(currentSong.duration/1000||0)}}</span>
          </div>
          <div class="operators-wrapper">
              <div class="icon i-left">
                <i class="icon-backward" @click="prevPlay"></i>
              </div>
              <div class="icon i-middle">
                <i @click="togglePlay" :class="playImage"></i>
              </div>
              <div class="icon i-right">
                <i class="icon-forward2" @click="nextPlay"></i>
              </div>
              <div class="icon-mode i-mode">
                <i @click="toggleMode" :class="toggleImageMode"></i>
              </div>
          </div>
      </div>
      </transition>
      <transition name="mini">
      <div class="mini-player" v-show="!fullScreen">
          <div class="img-wrapper" @click="toggleNormal">
              <img class="img" :class="rotateImage" :src="currentSong.image" width="42" height="42"/>
          </div>
          <div class="content">
              <div class="bar-wrapper">
                  <progress-bar :percent="percent" @percentChange="jump"></progress-bar>
              </div>
              <div class="icon i-left">
                <i @click="togglePlay" :class="playImage"></i>
              </div>
              <div class="icon i-right">
                <i class="icon-forward2" @click="nextPlay"></i>
              </div>
              <div class="icon i-mode">
                <i @click="toggleMode" :class="toggleImageMode"></i>
              </div>
          </div>
      </div>
      </transition>
      <audio ref="audio" :src="currentSong.url" @play="ready" @error="error" @timeupdate="updateTime"
           @ended="end"></audio>
  </div>
</template>

<script>
import ProgressBar from '../base/progress-bar'
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {createSong, createSongV} from '../common/js/song'
import {cloneObject} from '../common/js/util'
export default {
    data(){
        return {
            songReady: false,
            percent: 0,
            currentTime:0,
            curLyric:'歌词加载中...',
            nextLyric:'',
            mode:false,
            firstPlay:false,
            playImage:'icon-play2',
            rotateImage:'pause'
        }
    },
    props:{

    },
    components:{
        ProgressBar
    },
    created(){
        //player页面是根组件下的组件而不是路由下的组件，项目加载时就会调用这个created
    },
    methods:{
        back() {
            this.setFullScreen(false)
        },
        ready(){
            console.log('ready')
            this.songReady=true
        },
        updateTime(e){
            this.currentTime=e.target.currentTime*1000
            this.percent=this.currentTime/this.currentSong.duration
        },
        end(){
            this.currentTime = 0
            if (this.mode) {
                this.loop()
            } else {
                this.nextPlay()
            }
        },
        error(){

        },
        toggleNormal(){
            this.setFullScreen(true)
        },
        //格式化以秒为单位的时间为xx:xx
        formatTime(time){
            let min=parseInt(time/60)
            let sec=parseInt(time%60)
            return `${this._zero(min)}:${this._zero(sec)}`
        },
        //播放/暂停
        togglePlay(){
            /*
            if (!this.songReady) {
                return
            }
            */
            //切换audio的播放/暂停，如果存在歌词，同步切歌词的播放/暂停
            this.setPlayingState(!this.playing)
            if(!this.firstPlay){
                this.tempSong.stop()
            }else{
                this.tempSong.togglePlay()
            }
            const audio = this.$refs.audio
            console.log('toggle:'+this.playing)
            if(this.playing){
                /*
                console.log('lyrictime:'+this.lyrictime)
                //计算当前歌词开始播放的时间戳
                if(this.lyrictime!==this.tempSong.duration*1000&&this.tempSong.pauseStamp){
                    this.lyrictime=(this.tempSong.pauseStamp || now) - (this.tempSong.startStamp || now)
                }
                else{
                    this.lyrictime=0
                }
                */
                //console.log('lyrictime:'+lyrictime)
                //播放歌曲
                this.playImage='icon-pause'
                this.rotateImage='play'
                audio.play()
            }else{
                audio.pause()
                this.playImage='icon-play2'
                this.rotateImage='pause'
                //this.tempSong.stop()
            }
        },
        prevPlay(){
            /*
            if (!this.songReady) {
                return
            }
            */
            let curIndex=this.currentIndex
            let len=this.playlist.length

            this.tempSong.destroy()
            this.curLyric='歌词加载中...'
            this.nextLyric=''

            if(curIndex===0){
                curIndex=len-1
            }else{
                curIndex--
            }
            this.setCurrentIndex(curIndex)
            this.setPlayingState(true)
            this.playImage='icon-pause'
            this.rotateImage='play'
        },
        nextPlay(){
            /*
            if (!this.songReady) {
                return
            }
            */
            let curIndex=this.currentIndex
            let len=this.playlist.length
            /*将上一首歌曲的歌词销毁(也就是当前tempSong)，销毁定时器避免两首歌的定时器互相干扰*/
            this.tempSong.destroy()
            this.curLyric='歌词加载中...'
            this.nextLyric=''

            if(curIndex===len-1){
                curIndex=0
            }else{
                curIndex++
            }
            this.setCurrentIndex(curIndex)
            this.setPlayingState(true)
            this.playImage='icon-pause'
            this.rotateImage='play'
        },
        toggleMode(){
            this.mode=!this.mode
        },
        loop() {
            this.$refs.audio.currentTime = 0
            this.$refs.audio.play()
            this.setPlayingState(true)
            if (this.tempSong.lines.length) {
                this.tempSong.seek(0)
            }
        },
        jump(percent) {
            this.percent=percent
            console.log(percent)
            this.currentTime = this.currentSong.duration * percent
            console.log(this.currentTime)
            this.$refs.audio.currentTime = this.currentTime/1000
            if (!this.playing) {
                this.$refs.audio.play()
                this.setPlayingState(true)
                this.playImage='icon-pause'
                this.rotateImage='play'
            }
            if (this.tempSong.lines.length) {
                this.tempSong.seek(this.currentTime)
            }
        },
        //补0
        _zero(val,n=2){
            let valStr=val.toString()
            while(valStr.length<n){
                valStr=`0${valStr}`
            }
            return valStr
        },
        //每行歌词播放完毕的回调函数，在这里刷新页面要显示的两行歌词
        _handler(param){
            this.curLyric=param.txt
            if(param.lineNum>=this.tempSong.lines.length-1){
                this.nextLyric=''
            }else{
                this.nextLyric=this.tempSong.lines[param.lineNum+1].txt
            }
            //console.log(param.lineNum+':'+param.txt)
        },
        ...mapMutations({
            setFullScreen: 'SET_FULL_SCREEN',
            setPlayingState: 'SET_PLAYING_STATE',
            setCurrentIndex: 'SET_CURRENT_INDEX'
        })
    },
    computed:{
        cdRotate() {
            //this.$nextTick(()=>{
            return this.playing ? 'play' : 'pause'
            //})
        },
        ...mapGetters([
            'currentIndex',
            'fullScreen',
            'playing',
            'currentSong',
            'playlist'
        ]),
        bgStyle(){
            return `background-image:url(${this.currentSong.image})`
        }/*
        ,
        toggleImagePlay(){
            if(!this.firstPlay){
                return 'icon-play2'
            }   
            return this.playing?'icon-pause':'icon-play2'
        }*/,
        toggleImageMode(){
            return this.mode?'icon-loop':'icon-shuffle'
        }
    },
    watch:{
        currentSong(newSong, oldSong) {
            if (newSong.hash === oldSong.hash) {
                return
            }
            if(this.tempSong&&this.tempSong.destroy){
                this.tempSong.destroy()
            }
            //切歌后初始化变量
            this.curLyric='歌词加载中...'
            this.nextLyric=''
            this.currentTime=0
            //深度复制getters中的currentSong，添加播放每行歌词的回调方法handler，再用这个复制对象去重新new一个song
            //只有new出来的对象才能调用Class下的类方法，深度复制的对象并不能调用类方法
            //对于引用类型的currentSong，如果用tempSong=this.currentSong，只是复制了引用，对tempSong的操作还是会同步影响到currentSong
            //从而违反了vuex的操作规则，没有在mutation中修改数据
            let tempSong=cloneObject(newSong)
            tempSong.handler=this._handler
            this.tempSong=createSongV(tempSong)
            //_handler是每行歌词播放结束的回调函数，包含{txt,lineNum}参数，在这个回调函数里处理显示当前两行歌词的逻辑
            this.songReady = false              
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                //console.log(this.tempSong)
                this.$refs.audio.currentTime = 0
                //action是异步事件，action中改变playing的状态发生在currentSong变化之后
                //当action中改变了playing时，currentSong检测到的playing为undefined
                //但是mutation中改变的状态会实时检测到
                if(!this.firstPlay||this.playing===false){
                    console.log(this.firstPlay)
                    console.log(this.playing)
                    console.log('pause')
                    this.$refs.audio.pause()
                    this.tempSong.stop()
                    this.firstPlay=true
                }else{
                    console.log(this.firstPlay)
                    console.log(this.playing)
                    console.log('play')
                    this.tempSong.play()
                    this.$refs.audio.play()
                }
            }, 1000)        
        },
        playing(newPlaying) {
            /*
            if (!this.songReady) {
                return
            }
            const audio = this.$refs.audio
            this.$nextTick(() => {
                if(newPlaying){
                    audio.play()
                    //this.playImage='icon-pause'
                }else{
                    audio.pause()
                    //this.playImage='icon-play2'
                }
                //newPlaying ? audio.play() : audio.pause()
            })
            */
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped style lang="stylus" rel="stylesheet/stylus">
@import "../common/stylus/variable"
@import "../common/stylus/mixin"
.normal-player
    position fixed
    top 0
    left 0
    right 0
    bottom 50px
    background linear-gradient(to bottom, #9FB6CD, #E0FFFF)
    &.normal-enter-active, &.normal-leave-active
        transition all 0.5s
    &.normal-enter, &.normal-leave-to
        /*设置以右下角为圆心旋转*/
        transform-origin 100% 100%
        transform rotate(90deg)
    .head
        position relative
        height 70px
        padding-top 20px
        text-align center
        .back
            position absolute
            top 10px
            left 10px
            font-size 30px
        .name
            height 45px
            line-height 45px
            font-size $font-size-large
            color #888
            text-hidden-dot()
        .singer
            height 25px
            line-height 25px
            font-size $font-size-medium
            color #888
            text-hidden-dot()
    .image-wrapper
        width 80%
        padding-top 80%
        margin 20px auto
        border-radius 50%
        border 15px solid #ddd
        &.play
            animation rotate 10s linear infinite
        &.pause
            animation-play-state paused
    .lyric
        height 70px
        position absolute
        width 100%
        left 0
        bottom 100px
        padding-bottom 10px
        .lyric-text
            display inline-block
            width 100%
            line-height 35px
            text-align center 
            font-size $font-size-medium-x
            color #8A2BE2
            &.cur-lyric
                color #8B1A1A
    .progressbar-wrapper
        height 30px
        position absolute
        width 100%
        left 0
        bottom 70px
        display flex
        .time
            flex 0 0 35px
            line-height 30px
            font-size $font-size-small
            color #7A67EE
            &.time-l
                text-align right
                padding-right 15px
            &.time-r
                text-align left
                padding 0 10px 0 15px
        .bar
            flex 1
            padding-top 5px
    .operators-wrapper
        height 70px
        position absolute
        width 100%
        left 0
        bottom 0
        display flex
        align-items center
        line-height 70px
        .icon
            flex 1
            height 100%
            font-size 30px
            &.i-left
                text-align right
            &.i-middle
                text-align center
                font-size 50px
            &.i-right
                text-align left
        .icon-mode
            position absolute
            height 100%
            left 20px
            top 0
            line-height 70px
.mini-player
    position fixed
    left 0
    right 0
    bottom 50px
    height 50px
    background linear-gradient(to right, rgb(5, 69, 71), rgb(96, 98, 102))
    display flex
    border-top 3px solid rgba(255, 255, 255, 0.3)
    &.mini-enter-active, &.mini-leave-active
        transition all 0.5s
    &.mini-enter, &.mini-leave-to
        opacity 0
    .img-wrapper
        flex 0 0 40px
        padding 2px 10px 2px 10px
        .img
            border-radius 50%
            border 2px solid #999
            &.play
                animation rotate 10s linear infinite
            &.pause
                animation-play-state paused
    .content
        flex 1
        padding 0 10px 0 5px
        display flex
        .bar-wrapper
            flex 1
            height 50px
            padding 15px 20px
        .icon
            flex 0 0 50px
            line-height 50px
            text-align center
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
