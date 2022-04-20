<template>
  <router-link :to="{query: {homework: task.id}}" class="card">
    <Avatar />
    <div class="info">
      <p class="description">{{ task.pupil.lastName }} {{task.pupil.firstName}}</p>
      <p class="date">{{ formattedDate }}</p>
<!--      <p class="warning">Пропущен срок сдачи</p>-->
    </div>
    <div class="status">
      <Mark class="mark outline" :value="task.mark || '-'"/>
    </div>
  </router-link>
</template>

<script>
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import Avatar from '@/components/Avatar.vue';
import Mark from '@/components/Mark.vue';

export default {
  name: 'TaskCard',

  components: {
    Avatar,
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
      if (this.task.date) {
        return format(new Date(this.task.date), 'd MMMM', { locale: ru });
      }
      return '';
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
      margin-top: 10px;
      color: #6B6262;
    }

    .warning {
      font-size: 20px;
      color: orange;
    }
  }

  .status {
    margin-left: auto;

    .mark {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 25px;
      height: 75px;
      width: 75px;
      border-radius: 50%;
    }
  }
}
</style>
