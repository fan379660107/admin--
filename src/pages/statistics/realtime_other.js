import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form } from 'antd';
import {
  getSldComImg,
  sldLlineRtextAddGoodsAddMargin,
  sldComLanguage,
  noDataPlaceholder,
} from '@/utils/utils';
import global from '@/global.less';
import stat from '@/assets/css/stat.less';
import StandardTable from '@/components/StandardTable';
import LineArea from '@/components/SldStatBizcharts/LineArea';

@connect(({ statistics, global }) => ({
  statistics, global,
}))
@Form.create()

export default class RealtimeOther extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderSubmitAmountData: [],//分时支付/下单金额趋势
      newMemberNumData: [],//分时会员/店铺新增趋势
      viewNumData: [],//分时流量趋势
      detailData: props.detailData,//页面数据
      goodsSalesColumns: [
        {
          'title': `${sldComLanguage('序号')}`, 'dataIndex': 'goodsId', 'align': 'center', 'width': 35,
          render: (text, record, index) => index + 1,
        },
        {
          'title': `${sldComLanguage('商品名称')}`, 'dataIndex': 'goodsName', 'align': 'center', 'width': 100,
          render: (text, record) => {

            return <div
              className={`${global.flex_row_start_center} ${stat.table_td_center_elliplis}`}>{getSldComImg(record.goodsImage, 200, 200, 25, 25)}<span
              title={text}>{text}</span></div>;
          },
        },
        {
          'title': `${sldComLanguage('销售额')}`,
          'dataIndex': 'saleAmount',
          'align': 'center',
          'width': 100,
          'sorter': true,
          defaultSortOrder: 'descend',
          sortDirections: ['descend'],
          render: (text) => {
            return `¥${text.toFixed(2)}`;
          },
        },
        {
          'title': `${sldComLanguage('销量')}`,
          'dataIndex': 'saleNum',
          'align': 'center',
          'width': 100,
          'sorter': true,
          sortDirections: ['descend'],
        }],//实时商品销售排行-TOP10表格列设置
      goodsSalesRankData: { list: [], pagination: {} },//实时商品销售排行-TOP10表格数据
      storeSalesColumns: [
        {
          'title': `${sldComLanguage('序号')}`, 'dataIndex': 'storeId', 'align': 'center', 'width': 35,
          render: (text, record, index) => index + 1,
        },
        {
          'title': `${sldComLanguage('店铺名称')}`, 'dataIndex': 'storeName', 'align': 'center', 'width': 100,
          render: (text) => {
            return <span style={{ color: '#FF701E', fontSize: '14px' }}>{text}</span>;
          },
        },
        {
          'title': `${sldComLanguage('销售额')}`,
          'dataIndex': 'orderPayAmount',
          'align': 'center',
          'width': 100,
          'sorter': true,
          defaultSortOrder: 'descend',
          sortDirections: ['descend'],
          render: (text) => {
            return `¥${text.toFixed(2)}`;
          },
        },
        {
          'title': `${sldComLanguage('订单量')}`,
          'dataIndex': 'orderSubmitNum',
          'align': 'center',
          'width': 100,
          'sorter': true,
          sortDirections: ['descend'],
        }],//实时店铺销售排行-TOP10表格列设置
      StoreSalesRankData: { list: [], pagination: {} },//实时店铺销售排行-TOP10表格数据
      categoryColumns: [
        {
          'title': `${sldComLanguage('序号')}`, 'dataIndex': 'categoryId', 'align': 'center', 'width': 35,
          render: (text, record, index) => index + 1,
        },
        {
          'title': `${sldComLanguage('一级品类')}`, 'dataIndex': 'categoryName', 'align': 'center', 'width': 100,
        },
        {
          'title': `${sldComLanguage('销售额')}`,
          'dataIndex': 'saleAmount',
          'align': 'center',
          'width': 100,
          'sorter': true,
          defaultSortOrder: 'descend',
          sortDirections: ['descend'],
          render: (text) => {
            return `¥${text.toFixed(2)}`;
          },
        },
        {
          'title': `${sldComLanguage('销量')}`,
          'dataIndex': 'saleNum',
          'align': 'center',
          'width': 100,
          'sorter': true,
          sortDirections: ['descend'],
        }],//实时品类销售排行-TOP10表格列设置
      categoryData: { list: [], pagination: {} },//品类销售排行-TOP10表格数据
    };
  }

  componentDidMount() {
    this.initData();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let _this = this;
    if (JSON.stringify(nextProps.detailData) != JSON.stringify(this.props.detailData)) {
      this.setState({ detailData: nextProps.detailData }, () => {
        _this.initData();
      });
    }
  }

  //获取页面数据
  initData = (type = '') => {
    let { goodsSalesRankData, StoreSalesRankData, categoryData, detailData } = this.state;
    let params = {};
    let orderSubmitAmountData = [];//分时支付/下单金额趋势
    let newMemberNumData = [];//分时会员/店铺新增趋势
    let viewNumData = [];//分时流量趋势
    if (type) {
      params.refresh = type;
    }
    goodsSalesRankData.list = detailData.goodsSaleAmountList;
    StoreSalesRankData.list = detailData.storeSaleAmountList;
    categoryData.list = detailData.categorySaleAmountList;
    //分时支付/下单金额趋势
    for (let i in detailData.orderPayAmountList) {
      orderSubmitAmountData.push({
        month: detailData.orderPayAmountList[i].hour,//横轴
        city: `${sldComLanguage('支付金额')}`,
        temperature: detailData.orderPayAmountList[i].amount,//纵轴
      });
      orderSubmitAmountData.push({
        month: detailData.orderSubmitAmountList[i].hour,//横轴
        city: `${sldComLanguage('下单金额')}`,
        temperature: detailData.orderSubmitAmountList[i].amount,//纵轴
      });
    }

    //分时会员/店铺新增趋势
    for (let i in detailData.newMemberNumList) {
      newMemberNumData.push({
        month: detailData.newMemberNumList[i].hour,//横轴
        city: `${sldComLanguage('新增会员数')}`,
        temperature: detailData.newMemberNumList[i].num,//纵轴
      });
      newMemberNumData.push({
        month: detailData.newStoreNumList[i].hour,//横轴
        city: `${sldComLanguage('新增店铺数')}`,
        temperature: detailData.newStoreNumList[i].num,//纵轴
      });
    }

    //分时流量趋势
    for (let i in detailData.viewNumList) {
      viewNumData.push({
        month: detailData.viewNumList[i].hour,//横轴
        city: `${sldComLanguage('浏览量')}`,
        temperature: detailData.viewNumList[i].num,//纵轴
      });
      viewNumData.push({
        month: detailData.visitorNumList[i].hour,//横轴
        city: `${sldComLanguage('访客')}`,
        temperature: detailData.visitorNumList[i].num,//纵轴
      });
    }

    this.setState({
      goodsSalesRankData,
      StoreSalesRankData,
      categoryData,
      detailData,
      orderSubmitAmountData,
      newMemberNumData,
      viewNumData,
    });
  };

  //类型用于区分是哪一部分，自己定义好就可以
  handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
    let { detailData, goodsSalesRankData, StoreSalesRankData, categoryData } = this.state;
    if (sorter.field == undefined) {
      return false;
    }
    if (type == 'goods') {
      goodsSalesRankData.list = sorter.field == 'saleAmount' ? detailData.goodsSaleAmountList : detailData.goodsSaleNumList;
    } else if (type == 'store') {
      StoreSalesRankData.list = sorter.field == 'orderPayAmount' ? detailData.storeSaleAmountList : detailData.storeOrderNumList;
    } else if (type == 'category') {
      categoryData.list = sorter.field == 'saleAmount' ? detailData.categorySaleAmountList : detailData.categorySaleNumList;
    }
    this.setState({
      goodsSalesRankData,
      StoreSalesRankData,
      categoryData,
    });
  };

  render() {
    const { categoryData, categoryColumns, goodsSalesColumns, goodsSalesRankData, StoreSalesRankData, storeSalesColumns, newMemberNumData, orderSubmitAmountData, viewNumData } = this.state;
    return (
      <div style={{ flexWrap: 'wrap', backgroundColor: '#f0f2f5' }}
           className={`${global.flex_row_between_start}`}>
        <div style={{ marginTop: '10px' }} className={`${stat.common_table_item}`}>
          <div className={`${stat.label_panel}`}>
            {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('实时商品销售排行 - TOP10')}`, 10, 0, 0)}
          </div>
          <div className={`${stat.table_main} ${stat.stat_common_table}`}>
            {(goodsSalesRankData.list==undefined||(goodsSalesRankData.list!=undefined&&goodsSalesRankData.list.length == 0)) ? noDataPlaceholder() : <StandardTable
              className={`${stat.goods_sales_rank_table}`}
              rowKey={'goodsId'}
              data={goodsSalesRankData}
              isColumnResize={false}
              columns={goodsSalesColumns}
              sldpagination={false}
              border={false}
              showScrollbar={false}
              onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'goods')}
            />}
          </div>
        </div>
        <div style={{ marginTop: '10px' }} className={`${stat.common_table_item}`}>
          <div className={`${stat.label_panel}`}>
            {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('实时店铺销售排行 - TOP10')}`, 10, 0, 0)}
          </div>
          <div className={`${stat.table_main} ${stat.stat_common_table}`}>
            {(StoreSalesRankData.list==undefined||(StoreSalesRankData.list!=undefined&&StoreSalesRankData.list.length == 0)) ? noDataPlaceholder() : <StandardTable
              rowKey={'storeId'}
              data={StoreSalesRankData}
              isColumnResize={false}
              columns={storeSalesColumns}
              sldpagination={false}
              border={false}
              showScrollbar={false}
              onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'store')}
            />}

          </div>
        </div>
        <div style={{ marginTop: 10 }} className={`${stat.common_table_item}`}>
          <div className={`${stat.label_panel}`}>
            {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('实时品类销售排行 - TOP10')}`, 10, 0, 0)}
          </div>
          <div className={`${stat.table_main_overflow_hidden}  ${stat.stat_common_table}`}>
            {(categoryData.list==undefined||(categoryData.list!=undefined&&categoryData.list.length == 0)) ? noDataPlaceholder() : <StandardTable
              rowKey={'categoryId'}
              data={categoryData}
              isColumnResize={false}
              columns={categoryColumns}
              sldpagination={false}
              border={false}
              showScrollbar={false}
              onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'category')}
            />}
          </div>
        </div>
        <div style={{ marginTop: 10 }} className={`${stat.common_table_item}`}>
          <div className={`${stat.label_panel}`}>
            {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('分时支付/下单金额趋势')}`, 10, 0, 0)}
          </div>
          <div className={`${stat.table_main_overflow_hidden}`}>
            <LineArea data={orderSubmitAmountData} unit={'¥'}/>
          </div>
        </div>

        <div style={{ margin: '10px 0' }} className={`${stat.common_table_item}`}>
          <div className={`${stat.label_panel}`}>
            {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('分时会员/店铺新增趋势')}`, 10, 0, 0)}
          </div>
          <div className={`${stat.table_main} ${stat.table_main_overflow_hidden}`}>
            <LineArea data={newMemberNumData}/>
          </div>
        </div>

        <div style={{ margin: '10px 0' }} className={`${stat.common_table_item}`}>
          <div className={`${stat.label_panel}`}>
            {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('分时流量趋势')}`, 10, 0, 0)}
          </div>
          <div className={`${stat.table_main} ${stat.table_main_overflow_hidden}`}>
            <LineArea data={viewNumData}/>
          </div>
        </div>
      </div>
    );
  }
}
