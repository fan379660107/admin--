/*
* 推荐主题绑定的作品列表*/
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
  sldLlineRtextAddGoods,
  failTip,
  sucTip,
  list_com_page_size_10,
  dragSldTableColumn,
  sldHandlePaginationData,
  sldIconBtnBg,
  formItemLayoutModal,
  getTableNum,
  sldComLanguage,
  sldtbaleOpeBtnText,
  getSldComImg,
  getSldCopyData,
  sldPopConfirmDiy,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import SldModal from '@/components/SldModal/SldModal';

let pageSize = list_com_page_size_10;
@connect(({ svideo }) => ({
  svideo,
}))
@Form.create()
export default class ViewThemeVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: props.location.query,
      modalVisible: false,
      initLoading: false,
      submiting: false,
      show_foot: true,
      data: {},//列表数据
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      title: `${sldComLanguage('禁止发布')}`,
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      operateData: [],//modal弹框用到的数据
      previewData: [{
        type: 'view_video',
        label: ``,//
        name: 'view_video',
        initialValue: '',
        width: 600,
        height: 400,
      }],//预览作品
      search_data: [{
        type: 'input',
        label: `${sldComLanguage('作品名称')}`,
        name: 'videoName',
        placeholder: `${sldComLanguage('请输入作品名称')}`,
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
          title: `${sldComLanguage('封面')}`,//封面
          dataIndex: 'videoImage',
          align: 'center',
          width: 100,
          render: (text, record) => {
            return getSldComImg(text, 200, 200, 60, 60);//图片预览
          },
        },
        {
          title: `${sldComLanguage('作品名称')}`,
          dataIndex: 'videoName',
          align: 'center',
          width: 100,
        }, {
          title: `${sldComLanguage('作品简介')}`,
          dataIndex: 'introduction',
          align: 'center',
          width: 150,
        },{
          title: `${sldComLanguage('作品类型')}`,
          dataIndex: 'videoTypeValue',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('操作')}`,
          align: 'center',
          width: 80,
          render: (text, record) => (
            <Fragment>
              {
                sldtbaleOpeBtnText(`${sldComLanguage('预览')}`, () => this.preview(record))
              }
              <span className={global.splitLine}></span>
              {/*只有禁止显示的可以删除*/}
              {
                sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除？')}`, () => this.operateVideo(record.themeVideoId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`, sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))
              }
            </Fragment>
          ),
        },
      ],
    };
  }

  cur_data = '';

  componentDidMount() {
    this.get_list({ pageSize: pageSize });
  }

  preview = (record) => {
    let { operateData, previewData } = this.state;
    operateData = JSON.parse(JSON.stringify(previewData));
    let temp = operateData.filter(item=>item.name == 'view_video')[0];
    if (record.videoType == 2) {
      //图文
      temp.type = 'view_img_text';
      temp.content = record.imageList;
      temp.text = record.videoContent;
    } else {
      //视频
      temp.initialValue = record.videoPath;
    }
    this.setState({
      modalVisible: true,
      operateData,
      show_foot: false,
      title: `${sldComLanguage('预览')}`,
    });
  };

  //作品操作  id: 作品id ，type ：show 解除禁止 del删除
  operateVideo = (id, type) => {
    this.setState({ submiting: true });
    const { params } = this.state;
    const { dispatch } = this.props;
    let dis_type = '';
    let param_data = {};
    dis_type = '';
    if (type == 'del') {
      dis_type = 'svideo/del_theme_video';
      param_data.themeVideoId = id;
    }
    dispatch({
      type: dis_type,
      payload: param_data,
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
          this.get_list(params);
        } else {
          failTip(res.msg);
        }
        this.setState({ submiting: false, modalVisible: false });
      },
    });
  };

  //获取数据列表(获取所有的作品，未审核通过的不在内)
  get_list = (params) => {
    this.setState({ initLoading: true });
    const { dispatch } = this.props;
    let { query } = this.state;
    dispatch({
      type: 'svideo/get_theme_bind_video',
      payload: { ...params, themeId: query.id },
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

  sldHandleCancle = () => {
    this.setState({ modalVisible: false });
  };

  sldHandleConfirm = (val) => {
    this.operateVideo(val, 'forbidden');
  };

  //搜索事件
  search = (data) => {
    const values = { ...data };
    for (let i in values) {
      if (values[i] == '') {
        delete values[i];
      }
    }
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

  //更新列表数据
  handleSubmit = () => {
    const { params } = this.state;
    this.get_list(params);
    this.sldHandleCancle();
  };

  render() {
    const { selectedRows, search_data, columns, initLoading, data, modalVisible, operateData, title, submiting, show_foot } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1 }}>
        <div className={global.flex_com_space_between} style={{ marginBottom: 8 }}>
          {sldLlineRtextAddGoods('#FA6F1E', `${sldComLanguage('推荐主题作品列表')}`)}
          {sldIconBtnBg(() => this.props.history.goBack(), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0)}
        </div>
        <div className={global.tableListForm}>
          <Search search_data={search_data}
                  seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}/>
        </div>
        <Spin spinning={initLoading}>
          {/*标准表格-start*/}
          <StandardTable
            totalHeight={document.body.clientHeight-140-20}
            selectedRows={selectedRows}
            data={data}
            rowKey={'themeVideoId'}
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
        <SldModal
          submiting={submiting}
          title={title}
          width={600}
          modalVisible={modalVisible}
          formItemLayoutModal={formItemLayoutModal}
          content={operateData}
          sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
          sldHandleCancle={this.sldHandleCancle}
          show_foot={show_foot}
        />
        {/*查看详情对话框-end*/}
      </div>

    );
  }
}
