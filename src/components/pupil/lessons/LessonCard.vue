<template>
  <router-link :to="`/lessons/${lesson.id}`" class="card">
    <div
      class="card__header"
      :style="{'background-image': lessonImage}">
    </div>
    <div class="card__body">
      <div class="lesson-info">
        <p class="lesson-name">
          {{ lesson.name }}
        </p>
        <p class="teacher-name">
          {{ teacher.lastName }} {{ teacher.firstName }} {{ teacher.middleName }}
        </p>
      </div>
      <div class="teacher-avatar">
        <img
          class="avatar"
          src="@/assets/icons/user-avatar.svg"
          alt="Аватарка"
        >
      </div>
    </div>
  </router-link>
</template>

<script>
import DefaultLessonImage from '@/assets/images/lesson-image.png';

export default {
  name: 'LessonCard',

  props: {
    lesson: {
      type: Object,
    },
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

    teacher() {
      return this.lesson.teacher;
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  padding: 0;
  overflow: hidden;
  width: 500px;
  background-color: #fff;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 25px;

  .card__header {
    height: 120px;
    width: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-color: #629CF2;
  }

  .card__body {
    padding: 30px;
    display: flex;
    justify-content: space-between;

    .lesson-info {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      font-size: 27px;

      p {
        font-family: Roboto,serif;
      }

      .lesson-name {
        font-weight: 500;
      }

      .teacher-name {
        font-size: 23px
      }
    }

    .teacher-avatar {
      .avatar {
        width: 120px;
        height: 120px;
      }
    }
  }
}
</style>
