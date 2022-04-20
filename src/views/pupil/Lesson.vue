<template>
  <transition name="fade">
    <main v-if="lesson">
      <div class="lesson">
        <div
          class="lesson__header"
          :style="{'background-image': lessonImage}">
        </div>
        <div class="lesson__name">
          {{ lesson.name }}
        </div>
        <div v-if="tasks && tasks.length" class="lessons__body">
          <HomeworkListCard
            v-for="task in tasks"
            :key="task.id"
            :task="task"
            class="homework-card"
          />
        </div>
        <NoResults
          v-else
          text="Заданий пока нет"
        />
      </div>
    </main>
  </transition>
</template>

<script>
import DefaultLessonImage from '@/assets/images/lesson-image.png';
import HomeworkListCard from '@/components/pupil/lesson/HomeworkListCard.vue';
import Pupil from '@/api/pupil';
import NoResults from '@/components/NoResults.vue';

export default {
  name: 'Lesson',

  components: {
    HomeworkListCard,
    NoResults,
  },

  data() {
    return {
      lesson: null,
      tasks: null,
    };
  },

  computed: {
    lessonImage() {
      let image;
      if (this.lesson.image) {
        image = process.env.VUE_APP_ROOT_SERVER + this.lesson.image;
      } else {
        image = DefaultLessonImage;
      }

      return `url(${image})`;
    },
  },

  created() {
    this.getLesson();
    this.getTasks();
  },

  methods: {
    async getLesson() {
      const lessonId = this.$route.params.id;
      const response = await Pupil.getLesson(lessonId);
      this.lesson = response.data;
    },

    async getTasks() {
      const lessonId = this.$route.params.id;
      const response = await Pupil.getTasks(lessonId);
      this.tasks = response.data;
    },
  },
};
</script>

<style lang="scss" scoped>
main {
  display: flex;
  justify-content: center;
}

.lesson {
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 25px;
  max-width: 1200px;
  padding: 0 0 20px;
  margin-right: 20px;
  width: 100%;

  .lesson__header {
    height: 160px;
    width: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-color: #629CF2;
  }

  .lesson__name {
    text-align: center;
    font-size: 35px;
    margin: 20px;
  }

  .lessons__body {
    padding: 0 80px;

    @media (max-width: 750px) {
      padding: 0 5px;
    }

    .homework-card::v-deep {
      margin-top: 10px;

      .mark {
        @media (max-width: 750px) {
          display: none;
        }
      }
    }
  }
}
</style>
