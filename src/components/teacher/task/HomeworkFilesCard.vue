<template>
  <div class="card">
    <div class="card__header">
      <div class="header__user-info">
        <Avatar class="avatar"/>
        <p class="name">{{ homework.pupil.lastName }} {{ homework.pupil.firstName }}</p>
      </div>
      <div class="header__date">
        <p>{{ formattedDate }}</p>
        <!--        <p class="status">Пропущен срок сдачи</p>-->
      </div>
    </div>
    <div class="card__body">
      <div class="files">
        <File
          v-for="(file, index) in files"
          :key="index"
          :url="file.fileUrl"
          :name="file.name"
          :extension="file.name.split('.').pop()"
          :removable="false"
        />
      </div>
      <div v-if="homework.task.withMark" class="mark-container">
        <span>Задание без оценки</span>
      </div>
      <template v-else>
        <div class="mark-container">
          <span>Оценка</span>
          <input v-if="!homework.mark" v-model="mark" type="number">
          <Mark v-else class="mark outline" :value="homework.mark"/>
        </div>

        <div v-if="!homework.mark" class="upload-file">
          <button
            class="button"
            @click="sendMark"
          >
            Сохранить
          </button>
        </div>
        <div v-else class="edit">
          <div @click="homework.mark=''">
            <SmallEditIcon class="edit-icon"/>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import File from '@/components/File.vue';
import Avatar from '@/components/Avatar.vue';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import Mark from '@/components/Mark.vue';
import SmallEditIcon from '@/components/icons/SmallEditIcon.vue';

export default {
  name: 'UserFilesCard',

  components: {
    File,
    Avatar,
    Mark,
    SmallEditIcon,
  },

  props: {
    homework: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      files: [],
      mark: null,
    };
  },

  computed: {
    formattedDate() {
      return format(new Date(this.homework.date), 'dd MMMM HH:mm', { locale: ru });
    },
  },

  created() {
    this.files = this.homework.materials;
  },

  methods: {
    sendMark() {
      if (this.mark < 1 || this.mark > 5) {
        this.showError('Оценка должна быть от 1 до 5');
        return;
      }
      this.$emit('sendMark', this.mark);
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  background-color: #fff;
  box-shadow: 0 0 4px rgb(0 0 0 / 25%);
  border-radius: 25px;
  padding: 20px;
  font-size: 27px;
  width: 400px;
  height: 100%;

  .card__header {
    .header__user-info {
      display: flex;
      align-items: center;

      .avatar {
        width: 50px;
        height: 50px;
      }

      .name {
        margin-left: 10px;
      }
    }

    .header__date {
      font-size: 18px;
      margin-top: 10px;
      margin-left: 10px;
      color: #6B6262;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .status {
        color: #ED7D2B;
      }
    }
  }

  .card__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 20px;

    .files {
      margin-top: 10px;

      .file {
        margin: 10px 0;
      }
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

    .upload-file {
      margin-top: 10px;
      width: 100%;

      .button {
        font-size: 25px;
        color: #FFFFFF;
        width: 100%;
        padding: 10px 0;
        background: #1F73EF;
        border: 1px solid #ACACAC;
        box-sizing: border-box;
        border-radius: 10px;

        &--orange {
          background: #ED7D2B;
        }
      }
    }
  }
}

.mark-container {
  span {
    font-size: 24px;
  }

  input {
    font-size: 20px;
    margin-left: 10px;
    border: 1px solid #D1D1D1;
    box-sizing: border-box;
    border-radius: 8px;
    padding: 8px;
    width: 40px;
    text-align: center;
  }

  .mark {
    margin-left: 10px;
  }
}

.edit {
  width: 100%;
  display: flex;
  justify-content: end;

  .edit-icon {
    width: 25px;
    height: 25px;
    cursor: pointer;
  }
}
</style>
