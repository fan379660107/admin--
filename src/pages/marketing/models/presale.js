import { sldCommonService } from '@/utils/utils';

export default {
  namespace: 'presale',
  state: {
    loading: false,//加载状态
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    // slodon_获取预售标签列表
    * get_label_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/preSell/label/list');
      callback && callback(response);
    },
    // slodon_删除预售标签
    * del_label({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/preSell/label/del');
      callback && callback(response);
    },
    // slodon_添加预售标签
    * add_label({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/preSell/label/add');
      callback && callback(response);
    },
    // slodon_编辑预售标签
    * edit_label({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/preSell/label/update');
      callback && callback(response);
    },
    // slodon_更改预售标签状态
    * switch_label({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/preSell/label/isShow');
      callback && callback(response);
    },
    //slodon_获取预售列表
    * get_presale_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/preSell/list');
      if (callback) callback(response);
    },
    // slodon_删除预售活动
    * del_activity({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/preSell/del');
      callback && callback(response);
    },
    // slodon_失效预售活动
    * exp_activity({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/preSell/invalid');
      callback && callback(response);
    },
    // slodon_获取当前场次的预售的商品列表（spu）
    * get_joined_goods_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/preSell/goodList');
      callback && callback(response);
    },
     // slodon_获取当前场次的预售的商品详情（spu）
     * get_detail_pre({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/preSell/detail');
      callback && callback(response);
    },
  },
};
