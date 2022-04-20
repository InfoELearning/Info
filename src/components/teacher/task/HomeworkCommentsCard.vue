<template>
  <div class="card">
    <div class="card__header">
      <div class="title">
        <ion-icon name="person-outline"></ion-icon>
        Личные комментарии
      </div>
    </div>
    <div class="comments">
      <Comment
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        class="comment"
      />
    </div>
    <div class="comment-input">
      <Avatar/>
      <input v-model="comment" type="text" class="comment" @keypress.enter="sendComment">
    </div>
    <div class="send-comment">
      <button :disabled="!comment" class="button" @click="sendComment">Отправить</button>
    </div>
  </div>
</template>

<script>
import Comment from '@/components/Comment.vue';
import Avatar from '@/components/Avatar.vue';

export default {
  name: 'HomeworkCommentsCard',

  components: {
    Comment,
    Avatar,
  },

  props: {
    comments: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      comment: '',
    };
  },

  methods: {
    sendComment() {
      const comment = {
        date: new Date(Date.now()),
        idUser: this.$store.state.user.user.id,
        text: this.comment,
      };
      this.$emit('sendComment', comment);
      this.comment = '';
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

  .comments {
    margin-top: 10px;

    .comment {
      margin-top: 10px;
    }
  }

  .comment-input {
    display: flex;
    margin-top: 20px;

    .comment {
      margin-left: 7px;
      border: 1px solid #D1D1D1;
      box-sizing: border-box;
      border-radius: 8px;
      padding: 16px;
      width: 100%;
      font-size: 14px;
      height: 75px;
      background-color: #f8f8f8;
      resize: none;
      outline: none;
    }
  }

  .send-comment {
    margin-top: 10px;

    .button {
      font-size: 25px;
      color: #FFFFFF;
      width: 100%;
      padding: 10px 0;
      background: #629CF2;
      border: 1px solid #ACACAC;
      box-sizing: border-box;
      border-radius: 10px;

      &:disabled {
        cursor: auto;
        background: #D1D1D1;
        border: 1px solid #D1D1D1;
      }
    }
  }
}
</style>
