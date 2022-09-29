import { sldCommonService } from '@/utils/utils';

export default {
  namespace: 'draw',
  state: {
    loading: false,//加载状态
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    // slodon_获取抽奖活动列表
    * get_activity_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/draw/list');
      callback && callback(response);
    },
    // slodon_删除抽奖活动
    * del_activity({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/draw/del');
      callback && callback(response);
    },
    // slodon_获取中奖记录列表
    * get_draw_record_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/draw/drawRecordList');
      callback && callback(response);
    },
    // slodon_新建活动
    * add_activity({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/draw/add','json');
      callback && callback(response);
    },
    // slodon_编辑活动
    * edit_activity({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/draw/update','json');
      callback && callback(response);
    },
    // slodon_获取活动详情
    * get_activity_detail({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/draw/detail');
      callback && callback(response);
    },
  },
};
