import { sldCommonService } from '@/utils/utils';

export default {
  namespace: 'spell_group',
  state: {
    loading: false,//加载状态
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    // slodon_获取拼团标签列表
    * get_label_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/spell/label/list');
      callback && callback(response);
    },
    // slodon_删除拼团标签
    * del_label({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/spell/label/del');
      callback && callback(response);
    },
    // slodon_添加拼团标签
    * add_label({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/spell/label/add');
      callback && callback(response);
    },
    // slodon_编辑拼团标签
    * edit_label({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/spell/label/update');
      callback && callback(response);
    },
    // slodon_更改拼团标签状态
    * switch_label({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/spell/label/isShow');
      callback && callback(response);
    },
    // slodon_获取拼团活动列表
    * get_all_spell_group_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/spell/list');
      callback && callback(response);
    },
    // slodon_失效拼团活动
    * invalid_spell_group({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/spell/invalid');
      callback && callback(response);
    },
    // slodon_删除拼团活动
    * del_spell_group({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/spell/del');
      callback && callback(response);
    },
    // slodon_获取拼团活动详情
    * get_spell_group_detail({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/spell/detail');
      callback && callback(response);
    },
    // slodon_获取拼团活动的商品
    * get_spell_group_joined_goods_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/spell/goodList');
      callback && callback(response);
    },
    // slodon_获取拼团活动的订单
    * get_spell_group_order_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/spell/order/list');
      callback && callback(response);
    },
    // slodon_获取拼团团队列表
    * get_spell_group_team_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/spell/teamList');
      callback && callback(response);
    },
  },
};
