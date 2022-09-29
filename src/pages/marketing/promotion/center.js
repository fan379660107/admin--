import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin } from 'antd';
import { sldComLanguage, getSldEmptyH, failTip } from '@/utils/utils';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import SldScrollbars from '@/components/SldScrollbars';
import { specialFlag } from '@/utils/sldconfig';
import router from 'umi/router';

@connect(({ common, global }) => ({
  common, global,
}))
@Form.create()
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenW: document.body.clientWidth,//屏幕宽度
      emptyFlag: false,//是否展示空提示
      loading: false,//是否展示标识
      all_data: [
        {
          name: 'spell_group',
          icon: require('@/assets/center/spell_group.png'),
          title: `${sldComLanguage('拼团')}`,
          extraFlag: false,
          showFlag: false,
          desc: `${sldComLanguage('通过社交关系，降低拉新成本提提高获客效率。')}`,
          path: '/marketing_promotion/spell_group',
        },
        {
          name: 'ladder_group',
          icon: require('@/assets/center/ladder_group.png'),
          title: `${sldComLanguage('阶梯团')}`,
          extraFlag: false,
          showFlag: false,
          desc: `${sldComLanguage('进阶版拼团，可设置阶梯拼团价格。')}`,
          path: '/marketing_promotion/ladder_group',
        },
        {
          name: 'spreader',
          icon: require('@/assets/center/spreader.png'),
          title: `${sldComLanguage('推手')}`,
          extraFlag: true,
          desc: `${sldComLanguage('招募分销员，提高销售效率。')}`,
          path: '/marketing_spreader',
        },
        {
          name: 'sckill',
          icon: require('@/assets/center/sckill.png'),
          title: `${sldComLanguage('秒杀')}`,
          extraFlag: false,
          showFlag: false,
          desc: `${sldComLanguage('快速抢购，引导顾客完成消费。')}`,
          path: '/marketing_promotion/seckill',
        },
        {
          name: 'system_coupon',
          icon: require('@/assets/center/system_coupon.png'),
          title: `${sldComLanguage('平台优惠券')}`,
          extraFlag: false,
          showFlag: false,
          desc: `${sldComLanguage('新建和管理平台优惠券，促进下单转化。')}`,
          path: '/marketing_promotion/coupon',
        },
        {
          name: 'store_coupon',
          icon: require('@/assets/center/store_coupon.png'),
          title: `${sldComLanguage('店铺优惠券')}`,
          extraFlag: false,
          showFlag: false,
          desc: `${sldComLanguage('查看和管理平台内店铺的优惠券.')}`,
          path: '/marketing_promotion/store_coupon',
        },
        {
          name: 'rank',
          icon: require('@/assets/center/rank.png'),
          title: `${sldComLanguage('排行榜')}`,
          extraFlag: false,
          showFlag: false,
          desc: `${sldComLanguage('提供商品排行榜，引导顾客完成购买决策，挺高转化率.')}`,
          path: '/marketing_promotion/rank',
        },
        {
          name: 'svideo',
          icon: require('@/assets/center/svideo.png'),
          title: `${sldComLanguage('短视频')}`,
          extraFlag: false,
          showFlag: false,
          desc: `${sldComLanguage('短视频带货，以直观的内容促进转化。')}`,
          path: '/marketing_svideo',
        },
        {
          name: 'live',
          icon: require('@/assets/center/live.png'),
          title: `${sldComLanguage('直播')}`,
          extraFlag: true,
          showFlag: false,
          desc: `${sldComLanguage('会员与带货主播实时交流互动促进转化。')}`,
          path: '/marketing_live',
        },
        {
          name: 'presale',
          icon: require('@/assets/center/presale.png'),
          title: `${sldComLanguage('预售')}`,
          extraFlag: false,
          showFlag: false,
          desc: `${sldComLanguage('热门商品提前预发。')}`,
          path: '/marketing_promotion/presale',
        },
        {
          name: 'full_acm',
          icon: require('@/assets/center/full_acm.png'),
          title: `${sldComLanguage('满减')}`,
          extraFlag: false,
          showFlag: false,
          desc: `${sldComLanguage('满足条件的用户享受减价购买。')}`,
          path: '/marketing_promotion/full_discount',
          param: '?tab=1',
        },
        {
          name: 'full_asm',
          icon: require('@/assets/center/full_asm.png'),
          title: `${sldComLanguage('阶梯满减')}`,
          extraFlag: false,
          showFlag: false,
          desc: `${sldComLanguage('进阶版满减，满足条件的可享受多级优惠。')}`,
          path: '/marketing_promotion/full_discount',
          param: '?tab=2',
        },
        {
          name: 'full_ald',
          icon: require('@/assets/center/full_ald.png'),
          title: `${sldComLanguage('满N元折扣')}`,
          extraFlag: false,
          showFlag: false,
          desc: `${sldComLanguage('购买满N元享受折扣。')}`,
          path: '/marketing_promotion/full_discount',
          param: '?tab=3',
        },
        {
          name: 'full_nld',
          icon: require('@/assets/center/full_nld.png'),
          title: `${sldComLanguage('满N件折扣')}`,
          extraFlag: false,
          showFlag: false,
          desc: `${sldComLanguage('购买满N件享受折扣。')}`,
          path: '/marketing_promotion/full_discount',
          param: '?tab=4',
        },
        {
          name: 'recommend',
          icon: require('@/assets/center/recommend.png'),
          title: `${sldComLanguage('智能推荐')}`,
          extraFlag: true,
          showFlag: specialFlag > -3 ? true : false,
          desc: `${sldComLanguage('达到个性化推荐的效果，促进收益最大化。')}`,
          path: '',
        },
        {
          name: 'sign',
          icon: require('@/assets/center/sign.png'),
          title: `${sldComLanguage('签到')}`,
          extraFlag: false,
          showFlag: false,
          desc: `${sldComLanguage('签到送积分和优惠券，提高用户粘性。')}`,
          path: '/marketing_promotion/sign',
        },
        {
          name: 'point',
          icon: require('@/assets/center/point.png'),
          title: `${sldComLanguage('积分商城')}`,
          extraFlag: false,
          showFlag: false,
          desc: `${sldComLanguage('积分换购商品，促进用户购买。')}`,
          path: '/marketing_point',
        },
        {
          name: 'sign',
          icon: require('@/assets/center/lucky_draw.png'),
          title: `${sldComLanguage('幸运抽奖')}`,
          extraFlag: false,
          showFlag: false,
          desc: `${sldComLanguage('走马灯式抽奖。')}`,
          path: '/marketing_promotion/lucky_draw_list',
        },
        {
          name: 'sign',
          icon: require('@/assets/center/turnplate.png'),
          title: `${sldComLanguage('转盘抽奖')}`,
          extraFlag: false,
          showFlag: false,
          desc: `${sldComLanguage('转盘式抽奖。')}`,
          path: '/marketing_promotion/turnplate_list',
        },
        {
          name: 'sign',
          icon: require('@/assets/center/scratch.png'),
          title: `${sldComLanguage('刮刮卡')}`,
          extraFlag: false,
          showFlag: false,
          desc: `${sldComLanguage('刮卡式抽奖。')}`,
          path: '/marketing_promotion/scratch_list',
        },
        {
          name: 'sign',
          icon: require('@/assets/center/shake.png'),
          title: `${sldComLanguage('摇一摇')}`,
          extraFlag: false,
          showFlag: false,
          desc: `${sldComLanguage('摇动手机进行抽奖。')}`,
          path: '/marketing_promotion/shake_list',
        },
        {
          name: 'sign',
          icon: require('@/assets/center/turn.png'),
          title: `${sldComLanguage('翻翻看')}`,
          extraFlag: false,
          showFlag: false,
          desc: `${sldComLanguage('翻转卡片进行抽奖。')}`,
          path: '/marketing_promotion/turn_list',
        },
        {
          name: 'sms_msg',
          icon: require('@/assets/center/sms_msg.png'),
          title: `${sldComLanguage('短信')}`,
          extraFlag: false,
          showFlag: false,
          desc: `${sldComLanguage('短信形式高效触达用户。')}`,
          path: '/sysset_notice_set/msg_tpl',
        },
        {
          name: 'push',
          icon: require('@/assets/center/push.png'),
          title: `${sldComLanguage('推送')}`,
          extraFlag: false,
          showFlag: specialFlag > -3 ? true : false,
          desc: `${sldComLanguage('时效信息、促销活动，智能推送给用户。')}`,
          path: '',
        },
        {
          name: 'toast',
          icon: require('@/assets/center/toast.png'),
          title: `${sldComLanguage('弹窗')}`,
          extraFlag: false,
          showFlag: false,
          desc: `${sldComLanguage('阻断用户行为，提高触达转化率。')}`,
          path: '',
        },
        {
          name: 'system_msg',
          icon: require('@/assets/center/system_msg.png'),
          title: `${sldComLanguage('站内信')}`,
          extraFlag: false,
          showFlag: false,
          desc: `${sldComLanguage('应用内以消息的形式触达用户。')}`,
          path: '/sysset_notice_set/msg_tpl',
        },
      ],//所有应用一维数据
      data: [
        {
          title: `${sldComLanguage('拉新获客')}`,
          child_path_array: ['/marketing_spreader', '/marketing_promotion'],
          child_name_array: ['spreader', 'spell_group', 'ladder_group'],
          show_num: 0,//展示应用的数量
          child: [],
        },
        {
          title: `${sldComLanguage('促进转化')}`,
          child_path_array: ['/marketing_svideo', '/marketing_live', '/marketing_promotion'],
          child_name_array: ['svideo', 'live', 'sckill', 'system_coupon', 'store_coupon', 'rank'],
          show_num: 0,//展示应用的数量
          child: [],
        },
        {
          title: `${sldComLanguage('提高客单价')}`,
          child_path_array: ['recommend', 'marketing_promotion'],
          child_name_array: ['recommend', 'presale', 'full_acm', 'full_asm', 'full_ald', 'full_nld'],
          show_num: 0,//展示应用的数量
          child: [],
        },
        {
          title: `${sldComLanguage('留存复购')}`,
          child_path_array: ['marketing_point', 'marketing_promotion'],
          child_name_array: ['sign', 'point'],
          show_num: 0,//展示应用的数量
          child: [],
        },
        {
          title: `${sldComLanguage('运营工具')}`,
          child_path_array: ['sysset_notice_set', 'marketing_promotion', 'push', 'decorate'],
          child_name_array: ['sms_msg', 'push', 'toast', 'system_msg'],
          show_num: 0,//展示应用的数量
          child: [],
        },
      ],//应用中心数据
    };
  }

  menu = ['/marketing_spreader', '/marketing_promotion', '/marketing_svideo', '/marketing_live', '/recommend', '/marketing_point', '/sysset_notice_set', '/push', '/decorate_pc', '/decorate_m'];//拥有的菜单字符串数组

  componentDidMount() {
    this.resize();
    window.addEventListener('resize', this.resize, { passive: true });
    this.props.dispatch({
      type: 'global/getLayoutCollapsed',
    });
    this.initData();
  }

  initData = () => {
    let { emptyFlag, data, all_data } = this.state;
    let sld_menu_data = localStorage.getItem('sld_menu_data');
    if (sld_menu_data != undefined && sld_menu_data) {
      sld_menu_data = JSON.parse(sld_menu_data);//全部菜单缓存数据
    }
    let cur_menu_data = sld_menu_data.filter(item => this.menu.indexOf(item.frontPath) > -1);//当前页面拥有的菜单数据
    if (cur_menu_data.length > 0) {
      cur_menu_data.map(item => {
        if (item.frontPath == '/marketing_svideo' || item.frontPath == '/marketing_live' || item.frontPath == '/marketing_point' || item.frontPath == '/marketing_spreader') {
          let temp_data = all_data.filter(child => child.path == item.frontPath);
          temp_data[0].showFlag = true;
          temp_data[0].path = item.children[0].frontPath;
        } else if (item.frontPath == '/marketing_promotion' || item.frontPath == '/sysset_notice_set') {
          let all_child_path = [];//该管理员所拥有的应用中心菜单名称数组
          item.children.map(child => {
            all_child_path.push(child.frontPath);
          });
          all_data.map(child => {
            if (all_child_path.indexOf(child.path) > -1) {
              child.showFlag = true;
            }
          });
        } else if (item.frontPath.indexOf('decorate') > -1) {
          //弹窗路径，优先移动端首页开屏图，再PC端开屏图
          let temp_data = all_data.filter(child => child.name == 'toast');
          temp_data[0].showFlag = true;
          if (item.frontPath == '/decorate_m') {
            temp_data[0].path = '/decorate_m/lists';
          } else if (item.frontPath == '/decorate_pc') {
            temp_data[0].path = '/decorate_pc/home_setting';
          }
        }
      });

      //将all_data 下面的数据都分别组装到data里面
      data.map(item => {
        all_data.map(child => {
          if (item.child_name_array.indexOf(child.name) > -1 && child.showFlag) {
            item.child.push({ ...child });
            item.show_num += 1;
          }
        });
      });

    } else {
      emptyFlag = true;
    }
    this.setState({
      emptyFlag,
      data,
      all_data,
      loading: false,
    });
  };

  resize = () => {
    this.setState({ screenW: document.body.clientWidth });
  };

  go = (val) => {
    if (val.name == 'recommend' || val.name == 'push') {
      failTip('更新中，敬请期待～');
    } else {
      let path = val.path;
      if (val.param != undefined && val.param) {
        path += val.param;
      }
      router.push(path);
    }
  };

  render() {
    const { data, screenW, loading } = this.state;
    const mainW = this.props.global != undefined && this.props.global.collapsed != undefined && this.props.global.collapsed ? 90 : 150;
    let itemW = (screenW * 1 - mainW - 120) / 4;
    let descW = itemW - 60 - 40 - 15;
    return (
      <Spin spinning={loading}>
        <div className={`${global.common_page} ${promotion.center}`} style={{ flex: 1 }}>
          <SldScrollbars
            autoHeight
            autoHeightMin={100}
            autoHeightMax={document.body.clientHeight - 60}
          >
            <div className={`${promotion.center_title} ${global.flex_row_start_ceter}`}>应用中心</div>
            {data.map((item, index) => {
              return item.show_num ?
                <div key={index} className={`${promotion.center_item} ${global.flex_column_start_start}`}>
                  <div className={`${promotion.center_item_title}`}>{item.title}</div>
                  <div className={`${promotion.center_item_content} ${global.flex_row_start_center}`}
                       style={{ flexWrap: 'wrap' }}>
                    {item.child.map((child_item, child_index) => {
                      return <div key={child_index} className={`${promotion.child_item} ${global.flex_row_start_start}`}
                                  style={{ marginLeft: child_index % 4 > 0 ? 20 : 0, width: itemW }}
                                  onClick={() => this.go(child_item)}>
                        <img className={`${promotion.left_img}`} src={child_item.icon}/>
                        <div className={`${promotion.right_part} ${global.flex_column_center_start}`}>
                          <div className={`${promotion.right_part_top} ${global.flex_row_start_start}`}>
                            <span className={`${promotion.top_title}`}>{child_item.title}</span>
                            {child_item.extraFlag && specialFlag > -3 &&
                            <span className={`${promotion.top_flag} ${global.flex_row_center_center}`}>加配</span>
                            }
                          </div>
                          <span className={`${promotion.desc}`} style={{ width: descW }}
                                title={child_item.desc}>{child_item.desc}</span>
                        </div>
                      </div>;
                    })
                    }
                  </div>
                </div> : null;
            })}
            {getSldEmptyH(60)}
          </SldScrollbars>
        </div>
      </Spin>
    );
  }
}
