import axios from 'axios';

axios.defaults.baseURL = process.env.VUE_APP_ROOT_API;

const HTTP = axios.create({
  baseURL: process.env.VUE_APP_ROOT_API,
  headers: {
    'Content-type': 'application/json',
  },
});

export default HTTP;
