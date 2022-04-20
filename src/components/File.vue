<template>
  <div class="file">
    <a
      :href="preview"
      target="_blank"
      :class="{'inactive': !preview}"
      class="preview"
    >
      <ion-icon name="document-outline"></ion-icon>
    </a>
    <a
      :href="preview"
      target="_blank"
      :class="{'inactive': !preview}"
      class="info"
    >
      <p class="name">{{ name }}</p>
      <p class="format">{{ extension }}</p>
    </a>
    <div v-if="removable" class="remove" @click="$emit('removeFile')">
      <ion-icon name="close-outline"></ion-icon>
    </div>
  </div>
</template>

<script>
export default {
  name: 'File',

  props: {
    name: {
      type: String,
    },
    extension: {
      type: String,
    },
    url: {
      type: String,
    },
    removable: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    preview() {
      if (this.url) {
        return process.env.VUE_APP_ROOT_SERVER + this.url;
      }
      return '';
    },
  },
};
</script>

<style lang="scss" scoped>
.file {
  border: 1px solid #C4C4C4;
  border-radius: 25px;
  height: 90px;
  display: flex;
  background-color: #fff;
  max-width: 270px;

  .preview {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 70px;
    border-right: 1px solid #C4C4C4;

    ion-icon {
      font-size: 27px;
    }
  }

  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 10px;

    .name {
      width: 150px;
      font-size: 20px;
      overflow:hidden;
      white-space:nowrap;
      text-overflow: ellipsis;
    }

    .format {
      text-transform: uppercase;
      font-size: 16px;
      color: #8A8580;
    }
  }

  .remove {
    margin-left: auto;
    display: flex;
    align-items: center;
    width: 40px;

    ion-icon {
      font-size: 35px;
      color: #8A8580;
      cursor: pointer;
    }
  }
}

.inactive {
  pointer-events: none;
  cursor: default;
}
</style>
