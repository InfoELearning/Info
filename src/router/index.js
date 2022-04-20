import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';

Vue.use(VueRouter);

const routes = [
  {
    path: '',
    name: 'DefaultLayout',
    redirect: '/',
    component: () => import('../layouts/DefaultLayout.vue'),
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('../views/pupil/Home.vue'),
      },
      {
        path: 'lessons',
        name: 'lessons',
        component: () => import('../views/pupil/Lessons.vue'),
      },
      {
        path: 'lessons/:id',
        name: 'lesson',
        component: () => import('../views/pupil/Lesson.vue'),
      },
      {
        path: 'task/:id',
        name: 'task',
        component: () => import('../views/pupil/Task.vue'),
      },
      {
        path: 'timetable',
        name: 'Timetable',
        component: () => import('../views/pupil/Timetable.vue'),
      },
      {
        path: 'video/:id',
        name: 'VideoRoom',
        component: () => import('../views/VideoRoom.vue'),
      },
    ],
    beforeEnter: (to, from, next) => {
      const userRole = store.state.user.user.role;
      if (userRole !== 'pupil') {
        if (to.path === '/') {
          next('/teacher');
        } else {
          next('/page-not-found');
        }
      } else {
        next();
      }
    },
  },
  {
    path: '/teacher',
    name: 'DefaultLayout',
    redirect: '/teacher/lessons',
    component: () => import('../layouts/DefaultLayout.vue'),
    children: [
      {
        path: 'lessons',
        name: 'lessons',
        component: () => import('../views/teacher/Lessons.vue'),
      },
      {
        path: 'lessons/:id',
        name: 'lesson',
        component: () => import('../views/teacher/Lesson.vue'),
      },
      {
        path: 'tasks/lesson/:id',
        name: 'tasks',
        component: () => import('../views/teacher/Tasks.vue'),
      },
      {
        path: 'task/:id',
        name: 'task',
        component: () => import('../views/teacher/Task.vue'),
      },
      {
        path: 'timetable',
        name: 'Timetable',
        component: () => import('../views/teacher/Timetable.vue'),
      },
      {
        path: 'video/:id',
        name: 'VideoRoom',
        component: () => import('../views/VideoRoom.vue'),
      },
      {
        path: 'pupils/lesson/:id',
        name: 'pupils',
        component: () => import('../views/teacher/Pupils.vue'),
      },
    ],
    beforeEnter: (to, from, next) => {
      const userRole = store.state.user.user.role;
      if (userRole !== 'teacher') {
        next('/page-not-found');
      } else {
        next();
      }
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
  },
  {
    path: '/page-not-found',
    component: () => import('../views/E404.vue'),
    meta: {
      title: '404',
    },
  },
  {
    path: '*',
    component: () => import('../views/E404.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if ((to.path !== '/login' && to.path !== '/register') && !store.getters['user/isAuthenticated']) {
    next('/login');
  }

  next();
});

router.afterEach(() => {
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
});

export default router;
