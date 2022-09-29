import { sldCommonService } from '@/utils/utils';

export default {
  namespace: 'evaluate',
  state: {
    loading: false,//加载状态
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    //slodon_获取商品评价列表
    * get_goods_comment_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/goods/admin/goodsComment/list');
      if (callback) callback(response);
    },
    //slodon_获取店铺评价列表
    * get_store_comment_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/seller/admin/storeComment/list');
      if (callback) callback(response);
    },
    //slodon_删除商品评价
    * goods_comment_del({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/goods/admin/goodsComment/del');
      callback && callback(response);
    },
    //slodon_删除店铺评价
    * store_comment_del({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/seller/admin/storeComment/del');
      callback && callback(response);
    },
  },
};
