import queryError from '@/services/error';

export default {
  namespace: 'error',

  state: {
    error: '',
    isloading: false,
  },

  effects: {
    *query({ payload }, { call }) {
      yield call(queryError, payload.state);
      yield put({
        type: 'trigger',
        payload: payload.state,
      });
    },
  },

  reducers: {
    trigger(state, action) {
      return {
        error: action.payload,
      };
    },
  },
};
