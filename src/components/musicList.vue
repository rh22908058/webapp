<template>
  <div class="music-list">
    <div class="header">
      <div class="item" @click="left"><i class="icon-search"></i></div>
      <div class="item" @click="right"><i class="icon-user"></i></div>
    </div>
    <scroll ref="scroll" class="wrapper" :data="songs">
      <ul>
        <!--子元素占据了li的所有区域，点击li的目标元素必然是其子元素之一，子元素冒泡加上li本身必然会触发两次click怎么解决？-->
        <!--如果禁止了所有子元素冒泡，那么li的点击事件也不会响应-->
        <li @click="selectItem(index,$event)" v-for="(song,index) in songs" class="song" ref="song">
          <span class="name">{{song.name}}</span>
          <span class="singer">{{song.singer}}</span>
          <span class="icon">
            <i class="icon-star-empty" @click.stop="addFavorite(index,$event)"></i>
          </span>
        </li>
      </ul>
    </scroll>
    <!--searchmusic组件中使用动画，为什么用v-show不能触发动画而要用v-if?-->
    <div class="search-wrapper" v-if="searchFlag">
      <search-music @hidden="hidden"></search-music>
    </div>
    <!--这里是从getters中取的数据，需要用v-if每次都重新加载，正确计算bs的滚动高度-->
    <div class="favorite-wrapper" v-if="favoriteFlag">
      <favorite-music @hidden="hidden" @del="deleteFavorite"></favorite-music>
    </div>
  </div>
</template>

<script>
/*有时候npm安装组件报错无权限，加--no-optional即可，如npm install vue-infinite-scroll --save --no-optional*/
import {test,searchMusic,getMusics,getNewList} from '../api/music'
import {createSong} from '../common/js/song'
import header from './header'
import Scroll from '../base/scroll'
import Loading from '../base/loading/loading'
import SearchMusic from './searchMusic'
import FavoriteMusic from './favoriteMusic'
import {mapMutations, mapActions, mapGetters} from 'vuex'
import {playlistMixin} from '../common/js/mixin'

const PAGE_SIZE = 15

export default {
  data(){
    return {
      songs:[],
      searchFlag:false,
      favoriteFlag:false
    }
  },
  mixins: [playlistMixin],
  created(){
    //console.log(test())
    /*
    test().then((res)=>{
      console.log(res)
    })
    */
    /*
    getMusicsV().then(res=>{
      console.log(res)
    })
    */
    //getMusics()  
    this.getMusicList()
  },
  activated(){
    console.log(111)
    //this.getMusicList()
    this.songs=this.playlist
  },
  methods:{
    //酷狗音乐
    /*
    getMusicList(){
      //获取歌曲hash值的请求没有query参数字段，是任意返回10个歌曲的hash
      //getMusics的API返回的是一个Promise数组，其中每个Promise都是按照指定hash值的GET请求(结果返回的歌曲)
      //获取了当前一批次的歌曲数组，元素是song对象。
      getNewList().then((res)=>{
        let temp=res.data.data.map(item=>{
          return createSong(item)
        })
        this.songs=this.songs.concat(temp)
        this.setPlayList(this.songs)
        console.log(this.songs)
      })
    },
    */
    handlePlaylist() {
        const bottom = (this.currentSong.hash&&!this.fullScreen) ? '100px' : '50px'
        console.log(bottom)
        this.$refs.scroll.$el.style.bottom = bottom
        this.$refs.scroll.refresh()
    },
    getMusicList(){
      getMusics().then((res)=>{  
        let temp=res.map(item=>{
          return createSong(item.data.data)
        })
        this.songs=this.songs.concat(temp)
        this.setPlayList(this.songs)
      })
    },
    //选择某一歌曲，提交playsong的action播放并全屏显示normalplayer
    //对选中歌曲获取歌词并更新对应song(添加歌词)，同时更新mutation到playlist
    selectItem(index,event){
      if(!event._constructed){
          return
      }
      console.log('click')
      //console.log(this.$refs.song)
      this.playSong(index,false)
    },
    left(){
      this.searchFlag=true
    },
    right(){
      this.favoriteFlag=true
    },
    hidden(){
      this.searchFlag=false
      this.favoriteFlag=false
      this.songs=this.playlist
    },
    addFavorite(index,event){
      if(!event._constructed){
          return
      }
      let song=this.songs[index]
      this.saveFavoriteList(song)
      //获取点击的目标元素，这里就是star的图标字体<i>，修改类名和字体颜色
      let star=event.target
      star.className='icon-star-full'
    },
    deleteFavorite(song){
      let index=this.songs.findIndex(item=>{
        return item.hash===song.hash
      })
      if(index>-1){
        //$refs直接获取了DOM节点，然后可以调用DOM属性children获取子元素数组
        //注意ref在遍历元素上时refs为数组，ref在单个元素上时refs也是单个元素
        let star=this.$refs.song[index].children[2].children[0]
        star.className='icon-star-empty'
      }
    },
    ...mapMutations({
      setPlayList: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'playSong',
      'saveFavoriteList'
    ])
  },
  computed:{
    ...mapGetters([
        'playlist'
    ])
  },
  components:{
    Scroll,
    Loading,
    'search-music':SearchMusic,
    'favorite-music':FavoriteMusic
  },
  watch:{
    fullScreen(){
      this.handlePlaylist()
    },
    favoriteList(list){
      list.forEach(item=>{

      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped style lang="stylus" rel="stylesheet/stylus">
@import "../common/stylus/variable"
@import "../common/stylus/mixin"
.header
    display flex
    width 100%
    height 50px
    line-height 50px
    justify-content space-between
    background-color #000
    .item
        width 50px
        text-align center
        font-size 18px
        cursor pointer
        color #fff
.wrapper
  position fixed
  top 50px
  bottom 50px
  overflow hidden
  width 100%
  .song
    height 60px
    border-1px(#ccc)
    padding-left 20px
    text-align left
    position relative
    .name
      display block
      height 50%
      line-height 30px
      color #666
      font-size $font-size-medium
      text-hidden-dot()
    .singer
      display block
      height 50%
      line-height 16px
      color #888
      font-size $font-size-small-s
    .icon
      position absolute
      right 0
      top 0
      height 100%
      width 60px
      line-height 60px
      text-align center
      font-size 18px
.search-wrapper,.favorite-wrapper
  position fixed
  top 50px
  bottom 50px
  overflow hidden
  width 100%
</style>
