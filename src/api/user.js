import HTTP from './default';

export default {
  getUserInfo() {
    return HTTP({
      url: '/user/profile',
      method: 'GET',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    });
  },
};
