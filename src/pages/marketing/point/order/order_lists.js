import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Radio, Empty, Pagination, } from 'antd';
import Link from 'umi/link';
import {
  dragSldTableColumn,
  list_com_page_size_10,
  sldComLanguage,
  dateFormat,
  sldLlineRtextAddGoods,
  sldIconBtnBg,failTip
} from '@/utils/utils';
import global from '@/global.less';
import order from './order.less';
import Search from '@/components/Search/Search';
import { Scrollbars } from 'react-custom-scrollbars';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


let pageSize = list_com_page_size_10;
let sthis = '';
@connect(({ point }) => ({
  point,
}))
@Form.create()
export default class Order_lists extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      search_height:0,
      filter_code: '',//过滤器默认值
      loading: false,
      data: {},
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      title: '',
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      curData: {},//编辑的数据
      search_data: [{
        type: 'input',
        label: `${sldComLanguage('订单号')}`,
        name: 'orderSn',
        placeholder: `${sldComLanguage('请输入')}${sldComLanguage('订单号')}`,
      }, {
        type: 'input',
        label: `${sldComLanguage('店铺名称')}`,
        name: 'storeName',
        placeholder: `${sldComLanguage('请输入店铺名称')}`,
      }, {
        type: 'input',
        label: `${sldComLanguage('会员名称')}`,
        name: 'memberName',
        placeholder: `${sldComLanguage('请输入会员名称')}`,
      }, {
        type: 'rangepicker',
        label: `${sldComLanguage('兑换时间')}`,
        name: 'search_create_time',
        placeholder1: `${sldComLanguage('开始时间')}`,
        placeholder2: `${sldComLanguage('结束时间')}`,
      },
      ],
      formValues: {},//搜索条件
      operateData: [], //弹框操作数据
      modalVisible: false,
      modalTitle: '',
      submiting: false,
      show_foot: true,
      modal_width: 700,
      modalItem: {},
      demodalVisible: false,
      expressList: [],
      deliverType: '',
      resList: [], // 取消原因数据
    };
  }

  filter_data = [
    { filter_code: '', filter_name: `${sldComLanguage('全部订单')}` },
    { filter_code: '10', filter_name: `${sldComLanguage('待付款订单')}` },
    { filter_code: '20', filter_name: `${sldComLanguage('待发货订单')}` },
    { filter_code: '30', filter_name: `${sldComLanguage('待收货订单')}` },
    { filter_code: '40', filter_name: `${sldComLanguage('已完成订单')}` },
    { filter_code: '0', filter_name: `${sldComLanguage('已取消订单')}` },
  ];//订单过滤器


  componentDidMount() {
    this.get_list({ pageSize: pageSize });
    this.resize();
    window.addEventListener('resize', this.resize, { passive: true });
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
      type: 'point/get_order_lists',
      payload: { ...params },
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

  handleSelectRows = (rows, rowkeys) => {
    this.setState({
      selectedRows: rows,
      selectedRowKeys: rowkeys,
    });
  };

  //搜索事件
  search = (data) => {
    const values = { ...data };
    const { filter_code } = this.state;
    //时间处理
    if (values.search_create_time) {
      values.startTime = values.search_create_time[0] ? values.search_create_time[0].format(dateFormat) + ' 00:00:00' : '';
      values.endTime = values.search_create_time[1] ? values.search_create_time[1].format(dateFormat)+ ' 23:59:59'  : '';
      values.search_create_time = '';
    }
    values.orderState = filter_code;
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
      filter_code:'',
      data:{},
      params: { pageSize: pageSize }
    });
    this.get_list({ pageSize: pageSize });
  };

  //表格拖动
  resizeTable = (index, size, type, data) => {
    let datas = dragSldTableColumn(index, size, data);
    this.setState({ [type]: datas });
  };

  //订单条件过滤器
  clickFilter = (e) => {
    //搜索条件置为空
    this.setState({
      filter_code: e.target.value,
    });
    let param = {pageSize: pageSize, currentPage: 1,...this.state.formValues};
    if(e.target.value){
      param.orderState = e.target.value;
    }
    this.get_list(param);
  };

  //改变每页的数量
  onShowSizeChange = (current, pageSizeNew) => {
    let { params,formValues } = this.state;
    params.pageSize = pageSizeNew;
    pageSize = params.pageSize;
    let curParams = { ...params, ...formValues }
    this.setState({ params },()=>{
      this.get_list(curParams);
    });
  };

  //改变页码
  onPageChange = (page, pageSize) => {
    const { formValues, filter_code } = this.state;
    let curParams = { pageSize: pageSize, current: page, ...formValues }
    if(filter_code){
      curParams.orderState = filter_code;
    }
    this.setState({ params: curParams});
    this.get_list(curParams);
  };

  handleSldExcel = () => {
    const { params, formValues,filter_code } = this.state;
    let paramData = {
      ...params,
      ...formValues,
    };
    if(filter_code){
      paramData.orderState = filter_code;
    }
    paramData.fileName = `${sldComLanguage('积分订单导出')}`;
    const { dispatch } = this.props;
    this.setState({loading:true})
    dispatch({
      type: 'point/export_order_lists',
      payload: paramData,
      callback: (res) => {
        if(res.state!=undefined&&res.state == 255){
          failTip(res.msg);
        }
        this.setState({loading:false})
      }
    })
  };

  render() {
    const { search_data, data, loading, filter_code, params, search_height } = this.state;
    return (
      <div className={`${global.common_page}`}
           style={{ flex: 1, flexDirection: 'column', overflow: 'hidden' }}>
        <div className={global.flex_com_space_between} style={{ marginBottom: 10 }}>
          {sldLlineRtextAddGoods('#FA6F1E', `${sldComLanguage('订单管理')}`)}{/* 订单管理*/}
          {sldIconBtnBg(() => this.handleSldExcel(), 'ziyuan23', `${sldComLanguage('订单导出')}`, '#fff', 7, 0, 15, 15, 3)}
        </div>
        <div style={{ position: 'relative' }}>

          <div className={global.tableListForm} ref={'search_part'}>
            <Search search_data={search_data}
                    seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}
            />
          </div>
          {/*筛选器-start*/}
          <div style={{ marginBottom: 10 }}>
            <RadioGroup value={filter_code} size="small" onChange={this.clickFilter}>
              {this.filter_data.map((item, index) => {
                return <RadioButton key={index + 1}
                                    value={item.filter_code}>{item.filter_name}</RadioButton>;
              })}
            </RadioGroup>
          </div>
          <Spin spinning={loading}>
            {/*标准表格-start*/}
            <div className={order.order_list}>
              <ul className={order.header}>
                <li className={`${order.width_30} ${order.pl_100}`}>{sldComLanguage('商品信息')}</li>
                <li className={`${order.width_10} ${order.center}`}>{sldComLanguage('单价')}</li>
                <li className={`${order.width_10} ${order.center}`}>{sldComLanguage('数量')}</li>
                <li className={`${order.width_10} ${order.center}`}>{sldComLanguage('会员')}</li>
                <li className={`${order.width_10} ${order.center}`}>{sldComLanguage('实付金额')}</li>
                <li className={`${order.width_10} ${order.center}`}>{sldComLanguage('付款方式')}</li>
                <li className={`${order.width_10} ${order.center}`}>{sldComLanguage('订单状态')}</li>
                <li className={`${order.width_10} ${order.center}`}>{sldComLanguage('操作')}</li>
              </ul>
              <div className={order.order_content}>
                {data.list != undefined && data.list.length == 0 &&
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
                }
                <Scrollbars autoHeight
                            autoHeightMax={document.body.clientHeight - 272-search_height}>
                  {data.list != undefined && data.list.length > 0 && data.list.map((item, index) => {
                    return <div className={order.item} key={index}>
                      <div className={`${order.order_info} ${global.flex_row_between_center}`}>
                        <div className={`${order.left} ${global.flex_row_start_start}`}>
                          <span className={order.order_sn}>{sldComLanguage('订单号：')}{item.orderSn}</span>
                          {item.isVirtualGoods == 2&&
                          <div className={order.order_type}>
                            <img className={order.order_type_icon}
                                 src={require('@/assets/order/virtural_goods_order_icon.png')}/>
                            <span
                              className={order.order_type_text}>{sldComLanguage('虚拟商品订单')}</span>
                          </div>
                          }
                          <span className={order.order_sn} style={{marginLeft:20}}>{sldComLanguage('店铺')}【{item.storeName}】</span>
                        </div>
                        <span className={order.create_time}>{sldComLanguage('兑换时间：')}{item.createTime}</span>
                      </div>
                      <div className={`${order.order_goods_part} ${global.flex_row_start_center}`}>
                        <div className={`${order.goods} ${global.flex_column_start_start} ${order.width_50} ${item.orderProductList != undefined && item.orderProductList.length > 1 ? order.goods_split : null}`}>

                          {item.orderProductList != undefined && item.orderProductList.length > 0 && item.orderProductList.map((item_goods, index_goods) => {
                            return <div className={`${order.goods_item} ${global.flex_row_start_center}`}
                                        style={{ width: '100%' }} key={index_goods}>
                              <div className={`${global.flex_row_start_center}`} style={{ width: '60%' }}>
                                <div className={`${order.goods_img_wrap} ${global.flex_row_center_center}`}>
                                  <img
                                    src={item_goods.productImage}/>
                                </div>
                                <div className={`${order.goods_info} ${global.flex_column_start_start}`}>
                                  <span className={`${order.goods_name}`}>{item_goods.goodsName}</span>
                                  <span className={`${order.goods_spec}`}>{item_goods.specValues}</span>
                                </div>
                              </div>
                              <span className={`${order.goods_price} ${order.width_10} ${order.center}`}
                                    style={{ width: '20%' }}>{sldComLanguage('积分')}{item_goods.integralPrice}+￥{item_goods.cashPrice}</span>
                              <span className={`${order.buy_num} ${order.width_10} ${order.center}`}
                                    style={{ width: '20%' }}>{item_goods.productNum}</span>
                            </div>;
                          })}
                        </div>

                        <div className={`${order.member_info} ${global.flex_column_center_center} ${order.width_10}`}>
                          <span className={`${order.mem_name}`}>{item.memberName}</span>
                        </div>

                        <div
                          className={`${order.pay_amount} ${order.width_10} ${order.center}`}>{sldComLanguage('积分')}{item.integral}+{sldComLanguage('￥')}{item.cashAmount}</div>

                        <div
                          className={`${order.order_state} ${order.width_10} ${order.center}`}>{item.paymentName}</div>
                        <div
                          className={`${order.order_state} ${order.width_10} ${order.center}`}>{item.orderStateValue}</div>
                        <div className={`${order.operate} ${order.width_10} ${order.center} ${global.flex_row_center_center}`}>
                          <Link
                            to={{
                              pathname: '/marketing_point/order_list_to_detail',
                              query: {
                                orderSn: item.orderSn,
                              },
                            }}
                          >
                            <div className={`${order.operate_btn}`}>
                              {sldComLanguage('查看详情')}
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>;
                  })
                  }
                </Scrollbars>
              </div>
              <div className={order.pagination}>
                {data.list != undefined && data.list.length > 0 && data.pagination != undefined &&
                <Pagination
                  size={'small'}
                  showSizeChanger
                  showQuickJumper
                  current={data.pagination.current}
                  pageSize={params.pageSize}
                  onShowSizeChange={this.onShowSizeChange}
                  onChange={this.onPageChange}
                  defaultCurrent={data.pagination.current}
                  total={data.pagination.total}
                />
                }
              </div>
            </div>
            {/*标准表格-end*/}
          </Spin>
        </div>
      </div>
    );
  }
}
