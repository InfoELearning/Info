<template>
  <transition name="fade">
    <main v-if="schedule">
      <div class="schedule">
        <div class="header">
          <div class="img-wrapper"
               :style="{backgroundImage: `url(${require(`@/assets/img/schedule-header.png`)})`}">
          </div>
        </div>
        <div v-if="schedule && schedule.length" class="body">
          <ScheduleCard
            v-for="(timesheet, index) in schedule"
            :key="index"
            :timesheet="timesheet"
            class="schedule-card"
          />
        </div>
        <div v-else class="body">
          <NoResults text="В расписании пока нет занятий"/>
        </div>
      </div>
    </main>
  </transition>
</template>

<script>
import Teacher from '@/api/teacher';
import ScheduleCard from '@/components/schedule/ScheduleCard.vue';
import NoResults from '@/components/NoResults.vue';

export default {
  name: 'Timetable',

  components: {
    ScheduleCard,
    NoResults,
  },

  data() {
    return {
      schedule: null,
    };
  },

  computed: {},

  watch: {},

  created() {
    this.getSchedule();
  },

  mounted() {
  },

  methods: {
    async getSchedule() {
      const response = await Teacher.getTimetable();
      this.schedule = response.data.filter((item) => item.lessons.length);
    },
  },
};
</script>

<style lang="scss" scoped>
.schedule {
  background: white;
  border-radius: 25px;
  min-height: 900px;
  overflow: hidden;
  max-width: 1200px;
}

.img-wrapper {
  width: 100%;
  height: 280px;
  background-size: contain;
  background: #629CF2 no-repeat center;
}

.body {
  padding: 0 70px 25px;

  @media (max-width: 750px) {
    padding: 0 25px 25px;
  }
}

.schedule-card {
  margin-top: 45px;
  min-width: 270px;
}
</style>
