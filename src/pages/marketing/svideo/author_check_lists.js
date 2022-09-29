/*
* 作者审核列表*/
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
  failTip,
  sucTip,
  list_com_page_size_10,
  dragSldTableColumn,
  sldHandlePaginationData,
  formItemLayoutModal,
  getTableNum,
  sldComLanguage,
  sldtbaleOpeBtnText,
  getSldComImg,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import SldModal from '@/components/SldModal/SldModal';
import SldPreviewImg from '@/components/SldPreviewImg/SldPreviewImg';

let pageSize = list_com_page_size_10;
@connect(({ svideo }) => ({
  svideo,
}))
@Form.create()
export default class AuthorCheckLists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preview_img: '',
      preview_alt_con: '',
      show_preview_modal: false,
      modalVisible: false,
      initLoading: false,
      submiting: false,
      data: {},//列表数据
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      title: `${sldComLanguage('作者审核')}`,
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      operateData: [],//modal弹框用到的数据
      checkData: [{
        type: 'radio_select',
        label: `${sldComLanguage('审核')}`,
        name: 'isPass',
        placeholder: `${sldComLanguage('请选择')}${sldComLanguage('审核结果')}`,
        data: [{
          key: true,
          value: `${sldComLanguage('通过')}`,
        }, {
          key: false,
          value: `${sldComLanguage('拒绝')}`,
        }],
        initialValue: true,
        callback: this.isCheck,
      }],
      search_data: [{
        type: 'input',
        label: `${sldComLanguage('会员名称')}`,
        name: 'memberName',
        placeholder: `${sldComLanguage('请输入会员名称')}`,
      }, {
        type: 'input',
        label: `${sldComLanguage('作者昵称')}`,
        name: 'memberNickname',
        placeholder: `${sldComLanguage('请输入作者昵称')}`,
      }, {
        type: 'select',
        label: `${sldComLanguage('审核状态')}`,
        name: 'permissionState',
        initialValue: '',
        placeholder: `${sldComLanguage('请选择审核状态')}`,
        sel_data: [
          { key: '', name: `${sldComLanguage('全部')}` },
          { key: '1', name: `${sldComLanguage('待审核')}` },
          { key: '3', name: `${sldComLanguage('审核拒绝')}` },
        ],
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
          title: `${sldComLanguage('会员名称')}`,
          dataIndex: 'memberName',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('头像')}`,
          dataIndex: 'memberAvatar',
          align: 'center',
          width: 100,
          render: (text, record) => {
            return getSldComImg(text, 100, 100, 40, 40);//图片预览
          },
        },
        {
          title: `${sldComLanguage('简介')}`,
          dataIndex: 'introduction',
          align: 'center',
          width: 100,
        }, {
          title: `${sldComLanguage('作者昵称')}`,
          dataIndex: 'memberNickname',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('审核状态')}`,
          align: 'center',
          dataIndex: 'permissionStateValue',
          width: 100,
        },
        {
          title: `${sldComLanguage('审核意见')}`,
          align: 'center',
          dataIndex: 'remark',
          width: 150,
        },
        {
          title: `${sldComLanguage('操作')}`,
          align: 'center',
          width: 80,
          render: (text, record) => (
            <Fragment>
              {record.permissionState == 1 &&
              sldtbaleOpeBtnText(`${sldComLanguage('审核')}`, () => this.checkAuthor(record))//审核
              }
            </Fragment>
          ),
        },
      ],
    };
  }

  cur_data = '';

  remark_data = {
    type: 'textarea',
    label: `${sldComLanguage('审核意见')}`,
    name: 'remark',
    maxLength: 100,
    placeholder: `${sldComLanguage('请输入')}${sldComLanguage('审核意见')}`,
    rules: [{
      required: true,
      message: `${sldComLanguage('请输入')}${sldComLanguage('审核意见')}`,
    }],
  };

  componentDidMount() {
    this.get_list({ pageSize: pageSize });
  }

  //审核通过拒绝联动事件
  isCheck = (e) => {
    let { checkData, operateData } = this.state;
    operateData = JSON.parse(JSON.stringify(checkData));
    if (e.target.value == false) {
      operateData.push({ ...this.remark_data });
    }
    let tmp_data = operateData.filter(item => item.name == 'isPass')[0];
    tmp_data.callback = this.isCheck;
    this.setState({
      operateData,
    });
  };

  checkAuthor = (record) => {
    let { operateData, checkData } = this.state;
    operateData = JSON.parse(JSON.stringify(checkData));
    operateData[0].callback = this.isCheck;
    this.cur_data = record;
    this.setState({
      modalVisible: true,
      operateData,
    });
  };

  //审核操作 val:modal框的数据
  operateAuthor = (val) => {
    this.setState({ submiting: true });
    const { params } = this.state;
    const { dispatch } = this.props;
    let dis_type = '';
    dis_type = 'svideo/check_author';
    val.authorId = this.cur_data.authorId;
    dispatch({
      type: dis_type,
      payload: val,
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
          this.get_list(params);
          this.props.setUpdateFlag('1');
        } else {
          failTip(res.msg);
        }
        this.setState({ submiting: false, modalVisible: false });
      },
    });
  };

  //获取数据列表(获取所有的作者，未审核通过的不在内)
  get_list = (params) => {
    this.setState({ initLoading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'svideo/get_author_lists',
      payload: { ...params, type: 'audit' },
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

  //预览图片/关闭预览图片
  viewImg = (flag, img = '', text = '') => {
    this.setState({
      preview_img: img,
      preview_alt_con: text,
      show_preview_modal: flag,
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
    this.operateAuthor(val);
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
    const { selectedRows, search_data, columns, initLoading, data, modalVisible, operateData, show_preview_modal, preview_img, preview_alt_con, title, submiting } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1,padding:0 }}>
        <div className={global.tableListForm}>
          <Search search_data={search_data}
                  seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}/>
        </div>
        <Spin spinning={initLoading}>
          {/*标准表格-start*/}
          <StandardTable
            totalHeight={document.body.clientHeight-170-20}
            selectedRows={selectedRows}
            data={data}
            rowKey={'authorId'}
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
        />
        {/*查看详情对话框-end*/}
        {/*图片预览-start*/}
        <SldPreviewImg img={preview_img} show_preview_modal={show_preview_modal} modal_width={900}
                       preview_alt_con={preview_alt_con} closePreviewModal={() => this.viewImg(false)}/>
        {/*图片预览-end*/}
      </div>
    );
  }
}
