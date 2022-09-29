/*
* 首页开屏图设置
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, } from 'antd';
import {
	failTip,
	sucTip,
	sldEmptyHandle2,
	sldComLanguage,
  showMoreHelpTip,
  getSldEmptyH,
} from '@/utils/utils';
import {  pc_home_adv_tip } from '@/utils/util_data';
import global from '@/global.less';
import styles from '../pcdecorate.less';
import SldHomeSetting from '@/components/SldHomeSetting/SldHomeSetting';

let sthis = '';
let getFieldDecorator_new = '';
const advType = 1;//广告类型,1-弹层广告，2-顶部广告
@connect(({ pc_home }) => ({
	pc_home,
}))
@Form.create()
export default class OpeningAdv extends Component {
	constructor(props) {
		super(props);
		sthis = this;
		const {
			form: { getFieldDecorator },
		} = props;
		getFieldDecorator_new = getFieldDecorator;
		this.state = {
			cur_index: '',//当前操作数据的index
			cur_data: {},//当前操作的数据
			tpl_adv_01_modal_tip: [],//modal框提示
			submiting: false,//按钮loading
			modalVisible: false,//是否展示modal
			modal_adv_data: {
				type: 'home_modal_adv',
				width: 500,
				height: 320,
				data: {},
			},//首页开屏幕图设置
			data: {
				type: 'single_img',
				width: 1920,
				height: 457,//高度为0的话表示不限制
				data: [],
			},//装修的数据

		};
	}

	cur_flash_id = '';//当前操作的轮播图id
	modal_adv_id = '';//开屏图的id

	componentDidMount() {
		this.get_modal_adv();
	}

	componentWillUnmount() {

	}

	get_modal_adv = () => {
		const { dispatch } = this.props;
		dispatch({
			type: 'pc_home/get_modal_adv',
      payload: {type: advType},
			callback: (res) => {
				if (res.state == 200) {
					this.modal_adv_id = res.data.advId;
					this.cur_flash_id = '';
					this.editModaldv(JSON.parse(res.data.data.replace(/&quot;/g,"\"")));
				}
			},
		});
	};


	//设置首页开屏图事件
	editModaldv = (res) => {
		let { modal_adv_data } = this.state;
		let tmp_data = {};
		tmp_data.width = modal_adv_data.width;
		tmp_data.height = modal_adv_data.height;
		tmp_data.source = 'home_modal_adv';
		tmp_data.data = {
			imgUrl: sldEmptyHandle2(res.imgUrl),
			imgPath: sldEmptyHandle2(res.imgPath),
			title: '',
			link_type: sldEmptyHandle2(res.link_type),
			link_value: sldEmptyHandle2(res.link_value),
			show_switch: sldEmptyHandle2(res.show_switch),//弹出广告开关
			show_radio_sele: sldEmptyHandle2(res.show_radio_sele),//弹出方式，one只有一次 more多次
		};
		this.setState({
			cur_data: tmp_data,
			modalVisible: true,
			modal_tip: pc_home_adv_tip(),
			title: `${sldComLanguage('设置首页开屏图')}`,//设置首页开屏图
		});

	};

	//保存开屏设置
	save_modal_adv = (val) => {
		const { dispatch } = this.props;
		let {modalVisible} = this.state;
		dispatch({
			type: 'pc_home/save_modal_adv',
			payload: { data: JSON.stringify(val), advId: this.modal_adv_id },
			callback: (res) => {
				if (res.state == 200) {
					sucTip(res.msg);
				} else {
					failTip(res.msg);
				}
				this.setState({modalVisible:!modalVisible})
			},
		});
	};

	sldHandleConfirm = (val) => {
		if (this.modal_adv_id != '') {
			//保存开屏图设置
			let {cur_data} = this.state;
			cur_data.data = val;
			this.setState({cur_data})
			this.save_modal_adv(val);
		}
	};

	sldHandleCancle = () => {
		this.setState({ modalVisible: false });
	};

	render() {
		const { submiting, modalVisible, modal_tip, cur_data, title } = this.state;
		return (
			<div className={`${global.common_page} ${styles.allow_show_edit}`}>
        {showMoreHelpTip(``, pc_home_adv_tip(), 0)}
        {getSldEmptyH(10)}
				<SldHomeSetting
					width={1000}
					title={title}
					sldSeleSingleRow={true}
					submiting={submiting}
					modalVisible={modalVisible}
					sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
					sldHandleCancle={this.sldHandleCancle}
					content={cur_data}
					modal_tip={modal_tip}
				/>
			</div>

		);
	}
}
