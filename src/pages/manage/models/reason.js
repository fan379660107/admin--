import { sldCommonService } from '@/utils/utils';

export default {
  namespace: 'reason',
  state: {
    loading: false,//加载状态
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    //slodon_获取理由列表
    * get_reason_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/reason/list');
      if (callback) callback(response);
    },
    //slodon_编辑理由
    * reason_update({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/reason/update');
      if (callback) callback(response);
    },
    //slodon_理由是否显示切换
    * reason_switch({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/reason/isShow');
      if (callback) callback(response);
    },
    //slodon_删除理由
    * reason_del({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/reason/del');
      callback && callback(response);
    },
    //slodon_新增理由
    * reason_add({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/reason/add');
      if (callback) callback(response);
    },
  },
};
