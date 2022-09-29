/*
* 统计-商品流量排行-TOP10
* @zjf-2021-06-30
* */
import { connect } from 'dva/index';
import moment from 'moment';
import React, { Component } from 'react';
import { Form, Spin, Tooltip } from 'antd';
import { sldLlineRtextAddGoodsAddMargin, sldComLanguage, getSldComImg,noDataPlaceholder } from '@/utils/utils';
import global from '@/global.less';
import stat from '@/assets/css/stat.less';
import StandardTable from '@/components/StandardTable';
import SldStatDate from '@/components/SldStatDate';

@connect(({ common }) => ({
  common,
}))
@Form.create()

export default class GoodsFlowRank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initLoading: false,//页面加载状态
      goodsSalesColumns: [
        {
          'title': '序号', 'dataIndex': 'goodsId', 'align': 'center', 'width': 35,
          render: (text, record, index) => index + 1,
        },
        {
          'title': '商品名称', 'dataIndex': 'goodsName', 'align': 'center', 'width': 100, ellipsis: true,
          render: (text, record) => {
            return <div className={`${global.flex_row_start_center} ${stat.table_td_center_elliplis}`}>{getSldComImg(record.goodsImage, 200, 200, 25, 25)}<span title={text}>{text}</span></div>;
          },
        },
        {
          'title': '浏览量',
          'dataIndex': 'viewNum',
          'align': 'center',
          'width': 100,
          'sorter': true,
          defaultSortOrder: 'descend',
          sortDirections: ['descend'],
        },
        {
          'title': '访客数',
          'dataIndex': 'visitorNum',
          'align': 'center',
          'width': 100,
          'sorter': true,
          sortDirections: ['descend'],
        }],//商品流量排行-TOP10表格列设置
      goodsSalesRankData: { list: [], pagination: {} },//商品流量排行-TOP10表格数据
      goodsSalesRankParams: {
        startTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
        endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
      },
    };
  }

  componentDidMount() {
    this.getGoodsSalesRank();
  }

  //获取商品流量排行TOP10
  getGoodsSalesRank = () => {
    this.setState({ initLoading: true });
    const { dispatch } = this.props;
    let { goodsSalesRankParams, goodsSalesRankData } = this.state;
    dispatch({
      type: 'common/get_goods_flow_rank',
      payload: goodsSalesRankParams,
      callback: (res) => {
        this.setState({ initLoading: false });
        if (res.state == 200) {
          goodsSalesRankData.list = res.data;
          this.setState({
            goodsSalesRankData,
          });
        }
      },
    });
  };

  updateSelectDate = (date, index) => {
    let { goodsSalesRankParams } = this.state;
    goodsSalesRankParams = { ...goodsSalesRankParams, ...date };
    let _this = this;
    this.setState({
      goodsSalesRankParams,
    }, () => {
      _this.getGoodsSalesRank();
    });
  };

  //类型用于区分是哪一部分，自己定义好就可以
  handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
    let { goodsSalesRankParams } = this.state;
    if (sorter.field == undefined) {
      return false;
    } else if (sorter.field == 'viewNum') {
      //浏览量由高到低排序
      goodsSalesRankParams.sort = 1;
    } else if (sorter.field == 'visitorNum') {
      //访客由高到低排序
      goodsSalesRankParams.sort = 2;
    }
    let _this = this;
    this.setState({
      goodsSalesRankParams,
    }, () => {
      _this.getGoodsSalesRank();
    });
  };

  render() {
    const { goodsSalesColumns, goodsSalesRankData, initLoading } = this.state;
    return (
      <div style={{ marginTop: '10px' }} className={`${stat.common_table_item}`}>
        <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
          {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('商品流量排行 - TOP10')}`, 10, 0, 0)}
          <SldStatDate idIndex={'_store_sales'}
                       updateSelectDate={(date) => this.updateSelectDate(date, '_store_sales')}/>
        </div>
        <Spin spinning={initLoading}>
          <div className={`${stat.table_main} ${stat.stat_common_table}`}>
            {(!goodsSalesRankData || !goodsSalesRankData.list || !goodsSalesRankData.list.length)? noDataPlaceholder():<StandardTable
              className={`${stat.goods_sales_rank_table}`}
              rowKey={'goodsId'}
              data={goodsSalesRankData}
              isColumnResize={false}
              columns={goodsSalesColumns}
              sldpagination={false}
              border={false}
              showScrollbar={false}
              onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
            />}
          </div>
        </Spin>
      </div>
    );
  }
}
