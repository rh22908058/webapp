<template>
  <transition name="slide">
    <div class="note">
      <div class="back" @click="back">
        <i class="icon-arrow_lift"></i>
      </div>
      <scroll class="content-wrapper" :data="noteArr">
        <div class="content" v-html="noteContent"></div>
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
          noteContent:"",
          noteArr:[]
      }
  },
  created(){
    //获取vuex同城内容数组的最后一个元素(就是当前notelist页面点击的note内容)
    this.noteContent=this.noteContentList[this.noteContentList.length-1]
    this.noteArr.push(this.noteContent)
  },
  computed:{
    ...mapGetters([
      'noteContentList'
    ])
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
    background $color-background
    color $color-theme
    .content-wrapper
      height 100%
      .content
        padding 20px 20px 0 20px
        line-height 1.5
    .back
      margin-left 10px
      padding 10px 10px 10px 10px
      position absolute
      top 8px
      left 0
      border-radius 50%
      background-color #999
      opacity 0.5
      z-index 50
      .icon-arrow_lift
        font-size 14px
        color #000
</style>
