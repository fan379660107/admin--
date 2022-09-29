import { connect } from 'dva/index';
import moment from 'moment';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Radio } from 'antd';
import {
  sldLlineRtextAddGoodsAddMargin,
  sldComLanguage,
  noDataPlaceholder,
} from '@/utils/utils';
import global from '@/global.less';
import stat from '@/assets/css/stat.less';
import SldStatDate from '@/components/SldStatDate';
import AreaStack from '@/components/SldStatBizcharts/AreaStack';

@connect(({ common }) => ({
  common,
}))
@Form.create()

export default class GoodsSalesTrendTop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goodsSalesTendLoading: false,//商品动销趋势模块loading
      goodsSalesTrendRandParams: {
        startTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
        endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
      },//商品动销趋势的筛选条件
      goodsSalesTendData: [],//商品销售变化趋势-TOP10(销量数据)
      goodsSalesTendAmountData: [],//商品销售变化趋势-TOP10(销售额数据)
      goodsSalesTendAllData: [],//商品动销趋势全部数据
      curGoodsSalesTendDataTopActive: 'amount',//商品销售变化趋势-TOP10当前tab amount-销售额 sales-销量
    };
  };

  componentDidMount() {
    this.getGoodsSalesTendRandData();
  }

  //获取商品动销趋势数据
  getGoodsSalesTendRandData = () => {
    this.setState({ goodsSalesTendLoading: true });
    const { dispatch } = this.props;
    let { goodsSalesTrendRandParams } = this.state;
    let goodsSalesTendData = [];
    let goodsSalesTendAmountData = [];
    dispatch({
      type: 'common/get_goods_sales_trend_top',
      payload: goodsSalesTrendRandParams,
      callback: (res) => {
        this.setState({ goodsSalesTendLoading: false });
        if (res.state == 200) {
          if (res.data.length > 0) {
            res.data.map(item => {
              item.goodsList.map(child => {
                goodsSalesTendData.push({
                  month: item.statsTime,
                  city: child.goodsName,
                  temperature: child.saleNum,
                });
                goodsSalesTendAmountData.push({
                  month: item.statsTime,
                  city: child.goodsName,
                  temperature: child.saleAmount,
                });
              });
            });
          }
          this.setState({
            goodsSalesTendData,
            goodsSalesTendAmountData,
          });
        }
      },
    });
  };

  //时间筛选器返回的时间数据
  updateSelectDate = (date, index) => {
    let { goodsSalesTrendRandParams } = this.state;
    let _this = this;
    if (index == '_goods_sales_rand') {
      //商品动销趋势的时间筛选
      goodsSalesTrendRandParams = { ...goodsSalesTrendRandParams, ...date };
      this.setState({ goodsSalesTrendRandParams }, () => {
        _this.getGoodsSalesTendRandData();
      });
    }
  };

  //销售额、销量切换事件
  handleChangeTab = (e) => {
    this.setState({ curGoodsSalesTendDataTopActive: e.target.value });
  };

  render() {
    const { goodsSalesTendLoading, goodsSalesTendData, curGoodsSalesTendDataTopActive, goodsSalesTendAmountData } = this.state;
    return (
      <div style={{ margin: '10px 0', paddingBottom: 10, width: '100%' }} className={`${stat.common_table_item}`}>
        <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
          <div className={`${global.flex_row_start_center}`}>
            {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('商品销售变化趋势 - TOP10')}`, 10, 0, 0)}
            <div style={{ marginLeft: 10 }}>
              <Radio.Group size={'small'} onChange={(e) => this.handleChangeTab(e)}
                           defaultValue={curGoodsSalesTendDataTopActive}>
                <Radio.Button value="amount">销售额</Radio.Button>
                <Radio.Button value="sales">销量</Radio.Button>
              </Radio.Group>
            </div>
          </div>
          <SldStatDate idIndex={'_goods_sales_rand'}
                       updateSelectDate={(date) => this.updateSelectDate(date, '_goods_sales_rand')}/>
        </div>
        <Spin spinning={goodsSalesTendLoading}>
          <div style={{ height: 498 }}>
            <div style={{ padding: '10px 20px 35px 20px', height: 443 }}>
              {curGoodsSalesTendDataTopActive == 'amount' &&
              <Fragment>
                {goodsSalesTendAmountData.length > 0
                  ? <AreaStack data={goodsSalesTendAmountData} unit={'¥'}/>
                  : noDataPlaceholder()
                }
              </Fragment>
              }
              {curGoodsSalesTendDataTopActive == 'sales' &&
              <Fragment>
                {goodsSalesTendData.length > 0
                  ? <AreaStack data={goodsSalesTendData}/>
                  : noDataPlaceholder()
                }
              </Fragment>
              }
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}
