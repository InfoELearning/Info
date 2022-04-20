import HTTP from './default';

export default {
  login(data) {
    return HTTP({
      url: 'auth/login',
      method: 'POST',
      data,
    });
  },

  register(data) {
    return HTTP({
      url: 'auth/register',
      method: 'POST',
      data,
    });
  },

  getCities() {
    return HTTP({
      url: '/cities',
      method: 'GET',
    });
  },

  getSchools(idCity) {
    return HTTP({
      url: '/schools',
      method: 'GET',
      params: {
        idCity,
      },
    });
  },

  getClasses() {
    return HTTP({
      url: '/classes',
      method: 'GET',
    });
  },
};
