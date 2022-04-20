<template>
  <div class="search">
    <SearchIcon class="icon" />
    <input
      v-model="search"
      class="input"
      placeholder="Поиск"
      type="text"
      @input="$emit('input', search)"
    >
  </div>
</template>

<script>
import SearchIcon from '@/components/icons/SearchIcon.vue';

export default {
  name: 'Search',

  components: {
    SearchIcon,
  },

  data() {
    return {
      search: '',
    };
  },
};
</script>

<style lang="scss" scoped>
.search {
  background: #FFFFFF;
  border-radius: 200px;
  padding: 17px 0;
  display: flex;
  align-items: center;
  min-width: 210px;

  .input {
    border: none;
    outline: none;
    font-size: 17px;
    width: 100%;
    margin-left: 10px;
    margin-right: 10px;
    font-weight: 600;
  }

  .icon {
    width: 24px;
    margin-left: 20px;
  }
}
</style>
