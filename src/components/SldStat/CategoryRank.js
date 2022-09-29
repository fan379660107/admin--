/*
* 统计里通用的品类销售排行TOP10
* @zjf-2021-06-30
* */
import { connect } from 'dva/index';
import moment from 'moment';
import React, { Component } from 'react';
import { Form, Spin } from 'antd';
import { sldLlineRtextAddGoodsAddMargin, sldComLanguage, noDataPlaceholder } from '@/utils/utils';
import global from '@/global.less';
import stat from '@/assets/css/stat.less';
import StandardTable from '@/components/StandardTable';
import SldStatDate from '@/components/SldStatDate';

@connect(({ common }) => ({
  common,
}))
@Form.create()


export default class CategoryRank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initLoading: false,//页面加载状态
      categoryColumns: [
        {
          'title': '序号', 'dataIndex': 'categoryId', 'align': 'center', 'width': 35,
          render: (text, record, index) => index + 1,
        },
        {
          'title': '一级品类', 'dataIndex': 'categoryName', 'align': 'center', 'width': 100,
          render: (text) => {
            return <span className={`${stat.defaultText}`} title={text}>{text}</span>;
          },
        },
        {
          'title': '销售额', 'dataIndex': 'saleAmount', 'align': 'center', 'width': 100, 'sorter': true,
          defaultSortOrder: 'descend',
          sortDirections: ['descend'],
          render: (text) => {
            return `¥${text.toFixed(2)}`;
          },
        },
        {
          'title': '销量',
          'dataIndex': 'saleNum',
          'align': 'center',
          'width': 100,
          'sorter': true,
          sortDirections: ['descend'],
        }],//品类销售排行-TOP10表格列设置
      categoryData: { list: [], pagination: {} },//品类销售排行-TOP10表格数据
      categoryParams: {
        startTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
        endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
      },
    };
  }

  componentDidMount() {
    this.getCategoryRank();
  }

  //获取品类销售排行TOP10
  getCategoryRank = () => {
    this.setState({ initLoading: true });
    const { dispatch } = this.props;
    let { categoryParams, categoryData } = this.state;
    dispatch({
      type: 'common/get_category_rank',
      payload: categoryParams,
      callback: (res) => {
        this.setState({ initLoading: false });
        if (res.state == 200) {
          categoryData.list = res.data;
          this.setState({
            categoryData,
          });
        }
      },
    });
  };

  updateSelectDate = (date, index) => {
    let { categoryParams } = this.state;
    categoryParams = { ...categoryParams, ...date };
    let _this = this;
    this.setState({
      categoryParams,
    }, () => {
      _this.getCategoryRank();
    });
  };

  //类型用于区分是哪一部分，自己定义好就可以
  handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
    let { categoryParams } = this.state;
    if (sorter.field == undefined) {
      return false;
    } else if (sorter.field == 'saleAmount') {
      //销售额由高到低排序
      categoryParams.sort = 1;
    } else if (sorter.field == 'saleNum') {
      //销量由高到低排序
      categoryParams.sort = 2;
    }
    let _this = this;
    this.setState({
      categoryParams,
    }, () => {
      _this.getCategoryRank();
    });
  };

  render() {
    const { categoryColumns, categoryData, initLoading } = this.state;
    return (
      <div style={{ marginTop: '10px' }} className={`${stat.common_table_item}`}>
        <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
          {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('品类销售排行 - TOP10')}`, 10, 0, 0)}
          <SldStatDate idIndex={'_store_sales'}
                       updateSelectDate={(date) => this.updateSelectDate(date, '_store_sales')}/>
        </div>
        <Spin spinning={initLoading}>
          <div className={`${stat.table_main} ${stat.stat_common_table}`}>
            {(!categoryData || !categoryData.list || !categoryData.list.length)? noDataPlaceholder():<StandardTable
              rowKey={'categoryId'}
              data={categoryData}
              isColumnResize={false}
              columns={categoryColumns}
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
