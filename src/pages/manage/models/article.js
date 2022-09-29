import { sldCommonService } from '@/utils/utils';

export default {
  namespace: 'article',
  state: {
    loading: false,//加载状态
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    //slodon_获取文章分类列表
    * get_article_cat_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/cms/admin/articleCategory/list');
      if (callback) callback(response);
    },
    //slodon_添加文章分类
    * add_article_cat({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/cms/admin/articleCategory/add');
      if (callback) callback(response);
    },
    //slodon_编辑文章分类
    * edit_article_cat({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/cms/admin/articleCategory/edit');
      if (callback) callback(response);
    },
    //slodon_删除文章分类
    * del_article_cat({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/cms/admin/articleCategory/del');
      if (callback) callback(response);
    },
    //slodon_获取文章列表
    * get_article_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/cms/admin/article/list');
      if (callback) callback(response);
    },
    //slodon_添加文章
    * add_article({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/cms/admin/article/add');
      if (callback) callback(response);
    },
    //slodon_编辑文章
    * edit_article({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/cms/admin/article/edit');
      if (callback) callback(response);
    },
    //slodon_删除文章
    * del_article({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/cms/admin/article/del');
      if (callback) callback(response);
    },
    //slodon_获取文章详情
    * get_article_detail({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/cms/admin/article/detail');
      if (callback) callback(response);
    },
  },
};
