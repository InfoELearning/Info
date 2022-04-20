`
<template>
  <div class="card">
    <div class="content">
      <div class="title">{{ task.name }}</div>
      <div class="description">{{ task.description }}</div>
      <div class="files">
        <File
          v-for="(file, index) in task.materials"
          :key="index"
          :name="file.name"
          :url="file.fileUrl"
          :extension="file.name.split('.').pop()"
          :removable="false"
          class="file"
        />
      </div>
    </div>
    <div class="card__info">
      <div class="date">
        Срок сдачи
        <template v-if="task.dateEnd">
          <br>{{ dateEnd }}
          <br>{{ dateEndTime }}
        </template>
        <p v-else class="stub">
          не назначен
        </p>
      </div>
      <div v-if="editable" class="edit" @click="$emit('editTask')">
        <SmallEditIcon class="edit-icon"/>
      </div>
    </div>
  </div>
</template>

<script>
import File from '@/components/File.vue';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import SmallEditIcon from '@/components/icons/SmallEditIcon.vue';

export default {
  name: 'HomeworkCard',

  components: {
    File,
    SmallEditIcon,
  },

  props: {
    task: {
      type: Object,
      required: true,
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    dateEnd() {
      return format(new Date(this.task.dateEnd), 'dd MMM', { locale: ru });
    },

    dateEndTime() {
      return format(new Date(this.task.dateEnd), 'HH:mm', { locale: ru });
    },
  },
};
</script>

<style lang="scss" scoped>
.edit {
  cursor: pointer;
}

.card {
  overflow: hidden;
  min-height: 200px;
  background-color: #fff;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
  border-radius: 25px;
  padding-left: 25px;
  padding-bottom: 25px;
  display: flex;
  justify-content: space-between;

  @media (max-width: 750px) {
    flex-direction: column-reverse;
    padding: 25px;
  }

  .content {

    .title {
      font-size: 27px;
      margin-top: 20px;
      border-bottom: 1px solid #1F73EF;
      padding-bottom: 6px;
    }

    .description {
      font-size: 20px;
      margin-top: 20px;
      border-bottom: 1px solid #1F73EF;
      padding-bottom: 20px;
      white-space: pre-wrap;
    }

    .files {
      margin-top: 20px;
      display: flex;
      flex-wrap: wrap;

      .file {
        margin: 10px;
      }
    }
  }

  .card__info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;

    @media (max-width: 750px) {
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }

    @media (max-width: 500px) {
      flex-direction: column;

      .edit-icon {
        display: none;
      }
    }

    .edit-icon {
      width: 25px;
      height: 25px;
      margin-right: 15px;
      @media (max-width: 750px) {
        margin-left: 10px;
      }
    }
  }

  .date {
    background-color: #1F73EF;
    border-radius: 0 0 0 90%;
    height: 125px;
    min-width: 125px;
    text-align: end;
    font-size: 20px;
    font-weight: 300;
    font-family: 'Roboto', serif;
    padding-top: 10px;
    color: #fff;
    padding-right: 10px;
    white-space: nowrap;

    .stub {
      font-family: 'Roboto', serif;
      font-size: 18px;
      @media (max-width: 750px) {
        display: inline;
      }
    }

    @media (max-width: 750px) {
      font-size: 18px;
      border-radius: 10px;
      text-align: center;
      height: auto;
      padding: 5px 10px 10px;

      br {
        display: none;
      }
    }
  }
}
</style>
