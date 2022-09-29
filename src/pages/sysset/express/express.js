import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin, Tabs } from 'antd';
import {
	failTip,
	sucTip,
	getSldEmptyH,
	sldComLanguage,
	showMoreHelpTip,
} from '@/utils/utils';
import {
	sld_need_update_setting,
	sld_config_save_btn,
} from '@/utils/util_data';
import SldTableEdit from '@/components/SldTableEdit/SldTableEdit';
import global from '@/global.less';
import SldComHeader from '@/components/SldComHeader';

const TabPane = Tabs.TabPane;
let sthis = '';
@connect(({ sldsetting }) => ({
	sldsetting,
}))
@Form.create()
export default class Info extends Component {
	constructor(props) {
		super(props);
		sthis = this;
		this.state = {
			sld_show_tip:true,//是否显示页面提示，默认显示
			kdn_flag: false,
			submitting: false,//提交按钮加载状态
			initLoading: false,//页面初始化加载状态
			kdn_set_data: [],
			activeTabKey: '1',
		};
	}

  kdn_account_data = [];//快递鸟id、快递鸟key的信息
  kdn_account_setting_data = {};//快递鸟账号设置的信息

	componentDidMount() {
		this.get_info();
	}

	componentWillUnmount() {

	}

	//获取配置信息
	get_info = () => {
		this.setState({ initLoading: true });
		const { dispatch } = this.props;
		let { kdn_flag, kdn_set_data} = this.state;
		let dis_type = 'sldsetting/get_express_setting';
		dispatch({
			type: dis_type,
			callback: (res) => {
				this.setState({ initLoading: false });
				if (res.state == 200) {
					kdn_flag = true;
          this.kdn_account_data = [];
          this.kdn_account_setting_data = [];
					for(let i in res.data){
						if(res.data[i].name == 'express_apikey'||res.data[i].name == 'express_ebusinessid'){
              this.kdn_account_data.push({
								type: 'input',
								label: res.data[i].title,
								extra: res.data[i].description,
								name: res.data[i].name,
								placeholder: '',
								initialValue: res.data[i].value,
                rules: [{
                  required: true,
                  whitespace: true,
                  message: `${sldComLanguage('请输入')}${res.data[i].title}`,
                }]
							});
						}else if(res.data[i].name == 'express_account_setting'){
              this.kdn_account_setting_data = {
                type: 'radio_single',
                label: res.data[i].title,
                extra: res.data[i].description,
                name: res.data[i].name,
                placeholder: '',
                initialValue: res.data[i].value,
                sel_data:[{key:'1',value:sldComLanguage('平台统一设置')},{key:'2',value:sldComLanguage('商家设置')}],
                onChange:this.handleSetting
              };
            }else if(res.data[i].name == 'express_request_type'){
              this.kdn_account_data.push({
                type: 'radio_single',
                label: res.data[i].title,
                extra: res.data[i].description,
                name: res.data[i].name,
                placeholder: '',
                initialValue: res.data[i].value,
                sel_data:[{key:'0',value:sldComLanguage('免费接口')},{key:'1',value:sldComLanguage('付费接口')}],
              });
            }else if(res.data[i].name == 'express_100_key'||res.data[i].name == 'express_100_secret'||res.data[i].name == 'express_100_customer'){
              this.kdn_account_data.push({
                type: 'input',
                label: res.data[i].title,
                extra: res.data[i].description,
                name: res.data[i].name,
                placeholder: '',
                initialValue: res.data[i].value,
                rules: [{
                  required: true,
                  whitespace: true,
                  message: `${sldComLanguage('请输入')}${res.data[i].title}`,
                }]
              });
            }
					}
					if(res.data[0].name != 'express_100_key'){
            if(res.data[0].value == '2'){
              kdn_set_data = [{...this.kdn_account_setting_data}];
            }else{
              kdn_set_data = [{...this.kdn_account_setting_data},...JSON.parse(JSON.stringify(this.kdn_account_data))];
            }
          }else{
            kdn_set_data = [...this.kdn_account_data];
          }
          kdn_set_data.push(sld_config_save_btn);
          this.setState({
						kdn_set_data,
						kdn_flag,
					});
				}
			},
		});
	};

	//快递鸟账号设置选择事件
  handleSetting = (e) => {
    let {kdn_set_data} = this.state;
    if(e.target.value == '2'){
      kdn_set_data = [{...this.kdn_account_setting_data}];
    }else{
      kdn_set_data = [{...this.kdn_account_setting_data},...JSON.parse(JSON.stringify(this.kdn_account_data))];
    }
    kdn_set_data.push(sld_config_save_btn);
    this.setState({kdn_set_data})
  }

	//保存事件
	handleSubmit = (values) => {
		this.setState({ submitting: true });
		const { dispatch } = this.props;
		dispatch({
			type: 'common/saveSetting',
			payload: values,
			callback: (res) => {
				if (res.state == 200) {
					sucTip(res.msg);
				} else {
					failTip(res.msg);
				}
				this.setState({ submitting: false });
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
		const { submitting, initLoading, activeTabKey, kdn_set_data, kdn_flag,sld_show_tip } = this.state;
		return (
			<Spin spinning={initLoading}>
				<div className={global.common_page}>
					<SldComHeader
						type={1}
						title={`${sldComLanguage('物流设置')}`}
						handleToggleTip={()=>this.handleToggleTip()}
					/>
					{getSldEmptyH(10)}
					<Tabs activeKey={activeTabKey} onChange={(key) => this.changeSldTab(key)} type="card">
						<TabPane tab={sldComLanguage('快递配置')} key="1">
							{showMoreHelpTip(``, sld_need_update_setting(),8,sld_show_tip)}{/*操作提示*/}
							{getSldEmptyH(8)}
							<div className={`${global.flex_com_column}`}>
								{kdn_flag == 1 &&
								<SldTableEdit
									submiting={submitting}
									width={1000}
									data={kdn_set_data}
									handleSubmit={this.handleSubmit}
								/>
								}
							</div>
						</TabPane>
					</Tabs>
				</div>
			</Spin>
		);
	}
}
