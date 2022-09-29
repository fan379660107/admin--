import React, { PureComponent,Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import { Layout, message } from 'antd';
import Animate from 'rc-animate';
import { connect } from 'dva';
import router from 'umi/router';
import GlobalHeader from '@/components/GlobalHeader';
import TopNavHeader from '@/components/TopNavHeader';
import styles from './Header.less';
import SldModal from "@/components/SldModal/SldModal";
import {
  failTip ,
  sucTip , loginOut
} from '@/utils/utils';
const { Header } = Layout;

class HeaderView extends PureComponent {
  state = {
    modalVisible: false,
    submiting: false,
    visible: true,
    addData: [{
      type : 'input' ,
      label : '旧密码' ,
      input_type : 'password' ,
      name : 'oldPassword' ,
      placeholder : '请输入旧密码' ,
      initialValue : '' ,
      rules : [{
        required : true ,
        message : '请输入旧密码' ,
      }] ,
    },{
      type : 'input' ,
      label : '新密码' ,
      input_type : 'password' ,
      name : 'newPassword' ,
      placeholder : '请输入新密码' ,
      initialValue : '' ,
      rules : [{
        required : true ,
        message : '请输入新密码' ,
      }] ,
    },{
      type : 'input' ,
      label : '新密码确认' ,
      input_type : 'password' ,
      name : 'newPasswordCfm' ,
      placeholder : '请再次输入新密码' ,
      initialValue : '' ,
      rules : [{
        required : true ,
        message : '请再次输入新密码' ,
      }] ,
    },
    ],
  };

  static getDerivedStateFromProps(props, state) {
    if (!props.autoHideHeader && !state.visible) {
      return {
        visible: true,
      };
    }
    return null;
  }

  componentDidMount() {
    document.addEventListener('scroll', this.handScroll, { passive: true });
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handScroll);
  }

  getHeadWidth = () => {
    const { isMobile, collapsed, setting } = this.props;
    const { fixedHeader, layout } = setting;
    if (isMobile || !fixedHeader || layout === 'topmenu') {
      return '100%';
    }
    return collapsed ? 'calc(100%)' : 'calc(100%)';
  };

  handleNoticeClear = type => {
    message.success(
      `${formatMessage({ id: 'component.noticeIcon.cleared' })} ${formatMessage({
        id: `component.globalHeader.${type}`,
      })}`
    );
    const { dispatch } = this.props;
    dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  };

  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    if (key === 'userCenter') {
      router.push('/account/center');
      return;
    }
    if (key === 'triggerError') {
      router.push('/exception/trigger');
      return;
    }
    //修改密码
    if (key === 'userinfo') {
      this.setState({modalVisible:true});
      return;
    }
    if (key === 'logout') {
      loginOut();
    }
  };

  handleNoticeVisibleChange = visible => {
    if (visible) {
      const { dispatch } = this.props;
      dispatch({
        type: 'global/fetchNotices',
      });
    }
  };

  handScroll = () => {
    const { autoHideHeader } = this.props;
    const { visible } = this.state;
    if (!autoHideHeader) {
      return;
    }
    const scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
    if (!this.ticking) {
      this.ticking = true;
      requestAnimationFrame(() => {
        if (this.oldScrollTop > scrollTop) {
          this.setState({
            visible: true,
          });
        } else if (scrollTop > 300 && visible) {
          this.setState({
            visible: false,
          });
        } else if (scrollTop < 300 && !visible) {
          this.setState({
            visible: true,
          });
        }
        this.oldScrollTop = scrollTop;
        this.ticking = false;
      });
    }
  };

  sldHandleConfirm = (val) => {
    this.setState({submiting: true});
    const { dispatch } = this.props;
    if(val.newPassword != val.newPasswordCfm ){
        failTip('两次密码不一致，请重新输入');
      this.setState({submiting: false});
        return false;
    }
    dispatch({
      type: 'global/change_manager_pwd',
      payload:val,
      callback: (res) => {
        if(res.state==200){
          sucTip(res.msg);
          this.setState({modalVisible: false})
          //跳到登录界面
          router.replace('/user/login');
        }else{
          failTip(res.msg);
        }
        this.setState({submiting: false});
      }
    });

  }

  sldHandleCancle = () => {
    this.setState({modalVisible:false});
  }

  render() {
    const { isMobile, handleMenuCollapse, setting} = this.props;

    const { navTheme, layout, fixedHeader } = setting;
    const { visible,addData,submiting,modalVisible  } = this.state;
    const isTop = layout === 'topmenu';
    const width = this.getHeadWidth();
    const HeaderDom = visible ? (
      <Header style={{ padding: 0, width }} className={fixedHeader ? styles.fixedHeader : ''}>
        {isTop && !isMobile ? (
          <TopNavHeader
            theme={navTheme}
            mode="horizontal"
            onCollapse={handleMenuCollapse}
            onNoticeClear={this.handleNoticeClear}
            onMenuClick={this.handleMenuClick}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
            {...this.props}
          />
        ) : (
          <GlobalHeader
            onCollapse={handleMenuCollapse}
            onNoticeClear={this.handleNoticeClear}
            onMenuClick={this.handleMenuClick}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
            {...this.props}
          />
        )}
      </Header>
    ) : null;
    const formItemLayoutModal = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };
    return (
      <Fragment>
      <Animate component="" transitionName="fade">
        {HeaderDom}
      </Animate>
        {/*修改密码对话框-start*/}
        <SldModal
          title={'修改密码'}
          submiting={submiting}
          width={550}
          modalVisible={modalVisible}
          sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
          sldHandleCancle={this.sldHandleCancle}
          formItemLayoutModal={formItemLayoutModal}
          content={addData}
        />
        {/*修改密码对话框-end*/}
      </Fragment>
    );
  }
}

export default connect(({ user, global, setting, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
  setting,
}))(HeaderView);
