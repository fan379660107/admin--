import React, { PureComponent } from 'react';
import styles from './index.less';

export default class SldTableRowLR extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			props_data: {},
		};
	}

	componentWillReceiveProps(props) {
		this.setState({
			props_data: props,
		});
	}

	render() {
		const { data, lwidth, rwidth, totalHeght } = this.state.props_data;
		return (
			<div style={{ height: totalHeght, overflowY: 'scroll' }}>
				<div className={styles.sld_det_lr_wrap}>
					{data != undefined && data.length > 0 && data.map((item, index) => {
						return <div className={styles.sld_det_lr_item_wrap} key={index}>
							<span className={styles.sld_det_r_item}
								  style={{ width: lwidth, backgroundColor: '#F7F7FC' }}><span
								className={styles.sld_det_r_text}
								style={{ fontWeight: '600' }}>{item.lval}</span></span>
							<span className={styles.sld_det_r_item} style={{ width: rwidth }}><span
								className={styles.sld_det_r_text}>{item.rval}</span></span>
						</div>;
					})}
				</div>
			</div>
		);
	}
}
