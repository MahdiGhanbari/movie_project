<template>
  <div>
    <div class="d-flex felx-column justify-center">
      <v-btn text color="primary" @click="change(-1)" :disabled="isFirstPage" class="text-capitalize" min-width="140">Previous Page</v-btn>
      <v-divider vertical/>
      <v-btn text color="primary" @click="change(+1)" :disabled="isLastPage" class="text-capitalize" min-width="140">Next Page</v-btn>
    </div>
    <div class="text-center text-caption text--secondary mt-2">Showing results {{showinResults}}</div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 1
    },
    totalPages: {
      type: Number,
      default: 0
    },
    totalItems: {
      type: Number,
      default: 0
    }
  },
  methods: {
    change(index) {
      this.$emit('input', this.value + index)
    }
  },
  computed: {
    isLastPage() {
      return this.totalPages <= this.value
    },
    isFirstPage() {
      return this.value <= 1
    },
    showinResults() {
      const perPage = 20
      let start = (this.value - 1) * perPage
      let end = this.isLastPage ? this.totalItems % perPage : start + perPage
      return  start + 1 + ' - ' + end
    }
  }
}
</script>