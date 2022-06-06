<template>
  <router-link :to="`/task/${task.id}`" class="item">
    <p class="date mark" :class="className">{{ formattedDate }}</p>
    <p class="mark">
      <Mark :value="task.mark || '-'"
      :task="task"/>
    </p>
  </router-link>
</template>

<script>
import Mark from '@/components/Mark.vue';
import { getMarkClassName } from '@/helpers/getMarkClassName';
import { format } from 'date-fns';

export default {
  name: 'CalendarItem',

  components: {
    Mark,
  },

  props: {
    task: {
      type: Object,
      required: true,
    },
  },

  computed: {
    className() {
      console.log('this.task', this.task);
      return getMarkClassName(this.task);
    },

    formattedDate() {
      return format(new Date(this.task.dateStart), 'd.MM');
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  text-align: center;
}
</style>
