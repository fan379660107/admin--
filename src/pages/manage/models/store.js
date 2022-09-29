import { sldCommonService } from '@/utils/utils';

export default {
  namespace: 'store',
  state: {
    loading: false,//加载状态
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    //slodon_获取店铺等级列表
    * get_grade_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/seller/admin/storeGrade/list');
      if (callback) callback(response);
    },
    //slodon_新增店铺等级
    * add_grade({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/seller/admin/storeGrade/add');
      if (callback) callback(response);
    },
    //slodon_编辑店铺等级
    * edit_grade({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/seller/admin/storeGrade/edit');
      if (callback) callback(response);
    },
    //slodon_删除店铺等级
    * del_grade({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/seller/admin/storeGrade/del');
      if (callback) callback(response);
    },
    //slodon_获取自营店铺列表
    * get_own_store_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/seller/admin/ownStore/list');
      if (callback) callback(response);
    },
    //slodon_添加自营店铺
    * add_own_store({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/seller/admin/ownStore/add');
      if (callback) callback(response);
    },
    //slodon_获取自营店铺详情
    * get_own_store_detail({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/seller/admin/ownStore/detail');
      if (callback) callback(response);
    },
    //slodon_编辑自营店铺
    * edit_own_store({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/seller/admin/ownStore/edit');
      if (callback) callback(response);
    },
    //slodon_删除自营店铺
    * del_own_store({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/seller/admin/ownStore/del');
      if (callback) callback(response);
    },
    //slodon_开启/关闭自营店铺
    * switch_own_store({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/seller/admin/ownStore/lockUp');
      if (callback) callback(response);
    },
    //slodon_获取入驻店铺审核列表
    * get_apply_store_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/seller/admin/storeAudit/list');
      if (callback) callback(response);
    },
    //slodon_获取入驻店铺详情
    * get_apply_store_detail({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/seller/admin/storeAudit/detail');
      if (callback) callback(response);
    },
    //slodon_审核入驻店铺
    * check_store({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/seller/admin/storeAudit/audit');
      if (callback) callback(response);
    },
    //slodon_获取入驻店铺列表
    * get_settled_store_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/seller/admin/store/list');
      if (callback) callback(response);
    },
    //slodon_获取已入驻店铺的入驻详情
    * get_settled_store_apply_detail({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/seller/admin/store/detail');
      if (callback) callback(response);
    },
    //slodon_设置入驻店铺的结算日
    * set_settled_store_bill({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/seller/admin/store/setBillDate');
      if (callback) callback(response);
    },
    //slodon_获取申请的经营类目
    * get_applied_category_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/seller/admin/cateAudit/list');
      if (callback) callback(response);
    },
    //slodon_审核的经营类目
    * check_applied_category({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/seller/admin/cateAudit/audit');
      if (callback) callback(response);
    },
    //slodon_编辑入驻店铺信息
    * edit_settled_store_info({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/seller/admin/store/edit');
      if (callback) callback(response);
    },
    //slodon_获取临效期店铺列表
    * get_settled_store_will_expired_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/seller/admin/store/expiryList');
      if (callback) callback(response);
    },
    //slodon_获取续签列表
    * get_store_renew_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/seller/admin/storeRenew/list');
      if (callback) callback(response);
    },
    //slodon_删除续签
    * del_store_renew({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/seller/admin/storeRenew/delRenew');
      if (callback) callback(response);
    },
    //slodon_获取开店时长列表
    *get_store_open_time({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/seller/admin/store/openTime');
      if (callback) callback(response);
    },
  },
};
