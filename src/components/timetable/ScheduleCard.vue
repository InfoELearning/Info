<template>
  <div class="schedule-card">
    <div class="header">
      <p class="title">{{ timesheet.dayOfWeek }}</p>
      <p class="date">{{ format(new Date(timesheet.date), 'dd.MM.yy') }}</p>
    </div>
    <div class="body">
      <div
          v-for="lesson in timesheet.lessons"
          :key="lesson.id"
          class="lesson"
      >
        <p class="time">{{ format(new Date(lesson.date), 'HH:mm') }}</p>
        <p class="name">{{ lesson.name }}</p>
        <router-link
            :to="`/video-room/${lesson.id}`"
            class="sign-in"
            :class="{'active': isLessonActive(lesson)}">
          Подключиться
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns';

export default {
  name: 'ScheduleCard',

  props: {
    timesheet: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {},

  watch: {},

  created() {
  },

  mounted() {
  },

  methods: {
    format,

    isLessonActive(lesson) {
      const minutesFromStart = (Date.now() - new Date(lesson.date).getTime()) / 1000 / 60;
      return (minutesFromStart >= 0) && (minutesFromStart <= 60);
    },
  },
};
</script>

<style scoped lang="scss">
.schedule-card {
  background: #FFFFFF;
  border: 0.5px solid #1F73EF;
  box-sizing: border-box;
  box-shadow: 0 4px 4px rgba(31, 115, 239, 0.25);
  border-radius: 25px;
  padding: 11px 50px;
}

.header {
  text-align: center;
  font-size: 27px;
  border-bottom: 1px solid #1F73EF;
}

.title {
  font-style: italic;
}

.body {
  margin-top: 27px;
}

.lesson {
  display: flex;
  align-items: center;
  margin-top: 15px;

  p {
    font-style: italic;
  }

  .name {
    margin-left: 50px;
  }

  .sign-in {
    background: #C4C4C4;
    border-radius: 15px;
    color: white;
    padding: 2px 6px;
    margin-left: auto;

    &.active {
      background: #ED7D2B;

      &:hover {
        background: #e8631a;
      }
    }

  }
}
</style>
