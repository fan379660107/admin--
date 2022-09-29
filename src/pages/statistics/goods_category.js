import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin } from 'antd';
import {
  sldLlineRtextAddGoodsAddMargin,
  sldComLanguage,
} from '@/utils/utils';
import global from '@/global.less';
import stat from '@/assets/css/stat.less';
import StatisticsReportGoodsCategory from './report/goods_category';
import Pie from '@/components/SldStatBizcharts/Pie';
import SldStatDate from '@/components/SldStatDate';
import moment from 'moment';
import CategorySalesTrendTop from '@/components/SldStat/CategorySalesTrendTop';
import SldScrollbars from '@/components/SldScrollbars';

@connect(({ statistics }) => ({
  statistics,
}))
@Form.create()

export default class StatisticsGoodsCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categorySaleAmountPercentLoading: false,//品类销售额占比模块loading
      categoryReturnSaleAmountPercentLoading: false,//品类退货占比模块loading
      categorySaleAmountPercentData: [],//品类销售额占比数据
      categoryReturnSaleAmountPercentData: [],//品类退货占比数据
      categorySaleAmountPercentParams: {
        startTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
        endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
      },//品类销售额占比的筛选条件
      categoryReturnSaleAmountPercentParams: {
        startTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
        endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
      },//品类退货占比的筛选条件
    };
  };

  componentDidMount() {
    this.getCategorySaleAmountPercentData();
    this.getCategoryReturnSaleAmountPercentData();
  }

  //获取品类销售额占比数据
  getCategorySaleAmountPercentData = () => {
    this.setState({ categorySaleAmountPercentLoading: true });
    const { dispatch } = this.props;
    let { categorySaleAmountPercentParams } = this.state;
    let categorySaleAmountPercentData = [];
    dispatch({
      type: 'statistics/get_category_sale_amount_percent',
      payload: categorySaleAmountPercentParams,
      callback: (res) => {
        this.setState({ categorySaleAmountPercentLoading: false });
        if (res.state == 200) {
          res.data.map(item => {
            categorySaleAmountPercentData.push({
              item: item.categoryName,
              count: item.saleAmount,
            });
          });
          this.setState({
            categorySaleAmountPercentData,
          });
        }
      },
    });
  };

  //获取品类退货占比数据
  getCategoryReturnSaleAmountPercentData = () => {
    this.setState({ categoryReturnSaleAmountPercentLoading: true });
    const { dispatch } = this.props;
    let { categoryReturnSaleAmountPercentParams } = this.state;
    let categoryReturnSaleAmountPercentData = [];
    dispatch({
      type: 'statistics/get_category_return_sale_amount_percent',
      payload: categoryReturnSaleAmountPercentParams,
      callback: (res) => {
        this.setState({ categoryReturnSaleAmountPercentLoading: false });
        if (res.state == 200) {
          res.data.map(item => {
            categoryReturnSaleAmountPercentData.push({
              item: item.categoryName,
              count: item.returnNum,
            });
          });
          this.setState({
            categoryReturnSaleAmountPercentData,
          });
        }
      },
    });
  };

  //时间筛选器返回的时间数据
  updateSelectDate = (date, index) => {
    let { categorySaleAmountPercentParams, categoryReturnSaleAmountPercentParams } = this.state;
    let _this = this;
    if (index == '_category_sales_amount_percent') {
      //品类销售额占比的时间筛选
      categorySaleAmountPercentParams = { ...categorySaleAmountPercentParams, ...date };
      this.setState({ categorySaleAmountPercentParams }, () => {
        _this.getCategorySaleAmountPercentData();
      });
    } else if (index == '_category_return_sales_amount_percent') {
      //品类退货占比的时间筛选
      categoryReturnSaleAmountPercentParams = { ...categoryReturnSaleAmountPercentParams, ...date };
      this.setState({ categoryReturnSaleAmountPercentParams }, () => {
        _this.getCategoryReturnSaleAmountPercentData();
      });
    }
  };

  render() {
    const { categorySaleAmountPercentLoading, categorySaleAmountPercentData, categoryReturnSaleAmountPercentData, categoryReturnSaleAmountPercentLoading } = this.state;
    return (
      <div className={`${stat.saling_stat} ${stat.stat_part}`} style={{ flex: 1, marginTop: 0 }}>
        <SldScrollbars
          autoHeight
          autoHeightMin={100}
          autoHeightMax={document.body.clientHeight - 60}
        >
          {/* TOP10品类销售趋势-start */}
          <CategorySalesTrendTop/>
          {/* TOP10品类销售趋势-end */}

          <div className={`${global.flex_row_start_start}`} style={{ flexWrap: 'wrap' }}>
            {/* 品类销售额占比-start */}
            <div className={`${stat.common_table_item}`}>
              <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
                {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('品类销售额占比')}`, 10, 0, 0)}
                <SldStatDate idIndex={'_category_sales_amount_percent'}
                             updateSelectDate={(date) => this.updateSelectDate(date, '_category_sales_amount_percent')}/>
              </div>
              <Spin spinning={categorySaleAmountPercentLoading}>
                <div className={`${stat.table_main}`}>
                  <Pie data={categorySaleAmountPercentData} tipTitle={sldComLanguage('品类销售额占比')} axisType={'amount'}/>
                </div>
              </Spin>
            </div>
            {/* 品类销售额占比-end */}

            {/* 品类退货占比-start */}
            <div className={`${stat.common_table_item}`}>
              <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
                {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('品类退货占比')}`, 10, 0, 0)}
                <SldStatDate idIndex={'_category_return_sales_amount_percent'}
                             updateSelectDate={(date) => this.updateSelectDate(date, '_category_return_sales_amount_percent')}/>
              </div>
              <Spin spinning={categoryReturnSaleAmountPercentLoading}>
                <div className={`${stat.table_main}`}>
                  <Pie data={categoryReturnSaleAmountPercentData} tipTitle={sldComLanguage('品类退款退货订单数占比')}
                       showNumPrecision={0}/>
                </div>
              </Spin>
            </div>
            {/* 品类退货占比-end */}

          </div>

          {/* 品类销售报表-start */}
          <StatisticsReportGoodsCategory/>
          {/* 品类销售报表-end */}
        </SldScrollbars>
      </div>
    );
  }
}
