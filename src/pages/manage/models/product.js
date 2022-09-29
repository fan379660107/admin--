import { sldCommonService } from '@/utils/utils';

export default {
  namespace: 'product',
  state: {
    loading: false,//加载状态
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    // slodon_获取品牌列表
    * get_brand_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', `v3/goods/admin/goodsBrand/list`);
      if (callback) callback(response);
    },
    //slodon_删除品牌
    * del_brand({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goodsBrand/del`);
      if (callback) callback(response);
    },
    //slodon_添加品牌
    * add_goods_brand({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goodsBrand/add`);
      if (callback) callback(response);
    },
    //slodon_编辑品牌
    * edit_goods_brand({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goodsBrand/edit`);
      if (callback) callback(response);
    },
    // slodon_获取待审核品牌列表
    * get_check_brand_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', `v3/goods/admin/goodsBrand/applyList`);
      if (callback) callback(response);
    },
    //slodon_审核品牌
    * check_brand({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goodsBrand/audit`);
      if (callback) callback(response);
    },
    //slodon_获取分类树数据
    * get_cate_tree_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', `v3/goods/admin/goodsCategory/getCateTree`);
      if (callback) callback(response);
    },
    //slodon_获取分类列表_根据分类id获取下级分类
    * get_cate_list_by_id({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', `v3/goods/admin/goodsCategory/list`);
      if (callback) callback(response);
    },
    //slodon_获取商品规格列表
    * get_goods_spec_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', `v3/goods/admin/goodsSpec/list`);
      if (callback) callback(response);
    },
    //slodon_添加商品规格
    * add_goods_spec({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goodsSpec/add`);
      if (callback) callback(response);
    },
    //slodon_编辑商品规格
    * edit_goods_spec({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goodsSpec/edit`);
      if (callback) callback(response);
    },
    //slodon_删除商品规格
    * del_goods_spec({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goodsSpec/delete`);
      if (callback) callback(response);
    },
    //slodon_添加商品分类
    * add_goods_cat({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goodsCategory/add`);
      if (callback) callback(response);
    },
    //slodon_编辑商品分类
    * edit_goods_cat({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goodsCategory/edit`);
      if (callback) callback(response);
    },
    //slodon_删除商品分类
    * del_goods_cat({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goodsCategory/del`);
      if (callback) callback(response);
    },
    //slodon_获取商品标签列表
    * get_goods_label_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', `v3/goods/admin/goodsLabel/list`);
      if (callback) callback(response);
    },
    //slodon_删除商品标签
    * del_goods_label({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goodsLabel/del`);
      if (callback) callback(response);
    },
    //slodon_添加商品标签
    * add_goods_label({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goodsLabel/add`);
      if (callback) callback(response);
    },
    //slodon_编辑商品标签
    * edit_goods_label({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goodsLabel/edit`);
      if (callback) callback(response);
    },
    //slodon_获取商品列表
    * get_goods_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/goods/admin/goods/list');
      if (callback) callback(response);
    },
    //slodon_获取商品列表
    * get_goods_detail({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/goods/admin/goods/detail');
      if (callback) callback(response);
    },
    //slodon_商品列表_下架商品
    * lockup_goods({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goods/lockup`);
      if (callback) callback(response);
    },
    //slodon_商品列表_审核商品
    * audit_goods({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goods/audit`);
      if (callback) callback(response);
    },
    //slodon_获取属性列表
    * get_search_attr_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', `v3/goods/admin/goodsAttribute/list`);
      if (callback) callback(response);
    },
    //slodon_添加属性
    * add_search_attr({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goodsAttribute/add`);
      if (callback) callback(response);
    },
    //slodon_删除属性
    * del_search_attr({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goodsAttribute/del`);
      if (callback) callback(response);
    },
    //slodon_编辑属性
    * edit_search_attr({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goodsAttribute/edit`);
      if (callback) callback(response);
    },
  },
};
