import Vue from 'vue';
import VueSweetalert2 from 'vue-sweetalert2';
import App from './App.vue';
import router from './router';
import store from './store';
import 'vue2-datepicker/index.css';
import 'vue-select/dist/vue-select.css';
import 'sweetalert2/dist/sweetalert2.min.css';

const options = {
  confirmButtonColor: '#1F73EF',
  cancelButtonColor: '#ff7674',
  heightAuto: false,
};

Vue.use(VueSweetalert2, options);

Vue.config.productionTip = false;
Vue.config.ignoredElements = ['ion-icon'];

Vue.mixin({
  methods: {
    showError(message) {
      this.$swal.fire({
        icon: 'error',
        title: 'Ошибка',
        text: message || 'Что-то пошло не так!',
      });
    },
  },
});

const startApp = () => {
  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app');
};

if (localStorage.getItem('token')) {
  store.dispatch('user/getUser').then(() => startApp());
} else {
  startApp();
}
