/*
* 由三列组成，每列都是由图片布局组成，右侧部分可以添加标题,效果图可以点击同名图片查看
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form } from 'antd';
import {
	sldComLanguage,
} from '@/utils/utils';
import styles from '../pcdecorate.less';
import SldDiyMoreImgModal from '@/components/SldDiyMoreImgModal/SldDiyMoreImgModal';
import SldDiyTitleLinkModal from '@/components/SldDiyTitleLinkModal/SldDiyTitleLinkModal';

let sthis = '';
let getFieldDecorator_new = '';
@connect(({ product }) => ({
	product,
}))
@Form.create()
export default class Adv_12 extends Component {
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
				type: 'adv_12',
				left: {
					width: 396,
					height: 450,//高度为0的话表示不限制
					data: [{
						imgUrl: '',
						imgPath: '',
						title: '',
						link_type: '',
						link_value: '',
						info: {},
					}],
				},
				center: {
					width: 183,
					height: 210,//高度为0的话表示不限制
					data: [{
						imgUrl: '',
						imgPath: '',
						title: '',
						link_type: '',
						link_value: '',
						info: {},
					}, {
						imgUrl: '',
						imgPath: '',
						title: '',
						link_type: '',
						link_value: '',
						info: {},
					}, {
						imgUrl: '',
						imgPath: '',
						title: '',
						link_type: '',
						link_value: '',
						info: {},
					}, {
						imgUrl: '',
						imgPath: '',
						title: '',
						link_type: '',
						link_value: '',
						info: {},
					}],
				},
				right: {
					title_info: {
						title: {
							label: `${sldComLanguage('标题')}`,
							name: 'title',
							initialValue: `${sldComLanguage('清仓打折')}`,
							required: true,
						},
						sub_title: {
							label: `${sldComLanguage('子标题')}`,
							name: 'sub_title',
							initialValue: `${sldComLanguage('清仓打折')}`,
							required: false,
						},//子标题名称
						link_type: '',
						link_value: '',
						info: {},
					},
					top: {
						width: 376,
						height: 180,//高度为0的话表示不限制
						data: [{
							imgUrl: '',
							imgPath: '',
							title: '',
							link_type: '',
							link_value: '',
							info: {},
						}],
					},
					bottom: {
						width: 183,
						height: 180,//高度为0的话表示不限制
						data: [{
							imgUrl: '',
							imgPath: '',
							title: '',
							link_type: '',
							link_value: '',
							info: {},
						}, {
							imgUrl: '',
							imgPath: '',
							title: '',
							link_type: '',
							link_value: '',
							info: {},
						}],
					},

				},
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
		if(cur_part == 'right_top'){
			data['right']['top'].data = val;
		}else if(cur_part == 'right_bottom'){
			data['right']['bottom'].data = val;
		}else if(cur_part == 'right_title'){
			for (let i in val) {
				if (i == 'title') {
					data['right']['title_info'].title.initialValue = val.title;
				} else if (i == 'sub_title') {
					data['right']['title_info'].sub_title.initialValue = val.sub_title;
				} else if (i == 'link_type') {
					data['right']['title_info'].link_type = val.link_type;
					data['right']['title_info'].link_value = val.link_value;
					data['right']['title_info'].info = val.info != undefined ? val.info : {};
				}
			}
		}else{
			data[cur_part].data = val;
		}
		this.setState({
			data,
			modalVisible: false,
		}, () => {
			this.props.save_tpl_data(data, this.refs.wrap_html.innerHTML);//保存数据
		});
	};

	//编辑板块 part：标示哪一部分，比如left，center  modalTitle：弹框的标题  modalTip：弹框的整体提示
	editTpl = (part = '', modalTitle = '', modalTip = []) => {
		let { data, modalVisible, cur_data,modalSldDiyTitleLinkVisible } = this.state;
		if(part == 'right_top'){
			cur_data = data['right']['top'];
			modalVisible = true;
		}else if(part == 'right_bottom'){
			cur_data = data['right']['bottom'];
			modalVisible = true;
		}else if(part == 'right_title'){
			//编辑标题
			cur_data = data['right']['title_info'];
			modalSldDiyTitleLinkVisible = true;
		}else{
			cur_data = data[part];
			modalVisible = true;
		}
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
				<Fragment>
					<div ref={'wrap_html'}>
						<div className={`${styles.w_sld_react_1210} ${styles.adv_12}`}>
							<div className={` ${styles.adv_12_wrap}`}>
								<div className={`${styles.item} ${styles.left} ${styles.clear_padding}`}>
									<div className={styles.sld_mask}
										 onClick={() => this.editTpl('left', `${sldComLanguage('左侧图片设置')}`)}>
										<span>{sldComLanguage('编辑')}</span>
									</div>
									{data.left.data.map((item,index) => (
										<a key={index} className={`${styles.l_img}`}
										   href="javascript:void(0);">
											{item.imgUrl
												? <img src={item.imgUrl}/>
												: <span>{sldComLanguage('此处添加【396*450】图片')}</span>
											}
										</a>
									))}
								</div>
								<div className={`${styles.item} ${styles.center}`}>
									<div className={styles.sld_mask}
										 onClick={() => this.editTpl('center',`${sldComLanguage('中间图片设置')}`)}>
										<span>{sldComLanguage('编辑')}</span>
									</div>
									{data.center.data.map((item, index) => (
										<a key={index}
										   className={`${index % 2 == 1 ? styles.l_b_margin : null}`}
										   href="javascript:void(0);">
											{item.imgUrl
												? <img src={item.imgUrl}/>
												: <span>{sldComLanguage('此处添加【183*210】图片')}</span>
											}
										</a>
									))}
								</div>


								<div className={`${styles.item} ${styles.right}`}>
									<div className={`${styles.title_wrap}`}>
										<div className={styles.sld_mask}
											 onClick={() => this.editTpl('right_title', `${sldComLanguage('右侧标题设置')}`,[`${sldComLanguage('标题不能为空，最多输入5个字')}`,`${sldComLanguage('子标题不能为空，最多输入10个字')}`])}>
											<span>{sldComLanguage('编辑')}</span>
										</div>
										<a className={`${styles.title}`}
										   href="javascript:void(0);">{data.right.title_info.title.initialValue ? data.right.title_info.title.initialValue : `${sldComLanguage('添加标题')}`}</a>
										<span>》</span>
										<a className={`${styles.subtitle}`}>{data.right.title_info.title.initialValue ? data.right.title_info.sub_title.initialValue : `${sldComLanguage('添加子标题')}`}</a>
									</div>
									<div className={`${styles.img_top}`}>
										<div className={styles.sld_mask}
											 onClick={() => this.editTpl('right_top', `${sldComLanguage('右侧上部图片设置')}`)}>
											<span>{sldComLanguage('编辑')}</span>
										</div>
										{data.right.top.data.map((item, index) => (
											<a key={index} href="javascript:void(0);">
												{item.imgUrl
													? <img src={item.imgUrl}/>
													: <span>{sldComLanguage('此处添加【376*180】图片')}</span>
												}
											</a>
										))}
									</div>
									<div className={`${styles.img_bottom}`}>
										<div className={styles.sld_mask}
											 onClick={() => this.editTpl('right_bottom',`${sldComLanguage('右侧下部图片设置')}`)}>
											<span>{sldComLanguage('编辑')}</span>
										</div>
										{data.right.bottom.data.map((item, index) => (
											<a key={index} href="javascript:void(0);">
												{item.imgUrl
													? <img src={item.imgUrl}/>
													: <span>{sldComLanguage('此处添加【183*180】图片')}</span>
												}
											</a>
										))}
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
            client={'pc'}
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
            client={'pc'}
					/>
					{/*标题+链接设置*/}
				</Fragment>
		);
	}
}
