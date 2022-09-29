import { sldCommonService } from '@/utils/utils';

export default {
  namespace: 'statistics',
  state: {
    loading: false,//加载状态
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    //slodon_获取交易报表列表
    * get_trade_report_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/trade/analysis/tradeReport');
      if (callback) callback(response);
    },
    //slodon_导出交易报表
    * export_trade_report({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/trade/analysis/export');
      if (callback) callback(response);
    },
    //slodon_获取流量报表列表（按天）
    * get_flow_report_by_day_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/flow/analysis/flowReport');
      if (callback) callback(response);
    },
    //slodon_获取流量报表列表（按店铺）
    * get_flow_report_by_store_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/flow/analysis/storeReport');
      if (callback) callback(response);
    },
    //slodon_导出流量报表（按天）
    * export_trade_report_by_day({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/flow/analysis/dayExport');
      if (callback) callback(response);
    },
    //slodon_导出流量报表（按店铺）
    * export_trade_report_by_store({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/flow/analysis/storeExport');
      if (callback) callback(response);
    },
    //slodon_获取商品动销报表列表（按天）
    * get_goods_saling_report_by_day_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/goods/analysis/dayReport');
      if (callback) callback(response);
    },
    //slodon_获取商品动销报表列表（按商品）
    * get_goods_saling_report_by_goods_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/goods/analysis/goodsReport');
      if (callback) callback(response);
    },
    //slodon_导出商品动销报表（按天）
    * export_goods_saling_report_by_day({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/goods/analysis/dayExport');
      if (callback) callback(response);
    },
    //slodon_导出商品动销报表（按商品）
    * export_goods_saling_report_by_goods({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/goods/analysis/goodsExport');
      if (callback) callback(response);
    },
    //slodon_获取商品品类报表列表（按天）
    * get_goods_category_report_by_day_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/category/analysis/dayReport');
      if (callback) callback(response);
    },
    //slodon_获取商品品类报表列表（按品类）
    * get_goods_category_report_by_category_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/category/analysis/categoryReport');
      if (callback) callback(response);
    },
    //slodon_导出商品品类报表（按天）
    * export_goods_category_report_by_day({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/category/analysis/dayExport');
      if (callback) callback(response);
    },
    //slodon_导出商品品类报表（按品类）
    * export_goods_category_report_by_category({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/category/analysis/categoryExport');
      if (callback) callback(response);
    },
    //slodon_获取会员报表列表（按天）
    * get_member_report_by_day_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/member/analysis/dayReport');
      if (callback) callback(response);
    },
    //slodon_获取会员报表列表（按会员）
    * get_member_report_by_member_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/member/analysis/memberReport');
      if (callback) callback(response);
    },
    //slodon_导出会员报表（按天）
    * export_member_report_by_day({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/member/analysis/dayExport');
      if (callback) callback(response);
    },
    //slodon_导出会员报表（按会员）
    * export_member_report_by_member({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/member/analysis/memberExport');
      if (callback) callback(response);
    },
    //slodon_获取店铺报表列表
    * get_store_report_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/store/analysis/storeReport');
      if (callback) callback(response);
    },
    //slodon_导出店铺报表
    * export_store_report({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/store/analysis/export');
      if (callback) callback(response);
    },
    //slodon_获取地域概况报表列表
    * get_region_report_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/region/analysis/regionReport');
      if (callback) callback(response);
    },
    //slodon_导出地域概况报表
    * export_region_report({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/region/analysis/export');
      if (callback) callback(response);
    },
    //slodon_获取实时统计数据
    * get_realtime_data({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/present/analysis/presentData');
      if (callback) callback(response);
    },
    //slodon_获取各省份支付金额占比数据
    * get_region_pay_amount_percent({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/region/analysis/payAmountPercent');
      if (callback) callback(response);
    },
    //slodon_获取各省份增长趋势数据
    * get_province_rise_trend({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/region/analysis/provinceRiseTrend');
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
    //slodon_获取新增店铺趋势数据
    * get_new_store_trend({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/store/analysis/newStoreTrend');
      if (callback) callback(response);
    },
    //slodon_获取店铺等级分布占比数据
    * get_store_grade_percent({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/store/analysis/gradePercent');
      if (callback) callback(response);
    },
    //slodon_获取店铺类型占比数据
    * get_store_type_percent({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/store/analysis/typePercent');
      if (callback) callback(response);
    },
    //slodon_获取下单会员地域分布占比数据
    * get_submit_member_region_percent({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/member/analysis/memberRegionPercent');
      if (callback) callback(response);
    },
    //slodon_获取各终端会员占比数据
    * get_member_client_percent({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/member/analysis/memberPercent');
      if (callback) callback(response);
    },
    //slodon_获取会员分析变化趋势数据
    * get_change_trend({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/member/analysis/changeTrend');
      if (callback) callback(response);
    },
    //slodon_获取商品动销趋势数据
    * get_goods_sales_trend({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/goods/analysis/goodsSalesTrend');
      if (callback) callback(response);
    },
    //slodon_获取各终端销售占比数据
    * get_terminal_sales_percent({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/trade/analysis/terminalSalesPercent');
      if (callback) callback(response);
    },
    //slodon_获取品类销售额占比数据
    * get_category_sale_amount_percent({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/category/analysis/categorySaleAmountPercent');
      if (callback) callback(response);
    },
    //slodon_获取品类退货占比数据
    * get_category_return_sale_amount_percent({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/category/analysis/categoryReturnNumPercent');
      if (callback) callback(response);
    },
    //slodon_获取会员总览头部数据
    * get_category_return_sale_member_data({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/member/analysis/goodsOverview');
      if (callback) callback(response);
    },
    //slodon_获取近30天变化趋势数据
    * get_change_trend_data({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/trade/analysis/changeTrend');
      if (callback) callback(response);
    },
    //slodon_获取各终端浏览量占比数据
    * get_terminal_view_num_percent({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/flow/analysis/terminalViewNumPercent');
      if (callback) callback(response);
    },
    //slodon_获取各终端访客数占比数据
    * get_terminal_visitor_num_percent({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/flow/analysis/terminalVisitorNumPercent');
      if (callback) callback(response);
    },
    //slodon_获取交易分析动态头部数据
    * get_analysis_trade_overview({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/trade/analysis/tradeOverview');
      if (callback) callback(response);
    },
    //slodon_获取各省份销售变化趋势数据
    * get_province_sales_trend({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/trade/analysis/provinceSalesTrend');
      if (callback) callback(response);
    },
    //slodon_获取各省份销售占比数据
    * get_province_sales_percent({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/trade/analysis/provinceSalesPercent');
      if (callback) callback(response);
    },
    //slodon_获取各终端销售变化趋势数据
    * get_terminal_sales_trend({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/trade/analysis/terminalSalesTrend');
      if (callback) callback(response);
    },
    //slodon_获取商品总览数据(仅实时数据)
    * get_goods_preview_data({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/goods/analysis/goodsOverview');
      if (callback) callback(response);
    },
    //slodon_获取商品总览数据
    * get_goods_preview_data_static({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/goods/analysis/goodsBrandNum');
      if (callback) callback(response);
    },
    //slodon_获取店铺总览数据
    * get_store_preview_data({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/store/analysis/storeOverview');
      if (callback) callback(response);
    },
    //slodon_获取店铺总数
    * get_store_total_num({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/store/analysis/storeNum');
      if (callback) callback(response);
    },
    //slodon_获取流量总览数据
    * get_analysis_flow_overview({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/flow/analysis/flowOverview');
      if (callback) callback(response);
    },
    //slodon_获取会员总数
    * get_member_total_num({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/statistics/admin/member/analysis/memberNum');
      if (callback) callback(response);
    },
  },
};
