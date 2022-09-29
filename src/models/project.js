import { sldCommonService } from '@/utils/utils';

export default {
  namespace: 'project',

  state: {
    notice: [],
  },

  effects: {
    * get_cate_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', `v1/admin/shop/goodsCate/list`);
      if (callback) callback(response);
    },
    //slodon_获取分类列表_根据分类id获取下级分类
    * get_cate_list_by_id({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', `v3/goods/admin/goodsCategory/list`);
      if (callback) callback(response);
    },
    //slodon_获取分类树数据
    * get_cate_tree_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', `v3/goods/admin/goodsCategory/getCateTree`);
      if (callback) callback(response);
    },
    * get_goods_spu_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', `v1/admin/decoration/goods/goodsList`);
      if (callback) callback(response);
    },
    //slodon_获取商品列表
    * get_goods_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/goods/admin/goods/list');
      if (callback) callback(response);
    },
    //slodon_获取移动端装修列表
    * get_diy_page_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/mobileDeco/list');
      if (callback) callback(response);
    },
    //slodon_获取PC端装修列表
    * get_pc_diy_page_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/pcDeco/list');
      if (callback) callback(response);
    },
    //sldon_获取秒杀活动列表(获取未结束的活动)
    * get_seckill_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/seckill/unFinishedList');
      if (callback) callback(response);
    },
    //sldon_获取抽奖活动列表(获取未结束的活动)
    * get_draw_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/draw/drawList');
      if (callback) callback(response);
    },
    //sldon_获取积分商品列表
    * get_point_goods_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/integral/admin/integral/goods/list');
      if (callback) callback(response);
    },
    // slodon_获取短视频列表
    * get_video_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/video/admin/video/list');
      callback && callback(response);
    },
    // slodon_获取直播标签列表
    * get_live_label_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/video/admin/video/live/label/list');
      callback && callback(response);
    },
    // slodon_获取直播列表
    * get_live_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/video/admin/video/live/list');
      if (callback) callback(response);
    },
    // slodon_获取短视频标签列表
    * get_svideo_label_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/video/admin/video/label/list');
      if (callback) callback(response);
    },
    // slodon_获取积分标签列表
    * get_point_label_list({ payload, callback }, { call }) {const response = yield call(sldCommonService, payload, 'get', 'v3/integral/admin/integral/goodsLabel/list');
      if (callback) callback(response);
    },
    //获取优惠券列表（只获取未开始和进行中的）
    * get_voucher_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/coupon/normalList');
      if (callback) callback(response);
    },
    //sldon_获取推手商品列表
    * get_spreader_goods_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/spreader/admin/spreaderGoods/list');
      if (callback) callback(response);
    },
    // slodon_获取推手商品标签列表
    * get_spreader_label_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/spreader/admin/spreaderGoodsLabel/list');
      callback && callback(response);
    },
  },

  reducers: {
    saveNotice(state, action) {
      return {
        ...state,
        notice: action.payload,
      };
    },
  },
};
