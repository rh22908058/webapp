<template>
  <div class="wrapper">
    <div class="bar" ref="bar" @click.stop="progressClick($event)">
        <div class="progress" ref="progress"></div>
        <div class="btn-wrapper" ref="btn"
            @touchstart.prevent="progressTouchStart"
            @touchmove.prevent="progressTouchMove"
            @touchend="progressTouchEnd"
        >
            <div class="progress-btn"></div>
        </div>
    </div>
  </div>
</template>

<script>
import {prefixStyle} from '../common/js/util'
const transform = prefixStyle('transform')
const progressBtnWidth = 8
export default {
    data(){
        return {
        }
    },
    props:{
        percent: {
            type: Number,
            default: 0
        }
    },
    components:{

    },
    created(){
        this.touch = {}
    },
    methods:{
        percentChange(val){
            let wholeWidth=this.$refs.bar.clientWidth
            let width=wholeWidth*val|0
            this.$refs.progress.style.width=`${width}px`
            this.$refs.btn.style[transform]=`translate3d(${width}px,0,0)`
        },
        progressTouchStart(e) {
            this.touch.initiated = true
            this.touch.startX = e.touches[0].pageX
            this.touch.left = this.$refs.progress.clientWidth
        },
        progressTouchMove(e) {
            if (!this.touch.initiated) {
            return
            }
            const deltaX = e.touches[0].pageX - this.touch.startX
            const offsetWidth = Math.min(this.$refs.bar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
            this._offset(offsetWidth)
        },
        progressTouchEnd() {
            this.touch.initiated = false
            this._triggerPercent()
        },
        progressClick(e) {
            const rect = this.$refs.bar.getBoundingClientRect()
            const offsetWidth = e.pageX - rect.left
            this._offset(offsetWidth)
            this._triggerPercent()
        },
        _triggerPercent() {
            const barWidth = this.$refs.bar.clientWidth - progressBtnWidth
            const percent = this.$refs.progress.clientWidth / barWidth
            console.log('percentChange')
            console.log(percent)
            this.$emit('percentChange', percent)
        },
        _offset(offsetWidth) {
            this.$refs.progress.style.width = `${offsetWidth}px`
            this.$refs.btn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        }
    },
    computed:{

    },
    watch:{
        percent(val){
            this.percentChange(val)
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped style lang="stylus" rel="stylesheet/stylus">
@import "../common/stylus/variable"
.wrapper
    height 20px
    .bar
        position relative
        top 8px
        left 0
        height 4px
        background: rgba(0, 0, 0, 0.3)
        .progress
            height 100%
            width 0
            background: $color-theme
        .btn-wrapper
            position: absolute
            left: -10px
            top: -8px
            width: 20px
            height: 20px
            .progress-btn
                position: relative
                top: 6px
                left: 6px
                box-sizing: border-box
                width: 8px
                height: 8px
                border: 1px solid $color-text
                border-radius: 50%
                background: $color-theme
</style>
