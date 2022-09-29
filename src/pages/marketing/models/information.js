import { sldCommonService } from '@/utils/utils';

export default {
	namespace: 'information',
	state: {
		loading: false,//加载状态
		data: {
			list: [],
			pagination: {},
		},
	},

	effects: {
        //获取通知中心列表接口
		*get_infoModal({ payload, callback },{ call }){
            const response = yield call(sldCommonService, payload, 'get', 'v1/admin/operation/msgCenter/list');
            callback && callback(response);
        },
        //获取通知中心通知类型模板
        *get_infoTypeModal({ payload, callback },{ call }){
            const response = yield call(sldCommonService, payload, 'get', 'v1/admin/operation/msgCenter/msgTplTypeList');
            callback && callback(response);
        },
        //批量标为已读接口
        *all_readModal({ payload, callback },{ call }){
            const response = yield call(sldCommonService, payload, 'post', 'v1/admin/operation/msgCenter/batchMarkedRead');
            callback && callback(response);
        },
        //批量标为删除接口
        *all_delModal({ payload, callback },{ call }){
            const response = yield call(sldCommonService, payload, 'post', 'v1/admin/operation/msgCenter/batchDelete');
            callback && callback(response);
        },
        //资产明细列表
        *getassetListModal({ payload, callback },{ call }){
            const response = yield call(sldCommonService, payload, 'get', 'v1/admin/operation/assetDetail/list');
            callback && callback(response);
        },
        //资产明细收入信息
        *getincomeInfo({ payload, callback },{ call }){
            const response = yield call(sldCommonService, payload, 'get', 'v1/admin/operation/assetDetail/incomeInfo');
            callback && callback(response);
        }
	},
};
