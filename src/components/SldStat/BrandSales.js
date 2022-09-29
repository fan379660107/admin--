import { connect } from 'dva/index';
import moment from 'moment';
import React, { Component } from 'react';
import { Form, Spin, Radio } from 'antd';
import { sldLlineRtextAddGoodsAddMargin, sldComLanguage } from '@/utils/utils';
import global from '@/global.less';
import stat from '@/assets/css/stat.less';
import SldStatDate from '@/components/SldStatDate';
import Pie from '@/components/SldStatBizcharts/Pie';

@connect(({ sldsetting, common }) => ({
  sldsetting, common,
}))
@Form.create()

export default class BrandSales extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brandInitLoading: false,//品牌销售占比模块加载状态
      data: {},
      brandSalesParams: {
        startTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
        endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
      },//品牌销售占比的筛选条件
      brandSalesData: [],//品牌销售占比数据
    };
  }

  componentDidMount() {
    this.getBrandSalesPercent();
  }

  //时间筛选器返回的时间数据
  updateSelectDate = (date, index) => {
    let { brandSalesParams } = this.state;
    let _this = this;
    if (index == '_brand_sales') {
      //品牌销售占比的时间筛选
      brandSalesParams = { ...brandSalesParams, ...date };
      this.setState({ brandSalesParams }, () => {
        _this.getBrandSalesPercent();
      });
    }
  };

  //获取品牌销售占比数据
  getBrandSalesPercent = () => {
    this.setState({ brandInitLoading: true });
    const { dispatch } = this.props;
    let { brandSalesParams } = this.state;
    let brandSalesData = [];
    dispatch({
      type: 'common/get_brand_sales_percent',
      payload: brandSalesParams,
      callback: (res) => {
        this.setState({ brandInitLoading: false });
        if (res.state == 200) {
          if (brandSalesParams.sort != undefined && brandSalesParams.sort == 2) {
            //按照销量查询
            res.data.saleNumList.map(item => {
              brandSalesData.push({ item: item.brandName, count: item.saleNum });
            });
          } else {
            //按照销售额查询
            res.data.saleAmountList.map(item => {
              brandSalesData.push({ item: item.brandName, count: item.saleAmount });
            });
          }
          this.setState({
            brandSalesData,
          });
        }
      },
    });
  };

  //品牌销售占比 销售额、销量的切换
  handleChangeBrandType = (type) => {
    let { brandSalesParams } = this.state;
    brandSalesParams.sort = type.target.value == 'amount' ? 1 : 2;//排序:1-销售额；2-销量 默认不传按销售额降序
    let _this = this;
    this.setState({ brandSalesParams }, () => {
      _this.getBrandSalesPercent();
    });
  };

  render() {
    const { brandInitLoading, brandSalesData, brandSalesParams } = this.state;
    return (
      <div style={{ marginTop: '10px' }} className={`${stat.common_table_item}`}>
        <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
          <div className={`${global.flex_row_start_center}`}>
            {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('品牌销售占比')}`, 10, 0, 0)}
            <div style={{ marginLeft: 10 }}>
              <Radio.Group size={'small'} onChange={(e) => this.handleChangeBrandType(e)} defaultValue="amount">
                <Radio.Button value="amount">{sldComLanguage('销售额')}</Radio.Button>
                <Radio.Button value="sales">{sldComLanguage('销量')}</Radio.Button>
              </Radio.Group>
            </div>
          </div>
          <SldStatDate idIndex={'_brand_sales'}
                       updateSelectDate={(date) => this.updateSelectDate(date, '_brand_sales')}/>
        </div>
        <Spin spinning={brandInitLoading}>
          <div data-json={JSON.stringify(brandSalesData)} className={`${stat.table_main}`}>
            <Pie data={brandSalesData} showNumPrecision={brandSalesParams.sort!=undefined&& brandSalesParams.sort== 2 ?0:2} tipTitle={brandSalesParams.sort!=undefined&& brandSalesParams.sort== 2 ?'品牌销售订单量占比':'品牌销售额占比'}
              axisType={brandSalesParams.sort!=undefined&& brandSalesParams.sort== 2 ?'':'amount'}
            />
          </div>
        </Spin>
      </div>
    );
  }
}
