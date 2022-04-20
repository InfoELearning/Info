/* eslint-disable no-shadow */
import User from '@/api/user';

const state = {
  user: null,
};

const getters = {
  isAuthenticated: (state) => !!state.user,
  user: (state) => state.user,
};

const mutations = {
  setUserInfo(state, data) {
    state.user = data;
  },
};

const actions = {
  async getUser({ commit }) {
    try {
      const response = await User.getUserInfo();
      if (response.status !== 200) return;
      commit('setUserInfo', response.data);
    } catch (error) {
      console.log(error);
    }
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
