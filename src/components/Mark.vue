<template>
  <span
    class="mark"
    :class="className"
  >{{ value }}</span>
</template>

<script>
import { getMarkClassName } from '@/helpers/getMarkClassName';

export default {
  name: 'Mark',

  props: {
    value: {
      type: [String, Number],
      default: 0,
    },
    task: {
      type: Object,
      required: true,
    },
  },

  computed: {
    className() {
      return getMarkClassName(this.task);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
