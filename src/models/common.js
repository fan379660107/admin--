import { sldCommonService } from '@/utils/utils';

export default {
  namespace: 'common',

  state: {
    notice: [],
  },

  effects: {
    //slodon_获取图形验证码
    * get_captcha({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/captcha/common/getCaptcha');
      if (callback) callback(response);
    },
    //slodon_获取三级地址
    * get_common_area({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v1/admin/common/regions/list');
      if (callback) callback(response);
    },
    //slodon_获取店铺分类列表
    * get_vendor_cat_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v1/admin/seller/storeCate/treeList');
      if (callback) callback(response);
    },
    //slodon_获取开店时长
    * get_vendor_open_time({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v1/admin/seller/manage/openTime');
      if (callback) callback(response);
    },
    //slodon_获取店铺等级列表
    * get_vendor_grade_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v1/admin/seller/grade/list');
      if (callback) callback(response);
    },
    //slodon_编辑申请店铺
    * edit_apply_vendor({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v1/admin/seller/audit/update');
      if (callback) callback(response);
    },
    //slodon_编辑自营店铺
    * edit_self_vendor({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', '/v1/admin/seller/manage/updateOwnShop');
      if (callback) callback(response);
    },
    //slodon_获取平台运费模板列表
    * get_transport_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v1/admin/setting/transport/list');
      if (callback) callback(response);
    },
    //slodon_获取系统设置信息
    * getSetting({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/setting/getSettingList');
      if (callback) callback(response);
    },
    //slodon_批量保存设置信息
    * saveSetting({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/setting/updateSettingList');
      if (callback) callback(response);
    },
    //slodon_获取理由
    * get_reason_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/reason/list');
      if (callback) callback(response);
    },
    //slodon_更新es商品数据
    * updateEsGoods({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/search/esInit');
      if (callback) callback(response);
    },
    //slodon_更新es积分商品数据
    * updateEsPointGoods({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/integral/admin/integral/search/esInit');
      if (callback) callback(response);
    },
    //slodon_获取店铺销售排行TOP10
    * get_store_sales_rank({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/trade/analysis/storeSalesRank');
      if (callback) callback(response);
    },
    //slodon_获取商品销售排行TOP10
    * get_goods_sales_rank({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/trade/analysis/goodsSalesRank');
      if (callback) callback(response);
    },
    //slodon_获取品类销售排行TOP10
    * get_category_rank({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/overview/analysis/categoryRank');
      if (callback) callback(response);
    },
    //slodon_获取品牌销售占比数据
    * get_brand_sales_percent({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/overview/analysis/brandSalesPercent');
      if (callback) callback(response);
    },
    //slodon_获取支付/下单金额趋势数据
    * get_pay_order_trend({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/overview/analysis/payOrderTrend');
      if (callback) callback(response);
    },
    //slodon_获取流量趋势数据
    * get_flow_trend({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/overview/analysis/flowTrend');
      if (callback) callback(response);
    },
    //slodon_获取会员/店铺新增趋势数据
    * get_new_trend({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/overview/analysis/newTrend');
      if (callback) callback(response);
    },
    //slodon_获取会员地域分布数据
    * get_member_region_distribution({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/member/analysis/regionDistribution');
      if (callback) callback(response);
    },
    //slodon_获取店铺地域分布数据
    * get_store_region_distribution({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/store/analysis/regionDistribution');
      if (callback) callback(response);
    },
    //slodon_获取会员偏好商品排行-TOP10数据
    * get_goods_prefer_rank({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/member/analysis/preferGoodsRank');
      if (callback) callback(response);
    },
    //slodon_获取品牌销售排行-TOP10数据
    * get_brand_rank({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/goods/analysis/brandSalesRank');
      if (callback) callback(response);
    },
    //slodon_获取商品收藏数排行-TOP10数据
    * get_goods_collection_rank({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/goods/analysis/goodsCollectionRank');
      if (callback) callback(response);
    },
    //slodon_获取商品销售变化趋势-TOP10数据
    * get_goods_sales_trend_top({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/goods/analysis/goodsSalesRank');
      if (callback) callback(response);
    },
    //slodon_获取商品动销趋势数据
    * get_goods_sales_trend({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/goods/analysis/goodsSalesTrend');
      if (callback) callback(response);
    },
    //slodon_获取店铺流量排行-TOP10数据
    * get_store_flow_rank({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/flow/analysis/storeFlowRank');
      if (callback) callback(response);
    },
    //slodon_获取TOP10品类销售趋势数据
    * get_category_sales_rank({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/category/analysis/categorySalesRank');
      if (callback) callback(response);
    },
    //slodon_获取商品流量排行-TOP10数据
    * get_goods_flow_rank({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/flow/analysis/goodsFlowRank');
      if (callback) callback(response);
    },
    //slodon_获取加配模块数据
    * get_extra_setting({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/captcha/common/get');
      if (callback) callback(response);
    },
    //slodon_更新积分商品积分换算比例
    * updatePointRate({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/integral/admin/integral/goods/platformShelf');
      if (callback) callback(response);
    },
    //slodon_更新分类缓存
    * update_goods_cat_cache({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', `v3/goods/admin/goodsCategory/categoryInit`);
      if (callback) callback(response);
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
