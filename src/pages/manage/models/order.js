import { sldCommonService } from '@/utils/utils';

export default {
    namespace: 'order',
    state: {
        loading: false,//加载状态
        data: {
            list: [],
            pagination: {},
        },
    },

    effects: {
        //slodon_获取订单列表
        * get_order_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/business/admin/orderInfo/list');
            if (callback) callback(response);
        },
        //slodon_获取订单详情
        * get_order_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/business/admin/orderInfo/detail');
            if (callback) callback(response);
        },
        //slodon_订单确认收款操作(货到付款)
        * confirm_order_paid({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', '/v1/admin/order/payConfirm');
            if (callback) callback(response);
        },
        //slodon_获取退货订单列表
        * get_order_return_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', '/v1/admin/order/productReturnList');
            if (callback) callback(response);
        },
        //slodon_获取换货订单列表
        * get_order_exchange_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', '/v1/admin/order/productExchangeList');
            if (callback) callback(response);
        },
        ////slodon_退款到账户
        * confirm_return_to_account({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', '/v1/admin/order/productReturnMoneyConfirm');
            if (callback) callback(response);
        },
        //slodon_获取投诉订单列表
        * get_complain_order_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', '/v1/admin/order/complaint/list');
            if (callback) callback(response);
        },
        //slodon_投诉订单审核操作
        * check_complain_order({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', '/v1/admin/order/complaint/isAudit');
            if (callback) callback(response);
        },
        //slodon_投诉订单重置操作
        * reset_complain_order({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', '/v1/admin/order/complaint/doReset');
            if (callback) callback(response);
        },
        //slodon_导出订单操作
        * export_order({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', '/v1/admin/excel/exportExcel');
            if (callback) callback(response);
        },
        //slodon_获取订单取消/退换货理由
        * order_reason({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v1/admin/shop/reason/afsReasonList');
            if (callback) callback(response);
        },
        //slodon_添加订单理由
        * add_order_reason({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v1/admin/shop/reason/add');
            if (callback) callback(response);
        },
        //slodon_编辑订单理由
        * edit_order_reason({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v1/admin/shop/reason/update');
            if (callback) callback(response);
        },
        //slodon_删除订单理由
        * del_order_reason({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v1/admin/shop/reason/delete');
            if (callback) callback(response);
        },
        //slodon_是否显示订单理由
        * switch_order_reason({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v1/admin/shop/reason/isShow');
            if (callback) callback(response);
        },
        //slodon_退款列表
        *get_refund_list({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/business/admin/after/sale/list');
            if (callback) callback(response);
        },
        //slodon_退款/退货详情
        *get_refund_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/business/admin/after/sale/detail');
            callback && callback(response);
        },
        //slodon_平台确认退款退货，确认通过后可打款
        *confirm_return({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/business/admin/after/sale/confirmRefund');
            callback && callback(response);
        },
        //slodon_退货退款 申请发地址
        *orderreturn_audit({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v1/admin/shop/orderReturn/audit');
            callback && callback(response);
        },
        //slodon_退货退款 申请退货退款后的两个接口 v1/admin/shop/orderReturn/productReturnMoneyConfirm
        *confirm_returnMony({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v1/admin/shop/orderReturn/productReturnMoneyConfirm');
            callback && callback(response);
        },
        //slodon_获取平台退货地址列表
        * get_return_address_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v1/admin/setting/systemAddress/list');
            if (callback) callback(response);
        },
        //slodon_获取物流轨迹
        *get_flow({ payload, callback },{ call }){
            const response = yield call(sldCommonService, payload, 'get', 'v3/business/admin/logistics/order/getTrace');
            callback && callback(response);
        },
        //slodon_取消订单接口
        *cancleOrder({ payload, callback },{ call }){
            const response = yield call(sldCommonService, payload, 'post', 'v1/admin/shop/order/cancelOrder');
            callback && callback(response);
        },
        //slodon_确认发货
        *confirmDelivery({ payload, callback },{ call }){
            const response = yield call(sldCommonService, payload, 'post', 'v1/admin/shop/order/delivery');
            callback && callback(response);
        },
        //slodon_获取快递公司
        *get_express({ payload, callback },{ call }){
            const response = yield call(sldCommonService, payload, 'get', 'v1/admin/setting/expressCompany/list');
            callback && callback(response);
        },
        //slodon_订单导出
        *export_order_lists({ payload, callback },{ call }){
            const response = yield call(sldCommonService, payload, 'get', 'v3/business/admin/orderInfo/export');
            callback && callback(response);
        }
    },
};
