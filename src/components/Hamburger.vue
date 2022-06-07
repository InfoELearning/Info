<template>
  <div
    class="hamburger"
    :class="{'open': isOpen}"
  >
    <div class="menu">
      <div class="menu-header">
        <div class="hamburger-icon" @click="isOpen = !isOpen">
          <CloseIcon v-if="isOpen"/>
          <HamburgerIcon v-else/>
        </div>
        <div v-if="$store.state.user.user" class="user-info">
          <img
            class="avatar"
            src="@/assets/icons/user-avatar.svg"
            alt="Аватарка"
          >
          <p class="user-name">{{ $store.state.user.user.firstName }}</p>
        </div>
      </div>
      <div v-if="userRole === 'pupil'" class="menu-items">
        <div class="menu-item" :class="{'active': $route.path === '/'}">
          <router-link to="/" active-class="active" exact class="side-btn">
            <div class="link-container">
              <span class="icon">
            <JournalIcon/>
          </span>
              <span class="title">Журнал оценок</span>
            </div>
          </router-link>
        </div>
        <div class="menu-item" :class="{'active': $route.path === '/lessons'}">
          <router-link to="/lessons" active-class="active" exact class="side-btn">
            <div class="link-container">
            <span class="icon">
            <LessonIcon/>
          </span>
              <span class="title">Уроки</span>
            </div>
          </router-link>
        </div>
        <div class="menu-item" :class="{'active': $route.path === '/timetable'}">
          <router-link to="/timetable" active-class="active" exact class="side-btn">
            <div class="link-container">
              <span class="icon">
            <VideoIcon/>
          </span>
              <span class="title">Конференция</span>
            </div>
          </router-link>
        </div>
        <div class="menu-item" :class="{'active': $route.path === '/notifications'}">
          <router-link to="/notifications" active-class="active" exact class="side-btn">
            <div class="link-container">
              <span class="icon">
            <NotificationIcon/>
          </span>
              <span class="title">Оповещения</span>
            </div>
          </router-link>
        </div>
        <div
          class="menu-item menu-item--exit"
          :class="{'active': $route.path === '/messages'}"
        >
          <a href="javascript:void(0)" @click="logout">
          <span class="icon">
            <ExitIcon/>
          </span>
            <span class="title">Выход</span>
          </a>
        </div>
      </div>
      <div v-if="userRole === 'teacher'" class="menu-items">
        <div class="menu-item" :class="{'active': $route.path === '/teacher/lessons'}">
          <router-link to="/teacher/lessons" active-class="active" exact class="side-btn">
            <div class="link-container">
               <span class="icon">
            <LessonIcon/>
          </span>
              <span class="title">Уроки</span>
            </div>
          </router-link>
        </div>
        <div class="menu-item" :class="{'active': $route.path === '/teacher/timetable'}">
          <router-link to="/teacher/timetable" active-class="active" exact class="side-btn">
            <div class="link-container">
                <span class="icon">
            <VideoIcon/>
          </span>
              <span class="title">Конференция</span>
            </div>
          </router-link>
        </div>
        <div class="menu-item" :class="{'active': $route.path === '/teacher/notifications'}">
          <router-link to="/teacher/notifications" active-class="active" exact class="side-btn">
            <div class="link-container">
              <span class="icon">
                <div v-if="countNotifications" class="circle"></div>
                <NotificationIcon/>
              </span>
              <span class="title">Оповещения</span>
            </div>
          </router-link>
        </div>
        <div
          class="menu-item menu-item--exit"
          :class="{'active': $route.path === '/messages'}"
        >
          <a href="javascript:void(0)" @click="logout">
          <span class="icon">
            <ExitIcon/>
          </span>
            <span class="title">Выход</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HamburgerIcon from '@/components/icons/HamburgerIcon.vue';
import JournalIcon from '@/components/icons/JournalIcon.vue';
import CloseIcon from '@/components/icons/CloseIcon.vue';
import LessonIcon from '@/components/icons/LessonIcon.vue';
import VideoIcon from '@/components/icons/VideoIcon.vue';
import ExitIcon from '@/components/icons/ExitIcon.vue';
import NotificationIcon from '@/components/icons/NotificationIcon.vue';
import User from '@/api/user';

