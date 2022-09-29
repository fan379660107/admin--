import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react'
import { Form, Popover, Spin } from 'antd';
import {
  sldIconBtn,
  failTip,
  sucTip,
  dragSldTableColumn,
  sldHandlePaginationData,
  list_com_page_size_10,
  sldLlineRtextAddGoodsAddMargin,
  formItemLayoutModal,
  sldComLanguage,
  sldPopConfirmDiy,
  sldtbaleOpeBtnText,
  sldSearchValClear,
} from '@/utils/utils';
import Link from 'umi/link';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';
import QRCode from 'qrcode.react';

let comm_cur_page = 1;//当前页数
let pageSize = list_com_page_size_10;
@connect(({ article }) => ({
  article,
}))
@Form.create()
export default class TopicLists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      submiting: false,//按钮loading
      loading: false,//按钮loading
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      modalVisible: false,
      title: '',
      search_con: '',
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      curData: {},//编辑的数据
      addData: [{
        type: 'input',
        label: `${sldComLanguage('页面名称')}`,//页面名称
        name: 'name',
        placeholder: `${sldComLanguage('请输入页面名称')}`,//请输入页面名称
        initialValue: '',
        maxLength: 8,
        extra: `${sldComLanguage('最多输入8个字')}`,
        rules: [{
          required: true,
          whitespace: true,
          message: `${sldComLanguage('请输入页面名称')}`,//请输入页面名称
        }],
      }],//modal框的数据
      columns: [
        {
          title: ' ',
          dataIndex: 'decoId',
          align: 'center',
          width: 55,
          render: (text, record, index) => {
            return (comm_cur_page - 1) * pageSize + index + 1;
          },
        },
        {
          title: `${sldComLanguage('页面名称')}`,//页面名称
          align: 'center',
          dataIndex: 'name',
          width: 100,
        },
        {
          title: `${sldComLanguage('创建时间')}`,//创建时间
          dataIndex: 'createTime',
          align: 'center',
          width: 150,
        }, {
          title: `${sldComLanguage('更新时间')}`,//更新时间
          dataIndex: 'updateTime',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('操作')}`,//操作
          align: 'center',
          width: 100,
          render: (text, record) => (
            <Fragment>
              <Link to={{
                pathname: '/decorate_m/topic_lists_to_diy',
                query: {
                  id: record.decoId,
                  type: 'topic',
                  source: '/decorate_m/topic_lists',
                },
              }}>
                {sldtbaleOpeBtnText(`${sldComLanguage('装修')}`, () => null)}{/*装修*/}
              </Link>
              <span className={global.splitLine}></span>
              {sldtbaleOpeBtnText(sldComLanguage('编辑'), () => this.editMDiyPage(record))}{/*编辑*/}
              <span className={global.splitLine}></span>
              {sldtbaleOpeBtnText(`${sldComLanguage('复制')}`, () => this.operateMDiyPage(record.decoId, 'copy'))}{/*复制*/}
              <span className={global.splitLine}></span>
              {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.operateMDiyPage(record.decoId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))//删除后不可恢复，是否确定删除？
              }
            </Fragment>
          ),
        },
      ],
    };
  }


  componentDidMount() {
    this.get_list({ pageSize: pageSize });
  }

  componentWillUnmount() {

  }

  //获取数据列表
  get_list = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mdecorate/get_diy_page_lists',
      payload: { ...params, type: 'topic' },
      callback: (res) => {
        this.setState({ loading: false });
        if (res.state == 200) {
          if (res.data.list.length == 0 && this.state.params.current > 1) {
            params.current = params.current - 1;
            this.get_list(params);
          } else {
            this.setState({
              data: res.data,
              isReset: false,
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

  //装修页面操作，edit 编辑，del 删除，enable 启用/禁用  copy 复制
  operateMDiyPage = (id, type) => {
    const { dispatch } = this.props;
    let dis_type = '';
    let params = { decoId: id };
    if (type == 'edit') {
      dis_type = 'mdecorate/edit_m_diy_page';
      params = id;
    } else if (type == 'del') {
      dis_type = 'mdecorate/del_m_diy_page';
    } else if (type == 'copy') {
      dis_type = 'mdecorate/copy_m_diy_page';
    } else if (type == 'enable') {
      dis_type = 'mdecorate/set_m_diy_page';
      params = id;
    }
    dispatch({
      type: dis_type,
      payload: params,
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
          this.get_list(this.state.params);
          this.setState({
            modalVisible: false,
          });
        } else {
          failTip(res.msg);
        }
        this.setState({ submiting: false });
      },
    });
  };

  sldHandleConfirm = (val) => {
    this.setState({ submiting: true });
    const { curData, type } = this.state;
    const { dispatch } = this.props;
    val.type = 'topic';
    if (type == 'edit') {
      val.decoId = curData.decoId;
      this.operateMDiyPage(val, 'edit');
    } else {
      val.data = '';
      dispatch({
        type: 'mdecorate/add_m_diy_page',
        payload: val,
        callback: (res) => {
          if (res.state == 200) {
            sucTip(res.msg);
            this.get_list({ pageSize: pageSize });
            this.setState({
              modalVisible: false,
              params: { pageSize: pageSize },
            });
          } else {
            failTip(res.msg);
          }
          this.setState({ submiting: false });
        },
      });
    }
  };

  sldHandleCancle = () => {
    this.setState({ modalVisible: false });
  };

  //表格拖动
  resizeTable = (index, size, type, data) => {
    let datas = dragSldTableColumn(index, size, data);
    this.setState({ [type]: datas });
  };

  //新增功能
  addMDiyPage = () => {
    let { addData } = this.state;
    for (let i in addData) {
      addData[i].initialValue = '';
    }
    this.setState({
      modalVisible: true,
      type: 'add',
      title: `${sldComLanguage('添加专题装修')}`,
      addData: addData,
    });//添加专题装修
  };
  //编辑功能
  editMDiyPage = (record) => {
    let { addData } = this.state;
    for (let i in addData) {
      addData[i].initialValue = record[addData[i].name];
    }
    this.setState({
      modalVisible: true,
      type: 'edit',
      title: `${sldComLanguage('编辑专题装修')}`,
      addData: addData,
      curData: record,
    });//添加专题装修
  };

  //搜索
  sldSearch = (val) => {
    this.setState({
      formValues: { name: val },
      params: { pageSize: pageSize }
    });
    this.get_list({ pageSize: pageSize, name: val });
  };

  //搜索框内容的变化
  sldSearChange = (val) => {
    this.setState({
      search_con: val.target.value,
    });
  };

  //清空搜索内容
  sldSearClear = () => {
    this.setState({
      search_con: '',
    });
    this.sldSearch('');
  };

  render() {
    const { selectedRows, modalVisible, title, addData, columns, submiting, data, loading, search_con } = this.state;
    return (
      <div className={global.common_page}>
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('专题装修')}`, 0, 0, 10)}{/*专题装修*/}
        <Spin spinning={loading}>
          { /*公共功能条-start*/}
          <div className={global.operate_bg}>
            {sldIconBtn(() => this.addMDiyPage(), `${sldComLanguage('新建页面')}`, 7, 7)}{/*新增*/}
            {sldSearchValClear(`${sldComLanguage('请输入页面名称')}`, 291, this.sldSearch, `${sldComLanguage('搜索')}`, search_con, this.sldSearChange, this.sldSearClear, 65)}
          </div>
          { /*公共功能条-end*/}
          { /*标准表格-start*/}
          <StandardTable
            totalHeight={document.body.clientHeight - 150 - 15}
            selectedRows={selectedRows}
            data={data}
            rowKey={'decoId'}
            isCheck={false}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
            resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
            isColumnResize={true}
          />
          { /*标准表格-end*/}
          { /*新增/编辑对话框-start*/}
          <SldModal
            title={title}
            submiting={submiting}
            modalVisible={modalVisible}
            sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
            sldHandleCancle={this.sldHandleCancle}
            formItemLayoutModal={formItemLayoutModal}
            content={addData}
          />
          { /*新增/编辑对话框-end*/}
        </Spin>
      </div>
    );
  }
}
