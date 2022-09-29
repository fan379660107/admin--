/*
* 视频绑定的商品列表*/
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
  list_com_page_size_10,
  dragSldTableColumn,
  sldHandlePaginationData,
  getTableNum,
  sldComLanguage,
  getSldComImg,
  sldLlineRtextAddGoods,
  sldIconBtnBg,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import SldPreviewImg from '@/components/SldPreviewImg/SldPreviewImg';

let pageSize = list_com_page_size_10;
@connect(({ svideo }) => ({
  svideo,
}))
@Form.create()
export default class AuthorLists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preview_img: '',
      preview_alt_con: '',
      show_preview_modal: false,
      query: props.location.query,
      initLoading: false,
      data: {},//列表数据
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      params: { pageSize: pageSize },//搜索条件
      search_data: [{
        type: 'input',
        label: `${sldComLanguage('商品名称')}`,//商品名称
        name: 'goodsName',
        placeholder: `${sldComLanguage('请输入商品名称')}`,//请输入商品名称
      }],
      formValues: {},//搜索条件
      columns: [
        {
          title: ' ',
          align: 'center',
          width: 55,
          render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
        },
        {
          title: `${sldComLanguage('商品名称')}`,//商品名称
          dataIndex: 'goodsName',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('商品图片')}`,//商品图片
          dataIndex: 'goodsImage',
          align: 'center',
          width: 100,
          render: (text, record) => {
            return getSldComImg(text, 200, 200, 60, 60);//图片预览
          },
        },
        {
          title: `${sldComLanguage('店铺名称')}`,//店铺名称
          dataIndex: 'storeName',
          align: 'center',
          width: 100,
        }, {
          title: `${sldComLanguage('商品价格')}`,//商品价格
          dataIndex: 'goodsPrice',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('商品库存')}`,//商品库存
          align: 'center',
          dataIndex: 'goodsStock',
          width: 100,
        },
      ],
    };
  }

  cur_data = '';

  componentDidMount() {
    this.get_list({ pageSize: pageSize });
  }

  //获取数据列表
  get_list = (params) => {
    this.setState({ initLoading: true });
    const { dispatch } = this.props;
    const { query } = this.state;
    dispatch({
      type: 'svideo/get_video_goods',
      payload: { ...params, videoId: query.id, videoType: 1 },
      callback: (res) => {
        this.setState({ initLoading: false });
        if (res.state == 200) {
          if (res.data.length == 0 && this.state.params.currentPage > 1) {
            params.currentPage = params.currentPage - 1;
            this.get_list(params);
          } else {
            this.setState({
              data: res.data,
            });
          }
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
    const { formValues } = this.state;
    if (type == 'main') {
      const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
      pageSize = params.pageSize;
      this.setState({ params });
      this.get_list(params);
    }
  };

  //表格拖动
  resizeTable = (index, size, type, data) => {
    let datas = dragSldTableColumn(index, size, data);
    this.setState({ [type]: datas });
  };

  //搜索事件
  search = (data) => {
    const values = { ...data };
    this.setState({
      formValues: values,
    });
    this.get_list({ pageSize: pageSize, ...values });
  };
  //搜索重置事件
  seaReset = () => {
    //搜索条件置为空
    this.setState({
      formValues: {},
    });
    this.get_list({ pageSize: pageSize });
  };

  //预览图片/关闭预览图片
  viewImg = (flag, img = '', text = '') => {
    this.setState({
      preview_img: img,
      preview_alt_con: text,
      show_preview_modal: flag,
    });
  };


  render() {
    const { selectedRows, search_data, columns, initLoading, data, show_preview_modal, preview_img, preview_alt_con, expandData, query } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1 }}>
        <div className={global.flex_com_space_between} style={{ marginBottom: 8 }}>
          {sldLlineRtextAddGoods('#FA6F1E', `${sldComLanguage('查看')}` + query.videoName + `${sldComLanguage('绑定的商品')}`)}
          {sldIconBtnBg(() => this.props.history.goBack(), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0)}
        </div>
        <div className={global.tableListForm}>
          <Search search_data={search_data}
                  seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}/>
        </div>
        <Spin spinning={initLoading}>
          {/*标准表格-start*/}
          <StandardTable
            expandData={expandData}
            selectedRows={selectedRows}
            data={data}
            rowKey={'goodsId'}
            isCheck={false}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
            onSldHandleSeleRow={this.onSldHandleSeleRow}
            resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
            isColumnResize={true}
          />
          {/*标准表格-end*/}

        </Spin>
        {/*查看详情对话框-start*/}

        {/*图片预览-start*/}
        <SldPreviewImg img={preview_img} show_preview_modal={show_preview_modal} modal_width={900}
                       preview_alt_con={preview_alt_con} closePreviewModal={() => this.viewImg(false)}/>
        {/*图片预览-end*/}
      </div>

    );
  }
}
