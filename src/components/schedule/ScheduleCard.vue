<template>
  <div v-if="timesheet.lessons.length" class="card">
    <div class="card__header">
      <p class="day">{{ timesheet.day }}</p>
      <!--      <p class="date">27.04.21</p>-->
    </div>
    <div class="schedule">
      <div v-for="(lesson, index) in  filteredLessons" :key="index" class="schedule__item">
        <p class="time">{{ lesson.time }}</p>

        <p v-if="lesson.className" class="lesson-name">
          {{ lesson.className }}
        </p>
        <p class="lesson-name">
          {{ lesson.lessonName }}
        </p>

        <router-link
          v-if="$store.state.user.user.role === 'teacher'"
          :to="`/teacher/video/${getRoomNumber(lesson)}`"
          class="connect-button"
          :class="{'connect-button--active': isActive(lesson)}"
        >
          Подключиться
        </router-link>

        <router-link
          v-else
          :to="`/video/${getRoomNumber(lesson)}`"
          class="connect-button"
          :class="{'connect-button--active': isActive(lesson)}"
        >
          Подключиться
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import sha256 from 'crypto-js/sha256';

export default {
  name: 'ScheduleCard',

  props: {
    timesheet: {
      type: Object,
      required: true,
    },
  },
  computed: {
    filteredLessons() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.timesheet.lessons.sort((a, b) => {
        const hourA = a.time.split(':')[0];
        const hourB = b.time.split(':')[0];
        const minuteA = a.time.split(':')[1];
        const minuteB = b.time.split(':')[1];
        const timeA = hourA * 60 + minuteA;
        const timeB = hourB * 60 + minuteB;
        return timeA - timeB;
      });
    },
  },
  methods: {
    isActive(lesson) {
      const date = new Date(Date.now());
      const dayOfWeek = date.toLocaleString('ru', { weekday: 'long' });
      if (lesson.day.toLowerCase() === dayOfWeek.toLowerCase()) {
        const hour = lesson.time.split(':')[0];
        const minutes = lesson.time.split(':')[1];
        const totalMinutes = Number(hour) * 60 + Number(minutes);

        const currentHour = date.getHours();
        const currentMinutes = date.getMinutes();
        const currentTotalMinutes = Number(currentHour) * 60 + Number(currentMinutes);

        const diff = totalMinutes - currentTotalMinutes;

        if (diff > -10 && diff < 10) {
          return true;
        }
      }

      return false;
    },

    getRoomNumber(lesson) {
      const hash = sha256(lesson.day + lesson.time + lesson.idLesson);
      return hash.toString();
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  background-color: #fff;
  box-shadow: 0 0 4px 4px rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  padding: 20px;
  font-size: 27px;
  max-width: 1000px;

  .card__header {
    text-align: center;
    border-bottom: 1px solid #1F73EF;
    margin: 0 50px;
  }

  .schedule {
    padding: 0 40px;

    .schedule__item {
      margin-top: 15px;
      display: flex;

      @media (max-width: 1200px) {
        flex-direction: column;
        align-items: center;
        padding-bottom: 10px;
        border-bottom: 1px solid #d8dde1;

        .lesson-name,
        .connect-button {
          margin-left: 0 !important;
        }

        .connect-button {
          margin-top: 10px;
        }
      }

      .time {
      }

      .lesson-name {
        margin-left: 40px;
      }

      .connect-button {
        margin-left: auto;
        background: #C4C4C4;
        border-radius: 15px;
        color: white;
        padding: 2px 10px;
        font-size: 25px;

        &--active {
          background: #ED7D2B;
        }
      }
    }
  }
}
</style>
