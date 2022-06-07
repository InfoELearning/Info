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
  getNotifications() {
    return HTTP({
      url: '/notifications',
      method: 'GET',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    });
  },
  getCountNotifications() {
    return HTTP({
      url: '/notifications/check',
      method: 'GET',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    });
  },
  deleteNotification(id) {
    return HTTP({
      url: `/notifications/${id}`,
      method: 'DELETE',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    });
  },
};
