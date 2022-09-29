import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import {
  Form, Spin, Modal,
} from 'antd';
import {
  failTip,
  list_com_page_size_10,
  isEmptyObject,
  getTableNum,
  sldComLanguage,
  sldHandlePaginationData,
  dragSldTableColumn,
  getSldListGoodsImg80,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';

let pageSize = list_com_page_size_10;
let sthis = '';
@connect(({ pc_home, project }) => ({
  pc_home,
  project,
}))
@Form.create()
export default class SldSelGoodsSingleDiy extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      expandedRowKeys: [],
      link_type: props.link_type,//链接类型，goods
      modalVisible: false,//是否展示modal框
      width: 900,//modal框宽带
      modaltitle: `${sldComLanguage('选择器')}`,//选择器
      params: { pageSize: pageSize },//搜索条件
      search_data: [{
        type: 'input',
        label: `${sldComLanguage('商品名称')}`,//商品名称
        name: 'goodsName',
        placeholder: `${sldComLanguage('请输入')}${sldComLanguage('商品名称')}`,//请输入商品名称
      }],//筛选器
      loading: false,
      data: {},//表格的数据
      selectedRows: [],
      selectedRowKeys: [],
      columns: [],
      sldpagination: true,//是否展示分页
    };

  }

  init_flag = true;

  goods_columns = [
    {
      title: ' ',
      dataIndex: 'integralGoodsId',
      align: 'center',
      width: 55,
      render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
    },
    {
      title: `商品图片`,//商品图片
      dataIndex: 'mainImage',
      align: 'center',
      width: 100,
      render: (text, record) => {
        return getSldListGoodsImg80(text);
      },
    },
    {
      title: `${sldComLanguage('商品名称')}`,//商品名称
      dataIndex: 'goodsName',
      align: 'center',
      width: 200,
    },
    {
      title: `商品价格`,
      dataIndex: 'cashPrice',
      align: 'center',
      width: 150,
      render: (text, record, index) => {
        return `${record.integralPrice}积分${text ? (' + ¥' + text) : ''}`;
      },
    },
    {
      title: `销量`,//销量
      dataIndex: 'actualSales',
      align: 'center',
      width: 100,
    },
    {
      title: `店铺名称`,//店铺名称
      dataIndex: 'storeName',
      align: 'center',
      width: 200,
    },
  ];

  cat_columns = [
    {
      title: `${sldComLanguage('分类名称')}`,//分类名称
      align: 'left',
      dataIndex: 'labelName',
      width: 250,
    },
  ];

  topic_columns_mobile = [
    {
      title: ' ',
      dataIndex: 'decoId',
      align: 'center',
      width: 30,
      render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
    }, {
      title: `专题名称`,//专题名称
      align: 'center',
      dataIndex: 'name',
      width: 200,
    }, {
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
  ];

  topic_columns_pc = [
    {
      title: ' ',
      dataIndex: 'decoId',
      align: 'center',
      width: 30,
      render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
    }, {
      title: `专题名称`,//专题名称
      align: 'center',
      dataIndex: 'decoName',
      width: 200,
    }, {
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
  ];

  //秒杀数据列
  seckill_columns = [
    {
      title: ' ',
      dataIndex: 'id',
      align: 'center',
      width: 55,
      render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
    }, {
      title: `活动名称`,//活动名称
      dataIndex: 'seckillName',
      align: 'center',
      width: 100,
    },{
      title: `活动时间`,//活动时间
      dataIndex: 'startTime',
      align: 'center',
      width: 200,
      render: (text, record, index) => {
        return text+'~'+record.endTime
      },
    },{
      title: `活动状态`,//活动状态
      dataIndex: 'stateValue',
      align: 'center',
      width: 100,
    },
  ];


  rowKey = '';//table 行唯一标识

  componentDidMount() {
    if (this.props.link_type != '') {
      this.get_list({ pageSize: pageSize });
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let { columns, modaltitle, search_data, sldpagination } = this.state;
    if (nextProps.link_type == 'goods' || nextProps.link_type == 'category' || nextProps.link_type == 'topic'||nextProps.link_type == 'seckill') {
      if (nextProps.link_type == 'goods') {
        columns = this.goods_columns;
        modaltitle = `${sldComLanguage('选择商品')}`;//选择商品
        search_data = [{
          type: 'input',
          label: `${sldComLanguage('商品名称')}`,//商品名称
          name: 'goodsName',
          placeholder: `${sldComLanguage('请输入')}${sldComLanguage('商品名称')}`,//请输入商品名称
        }];//筛选器
        sldpagination = true;
        this.rowKey = 'integralGoodsId';
      } else if (nextProps.link_type == 'category') {
        columns = this.cat_columns;
        modaltitle = `${sldComLanguage('选择积分标签')}`;
        search_data = [];
        sldpagination = false;
        this.rowKey = 'labelId';
      } else if (nextProps.link_type == 'topic') {
        if (nextProps.client == 'mobile') {
          //移动端装修
          columns = this.topic_columns_mobile;
          search_data = [{
            type: 'input',
            label: `${sldComLanguage('专题名称')}`,//专题名称
            name: 'name',
            placeholder: `${sldComLanguage('请输入')}${sldComLanguage('专题名称')}`,//请输入专题名称
          }];//筛选器
        } else {
          //PC装修
          columns = this.topic_columns_pc;
          search_data = [{
            type: 'input',
            label: `${sldComLanguage('专题名称')}`,//专题名称
            name: 'decoName',
            placeholder: `${sldComLanguage('请输入')}${sldComLanguage('专题名称')}`,//请输入专题名称
          }];//筛选器
        }
        modaltitle = `${sldComLanguage('请选择专题')}`;//选择专题
        sldpagination = true;
        this.rowKey = 'decoId';

      } else if (nextProps.link_type == 'seckill') {
        columns = this.seckill_columns;
        modaltitle = `选择秒杀活动`;//选择秒杀活动
        search_data = [{
          type: 'input',
          label: `活动名称`,//活动名称
          name: 'seckillName',
          placeholder: `${sldComLanguage('请输入')}活动名称`,//请输入活动名称
        },{
          type: 'select',
          label: `活动状态`,
          name: 'state',
          placeholder: `请选择活动状态`,
          sel_data: [
            { key: '', name: `全部` },
            { key: '1', name: `未开始` },
            { key: '2', name: `进行中` },
          ],
        }];//筛选器
        modaltitle = `选择秒杀活动`;
        sldpagination = true;
        this.rowKey = 'seckillId';
      }
      this.setState({
        search_data,
        link_type: nextProps.link_type,
        modalVisible: true,
        columns,
        modaltitle,
        sldpagination,
      }, () => {
        let param = { pageSize: pageSize };
        if (nextProps.link_type == 'category') {
          param.labelId = 0;
        }
        sthis.get_list(param);
      });
    }
  }

  componentWillUnmount() {

  }

  //获取数据列表
  get_list = (params, grade = '') => {
    this.setState({ loading: true });
    const { dispatch } = this.props;
    let { link_type, data, expandedRowKeys } = this.state;
    let dis_type = '';
    let new_params = { ...params };
    if (link_type == 'goods') {
      //获取商品数据
      dis_type = 'project/get_point_goods_lists';
      new_params.state = 3;//在售状态
    } else if (link_type == 'category') {
      //获取分类数据
      dis_type = 'project/get_point_label_list';
      new_params = params;
    }
    dispatch({
      type: dis_type,
      payload: new_params,
      callback: (res) => {
        this.setState({ loading: false });
        if (res.state == 200) {
          if (link_type == 'goods' || link_type == 'topic' || link_type == 'seckill') {
            data = res.data;
          } else if (link_type == 'category') {
            //id为0直接赋值
            if (grade != '') {
              for (let i in data.list) {
                if (grade == 1) {
                  if (data.list[i].labelId == params.labelId) {
                    data.list[i].children = res.data.list;
                    break;
                  }
                } else {
                  if (data.list[i].children != undefined) {
                    for (let j in data.list[i].children) {
                      if (data.list[i].children[j].labelId == params.labelId) {
                        data.list[i].children[j].children = res.data.list;
                        break;
                      }
                    }
                  }
                }
              }
            } else {
              data.list = res.data.list;
            }
          }
          this.setState({
            data,
            expandedRowKeys: grade == '' ? [] : expandedRowKeys,
          });
        }
      },
    });
  };

  handleSelectRows = (rows, rowkeys) => {
    //针对翻页无法保存选择的行数据处理
    let { selectedRows, selectedRowKeys } = this.state;
    let pre_sele_rows_keyarray = [];
    for (let i in selectedRows) {
      pre_sele_rows_keyarray.push(selectedRows[i][this.rowKey]);
    }
    //去掉的话要删掉行数据
    for (let i in selectedRowKeys) {
      if (rowkeys.indexOf(selectedRowKeys[i]) == -1) {
        selectedRows = selectedRows.filter(item => item[this.rowKey] != selectedRowKeys[i]);
      }
    }
    //没有的话追加行数据
    for (let i in rowkeys) {
      if (pre_sele_rows_keyarray.indexOf(rowkeys[i]) == -1) {
        let cur_row = rows.filter(item => item[this.rowKey] == rowkeys[i])[0];
        selectedRows.push(cur_row);
      }
    }
    this.setState({
      selectedRows: selectedRows,
      selectedRowKeys: rowkeys,
    });
  };

  //搜索事件
  search = (data) => {
    for(let i in data){
      if(data[i] == ''){
        delete data[i]
      }
    }
    this.setState({
      formValues: data,
      params: { pageSize: pageSize }
    });
    this.get_list({ pageSize: pageSize, ...data });
  };
  //搜索重置事件
  seaReset = () => {
    //搜索条件置为空
    this.setState({
      formValues: {},
      selectedKeys: [' '],
      params: { pageSize: pageSize }
    });
    this.get_list({ pageSize: pageSize });
  };

  sldConfirm = () => {
    let { modalTableSeleData } = this.state;
    if (!isEmptyObject(modalTableSeleData)) {
      this.setState({
        modalVisible: false,
        link_type: '',
        params: { pageSize: pageSize },
        data:{},
      });
      this.props.seleSku(modalTableSeleData);
    } else {
      failTip(`${sldComLanguage('请选择数据')}`);//请选择数据
    }
  };

  //关闭modal之后重置数据
  closeReset = () => {
    this.init_flag = true;
  };

  //取消事件
  sldCancle = () => {
    this.props.sldHandleCancle();
    this.setState({
      modalVisible: false,
      link_type: '',
      params: { pageSize: pageSize },
      data:{},
    });
  };

  //选中单行的操作
  onSldHandleSeleRow = (record) => {
    let { modalTableSeleData, link_type } = this.state;
    modalTableSeleData = {};
    //剔除无用数据
    if (link_type == 'goods') {
      modalTableSeleData.integralGoodsId = record.integralGoodsId;
      modalTableSeleData.goodsName = record.goodsName;
      modalTableSeleData.integralPrice = record.integralPrice;
      modalTableSeleData.cashPrice = record.cashPrice;
      modalTableSeleData.actualSales = record.actualSales;
      modalTableSeleData.mainImage = record.mainImage;
      modalTableSeleData.productId = record.productId;
    }else if (link_type == 'category') {
      modalTableSeleData.labelId = record.labelId;
      modalTableSeleData.labelName = record.labelName;
      modalTableSeleData.grade = record.grade;
      modalTableSeleData.parentLabelId = record.parentLabelId;
    }
    this.setState({
      modalTableSeleData,
    });
  };

  onExpand = (expanded, record) => {
    let { expandedRowKeys } = this.state;
    if (expanded) {
      expandedRowKeys.push(record.labelId);
      this.get_list({ labelId: record.labelId }, record.grade);
    } else {
      expandedRowKeys = expandedRowKeys.filter(item => item != record.labelId);
    }
    this.setState({ expandedRowKeys });
  };

  //表格列拖动
  resizeTable = (index, size, type, data) => {
    let datas = dragSldTableColumn(index, size, data);
    this.setState({ [type]: datas });
  };

  handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
    if (type == 'main') {
      const { formValues } = this.state;
      const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
      pageSize = params.pageSize;
      this.setState({
        params: params,
      });
      this.get_list(params);
    }
  };

  render() {
    const { link_type } = this.props;
    const { modalVisible, modaltitle, width, data, columns, search_data, loading, sldpagination, expandedRowKeys } = this.state;
    return (
      <Modal destroyOnClose={true}
             onOk={this.sldConfirm}
             afterClose={this.closeReset}
             onCancel={this.sldCancle} visible={modalVisible} width={width} title={modaltitle}
      >

        <div style={{ display: 'flex', flexDirection: 'row', }}>
          <div className={global.common_page} style={{ flex: 1 }}>
            {link_type != 'category' &&
            <div className={global.tableListForm}>
              <div style={{ position: 'relative' }}>
                <Search search_data={search_data} top={0} seaSubmit={(data) => this.search(data)}
                        seaReset={() => this.seaReset()}/>
              </div>
            </div>
            }
            <Scrollbars autoHeight
                        autoHeightMin={300}
                        autoHeightMax={document.body.clientHeight - 300}>
              <Spin spinning={loading}>
                {/*标准表格-start*/}
                <StandardTable
                  showScrollbar={false}
                  expandedRowKeys={expandedRowKeys}
                  selectedRows={[]}
                  selectedRowKeys={[]}
                  data={data}
                  rowKey={this.rowKey}
                  isCheck={false}
                  columns={columns}
                  onSldHandleSeleRow={this.onSldHandleSeleRow}
                  onSelectRow={this.handleSelectRows}
                  flag_show_sele_data={true}
                  sldpagination={sldpagination}
                  onExpand={this.onExpand}
                  onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
                  resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
                  isColumnResize={true}
                />
                {/*标准表格-end*/}
              </Spin>
            </Scrollbars>
          </div>
        </div>
      </Modal>
    );
  }
}
