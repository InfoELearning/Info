<template>
  <router-link :to="`/teacher/lessons/${lesson.id}`" class="card">
    <div
      class="card__header"
      :style="{'background-image': lessonImage}">
    </div>
    <div class="card__body">
      <div class="lesson-info">
        <p class="lesson-name">
          {{ lesson.name }}
        </p>
        <div class="edit-container">
          <p class="edit" @click.stop.prevent="$emit('selectLesson')">
            Редактировать
            <EditIcon class="edit-button"/>
          </p>
        </div>
      </div>
      <div class="class-name">
        {{ lesson.class.name }}
      </div>
    </div>
  </router-link>
</template>

<script>
import DefaultLessonImage from '@/assets/images/lesson-image.png';
import EditIcon from '@/components/icons/EditIcon.vue';

export default {
  name: 'TeacherLessonCard',

  components: {
    EditIcon,
  },

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
  },
};
</script>

<style lang="scss" scoped>
.card {
  overflow: hidden;
  width: 500px;
  background-color: #fff;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 25px;
  padding: 0;

  :hover {
    .edit-container {
      display: block !important;
    }
  }

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
      position: relative;
      display: flex;
      flex-direction: column;
      font-size: 27px;
      justify-content: center;

      p {
        font-family: Roboto, serif;
      }

      .edit-container {
        display: none;

        @media (max-width: 1200px) {
          display: block;
        }

        .edit {
          cursor: pointer;
          font-size: 20px;
          color: #8A8580;
          display: flex;
          align-items: center;
          position: absolute;
          bottom: 0;

          @media (max-width: 600px) {
            position: initial;
          }

          .edit-button {
            padding: 2px;
          }
        }
      }

      .lesson-name {
        font-weight: 500;
      }
    }

    .class-name {
      width: 120px;
      height: 120px;
      background: #BDD9F8;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 27px;

      @media (max-width: 600px) {
        display: none;
      }
    }
  }
}
</style>
