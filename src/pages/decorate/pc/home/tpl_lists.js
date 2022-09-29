/*
* 实例化模板列表页面
* */
import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form } from 'antd';
import {
	sldLlineRtextAddGoodsAddMargin,
	getSldEmptyH,
	list_com_page_more,
	sldComLanguage,
} from '@/utils/utils';
import global from '@/global.less';
import diy_page from '../diy_page.less';
import styles from '../pcdecorate.less';
import { Scrollbars } from 'react-custom-scrollbars';

let pageSize = list_com_page_more;
let sthis = '';
let getFieldDecorator_new = '';
@connect(({ pc_home }) => ({
	pc_home,
}))
@Form.create()
export default class Tpl_lists extends Component {
	constructor(props) {
		super(props);
		sthis = this;
		const {
			form: { getFieldDecorator },
		} = props;
		getFieldDecorator_new = getFieldDecorator;
		this.state = {
			data: { list: [], pagination: {} },
		};
	}

	componentDidMount() {
		this.get_list();
	}

	componentWillUnmount() {

	}

	//获取模板列表
	get_list = () => {
		let { data } = this.state;
		const { dispatch } = this.props;
		dispatch({
			type: 'pc_home/get_tpl_list',
			payload: { pageSize: pageSize },
			callback: (res) => {
				if (res.state == 200) {
					data = res.data;
				}
				this.setState({ data });
			},
		});
	};

	render() {
		const { data } = this.state;
		return (
			<div className={`${global.common_page} ${styles.allow_show_edit}`}>
				{sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('模板列表')}`, 0, 0, 10)}{/*模板列表*/}
				{getSldEmptyH(10)}
				<Scrollbars autoHeight
							autoHeightMin={50}
							autoHeightMax={document.body.clientHeight - 100}>
					<div className={global.flex_com_row_wrap}>
						{data.list!=null&&data.list.length > 0 &&
						data.list.map(val => (
							<div key={val.id} className={`${global.flex_com_column} ${diy_page.tpl_list_item}`}>
              <span className={`${diy_page.img_wrap}`}>
                    <img src={val.image}/>
              </span>
								<span className={diy_page.title}>{val.name}</span>
								<span className={diy_page.desc}>{val.desc}</span>
							</div>
						))
						}
					</div>
          {getSldEmptyH(40)}
				</Scrollbars>
			</div>
		);
	}
}
