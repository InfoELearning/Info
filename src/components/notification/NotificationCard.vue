<template>
  <div
    class="card"
    :class="{'card--active': !notification.viewed}"
  >
    <div class="card__header">
      <p class="date">{{ format(new Date(notification.date), 'dd.MM.yy') }}</p>
      <div
        class="remove"
        @click="deleteNotification(notification.id)"
      >
        <ion-icon name="close-outline"></ion-icon>
      </div>
    </div>
    <div class="notification">
      <router-link
        v-if="notification.link"
        class="notification-data"
        :to="notification.link">
        {{ notification.message }}
      </router-link>
      <p v-else
         class="notification-data"> {{ notification.message }}</p>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns';

export default {
  name: 'NotificationCard',
  props: {
    notification: {
      type: Object,
      required: true,
    },
  },
  methods: {
    format,

    deleteNotification(id) {
      this.$emit('delete', id);
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  background-color: #fff;
  box-shadow: 0 0 4px 4px rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  padding: 20px;
  font-size: 27px;
  max-width: 1000px;

  .card__header {
    padding: 0 40px;
    display: flex;
    justify-content: space-between;
  }

  .date {
    font-size: 22px;
    color: #8A8580;
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

  .notification {
    padding: 0 40px;
    display: flex;

    .notification-data {
      width: 100%;
      margin-top: 15px;
      word-wrap: break-word;
    }
  }
}

.card--active {
  background: linear-gradient(90deg, #1f73ef 0%, #629cf2 100%);
  box-shadow: 0 0 0px 0px rgba(0, 0, 0, 0.1);
  color: #fff;

  .date {
    color: #fff;
  }

  a {
    color: #fff;
  }

  .remove {

    ion-icon {
      color: #ffffff;
    }
  }
}
</style>
