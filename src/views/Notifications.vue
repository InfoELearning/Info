<template>
  <transition name="fade">
    <main>
      <div v-if="notifications" class="notification">
        <div class="header">
          <div class="img-wrapper"
               :style="{backgroundImage: `url(${require(`@/assets/img/schedule-header.png`)})`}">
          </div>
        </div>
        <div class="body">
          <NotificationCard
            v-for="(notification, index) in  notifications"
            :key="index"
            :notification="notification"
            class="notification-card"
            @delete="deleteNotification(notification.id)"
          />
        </div>
        <div v-if="!notifications.length" class="body">
          <NoResults text="Оповещений пока нет"/>
        </div>
      </div>
    </main>
  </transition>
</template>

<script>
import NotificationCard from '@/components/notification/NotificationCard.vue';
import NoResults from '@/components/NoResults.vue';
import User from '@/api/user';

export default {
  name: 'Notifications',
  components: {
    NotificationCard,
    NoResults,
  },
  data() {
    return {
      notifications: null,
    };
  },
  created() {
    this.getNotifications();
  },
  methods: {
    async getNotifications() {
      const response = await User.getNotifications();
      this.notifications = response.data.reverse();
    },

    deleteNotification(id) {
      User.deleteNotification(id);
      this.notifications = this.notifications.filter((notification) => notification.id !== id);
    },
  },
};
</script>

<style lang="scss" scoped>
.notification {
  background: white;
  border-radius: 25px;
  min-height: 900px;
  overflow: hidden;
  max-width: 1200px;
}

.img-wrapper {
  width: 100%;
  height: 280px;
  background-size: contain;
  background: #629CF2 no-repeat center;
}

.body {
  padding: 0 70px 25px;

  @media (max-width: 750px) {
    padding: 0 25px 25px;
  }
}

.notification-card {
  min-width: 270px;
  margin-top: 20px;
}
</style>
