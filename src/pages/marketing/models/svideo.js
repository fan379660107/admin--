import { sldCommonService } from '@/utils/utils';

export default {
  namespace: 'svideo',
  state: {
    loading: false,//加载状态
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    // slodon_获取短视频配置
    * get_svideo_setting({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/video/admin/video/setting/getSettingList');
      callback && callback(response);
    },
    // slodon_获取短视频标签列表
    * get_label_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/video/admin/video/label/list');
      callback && callback(response);
    },
    // slodon_删除短视频标签
    * del_label({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/video/admin/video/label/del');
      callback && callback(response);
    },
    // slodon_添加短视频标签
    * add_label({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/video/admin/video/label/add');
      callback && callback(response);
    },
    // slodon_编辑短视频标签
    * edit_label({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/video/admin/video/label/update');
      callback && callback(response);
    },
    // slodon_更改短视频标签状态
    * switch_label({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/video/admin/video/label/isShow');
      callback && callback(response);
    },
    // slodon_获取作者列表
    * get_author_lists({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/video/admin/video/author/list');
      callback && callback(response);
    },
    // slodon_修改作者的发布状态
    * update_author_state({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/video/admin/video/author/isPublish');
      callback && callback(response);
    },
    // slodon_审核作者
    * check_author({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/video/admin/video/author/audit');
      callback && callback(response);
    },
    // slodon_获取短视频列表
    * get_video_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/video/admin/video/list');
      callback && callback(response);
    },
    // slodon_删除短视频
    * del_video({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/video/admin/video/del');
      callback && callback(response);
    },
    // slodon_更新短视频状态
    * update_video_state({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/video/admin/video/isShow');
      callback && callback(response);
    },
    // slodon_获取视频绑定的商品
    * get_video_goods({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/video/admin/video/goodsList');
      callback && callback(response);
    },
    // slodon_视频审核
    * check_video({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/video/admin/video/audit');
      callback && callback(response);
    },
    // slodon_删除视频评论
    * del_video_comment({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/video/admin/video/comment/del');
      callback && callback(response);
    },
    // slodon_获取单个视频的所有评论
    * get_video_comments({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/video/admin/video/comment/commentList');
      callback && callback(response);
    },
    // slodon_获取一条评论的所有回复
    * del_video_comment_and_reply({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/video/admin/video/comment/delComment');
      callback && callback(response);
    },
    // slodon_获取单条回复
    * del_video_comment_reply({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/video/admin/video/comment/delReply');
      callback && callback(response);
    },
    // slodon_获取评论的所有回复
    * get_video_comment_reply({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/video/admin/video/comment/replyList');
      callback && callback(response);
    },
    // slodon_获取评论视频列表
    * get_comment_video_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/video/admin/video/comment/list');
      callback && callback(response);
    },
    // slodon_获取推荐主题列表
    * get_theme_list({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/video/admin/video/theme/list');
      callback && callback(response);
    },
    // slodon_添加推荐主题列表
    * add_theme({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/video/admin/video/theme/add');
      callback && callback(response);
    },
    // slodon_编辑推荐主题列表
    * edit_theme({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/video/admin/video/theme/update');
      callback && callback(response);
    },
    // slodon_获取推荐主题详情
    * get_theme_detail({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/video/admin/video/theme/detail');
      callback && callback(response);
    },
    // slodon_删除推荐主题
    * del_theme({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/video/admin/video/theme/del');
      callback && callback(response);
    },
    // slodon_推荐主题开关
    * switch_theme({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/video/admin/video/theme/isShow');
      callback && callback(response);
    },
    // slodon_获取主题绑定的视频列表
    * get_theme_bind_video({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/video/admin/video/theme/videoList');
      callback && callback(response);
    },
    // slodon_删除主题绑定的视频
    * del_theme_video({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/video/admin/video/theme/delVideo');
      callback && callback(response);
    },
  },
};
