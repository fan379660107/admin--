import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin, Tabs } from 'antd';
import {
	failTip,
	sucTip,
	showMoreHelpTip,
	getSldEmptyH,
	sldComLanguage,
} from '@/utils/utils';
import { sld_need_update_setting } from '@/utils/util_data';
import global from '@/global.less';
import SldTableEdit from '@/components/SldTableEdit/SldTableEdit';
import SldComHeader from '@/components/SldComHeader';

const TabPane = Tabs.TabPane;
let sthis = '';
@connect(({ sldsetting }) => ({
	sldsetting,
}))
@Form.create()
export default class UnionLogin extends Component {
	constructor(props) {
		super(props);
		sthis = this;
		this.state = {
			sld_show_tip:true,//是否显示页面提示，默认显示
			flag: 0,
			submitting: false,//提交按钮加载状态
			initLoading: false,//页面初始化加载状态
			info_data: [],
			activeTabKey: 'wx',//默认微信
		};
	}

	componentDidMount() {
		this.get_info();
	}

	componentWillUnmount() {

	}

	//获取微信授权的配置信息
	get_info = () => {
		this.setState({ initLoading: true });
		const { dispatch } = this.props;
		let { info_data, flag } = this.state;
		dispatch({
			type: 'sldsetting/get_authorized_wx_info',
			callback: (res) => {
				if (res.state == 200) {
					flag = 1;
					info_data = [];
					for (let i in res.data) {
						if (res.data[i].type == 1) {
							info_data.push({
								type: 'input',
								label: res.data[i].title,
								name: res.data[i].name,
								extra: res.data[i].description,
								placeholder: `${sldComLanguage('请输入')}${res.data[i].title}`,
								initialValue: res.data[i].value,
							});
						} else if (res.data[i].type == 4) {
							info_data.push({
								type: 'switch',
								label: res.data[i].title,
								extra: res.data[i].description,
								name: res.data[i].name,
								initialValue: res.data[i].value,
							});
						}
					}
				}
				this.setState({ info_data, flag, initLoading: false });
			},
		});
	};


	//保存事件
	handleSubmit = (values) => {
		this.setState({ submitting: true });
		const { dispatch } = this.props;
    values.login_wx_app_is_enable = values.login_wx_app_is_enable?1:0
    values.login_wx_pc_is_enable = values.login_wx_pc_is_enable?1:0
		dispatch({
			type: 'common/saveSetting',
			payload: values,
			callback: (res) => {
				this.setState({ submitting: false });
				if (res.state == 200) {
					sucTip(res.msg);
				} else {
					failTip(res.msg);
				}
			},
		});
	};

	//tab设置
	changeSldTab = (key) => {
		this.setState({
			activeTabKey: key,
		});
	};

	handleToggleTip = () => {
		this.setState({
			sld_show_tip:!this.state.sld_show_tip
		});
	}


	render() {
		const { info_data, submitting, initLoading, flag, activeTabKey,sld_show_tip } = this.state;
		return (
			<Spin spinning={initLoading}>
				<div className={global.common_page}>
					<SldComHeader
						type={1}
						title={`${sldComLanguage('基本设置')}`}
						handleToggleTip={()=>this.handleToggleTip()}
					/>
					{getSldEmptyH(8)}
					<Tabs activeKey={activeTabKey} onChange={(key) => this.changeSldTab(key)} type="card">
						<TabPane tab={`${sldComLanguage('微信配置')}`} key="wx">
							{showMoreHelpTip(``, sld_need_update_setting(),8,sld_show_tip)}{/*操作提示*/}
							{getSldEmptyH(8)}
							{flag == 1 &&
							<SldTableEdit
								submiting={submitting}
								width={1000}
								data={info_data}
								handleSubmit={this.handleSubmit}
								btn_fixed_bottom={true}
								scroll_h={sld_show_tip?252:200}
							/>
							}
						</TabPane>
					</Tabs>
				</div>
			</Spin>
		);
	}
}
