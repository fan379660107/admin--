import { sldCommonService } from '@/utils/utils';

export default {
  namespace: 'sign',
  state: {
    loading: false,//加载状态
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    // slodon_添加签到活动列表
    * get_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/sign/activity/list');
      callback && callback(response);
    },
    // slodon_添加签到活动
    * add({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/sign/activity/add');
      callback && callback(response);
    },
    // slodon_编辑签到活动
    * edit({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/sign/activity/update');
      callback && callback(response);
    },
    // slodon_删除签到活动
    * del({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/sign/activity/del');
      callback && callback(response);
    },
    // slodon_是否提醒签到活动
    * is_remind({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/sign/activity/isRemind');
      callback && callback(response);
    },
    // slodon_是否开启签到活动
    * is_open({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/sign/activity/isOpen');
      callback && callback(response);
    },
    // slodon_获取签到活动详情
    * get_detail({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/sign/activity/detail');
      callback && callback(response);
    },
    // slodon_获取活动签到统计列表
    * get_activity_stat_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/sign/statistics/actList');
      callback && callback(response);
    },
    // slodon_获取会员签到统计列表
    * get_member_stat_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/sign/statistics/memberList');
      callback && callback(response);
    },
    // slodon_获取会员签到统计详情
    * get_member_stat_detail({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/sign/statistics/bonusList');
      callback && callback(response);
    },
    // slodon_获取活动统计详情的数据
    * get_activity_stat_num({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/sign/statistics/actDetail');
      callback && callback(response);
    },
  },
};
