const url = "http://www.omdbapi.com/?apikey=e2cc9a6&"

function createRequest(url) {
  let requestOptions = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  }
  return new Request(url, requestOptions)
}

function fetchPromise(request) {
  return new Promise((resolve, reject) => {
    fetch(request)
      .then((response) => {
        if (response.status === 200 || response.status === 400) {
          response.json().then((responseJson) => {
            resolve(responseJson)
          })
        } else if (response.status === 408) {
          reject('networkError')
        } else {
          reject('serverError')
        }
      })
      .catch(() => {
        reject('serverError')
      })
  })
}

export function searchMovie(title){
  return new Promise((resolve, _) => {
    let request = createRequest(url + "s=" + title)
    resolve(fetchPromise(request))
  })
}

export function getMovieById(id){
  return new Promise((resolve, _) => {
    let request = createRequest(url + "i=" + id)
    resolve(fetchPromise(request))
  })
}