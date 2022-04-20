import HTTP from './default';

export default {
  sendFile(file) {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return HTTP({
      url: '/upload',
      method: 'POST',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
      data: formData,
    });
  },
};
