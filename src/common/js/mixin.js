import {mapGetters} from 'vuex'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist',
      'fullScreen',
      'currentSong' 
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}
export const favoritelistMixin = {
  computed: {
    ...mapGetters([
      'favoriteList',
      'fullScreen',
      'currentSong'    
    ])
  },
  mounted() {
    this.handleFavoritelist(this.favoriteList)
  },
  activated() {
    this.handleFavoritelist(this.favoriteList)
  },
  watch: {
    favoriteList(newVal) {
      this.handleFavoritelist(newVal)
    }
  },
  methods: {
    handleFavoritelist() {
      throw new Error('component must implement handleFavoritelist method')
    }
  }
}