import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import { Form, Spin, Tabs } from 'antd';
import {
  sldLlineRtextAddGoods,
  sldComLanguage,
  getSldEmptyH,
  sldIconBtnBg,
  quillEscapeToHtml
} from '@/utils/utils';
import global from '@/global.less';
import styles from './detail.less';
import { Scrollbars } from 'react-custom-scrollbars';

const TabPane = Tabs.TabPane;
let pageSize_receipt = 10;
@connect(({ product }) => ({
  product,
}))
@Form.create()
export default class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,//按钮loading
      query: props.location.query,
      detail_data: {},
    };
  }

  componentDidMount() {
    const { query } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'member/get_member_detail',
      payload: {
        memberId: query.id
      },
      callback: res => {
        if (res.state == 200) {
          this.setState({
            detail_data: res.data
          })
        }
      }
    })
  }

  componentWillReceiveProps(nextProps, nextContext) {

  }

  render() {
    const { loading, query, detail_data } = this.state;
    return (
      <div className={global.common_page}>
        <Spin spinning={loading}>
          <div className={global.flex_com_space_between} style={{
            marginTop: 0,
            marginBottom: 5,
            paddingBottom: '13px',
            borderBottom: '1px solid #f2f2f2'
          }}>
            {sldLlineRtextAddGoods('#FA6F1E', `${sldComLanguage('会员详情')}`)}{/*会员详情*/}
            {sldIconBtnBg(() => router.go(-1), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
          </div>
          <Scrollbars
            autoHeight
            autoHeightMin={100}
            autoHeightMax={document.body.clientHeight - 110}
          >
          <div className={styles.common_title}>{sldComLanguage('基本信息')}</div>
          <div className={styles.basic_info}>
            <div className={styles.basic_portrait}>
              <img src={detail_data.memberAvatar} />
              <p>{sldComLanguage('会员头像')}</p>
            </div>
            <div className={styles.basic_introduce_wrap}>
              <div className={styles.basic_introduce}>
                <div className={styles.introduce_item}>
                  <p>{sldComLanguage('会员名称')}：<span className={styles.item_text}>{detail_data.memberName}</span></p>
                  <p>{sldComLanguage('真实姓名')}：<span className={styles.item_text}>{detail_data.memberTrueName ?
                    quillEscapeToHtml(detail_data.memberTrueName) : '--'}</span></p>
                  <p>{sldComLanguage('昵称')}：<span className={styles.item_text}>{detail_data.memberNickName}</span></p>
                </div>
                <div className={styles.introduce_item}>
                  <p>{sldComLanguage('性别')}：<span className={styles.item_text}>{detail_data.genderValue}</span></p>
                  <p>{sldComLanguage('生日')}：<span className={styles.item_text}>{detail_data.memberBirthday}</span></p>
                  <p>{sldComLanguage('手机号')}：<span className={styles.item_text}>{detail_data.memberMobile}</span></p>
                </div>
                <div className={styles.introduce_item}>
                  <p>{sldComLanguage('邮箱')}：<span className={styles.item_text}>{detail_data.memberEmail}</span></p>
                </div>
              </div>
              <div className={styles.basic_row}>
                <p><span className={styles.item_text}>{sldComLanguage('来源')}：</span>{detail_data.registerChannelValue}</p>
                <p><span className={styles.item_text}>{sldComLanguage('注册时间')}：</span>{detail_data.registerTime}</p>
                <p><span className={styles.item_text}>{sldComLanguage('最近登陆IP')}：</span>{detail_data.lastLoginIp}</p>
                <p><span className={styles.item_text}>{sldComLanguage('最近下单时间')}：</span>{detail_data.createTime}</p>
              </div>
            </div>

          </div>
          <div className={styles.common_title}>{sldComLanguage('交易信息')}</div>
          <div className={styles.trading_info}>
            <div className={styles.trading_row}>
              <p className={styles.trading_item} style={{borderRight: '1px solid rgba(214,218,242,.2)'}}>{sldComLanguage('客单价（元）')}</p>
              <p className={styles.trading_item} style={{borderRight: '1px solid rgba(214,218,242,.2)'}}>{sldComLanguage('累计消费金额（元）')}</p>
              <p className={styles.trading_item} style={{borderRight: '1px solid rgba(214,218,242,.2)'}}>{sldComLanguage('累计消费订单（单）')}</p>
              <p className={styles.trading_item} style={{borderRight: '1px solid rgba(214,218,242,.2)'}}>{sldComLanguage('累计退款金额（元）')}</p>
              <p className={styles.trading_item} >{sldComLanguage('累计退款订单（单）')}</p>
            </div>
            <div className={styles.trading_row}>
              <p className={styles.trading_item}>{detail_data.pstPrice}</p>
              <p className={styles.trading_item}>{detail_data.orderAmount}</p>
              <p className={styles.trading_item}>{detail_data.orderNumber}</p>
              <p className={styles.trading_item}>{detail_data.refundAmount}</p>
              <p className={styles.trading_item}>{detail_data.refundOrderNumber}</p>
            </div>
          </div>
          <div className={styles.common_title}>{sldComLanguage('资产信息')}</div>
          <div className={styles.assets_info}>
            <div className={styles.assets_item}>
              <p title={`${detail_data.balanceAvailable}`}>{detail_data.balanceAvailable}</p>
            </div>
            <div className={styles.assets_item}>
              <p title={`${detail_data.memberIntegral}`}>{detail_data.memberIntegral}</p>
            </div>
            <div className={styles.assets_item}>
              <p title={`${detail_data.couponNumber}`}>{detail_data.couponNumber}</p>
            </div>
          </div>
            {getSldEmptyH(20)}
          </Scrollbars>
        </Spin>
      </div>
    );
  }
}
