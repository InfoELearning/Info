<template>
  <router-link :to="`/task/${task.id}`" class="card">
    <Mark class="mark outline" :value="task.homework.mark || '-'"/>
    <div class="info">
      <p class="description">{{ task.name }}</p>
      <p class="date">{{ formattedDate }}</p>
    </div>
  </router-link>
</template>

<script>
import Mark from '@/components/Mark.vue';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default {
  name: 'HomeWorkCard',

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
    formattedDate() {
      return format(new Date(this.task.dateEnd), 'd MMMM', { locale: ru });
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  border: 1px solid rgba(218, 220, 224, 0.8);
  border-radius: 15px;
  padding: 8px;
  min-height: 80px;
  display: flex;
  align-items: center;
  background-color: #fff;

  .mark {
    height: 70px;
    min-width: 70px;
    border-radius: 50%;
    font-size: 27px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .info {
    margin-left: 15px;

    p {
      font-size: 27px;
    }

    .description {
      font-size: 27px;
    }

    .date {
      font-size: 20px;
      color: #6B6262;
    }
  }
}
</style>
