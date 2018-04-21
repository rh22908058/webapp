<template>
  <div ref="wrapper">
    <slot ref="content"></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  const DIRECTION_H = 'horizontal'
  const DIRECTION_V = 'vertical'

  export default {
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      data: {
        type: Array,
        default: null
      },
      pullup: {
        type: Boolean,
        default: false
      },
      beforeScroll: {
        type: Boolean,
        default: false
      },
      refreshDelay: {
        type: Number,
        default: 20
      },
      direction: {
        type: String,
        default: DIRECTION_V
      }
    },
    mounted() {
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        //如果传入数据长度为0(也就是异步请求还没有完成没有数据时，则补进行初始化)
        //并且检测是否有scroll对象，确保只初始化一次
        if(!this.data){
            return
        }
        if(this.scroll){
            return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click,
          eventPassthrough: this.direction === DIRECTION_V ? DIRECTION_H : DIRECTION_V
        })
        console.log('初始数据长度:'+this.data.length)
        console.log('scrollinit')
        if (this.listenScroll) {
          this.scroll.on('scroll', (pos) => {
            this.$emit('scroll', pos)
          })
        }
        //如果要进行下拉加载，则监听每次滚动结束事件scrollEnd
        //在当前滚动位置进入最大滚动距离50px以内时，触发scrollEnd事件给父组件，在父组件中发送下一组数据的请求。
        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {
            if ((this.scroll.maxScrollY)&&(this.scroll.y <= (this.scroll.maxScrollY + 50))){
              this.$emit('scrollToEnd')
            }
          })
        }

        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll')
          })
        }
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    watch: {
      //数据参数发生改变时(发生在DOM初始化时data长度为0，异步请求完毕时data发生变化;下拉到底部需要加载更多数据，异步请求完毕时data发生变化)
      //第一种情况要初始化betterscroll，第二种情况要刷新betterscroll
      //这样可以确保betterscroll的初始化和刷新在异步请求完成后进行，可以正确计算滚动区高度实现滚动
      data() {
        setTimeout(() => {
          if(!this.scroll){
              this._initScroll()
          }else{
              this.refresh()
          }
        }, this.refreshDelay)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
