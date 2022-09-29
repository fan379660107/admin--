/*发布商品选择商品分类组件*/
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, } from 'antd';
import {
	failTip,
	getSldEmptyH,sldFullHeight,
	sldComLanguage,
} from '@/utils/utils';
import global from '@/global.less';
import { Scrollbars } from 'react-custom-scrollbars';

let sthis = '';
@connect(({ product, global }) => ({
	product, global,
}))
@Form.create()
export default class SelGoodsCat extends Component {
	constructor(props) {
		super(props);
		sthis = this;
		this.state = {
			modalVisible: props.modalVisible,
			data: props.data,
			sele_goods_cat_data: [],
		};
	}

	componentDidMount() {

	}

	componentWillReceiveProps(nextProps, nextContext) {
		this.setState({ modalVisible: nextProps.modalVisible, sele_goods_cat_data: nextProps.sele_goods_cat_data });
	}

	componentWillUnmount() {

	}

	//下一步事件
	addGoodsNext = () => {
		if (this.props.sele_goods_cat_data.length == 3) {
			this.props.sldAddGoodsSecond();
		} else {
			failTip(`${sldComLanguage('分类必须选到第三级才可以发布商品')}`);
		}
	};

	//获取下级分类
	getChild = (item, index) => {
		this.props.sldHandleGoodsCat(item, index);
	};

	render() {
		const { data, sele_goods_cat_data } = this.state;
		let sele_cat_str = '';
		if (sele_goods_cat_data.length == 0) {
			sele_cat_str = `${sldComLanguage('请选择商品类别')}`;
		} else {
			sele_cat_str = `${sldComLanguage('您选择商品类别是:')}`;
			sele_goods_cat_data.map((item, index) => {
				sele_cat_str += item.categoryName;
				if (index != sele_goods_cat_data.length - 1) {
					sele_cat_str += ' > ';
				}
			});
		}
		return (
			<div className={global.sele_goods_cat}>
				<div className={global.goods_cat_wrap} style={{marginTop:sldFullHeight(34),marginBottom:sldFullHeight(17),height:sldFullHeight(600)}}>
					{data.map((item, index) => {
						return index < 3 &&
							<div className={global.wrap} key={index} style={{ marginLeft: index == 0 ? 0 : 16,paddingTop:10 }}>
								<Scrollbars autoHeight
								            autoHeightMin={0}
								            autoHeightMax={sldFullHeight(530)}>
									{item.length > 0 && item.map((items, indexs) => {
										return <div onClick={() => this.getChild(items, index + 1)}
										            className={`${global.goods_cat_item} ${sele_goods_cat_data[index] != undefined && items.categoryId == sele_goods_cat_data[index].categoryId ? global.select : null}`}
										            key={indexs}>{items.categoryName}</div>;
									})}
                  {getSldEmptyH(15)}
                </Scrollbars>
							</div>;
					})}
				</div>
				<div className={`${global.sele_cat_info} ${sele_goods_cat_data.length == 0 ? 'tip_bg' : null}`}>
					<span className={`${sele_goods_cat_data.length == 0 ? 'tip' : null}`}>{sele_cat_str}</span>
				</div>
				<div className={global.com_flex_column_center} style={{marginTop:sldFullHeight(41)}}>
					<div className={global.add_goods_step1_btn} onClick={() => this.addGoodsNext()}>
						<span className={global.text}>{sldComLanguage('下一步，填写商品信息')}</span>
					</div>
				</div>
			</div>
		);
	}
}
