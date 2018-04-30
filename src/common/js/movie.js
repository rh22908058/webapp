
export default class Movie {
  constructor({id, directors, title, year, images, rating, ratings_count, summary,genres}) {
    this.id = id
    this.director = directors[0]&&directors[0].name
    this.name = title
    this.year = year
    this.image_medium = images.medium
    this.image_small = images.small
    this.average = rating.average
    this.stars=rating.stars
    this.ratings_count=ratings_count
    this.summary=summary
    this.genres=this.formatArr(genres)
  }
  formatArr(arr){
      if(arr.length===0){
          return ''
      }
      return arr.join('/')
  }
}
export function createMovie(movieData) {
  return new Movie({
    id : movieData.id,
    directors : movieData.directors||[],
    title : movieData.title||movieData.original_title,
    year : movieData.year,
    images : movieData.images,
    rating : movieData.rating,
    ratings_count : movieData.ratings_count,
    summary : movieData.summary,
    genres : movieData.genres
  })
}

