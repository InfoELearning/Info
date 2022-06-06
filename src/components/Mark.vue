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
      required: false,
    },
  },

  computed: {
    className() {
      const value = this.task ? this.task : this.value;
      return getMarkClassName(value);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
