<template>
  <div class="card">
    <div class="card__header">
      <router-link
        :to="`/lessons/${lesson.id}`"
        class="subject-name">
        {{ lesson.name }}
      </router-link>
      <Mark v-if="averageMark" class="outline" :value="averageMark"/>
    </div>
    <div v-if="lesson.tasks && lesson.tasks.length" class="card__body">
      <CalendarItem
        v-for="task in lesson.tasks"
        :key="task.id"
        :task="task"
        class="card__item"
      />
    </div>
    <div v-else class="no-marks">
      Оценок пока нет
    </div>
  </div>
</template>

<script>
import Mark from '@/components/Mark.vue';
import CalendarItem from '@/components/journal/CalendarItem.vue';

export default {
  name: 'JournalCard',

  components: {
    Mark,
    CalendarItem,
  },

  props: {
    lesson: {
      type: Object,
      required: true,
    },
  },

  computed: {
    averageMark() {
      const marks = this.lesson.tasks.map((task) => task.mark).filter((mark) => mark !== null);
      if (marks.length === 0) {
        return null;
      }

      const average = marks.reduce((sum, mark) => sum + mark, 0) / marks.length;
      return parseFloat(average.toFixed(2));
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  width: 500px;
  background-color: #fff;
  padding: 35px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 25px;

  .card__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 27px;

    .subject-name {
      font-family: Roboto,serif;
      font-weight: 500;
    }
  }

  .card__body {
    display: grid;
    grid-template-columns: auto auto auto;

    .card__item {
      margin: 20px 25px;
      font-size: 27px;
    }
  }
}

.no-marks {
  margin-top: 10px;
  font-size: 18px;
}
</style>
