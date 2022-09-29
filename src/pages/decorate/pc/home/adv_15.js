/*
* 商品楼层，都是商品,效果图可以点击同名图片查看
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
import {
	add_tpl_tip,
} from '@/utils/util_data';
import global from '@/global.less';
import styles from '../pcdecorate.less';
import SldDiyMoreImgModal from '@/components/SldDiyMoreImgModal/SldDiyMoreImgModal';
import router from 'umi/router';
import SldDiyTitleLinkModal from '@/components/SldDiyTitleLinkModal/SldDiyTitleLinkModal';

let sthis = '';
let getFieldDecorator_new = '';
@connect(({ product }) => ({
	product,
}))
@Form.create()
export default class Adv_15 extends Component {
	constructor(props) {
		super(props);
		sthis = this;
		const {
			form: { getFieldDecorator },
		} = props;
		getFieldDecorator_new = getFieldDecorator;
		this.state = {
			modalTitle: '',//弹框的标题
			modal_tip: [],//弹框的提示语
			submiting: false,//按钮loading
			modalVisible: false,//是否展示modal
			modalSpuShow: false,//是否展示选择商品modal
			modalSingleImgVisible: false,//单图选择器modal是否显示
			modalSldDiyTitleLinkVisible: false,//标题链接modal是否显示
			modalComCatSelectorShow: false,//分类选择modal是否显示
			tpl_info: props.tpl_info,
			data: {
				type: 'adv_15',
				data: [{
					title_info: {
						title_name: '',//标题名称
					},
					goods_ids: [],
					goods_data: [],
				},{
					title_info: {
						title_name: '',//标题名称
					},
					goods_ids: [],
					goods_data: [],
				},{
					title_info: {
						title_name: '',//标题名称
					},
					goods_ids: [],
					goods_data: [],
				},{
					title_info: {
						title_name: '',//标题名称
					},
					goods_ids: [],
					goods_data: [],
				},{
					title_info: {
						title_name: '',//标题名称
					},
					goods_ids: [],
					goods_data: [],
				}],
			},
		};
	}


	componentDidMount() {
		let { tpl_info } = this.state;
		this.setState({
			data: tpl_info,
		});
	}

  componentWillReceiveProps(nextProps, nextContext) {
    let { data } = this.state;
    if (JSON.stringify(nextProps.tpl_info) != JSON.stringify(data)) {
      data = nextProps.tpl_info;
      this.setState({ data });
    }
  }

	componentWillUnmount() {

	}

	sldHandleCancle = () => {
		this.setState({ modalVisible: false,modalSldDiyTitleLinkVisible: false });
	};

	sldHandleConfirm = (val) => {
		let { data, cur_part } = this.state;
		if(cur_part == 'right'&&this.operate_type == ''){
			data[cur_part].data = val;
		}else{
			if(this.operate_type == 'title_info'){
				for (let i in val) {
					if (i == 'title') {
						data[cur_part][this.operate_type].title.initialValue = val.title;
					} else if (i == 'sub_title') {
						data[cur_part][this.operate_type].sub_title.initialValue = val.sub_title;
					} else if (i == 'link_type') {
						data[cur_part][this.operate_type].link_type = val.link_type;
						data[cur_part][this.operate_type].link_value = val.link_value;
						data[cur_part][this.operate_type].info = val.info != undefined ? val.info : {};
					}
				}
			}else{
				data[cur_part][this.operate_type].data = val;
			}

		}
		this.setState({
			data,
			modalVisible: false,
		}, () => {
			// this.props.save_tpl_data(data, this.refs.wrap_html.innerHTML);//保存数据
		});
	};

	//编辑板块 part：标示哪一部分，比如left，center type：某一模块下的具体部分  modalTitle：弹框的标题  modalTip：弹框的整体提示
	editTpl = (part = '',type='', modalTitle = '', modalTip = []) => {
		let { data, modalVisible, cur_data,modalSldDiyTitleLinkVisible } = this.state;
		if(part == 'right'&&type == ''){
			cur_data = data[part];
			modalVisible = true;
		}else{
			cur_data = data[part][type];
			if(type == 'title_info'){
				modalSldDiyTitleLinkVisible = true;
			}else{
				modalVisible = true;
			}

		}
		this.operate_type = type;//当前模块下的具体部分
		this.setState({
			cur_part: part,
			cur_data,
			modalVisible,
			modalSldDiyTitleLinkVisible,
			modalTitle,
			modal_tip: modalTip,
		});
	};


	render() {
		const { data, submiting, modalTitle, modalVisible, cur_data, modal_tip,modalSldDiyTitleLinkVisible } = this.state;
		return (
			<div className={`${global.common_page} ${styles.allow_show_edit}`}>
				<Fragment>
					{sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('模板编辑')}`, 0, 0, 10)}
					{showMoreHelpTip(`${sldComLanguage('操作提示')}`, add_tpl_tip())}
					{getSldEmptyH(10)}
					{/*公共功能条-start*/}
					<div className={global.operate_bg}>
						{sldIconBtn(() => router.replace(this.props.back_route), `${sldComLanguage('返回模板列表')}`, 7, 7, 15, 15, 4, 'fanhui', '#FA6F1E')}
					</div>
					{/*公共功能条-end*/}
					<div className={`${styles.diy_part_wrap} ${styles.allow_show_edit}`}>
						<div ref={'wrap_html'}>
							<div className={`${styles.w_sld_react_1210} ${styles.adv_15}`}>
								<div className={` ${styles.adv_15_wrap}`}>

									<div className={`${styles.top_title}`}>
										<h2 className={`${styles.title}`}>{sldComLanguage('添加标题')}</h2>
										<ul className={`${styles.tab_nav}`}>
											<li className={`${styles.tabs_selected}`}>
												<i className={`${styles.arrow}`}></i>
												<h3>1332</h3>
											</li>
											<li className={`${styles.arrow}`}>
												<i className="arrow"></i>
												<h3>12312</h3>
											</li>
											<li className="">
												<i className={`${styles.arrow}`}></i>
												<h3>{sldComLanguage('添加商品')}</h3>
											</li>
											<li className="">
												<i className={`${styles.arrow}`}></i>
												<h3>3333</h3>
											</li>
											<li className="">
												<i className={`${styles.arrow}`}></i>
												<h3>{sldComLanguage('添加商品')}</h3>
											</li>
										</ul>
									</div>


								</div>
							</div>
						</div>
					</div>

					<SldDiyMoreImgModal
						width={1000}
						title={modalTitle}
						sldSeleSingleRow={true}
						submiting={submiting}
						modalVisible={modalVisible}
						sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
						sldHandleCancle={this.sldHandleCancle}
						content={cur_data}
						modal_tip={modal_tip}
					/>
					{/*标题+链接设置*/}
					<SldDiyTitleLinkModal
						width={1000}
						title={modalTitle}
						sldSeleSingleRow={true}
						submiting={submiting}
						modalVisible={modalSldDiyTitleLinkVisible}
						sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
						sldHandleCancle={this.sldHandleCancle}
						content={cur_data}
						modal_tip={modal_tip}
					/>
					{/*标题+链接设置*/}
				</Fragment>
			</div>
		);
	}
}
