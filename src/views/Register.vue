<template>
  <div class="main">
    <div class="login">
      <div class="login__content">
        <div class="content__logo">
          <img src="@/assets/images/logo.png" alt="">
        </div>
        <div class="content__header">
          Регистрация
        </div>
        <div v-if="step===1" class="content__form">
          <div class="form__group">
            <label for="lastName" class="form__label">Фамилия</label>
            <input
              id="lastName"
              v-model="user.lastName"
              placeholder="Фамилия"
              type="text"
              class="form__input"
            />
          </div>
          <div class="form__group">
            <label for="firstName" class="form__label">Имя</label>
            <input
              id="firstName"
              v-model="user.firstName"
              placeholder="Имя"
              type="text"
              class="form__input"
            >
          </div>
          <div class="form__group">
            <label for="middleName" class="form__label">Отчество</label>
            <input
              id="middleName"
              v-model="user.middleName"
              placeholder="Отчество"
              type="text"
              class="form__input"
            >
          </div>
          <div class="form__group">
            <button
              class="form__button"
              type="button"
              :disabled="!isAllowedSecondStep"
              @click="setSecondStep"
            >
              Далее
            </button>
          </div>

        </div>
        <div v-else-if="step===2" class="content__form">
          <div class="form__group">
            <label class="form__label">Город</label>
            <v-select
              v-model="selectedCity"
              label="name"
              :options="cities"
              placeholder="Выберите город"
            >
              <span slot="no-options">Извините, подходящих вариантов нет.</span>
            </v-select>
          </div>
          <div class="form__group">
            <label class="form__label">Школа</label>
            <v-select
              v-model="selectedSchool"
              :disabled="!selectedCity"
              label="name"
              :options="schools"
              placeholder="Выберите школу"
            >
              <span slot="no-options">Извините, подходящих вариантов нет.</span>
            </v-select>
          </div>
          <div class="form__group">
            <button
              class="form__button"
              type="button"
              :disabled="!isAllowedThirdStep"
              @click="setThirdStep"
            >
              Далее
            </button>
          </div>

        </div>
        <div v-else-if="step===3" class="content__form">
          <div class="form__group">
            <div class="role-select">
              <button
                class="role-item"
                :class="{'role-item--disabled': user.role !== 'pupil'}"
                @click="user.role = 'pupil'"
              >
                Ученик
                <img src="../assets/icons/pupil.png"/>
              </button>
              <button
                :class="{'role-item--disabled': user.role !== 'teacher'}"
                class="role-item"
                @click="user.role = 'teacher'"
              >
                Учитель
                <img src="../assets/icons/teacher.png"/>
              </button>
            </div>
          </div>
          <div v-if="user.role === 'pupil'" class="form__group">
            <label class="form__label">Класс</label>
            <v-select
              v-model="selectedClass"
              label="name"
              :options="classes"
              placeholder="Выберите класс"
            >
              <span slot="no-options">Извините, подходящих вариантов нет.</span>
            </v-select>
          </div>
          <div class="form__group">
            <button
              class="form__button"
              type="button"
              :disabled="!isAllowedFourthStep"
              @click="setFourthStep"
            >
              Далее
            </button>
          </div>

        </div>
        <div v-else-if="step===4" class="content__form">
          <div class="form__group">
            <label class="form__label">Email</label>
            <input
              v-model="user.email"
              placeholder="Введите email"
              type="text"
              class="form__input"
            />
          </div>
          <div class="form__group">
            <label class="form__label">Пароль</label>
            <input
              v-model="user.password"
              placeholder="Введите пароль"
              type="password"
              class="form__input"
            >
          </div>
          <div class="form__group">
            <button
              class="form__button"
              type="button"
              :disabled="!isAllowedRegistration"
              @click="register"
            >
              Зарегистрироваться
            </button>
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
import vSelect from 'vue-select';
import Auth from '@/api/auth';

export default {
  name: 'Register',

  components: {
    'v-select': vSelect,
  },

  data() {
    return {
      step: 1,
      cities: null,
      schools: [],
      classes: [],
      user: {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        middleName: '',
        idCity: null,
        idSchool: null,
        idClass: null,
        role: 'pupil',
      },
      selectedCity: null,
      selectedSchool: null,
      selectedClass: null,
    };
  },

  computed: {
    isAllowedSecondStep() {
      return this.user.firstName && this.user.lastName && this.user.middleName;
    },

    isAllowedThirdStep() {
      return this.selectedCity && this.selectedSchool;
    },

    isAllowedFourthStep() {
      if (this.user.role === 'pupil') {
        return !!this.selectedClass;
      }
      return !!this.user.role;
    },

    isAllowedRegistration() {
      return this.user.email && this.user.password;
    },
  },

  watch: {
    selectedCity(value) {
      this.schools = [];
      this.selectedSchool = null;
      if (value) {
        this.getSchools();
      }
    },
  },

  async created() {
    await this.getCities();
    await this.getClasses();
  },

  methods: {
    async getCities() {
      const response = await Auth.getCities();
      this.cities = response.data;
    },

    async getSchools() {
      const response = await Auth.getSchools(this.selectedCity.id);
      this.schools = response.data;
    },

    async getClasses() {
      const response = await Auth.getClasses();
      this.classes = response.data;
    },

    async register() {
      try {
        if (!this.checkForm()) return;

        if (this.user.role === 'teacher') {
          this.user.idClass = null;
        }

        const response = await Auth.register(this.user);

        localStorage.setItem('token', response.data.token);

        await this.$store.dispatch('user/getUser');

        const userRole = this.$store.state.user.user.role;
        if (userRole === 'teacher') {
          await this.$router.push('/teacher/lessons');
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

    setSecondStep() {
      this.step = 2;
    },

    setThirdStep() {
      this.user.idCity = this.selectedCity.id;
      this.user.idSchool = this.selectedSchool.id;
      this.step = 3;
    },

    setFourthStep() {
      this.user.idClass = this.selectedClass?.id;
      this.step = 4;
    },

    checkForm() {
      if (this.user.email === '' || this.user.password === '') {
        this.showError('Заполните все поля');
        return false;
      }

      if (!this.validateEmail(this.user.email)) {
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
    min-height: 600px;
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

            &:disabled {
              cursor: auto;
              background: linear-gradient(
                  0deg, rgba(142, 196, 245, 0.5), rgba(142, 196, 245, 0.5)), #bcd8f3;
            }
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

.role-select {
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  .role-item {
    height: 100px;
    width: 100px;
    font-size: 17px;
    background: #1F73EF;
    box-shadow: 0px 6px 10px rgba(31, 115, 239, 0.14);
    border-radius: 15px;
    color: #FFFFFF;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    &--disabled {
      background: linear-gradient(
          0deg, rgba(142, 196, 245, 0.5), rgba(142, 196, 245, 0.5)), #bcd8f3;
    }

    img {
      margin-top: 5px;
    }
  }
}
</style>
