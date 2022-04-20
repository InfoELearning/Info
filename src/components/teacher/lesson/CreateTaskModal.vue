<template>
  <div class="modal show">
    <div class="modal-content">
      <span class="close" @click="$emit('close')">&times;</span>
      <div class="modal__header">
        <p>Создать новое задание</p>
      </div>
      <div class="modal__body">
        <div class="field-container">
          <p>Тема</p>
          <input
            v-model="name"
            type="text"
            placeholder="Введите тему"
          >
        </div>
        <div class="field-container">
          <p>Описание</p>
          <textarea
            v-model="description"
            rows="4"
            placeholder="Введите описание"
          />
        </div>
        <div class="buttons">
          <div class="upload-content">
            <input
              id="file-input"
              type="file"
              name="file-input"
              @change="addMaterial"
            >
            <label class="file-input__label" for="file-input">
              + Добавить материал
            </label>
          </div>
          <v-select
            v-model="selectedType"
            class="select"
            :searchable="false"
            placeholder="Критерий оценки"
            :options="['С оценкой', 'Без оценки']"
          >
          </v-select>
        </div>
        <div class="files">
          <File
            v-for="(file, index) in files"
            :key="index"
            :name="file.name"
            :extension="file.name.split('.').pop()"
            class="file"
            @removeFile="removeFile(index)"
          />
        </div>
        <div class="cards">
          <div class="card">
            <div class="card__header">
              Опубликовать
            </div>
            <div class="card__content">
              <DatePicker
                v-model="dateStart"
                :disabledDate="disabledDateStart"
                :format="'DD.MM.YYYY'"
                @change="dateEnd = null"
              />
              <div class="time-select">
                <input
                  v-model="dateStartHours"
                  placeholder="12"
                  type="number"
                  min="0"
                  max="23"
                >
                <span>:</span>
                <input
                  v-model="dateStartMinutes"
                  placeholder="00"
                  type="number"
                  min="0"
                  max="60"
                >
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card__header">
              Срок сдачи
            </div>
            <div class="card__content">
              <DatePicker
                v-model="dateEnd"
                :disabledDate="disabledDateEnd"
                :format="'DD.MM.YYYY'"
                :disabled="!dateStart"
              />
              <div class="time-select">
                <input
                  v-model="dateEndHours"
                  placeholder="12"
                  type="number"
                  min="0"
                  max="23"
                >
                <span>:</span>
                <input
                  v-model="dateEndMinutes"
                  placeholder="00"
                  type="number"
                  min="0"
                  max="60"
                >
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
import File from '@/components/File.vue';
import FileApi from '@/api/file';
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/locale/ru';