export default {
  name: 'Hamburger',

  components: {
    NotificationIcon,
    HamburgerIcon,
    CloseIcon,
    JournalIcon,
    LessonIcon,
    VideoIcon,
    ExitIcon,
  },

  data() {
    return {
      isOpen: true,
      checkNotificationsInterval: null,
      countNotifications: 0,
    };
  },

  computed: {
    userRole() {
      return this.$store.state.user?.user?.role;
    },
  },

  watch: {
    isOpen(value) {
      if (value) {
        document.body.classList.add('m--burger');
      } else {
        document.body.classList.remove('m--burger');
      }
    },
  },

  created() {
    document.body.classList.add('m--burger');
    this.getNotification();
    this.checkNotifications();
  },
  beforeDestroy() {
    clearInterval(this.checkNotificationsInterval);
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.$store.commit('user/setUserInfo', null);
      this.$router.push('/login');
    },

    checkNotifications() {
      this.checkNotificationsInterval = setInterval(() => {
        this.getNotification();
      }, 2000);
    },

    async getNotification() {
      const response = await User.getCountNotifications();
      this.countNotifications = Number(response.data);
    },
  },
};
</script>

<style lang="scss" scoped>
.hamburger {
  transition: all 0.3s ease-out;
  width: 70px;
  background-color: #1F73EF;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  z-index: 200;
  overflow: hidden;
  user-select: none;

  .menu {
    padding-left: 10px;
    padding-top: 40px;

    .menu-header {
      display: flex;

      .hamburger-icon {
        cursor: pointer;
        margin-left: 15px;
        width: 25px;
        height: 25px;

        ion-icon {
          font-size: 25px;
          color: #fff;
        }
      }

      .user-info {
        margin-left: 20px;
        text-align: center;
        position: relative;
        opacity: 0;
        transition: all 0.3s ease-out;

        @media (max-height: 750px) {
          display: none;
        }

        .avatar {
          height: 100px;
          width: 100px;
          pointer-events: none;
        }

        .user-name {
          color: #fff;
          font-weight: 500;
          font-family: 'Roboto', serif;
        }
      }
    }

    .menu-items {
      margin-top: 20px;

      .menu-item {
        margin-top: 20px;

        a {
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
        }

        .icon {
          z-index: 10;
          height: 60px;
          width: 25px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 15px;
          position: relative;

          .circle {
            position: absolute;
            background: #ff0000;
            border-radius: 50%;
            height: 6px;
            width: 6px;
            top: 15px;
            left: 27px;
          }

          @media (max-height: 750px) {
            height: 45px;
          }

          ion-icon {
            font-size: 25px;
            color: #fff;
          }
        }

        .title {
          margin-left: 19px;
          font-family: 'Roboto', sans serif;
          font-weight: normal;
          color: #FFFFFF;
          white-space: nowrap;
        }

        &.active {
          background: #FFFFFF;
          border-top-left-radius: 20px;
          border-bottom-left-radius: 20px;

          ion-icon {
            font-size: 25px;
            color: #1F73EF;
          }

          .title {
            color: #333;
          }
        }

        &--exit {
          position: absolute;
          bottom: 10px;

          @media (max-height: 430px) {
            position: static;
          }
        }

        @media (max-height: 750px) {
          margin-top: 0;
        }
      }
    }
  }

  &.open {
    width: 300px;

    .user-info {
      opacity: 1 !important;
    }
  }
}

.side-btn {
  border: none;
  padding: 16px 0px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: white;
  background-color: transparent;
}

.side-btn:focus {
  outline: none;
}

.side-btn.active {
  position: relative;
  background-color: white;
  color: #1F73EF;
  font-weight: 600;
  margin-left: 10px;
  border-radius: 30px 0 0 30px;
}

.side-btn.active::before {
  top: -30px;
}

.side-btn.active::after {
  bottom: -30px;
}

.side-btn.active::before, .side-btn.active::after {
  position: absolute;
  content: "";
  right: 0;
  height: 30px;
  width: 30px;
  background-color: white;
}

.side-btn.active .link-container::before {
  top: -60px;
}

.side-btn.active .link-container::after {
  bottom: -60px;
  z-index: 1;
}

.side-btn.active .link-container::before, .side-btn.active .link-container::after {
  position: absolute;
  content: "";
  right: 0px;
  height: 60px;
  width: 60px;
  border-radius: 50%;
  background-color: #1F73EF;
}

.link-container {
  display: flex;
  align-items: center;
}
</style>
