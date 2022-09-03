<template>
  <v-app>
    <v-app-bar app color="#11B980" dark> </v-app-bar>
    <v-main class="my-14 mx-auto main-content">
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  })
};
</script>
<style scoped>
.main-content {
  width: 1064px;
}
</style>
