import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin,Switch } from 'antd';
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
  sldLlineRtextAddGoodsAddMargin,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';

let pageSize = list_com_page_size_10;
@connect(({ svideo }) => ({
  svideo,
}))
@Form.create()
export default class LabelLists extends Component {
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
        label: `${sldComLanguage('标签名称')}`,
        name: 'labelName',
        extra: `${sldComLanguage('最多输入6个字')}`,
        placeholder: `${sldComLanguage('请输入标签名称')}`,
        initialValue: '',
        maxLength:6,
        rules: [{
          required: true,
          whitespace: true,
          message: `${sldComLanguage('请输入标签名称')}`,
        }],
      },{
        type: 'inputnum',
        label: `${sldComLanguage('排序')}`,
        name: 'sort',
        placeholder: `${sldComLanguage('请输入')}${sldComLanguage('排序')}`,//请输入排序
        extra: `${sldComLanguage('请输入0~255的数字')}`,
        initialValue: '',
        rules: [{
          required: true,
          message: `${sldComLanguage('请输入')}${sldComLanguage('排序')}`,//请输入排序
        }, { validator: (rule, value, callback) => validatorNumbe(rule, value, callback) }],
      }
      ],//modal框的数据
      formValues: {},//搜索条件
      columns: [
        {
          title: ' ',
          dataIndex: 'labelId',
          align: 'center',
          width: 55,
          render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
        },
        {
          title: `${sldComLanguage('标签名称')}`,
          dataIndex: 'labelName',
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
          title: `${sldComLanguage('显示状态')}`,
          dataIndex: 'isShow',
          align: 'center',
          width: 80,
          render: (text, record) => (
            <Switch
              onChange={(checked) => this.operateLabel({labelId:record.labelId,isShow:checked?1:0},'switch')}
              checked={text == 1 ? true : false}
              valuepropname={'checked'}/>
          ),
        },
        {
          title: `${sldComLanguage('操作')}`,//操作
          align: 'center',
          width: 100,
          render: (text, record) => (
            <Fragment>
              {sldtbaleOpeBtnText(`${sldComLanguage('编辑')}`, () => this.editLabel(record))}{/*编辑*/}
              <span className={global.splitLine}></span>
              {/*删除后不可恢复，是否确定删除？*/}
              {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.operateLabel(record.labelId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
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

  //编辑标签
  editLabel = (val) => {
    let { addData } = this.state;
    for (let i in addData) {
      addData[i].initialValue = val[addData[i].name];
    }
    this.cur_edit_id = val.labelId;//当前操作数据id
    this.setState({
      type: 'edit',
      title: `${sldComLanguage('编辑短视频标签')}`,
      addData: addData,
      modalVisible: true,
    });//编辑标签
  };

  //标签操作  del：删除 edit: 编辑
  operateLabel = (id, type) => {
    this.setState({ submiting: true });
    const { params } = this.state;
    const { dispatch } = this.props;
    let dis_type = '';
    let param_data = {};
    if (type == 'del') {
      dis_type = 'svideo/del_label';
      param_data = { labelId: id };
    } else if (type == 'edit') {
      dis_type = 'svideo/edit_label';
      param_data = id;
    } else if (type == 'switch') {
      dis_type = 'svideo/switch_label';
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

  //添加标签
  addLabel = () => {
    let { addData } = this.state;
    for (let i in addData) {
      addData[i].initialValue = '';
    }
    this.setState({
      modalVisible: true,
      type: 'add',
      title: `${sldComLanguage('新增短视频标签')}`,
      addData: addData,
    });//添加标签
  };

  //获取数据列表
  get_list = (params) => {
    this.setState({ initLoading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'svideo/get_label_lists',
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
      val.labelId = this.cur_edit_id;
      this.operateLabel(val, 'edit');
    } else {
      dispatch({
        type: 'svideo/add_label',
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
      formValues: { labelName: val },
      params: { pageSize: pageSize }
    });
    this.get_list({ pageSize: pageSize, labelName: val });
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
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('标签管理')}`, 0, 0, 10)}
        <div className={global.operate_bg}>
          {sldIconBtn(() => this.addLabel(), `${sldComLanguage('新增标签')}`, 7, 7)}{/*新增标签*/}
          {/*请输入标签    搜索*/}
          {sldSearchValClear(`${sldComLanguage('请输入标签名称')}`, 291, this.sldSearch, `${sldComLanguage('搜索')}`, search_con, this.sldSearChange, this.sldSearClear, 65)}
        </div>
        <Spin spinning={initLoading}>
          {/*标准表格-start*/}
          <StandardTable
            totalHeight={document.body.clientHeight-140-20}
            selectedRows={selectedRows}
            data={data}
            rowKey={'labelId'}
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
