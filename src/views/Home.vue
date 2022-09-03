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
    <pagination v-model="page" :totalPages="totalPages" :totalItems="totalItems" />
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
      const query = {page : this.page || 1}
      if(this.dateRangeText) {
        query['range'] = this.dateRangeText
      }
      this.$router.push({path: '/', query})

      this.loading = true
      const res = await this.$db.getListOfMovies(this.dateRange, this.page)
      const {results, total_pages, total_results} = res
      this.list = results
      this.totalPages = total_pages
      this.totalItems = total_results
      this.loading = false
    }
  },
  computed: {
    dateRangeText () {
      return this.dateRange.join(' ~ ')
    }
  },
  watch: {
    page: 'search'
  },
  components: {
    MovieCard,
    Pagination
  },
  mounted() {
    const {page, range} = this.$route.query
    this.page = +page || 1
    this.dateRange = range ? range.split('~') : ''
    this.search()
  }
}
</script>
