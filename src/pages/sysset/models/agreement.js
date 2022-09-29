import { sldCommonService } from '@/utils/utils';

export default {
	namespace: 'agreement',
	state: {
		loading: false,//加载状态
		data: {
			list: [],
			pagination: {},
		},
	},

	effects: {
		//slodon_获取协议列表
		* get_agreement_lists({ payload, callback }, { call }) {
			const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/agreement/list');
			if (callback) callback(response);
		},
		//slodon_获取协议详情
		* get_agreement_detail({ payload, callback }, { call }) {
			const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/agreement/detail');
			if (callback) callback(response);
		},
		//slodon_编辑协议
		* update_agreement({ payload, callback }, { call }) {
			const response = yield call(sldCommonService, payload, 'post', 'v3/system/admin/agreement/update');
			if (callback) callback(response);
		},
	},
};
