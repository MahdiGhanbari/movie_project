<template>
  <div class="home">
    <v-sheet
      color="grey lighten-2"
      rounded="lg"
      class="d-flex justify-space-around align-center pa-4"
      height="85"
    >
      <v-menu offset-y nudge-bottom="8" :close-on-content-click="false">
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            :value="dateRangeText"
            readonly
            label="Search by release date"
            solo
            outlined
            v-on="on"
            v-bind="attrs"
            append-icon="mdi-calendar"
            dense
            hide-details
            background-color="white"
            class="flex-grow-0"
          ></v-text-field>
        </template>
        <v-date-picker v-model="dateRange" range/>
      </v-menu>
      <v-btn color="#549DF2" rounded class="text-capitalize white--text" @click="search" :loading="loading" :disabled="loading">search</v-btn>
    </v-sheet>
    <v-row class="my-14">
      <v-col cols="4" v-for="(item, index) in list" :key="index">
        <movie-card :movie="item" :loading="loading" width="320" height="211" />
      </v-col>
    </v-row>
    <pagination v-model="page" @input="search" :totalPages="totalPages" :totalItems="totalItems" />
  </div>
</template>

<script>
import MovieCard from '@/components/MovieCard'
import Pagination from '@/components/Pagination.vue'

export default {
  name: 'Home',
  data() {
    return {
      dateRange: [],
      list: new Array(20).fill({}),
      show: false,
      page: 1,
      totalPages: 0,
      totalItems: 0,
      loading: false
    }
  },
  methods: {
    async search() {
      this.loading = true
      this.updateQueryString()
      const res = await this.$db.getListOfMovies(this.dateRange, this.page)
      if(res) {
        const {results, total_pages, total_results} = res
        this.list = results
        this.totalPages = total_pages
        this.totalItems = total_results
      }
      this.loading = false
    },
    updateQueryString() {
      let {page, range} = this.getQueryString()
      if(this.page != page || this.dateRange.toString() != range.toString()) {
        const query = {page: this.page}
        if(this.dateRangeText) {
          query['range'] = this.dateRangeText
        }
        this.$router.replace({path: '/', query})
      }
    },
    getQueryString() {
      let {page, range} = this.$route.query
      page = +page > 0 ? +page : 1
      range = decodeURI(range || '')
      const [start, end] = range.split(' ~ ')
      if(Date.parse(start) && Date.parse(end)) {
        range = [start, end]
      } else {
        range = []
      }
      return {page, range}
    }
  },
  computed: {
    dateRangeText () {
      return this.dateRange.join(' ~ ')
    }
  },
  components: {
    MovieCard,
    Pagination
  },
  beforeMount() {
    let {page, range} = this.getQueryString()
    this.page = page
    this.dateRange = range
    this.search()
  }
}
</script>
