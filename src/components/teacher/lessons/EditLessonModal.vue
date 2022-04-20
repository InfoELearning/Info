<template>
  <div class="modal show">
    <div class="modal-content">
      <span class="close" @click="$emit('close')">&times;</span>
      <div class="modal__header">
        <p>Редактирование урока</p>
      </div>
      <div class="modal__body">
        <div class="card">
          <label for="image" class="lesson-image">
            <img
              v-if="imagePreview"
              class="image-preview"
              :src="imagePreview"
              alt=""
            >
            <AddImage v-else class="add-image" />
            <input
              id="image"
              type="file"
              accept="image/*"
              @change="setImagePreview"
            >
          </label>
        </div>
        <div class="card">
          <div class="card__header">
            Добавить в расписание
          </div>
          <div class="card__content">
            <div class="day-select">
              <v-select
                v-model="selectedDay"
                :searchable="false"
                placeholder="День недели"
                :options="days"
              >
              </v-select>
            </div>
            <div class="time-select">
              <input v-model="hours" placeholder="12" type="number" min="0" max="23">
              <span>:</span>
              <input v-model="minutes" placeholder="00" type="number" min="0" max="60">
            </div>
            <div class="add-time">
              <button class="button--add" @click="addScheduleItem">+</button>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card__header">
            Данные об уроке
          </div>
          <div class="card__content">
            <div class="lesson-select">
              <input v-model="name" placeholder="Предмет">
            </div>
            <div class="class-select">
              <v-select
                v-model="selectedClass"
                placeholder="Класс"
                label="name"
                :options="classes"
              >
                <span slot="no-options"></span>
              </v-select>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card__header">
            Расписание
          </div>
          <div class="card__content">
            <div class="schedule">
              <div
                v-for="(scheduleItem, index) in schedule"
                :key="index"
                class="schedule__item"
              >
                <p class="day">{{ scheduleItem.day }}</p>
                <p class="time">{{ scheduleItem.time }}</p>
                <p class="remove" @click="removeScheduleItem(scheduleItem)">&times;</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal__footer">
        <button class="save-lesson" @click="submitModal">Сохранить</button>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select';
import AddImage from '@/components/icons/AddImage.vue';
import File from '@/api/file';
import Auth from '@/api/auth';

export default {
  name: 'EditLessonModal',

  components: {
    'v-select': vSelect,
    AddImage,
  },

  props: {
    lesson: {
      type: Object,
    },
  },

  data() {
    return {
      imagePreview: null,
      days: ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'],
      selectedDay: null,
      hours: null,
      minutes: null,
      schedule: this.lesson.timeTable,
      name: this.lesson.name,
      file: null,
      classes: [],
      selectedClass: this.lesson.class,
    };
  },

  created() {
    this.getClasses();

    if (this.lesson.image) {
      this.imagePreview = process.env.VUE_APP_ROOT_SERVER + this.lesson.image;
    }
  },

  methods: {
    setImagePreview(event) {
      this.file = null;
      const file = event.target.files[0];
      if (file) {
        this.imagePreview = URL.createObjectURL(file);
        this.file = file;
      }
    },

    async submitModal() {
      if (!this.checkForm()) return;

      const imageUrl = await this.getImageUrl();

      const { user } = this.$store.state.user;

      const lesson = {
        id: this.lesson.id,
        name: this.name,
        idSchool: user.school.id,
        idClass: this.selectedClass.id,
        image: imageUrl || this.lesson.image,
        idTeacher: user.id,
        timeTable: this.schedule,
      };

      this.$emit('submitModal', lesson);
    },

    async getImageUrl() {
      if (this.file) {
        const response = await File.sendFile(this.file);
        return response.data.path;
      }
      return null;
    },

    async getClasses() {
      const response = await Auth.getClasses();
      this.classes = response.data;
    },

    addScheduleItem() {
      if (!this.selectedDay) {
        this.showError('Выберите день недели');
        return;
      }

      if (!this.hours || !this.minutes) {
        this.showError('Введите время');
        return;
      }

      if (this.hours < 0 || this.hours > 23 || this.minutes < 0 || this.minutes > 59) {
        this.showError('Неверное время');
        return;
      }

      this.schedule.push({
        day: this.selectedDay,
        time: `${this.hours}:${this.minutes}`,
      });
      this.selectedDay = null;
      this.hours = '';
      this.minutes = '';
    },

    checkForm() {
      if (!this.name || !this.selectedClass) {
        this.showError('Заполните данные об уроке');
        return false;
      }

      if (!this.schedule.length > 0) {
        this.showError('Заполните расписание');
        return false;
      }

      return true;
    },

    removeScheduleItem(scheduleItem) {
      const index = this.schedule
        .findIndex((item) => (item.day === scheduleItem.day) && (item.time === scheduleItem.time));
      this.schedule.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.modal__header {
  display: flex;
  justify-content: center;

  p {
    //max-width: 600px;
    border-bottom: 1px solid #1F73EF;
    padding-bottom: 10px;
  }
}

.modal__body {
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  .card {
    width: 300px;
    margin-top: 25px;
    background: #FDFEFF;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 15px;
    max-width: 300px;
    height: 280px;

    .card__header {
      border-radius: 15px 15px 0 0;
      overflow: hidden;
      background: #629CF2;
      color: #fff;
      text-align: center;
      padding: 10px 0;
    }

    .card__content {
      padding: 10px 20px 20px;

      .class-select,
      .day-select {
        margin: 10px auto;
        width: 200px;
      }

      .time-select {
        margin-top: 18px;
        text-align: center;

        input {
          width: 50px;
          height: 50px;
          background: #FEFFFF;
          border: 1px solid #7e8686;
          border-radius: 5px;
          text-align: center;
          font-size: 27px;
          margin: 0 5px;
        }
      }

      .lesson-select {
        display: flex;
        margin-top: 20px;

        input {
          font-size: 18px;
          font-weight: 500;
          margin: 0 auto;
          background: #FFFFFF;
          border: 1px solid rgba(60, 60, 60, 0.26);;
          box-sizing: border-box;
          border-radius: 2px;
          padding: 8px 8px 8px 8px;
          width: 200px;
        }
      }

      .add-time {
        display: flex;

        .button--add {
          margin-left: auto;
          background: #629CF2;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          border-radius: 28px;
          height: 48px;
          width: 48px;
          color: #fff;
          font-size: 30px;
        }
      }

      .schedule {
        font-size: 20px;

        .schedule__item {
          display: flex;
          align-items: center;
          margin: 10px 5px;

          .day {

          }

          .time {
            margin-left: auto;
          }

          .remove {
            cursor: pointer;
            margin-left: 5px;
          }
        }
      }
    }

    .lesson-image {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #CCD2E3;
      border-radius: 15px;
      height: 100%;
      width: 100%;
      overflow: hidden;

      .image-preview {
        height: 280px;
        object-fit: cover;
      }

      .add-image {
        font-size: 85px;
        color: #fff;
      }

      #image {
        display: none;
      }
    }
  }
}

.modal__footer {
  display: flex;
  justify-content: center;

  .save-lesson{
    margin-top: 20px;
    background: #1F73EF;
    border: 1px solid #ACACAC;
    box-sizing: border-box;
    border-radius: 10px;
    color: #fff;
    font-size: 27px;
    width: 250px;
    height: 50px
  }
}
</style>

<style>
.vs__selected {
  font-size: 18px;
  font-weight: bold;
}
.vs__search {
  font-size: 18px;
}

.vs__dropdown-option {
  font-size: 19px !important;
}

.vs__dropdown-menu {
  max-height: 175px;
}
</style>
