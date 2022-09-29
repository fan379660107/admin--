//商品品类报表模块-按品类统计
import moment from 'moment';
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Tooltip } from 'antd';
import {
  sldComLanguage,
  list_com_page_size_10,
  sldHandlePaginationDataStat,
  dragSldTableColumn,
  getTableNum,sldSvgIcon
} from '@/utils/utils';
import global from '@/global.less';
import stat from '@/assets/css/stat.less';
import StandardTable from '@/components/StandardTable';
import SldStatDate from '@/components/SldStatDate';
import Search from '@/components/Search/Search';

let pageSize = list_com_page_size_10;
@connect(({ statistics }) => ({
  statistics,
}))
@Form.create()

export default class StatisticsReportGoodsCategoryByCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      data: {},//列表数据
      params: {
        startTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
        endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
        pageSize: pageSize,
      },
      search_data: [{
        type: 'input',
        label: `${sldComLanguage('一级分类名称')}`,
        name: 'categoryName',
        placeholder: `${sldComLanguage('请输入')}${sldComLanguage('一级分类名称')}`,
      },
      ],
      columns: [
        {
          title: '序号',
          dataIndex: 'categoryId',
          align: 'center',
          width: 55,
          render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
        },
        {
          title: `${sldComLanguage('一级分类名称')}`,
          dataIndex: 'categoryName',
          align: 'center',
          width: 120,
          render: (text) => {
            let temp = text.split(',');
            return <span title={text}>{temp[temp.length-1]}</span>;
          },
        },
        {
          title: `${sldComLanguage('下单数')}`,
          dataIndex: 'orderSubmitNum',
          align: 'center',
          sorter: true,
          width: 100,
        },
        {
          title: `${sldComLanguage('下单金额')}`,
          dataIndex: 'orderSubmitAmount',
          align: 'center',
          sorter: true,
          width: 100,
          defaultSortOrder: 'descend',
          render: (text) => {
            return `¥${text.toFixed(2)}`;
          },
        },
        {
          title: `${sldComLanguage('支付订单数')}`,
          dataIndex: 'orderPayNum',
          align: 'center',
          sorter: true,
          width: 100,
        },
        {
          title: `${sldComLanguage('销售额')}`,
          dataIndex: 'saleAmount',
          align: 'center',
          sorter: true,
          width: 100,
          render: (text) => {
            return `¥${text.toFixed(2)}`;
          },
        },
        {
          title: `${sldComLanguage('销售额占比')}`,
          dataIndex: 'saleAmountPercent',
          align: 'center',
          sorter: true,
          width: 100,
        },
        {
          title: <div style={{ position: 'relative' }}>
            <span style={{ marginRight: 17 }}>{sldComLanguage('销冠商品')}</span>
            <Tooltip placement="bottomLeft" title={`${sldComLanguage('所选时间段内销售额最高的商品')}`}>
              <div style={{ right: 0, top: 2, position: 'absolute' }}>{sldSvgIcon('#bfbbba', 14, 14, 'wen')}</div>
            </Tooltip>
          </div>,
          dataIndex: 'goodsName',
          align: 'center',
          width: 150,
          render: (text) => {
            return <span title={text}>{text}</span>;
          },
        },
        {
          title: `${sldComLanguage('退单数')}`,
          dataIndex: 'returnNum',
          align: 'center',
          sorter: true,
          width: 100,
        },
        {
          title: `${sldComLanguage('退单金额')}`,
          dataIndex: 'returnAmount',
          align: 'center',
          sorter: true,
          width: 100,
          render: (text) => {
            return `¥${text.toFixed(2)}`;
          },
        },
      ],
    };
  };

  componentDidMount() {
    this.get_list(this.state.params);
  }

  //获取数据列表
  get_list = (params) => {
    this.setState({ initLoading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'statistics/get_goods_category_report_by_category_lists',
      payload: params,
      callback: (res) => {
        this.setState({ initLoading: false });
        if (res.state == 200) {
          this.setState({
            data: res.data,
          });
        }
      },
    });
  };

  handleSelectRows = (rows, rowkeys) => {
    this.setState({
      selectedRows: rows,
      selectedRowKeys: rowkeys,
    });
  };

  handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
    let { formValues, params } = this.state;
    if (type == 'main') {
      const temp = sldHandlePaginationDataStat(pagination, filtersArg, sorter, formValues, 1, pageSize);
      pageSize = params.pageSize;
      params = { ...params, ...temp };
      if (params.sort && params.sort == 'saleAmountPercent') {
        //销售额占比
        params.sort = 'saleAmount';
      }
      this.setState({ params });
      this.get_list(params);
    }
  };

//表格拖动
  resizeTable = (index, size, type, data) => {
    let datas = dragSldTableColumn(index, size, data);
    this.setState({ [type]: datas });
  };

  //时间筛选器返回的时间数据
  updateSelectDate = (date, index) => {
    let { params } = this.state;
    params = { ...params, ...date, current:1 };
    this.get_list(params);
    this.props.updateExportParam(params);
    this.setState({ params });
  };

  //搜索事件
  search = (data) => {
    const values = { ...data };
    this.setState({
      formValues: values,
    });
    let cur_params = { ...this.state.params, ...values, current: 1 };
    this.props.updateExportParam(cur_params);
    this.get_list(cur_params);
  };
  //搜索重置事件
  seaReset = () => {
    let { params } = this.state;
    delete params.categoryName;
    delete params.current;
    //搜索条件置为空
    this.setState({
      formValues: {},
      data: {},
      params: params,
    });
    this.get_list(params);
  };

  render() {
    const { search_data, columns, selectedRows, data, initLoading } = this.state;
    return (
      <div className={`${stat.stat_common_table}`}>
        <div className={`${global.flex_row_between_center}`} style={{ margin: '10px 0' }}>
          <SldStatDate idIndex={'_report_goods_category_by_category'}
                       updateSelectDate={(date) => this.updateSelectDate(date, '_report_goods_category_by_category')}/>
        </div>
        <div className={global.tableListForm} ref={'search_part'} style={{ marginRight: 10 }}>
          <Search search_data={search_data}
                  seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}
          />
        </div>
        <Spin spinning={initLoading}>
        {/*标准表格-start*/}
        <StandardTable
          selectedRows={selectedRows}
          data={data}
          rowKey={'categoryId'}
          isCheck={false}
          columns={columns}
          onSelectRow={this.handleSelectRows}
          onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
          onSldHandleSeleRow={this.onSldHandleSeleRow}
          resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
          isColumnResize={false}
          border={false}
          showScrollbar={false}
          scroll={{ x: 1200 }}
        />
        {/*标准表格-end*/}
        </Spin>
      </div>
    );
  }
}
