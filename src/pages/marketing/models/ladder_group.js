import { sldCommonService } from '@/utils/utils';

export default {
  namespace: 'ladder_group',
  state: {
    loading: false,//加载状态
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    // slodon_获取阶梯团标签列表
    * get_label_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/ladderGroup/label/list');
      callback && callback(response);
    },
    // slodon_删除阶梯团标签
    * del_label({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/ladderGroup/label/del');
      callback && callback(response);
    },
    // slodon_添加阶梯团标签
    * add_label({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/ladderGroup/label/add');
      callback && callback(response);
    },
    // slodon_编辑阶梯团标签
    * edit_label({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/ladderGroup/label/update');
      callback && callback(response);
    },
    // slodon_更改阶梯团标签状态
    * switch_label({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/ladderGroup/label/isShow');
      callback && callback(response);
    },
    // slodon_获取阶梯团活动列表
    * get_all_ladder_group_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/ladder/group/list');
      callback && callback(response);
    },
    // slodon_失效阶梯团活动
    * invalid_ladder_group({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/ladder/group/invalid');
      callback && callback(response);
    },
    // slodon_删除阶梯团活动
    * del_ladder_group({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/ladder/group/del');
      callback && callback(response);
    },
    // slodon_获取阶梯团活动详情
    * get_ladder_group_detail({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/ladder/group/detail');
      callback && callback(response);
    },
    // slodon_获取阶梯团团队列表
    * get_ladder_group_team_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/ladder/group/teamList');
      callback && callback(response);
    },
  },
};
