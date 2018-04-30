
export default class Book {
  constructor({id, author, title, pubdate, images, rating, summary}) {
    this.id = id
    this.author = author[0]
    this.name = title
    this.pubdate = pubdate
    this.image_medium = images.medium
    this.image_small = images.small
    this.average = rating.average
    this.summary=summary
  }
}
export function createBook(bookData) {
  return new Book({
    id : bookData.id,
    author : bookData.author||[],
    title : bookData.title||bookData.original_title,
    pubdate : bookData.pubdate,
    images : bookData.images,
    rating : bookData.rating,
    summary : bookData.summary
  })
}

