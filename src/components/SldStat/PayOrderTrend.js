import { connect } from 'dva/index';
import moment from 'moment';
import React, { Component } from 'react';
import { Form, Spin } from 'antd';
import { sldLlineRtextAddGoodsAddMargin, sldComLanguage, noDataPlaceholder } from '@/utils/utils';
import global from '@/global.less';
import stat from '@/assets/css/stat.less';
import SldStatDate from '@/components/SldStatDate';
import LineArea from '@/components/SldStatBizcharts/LineArea';

@connect(({ common }) => ({
  common,
}))
@Form.create()

export default class PayOrderTrend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payOrderTrendInitLoading: false,//支付/下单金额趋势模块加载状态
      payOrderTrendParams: {
        startTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
        endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
      },//支付/下单金额趋势的筛选条件
      payOrderTrendData: [],//支付/下单金额趋势数据
    };
  }

  componentDidMount() {
    this.getPayOrderTrend();
  }

  //时间筛选器返回的时间数据
  updateSelectDate = (date, index) => {
    let { payOrderTrendParams } = this.state;
    let _this = this;
    if (index == '_pay_order_trend') {
      //支付/下单金额趋势的时间筛选
      payOrderTrendParams = { ...payOrderTrendParams, ...date };
      this.setState({ payOrderTrendParams }, () => {
        _this.getPayOrderTrend();
      });
    }
  };

  //获取支付/下单金额趋势的数据
  getPayOrderTrend = () => {
    this.setState({ payOrderTrendInitLoading: true });
    const { dispatch } = this.props;
    let { payOrderTrendParams } = this.state;
    let payOrderTrendData = [];
    dispatch({
      type: 'common/get_pay_order_trend',
      payload: payOrderTrendParams,
      callback: (res) => {
        this.setState({ payOrderTrendInitLoading: false });
        if (res.state == 200) {
          let data = res.data;
          for (let i in data.orderAmountList) {
            payOrderTrendData.push({
              month: data.orderAmountList[i].statsTime,
              city: `${sldComLanguage('下单金额')}`,
              temperature: data.orderAmountList[i].orderSubmitAmount,
            });
            payOrderTrendData.push({
              month: data.payAmountList[i].statsTime,
              city: `${sldComLanguage('支付金额')}`,
              temperature: data.payAmountList[i].orderPayAmount,
            });
          }
          this.setState({
            payOrderTrendData,
          });
        }
      },
    });
  };

  render() {
    const { payOrderTrendInitLoading, payOrderTrendData } = this.state;
    return (
      <div className={`${stat.visualized_item}`}>
        <div className={`${stat.top_info_operate} ${global.flex_com_space_between}`}>
          <div className={`${stat.left_label}`}>
            {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('支付/下单金额趋势')}`, 10, 0, 0)}
          </div>
          <SldStatDate idIndex={'_pay_order_trend'}
                       updateSelectDate={(date) => this.updateSelectDate(date, '_pay_order_trend')}/>
        </div>
        <Spin spinning={payOrderTrendInitLoading}>
          <div className={`${stat.main_area}`}>
            {payOrderTrendData.length>0
              ?<LineArea data={payOrderTrendData} unit={'¥'}/>
              :noDataPlaceholder()
            }
          </div>
        </Spin>
      </div>
    );
  }
}
