<template>
  <transition name="slide">
    <div class="note">
      <div class="back" @click="back">
        <i class="icon-circle-left"></i>
      </div>
      <scroll class="content-wrapper" :data="[note]">
        <div class="content" v-html="note.content"></div>
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
          note:{}
      }
  },
  created(){
    this.note=this.$route.query.item
    //content中包含了图片标签<img>，无法用CSS规定宽度，这里将img标签去掉
    this.note.content=this.note.content.replace(/<img[^>]+>/ig,'')
  },
  methods:{
    back() {
      console.log('click')
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
  .note
    z-index 100
    position fixed
    top 35px
    bottom 40px
    overflow hidden
    width 100%
    background #fff
    color #333
    .content-wrapper
      height 100%
      padding-top 30px
      .content
        padding 20px 20px 0 20px
        line-height 1.5
        img
          width 200px
    .back
      margin-left 10px
      padding 10px 10px 10px 10px
      position absolute
      top 8px
      left 0
      border-radius 50%
      opacity 0.5
      z-index 50
      .icon-circle-left
        font-size 18px
        color #000
</style>
