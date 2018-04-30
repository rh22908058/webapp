<template>
  <transition name="slide">
    <div class="book">
      <div class="back" @click="back">
        <i class="icon-circle-left"></i>
      </div>
      <scroll class="content-wrapper" :data="[book]">
        <div class="content">
          <div class="image">
            <img class="pic" width="270" :src="book.image_medium">
            <span class="name">{{book.title}}</span>
            <span class="info">出版年份:{{book.pubdate}}</span>
            <span class="info">评分:{{book.average}}</span>
          </div>
          <div class="text">{{book.summary}}</div>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import Scroll from '../base/scroll'
export default {
  data(){
      return {
          book:{}
      }
  },
  created(){
    this.book=this.$route.query.item
    console.log(this.book)
  },
  methods:{
    back() {
      this.$router.back()
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
  .book
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
