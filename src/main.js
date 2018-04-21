// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//全局引入样式文件
import './common/stylus/index.styl'
//全局注册下拉加载插件
import infiniteScroll from 'vue-infinite-scroll'
import VueLazyload from 'vue-lazyload'
import store from './store'

Vue.use(infiniteScroll)
Vue.use(VueLazyload, {
  /*
  error: 'dist/error.png',//这个是请求失败后显示的图片
  loading: 'dist/loading.gif',//这个是加载的loading过渡效果
  try: 2 // 这个是加载图片数量
  */
  loading: require('./base/loading/pic_loading.png')
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
