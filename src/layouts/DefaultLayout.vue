<template>
  <div class="page">
    <Hamburger/>
    <router-view class="main"></router-view>
  </div>
</template>

<script>
import Hamburger from '@/components/Hamburger.vue';

export default {
  name: 'DefaultLayout',

  components: {
    Hamburger,
  },
};
</script>

<style lang="scss" scoped>
</style>
