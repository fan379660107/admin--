import { sldCommonService } from '@/utils/utils';

export default {
	namespace: 'pc_home',
	state: {
		loading: false,//加载状态
		data: {
			list: [],
			pagination: {},
		},
	},

	effects: {
	  //slodon_获取pc首页弹层广告
		* get_modal_adv({ payload, callback }, { call }) {
			const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/pcFirstAdv/get');
			if (callback) callback(response);
		},
		//slodon_更新pc首页弹层广告
		* save_modal_adv({ payload, callback }, { call }) {
			const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/pcFirstAdv/update');
			if (callback) callback(response);
		},
		//slodon_获取mall端装修模板类型列表
		* get_tpl_type_list({ payload, callback }, { call }) {
			const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/tplPc/type/list');
			if (callback) callback(response);
		},
		//slodon_获取mall端装修模板列表
		* get_tpl_list({ payload, callback }, { call }) {
			const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/tplPc/list');
			if (callback) callback(response);
		},
		//slodon_添加mall端装修实例化模板数据
		* add_instance_tpl({ payload, callback }, { call }) {
			const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/tplPc/data/add');
			if (callback) callback(response);
		},
		//slodon_修改mall端装修实例化模板数据
		* edit_instance_tpl({ payload, callback }, { call }) {
			const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/tplPc/data/update');
			if (callback) callback(response);
		},
		//slodon_获取mall端装修实例化模板数据列表
		* get_tpl_instance_list({ payload, callback }, { call }) {
			const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/tplPc/data/list');
			if (callback) callback(response);
		},
		//slodon_删除mall端装修实例化模板数据
		* del_instance_tpl({ payload, callback }, { call }) {
			const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/tplPc/data/del');
			if (callback) callback(response);
		},
		//slodon_启/停用mall端装修实例化模板数据
		* enable_instance_tpl({ payload, callback }, { call }) {
			const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/tplPc/data/isEnable');
			if (callback) callback(response);
		},
		//slodon_修改mall端装修实例化模板数据
		* save_instance_tpl_data({ payload, callback }, { call }) {
			const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/tplPc/data/update');
			if (callback) callback(response);
		},
		//slodon_获取mall端装修页列表
		* get_diy_page_list({ payload, callback }, { call }) {
			const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/pcDeco/list');
			if (callback) callback(response);
		},
		//slodon_添加mall端装修页
		* add_diy_page({ payload, callback }, { call }) {
			const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/pcDeco/add');
			if (callback) callback(response);
		},
		//slodon_修改mall端装修页
		* edit_diy_page({ payload, callback }, { call }) {
			const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/pcDeco/update');
			if (callback) callback(response);
		},
		//slodon_删除mall端装修页
		* del_diy_page({ payload, callback }, { call }) {
			const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/pcDeco/del');
			if (callback) callback(response);
		},
		//slodon_启用/禁用mall端装修页
		* enable_diy_page({ payload, callback }, { call }) {
			const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/pcDeco/isEnable');
			if (callback) callback(response);
		},
		//slodon_获取mall端装修页详细数据
		* get_diy_page_detial({ payload, callback }, { call }) {
			const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/pcDeco/display');
			if (callback) callback(response);
		},
		//slodon_获取模板类型下的实例化模板列表
		* get_tpl_instance_list_allow_use({ payload, callback }, { call }) {
			const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/tplPc/data/list');
			if (callback) callback(response);
		},
		//slodon_复制mall端实例化模板
		* copy_instance_tpl({ payload, callback }, { call }) {
			const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/tplPc/data/copy');
			if (callback) callback(response);
		},
		//slodon_复制mall端装修页
		* copy_diy_page({ payload, callback }, { call }) {
			const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/pcDeco/copy');
			if (callback) callback(response);
		},
		//slodon_修改mall端装修页
		* save_diy_page_data({ payload, callback }, { call }) {
			const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/pcDeco/update');
			if (callback) callback(response);
		},
		//slodon_获取首页导航列表
		* get_home_nav_list({ payload, callback }, { call }) {
			const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/navigation/list');
			if (callback) callback(response);
		},
		//slodon_新增首页导航
		* add_home_nav({ payload, callback }, { call }) {
			const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/navigation/add');
			if (callback) callback(response);
		},
		//slodon_编辑首页导航
		* edit_home_nav({ payload, callback }, { call }) {
			const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/navigation/update');
			if (callback) callback(response);
		},
    //slodon_首页导航_开关
		* switch_home_nav({ payload, callback }, { call }) {
			const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/navigation/isShow');
			if (callback) callback(response);
		},
		//slodon_删除首页导航
		* del_home_nav({ payload, callback }, { call }) {
			const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/navigation/del');
			if (callback) callback(response);
		},
    //slodon_获取页脚列表
    * get_home_footer_list({ payload, callback }, { call, put }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/cms/admin/friendLink/list');
      if (callback) callback(response);
    },
    //slodon_添加页脚
    * add_home_footer({ payload, callback }, { call, put }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/cms/admin/friendLink/add');
      if (callback) callback(response);
    },
    //slodon_编辑页脚
    * edit_home_footer({ payload, callback }, { call, put }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/cms/admin/friendLink/edit');
      if (callback) callback(response);
    },
    //slodon_删除页脚
    * del_home_footer({ payload, callback }, { call, put }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/cms/admin/friendLink/del');
      if (callback) callback(response);
    },
	},
};
