export default {
  namespace: 'share',

  state: {
    flag: false,//true为需要更新数据，false为无需更新数据
    type: '',//更新类型，页面根据该参数决定具体更新数据的方式
    sldGlobalShareData:{},//需要更新的具体数据，对象格式
  },

  effects: {
    //slodon_更新信息
    * updateDate({ payload }, { call, put }) {
      yield put({
        type: 'saveData',
        payload: payload,
      });
    },
  },

  reducers: {
    saveData(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    getShareData(state, { payload }) {
      return {
        ...state,
      };
    },
  },
};
