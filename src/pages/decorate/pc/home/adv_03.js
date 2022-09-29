/*
* 装修板块2，左侧一个图片，中间4个商品，右侧3个图片
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form } from 'antd';
import {
	sldIconBtn,
	sldLlineRtextAddGoodsAddMargin,
	showMoreHelpTip,
	getSldEmptyH,
	sldComLanguage,
} from '@/utils/utils';
import { add_tpl_tip } from '@/utils/util_data';
import global from '@/global.less';
import styles from '../pcdecorate.less';
import SldDiyMoreImgModal from '@/components/SldDiyMoreImgModal/SldDiyMoreImgModal';
import SldDiySingleImgModal from '@/components/SldDiySingleImgModal/SldDiySingleImgModal';
import SldSelGoodsMore from '@/components/SldSelGoodsMore';
import router from 'umi/router';

let sthis = '';
let getFieldDecorator_new = '';
@connect(({ product }) => ({
	product,
}))
@Form.create()
export default class Adv_03 extends Component {
	constructor(props) {
		super(props);
		sthis = this;
		const {
			form: { getFieldDecorator },
		} = props;
		getFieldDecorator_new = getFieldDecorator;
		this.state = {
			modal_tip: [],//弹框的提示语
			modalTitle: '',//弹框的标题
			cur_sele_goods: [],//当前选择的商品数据
			cur_sele_goods_ids: [],//当前选择商品id数组
			cur_part: '',//当前操作的部分，比如left，center，right
			cur_data: {},//当前操作数据
			cur_data1: {},//当前操作数据
			submiting: false,//按钮loading
			modalVisible: false,//是否展示modal
			modalSpuShow: false,//是否展示选择商品modal
			modalSingleImgVisible: false,//单图选择器modal是否显示
			tpl_info: props.tpl_info,
			data: {
				type: 'adv_02',
				left: {
					type: 'single_img',
					width: 210,
					height: 344,//高度为0的话表示不限制
					data: {
						imgUrl: 'https://img.alicdn.com/simba/img/TB1jsBeKYPpK1RjSZFFSuu5PpXa.jpg',
						imgPath: '/images/brand/3e56e20d-453d-4cf8-906f-a928de37ce6a.png',
						title: '',
						link_type: '',
						link_value: '',
					},
				},//左侧图片信息
				center: {
					type: 'goods',
					data: {
						goods_ids: [],
						goods_data: [],
					},
				},//中间商品信息
				right: {
					type: 'more_img',
					width: 242,
					height: 108,
					data: [{
						imgUrl: 'https://img.alicdn.com/simba/img/TB1jsBeKYPpK1RjSZFFSuu5PpXa.jpg',
						imgPath: '/images/brand/3e56e20d-453d-4cf8-906f-a928de37ce6a.png',
						title: '',
						link_type: '',
						link_value: '',
					},
						{
							imgUrl: 'http://img.slodon.cn/data/upload/mobile/special/s1549014137/s1549014137_06023581370067902.jpg',
							imgPath: '/images/brand/3e56e20d-453d-4cf8-906f-a928de37ce6a.png',
							title: '',
							link_type: '',
							link_value: '',
						}, {
							imgUrl: 'http://img.slodon.cn/data/upload/mobile/special/s1549014141/s1549014141_06023581415508567.jpg',
							imgPath: '/images/brand/3e56e20d-453d-4cf8-906f-a928de37ce6a.png',
							title: '',
							link_type: '',
							link_value: '',
						}],
				},//右侧图片信息
			},//装修的数据

		};
	}

	sele_goods_param = {
		type: 'common',
		total_num: 0,
	};//商品选择器参数


	componentDidMount() {

	}

	componentWillUnmount() {

	}

	//编辑板块 part：标示哪一部分，比如left，center  modalTitle：弹框的标题  modalTip：弹框的整体提示
	editTpl = (part, modalTitle = '', modalTip = []) => {
		let { data, modalVisible, modalSpuShow, cur_sele_goods, cur_sele_goods_ids, modalSingleImgVisible } = this.state;
		if (data[part].type == 'goods') {
			modalSpuShow = true;
			cur_sele_goods = data[part].data.goods_data;
			cur_sele_goods_ids = data[part].data.goods_ids;
			this.sele_goods_param.total_num = 4;
		} else if (data[part].type == 'single_img') {
			modalSingleImgVisible = true;
		} else {
			modalVisible = true;
		}
		this.setState({
			cur_part: part,
			cur_data: data[part],
			modalVisible,
			modalSpuShow,
			cur_sele_goods,
			cur_sele_goods_ids,
			modalSingleImgVisible,
			modalTitle: modalTitle,
			modal_tip: modalTip,
		});
	};

	sldHandleConfirm = (val) => {
		let { cur_part, data } = this.state;
		data[cur_part].data = val;
		this.setState({
			data,
			modalVisible: false,
		}, () => {
			this.props.save_tpl_data(data, this.refs.wrap_html.innerHTML);//保存数据
		});
	};

	sldHandleCancle = () => {
		this.setState({ modalVisible: false, modalSingleImgVisible: false, modalSpuShow: false });
	};

	//选中spu事件
	seleSpu = (selectedRows, selectedRowKeys) => {
		let { data, cur_part } = this.state;
		data[cur_part].data.goods_ids = selectedRowKeys;
		data[cur_part].data.goods_data = selectedRows;
		this.setState({ data }, () => {
			this.props.save_tpl_data(data, this.refs.wrap_html.innerHTML);//保存数据
		});
	};

	render() {
		const { data, submiting, modalVisible, cur_data, modalSpuShow, cur_sele_goods, cur_sele_goods_ids, modalSingleImgVisible, modalTitle, modal_tip } = this.state;
		return (
			<Fragment>
				{sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('商品楼层（楼层类型）—楼层具体的名称')}`, 0, 0, 10)}
				{showMoreHelpTip(`${sldComLanguage('操作提示')}`, add_tpl_tip())}
				{getSldEmptyH(10)}
				{/*公共功能条-start*/}
				<div className={global.operate_bg}>
					{sldIconBtn(() => router.replace(this.props.back_route), `${sldComLanguage('返回')}${sldComLanguage('模板列表')}`, 7, 7, 15, 15, 4, 'fanhui', '#FA6F1E')}
				</div>
				{/*公共功能条-end*/}
				<div className={styles.diy_part_wrap}>

				</div>
				<SldDiySingleImgModal
					width={1000}
					title={modalTitle}
					sldSeleSingleRow={true}
					submiting={submiting}
					modalVisible={modalSingleImgVisible}
					sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
					sldHandleCancle={this.sldHandleCancle}
					content={cur_data}
					modal_tip={modal_tip}
				/>
				<SldDiyMoreImgModal
					width={900}
					title={modalTitle}
					sldSeleSingleRow={true}
					submiting={submiting}
					modalVisible={modalVisible}
					sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
					sldHandleCancle={this.sldHandleCancle}
					content={cur_data}
					modal_tip={modal_tip}
				/>

				{/*添加spu的modal框-start*/}
				<SldSelGoodsMore selectedRows={cur_sele_goods} selectedRowKeys={cur_sele_goods_ids}
								  modalAddSkuIsShow={modalSpuShow} width={1000}
								  sldHandleAddSkuModalCancle={this.sldHandleCancle} seleSku={this.seleSpu}
								  modaltitle={modalTitle} extra={this.sele_goods_param}/>
				{/*添加spu的modal框-end*/}
			</Fragment>
		);
	}
}
