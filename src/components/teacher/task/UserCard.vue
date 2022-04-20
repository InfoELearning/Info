<template>
  <div class="card">
    <Avatar/>
    <div class="info">
      <p class="description">{{ user.lastName }} {{ user.firstName }}</p>
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/Avatar.vue';

export default {
  name: 'UserCard',

  components: {
    Avatar,
  },

  props: {
    user: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  border: 1px solid rgba(218, 220, 224, 0.8);
  border-radius: 15px;
  padding: 8px;
  min-height: 80px;
  display: flex;
  align-items: center;
  background-color: #fff;

  .info {
    margin-left: 15px;

    p {
      font-size: 27px;
    }

    .description {
      font-size: 27px;
    }

    .date {
      font-size: 20px;
      margin-top: 10px;
      color: #6B6262;
    }

    .warning {
      font-size: 20px;
      color: orange;
    }
  }

  .status {
    margin-left: auto;

    .mark {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 25px;
      height: 75px;
      width: 75px;
      border-radius: 50%;
    }
  }
}
</style>
