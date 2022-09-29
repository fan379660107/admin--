/*
* 经营类目审核
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
  failTip,
  sucTip,
  list_com_page_size_10,
  dragSldTableColumn,
  getTableNum,
  sldComLanguage,
  dateFormat,
  sldHandlePaginationData,
  sldtbaleOpeBtnText,
  sldIconBtn,
  formItemLayoutModal,
  sldPopConfirmDiy,
  sldPopConfirm,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import SldModal from '@/components/SldModal/SldModal';

let pageSize = list_com_page_size_10;
@connect(({ store }) => ({
  store,
}))
@Form.create()
export default class ApplyCategoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search_height:0,
      operateData:[],
      modal_width: 700,//查看规格、下架商品的modal框宽度
      down_reason_list: [],//获取审核拒绝理由
      modalVisibleDetail: false,
      initLoading: false,
      submiting: false,
      show_foot: false,
      modalVisible: false,//是否显示规格弹框
      data: {},//列表数据
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      title: `${sldComLanguage('商品规格')}`,
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      addData:[{
        type: 'textarea',
        label: `${sldComLanguage('备注')}`,
        name: 'refuseReason',
        placeholder: `${sldComLanguage('请输入审核拒绝理由')}`,
        extra: `${sldComLanguage('最多输入100字')}`,
        maxLength: 100,
        rules: [{
          required: true,
          message: `${sldComLanguage('请输入审核拒绝理由')}`,
        }],
      }],//下架数据
      search_data: [{
        type: 'input',
        label: `${sldComLanguage('店铺名称')}`,//店铺名称
        name: 'storeName',
        placeholder: `${sldComLanguage('店铺名称')}`,//请输入店铺名称
      }, {
        type: 'select',
        label: `${sldComLanguage('审核状态')}`,
        name: 'state',
        placeholder: `${sldComLanguage('请选择审核状态')}`,
        sel_data: [
          { key: '', name: `${sldComLanguage('全部')}` },
          { key: '1', name: `${sldComLanguage('待审核')}` },
          { key: '2', name: `${sldComLanguage('审核通过')}` },
          { key: '3', name: `${sldComLanguage('审核失败')}` },
        ],
      }],
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
          title: `${sldComLanguage('申请类目')}`,
          dataIndex: 'goodsCateName',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('分佣比例')}`,
          dataIndex: 'scaling',
          align: 'center',
          width: 100,
        },{
          title: `${sldComLanguage('审核状态')}`,
          dataIndex: 'stateValue',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('拒绝理由')}`,//拒绝理由
          dataIndex: 'refuseReason',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('操作')}`,//操作
          align: 'center',
          width: 100,
          render: (text, record) => {
            return record.state == 1?<Fragment>
              {sldPopConfirmDiy('leftBottom', `${sldComLanguage('确认审核通过该条申请吗？')}`, () => this.operate({bindIds:record.bindId,isPass:true}), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                sldtbaleOpeBtnText('审核通过', () => null))}
              <span className={global.splitLine}></span>
              {sldtbaleOpeBtnText('审核拒绝', () => this.refuse(record.bindId))}
            </Fragment>:'--'
          },
        },
      ],
    };
  }

  operate_ids = '';//当前操作的商品id串
  reason_list = [];

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

  //操作  refuse:审核拒绝 pass:审核通过
  operate = (id) => {
    const { params } = this.state;
    const { dispatch } = this.props;
    let param_data = {};
    let dis_type = 'store/check_applied_category';
    param_data = id;
    this.setState({submiting:true})
    dispatch({
      type: dis_type,
      payload: param_data,
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
          this.get_list(params);
          this.setState({
            modalVisible:false,
            selectedRows: [],
            selectedRowKeys: [],
          })
          this.props.setUpdateFlag('1');
        } else {
          failTip(res.msg);
        }
        this.setState({submiting:false})
      },
    });
  };

  //获取数据列表
  get_list = (params) => {
    this.setState({ initLoading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'store/get_applied_category_lists',
      payload: { ...params},
      callback: (res) => {
        this.setState({ initLoading: false });
        if (res.state == 200) {
          res.data.list.map(item=>{
            if(item.state != 1){
              item.disabled = true;
            }
          });
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
    //时间处理
    if (values.search_create_time) {
      values.startTime = values.search_create_time[0] ? values.search_create_time[0].format(dateFormat)+' 00:00:00' : '';
      values.endTime = values.search_create_time[1] ? values.search_create_time[1].format(dateFormat)+ ' 23:59:59' : '';
      delete values.search_create_time
    }
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

  sldHandleCancle = () => {
    this.setState({ modalVisible: false });
  };

  refuse = (ids) => {
    let {addData,operateData} = this.state;
    operateData = JSON.parse(JSON.stringify(addData));
    this.operate_ids = ids;
    this.setState({
      operateData,
      modal_width:500,
      title:`${sldComLanguage('审核拒绝理由')}`,
      modalVisible:true,
      show_foot:true,
    })
  }

  sldHandleConfirm = (val) => {
    val.isPass = false;
    val.bindIds = this.operate_ids;
    this.operate(val)
  };

  render() {
    const { selectedRows, selectedRowKeys, search_data, columns, initLoading, data, modalVisible,title,modal_width,operateData,show_foot,submiting,search_height } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1,paddingTop:0 }}>
        <div className={global.tableListForm} ref={'search_part'}>
          <Search search_data={search_data}
                  seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}/>
        </div>
        {/*公共功能条-start*/}
        <div className={global.operate_bg}
             style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {selectedRowKeys.length == 0 ? sldIconBtn(() => {
              failTip(`${sldComLanguage('请先选中数据')}`);//请先选中数据
              //确认审核通过选中的商品吗？
            }, `${sldComLanguage('审核通过')}`, 7, 0, 19, 19, 3, 'shenhetongguo', '#0fb39a') : sldPopConfirm('leftBottom', `${sldComLanguage('确认审核通过选中的商品吗？')}`, () => this.operate({bindIds:selectedRowKeys.join(','),isPass:true}), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`, sldIconBtn(null, `${sldComLanguage('审核通过')}`, 7, 0, 19, 19, 3, 'shenhetongguo', '#0fb39a'), 0, 0, '#0fb39a')}

            {selectedRowKeys.length == 0 ? sldIconBtn(() => {
              failTip(`${sldComLanguage('请先选中数据')}`);//请先选中数据
              //确认审核拒绝选中的商品吗？
            }, `${sldComLanguage('审核拒绝')}`, 7, 0, 15, 15, 3, 'shenhejujue', '#fa0920') : sldIconBtn(() => this.refuse(selectedRowKeys.join(',')), `${sldComLanguage('审核拒绝')}`, 7, 0, 15, 15, 3, 'shenhejujue', '#fa0920')}
          </div>
        </div>
        {/*公共功能条-end*/}
        <Spin spinning={initLoading}>
          {/*标准表格-start*/}
          <StandardTable
            totalHeight={document.body.clientHeight - 130-search_height-20-50}
            bordered={false}
            selectedRows={selectedRows}
            data={data}
            rowKey={'bindId'}
            isCheck={true}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
            onSldHandleSeleRow={this.onSldHandleSeleRow}
            resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
            isColumnResize={true}
          />
          {/*标准表格-end*/}
        </Spin>

        { /*新增/编辑对话框-start*/}
        <SldModal
          width={modal_width}
          title={title}
          submiting={submiting}
          modalVisible={modalVisible}
          sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
          sldHandleCancle={this.sldHandleCancle}
          formItemLayoutModal={formItemLayoutModal}
          content={operateData}
          show_foot={show_foot}
        />
        { /*新增/编辑对话框-end*/}
      </div>

    );
  }
}
