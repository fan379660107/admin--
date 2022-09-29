import { sldCommonService } from '@/utils/utils';

export default {
  namespace: 'commonMDiy',
  state: {
    loading: false,// 加载状态
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    //slodon_手机装修_获取装修页列表
    * get_diy_page_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/mobileDeco/list');
      if (callback) callback(response);
    },
    //slodon_手机装修_添加移动端装修页面
    * add_m_diy_page({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/mobileDeco/add');
      if (callback) callback(response);
    },
    //slodon_手机装修_编辑移动端装修页面
    * edit_m_diy_page({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/mobileDeco/update');
      if (callback) callback(response);
    },
    //slodon_手机装修_删除移动端装修页面
    * del_m_diy_page({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/mobileDeco/del');
      if (callback) callback(response);
    },
    //slodon_手机装修_启用/停用移动端装修页面
    * set_m_diy_page({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/mobileDeco/isUse');
      if (callback) callback(response);
    },
    //slodon_手机装修_复制移动端装修页面
    * copy_m_diy_page({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/mobileDeco/copy');
      if (callback) callback(response);
    },
    //slodon_手机装修_获取移动端装修页面详情
    * get_diy_page_detail({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/mobileDeco/detail');
      if (callback) callback(response);
    },
    //slodon_手机装修_获取移动端装修页面菜单数据
    * get_m_diy_menu({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/tplMobile/menu');
      if (callback) callback(response);
    },
    //slodon_手机装修_获取分类列表
    * get_m_diy_cat({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/goods/admin/goodsCategory/list');
      if (callback) callback(response);
    },
    //slodon_获取分类列表_根据分类id获取下级分类
    * get_cate_list_by_id({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', `v3/goods/admin/goodsCategory/list`);
      if (callback) callback(response);
    },
    //slodon_编辑分类图片
    * edit_cate_img({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goodsCategory/edit`);
      if (callback) callback(response);
    },
  },
};
