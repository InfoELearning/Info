<template>
  <div class="lessonContainer">
    <div
      class="lesson__header"
      :style="{'background-image': lessonImage}">
    </div>
    <div class="lesson__name">
      {{ lesson.name }}
    </div>
    <div class="header">
      <div v-if="userRole === 'teacher'" class="header__nav-item">
        <router-link :to="`/teacher/lessons/${lesson.id}`">Лента</router-link>
      </div>
      <div v-else class="header__nav-item">
        <router-link :to="`/lessons/${lesson.id}`">Лента</router-link>
      </div>
      <div v-if="userRole === 'teacher'" class="header__nav-item">
        <router-link :to="`/teacher/tasks/lesson/${lesson.id}`">Задания</router-link>
      </div>
      <div v-if="userRole === 'teacher'" class="header__nav-item">
        <router-link :to="`/teacher/pupils/lesson/${lesson.id}`">Ученики</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import DefaultLessonImage from '@/assets/images/lesson-image.png';

export default {
  name: 'LessonHeader',

  props: {
    lesson: {
      type: Object,
      required: true,
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
    userRole() {
      return this.$store.state.user.user.role;
    },
  },
};
</script>

<style lang="scss" scoped>
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

.lessonContainer {
  padding-bottom: 25px;
}

.header {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.header__nav-item {
  font-weight: 400;
  font-size: 25px;
  line-height: 32px;
  color: #000;
  text-decoration: none;
  padding: 0 20px;
  cursor: pointer;
}
</style>
