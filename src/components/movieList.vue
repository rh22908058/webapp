<template>
  <div class="">
      电影
  </div>
</template>

<script>
import {getMovies} from '../api/movie'
export default {
  created(){
    getMovies(1).then(res=>{
      console.log(res)
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
