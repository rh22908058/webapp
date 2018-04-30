<template>
  <transition name="slide">
    <div class="movie">
      <div class="back" @click="back">
        <i class="icon-circle-left"></i>
      </div>
      <scroll class="content-wrapper" :data="movie">
        <div class="content">
          <div class="image">
            <img class="pic" :src="movie.images.medium">
            <span class="name">{{movie.title||movie.original_title}}</span>
            <span class="info">年份:{{movie.year}}</span>
            <span class="info">评分:{{movie.rating.average}}</span>
            <span class="info">类型:{{type}}</span>
          </div>
          <div class="text">{{movie.summary}}</div>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import Scroll from '../base/scroll'
import {getMovieDetail} from '../api/movie'
export default {
  data(){
      return {
          movie:{}
      }
  },
  created(){
    getMovieDetail(this.$route.query.id).then(res=>{
      console.log(res)
      this.movie=res
    })
  },
  methods:{
    back() {
      this.$router.back()
    }
  },
  computed:{
    type(){
      let arr=this.movie.genres
      if(arr.length===0){
          return ''
      }
      return arr.join('/') 
    }
  },
  components:{
      Scroll
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../common/stylus/variable"
  .slide-enter-active, .slide-leave-active
    transition all 0.3s
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
  .movie
    position fixed
    top 0
    bottom 50px
    overflow hidden
    width 100%
    background #fff
    color #333
    .content-wrapper
      height 100%
      .content
        padding 20px 20px 0 20px
        line-height 1.5
        .image
          float left
          width 270px
          padding 30px 20px 0 0
          .name
            display block
            text-align center
            font-size $font-size-large
            padding 10px 0 10px 0
          .info
            padding-left 5px
    .back
      margin-left 10px
      padding 10px 10px 10px 10px
      position absolute
      top 8px
      left 0
      border-radius 50%
      opacity 0.5
      z-index 50
      .icon-arrow_lift
        font-size 14px
        color #000
</style>
