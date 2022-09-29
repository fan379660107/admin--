import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import RightContent from './RightContent';
import { sldSvgIcon, sldComLanguage, getSldImgSet,loginOut } from '@/utils/utils';
import { specialFlag,imUrl } from '@/utils/sldconfig';

//设置顶部logo
let main_admin_top_logo_local = require('../../assets/sld_java_logo.png');
let main_admin_top_logo = '';
let com_img_info = getSldImgSet('com_img_info');
if (com_img_info != '') {
    main_admin_top_logo = com_img_info.filter(item => item.name == 'main_admin_top_logo')[0].imageUrl || main_admin_top_logo_local;
}

export default class GlobalHeader extends PureComponent {
    state = {
        seleTitle: 'sysset',
    };

    componentDidMount() {

    }

    componentWillReceiveProps() {
        let sld_clear_xiegang = this.props.history.location.pathname.split('/');
        if (sld_clear_xiegang.length > 0) {
            let sldCurSeleTopArray = sld_clear_xiegang[1].split('_');
            if (sldCurSeleTopArray.length > 0) {
                this.setState({
                    seleTitle: sldCurSeleTopArray[0],
                });
            }
        }
    }

    componentWillUnmount() {
        this.triggerResizeEvent.cancel();
    }

    seleType = (val) => {
        let path = val.path;
        this.setState({
            seleTitle: val.top_nav,
        });
      if (val.top_nav == 'im') {
        if (localStorage.sld_token != undefined && localStorage.sld_token) {
          let userInfo = JSON.parse(localStorage.user_info);
          window.open(imUrl + `?sld_token=${localStorage.getItem('sld_token')}&adminId=${userInfo.adminId}&adminName=${userInfo.user_name}&isSuper=${localStorage.getItem('isSuper')}`, '_blank');
        } else {
          loginOut();
        }
      } else {
        this.props.history.replace(path);
      }
    };

    /* eslint-disable*/
    @Debounce(600)
    triggerResizeEvent() {
        // eslint-disable-line
        const event = document.createEvent('HTMLEvents');
        event.initEvent('resize', true, false);
        window.dispatchEvent(event);
    }

    toggle = () => {
        const { collapsed, onCollapse } = this.props;
        onCollapse(!collapsed);
        this.triggerResizeEvent();
    };

    render() {
        const { collapsed } = this.props;
        const { seleTitle } = this.state;
        const cur_top_nav_info = localStorage.getItem('cur_top_nav_info') != null ? JSON.parse(localStorage.getItem('cur_top_nav_info')) : '';
        return (
            <div className={styles.header}>
                <div className={styles.header_logo} onClick={() => this.props.history.replace('/sysset_home/basic')}>
                    <img src={main_admin_top_logo}  onError={(e) => {e.target.onerror = null;e.target.src=main_admin_top_logo_local}}/>
                </div>
                <div className={styles.trigger} onClick={this.toggle}>
                    <Icon style={{ color: '#FA6F1E', fontSize: 16 }} type={collapsed ? 'menu-unfold' : 'menu-fold'} />
                </div>
              <span className={styles.wraptype}>
                        {cur_top_nav_info && cur_top_nav_info.map((item, index) => {
                          return <span key={index}
                                       style={seleTitle == item.top_nav ? { background: 'rgba(255, 113, 30, .1)',color:'#EE600D' } : {}}
                                       onClick={() => this.seleType(item)}>
                                {item.top_nav == 'marketing'&&<img src={require('@/assets/marketing.png')} style={{width:17,height:17,marginTop:-3,marginRight:3}}/>
                                }
                            {(item.top_nav != 'marketing')&&<span className={styles.svgSpan}>{sldSvgIcon(seleTitle == item.top_nav ?'#EE600D':'#333', 16, 16, item.icon)}</span>
                            }
                            {sldComLanguage(item.name)}
                            </span>;
                        })
                        }
                    </span>
                <RightContent {...this.props} />
            </div>
        );
    }
}
