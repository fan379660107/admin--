/*
* 列表加号展开样式 一行多列
* */
import React, { PureComponent } from 'react';
import styles from './index.less';
import { Scrollbars } from 'react-custom-scrollbars';

export default class SldRowMoreColumnLR extends PureComponent {
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

	render() {
		const { data, item_width } = this.state.props_data;
		return (
			<Scrollbars autoHeight
						autoHeightMax={150}>
				<div className={styles.sld_det_lr_wrap}>
					{data != undefined && data.length > 0 && data.map((item, index) => {
						return <div className={styles.item} style={{ width: item_width }} key={index}>
							<span className={styles.ltext}>{item.lval}</span>
							<span className={styles.rtext}>{item.rval}</span>
						</div>;
					})}
				</div>
			</Scrollbars>
		);
	}
}
