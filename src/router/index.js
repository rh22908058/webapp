import Vue from 'vue'
import Router from 'vue-router'
import Notes from '@/components/noteList'
import Books from '@/components/bookList'
import Musics from '@/components/musicList'
import Movies from '@/components/movieList'
import Note from '@/components/note'
import Book from '@/components/book'
import Movie from '@/components/movie'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/notes'
    },
    {
      path: '/notes',
      name: 'Notes',
      component: Notes,
      children:[
        {
          path:':id',
          component:Note
        }
      ]
    },
    {
      path: '/books',
      name: 'Books',
      component: Books,
      children: [
        {
          path: ':id',
          component: Book
        }
      ]
    },
    {
      path: '/musics',
      name: 'Musics',
      component: Musics
    },
    {
      path: '/movies',
      name: 'Movies',
      component: Movies,
      children: [
        {
          path: ':id',
          component: Movie
        }
      ]
    }
  ]
})
