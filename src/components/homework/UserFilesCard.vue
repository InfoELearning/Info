<template>
  <div class="card">
    <div class="card__header">
      <p>Мои задания</p>
      <p v-if="homework.date" class="status status--completed">Отправлено</p>
      <p v-else class="status">Назначено</p>
    </div>
    <div class="card__body">
      <div class="files">
        <File
          v-for="(file, index) in files"
          :key="index"
          :url="file.fileUrl"
          :name="file.name"
          :extension="file.name.split('.').pop()"
          @removeFile="removeFile(index)"
        />
      </div>
      <div class="upload-content">
        <input
          id="file-input"
          type="file"
          name="file-input"
          @change="addFile"
        >
        <label class="file-input__label" for="file-input">
          + Добавить решение
        </label>
      </div>
      <div class="upload-file">
        <button
          v-if="!homework.date"
          class="button"
          @click="sendHomework"
        >
          Отправить
        </button>
        <button
          v-else
          class="button button--orange"
          @click="sendHomework"
        >
          Отправить ещё раз
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import File from '@/components/File.vue';
import FileApi from '@/api/file';

export default {
  name: 'UserFilesCard',

  components: {
    File,
  },

  props: {
    homework: {
      type: Object,
      required: true,
    },
    files: {
      type: Array,
      required: true,
    },
  },

  methods: {
    addFile(event) {
      const file = event.target.files[0];
      if (file) {
        this.files.push(file);
      }
      // eslint-disable-next-line no-param-reassign
      event.target.value = '';
    },

    removeFile(index) {
      this.files.splice(index, 1);
    },

    async addMaterials() {
      const materials = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const file of this.files) {
        if (!file.fileUrl) {
          // eslint-disable-next-line no-await-in-loop
          const response = await FileApi.sendFile(file);
          const fileUrl = response.data.path;
          materials.push({
            fileUrl,
          });
        } else {
          materials.push({
            fileUrl: file.fileUrl,
          });
        }
      }

      return materials;
    },

    async sendHomework() {
      const materials = await this.addMaterials();
      const homework = {
        date: this.homework.date || new Date(Date.now()),
        materials,
      };

      this.$emit('sendHomework', homework);
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
    display: flex;
    justify-content: space-between;
    align-items: center;

    .status {
      font-size: 22px;
      color: #08984A;

      &--completed {
        color: #ED7D2B;;
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
        background: #08984A;
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
</style>
