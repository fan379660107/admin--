import { sldCommonService } from '@/utils/utils';

export default {
  namespace: 'goods_platform',
  state: {
    loading: false,//加载状态
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    // slodon_下载商品导入模板
    * download_goods_mould({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', `v3/goods/admin/goods/platform/download`);
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
    //slodon_添加商品规格值
    * add_goods_spec_val({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goodsSpec/addSpecValue`);
      if (callback) callback(response);
    },
    //slodon_获取分类绑定的品牌和属性信息
    * get_brand_attr_detail({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/goods/admin/goodsCategory/getCategory');
      if (callback) callback(response);
    },
    //slodon_发布商品
    * add_goods({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/goods/admin/goods/platform/add', 'json');
      if (callback) callback(response);
    },
    //slodon_编辑商品
    * edit_goods({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/goods/admin/goods/platform/edit', 'json');
      if (callback) callback(response);
    },
    //slodon_获取店铺商品列表
    * get_store_goods_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/goods/admin/goods/platform/storeGoodsList');
      if (callback) callback(response);
    },
    //slodon_导入商品
    * import_goods({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/goods/admin/goods/platform/storeGoodsImport');
      if (callback) callback(response);
    },
    //slodon_根据一级分类id获取该分类下的所有分类数据
    * get_all_cat_by_one_id({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/goods/admin/goodsCategory/bottomCategory');
      if (callback) callback(response);
    },
    //slodon_获取商品资料库列表
    * get_platform_goods_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/goods/admin/goods/platform/list');
      if (callback) callback(response);
    },
    //slodon_删除商品资料库商品
    * del_goods({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/goods/admin/goods/platform/deleteGoods');
      if (callback) callback(response);
    },
    //slodon_刊登商品资料库商品
    * publish_goods({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/goods/admin/goods/platform/publish');
      if (callback) callback(response);
    },
    //slodon_下架商品资料库商品
    * lockup_goods({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/goods/admin/goods/platform/lockup');
      if (callback) callback(response);
    },
    //slodon_获取商品详情
    * get_goods_detail({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/goods/admin/goods/platform/detail');
      if (callback) callback(response);
    },
  },
};
