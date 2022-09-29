/*
* 统计里TOP10品类销售趋势
* @zjf-2021-06-30
* */
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
import BarStack from '@/components/SldStatBizcharts/BarStack';

const barColor = ['name', ['rgba(2, 137, 255, 1)', 'rgba(236, 140, 100, 1)', 'rgba(62, 207, 250, 1)', 'rgba(138, 125, 250, 1)', 'rgba(124, 140, 168, 1)', 'rgba(248, 201, 78, 1)', 'rgba(30, 135, 240, 1)', 'rgba(224, 224, 224, 1)', 'rgba(255, 123, 123, 1)', 'rgba(38, 172, 106, 1)']];//TOP10品类销售趋势——柱状图颜色

@connect(({ common }) => ({
  common,
}))
@Form.create()

export default class CategorySalesTrendTop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goodsSalesTendLoading: false,//商品动销趋势模块loading
      goodsSalesTendParams: {
        startTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
        endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
      },//商品动销趋势的筛选条件
      goodsSalesTendData: [],//TOP10品类销售趋势面积图数据（销量）
      goodsSalesTendAmountData: [],//TOP10品类销售趋势面积图数据（销售额）
      goodsSalesTendAllData: [],//商品动销趋势全部数据
      goodsSalesTendBarAmountData: [],//TOP10品类销售趋势柱状图数据（销售额）
      goodsSalesTendBarData: [],//TOP10品类销售趋势柱状图数据（销量）
      curGoodsSalesTendDataTopActive: 'amount',//商品销售变化趋势-TOP10当前tab amount-销售额 sales-销量
      showType: 'area',//展示类型，默认为area area-面积图 bar-柱状图
      areaShowType: 'amount',//面积图展示类型，默认为amount amount-销售额 sales-销量
    };
  };

  componentDidMount() {
    this.getGoodsSalesTendData();
  }

  //获取商品动销趋势数据
  getGoodsSalesTendData = () => {
    this.setState({ goodsSalesTendLoading: true });
    const { dispatch } = this.props;
    let { goodsSalesTendParams, goodsSalesTendAllData } = this.state;
    let goodsSalesTendBarData = [];
    let goodsSalesTendBarAmountData = [];
    let goodsSalesTendData = [];
    let goodsSalesTendAmountData = [];
    dispatch({
      type: 'common/get_category_sales_rank',
      payload: goodsSalesTendParams,
      callback: (res) => {
        this.setState({ goodsSalesTendLoading: false });
        if (res.state == 200) {
          goodsSalesTendAllData = res.data;
          if (res.data.length > 0) {

            res.data.map(item => {
              item.categoryList.map(child => {
                //柱状图数据处理-start
                goodsSalesTendBarAmountData.push({
                  key: item.statsTime,
                  name: child.categoryName,
                  value: child.saleAmount,
                });
                goodsSalesTendBarData.push({
                  key: item.statsTime,
                  name: child.categoryName,
                  value: child.saleNum,
                });
                //柱状图数据处理-end

                //面积图数据处理-start
                goodsSalesTendAmountData.push({
                  month: item.statsTime,
                  city: child.categoryName,
                  temperature: child.saleAmount,
                });
                goodsSalesTendData.push({
                  month: item.statsTime,
                  city: child.categoryName,
                  temperature: child.saleNum,
                });
                //面积图数据处理-end
              });
            });
          }
          this.setState({
            goodsSalesTendAllData,
            goodsSalesTendBarAmountData,
            goodsSalesTendBarData,
            goodsSalesTendData,
            goodsSalesTendAmountData,
          });
        }
      },
    });
  };

  //时间筛选器返回的时间数据
  updateSelectDate = (date, index) => {
    let { goodsSalesTendParams } = this.state;
    let _this = this;
    if (index == '_goods_sales_trend') {
      //商品动销趋势的时间筛选
      goodsSalesTendParams = { ...goodsSalesTendParams, ...date };
      this.setState({ goodsSalesTendParams }, () => {
        _this.getGoodsSalesTendData();
      });
    }
  };

  //tab切换事件
  handleChangeTab = (e, type) => {
    this.setState({ [type]: e.target.value });
  };

  render() {
    const { goodsSalesTendLoading, goodsSalesTendData, showType, areaShowType, goodsSalesTendBarData, goodsSalesTendBarAmountData, goodsSalesTendAmountData } = this.state;
    return (
      <div style={{ margin: '0 0 10px 0', paddingBottom: 10, width: '100%' }} className={`${stat.common_table_item}`}>
        <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
          <div className={`${global.flex_row_start_center}`}>
            {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('TOP10品类销售趋势')}`, 10, 0, 0)}
            <div style={{ marginLeft: 10 }}>
              <Radio.Group size={'small'} onChange={(e) => this.handleChangeTab(e, 'showType')}
                           defaultValue={showType}>
                <Radio.Button value="area">面积图</Radio.Button>
                <Radio.Button value="bar">柱状图</Radio.Button>
              </Radio.Group>
            </div>
          </div>
          <SldStatDate idIndex={'_goods_sales_trend'}
                       updateSelectDate={(date) => this.updateSelectDate(date, '_goods_sales_trend')}/>
        </div>
        <Spin spinning={goodsSalesTendLoading}>
          <div className={`${stat.stat_common_table}`} style={{ paddingLeft: 10, height: 520 }}>
            <div style={{ margin: '12px 0 0 20px' }}>
              <Radio.Group size={'small'} onChange={(e) => this.handleChangeTab(e, 'areaShowType')}
                           defaultValue={areaShowType}>
                <Radio.Button value="amount">销售额</Radio.Button>
                <Radio.Button value="sales">销量</Radio.Button>
              </Radio.Group>
            </div>
            <div style={{ padding: '10px 20px 35px 20px', height: 443 }}>
              {showType == 'area'
                ? (goodsSalesTendBarData.length > 0
                    ? <AreaStack
                      data={areaShowType == 'amount' ? goodsSalesTendAmountData : goodsSalesTendData}
                      unit={areaShowType == 'amount' ? '¥' : ''}/>
                    : noDataPlaceholder()
                )
                : (goodsSalesTendBarData.length > 0
                    ? <BarStack
                      data={areaShowType == 'amount' ? goodsSalesTendBarAmountData : goodsSalesTendBarData}
                      color={barColor}
                      flag={2}
                      unit={areaShowType == 'amount' ? '¥' : ''}/>
                    : noDataPlaceholder()
                )
              }
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}
