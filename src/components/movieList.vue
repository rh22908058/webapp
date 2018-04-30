<template>
<transition name="movie">
  <div class="movie-list">
    <div class="top">
      <div class="box-wrapper">
          <search-box ref="box" @query="onQueryChange" class="search-box" placeholder='搜索电影'>
          </search-box>
      </div>
      <div class="cancel" @click="back">取消</div>
    </div>
    <scroll ref="scroll" class="content" :data="movies" :pullup="true" @scrollToEnd="searchMore">
      <ul>
        <li @click="selectItem(movie,$event)" v-for="(movie,index) in movies" class="movie" ref="movie">
          <img :src="movie.image_small" class="image">
          <div class="info">
            <div class="line">
              <span class="name">{{movie.name}}</span>
              <span class="average">评分:{{movie.average}}</span>
            </div>
            <div class="line">
              <span class="director">导演:{{movie.director}}.年份:{{movie.year}}</span>
            </div>
          </div>
        </li>
        <loading v-show="show_hasMore"></loading>
      </ul>
    </scroll>
    <scroll ref="searchContent" class="content search-content" :data="searchList" :pullup="true" @scrollToEnd="searchMore" v-show="showFlag">
        <ul>
            <li v-for="(movie,index) in searchList" class="movie" @click.stop.prevent="selectItem(movie,$event)">
                <img v-lazy="movie.image_small" class="image">
                <div class="info">
                  <div class="line">
                    <span class="name">{{movie.name}}</span>
                    <span class="average">评分:{{movie.average}}</span>
                  </div>
                  <div class="line">
                    <span class="director">导演:{{movie.director}}.年份:{{movie.year}}</span>
                  </div>
                </div>
            </li>
            <loading v-show="search_hasMore"></loading>
        </ul>
    </scroll>
    <router-view></router-view>
  </div>
</transition>
</template>

<script>
import {getMovies,searchMovies} from '../api/movie'
import {createMovie} from '../common/js/movie'
import Scroll from '../base/scroll'
import SearchBox from '../base/searchBox'
import Loading from '../base/loading/loading'
import { mapMutations} from 'vuex'
export default {
  data(){
    return {
      movies:[],
      show_page:1,
      search_page:1,
      show_hasMore:true,
      search_hasMore:true,
      showFlag:false,//显示top250页面/搜索结果页面
      searchList:[],
      query:'',
      showLoading:true//是否可以再次发送get请求(当前get请求已经响应完毕)
    }
  },
  created(){
    this.loadMore=true
    getMovies(this.show_page).then(res=>{
      console.log(res)
      this.show_page+=10
      if(res.total<=this.show_page){
        this.show_hasMore=false
      }
      res.subjects.forEach((item)=>{
        this.movies.push(createMovie(item))
      })
      console.log(this.movies)
    })
    /*
    searchMovies('后',0).then(res=>{
      console.log(res)
    })
    */
    //3026572
    /*
    getMovieDetail(3026572).then(res=>{
      console.log(res)
      console.log(createMovie(res))
    })
    */
  },
  activated(){
    this.setFullScreen(false)
  },
  methods:{
    onQueryChange(query){
      this.loadMore=true
      this.query = query.trim()
      if(this.query){
          this.showFlag=true
      }else{
          this.showFlag=false
      }
    },
    back(){
      this.$refs.box.clear()
      this.showFlag=false
    },
    selectItem(item,event){
      if(!event._constructed){
          return
      }
      this.$router.push({
          path: `/movies/${item.id}`,
          //路由附带参数...?id=xx，必须写在query属性里
          query: {id:item.id}
      })
    },
    searchMore(){
      if(!this.showFlag){
        if(!this.show_hasMore||!this.loadMore){
            return
        }else{
          this.loadMore=false
          getMovies(this.show_page).then(res=>{
            this.loadMore=true
            this.show_page+=10
            if(res.total<=this.show_page){
              this.show_hasMore=false
            }
            res.subjects.forEach((item)=>{
              this.movies.push(createMovie(item))
            })
          })
        }
      }else{
        if(!this.search_hasMore||!this.loadMore){
            return
        }else{
          this.loadMore=false
          this._searchMovies()
        }
      }
    },
    ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN'
    }),
    _searchMovies(){
      searchMovies(this.query,this.search_page).then(res=>{
        this.loadMore=true
        this.search_page+=10
        if(res.total<=this.search_page){
          this.search_hasMore=false
        }
        res.subjects.forEach((item)=>{
          this.searchList.push(createMovie(item))
        })
      })
    }
  },
  components:{
    Scroll,
    SearchBox,
    Loading
  },
  watch:{
      query(val){
          this.searchList=[]
          this.search_page=1
          //this.search(val,this.search_page)
          this.search_hasMore=true
          if(val){
            this.loadMore=false
            this._searchMovies()
          }
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped style lang="stylus" rel="stylesheet/stylus">
@import "../common/stylus/variable"
@import "../common/stylus/mixin"
.movie-list
    position fixed
    top 0
    left 0
    right 0
    bottom 50px
    background #fff
    font-size $font-size-medium
    &.movie-enter-active, &.movie-leave-active
        transition all 0.5s
    &.movie-enter, &.movie-leave-to
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
        top 60px
        left 0
        right 0
        bottom 50px
        overflow hidden
        &.search-content
          background #fff
        .movie
            height 90px
            border-1px(#ccc)
            padding-left 30px
            text-align left
            display flex
            color #666
            .image
                margin-top 5px
                height 80px
                border 1px solid #333
                border-radius 5px
            .info
                flex 1
                padding 10px 0 10px 20px
                .line
                  display flex
                  padding-top 5px
                  .name
                    flex 1
                    height 40px
                    line-height 40px
                    font-size $font-size-medium-x
                    text-hidden-dot()
                  .average
                    flex 0 0 50px
                    padding-right 20px
                    height 40px
                    line-height 40px
                    font-size $font-size-small-s
                  .director
                    height 20px
                    line-height 20px
                    font-size $font-size-small
</style>
