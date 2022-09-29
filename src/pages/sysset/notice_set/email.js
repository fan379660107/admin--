import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin } from 'antd';
import {
	failTip,
	sucTip,
	sldComLanguage,
  sldCheckEmail
} from '@/utils/utils';
import { sld_need_update_setting } from '@/utils/util_data';
import global from '@/global.less';
import SldTableEdit from '@/components/SldTableEdit/SldTableEdit';
import SldComHeader from '@/components/SldComHeader';

let sthis = '';
@connect(({ sldsetting }) => ({
  sldsetting,
}))
@Form.create()
export default class Sms extends Component {
	constructor(props) {
		super(props);
		sthis = this;
		this.state = {
			flag: 0,
			submitting: false,//提交按钮加载状态
			submiting_sec: false,//发送测试邮件按钮加载状态
			initLoading: false,//页面初始化加载状态
			info_data: [],
		};
	}

	componentDidMount() {
		this.get_email_info();
	}

	componentWillUnmount() {

	}


	//获取短信配置信息
	get_email_info = () => {
		const { dispatch } = this.props;
		let { info_data } = this.state;
		dispatch({
			type: 'sldsetting/get_email_info',
			callback: (res) => {
				if (res.state == 200) {
					for (let i in res.data) {
						if (res.data[i].type == 1) {
							if (res.data[i].name == 'notification_sms_tpl_content') {
								info_data.push({
									type: 'textarea',
									label: res.data[i].title,
									extra: res.data[i].description,
									name: res.data[i].name,
									placeholder: '',
									initialValue: res.data[i].value,
								});
							} else {
								info_data.push({
									type: 'input',
									label: res.data[i].title,
									extra: res.data[i].description,
									name: res.data[i].name,
									placeholder: '',
									initialValue: res.data[i].value,
								});
							}

						}
					}
					if (info_data.length > 0) {
						info_data.push({
							type: 'button',
							label: '',
							name: 'button',
						});
					}
				}
				this.setState({ info_data, flag: 1 });
			},
		});
	};

	//保存事件  test_send 发送测试邮件事件
	handleSubmit = (values,type='') => {

		const { dispatch } = this.props;
		let dis_type = '';
		if(type == 'test_send'){
			dis_type = 'sldsetting/send_test_mail';
			this.setState({ submiting_sec: true });
		}else{
			dis_type = 'common/saveSetting';
			this.setState({ submitting: true });
		}
		dispatch({
			type: dis_type,
			payload: values,
			callback: (res) => {
				if (res.state == 200) {
					sucTip(res.msg);
				} else {
					failTip(res.msg);
				}
				this.setState({ submitting: false,submiting_sec: false });
			},
		});
	};

	sendTestMail = (val) =>{
    if (!val.notification_email_test_address) {
      failTip(`${sldComLanguage('请输入测试邮件')}`);
      return false;
    } else {
      //正则验证邮箱
      if (sldCheckEmail(val.notification_email_test_address)) {
        this.handleSubmit({toAddress:val.notification_email_test_address},'test_send')
      } else {
        failTip(`${sldComLanguage('请输入正确的邮箱')}`);
        return false;
      }
    }
	}

	render() {
		const { info_data, submitting, initLoading, flag,submiting_sec } = this.state;
		return (
			<Spin spinning={initLoading}>
				<div className={global.common_page}>
					<SldComHeader
						type={2}
						title={sldComLanguage('邮件配置')}
						tip_title={''}
						tip_data={sld_need_update_setting()}
					/>
					{flag == 1 &&
					<SldTableEdit
						submiting={submitting}
						submiting_sec={submiting_sec}
						width={1000}
						data={info_data}
						handleSubmit={this.handleSubmit}
						showOtherBtn={{
							text:`${sldComLanguage('发送测试邮件')}`,
							callback:this.sendTestMail,
						}}
					/>
					}
				</div>
			</Spin>
		);
	}
}
