<template>
  <v-card
    class="mx-auto d-flex flex-row pa-1"
    color="grey lighten-4"
    :height="height"
    :width="width"
    :to="movie.id ? { name: 'Detail', params: { movieId: movie.id } } : null"
  >
    <div class="d-flex flex-grow-1">
      <v-img
        v-if="placeholder"
        :src="`https://image.tmdb.org/t/p/w154${movie.poster_path}`"
        max-width="128"
        min-width="128"
        class="white"
      />
      <v-skeleton-loader v-else min-width="128" type="image" />
      <div class="d-flex flex-column pa-2 flex-grow-1">
        <h4 v-if="placeholder">{{ movie.title }}</h4>
        <v-skeleton-loader v-else min-width="128" type="heading" />
        <v-spacer />
        <div v-if="placeholder" class="caption">
          <div class="mb-1">
            <v-icon size="18">mdi-calendar</v-icon>
            {{ movie.release_date }}
          </div>
          <v-chip v-for="id in movie.genre_ids" :key="id" x-small class="mr-1">
            {{$store.state.genres[id]}}
          </v-chip>
        </div>
        <v-skeleton-loader v-else min-width="128" type="paragraph" />
        <div v-if="placeholder" class="d-flex justify-space-between align-center mt-2">
          <v-rating
            color="warning"
            empty-icon="mdi-star-outline"
            full-icon="mdi-star"
            half-icon="mdi-star-half-full"
            half-increments
            dense
            length="5"
            size="16"
            :value="getRateValue(movie.vote_average)"
          />
          <div class="caption text--secondary">{{movie.vote_average}}</div>
        </div>
        <v-skeleton-loader v-else min-width="128" type="text" />
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  props: {
    movie: {
      type: Object,
      default: () => {}
    },
    loading: Boolean,
    width: {
      type: [String, Number],
      default: '295'
    },
    height: {
      type: [String, Number],
      default: '195'
    }
  },
  methods: {
    getRateValue(rate) {
      return (Math.ceil(rate) / 10) * 5
    }
  },
  computed: {
    placeholder() {
      return !this.loading && this.movie
    }
  }
}
</script>