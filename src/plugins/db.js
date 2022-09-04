import axios from 'axios'

const api_key = 'f62f750b70a8ef11dad44670cfb6aa57'

function httpResponseHandler(response) {
  if (response.data) {
    return Promise.resolve(response.data)
  }
  return Promise.resolve(false)
}

function httpErrorHandler(error) {
  console.log(error.code)
  // TODO: handle the errors
}

class DB {
  constructor(STORE, baseURL) {
    this.store = STORE
    this.api = axios.create({
      baseURL: baseURL,
      responseType: "json",
    })

    this.api.interceptors.response.use(
      res => httpResponseHandler(res),
      err => httpErrorHandler(err, this)
    )

    this.api.interceptors.request.use(request => {
      request.params = {...request.params, api_key}
      return request
    })

    // init genres
    this.updateGenres()
  }
  
  async updateGenres() {
    const res = await this.api.get('/genre/movie/list')
    if(res?.genres) {
      this.store.commit('SET_GENRES', res.genres)
    }
  }

  getListOfMovies(dateRange, page) {
    // TODO: validate params
    const params = {}
    if(dateRange?.length == 2) {
      params['release_date.gte'] = dateRange[0]
      params['release_date.lte'] = dateRange[1]
      params['with_release_type'] = 1
    }
    if(page > 0) {
      params['page'] = page
    }
    return this.api.get('/discover/movie', {params})
  }

  getMovieDetail(id) {
    return this.api('/movie/' + id)
  }

  getMovieCredits(id) {
    return this.api(`/movie/${id}/credits`)
  }
}

export default {
	install(vue, store) {
		vue.prototype.$db = new DB(store, 'https://api.themoviedb.org/3/')
	}
}