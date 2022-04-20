<template>
  <router-link :to="`/teacher/task/${task.id}`" class="card">
    <div class="info">
      <p class="description">{{ task.name }}</p>
      <p class="date">Срок сдачи: {{ formattedDate }}</p>
    </div>
    <div class="edit-container">
      <p class="edit" @click.stop.prevent="$emit('selectTask')">
        <SmallEditIcon
          class="edit-button"
        />
      </p>
    </div>
  </router-link>
</template>

<script>
import SmallEditIcon from '@/components/icons/SmallEditIcon.vue';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default {
  name: 'HomeWorkCard',

  components: {
    SmallEditIcon,
  },

  props: {
    task: {
      type: Object,
    },
  },

  computed: {
    formattedDate() {
      return this.task.dateEnd
        ? format(new Date(this.task.dateEnd), 'd MMMM', { locale: ru })
        : '-';
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
  justify-content: space-between;
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
  }
}

.edit-container {
  margin-top: auto;
  .edit {
    cursor: pointer;
    font-size: 20px;
    color: #8A8580;

    .edit-button {
      padding: 2px;
    }
  }
}
</style>
