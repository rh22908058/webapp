<template>
<transition name="favorite">
  <div class="favorite">
    <div class="top">
        <span class="title">我的收藏</span>
        <div class="cancel" @click="back">
            <i class="icon-circle-left"></i>
        </div>
    </div>
    <scroll ref="favoriteContent" class="content" :data="favoriteList">
        <ul>
            <li v-for="(song,index) in favoriteList" class="song" @click="selectItem(index,$event)">
                <span class="name">{{song.name}}</span>
                <span class="icon">
                    <i class="icon-bin" @click.stop="delSong(song,$event)"></i>
                </span>
            </li>
        </ul>
    </scroll>
  </div>
</transition>
</template>

<script>
import SearchBox from '../base/searchBox'
import {getHash, getSong} from '../api/music'
import {createSong} from '../common/js/song'
import Scroll from '../base/scroll'
import {mapMutations, mapActions, mapGetters} from 'vuex'
import {loadFavorite} from '../common/js/cache'
import {favoritelistMixin} from '../common/js/mixin'
export default {
    data(){
        return {
            song:{},
        }
    },
    components:{
        Scroll
    },
    created(){

    },
    mixins: [favoritelistMixin],
    methods:{
        //判断是否存在迷你播放器，如果存在则改变scroll区域留出播放器位置
        handleFavoritelist() {
            const bottom = (this.currentSong.hash&&!this.fullScreen) ? '100px' : '50px'
            this.$refs.favoriteContent.$el.style.bottom = bottom
            this.$refs.favoriteContent.refresh()
        },
        back(){
            this.$emit('hidden')
        },
        selectItem(index,event){
            if(!event._constructed){
                return
            }
            console.log('selectclick')
            let list=this.playlist.slice()
            this.song=this.favoriteList[index]
            //选中某歌曲后需要对playlist去重并将当前歌曲添加到playlist首位
            let tempIndex=list.findIndex((item)=>{
                return this.song.hash===item.hash
            })
            if(tempIndex>-1){
                list.splice(tempIndex,1)
            }
            list.unshift(this.song)
            //这里只需要调用playsong的action，这样currentSong就会改变，在player组件中检测currentSong加载歌词
            //这里不可以在searchMusic中加载歌词，因为歌词加载是异步的，无法与player组件进行通信(除非用vuex)
            this.setPlayList(list)
            this.playSong(0,true)
        },
        delSong(song,event){
            if(!event._constructed){
                return
            }
            console.log('delclick')
            this.deleteFavoriteList(song)
            //派发删除事件，在父元素musicList组件中删除对应song的star
            this.$emit('del',song)
        },
        ...mapMutations({
            setPlayList: 'SET_PLAYLIST',
            setFavoriteList: 'SET_FAVORITE_LIST'
        }),
        ...mapActions([
            'playSong',
            'deleteFavoriteList'
        ])
    },
    computed:{
        ...mapGetters([
            'playlist'
        ])
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped style lang="stylus" rel="stylesheet/stylus">
@import "../common/stylus/variable"
@import "../common/stylus/mixin"
.favorite
    position fixed
    top 50px
    left 0
    right 0
    bottom 50px
    background #fff
    &.favorite-enter-active, &.favorite-leave-active
        transition all 0.5s
    &.favorite-enter, &.favorite-leave-to
        opacity 0
        .top
          transform translate3d(0, -50px, 0)
    .top
        position relative
        height 50px
        background #CD69C9
        color $color-text-input
        box-shadow 10px 10px 5px #CD2990
        text-align center
        .title
            height 100%
            line-height 50px
        .cancel
            width 50px
            height 100%
            line-height 50px
            position absolute
            top 0
            left 0
            font-size $font-size-large
    .content
        position fixed
        top 100px
        left 0
        right 0
        bottom 50px
        overflow hidden
        .song
            height 45px
            border-1px(#ccc)
            padding-left 20px
            text-align left
            display flex
            align-items center
            .name
                flex 1
                display block
                height 100%
                line-height 45px
                color #666
                font-size $font-size-medium
                text-hidden-dot()
            .icon
                flex 0 0 30px
                line-height 30px
</style>
