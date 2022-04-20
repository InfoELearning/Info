<template>
  <transition name="fade">
    <main>
      <div v-if="lesson" class="lesson">
        <LessonHeader :lesson="lesson"/>
        <div v-if="pupils" class="lessons__body">
          <UserCard
            v-for="user in pupils"
            :key="user.id"
            :user="user"
            class="homework-card"
          />
        </div>
      </div>
    </main>
  </transition>
</template>

<script>
import LessonHeader from '@/views/teacher/LessonHeader.vue';
import UserCard from '@/components/teacher/task/UserCard.vue';
import Pupil from '@/api/pupil';
import Teacher from '@/api/teacher';

export default {
  name: 'Tasks',
  components: {
    LessonHeader,
    UserCard,
  },

  data() {
    return {
      lesson: null,
      pupils: [],
    };
  },

  async created() {
    await this.getLesson();
    await this.getPupils();
  },
  methods: {
    async getLesson() {
      const lessonId = this.$route.params.id;
      const response = await Pupil.getLesson(lessonId);
      this.lesson = response.data;
    },
    async getPupils() {
      const response = await Teacher.getPupils(this.lesson.idSchool, this.lesson.idClass);
      this.pupils = response.data;
    },
  },
};
</script>

<style lang="scss" scoped>
.lesson {
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 25px;
  max-width: 1200px;
  padding: 0 0 20px;
  margin-right: 20px;
  width: 100%;

  .lessons__body {
    margin-top: 40px;
    padding: 0 40px;

    @media (max-width: 750px) {
      padding: 0 5px;
    }

    .homework-card::v-deep {
      margin-top: 10px;
    }
  }
}

.task__filters {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 20px;
  flex-wrap: wrap;

  .task__filters-item {
    height: 120px;
    width: 120px;
    font-size: 17px;
    background: #1F73EF;
    box-shadow: 0px 6px 10px rgba(31, 115, 239, 0.14);
    border-radius: 15px;
    color: #FFFFFF;
    display: flex;
    //justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 10px;

    &.disabled {
      background: linear-gradient(
          0deg, rgba(142, 196, 245, 0.5), rgba(142, 196, 245, 0.5)), #bcd8f3;
    }

    .filters-item__title {
      flex: 1.5;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .filters-item__icon {
      flex: 1;
    }

    .filters-item__count {
      flex: 1;
      font-size: 20px;
      font-weight: bold;
    }
  }
}
.main{
  display: flex;
  justify-content: center;
}
</style>
