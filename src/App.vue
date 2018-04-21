<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
    <div class="tab">
        <div class="tab-item"><router-link to='/notes' alt='日记'><i class="icon-office icon"></i></router-link></div>
        <div class="tab-item"><router-link to='/books' alt='读物'><i class="icon-map2 icon"></i></router-link></div>
        <div class="tab-item"><router-link to='/musics' alt='音乐'><i class="icon-music icon"></i></router-link></div>
        <div class="tab-item"><router-link to='/movies' alt='电影'><i class="icon-video-camera icon"></i></router-link></div>
    </div>
  </div>
</template>

<script>
import Player from './components/player'
export default {
  
  components:{
      Player
    }
}
</script>

<style style lang="stylus" rel="stylesheet/stylus">
  .tab
      display flex
      width 100%
      height 50px
      line-height 50px
      position fixed
      left 0
      bottom 0
      border-top 1px solid #aaa
      background-color #eee
      .tab-item
        flex 1
        text-align center
        font-size 20px
        .icon
          color #000
</style>
