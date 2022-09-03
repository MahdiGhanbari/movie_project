<template>
  <div>
    <v-sheet color="grey lighten-2" rounded="lg" class="d-flex flex-row pa-4 align-center" height="85">
      <v-btn @click="$router.go(-1)" color="#549DF2" rounded class="text-capitalize white--text">
        <v-icon left>mdi-arrow-left</v-icon>
        back
      </v-btn>
      <div class="ml-14">
        <template v-if="detail">
          <h3>{{detail.title}}</h3>
          <div>{{detail.tagline}}</div>
        </template>
        <v-skeleton-loader v-else min-width="300"  type="sentences"/>
      </div>
    </v-sheet>
    <div class="mt-14">
      <div class="d-flex">
        <v-img
          v-if="detail"
          :src="`https://image.tmdb.org/t/p/w342/${detail.poster_path}`" 
          max-width="342"
          width="342"
          height="400"
          class="rounded-lg grey lighten-4"
        />
        <v-skeleton-loader v-else width="330" height="400"  type="image@2"/>
        <div class="flex-grow-1 ml-16 mr-4">
          <div class="d-flex justify-space-between align-center mt-3" v-for="(name, key) in fields" :key="key">
            <template v-if="detail">
              <div class="font-weight-bold text-capitalize">{{name}}</div>
              <div  class="body-2" v-html="getValue(key)"></div>
            </template>
            <template v-else>
              <v-skeleton-loader min-width="80" type="text"/>
              <v-skeleton-loader min-width="100" type="text"/>
            </template>
          </div>
        </div>
      </div>
      <div class="mt-16">
        <template v-if="detail">
          {{detail.overview}}
        </template>
        <v-skeleton-loader v-else type="paragraph"/>
      </div>
      <div class="mt-16">
        <div class="font-weight-bold mb-2">Credit:</div>
        <div>
          <template v-for="cast in casts.slice(0, lengthOfCasts) || lengthOfCasts" >
            <span v-if="casts" class="body-2 cast-name" :key="cast">{{cast}}</span>
            <v-skeleton-loader v-else type="text" min-width="80" :key="cast" tag="div" class="d-inline-block mr-1"/>
          </template>
          <v-btn 
            v-if="casts.length > lengthOfCasts"
            color="primary"
            text
            tag="span"
            class="pa-0 cast-name text-lowercase body-2"
            :ripple="false"
            @click="lengthOfCasts = casts.length"
          > 
            and {{casts.length - lengthOfCasts}} more.
          </v-btn>
          <v-expand-transition>

          </v-expand-transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detail: null,
      casts: '',
      lengthOfCasts: 10,
      fields: {
        'budget': 'budget',
        'revenue': 'revenue',
        'release_date': 'release',
        'runtime': 'runtime',
        'vote_average': 'score',
        'genres': 'genres',
        'imdb_id': 'IMDB',
        'homepage': 'homepage'
      }
    }
  },
  methods: {
    getValue(key) {
      const value = this.detail[key]
      if(['budget', 'revenue'].includes(key)) {
        return Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
        .format(value)
      }
      if(key == 'vote_average') {
        return `${+value.toFixed(1)} (${this.detail.vote_count} votes)`
      }
      if(key == 'runtime') {
        const h = Math.floor(value / 60)
        const m = value % 60
        return `${h}h ${m}m`
      }
      if(key == 'genres') {
        return value.map(genre => genre.name).toString()
      }
      if(['homepage', 'imdb_id'].includes(key)) {
        const href = key == 'imdb_id' ? `https://www.imdb.com/title/${value}` : value
        return `<a href='${href}'>link</a>`
      }
      return value
    },
    async initCasts(movieId) {
      const res = await this.$db.getMovieCredits(movieId)
      if(res) {
        this.casts = res.cast
        .sort((a, b) => b.popularity - a.popularity)
        .map(cast => cast.name)
      }
    }
  },
  async mounted() {
    const {movieId} = this.$route.params
    if(movieId) {
      let res = await this.$db.getMovieDetail(movieId)
      if(res) this.detail = res
      this.initCasts(movieId)
    }
  }
}
</script>

<style>
.cast-name + .cast-name::before {
  content: ', ' !important;
}
</style>