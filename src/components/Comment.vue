<template>
  <div class="comment">
    <div class="author-avatar">
      <Avatar class="avatar"/>
    </div>
    <div class="content">
      <div class="content-header">
        <p class="author-name">{{ comment.user.lastName }} {{ comment.user.firstName }}</p>
        <p class="date">{{ formattedDate }}</p>
      </div>
      <div class="text">
        {{ comment.text }}
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/Avatar.vue';
import { format } from 'date-fns';

export default {
  name: 'Comment',

  components: {
    Avatar,
  },

  props: {
    comment: {
      type: Object,
      required: true,
    },
  },

  computed: {
    formattedDate() {
      return format(new Date(this.comment.date), 'HH:mm');
    },
  },
};
</script>

<style lang="scss" scoped>
.comment {
  display: flex;
  max-width: 450px;

  .author-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .content {
    width: 100%;

    .content-header {
      display: flex;
      justify-content: space-between;
      margin-left: 10px;

      .author-name {
        font-size: 18px;
      }

      .date {
        font-size: 18px;
        color: #8A8580;
      }
    }

    .text {
      margin-left: 7px;
      border: 1px solid #D1D1D1;
      border-radius: 10px 10px 10px 0;
      padding: 16px;
      background-color: #fff;
      height: auto;
      font-size: 20px;
    }
  }
}
</style>
