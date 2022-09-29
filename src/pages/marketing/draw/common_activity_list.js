import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Modal, Spin } from 'antd';
import Link from 'umi/link';
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
  sldLlineRtextAddGoodsAddMargin,
  getSldEmptyH,
  sldPopConfirmDiy,
  sldIconBtn,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import promotion from '@/assets/css/promotion.less';
import DrawRecordList from './draw_record_list';
import router from 'umi/router';

let sthis = '';
let pageSize = list_com_page_size_10;
@connect(({ draw }) => ({
  draw,
}))
@Form.create()
export default class CommonActivityList extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      curDrawId: '',//当前活动id
      initLoading: false,
      modalVisible: false,//是否显示中奖详情弹框
      data: {},//列表数据
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      search_data: [{
        type: 'input',
        label: `${sldComLanguage('活动名称')}`,
        name: 'drawName',
        placeholder: `${sldComLanguage('请输入活动名称')}`,
      }, {
        type: 'rangepicker',
        label: `${sldComLanguage('活动时间')}`,
        name: 'search_activity_time',
        placeholder1: `${sldComLanguage('开始时间')}`,
        placeholder2: `${sldComLanguage('结束时间')}`,
      }, {
        type: 'select',
        label: `${sldComLanguage('活动状态')}`,
        name: 'state',
        placeholder: `${sldComLanguage('请选择活动状态')}`,
        sel_data: [
          { key: '', name: `${sldComLanguage('全部')}` },
          { key: '1', name: `${sldComLanguage('未开始')}` },
          { key: '2', name: `${sldComLanguage('进行中')}` },
          { key: '3', name: `${sldComLanguage('已结束')}` },
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
          title: `${sldComLanguage('活动名称')}`,
          dataIndex: 'drawName',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('活动时间')}`,
          dataIndex: 'startTime',
          align: 'center',
          width: 100,
          render: function(text, record) {
            return <div className={global.voucher_time_wrap}>
              <p>{text}</p>
              <p>~</p>
              <p>{record.endTime}</p>
            </div>;
          },
        },
        {
          title: `${sldComLanguage('抽奖规则')}`,
          dataIndex: 'ruleValue',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('中奖人数/抽奖人数')}`,
          dataIndex: 'prizeNum',
          align: 'center',
          width: 150,
          render: (text, record) => {
            return <div className={promotion.voucher_num}
                        onClick={() => this.viewDetail(record.drawId)}>{record.prizeNum}/{record.drawNum}</div>;
          },
        },
        {
          title: `${sldComLanguage('活动状态')}`,
          dataIndex: 'stateValue',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('操作')}`,
          align: 'center',
          width: 100,
          render: (text, record) => {
            let tar_path = sthis.getTarPath(props.drawType);
            return <Fragment>
              <Link to={{
                pathname: tar_path,
                query: {
                  id: record.drawId,
                  drawType: props.drawType,
                  type: 'view',
                },
              }}>
                {sldtbaleOpeBtnText(`${sldComLanguage('查看')}`, () => null)}
              </Link>
              {(record.state == 1) &&
              <Fragment>
                <span className={global.splitLine}></span>
                <Link to={{
                  pathname: tar_path,
                  query: {
                    id: record.drawId,
                    drawType: props.drawType,
                    type: 'edit',
                  },
                }}>
                  {sldtbaleOpeBtnText(`${sldComLanguage('编辑')}`, () => null)}
                </Link>
              </Fragment>
              }
              <span className={global.splitLine}></span>
              <Link to={{
                pathname: tar_path,
                query: {
                  id: record.drawId,
                  drawType: props.drawType,
                  type: 'copy',
                },
              }}>
                {sldtbaleOpeBtnText(`${sldComLanguage('复制')}`, () => null)}
              </Link>
              <span className={global.splitLine}></span>
              {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}？`, () => this.operate(record.drawId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
            </Fragment>;
          },
        },
      ],
    };
  }

  componentDidMount() {
    this.get_list({ pageSize: pageSize });
  }

  //活动操作  type: copy 复制 del 删除
  operate = (id, type) => {
    const { params } = this.state;
    const { dispatch } = this.props;
    let param_data = {};
    let dis_type = '';
    if (type == 'del') {
      dis_type = 'draw/del_activity';
      param_data.drawId = id;
    }
    this.setState({ initLoading: true });
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

  //获取数据列表
  get_list = (params) => {
    this.setState({ initLoading: true });
    const { dispatch, drawType } = this.props;
    dispatch({
      type: 'draw/get_activity_list',
      payload: { ...params, drawType: drawType },
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
    //活动时间处理
    if (values.search_activity_time) {
      values.startTime = values.search_activity_time[0] ? values.search_activity_time[0].format(dateFormat) + ' 00:00:00' : '';
      values.endTime = values.search_activity_time[1] ? values.search_activity_time[1].format(dateFormat) + ' 23:59:59' : '';
      delete values.search_activity_time;
    }
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

  //抽奖详情弹框关闭
  sldHandleCancle = () => {
    this.setState({ modalVisible: false });
  };

  //查看抽奖详情
  viewDetail = (id) => {
    this.setState({ modalVisible: true, curDrawId: id });
  };

  //根据活动类型获取对应路由
  getTarPath = (drawType) => {
    let target = '';
    //抽奖活动类型，1-幸运抽奖，2-大转盘，3-刮刮卡，4-摇一摇，5-翻翻看
    if (drawType == 1) {
      target = '/marketing_promotion/lucky_draw_list_to_add';
    } else if (drawType == 2) {
      target = '/marketing_promotion/turnplate_list_to_add';
    } else if (drawType == 3) {
      target = '/marketing_promotion/scratch_list_to_add';
    } else if (drawType == 4) {
      target = '/marketing_promotion/shake_list_to_add';
    } else if (drawType == 5) {
      target = '/marketing_promotion/turn_list_to_add';
    }
    return target;
  };

  //新建活动
  add = () => {
    let { drawType } = this.props;
    let target = this.getTarPath(drawType);
    target += '?drawType=' + drawType;
    router.push(target);
  };

  render() {
    const { selectedRows, search_data, columns, initLoading, data, curDrawId, modalVisible } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1, paddingTop: 0 }}>
        {getSldEmptyH(10)}
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', this.props.pageTitle, 0, 0, 10)}
        <div className={global.tableListForm}>
          <Search search_data={search_data}
                  seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}/>
        </div>
        <div className={global.operate_bg}>
          {sldIconBtn(() => this.add(), `${sldComLanguage('新建活动')}`, 7, 0, 14, 14, 3, 'fabu1', '#FA6F1E')}
        </div>
        <Spin spinning={initLoading}>
          {/*标准表格-start*/}
          <StandardTable
            totalHeight={document.body.clientHeight - 200}
            bordered={false}
            selectedRows={selectedRows}
            data={data}
            rowKey={'drawId'}
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
        <Modal
          destroyOnClose={true}
          maskClosable={false}
          title={`${sldComLanguage('查看中奖详情')}`}
          zIndex={999}
          width={1000}
          onCancel={this.sldHandleCancle}
          footer={null}
          visible={modalVisible}
        >
          <DrawRecordList drawId={curDrawId}/>
        </Modal>
      </div>
    );
  }
}
