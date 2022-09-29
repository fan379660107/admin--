import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Switch, Tooltip } from 'antd';
import {
  sldIconBtn,
  failTip,
  sucTip,
  validatorNumbe,
  sldSearchValClear,
  list_com_page_size_10,
  dragSldTableColumn,
  sldHandlePaginationData,
  formItemLayoutModal,
  getTableNum,
  sldComLanguage,
  sldtbaleOpeBtnText,
  sldPopConfirmDiy,
  validatorSpecialString,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';
import Link from 'umi/link';

let pageSize = list_com_page_size_10;
@connect(({ rank }) => ({
  rank,
}))
@Form.create()
export default class RankLabelLists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search_con: '',
      initLoading: false,
      submiting: false,
      data: {},//列表数据
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      title: '',
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      addData: [{
        type: 'input',
        label: `${sldComLanguage('分类名称')}`,
        name: 'categoryName',
        extra: `${sldComLanguage('最多输入5个字')}`,
        placeholder: `${sldComLanguage('请输入分类名称')}`,
        initialValue: '',
        maxLength: 5,
        rules: [{
          required: true,
          whitespace: true,
          message: `${sldComLanguage('请输入分类名称')}`,
        }, { validator: (rule, value, callback) => validatorSpecialString(rule, value, callback) }],
      }, {
        type: 'inputnum',
        label: `${sldComLanguage('排序')}`,
        name: 'sort',
        placeholder: `${sldComLanguage('请输入')}${sldComLanguage('排序')}`,
        extra: `${sldComLanguage('请输入0~255的数字,值越小显示越靠前')}`,
        initialValue: '',
        min: 0,
        max: 255,
        rules: [{
          required: true,
          message: `${sldComLanguage('请输入')}${sldComLanguage('排序')}`,
        }, { validator: (rule, value, callback) => validatorNumbe(rule, value, callback) }],
      },
      ],//modal框的数据
      formValues: {},//搜索条件
      columns: [
        {
          title: ' ',
          dataIndex: 'categoryId',
          align: 'center',
          width: 55,
          render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
        },
        {
          title: `${sldComLanguage('分类名称')}`,
          dataIndex: 'categoryName',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('排序')}`,
          dataIndex: 'sort',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('关联榜单数量')}`,
          dataIndex: 'rankNum',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('启用状态')}`,
          dataIndex: 'state',
          align: 'center',
          width: 80,
          render: (text, record) => (
            <Switch
              onChange={(checked) => this.operateLabel({
                categoryId: record.categoryId,
                isEnable: checked ? 1 : 0,
              }, 'switch')}
              checked={text == 1 ? true : false}
              valuepropname={'checked'}/>
          ),
        },
        {
          title: `${sldComLanguage('操作')}`,
          align: 'center',
          width: 100,
          render: (text, record) => (
            <Fragment>
              <Link to={{
                pathname: '/marketing_promotion/rank_to_bind',
                query: {
                  id: record.categoryId,
                },
              }}>
                {sldtbaleOpeBtnText(`${sldComLanguage('查看榜单')}`, () => null)}
              </Link>
              {record.state == 0 &&
              <Fragment>
                <span className={global.splitLine}></span>
                {sldtbaleOpeBtnText('编辑', () => this.editLabel(record))}
                <span className={global.splitLine}></span>
                {record.rankNum > 0
                  ? <Tooltip placement="top" title={'当前分类已经关联了榜单，暂不可删除。'}>
                    <span style={{ cursor: 'not-allowed' }}>删除</span>
                  </Tooltip>
                  : sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后数据不可恢复，是否删除')}？`, () => this.operateLabel(record.categoryId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                    sldtbaleOpeBtnText('删除', () => null))
                }
              </Fragment>
              }
            </Fragment>
          ),
        },
      ],
    };
  }

  cur_edit_id = '';//当前操作数据id
  componentDidMount() {
    this.get_list({ pageSize: pageSize });
  }

  //编辑分类
  editLabel = (val) => {
    let { addData } = this.state;
    for (let i in addData) {
      addData[i].initialValue = val[addData[i].name];
    }
    this.cur_edit_id = val.categoryId;//当前操作数据id
    this.setState({
      type: 'edit',
      title: `${sldComLanguage('编辑分类')}`,
      addData: addData,
      modalVisible: true,
    });
  };

  //分类操作  del：删除 edit: 编辑
  operateLabel = (id, type) => {
    this.setState({ submiting: true });
    const { params } = this.state;
    const { dispatch } = this.props;
    let dis_type = '';
    let param_data = {};
    if (type == 'del') {
      dis_type = 'rank/del_label';
      param_data = { categoryId: id };
    } else if (type == 'edit') {
      dis_type = 'rank/edit_label';
      param_data = id;
    } else if (type == 'switch') {
      dis_type = 'rank/switch_label';
      param_data = id;
    }
    dispatch({
      type: dis_type,
      payload: param_data,
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
          this.setState({
            modalVisible: false,
          });
          this.get_list(params);
        } else {
          failTip(res.msg);
        }
        this.setState({ submiting: false });
      },
    });
  };

  //新建分类
  addLabel = () => {
    let { addData } = this.state;
    for (let i in addData) {
      addData[i].initialValue = '';
    }
    this.setState({
      modalVisible: true,
      type: 'add',
      title: `${sldComLanguage('新建分类')}`,
      addData: addData,
    });
  };

  //获取数据列表
  get_list = (params) => {
    this.setState({ initLoading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'rank/get_label_lists',
      payload: params,
      callback: (res) => {
        this.setState({ initLoading: false });
        if (res.state == 200) {
          if (res.data.list.length == 0 && this.state.params.current > 1) {
            params.current = params.current - 1;
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
    const { type } = this.state;
    const { dispatch } = this.props;
    this.setState({ submiting: true });
    if (type == 'edit') {
      val.categoryId = this.cur_edit_id;
      this.operateLabel(val, 'edit');
    } else {
      dispatch({
        type: 'rank/add_label',
        payload: val,
        callback: (res) => {
          if (res.state == 200) {
            sucTip(res.msg);
            this.get_list({ pageSize: pageSize });
            this.setState({
              modalVisible: false,
            });
          } else {
            failTip(res.msg);
          }
          this.setState({ submiting: false });
        },
      });
    }
  };

  //搜索
  sldSearch = (val) => {
    this.setState({
      formValues: { categoryName: val },
      params: { pageSize: pageSize },
    });
    this.get_list({ pageSize: pageSize, categoryName: val });
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
    const { selectedRows, columns, initLoading, data, submiting, addData, modalVisible, title, search_con } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1 }}>
        <div className={global.operate_bg}>
          {sldIconBtn(() => this.addLabel(), `${sldComLanguage('新建分类')}`, 7, 7)}
          {sldSearchValClear(`${sldComLanguage('请输入分类名称')}`, 291, this.sldSearch, `${sldComLanguage('搜索')}`, search_con, this.sldSearChange, this.sldSearClear, 65)}
        </div>
        <Spin spinning={initLoading}>
          {/*标准表格-start*/}
          <StandardTable
            totalHeight={document.body.clientHeight - 200 - 15}
            selectedRows={selectedRows}
            data={data}
            rowKey={'categoryId'}
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
        {/*新增/编辑对话框-start*/}
        <SldModal
          title={title}
          submiting={submiting}
          width={500}
          modalVisible={modalVisible}
          sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
          sldHandleCancle={this.sldHandleCancle}
          formItemLayoutModal={formItemLayoutModal}
          content={addData}
        />
        {/*新增/编辑对话框-end*/}
      </div>
    );
  }
}
