<template>
  <div class="notes">
    <scroll ref="scroll" class="note-wrapper" :data="notes" :pullup="pullup" :listenScroll="listenScroll" @scrollToEnd="loadMore">
        <ul class="note-content">
            <li v-for="(item,index) in notes" class="item" @click="selectItem(item)">
                <img v-lazy="item.image" class="image">
                <div class="info">
                  <div class="line">
                    <span class="name">{{item.category_name}}</span>
                    <span class="average">{{formatMoney(item.fee_str)}}</span>
                  </div>
                  <div class="line">
                    <span class="director">时间:{{item.begin_time}}-{{item.end_time}}</span>
                  </div>
                </div>
            </li>
            <loading v-show="hasMore" title=""></loading>
        </ul>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
/*有时候npm安装组件报错无权限，加--no-optional即可，如npm install vue-infinite-scroll --save --no-optional*/
import axios from 'axios'
import {formatDate} from '../common/js/date'
import {getNotes} from '../api/notes'
import Scroll from '../base/scroll'
import {mapMutations} from 'vuex'
import Loading from '../base/loading/loading'
export default {
    data(){
        return {
            notes:[],
            currentIndex:null,
            pullup:true,
            listenScroll:true,
            hasMore:true
        }
    },
    components:{
        Scroll,
        Loading
    },
    created(){
        this.getData()
    },
    activated(){
        this.setFullScreen(false)
    },
    methods:{
        getData(){
            this.hasMore = true
            getNotes(this.notes.length).then((res)=>{
                if(res.count>0){
                    //数组解构添加，不可以用concat方法，会破坏data属性的set/get结构
                    this.notes=[...this.notes,...res.events]
                    this._checkMore(res)
                }else{
                    console.log('error')
                }
                console.log(this.notes)             
            })
        },
        loadMore() {
            if(this.hasMore){
                this.getData()
            }
        },
        //判断是否还有更多数据
        _checkMore(data){
            if(data.total<=data.count+data.start){
                this.hasMore=false
            }
        },
        selectItem(item){
            this.$router.push({
                path: `/notes/${item.id}`,
                query: {item}
            })
        },
        formatMoney(item){
            if(typeof item===Number){
                return `${item}元`
            }else{
                return item
            }
        },
        ...mapMutations({
            setFullScreen: 'SET_FULL_SCREEN'
        })
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped style lang="stylus" rel="stylesheet/stylus">
    @import "../common/stylus/variable"
    @import "../common/stylus/mixin"
    .notes
        position relative
        font-size 14px
        .note-wrapper
            position fixed
            top 35px
            bottom 40px
            overflow hidden
            width 100%
            .item
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
                            text-hidden-dot()
                        .director
                            height 20px
                            line-height 20px
                            font-size $font-size-small
</style>
