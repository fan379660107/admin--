import { sldCommonService } from '@/utils/utils';

export default {
  namespace: 'bill',
  state: {
    loading: false,//加载状态
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    //slodon_获取结算单列表
    * get_bill_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/bill/list');
      if (callback) callback(response);
    },
    //slodon_获取结算单详情
    * get_bill_detail({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/bill/detail');
      if (callback) callback(response);
    },
    //slodon_审核结算单
    * check_bill({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/bill/approved');
      if (callback) callback(response);
    },
    //slodon_结算单_打款
    * settle_bill({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/bill/confirmPayment');
      if (callback) callback(response);
    },
    //slodon_结算单_导出
    * export_bill_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/bill/export');
      if (callback) callback(response);
    },
  },
};
