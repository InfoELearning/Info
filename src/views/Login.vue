<template>
  <div class="main">
    <div class="login">
      <div class="login__content">
        <div class="content__logo">
          <img src="@/assets/images/logo.png" alt="">
        </div>
        <div class="content__header">
          Добро пожаловать
        </div>
        <div class="content__form" @keypress.enter="login">
          <div class="form__group">
            <label for="email" class="form__label">Логин</label>
            <input
              id="email"
              v-model="email"
              placeholder="Введите электронную почту"
              type="text"
              class="form__input"
            />
          </div>
          <div class="form__group">
            <label for="password" class="form__label">Пароль</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="form__input"
              placeholder="Введите пароль"
            >
          </div>
          <div class="form__group">
            <button
              class="form__button"
              type="button"
              @click="login"
            >
              Войти
            </button>
            <router-link class="form__link" to="/register">Регистрация</router-link>
          </div>

        </div>
      </div>
      <div class="login__image">
        <img src="@/assets/images/auth-right-image.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import Auth from '@/api/auth';

export default {
  name: 'Login',

  data() {
    return {
      email: 'test6@test.ru',
      password: '4654654654156',
    };
  },

  methods: {
    async login() {
      try {
        if (!this.checkForm()) return;

        const response = await Auth.login({
          email: this.email,
          password: this.password,
        });

        localStorage.setItem('token', response.data.token);

        await this.$store.dispatch('user/getUser');

        const userRole = this.$store.state.user.user.role;
        if (userRole === 'teacher') {
          await this.$router.push('/teacher');
        } else {
          await this.$router.push('/');
        }
      } catch (error) {
        if (error?.response?.data?.errorMessage) {
          this.showError(error.response.data.errorMessage);
        } else {
          this.showError();
        }
      }
    },

    checkForm() {
      if (this.email === '' || this.password === '') {
        this.showError('Заполните все поля');
        return false;
      }

      if (!this.validateEmail(this.email)) {
        this.showError('Неверный формат электронной почты');
        return false;
      }

      return true;
    },

    validateEmail(email) {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  background: linear-gradient(90deg, #BDD9F8 51%, #629CF2 49%);
  min-height: 100%;
  padding-top: 100px;
  padding-bottom: 100px;
  overflow-x: hidden;

  .login {
    max-width: 1200px;
    height: 600px;
    margin: 0 auto;
    background: #fff;
    border-radius: 50px;
    display: flex;
    @media (max-width: 1200px) {
      border-radius: 0;
    }

    .login__content {
      width: 50%;
      margin: 0 10px;
      @media (max-width: 1200px) {
        width: 100%;
      }

      .content__logo {
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 200px;
        }
      }

      .content__header {
        font-size: 36px;
        text-align: center;
      }

      .content__form {
        margin: 50px auto 0;
        max-width: 400px;

        .form__group {
          display: flex;
          flex-direction: column;
          margin-top: 25px;

          label {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 9px;
          }

          input {
            border: 1px solid #D1D1D1;
            box-sizing: border-box;
            border-radius: 8px;
            padding: 16px;
            width: 100%;
            font-size: 14px;
          }

          .form__button {
            background: linear-gradient(
                0deg, rgba(142, 196, 245, 0.5), rgba(142, 196, 245, 0.5)), #629CF2;
            color: white;
            width: 100%;
            border-radius: 18px;
            height: 50px;
            font-size: 22px;
            text-decoration: none !important;
          }

          .form__link {
            text-align: center;
            margin-top: 8px;
            color: #78B0F4;
            font-size: 18px;
            font-weight: 500;
            text-decoration: none;
          }
        }
      }
    }

    .login__image {
      width: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #EAF3FA;
      border-radius: 0 50px 50px 0;
      @media (max-width: 1200px) {
        display: none;
      }

      img {
        object-fit: cover;
        width: 850px;
      }
    }
  }
}
</style>
