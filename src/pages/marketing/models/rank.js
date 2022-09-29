import { sldCommonService } from '@/utils/utils';

export default {
  namespace: 'rank',
  state: {
    loading: false,//加载状态
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    // slodon_获取排行榜分类列表
    * get_label_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/goods/admin/goods/rank/category/list');
      callback && callback(response);
    },
    // slodon_获取启用状态的排行榜分类列表
    * get_allowed_label_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/goods/admin/goods/rank/category/categoryList');
      callback && callback(response);
    },
    // slodon_删除排行榜分类
    * del_label({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/goods/admin/goods/rank/category/del');
      callback && callback(response);
    },
    // slodon_添加排行榜分类
    * add_label({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/goods/admin/goods/rank/category/add');
      callback && callback(response);
    },
    // slodon_编辑排行榜分类
    * edit_label({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/goods/admin/goods/rank/category/update');
      callback && callback(response);
    },
    // slodon_更改排行榜分类状态
    * switch_label({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/goods/admin/goods/rank/category/isEnable');
      callback && callback(response);
    },
    // slodon_获取排行榜活动列表
    * get_rank_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/goods/admin/goods/rank/list');
      callback && callback(response);
    },
    // slodon_更新榜单商品
    * update_rank_goods({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/goods/admin/goods/rank/refresh');
      callback && callback(response);
    },
    // slodon_是否启用榜单
    * switch_rank({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/goods/admin/goods/rank/isEnable');
      callback && callback(response);
    },
    // slodon_新建榜单
    * add_rank({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/goods/admin/goods/rank/add', 'json');
      callback && callback(response);
    },
    // slodon_编辑榜单
    * edit_rank({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/goods/admin/goods/rank/update', 'json');
      callback && callback(response);
    },
    // slodon_删除排行榜活动
    * del_rank({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/goods/admin/goods/rank/del');
      callback && callback(response);
    },
    // slodon_加载榜单商品
    * get_all_rank_goods({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/goods/admin/goods/rank/loadRankGoods');
      callback && callback(response);
    },
    // slodon_获取榜单详情
    * get_rank_detail({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/goods/admin/goods/rank/detail');
      callback && callback(response);
    },
    // slodon_获取榜单绑定的商品
    * get_rank_bind_goods({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/goods/admin/goods/rank/rankGoods');
      callback && callback(response);
    },
    // slodon_关闭全部榜单
    * close_rank({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/goods/admin/goods/rank/closeRank');
      callback && callback(response);
    },
    // slodon_获取商品的三级分类列表（只返回有3级分类的数据）
    * get_goods_cat({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/goods/admin/goodsCategory/categoryList');
      callback && callback(response);
    },
  },
};
