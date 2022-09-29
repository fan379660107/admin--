import { sldCommonService } from '@/utils/utils';

export default {
  namespace: 'seckill',
  state: {
    loading: false,//加载状态
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    // slodon_获取秒杀标签列表
    * get_label_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/seckillLabel/list');
      callback && callback(response);
    },
    // slodon_删除秒杀标签
    * del_label({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/seckillLabel/deleteLabel');
      callback && callback(response);
    },
    // slodon_添加秒杀标签
    * add_label({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/seckillLabel/addLabel');
      callback && callback(response);
    },
    // slodon_编辑秒杀标签
    * edit_label({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/seckillLabel/edit');
      callback && callback(response);
    },
    // slodon_更改秒杀标签状态
    * switch_label({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/seckillLabel/setShowLabel');
      callback && callback(response);
    },
    // slodon_获取活动列表
    * get_activity_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/seckill/list');
      callback && callback(response);
    },
    // slodon_获取秒杀活动详情
    * get_activity_detail({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/seckill/getSeckill');
      callback && callback(response);
    },
    // slodon_新增活动
    * add_activity({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/seckill/addSeckill');
      callback && callback(response);
    },
    // slodon_删除活动
    * del_activity({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/seckill/deleteSeckill');
      callback && callback(response);
    },
    // slodon_获取活动场次列表
    * get_detail_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/seckillStage/list');
      callback && callback(response);
    },
    // slodon_设置活动轮播图
    * set_activity_swiper({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/seckill/setBanner');
      callback && callback(response);
    },
    // slodon_获取当前场次的参与的商品列表（spu）
    * get_joined_goods_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/seckillGoods/list');
      callback && callback(response);
    },
    // slodon_获取秒杀商品的sku列表
    * get_seckill_goods_sku_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/seckillGoods/productList');
      callback && callback(response);
    },
    // slodon_获取活动下待审核的spu列表
    * get_check_goods_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/promotion/admin/seckillGoods/auditList');
      callback && callback(response);
    },
    // slodon_删除参与的活动商品
    * del_goods({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/seckillGoods/del');
      callback && callback(response);
    },
    // slodon_审核参与的活动商品
    * check_goods({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/promotion/admin/seckillGoods/audit');
      callback && callback(response);
    },
  },
};
