<template>
  <div class="header">
      <div class="item" @click="leftClick"><i class="icon-search"></i></div>
      <div class="item" @click="rightClick"><i class="icon-user"></i></div>
  </div>
</template>

<script>
export default {
    methods:{
        leftClick(){
            this.$emit('left')
        },
        rightClick(){
            this.$emit('right')
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped  style lang="stylus" rel="stylesheet/stylus">
.header
    position fixed
    top 0
    display flex
    width 100%
    height 50px
    line-height 50px
    justify-content space-between
    background-color #eee
    .item
        width 50px
        text-align center
        font-size 18px
        cursor pointer

</style>
