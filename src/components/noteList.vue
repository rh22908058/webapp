<template>
  <div class="notes">
    <scroll ref="scroll" class="note-wrapper" :data="notes" :pullup="pullup" :listenScroll="listenScroll" @scrollToEnd="loadMore">
        <ul class="note-content">
            <li v-for="(item,index) in notes" class="item" @click="selectItem(item)">
                <!--如果不事先指定图片高度，图片还未加载完毕时bs就已经计算了滚动区的高度，这个高度是错误的，造成不能滚动到最后的现象-->
                <div class="pic-wrapper">
                    <!--图片尺寸176*262-->
                    <img height="262" v-lazy="item.image" class="pic">
                </div>
                <!--
                <div class="content" v-html="item.content"></div>
                -->
                <div class="content" v-html="item.category_name"></div>
                <div class="padding" v-html="item.begin_time"></div>
                <div class="padding" v-html="item.end_time"></div>
                <div class="padding" v-html="item.fee_str"></div>
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
                path: `/notes/${item.id}`
            })
            this.setNoteContent(item.content)
        },
        ...mapMutations({
            setNoteContent: 'SET_NOTE_CONTENT'
        })
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped style lang="stylus" rel="stylesheet/stylus">
    @import "../common/stylus/variable"
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
                padding 0 0 15px 0       
                .pic-wrapper
                    width 175px
                    height 260px
                    margin 10px auto
                .content
                    padding 10px 0 0 20px
                    font-size $font-size-large
                .padding
                    text-align right
                    padding 10px 20px 0 0
</style>
