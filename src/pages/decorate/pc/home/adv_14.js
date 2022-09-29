/*
* 商品楼层，左侧图片+分类，右侧商品,效果图可以点击同名图片查看
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form } from 'antd';
import {
	sldComLanguage,
} from '@/utils/utils';
import global from '@/global.less';
import styles from '../pcdecorate.less';
import SldDiyMoreImgModal from '@/components/SldDiyMoreImgModal/SldDiyMoreImgModal';
import SldDiyTitleLinkModal from '@/components/SldDiyTitleLinkModal/SldDiyTitleLinkModal';

let sthis = '';
let getFieldDecorator_new = '';
@connect(({ product }) => ({
	product,
}))
@Form.create()
export default class Adv_14 extends Component {
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
				type: 'adv_14',
				left: {
					title_info: {
						title: {
							label: `${sldComLanguage('标题')}`,
							name: 'title',
							initialValue: `${sldComLanguage('清仓打折')}`,
							required: true,
						},//标题名称
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
							imgUrl: 'https://img.alicdn.com/simba/img/TB1jsBeKYPpK1RjSZFFSuu5PpXa.jpg',
							imgPath: '/images/brand/3e56e20d-453d-4cf8-906f-a928de37ce6a.png',
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
							imgUrl: 'https://img.alicdn.com/simba/img/TB1jsBeKYPpK1RjSZFFSuu5PpXa.jpg',
							imgPath: '/images/brand/3e56e20d-453d-4cf8-906f-a928de37ce6a.png',
							title: '',
							link_type: '',
							link_value: '',
							info: {},
						}, {
							imgUrl: 'https://img.alicdn.com/simba/img/TB1jsBeKYPpK1RjSZFFSuu5PpXa.jpg',
							imgPath: '/images/brand/3e56e20d-453d-4cf8-906f-a928de37ce6a.png',
							title: '',
							link_type: '',
							link_value: '',
							info: {},
						}],
					},

				},
				center: {
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
							imgUrl: 'https://img.alicdn.com/simba/img/TB1jsBeKYPpK1RjSZFFSuu5PpXa.jpg',
							imgPath: '/images/brand/3e56e20d-453d-4cf8-906f-a928de37ce6a.png',
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
							imgUrl: 'https://img.alicdn.com/simba/img/TB1jsBeKYPpK1RjSZFFSuu5PpXa.jpg',
							imgPath: '/images/brand/3e56e20d-453d-4cf8-906f-a928de37ce6a.png',
							title: '',
							link_type: '',
							link_value: '',
							info: {},
						}, {
							imgUrl: 'https://img.alicdn.com/simba/img/TB1jsBeKYPpK1RjSZFFSuu5PpXa.jpg',
							imgPath: '/images/brand/3e56e20d-453d-4cf8-906f-a928de37ce6a.png',
							title: '',
							link_type: '',
							link_value: '',
							info: {},
						}],
					},

				},
				right: {
					width: 396,
					height: 450,//高度为0的话表示不限制
					data: [{
						imgUrl: 'http://img.slodon.cn/data/upload/fixture/06105719695849326.png',
						imgPath: '/images/brand/3e56e20d-453d-4cf8-906f-a928de37ce6a.png',
						title: '',
						link_type: '',
						link_value: '',
						info: {},
					}],
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
			<Fragment>
				<div ref={'wrap_html'}>
					<div className={`${styles.w_sld_react_1210} ${styles.adv_14}`}>
						<div className={` ${styles.adv_14_wrap}`}>
							<div className={`${styles.item} ${styles.right}`}>
								<div className={`${styles.title_wrap}`}>
									<div className={styles.sld_mask}
										 onClick={() => this.editTpl('left', 'title_info',`${sldComLanguage('左侧标题设置')}`,[`${sldComLanguage('标题不能为空，最多输入5个字，子标题不能为空，最多输入10个字')}`])}>
										<span>{sldComLanguage('编辑')}</span>
									</div>
									<a className={`${styles.title}`}
									   href="javascript:void(0);">{data.left.title_info.title.initialValue ? data.left.title_info.title.initialValue : `${sldComLanguage('添加标题')}`}</a>
									<span>》</span>
									<a className={`${styles.subtitle}`}>{data.left.title_info.title.initialValue ? data.left.title_info.sub_title.initialValue : `${sldComLanguage('添加子标题')}`}</a>
								</div>
								<div className={`${styles.img_top}`}>
									<div className={styles.sld_mask}
										 onClick={() => this.editTpl('left','top', `${sldComLanguage('左侧上部图片设置')}`)}>
										<span>{sldComLanguage('编辑')}</span>
									</div>
									{data.left.top.data.map((item, index) => (
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
										 onClick={() => this.editTpl('left','bottom',`${sldComLanguage('左侧下部图片设置')}`)}>
										<span>{sldComLanguage('编辑')}</span>
									</div>
									{data.left.bottom.data.map((item, index) => (
										<a key={index} href="javascript:void(0);">
											{item.imgUrl
												? <img src={item.imgUrl}/>
												: <span>{sldComLanguage('此处添加【183*180】图片')}</span>
											}
										</a>
									))}
								</div>
							</div>
							<div className={`${styles.item} ${styles.right}`}>
								<div className={`${styles.title_wrap}`}>
									<div className={styles.sld_mask}
										 onClick={() => this.editTpl('center','title_info', `${sldComLanguage('中间标题设置')}`,[`${sldComLanguage('标题不能为空，最多输入5个字，子标题不能为空，最多输入10个字')}`])}>
										<span>{sldComLanguage('编辑')}</span>
									</div>
									<a className={`${styles.title}`}
									   href="javascript:void(0);">{data.center.title_info.title.initialValue ? data.center.title_info.title.initialValue : `${sldComLanguage('添加标题')}`}</a>
									<span>》</span>
									<a className={`${styles.subtitle}`}>{data.center.title_info.title.initialValue ? data.center.title_info.sub_title.initialValue : `${sldComLanguage('添加子标题')}`}</a>
								</div>
								<div className={`${styles.img_top}`}>
									<div className={styles.sld_mask}
										 onClick={() => this.editTpl('center','top', `${sldComLanguage('中间上部图片设置')}`)}>
										<span>{sldComLanguage('编辑')}</span>
									</div>
									{data.center.top.data.map((item, index) => (
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
										 onClick={() => this.editTpl('center','bottom',`${sldComLanguage('中间下部图片设置')}`)}>
										<span>{sldComLanguage('编辑')}</span>
									</div>
									{data.center.bottom.data.map((item, index) => (
										<a key={index} href="javascript:void(0);">
											{item.imgUrl
												? <img src={item.imgUrl}/>
												: <span>{sldComLanguage('此处添加【183*180】图片')}</span>
											}
										</a>
									))}
								</div>
							</div>
							<div className={`${styles.item} ${styles.left} ${styles.clear_padding}`}>
								<div className={styles.sld_mask}
									 onClick={() => this.editTpl('right','', `${sldComLanguage('右侧图片设置')}`)}>{/*右侧图片设置*/}
									<span>{sldComLanguage('编辑')}</span>{/*编辑*/}
								</div>
								{data.right.data.map((item,index) => (
									<a key={index} className={`${styles.l_img}`}
									   href="javascript:void(0);">
										{item.imgUrl
											? <img src={item.imgUrl}/>
											: <span>{sldComLanguage('此处添加【396*450】图片')}</span>
										}
									</a>
								))}
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
		);
	}
}
