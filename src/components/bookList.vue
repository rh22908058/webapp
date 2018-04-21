<template>
  <div class="">
      读物
  </div>
</template>

<script>
import {getBooks,getRecommands} from '../api/books'
export default {
  created(){
    getRecommands().then((res)=>{
      console.log(res)
    })
  },
  methods:{
    _getBooks(){

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
