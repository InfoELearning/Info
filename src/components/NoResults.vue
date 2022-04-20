<template>
  <div class="no-results">
    {{ text }}
  </div>
</template>

<script>
export default {
  name: 'NoResults',

  props: {
    text: {
      type: String,
      default: 'Нет результатов',
    },
  },
};
</script>

<style scoped>
.no-results {
  text-align: center;
  padding: 20px;
  width: 100%;
  font-size: 25px;
}
</style>
