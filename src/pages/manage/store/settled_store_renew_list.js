/*
* 入驻店铺管理——续签列表
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Switch } from 'antd';
import {
  list_com_page_size_10,
  dragSldTableColumn,
  getTableNum,
  sldComLanguage,
  sldHandlePaginationData,
  sldtbaleOpeBtnText,
  sldPopConfirmDiy,
  failTip,
  sucTip,
  showMoreHelpTip,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';

let pageSize = list_com_page_size_10;
@connect(({ store }) => ({
  store,
}))
@Form.create()
export default class SettledStoreReNewList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search_height:0,
      initLoading: false,
      data: {},//列表数据
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      title: '',
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      search_data: [{
        type: 'input',
        label: `${sldComLanguage('店铺名称')}`,
        name: 'storeName',
        placeholder: `${sldComLanguage('请输入店铺名称')}`,
      },{
        type: 'input',
        label: `${sldComLanguage('店主账号')}`,
        name: 'vendorName',
        placeholder: `${sldComLanguage('请输入店主账号')}`,
      },{
        type: 'input',
        label: `${sldComLanguage('联系人')}`,
        name: 'contactName',
        placeholder: `${sldComLanguage('请输入联系人')}`,
      },{
        type: 'input',
        label: `${sldComLanguage('联系电话')}`,
        name: 'contactPhone',
        placeholder: `${sldComLanguage('请输入联系电话')}`,
      },{
        type: 'select',
        label: `${sldComLanguage('付款状态')}`,
        name: 'state',
        placeholder: `${sldComLanguage('请选择付款状态')}`,
        sel_data: [
          { key: '', name: `${sldComLanguage('全部')}` },
          { key: '1', name: `${sldComLanguage('待付款')}` },
          { key: '2', name: `${sldComLanguage('已付款')}` },
        ],
      } ],
      formValues: {},//搜索条件
      columns: [
        {
          title: ' ',
          align: 'center',
          width: 30,
          render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
        },
        {
          title: `${sldComLanguage('店铺名称')}`,
          dataIndex: 'storeName',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('店主账号')}`,
          dataIndex: 'vendorName',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('联系人')}`,
          dataIndex: 'contactName',
          align: 'center',
          width: 100,
        },{
          title: `${sldComLanguage('联系电话')}`,
          dataIndex: 'contactPhone',
          align: 'center',
          width: 100,
        },{
          title: `${sldComLanguage('续签等级')}`,
          dataIndex: 'gradeName',
          align: 'center',
          width: 100,
        },{
          title: `${sldComLanguage('收费标准(元/年)')}`,
          dataIndex: 'price',
          align: 'center',
          width: 150,
        },{
          title: `${sldComLanguage('续签时长(年)')}`,
          dataIndex: 'duration',
          align: 'center',
          width: 150,
        },{
          title: `${sldComLanguage('应付金额(元)')}`,
          dataIndex: 'payAmount',
          align: 'center',
          width: 120,
        },{
          title: `${sldComLanguage('续签起止有效期')}`,
          dataIndex: 'startTime',
          align: 'center',
          width: 150,
          render: function(text, record) {
            return <div className={global.voucher_time_wrap}>
              <p>{text}</p>
              <p>~</p>
              <p>{record.endTime}</p>
            </div>;
          },
        },{
          title: `${sldComLanguage('付款状态')}`,
          dataIndex: 'stateValue',
          align: 'center',
          width: 100,
        },{
          title: `${sldComLanguage('付款方式')}`,
          dataIndex: 'paymentName',
          align: 'center',
          width: 100,
          render: function(text) {
            return text?text:'--';
          },
        },
        {
          title: `${sldComLanguage('操作')}`,//操作
          align: 'center',
          width: 100,
          render: (text, record) => (
            <Fragment>
              {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.operate(record.renewId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
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
    this.resize();
  }

  resize = () =>{
    const {search_height} = this.state;
    if(this.refs.search_part!=undefined){
      if(this.refs.search_part.clientHeight != search_height){
        this.setState({search_height:this.refs.search_part.clientHeight})
      }
    }
  }

  //获取数据列表
  get_list = (params) => {
    this.setState({ initLoading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'store/get_store_renew_list',
      payload: { ...params},
      callback: (res) => {
        this.setState({ initLoading: false });
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

  //操作  del：删除
  operate = (id, type) => {
    this.setState({ initLoading: true });
    const { params } = this.state;
    const { dispatch } = this.props;
    let dis_type = '';
    let param_data = {};
    if (type == 'del') {
      dis_type = 'store/del_store_renew';
      param_data.renewId = id;
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
        this.setState({ initLoading: false });
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
    for(let i in values){
      if(values[i] == ''){
        delete values[i]
      }
    }
    this.setState({
      formValues: values,
      params: { pageSize: pageSize }
    });
    this.get_list({ pageSize: pageSize, ...values });
  };
  //搜索重置事件
  seaReset = () => {
    //搜索条件置为空
    this.setState({
      formValues: {},
      params: { pageSize: pageSize }
    });
    this.get_list({ pageSize: pageSize });
  };

  //搜索模块点击展开/收起
  moreSearchToggle = () => {
    const {search_height} = this.state;
    if(this.refs.search_part!=undefined){
      if(this.refs.search_part.clientHeight != search_height){
        this.setState({search_height:this.refs.search_part.clientHeight})
      }
    }
  }

  render() {
    const { selectedRows, search_data, columns, initLoading, data,search_height} = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1,paddingTop:0 }}>
        {showMoreHelpTip('',[`${sldComLanguage('店铺等级发生变化时，续签的店铺等级会在新的签约有效期内生效')}`],10)}
        <div className={global.tableListForm} ref={'search_part'}>
          <Search search_data={search_data} moreSearchToggle={() => this.moreSearchToggle()}
                  seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}/>
        </div>
        <Spin spinning={initLoading}>
          {/*标准表格-start*/}
          <StandardTable
            totalHeight={document.body.clientHeight - 130 - search_height - 20 - 52}
            bordered={false}
            selectedRows={selectedRows}
            data={data}
            rowKey={'renewId'}
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
      </div>

    );
  }
}
