import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, } from 'antd';
import {
	sldIconBtn,
	failTip,
	sucTip,
	sldLlineRtextAddGoodsAddMargin,
	showMoreHelpTip,
	getSldEmptyH,
	sldEmptyHandle2,
	sldComLanguage,
} from '@/utils/utils';
import { add_tpl_tip } from '@/utils/util_data';
import global from '@/global.less';
import styles from '../pcdecorate.less';
import Adv_01 from './adv_01';
import Adv_02 from './adv_02';
import Adv_04 from './adv_04';
import Adv_05 from './adv_05';
import Adv_06 from './adv_06';
import Adv_07 from './adv_07';
import Adv_08 from './adv_08';
import Adv_09 from './adv_09';
import Adv_10 from './adv_10';
import Adv_11 from './adv_11';
import Adv_12 from './adv_12';
import Adv_13 from './adv_13';
import Adv_19 from './adv_19';
import Adv_20 from './adv_20';
import Adv_21 from './adv_21';
import MainBanner from './main_banner';
import { Scrollbars } from 'react-custom-scrollbars';

let sthis = '';
let getFieldDecorator_new = '';
@connect(({ product }) => ({
	product,
}))
@Form.create()
export default class Add_template extends Component {
	constructor(props) {
		super(props);
		sthis = this;
		const {
			form: { getFieldDecorator },
		} = props;
		getFieldDecorator_new = getFieldDecorator;
		this.state = {
			data: sldEmptyHandle2(localStorage.getItem('pc_diy_tpl')) != '' ? JSON.parse(localStorage.getItem('pc_diy_tpl')) : '',
		};
	}


	componentDidMount() {

	}

	componentWillUnmount() {

	}

	//保存装修数据
	save_tpl_data = (val, html) => {
		let { data } = this.state;
		//将对象转为JSON对象
		let val_to_json_object = JSON.parse(JSON.stringify(val));
		let param = {};
		param.dataId = data.dataId;
		param.html = html;
		param.json = JSON.stringify(val_to_json_object);
		const { dispatch } = this.props;
		dispatch({
			type: 'pc_home/save_instance_tpl_data',
			payload: param,
			callback: (res) => {
				if (res.state == 200) {
					//替换缓存里的数据
          data.json = val_to_json_object;
          data.html = param.html;
					this.setState({data})
					localStorage.setItem('pc_diy_tpl',JSON.stringify(data))
					sucTip(res.msg);
				} else {
					failTip(res.msg);
				}
			},
		});
	};

	render() {
		const { data } = this.state;
		let data_json = data.json;
		return (
			<div className={`${global.common_page} ${styles.allow_show_edit}`}>
				{sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('模板编辑')}`, 0, 0, 10)}
				{showMoreHelpTip(`${sldComLanguage('操作提示')}`, add_tpl_tip())}{/*操作提示*/}
				{getSldEmptyH(10)}
				{/*公共功能条-start*/}
				<div className={global.operate_bg}>
					{sldIconBtn(() => this.props.history.goBack(), `${sldComLanguage('返回')}${sldComLanguage('模板列表')}`, 7, 7, 15, 15, 4, 'fanhui', '#FA6F1E')}
				</div>
				{/*公共功能条-end*/}
				<div className={`${styles.diy_part_wrap} ${styles.allow_show_edit}`}>
					<Scrollbars autoHeight
								autoHeightMin={50}
								autoHeightMax={document.body.clientHeight - 330}>
						{data_json.type == 'adv_01' &&
						<Adv_01 tpl_info={data_json} save_tpl_data={this.save_tpl_data}/>
						}
						{data_json.type == 'adv_02' &&
						<Adv_02 tpl_info={data_json} save_tpl_data={this.save_tpl_data}/>
						}
						{data_json.type == 'adv_04' &&
						<Adv_04 tpl_info={data_json} save_tpl_data={this.save_tpl_data}/>
						}
						{data_json.type == 'adv_05' &&
						<Adv_05 tpl_info={data_json} save_tpl_data={this.save_tpl_data}/>
						}
						{data_json.type == 'adv_06' &&
						<Adv_06 tpl_info={data_json} save_tpl_data={this.save_tpl_data}/>
						}
						{data_json.type == 'adv_07' &&
						<Adv_07 tpl_info={data_json} save_tpl_data={this.save_tpl_data}/>
						}
						{data_json.type == 'adv_08' &&
						<Adv_08 tpl_info={data_json} save_tpl_data={this.save_tpl_data}/>
						}
						{data_json.type == 'adv_09' &&
						<Adv_09 tpl_info={data_json} save_tpl_data={this.save_tpl_data}/>
						}
						{data_json.type == 'adv_10' &&
						<Adv_10 tpl_info={data_json} save_tpl_data={this.save_tpl_data}/>
						}
						{data_json.type == 'adv_11' &&
						<Adv_11 tpl_info={data_json} save_tpl_data={this.save_tpl_data}/>
						}
						{data_json.type == 'adv_12' &&
						<Adv_12 tpl_info={data_json} save_tpl_data={this.save_tpl_data}/>
						}
						{data_json.type == 'adv_13' &&
						<Adv_13 tpl_info={data_json} save_tpl_data={this.save_tpl_data}/>
						}
						{data_json.type == 'adv_19' &&
						<Adv_19 tpl_info={data_json} save_tpl_data={this.save_tpl_data}/>
						}
            {data_json.type == 'adv_20' &&
            <Adv_20 tpl_info={data_json} save_tpl_data={this.save_tpl_data}/>
            }
            {data_json.type == 'adv_21' &&
            <Adv_21 tpl_info={data_json} save_tpl_data={this.save_tpl_data}/>
            }

						{data_json.type == 'main_banner' &&
						<MainBanner tpl_info={data_json} save_tpl_data={this.save_tpl_data}/>
						}
					</Scrollbars>
				</div>
			</div>
		);
	}
}
