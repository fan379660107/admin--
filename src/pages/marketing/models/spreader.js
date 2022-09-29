import { sldCommonService } from '@/utils/utils';

export default {
  namespace: 'spreader',
  state: {
    loading: false,//加载状态
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    //slodon_获取问题分类列表
    * get_category_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/spreader/admin/problemCategory/list');
      if (callback) callback(response);
    },
    //slodon_新增问题分类列表
    * add_problem_category({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/spreader/admin/problemCategory/add');
      if (callback) callback(response);
    },
    //slodon_编辑问题分类列表
    * edit_problem_category({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/spreader/admin/problemCategory/update');
      if (callback) callback(response);
    },
    //slodon_删除问题分类列表
    * del_problem_category({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/spreader/admin/problemCategory/delete');
      if (callback) callback(response);
    },
    //slodon_获取问题列表
    * get_problem_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/spreader/admin/problem/list');
      if (callback) callback(response);
    },
    //slodon_新增问题
    * add_problem({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/spreader/admin/problem/add');
      if (callback) callback(response);
    },
    //slodon_编辑问题
    * edit_problem({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/spreader/admin/problem/update');
      if (callback) callback(response);
    },
    //slodon_删除问题
    * del_problem({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/spreader/admin/problem/delete');
      if (callback) callback(response);
    },
    //slodon_是否显示问题
    * is_show_problem({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/spreader/admin/problem/isShow');
      if (callback) callback(response);
    },
    // slodon_获取问题详情
    * get_problem_detail({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/spreader/admin/problem/detail');
      callback && callback(response);
    },
    // slodon_获取商品标签列表
    * get_label_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/spreader/admin/spreaderGoodsLabel/list');
      callback && callback(response);
    },
    // slodon_删除商品标签
    * del_label({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/spreader/admin/spreaderGoodsLabel/del');
      callback && callback(response);
    },
    // slodon_添加商品标签
    * add_label({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/spreader/admin/spreaderGoodsLabel/add');
      callback && callback(response);
    },
    // slodon_编辑商品标签
    * edit_label({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/spreader/admin/spreaderGoodsLabel/update');
      callback && callback(response);
    },
    // slodon_更改商品标签状态
    * switch_label({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/spreader/admin/spreaderGoodsLabel/isShow');
      callback && callback(response);
    },
    // slodon_获取等级列表
    * get_member_grade_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/spreader/admin/spreaderGrade/list');
      callback && callback(response);
    },
    // slodon_添加推手等级
    * add_member_grade({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/spreader/admin/spreaderGrade/add');
      callback && callback(response);
    },
    // slodon_编辑推手等级
    * edit_member_grade({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/spreader/admin/spreaderGrade/update');
      callback && callback(response);
    },
    // slodon_删除推手等级
    * del_member_grade({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/spreader/admin/spreaderGrade/del');
      callback && callback(response);
    },
    // slodon_获取推手列表
    * get_member_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/spreader/admin/spreader/list');
      callback && callback(response);
    },
    // slodon_获取推手审核列表
    * get_member_check_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/spreader/admin/auditSpreader/list');
      callback && callback(response);
    },
    // slodon_推手审核
    * check_member({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/spreader/admin/auditSpreader/audit');
      callback && callback(response);
    },
    // slodon_推手审核删除
    * check_member_del({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/spreader/admin/auditSpreader/del');
      callback && callback(response);
    },
    // slodon_获取商品列宾
    * get_goods_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/spreader/admin/spreaderGoods/list');
      callback && callback(response);
    },
    // slodon_获取下级推手列表
    * get_member_invitation_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/spreader/admin/spreader/invitationList');
      callback && callback(response);
    },
    // slodon_获取订单列表
    * get_order_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/spreader/admin/spreaderOrderExtend/list');
      callback && callback(response);
    },
  },
};
