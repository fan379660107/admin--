import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input } from 'antd';
import styles from './Login.less';
import global from '@/global.less';
import {
	failTip,
	setLocalStorageTime,getSldImgSet,sldComLanguage
} from '@/utils/utils';

const FormItem = Form.Item;

let main_admin_top_logo = require('../../assets/sld_java_logo.png');
let com_img_info = getSldImgSet('com_img_info');
if (com_img_info != '') {
  main_admin_top_logo = com_img_info.filter(item => item.name == 'main_admin_top_logo')[0].imageUrl || main_admin_top_logo;
}
const default_login_img = {
	admin_login_bg: require('../../assets/sld_login_bg.png'),//登录背景
	admin_login_left_bg: require('../../assets/sld_login_left.png'),//登录左侧图片
  main_admin_top_logo: main_admin_top_logo,//登录页logo
};
@connect(({ login, }) => ({
	login,
}))
@Form.create()
export default class LoginPage extends Component {
	state = {
		type: 'account',
		autoLogin: true,
		login_img: {},
    captcha: '',
	};

  captcha = '';//图形验证码的key

	componentDidMount() {
    localStorage.clear();
    this.get_init_img();
    this.getCaptcha('captcha');
	}

  //获取图形验证码
  getCaptcha = (type) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/get_captcha',
      callback: (res) => {
        if (res.state == 200) {
          this[type] = res.data.key;
          this.setState({ [type]: 'data:image/png;base64,' + res.data.captcha });
        }
      },
    });
  };

	//获取初始化信息
  get_init_img = () => {
		const { dispatch } = this.props;
		let { login_img } = this.state;
		dispatch({
			type: 'login/get_login_img',
			callback: (res) => {
				if (res.state == 200) {
          login_img = { ...default_login_img };
          res.data.map(item => {
            if (item.imageUrl) {
              login_img[item.name] = item.imageUrl;
            }
          });
          localStorage.setItem('com_img_info', JSON.stringify(res.data));
					this.setState({ login_img });
				}
			},
		});
	};

	//登录操作
	handleSubmits = () => {
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (values.username == undefined||values.username == '') {
				failTip(`${sldComLanguage('用户名不能为空')}`);
			} else if (values.password == undefined||values.password == '') {
				failTip(`${sldComLanguage('密码不能为空')}`);
			} else if (values.verifyCode == undefined||values.verifyCode == '') {
        failTip(`${sldComLanguage('验证码不能为空')}`);
      } else {
				//用户登录
				const { dispatch } = this.props;
        values.verifyKey = this.captcha;
				dispatch({
					type: 'login/login',
					payload: { ...values },
					callback: (res) => {
						if (res.state == 200) {
							localStorage.setItem('sld_token', res.data.access_token);
              localStorage.setItem('sld_refresh_token', res.data.refresh_token);
              localStorage.setItem('isSuper', res.data.isSuper);
							{
								setLocalStorageTime();
							}
              localStorage.setItem('user_info', JSON.stringify({ user_name: values.username,adminId:res.data.adminId}));
						}else{
						  failTip(res.msg);
              this.getCaptcha('captcha')
            }
					},
				});
			}
		});
	};

	showDefault = (type) =>{
		let {login_img} = this.state;
		login_img[type] = default_login_img[type]
		this.setState({login_img})
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const {login_img,captcha} = this.state;
		return (
			<div className={styles.full_screen}
				 style={{ backgroundImage: window.location.href.indexOf('user') != -1 ? 'url(' + login_img.admin_login_bg + ')' : 'none',backgroundSize:'contain' }}>
				<div className={styles.left_bg}>
					<img
            className={styles.left_bg_img}
					src={login_img.admin_login_left_bg}
					onError={()=>this.showDefault('admin_login_left_bg')}
				/>
          <img
            className={styles.login_logo}
            src={login_img.main_admin_top_logo}
            onError={()=>this.showDefault('main_admin_top_logo')}
          />
          <div className={styles.right_bg}>
            <span className={styles.login_title}>{sldComLanguage('平台管理中心')}</span>
            <div className={styles.formlogin}>
              <Form layout="horizontal">
                <FormItem
                  style={{ marginTop: 30 }}
                >
                  {getFieldDecorator('username')(
                    <Input
                      maxLength={250}
                      placeholder={sldComLanguage('请输入用户名')}
                      prefix={<img src={require('../../assets/sld_login_username.png')}
                                   style={{ color: 'rgba(0,0,0,.25)' }}/>}
                      onPressEnter={() => this.props.form.submit(this.handleSubmits)}

                    />,
                  )}
                </FormItem>

                <FormItem
                  style={{ marginTop: 20 }}
                >
                  {getFieldDecorator('password')(
                    <Input
                      maxLength={20}
                      type="password"
                      placeholder={sldComLanguage('请输入密码')}
                      prefix={<img src={require('../../assets/sld_login_pwd.png')}/>}
                      onPressEnter={() => this.props.form.submit(this.handleSubmits)}
                    />,
                  )}
                </FormItem>
                <FormItem
                  style={{ marginTop: 20 }}
                >
                  {getFieldDecorator('verifyCode')(
                    <Input
                      maxLength={4}
                      placeholder={sldComLanguage('请输入验证码')}
                      prefix={<img src={require('../../assets/sld_login_code.png')}
                                   style={{ color: 'rgba(0,0,0,.25)' }}/>}
                      suffix={<img src={captcha} onClick={() => this.getCaptcha('captcha')}
                                   className={styles.verification_code}/>}
                      onPressEnter={() => this.props.form.submit(this.handleSubmits)}
                    />,
                  )}
                </FormItem>
                <div className={styles.sld_login_btn_wrap}>
                  <div className={`${styles.sld_login_btn} ${global.flex_row_center_center}`} onClick={() => this.props.form.submit(this.handleSubmits)}>
                    {sldComLanguage('立即登录')}
                  </div>
                </div>
              </Form>
            </div>
          </div>
				</div>
			</div>
		);
	}
}

