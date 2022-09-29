import { connect } from 'dva/index';
import Link from 'umi/link';
import React, { Component, Fragment } from 'react';
import { Input, Form, Spin, Switch } from 'antd';
import {
  sldIconBtn,
  failTip,
  sucTip,
  dragSldTableColumn,
  sldHandlePaginationData,
  list_com_page_size_10,
  sldLlineRtextAddGoodsAddMargin,
  formItemLayoutModal,
  sldSvgIcon,
  getTableNum,
  sldComLanguage,
  sldPopConfirmDiy,
  sldtbaleOpeBtnText,
  trimString,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';
import Search from '@/components/Search/Search';

let pageSize = list_com_page_size_10;
@connect(({ product }) => ({
  product,
}))
@Form.create()
export default class TopicDiyPageLists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {},//搜索条件
      search_con: '',//搜索框内容
      submiting: false,//按钮loading
      loading: false,
      data: {},
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      modalVisible: false,
      title: '',
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      curData: {},//编辑的数据
      search_data: [{
        type: 'input',
        label: `${sldComLanguage('页面名称')}`,
        name: 'decoName',
        placeholder: `${sldComLanguage('请输入页面名称')}`,
      }, {
        type: 'select',
        label: `${sldComLanguage('使用状态')}`,//使用状态
        name: 'isEnable',
        placeholder: `${sldComLanguage('请选择')}${sldComLanguage('使用状态')}`,
        sel_data: [
          { key: '', name: `${sldComLanguage('全部')}` },//全部
          { key: '1', name: `${sldComLanguage('启用')}` },//启用
          { key: '0', name: `${sldComLanguage('禁用')}` },//禁用
        ],
      }],//搜索数据
      addData: [{
        type: 'input',
        label: `${sldComLanguage('装修页面名称')}`,//装修页面名称
        name: 'decoName',
        placeholder: `${sldComLanguage('请输入')}${sldComLanguage('装修页面名称')}`,
        initialValue: '',
        maxLength: 8,
        extra: `${sldComLanguage('最多输入8个字')}`,
        rules: [{
          required: true,
          whitespace: true,
          message: `${sldComLanguage('请输入')}${sldComLanguage('装修页面名称')}`,
        }],
      },
      ],//modal框的数据
      columns: [
        {
          title: ' ',
          align: 'center',
          dataIndex: 'decoId',
          width: 50,
          render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
        },
        {
          title: `${sldComLanguage('名称')}`,//名称
          align: 'center',
          dataIndex: 'decoName',
          width: 200,
          render: (text, record) => (
            <Fragment>
              <div className={global.flex_com_space_between}>
                {record.is_edit_name != undefined && record.is_edit_name
                  ?
                  <Input maxLength={20} onChange={(e) => this.edit_filed_con(record.decoId, 'decoName', e.target.value)}
                         defaultValue={text}/>
                  : <span>{text}</span>
                }
                {record.is_edit_name != undefined && record.is_edit_name
                  ? <a className={global.flex_com_column} href={'javascript:void(0)'}
                       style={{ marginLeft: 7 }}
                       onClick={() => this.save_edit_filed(record, 'decoName', text)}>{sldSvgIcon('#FA6F1E', 16, 16, 'xuanzhong')}</a>
                  : <a className={global.flex_com_column} href={'javascript:void(0)'}
                       style={{ marginLeft: 7 }}
                       onClick={() => this.edit_filed(record.decoId, 'is_edit_name', 'true')}>{sldSvgIcon('#FA6F1E', 16, 16, 'edit')}</a>
                }
              </div>
            </Fragment>
          ),
        },
        {
          title: `${sldComLanguage('创建时间')}`,//创建时间
          align: 'center',
          dataIndex: 'createTime',
          width: 150,
        },
        {
          title: `${sldComLanguage('修改时间')}`,//修改时间
          dataIndex: 'updateTime',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('启用状态')}`,//启用状态
          align: 'center',
          dataIndex: 'isEnable',
          width: 100,
          render: (text, record) => {
            return <Switch checked={text == 1 ? true : false}
                           onChange={(val) => this.handleSetEnable(val, record.decoId)}/>;
          },
        },
        {
          title: `${sldComLanguage('操作')}`,//操作
          align: 'center',
          width: 100,
          render: (text, record) => (
            <Fragment>
              <Link to={{ pathname: `/decorate_pc/topic_diy_page_lists_to_edit`, search: `?id=${record.decoId}&type=topic` }}
                    target="_blank">
                {
                  sldtbaleOpeBtnText('装修', null)
                }
              </Link>
              <span className={global.splitLine}></span>
              {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.operateDiyPage(record.decoId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
              <span className={global.splitLine}></span>
              {sldtbaleOpeBtnText(`${sldComLanguage('复制')}`, () => this.operateDiyPage(record.decoId, 'copy'))}
              <span className={global.splitLine}></span>
              {sldtbaleOpeBtnText(`${sldComLanguage('预览')}`, () => this.previewDiyPage(record.pcUrl))}
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
    this.setState({ loading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'pc_home/get_diy_page_list',
      payload: { ...params, decoType: 'topic' },
      callback: (res) => {
        this.setState({ loading: false });
        if (res.state == 200) {
          if (res.data.length == 0 && this.state.params.current > 1) {
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
    const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
    pageSize = params.pageSize;
    this.setState({
      params: params,
    });
    this.get_list(params);
  };

  //保存表格列的内容
  save_edit_filed = (record, filed, value) => {
    let { data } = this.state;
    const { dispatch } = this.props;
    value = trimString(value);//去除字符串左右两端的空格
    if (!value) {
      failTip(`${sldComLanguage('请输入')}${sldComLanguage('装修页面名称')}`);
      return false;
    }
    dispatch({
      type: 'pc_home/edit_diy_page',
      payload: { decoId: record.decoId, decoName: value },
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
          let tmp = data.list.filter(item => item.id == record.id)[0];
          tmp[filed] = value;
          tmp.is_edit_name = false;
          this.setState({ data });
        } else {
          failTip(res.msg);
        }
      },
    });

  };

  //编辑表格列的内容
  edit_filed_con = (id, filed, value) => {
    let { data } = this.state;
    let tmp = data.list.filter(item => item.decoId == id)[0];
    tmp[filed] = value;
    this.setState({ data });
  };

  //编辑表格列内容
  edit_filed = (id, filed, flag) => {
    let { data } = this.state;
    let tmp = data.list.filter(item => item.decoId == id)[0];
    tmp[filed] = flag;
    this.setState({ data });
  };

  //新增数据
  addData = () => {
    let { addData } = this.state;
    for (let i in addData) {
      addData[i].initialValue = '';
    }
    this.setState({
      modalVisible: true,
      type: 'add',
      title: `${sldComLanguage('新增')}${sldComLanguage('装修页面')}`,
      addData: addData,
    });//新增装修页面
  };

  //是否启用
  handleSetEnable = (val, id) => {
    this.operateDiyPage({ decoId: id, isEnable: val }, 'enable');
  };

  //编辑数据
  editData = (val) => {
    let { addData } = this.state;
    addData.map(item => {
      item.initialValue = val[item.name];
    });
    this.setState({
      modalVisible: true,
      type: 'edit',
      title: `${sldComLanguage('编辑')}${sldComLanguage('装修页面')}`,
      addData: addData,
      curData: val,
    });//编辑装修页面
  };

  //预览装修页面
  previewDiyPage = (val) => {
    window.open(val, '_blank');
  }

  //装修页面操作，edit 编辑，del 删除，enable 启用/禁用, copy 复制
  operateDiyPage = (id, type) => {
    const { dispatch } = this.props;
    let dis_type = '';
    let params = { decoId: id };
    if (type == 'edit') {
      dis_type = 'pc_home/edit_diy_page';
      params = id;
    } else if (type == 'del') {
      dis_type = 'pc_home/del_diy_page';
    } else if (type == 'copy') {
      dis_type = 'pc_home/copy_diy_page';
    } else if (type == 'enable') {
      dis_type = 'pc_home/enable_diy_page';
      params = id;
    }
    dispatch({
      type: dis_type,
      payload: params,
      callback: (res) => {
        this.setState({ submiting: false });
        if (res.state == 200) {
          sucTip(res.msg);
          this.get_list(this.state.params);
          this.setState({
            modalVisible: false,
          });
        } else {
          failTip(res.msg);
        }
      },
    });
  };

  sldHandleConfirm = (val) => {
    const { curData, type } = this.state;
    const { dispatch } = this.props;
    this.setState({ submiting: true });
    val.decoType = 'topic';
    val = { ...val, decoName: trimString(val.decoName) };
    if (type == 'edit') {
      val.decoId = curData.decoId;
      this.operateDiyPage(val, 'edit');
    } else {
      dispatch({
        type: 'pc_home/add_diy_page',
        payload: val,
        callback: (res) => {
          this.setState({ submiting: false });
          if (res.state == 200) {
            sucTip(res.msg);
            this.get_list({ pageSize: pageSize });
            this.setState({
              modalVisible: false,
            });
          } else {
            failTip(res.msg);
          }
        },
      });
    }
  };

  sldHandleCancle = () => {
    this.setState({ modalVisible: false });
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
      params: { pageSize: pageSize },
    });
    this.get_list({ pageSize: pageSize, ...values });
  };
  //搜索重置事件
  seaReset = () => {
    //搜索条件置为空
    this.setState({
      formValues: {},
      params: { pageSize: pageSize },
    });
    this.get_list({ pageSize: pageSize });
  };

  //表格拖动
  resizeTable = (index, size, type, data) => {
    let datas = dragSldTableColumn(index, size, data);
    this.setState({ [type]: datas });
  };

  render() {
    const { selectedRows, modalVisible, title, addData, columns, submiting, data, loading, search_data } = this.state;
    return (
      <Spin spinning={loading}>
        <div className={global.common_page}>
          {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('专题装修列表管理')}`, 0, 0, 10)}
          <div className={global.tableListForm}>
            <Search search_data={search_data}
                    seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}/>
          </div>
          {/*公共功能条-start*/}
          <div className={global.operate_bg}>
            {sldIconBtn(() => this.addData(), `${sldComLanguage('新增页面')}`, 7, 7, 15, 15, 4, 'jia', '#FA6F1E')}{/*新增*/}
          </div>
          {/*公共功能条-end*/}
          {/*标准表格-start*/}
          <StandardTable
            totalHeight={document.body.clientHeight - 190 - 15}
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
          {/*标准表格-end*/}
          {/*新增/编辑对话框-start*/}
          <SldModal
            width={600}
            title={title}
            sldSeleSingleRow={true}
            submiting={submiting}
            modalVisible={modalVisible}
            sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
            sldHandleCancle={this.sldHandleCancle}
            formItemLayoutModal={formItemLayoutModal}
            content={addData}
          />
          {/*新增/编辑对话框-end*/}
        </div>
      </Spin>
    );
  }
}
