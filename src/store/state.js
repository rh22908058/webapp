import {loadFavorite} from '../common/js/cache'
const state = {
  playing: false,
  fullScreen: false,
  playlist: [],
  currentIndex: -1,
  favoriteList: loadFavorite(),
  //notes的content数组，作为同城数据的浏览历史数据
  noteContentList:[]
}

export default state