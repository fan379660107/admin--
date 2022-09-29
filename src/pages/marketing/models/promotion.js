import { sldCommonService } from '@/utils/utils';

export default {
  namespace: 'promotion',
  state: {
    loading: false,//加载状态
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    //获取优惠券列表接口
    * get_coupon_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/coupon/list');
      callback && callback(response);
    },
    //新增优惠券
    * add_coupon({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/coupon/add');
      callback && callback(response);
    },
    //编辑优惠券
    * edit_coupon({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/coupon/update');
      callback && callback(response);
    },
    //删除优惠券
    * del_coupon({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/coupon/del');
      callback && callback(response);
    },
    //失效优惠券
    * invalid_coupon({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/coupon/invalid');
      callback && callback(response);
    },
    //复制优惠券
    * copy_coupon({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/coupon/copy');
      callback && callback(response);
    },
    //推荐优惠券
    * recommend_coupon({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/coupon/isRecommend');
      callback && callback(response);
    },
    //获取优惠券领取列表
    * get_coupon_receive_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/coupon/receiveDetails');
      callback && callback(response);
    },
    //获取优惠券详情
    * get_coupon_detail({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/coupon/detail');
      callback && callback(response);
    },
    //获取优惠券商品列表
    * get_coupon_goods_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/coupon/goodsList');
      callback && callback(response);
    },
    //循环满减列表
    * get_full_acm_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/fullAcm/list');
      callback && callback(response);
    },
    //获取循环满减详情
    * get_full_acm_detail({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/fullAcm/detail');
      callback && callback(response);
    },
    //删除循环满减
    * del_full_acm({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/fullAcm/del');
      callback && callback(response);
    },
    //失效循环满减
    * invalid_full_acm({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/fullAcm/invalid');
      callback && callback(response);
    },

    //阶梯满减列表
    * get_full_asm_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/fullAsm/list');
      callback && callback(response);
    },
    //获取阶梯满减详情
    * get_full_asm_detail({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/fullAsm/detail');
      callback && callback(response);
    },
    //删除阶梯满减
    * del_full_asm({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/fullAsm/del');
      callback && callback(response);
    },
    //失效阶梯满减
    * invalid_full_asm({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/fullAsm/invalid');
      callback && callback(response);
    },

    //满N元折扣列表
    * get_full_ald_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/fullAld/list');
      callback && callback(response);
    },
    //获取满N元折扣详情
    * get_full_ald_detail({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/fullAld/detail');
      callback && callback(response);
    },
    //删除满N元折扣
    * del_full_ald({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/fullAld/del');
      callback && callback(response);
    },
    //失效满N元折扣
    * invalid_full_ald({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/fullAld/invalid');
      callback && callback(response);
    },

    //满N件折扣列表
    * get_full_nld_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/fullNld/list');
      callback && callback(response);
    },
    //获取满N件折扣详情
    * get_full_nld_detail({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/fullNld/detail');
      callback && callback(response);
    },
    //删除满N件折扣
    * del_full_nld({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/fullNld/del');
      callback && callback(response);
    },
    //失效满N件折扣
    * invalid_full_nld({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/fullNld/invalid');
      callback && callback(response);
    },
  },
};
