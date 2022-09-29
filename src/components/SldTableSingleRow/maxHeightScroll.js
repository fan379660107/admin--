/*
*发布商品的布局（表单内容）   一行多列  左侧label 右侧内容
* 只能用于单行  多行样式不兼容
* 针对发布商品的规格处使用的
* */
import React, { PureComponent, Fragment } from 'react';
import {
	Form, Tree,
} from 'antd';
import styles from './index.less';
import { getSldEmptyH } from '../../utils/utils';
import { Scrollbars } from 'react-custom-scrollbars';

const FormItem = Form.Item;
const { TreeNode } = Tree;

export default class MaxHeightScroll extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			props_data: props,
		};
	}

	componentWillReceiveProps(props) {
		this.setState({
			props_data: props,
		});
	}

	// 多选事件
	sldCheckShop = (items, value) => {
		if (items.sldCheckShop) {
			items.sldCheckShop(value);
		}
	};

	commonCon = (val, index) => {
		let {
			form: { getFieldDecorator },
		} = this.props;
		if (val.type == 'Tree') {
			//数形组件
			return <FormItem key={index} extra={val.extra} style={{ width: ' 80%' }}>
				{getFieldDecorator(val.name, {
					initialValue: val.initialValue == '' ? undefined : val.initialValue,
					rules: val.rules,
				})(
					<Tree
						defaultExpandAll={true}
						checkable
						onCheck={val.onCheck}
					>
						{val.data.map((item) => {
							return <TreeNode title={item.title} key={item.key}>
								{item.children != undefined && item.children.length > 0 && item.children.map((items) => {
									return <TreeNode title={items.title} key={items.key}>
									</TreeNode>;
								})}
							</TreeNode>;
						})}
					</Tree>,
				)}
			</FormItem>;
		}
	};

	render() {
		const { data, lwidth, rwidth, part_width } = this.state.props_data;
		let {
			max_height,
		} = this.props;
		return (
			<div style={{ maxHeight: max_height, minHeight: 50 }}>
				<div className={styles.sld_det_lr_wrap}>
					{data != undefined && data.length > 0 && data.map((val, index) => {
						return <div className={styles.sld_det_lr_item_wrap}
						            key={index}
						            style={{ width: `${part_width != undefined ? part_width : 50}%` }}>
						            <span className={`${styles.sld_det_r_item} ${styles.sld_det_r_item_spe}`}
						                  style={{ width: `${lwidth != undefined ? lwidth : 20}%` }}>
							              <span className={styles.sld_det_r_text}
							                    style={{ fontWeight: '600' }}>{val.required != undefined && val.required &&
							              <span style={{ color: 'red' }}>*</span>}{val.label}
							              </span>
						            </span>
							<div className={`${styles.sld_det_r_item} ${styles.sld_det_r_item_det}`}
							     style={{ width: `${rwidth != undefined ? rwidth : 80}%` }}>
								<Scrollbars
									autoHeight
									autoHeightMin={50}
									autoHeightMax={max_height - 30}>
								              <span className={styles.sld_det_r_text} style={{ width: '100%' }}>
									              {getSldEmptyH(10)}
									              {this.commonCon(val, index)}
								              </span>
								</Scrollbars>
							</div>
						</div>;
					})}
				</div>
			</div>

		);
	}
}