export default {
  name: 'CreateTaskModal',

  components: {
    'v-select': vSelect,
    DatePicker,
    File,
  },

  data() {
    return {
      name: '',
      description: '',
      selectedType: 'С оценкой',
      dateEnd: this.getDefaultDateEnd(),
      dateEndHours: '8',
      dateEndMinutes: '00',
      dateStart: new Date(Date.now()),
      dateStartHours: new Date(Date.now()).getHours() + 2,
      dateStartMinutes: '00',
      files: [],
    };
  },

  methods: {
    async submitModal() {
      if (!this.checkForm()) {
        this.showError('Заполните все поля');
        return;
      }

      if (!this.checkDates()) return;

      const lessonId = this.$route.params.id;
      const withMark = this.selectedType === 'С оценкой';
      let dateStart;
      let dateEnd;
      let materials;

      if (this.dateStart) {
        dateStart = new Date(this.dateStart);
        dateStart.setHours(this.dateStartHours);
        dateStart.setMinutes(this.dateStartMinutes);
      }
      if (this.dateEnd) {
        dateEnd = new Date(this.dateEnd);
        dateEnd.setHours(this.dateEndHours);
        dateEnd.setMinutes(this.dateEndMinutes);
      }

      if (this.files) {
        materials = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const file of this.files) {
          // eslint-disable-next-line no-await-in-loop
          const response = await FileApi.sendFile(file);
          const fileUrl = response.data.path;
          materials.push({
            fileUrl,
          });
        }
      }

      const task = {
        idLesson: lessonId,
        name: this.name,
        description: this.description,
        withMark,
        dateStart,
        dateEnd,
        materials,
      };

      this.$emit('submitModal', task);
    },

    checkForm() {
      return !!(this.name
        && this.description
        && this.selectedType
        && this.dateStart
        && this.dateStartHours
        && this.dateStartMinutes
        && this.dateEnd
        && this.dateEndHours
        && this.dateEndMinutes);
    },

    checkDates() {
      if (!this.checkHours(this.dateStartHours)) return false;
      if (!this.checkHours(this.dateEndHours)) return false;
      if (!this.checkMinutes(this.dateStartMinutes)) return false;
      if (!this.checkMinutes(this.dateEndMinutes)) return false;

      const dateStart = new Date(this.dateStart);
      dateStart.setHours(this.dateStartHours);
      dateStart.setMinutes(this.dateStartMinutes);

      const dateEnd = new Date(this.dateEnd);
      dateEnd.setHours(this.dateEndHours);
      dateEnd.setMinutes(this.dateEndMinutes);

      if (dateEnd.getTime() < Date.now()) {
        this.showError('Дата срока сдачи задания не может быть меньше текущей');
        return false;
      }

      if (dateStart.getTime() > dateEnd.getTime()) {
        this.showError('Дата публикации задания не может быть позже даты сдачи');
        return false;
      }

      return true;
    },

    disabledDateStart(date) {
      return date < Date.now() - 86400000;
    },

    disabledDateEnd(date) {
      return date < this.dateStart;
    },

    addMaterial(event) {
      const file = event.target.files[0];
      if (file) {
        this.files.push(file);
      }
    },

    removeFile(index) {
      this.files.splice(index, 1);
    },

    getDefaultDateEnd() {
      const date = new Date(Date.now());
      date.setDate(date.getDate() + 7);
      return date;
    },

    checkHours(hours) {
      if (hours < 0 || hours > 23) {
        this.showError('Время должно быть от 0 до 23');
        return false;
      }
      return true;
    },

    checkMinutes(minutes) {
      if (minutes < 0 || minutes > 59) {
        this.showError('Время должно быть от 0 до 59');
        return false;
      }
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
textarea,
input {
  font-size: 18px;
  font-weight: 500;
  margin: 0 auto;
  background: #FFFFFF;
  border: 1px solid rgba(60, 60, 60, 0.26);;
  box-sizing: border-box;
  border-radius: 2px;
  padding: 8px 8px 8px 8px;
  width: 100%;
}

textarea {
  resize: none;
}

.upload-content {
  display: flex;
  width: 100%;

  #file-input {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }

  label {
    background: #FFFFFF;
    border: 1px solid #ACACAC;
    box-sizing: border-box;
    border-radius: 10px;
    font-size: 18px;
    text-align: center;
    width: 100%;
    padding: 10px 0;
    cursor: pointer;
  }
}

.cards {
  display: flex;
  justify-content: space-around;

  @media (max-width: 1200px) {
    flex-direction: column;
    align-items: center;
  }

  .card {
    width: 300px;
    margin-top: 25px;
    background: #FDFEFF;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 15px;
    max-width: 300px;
    height: 195px;

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
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
    }

    .time-select {
      margin-top: 18px;
      text-align: center;

      input {
        width: 52px;
        height: 50px;
        background: #FEFFFF;
        border: 1px solid #7e8686;
        border-radius: 5px;
        text-align: center;
        font-size: 27px;
        margin: 0 5px;
      }
    }
  }
}

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
  padding: 0 40px;

  .field-container {
    margin-top: 15px;

    textarea,
    input {
      margin-top: 10px;
    }
  }

  .buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;

    @media (max-width: 1000px) {
      flex-direction: column-reverse;
      padding: 25px;

      .select,
      .upload-content {
        width: 100% !important;
        margin-top: 10px;
      }
    }

    .upload-content {
      width: 250px;
    }

    .select {
      width: 200px;
    }
  }

  .files {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;

    .file {
      margin: 10px;
      height: 75px;
      width: 270px;
    }
  }
}

.modal__footer {
  display: flex;
  justify-content: center;

  .save-lesson {
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
.vs__dropdown-toggle {
  height: 45px
}

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
