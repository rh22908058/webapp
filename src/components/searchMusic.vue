<template>
<transition name="search">
  <div class="search">
    <div class="top">
        <div class="box-wrapper">
            <search-box ref="box" @query="onQueryChange" class="search-box">
            </search-box>
        </div>
        <div class="cancel" @click="back">取消</div>
    </div>
    <div class="content" :data="hotList" v-show="showFlag">
        <span class="title">随便听听</span>
        <ul>
            <li v-for="(song,index) in hotList" class="hot" @click.stop.prevent="selectQuery(index)">
                <span class="hotname">{{song}}</span>
            </li>
        </ul>
    </div>
    <scroll ref="searchContent" class="content" :data="searchList" :pullup="true" @scrollToEnd="searchMore" v-show="!showFlag">
        <ul>
            <li v-for="(song,index) in searchList" class="song" @click.stop.prevent="selectItem(index,$event)">
                <span class="name">{{song.name}}</span>
            </li>
            <loading></loading>
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
import Loading from '../base/loading/loading'
export default {
    data(){
        return {
            keyword:'',
            curPage:1,
            searchList:[],
            hasMore:false,
            song:{},
            hotList:['开始懂了','我好想你','五月天','后来的我们','听雪','街角的祝福','洋葱'],
            showFlag:true
        }
    },
    props:{
        perpage: {
            type: Number,
            default: 12
        }
    },
    components:{
        'search-box':SearchBox,
        Scroll,
        Loading
    },
    created(){
    },
    actived(){
        this.curPage=1
        this.keyword=''
    },
    methods:{
        back(){
            this.$emit('hidden')
            this.$refs.box.clear()
        },
        onQueryChange(query){
            this.keyword = query.trim()
            if(this.keyword){
                this.showFlag=false
            }else{
                this.showFlag=true
            }
        },
        _searchResolve(res){
            if(res.data.errcode===0){
                res.data.data.info.forEach(item=>{
                    this.searchList.push({name:item.songname,hash:item.hash,duration:item.duration})
                })
            }
            if(res.data.data.total<=this.curPage*this.perpage){
                this.hasMore=false
            }else{
                this.hasMore=true
                this.curPage++
            }
        },
        search(){
            if(this.keyword){
                getHash(this.keyword,this.curPage,this.perpage).then(this._searchResolve)
            }
        },
        searchMore(){
            if(this.hasMore){
                getHash(this.keyword,this.curPage,this.perpage).then(this._searchResolve)
            }
        },
        selectItem(index,event){
            if(!event._constructed){
                return
            }
            console.log('click')
            let list=this.playlist.slice()
            //let tempSong=this.searchList[index]
            getSong(this.searchList[index].hash).then(res=>{
                console.log(res)
                if(res.data.err_code===0){
                    this.song=createSong(res.data.data)
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
                    this.playSong(0)
                }
            })
        },
        selectQuery(index){
            console.log('click')
            this.$refs.box.setQuery(this.hotList[index])
        },
        ...mapMutations({
            setPlayList: 'SET_PLAYLIST',
            setCurrentIndex: 'SET_CURRENT_INDEX'
        }),
        ...mapActions([
            'playSong'
        ])
    },
    computed:{
        ...mapGetters([
            'currentIndex',
            'fullScreen',
            'playing',
            'currentSong',
            'playlist'
        ])
    },
    watch:{
        keyword(){
            this.searchList=[]
            this.curPage=1
            this.search()
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped style lang="stylus" rel="stylesheet/stylus">
@import "../common/stylus/variable"
@import "../common/stylus/mixin"
.search
    position fixed
    top 0
    left 0
    right 0
    bottom 50px
    background #fff
    font-size $font-size-medium
    &.search-enter-active, &.search-leave-active
        transition all 0.5s
    &.search-enter, &.search-leave-to
        opacity 0
        .top
          transform translate3d(0, -50px, 0)
    .top
        display flex
        height 50px
        background $color-highlight-background
        color $color-text-input
        box-shadow 10px 10px 5px #8DB6CD
        .box-wrapper
            flex 1
            height 40px
            padding 10px 10px
        .cancel
            flex 40px 0 0
            line-height 40px
            padding 5px 3px
    .content
        position fixed
        top 50px
        left 0
        right 0
        bottom 40px
        overflow hidden
        .title
            display inline-block
            height 30px
            line-height 30px
            padding 10px 0 0 20px
            font-size $font-size-medium-x
        .hot
            display inline-block
            border-radius 20px
            height 26px
            border 2px solid #1E90FF
            margin 15px 0 0 20px
            padding 3px 10px
            .hotname
                text-align center
                height 26px
                line-height 26px
                color #1E90FF
                text-hidden-dot()
        .song
            height 45px
            border-1px(#ccc)
            padding-left 20px
            text-align left
            .name
                display block
                height 100%
                line-height 45px
                color #666
                text-align left
                text-hidden-dot()
</style>
