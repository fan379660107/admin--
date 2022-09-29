import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin} from 'antd';
import {
  dragSldTableColumn,
  sldHandlePaginationData,
  list_com_page_size_10,
  sldComLanguage,
  dateFormat,
  getTableNum,
  getSldListGoodsImg80,
  sldtbaleOpeBtnText,
  failTip,
  sucTip,
  sldIconBtn,
  formItemLayoutModal,
} from '@/utils/utils';
import global from '@/global.less';
import order from './order.less';
import Search from '@/components/Search/Search';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';
import SldPreviewImg from '@/components/SldPreviewImg/SldPreviewImg';

let pageSize = list_com_page_size_10;
let comm_cur_page = 1;//当前页数
let sthis = '';
@connect(({ order }) => ({
  order,
}))
@Form.create()
export default class AftersalesCheckLists extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      search_height:0,
      loading: false,
      submiting: false,
      modalVisible: false,
      show_foot:false,
      data: {},
      operateData: [],
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      title: '',
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      curData: {},//编辑的数据
      search_data: [{
        type: 'input',
        label: `${sldComLanguage('订单号')}`,//订单号
        name: 'orderSn',
        placeholder: `${sldComLanguage('请输入')}${sldComLanguage('订单号')}`,//请输入订单号
      }, {
        type: 'input',
        label: `退款编号`,//退款编号
        name: 'afsSn',
        placeholder: `${sldComLanguage('请输入退款编号')}`,//请输入退款编号
      }, {
        type: 'input',
        label: `会员名`,//会员名
        name: 'memberName',
        placeholder: `${sldComLanguage('请输入会员名')}`,//请输入会员名
      }, {
        type: 'input',
        label: `店铺名称`,//店铺名称
        name: 'storeName',
        placeholder: `${sldComLanguage('请输入店铺名称')}`,//请输入店铺名称
      }, {
        type: 'rangepicker',
        label: `${sldComLanguage('申请时间')}`,
        name: 'search_create_time',
        placeholder1: `${sldComLanguage('开始时间')}`,//开始时间
        placeholder2: `${sldComLanguage('结束时间')}`,//结束时间
      },

      ],
      formValues: {},//搜索条件
      detailData: [{
        type: 'show_content',
        name: 'afsSn',
        label: `${sldComLanguage('退款编号')}`,//退款编号
        content: '',
      }, {
        type: 'show_content',
        name: 'orderSn',
        label: `${sldComLanguage('订单号')}`,//订单号
        content: '',
      }, {
        type: 'show_content',
        name: 'stateValue',
        label: `${sldComLanguage('退款状态')}`,//退款状态
        content: '',
      }, {
        type: 'show_content',
        name: 'goodsName',
        label: `${sldComLanguage('申请商品')}`,//申请商品
        content: '',
      }, {
        type: 'show_content',
        name: 'returnTypeValue',
        label: `${sldComLanguage('退款方式')}`,//退款方式
        content: '',
      }, {
        type: 'show_content',
        name: 'returnMoneyAmount',
        label: `${sldComLanguage('退款金额(元)')}`,
        content: '',
      }, {
        type: 'show_content',
        name: 'returnNum',
        label: `${sldComLanguage('退款数量')}`,//退款数量
        content: '',
      }, {
        type: 'show_content',
        name: 'memberName',
        label: `${sldComLanguage('会员名')}`,//会员名
        content: '',
      }, {
        type: 'show_content',
        name: 'applyReasonContent',
        label: `${sldComLanguage('退款原因')}`,//退款原因
        content: '',
      }, {
        type: 'show_img_more',
        name: 'applyImageList',
        label: `${sldComLanguage('退款凭证')}`,//退款凭证
        content: '',
        width: 75,
        height: 75,
        preView: this.viewImg,
      }, {
        type: 'show_content_map',
        name: 'returnLogList',
        label: `${sldComLanguage('退款明细')}`,//退款明细
        content: '',
        data: [],
      }],//查看详情的数据
      confirmData:[{
        type: 'textarea',
        label: `${sldComLanguage('备注信息')}`,//备注信息
        name: 'remark',
        placeholder: `${sldComLanguage('请输入备注信息,最多100个字')}`,//请输入备注信息,最多100个字
        initialValue: '',
        maxLength:100,
      },],//确认数据
      columns: [{
        title: '',
        dataIndex: 'afsSn',
        align: 'center',
        width: 55,
        render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
      }, {
        title: `${sldComLanguage('商品信息')}`,//商品信息
        dataIndex: 'productImage',
        align: 'center',
        width: 200,
        render: (text, record) => {
          return <div className={`${order.goods_info} ${global.com_flex_row_flex_start}`}>
            <div className={order.goods_img}>{getSldListGoodsImg80(text)}</div>
            <div className={`${global.com_flex_column_space_between} ${order.goods_detail}`}>
                <span className={order.goods_name}>
                  {record.goodsName}
                </span>
              <span className={order.goods_brief}>
                  {sldComLanguage('订单编号')}：{record.orderSn}
                </span>
              <span className={order.goods_brief}>
                  {sldComLanguage('退款编号')}：{record.afsSn}
                </span>
            </div>
          </div>;
        },
      }, {
        title: `${sldComLanguage('退款金额(元)')}`,
        dataIndex: 'returnMoneyAmount',
        align: 'center',
        width: 100,
      }, {
        title: `${sldComLanguage('店铺名称')}`,
        dataIndex: 'storeName',
        align: 'center',
        width: 100,
      }, {
        title: `${sldComLanguage('会员名')}`,
        dataIndex: 'memberName',
        align: 'center',
        width: 100,
      }, {
        title: `${sldComLanguage('审核状态')}`,
        dataIndex: 'stateValue',
        align: 'center',
        width: 100,
      }, {
        title: `${sldComLanguage('申请时间')}`,
        dataIndex: 'applyTime',
        align: 'center',
        width: 100,
      }, {
        title: `${sldComLanguage('操作')}`,//操作
        align: 'center',
        width: 100,
        render: (text, record) => {
          return <Fragment>
            {sldtbaleOpeBtnText(`${sldComLanguage('查看')}`, () => this.get_detail(record))}
            {record.state !=300&&
            <Fragment>
              <span className={global.splitLine}></span>
              {sldtbaleOpeBtnText(`${sldComLanguage('确认')}`, () => this.system_confirm(record.afsSn))}
            </Fragment>
            }
          </Fragment>
        },
      }],
    };
  }

  cur_afs_sn = '';

  componentDidMount() {
    this.get_list({ pageSize: pageSize });
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
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
    this.setState({ loading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'order/get_refund_list',
      payload: { ...params, state:203, type:'audit' },
      callback: (res) => {
        this.setState({ loading: false });
        if (res.state == 200) {
          if (params.current > 1 && res.data.list.length == 0 && this.state.params.current > 1) {
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

  //获取售后单详情
  get_detail = (val) => {
    this.setState({ loading: true });
    let { detailData,title,operateData } = this.state;
    const { dispatch } = this.props;
    operateData = JSON.parse(JSON.stringify(detailData));
    for(let i in operateData){
      if(operateData[i].name == 'applyImageList'){
        operateData[i].preView = this.viewImg;
        break;
      }
    }
    dispatch({
      type: 'order/get_refund_detail',
      payload: { afsSn: val.afsSn },
      callback: (res) => {
        this.setState({ loading: false });
        if (res.state == 200) {
          for (let i in operateData) {
              if(operateData[i].name != 'show_subtitle'){
                if(operateData[i].name == 'applyReasonContent'){
                  operateData[i].content = res.data[detailData[i].name]+(res.data.afsDescription?(','+res.data.afsDescription):'');
                }else{
                  operateData[i].content = res.data[operateData[i].name];
                }
              }
          }
          if(res.data.returnType == 1){
            title = `${sldComLanguage('退款详情')}`;
          }else{
            title = `${sldComLanguage('退款退货详情')}`;
          }
          this.setState({ operateData,modalVisible:true,title,show_foot:false });
        } else {
          failTip(res.msg);
        }
      },
    });
  };

  handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
    if (type == 'main') {
      const { formValues } = this.state;
      const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
      comm_cur_page = pagination.current;
      pageSize = params.pageSize;
      this.setState({
        params: params,
      });
      this.get_list(params);
    }
  };

  //预览图片/关闭预览图片
  viewImg = (flag, img = '', text = '') => {
    this.setState({
      preview_img: img,
      preview_alt_con: text,
      show_preview_modal: flag,
    });
  };

  //操作  confirm 确认操作
  operate = (id, type) => {
    this.setState({ submiting: true });
    const { params } = this.state;
    const { dispatch } = this.props;
    let dis_type = '';
    let param_data = {};
    if (type == 'confirm') {
      dis_type = 'order/confirm_return';
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
            selectedRows: [],
            selectedRowKeys: [],
          });
          this.get_list(params);
          this.props.setUpdateFlag('1');
        } else {
          failTip(res.msg);
        }
        this.setState({ submiting: false });
      },
    });
  };

  //搜索事件
  search = (data) => {
    const values = { ...data };
    //时间处理
    if (values.search_create_time) {
      values.startTime = values.search_create_time[0] ? values.search_create_time[0].format(dateFormat)+ ' 00:00:00'  : '';
      values.endTime = values.search_create_time[1] ? values.search_create_time[1].format(dateFormat)+ ' 23:59:59' : '';
      values.search_create_time = '';
    }
    for (let i in values) {
      if (values[i] == '') {
        delete values[i];
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
  //搜索点击
  moreSearchToggle = () => {
    const {search_height} = this.state;
    if(this.refs.search_part!=undefined){
      if(this.refs.search_part.clientHeight != search_height){
        this.setState({search_height:this.refs.search_part.clientHeight})
      }
    }
  }

  //表格拖动
  resizeTable = (index, size, type, data) => {
    let datas = dragSldTableColumn(index, size, data);
    this.setState({ [type]: datas });
  };

  sldHandleCancle = () => {
    this.setState({ modalVisible: false });
  };

  system_confirm = (val) => {
    this.cur_afs_sn = val;
    let {operateData,confirmData} = this.state;
    operateData = JSON.parse(JSON.stringify(confirmData))
    this.setState({ operateData,modalVisible:true,title:'确认退款',show_foot:true });
  }

  sldHandleConfirm = (val) => {
    this.operate({...val,afsSns:this.cur_afs_sn},'confirm')
  };

  handleSelectRows = (rows, rowkeys) => {
    this.setState({
      selectedRows: rows,
      selectedRowKeys: rowkeys,
    });
  };

  render() {
    const { search_data, data, loading, columns, operateData,submiting,modalVisible,title,selectedRowKeys,show_foot,preview_img, show_preview_modal, preview_alt_con, search_height, selectedRows } = this.state;
    return (
      <div style={{ flex: 1, flexDirection: 'column', overflow: 'hidden' }}>
        <div>
          <div className={global.tableListForm} ref={'search_part'}>
            <Search search_data={search_data} moreSearchToggle={() => this.moreSearchToggle()}
                    seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}
            />
          </div>
          {/*公共功能条-start*/}
          <div className={global.operate_bg}
               style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {selectedRowKeys.length == 0 ? sldIconBtn(() => {
                failTip(`${sldComLanguage('请先选中数据')}`);//请先选中数据
                //确认通过选中的数据吗？
              }, `${sldComLanguage('批量确认')}`, 7, 0, 15, 15, 3, 'piliangxiajia', '#FA6F1E') : sldIconBtn(() => this.system_confirm(selectedRowKeys.join(',')), `${sldComLanguage('批量确认')}`, 7, 0, 15, 15, 3, 'piliangxiajia', '#FA6F1E')}
            </div>
          </div>
          {/*公共功能条-end*/}
          <Spin spinning={loading}>
            <StandardTable
              totalHeight={document.body.clientHeight - 185-search_height-15}
              selectedRows={selectedRows}
              data={data}
              rowKey={'afsSn'}
              isCheck={true}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
              resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
              isColumnResize={true}
              showMarkColor={true}
            />
          </Spin>

        </div>
        {/*新增/编辑对话框-start*/}
        <SldModal
          title={title}
          submiting={submiting}
          width={500}
          modalVisible={modalVisible}
          sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
          sldHandleCancle={this.sldHandleCancle}
          formItemLayoutModal={formItemLayoutModal}
          content={operateData}
          show_foot = {show_foot}
        />
        {/*新增/编辑对话框-end*/}
        {/*图片预览-start*/}
        <SldPreviewImg img={preview_img} show_preview_modal={show_preview_modal} modal_width={600}
                       preview_alt_con={preview_alt_con} closePreviewModal={() => this.viewImg(false)}/>
        {/*图片预览-end*/}
      </div>

    );
  }
}
