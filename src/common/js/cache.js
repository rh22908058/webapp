function insertArray(arr, val, compare) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function saveFavorite(song) {  
  let songs = JSON.parse(localStorage.getItem('favorite'))||[]
  insertArray(songs, song, (item) => {
    return song.hash === item.hash
  })
  localStorage.setItem('favorite', JSON.stringify(songs))
  return songs
}

export function deleteFavorite(song) {
  let songs = JSON.parse(localStorage.getItem('favorite'))||[]
  deleteFromArray(songs, (item) => {
    return item.hash === song.hash
  })
  localStorage.setItem('favorite', JSON.stringify(songs))
  return songs
}

export function loadFavorite() {
  return JSON.parse(localStorage.getItem('favorite'))||[]
}