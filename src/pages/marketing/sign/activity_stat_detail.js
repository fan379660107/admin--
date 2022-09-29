import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
  list_com_page_size_10,
  dragSldTableColumn,
  sldHandlePaginationData,
  sldLlineRtextAddGoods,
  getTableNum,
  sldComLanguage,
  dateFormat,
  sldIconBtnBg,
} from '@/utils/utils';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';

let pageSize = list_com_page_size_10;
@connect(({ sign, global }) => ({
  sign, global,
}))
@Form.create()
export default class SignActivityStatDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paddingLeft: 0,//页面统计模块每个item右侧的内边距
      itemWidth: 0,//页面统计模块每个item的宽度
      fontSizeNum: 0,//页面统计模块每个item的数据
      fontSizeTip: 0,//页面统计模块每个item的文字提示
      query: props.location.query,
      search_con: '',
      initLoading: false,
      submiting: false,
      data: {},//列表数据
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      title: '',
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      formValues: {},//搜索条件
      search_data: [{
        type: 'input',
        label: `${sldComLanguage('会员名称')}`,
        name: 'memberName',
        placeholder: `${sldComLanguage('请输入会员名称')}`,
      }, {
        type: 'select',
        label: `${sldComLanguage('签到类型')}`,
        name: 'signType',
        placeholder: `${sldComLanguage('请选择签到类型')}`,
        sel_data: [
          { key: '', name: `${sldComLanguage('全部')}` },
          { key: '0', name: `${sldComLanguage('每日签到')}` },
          { key: '1', name: `${sldComLanguage('连续签到')}` },
        ],
      }, {
        type: 'rangepicker',
        label: `${sldComLanguage('签到时间')}`,
        name: 'search_activity_time',
        placeholder1: `${sldComLanguage('开始时间')}`,
        placeholder2: `${sldComLanguage('结束时间')}`,
      }],
      statPart: [{
        name: 'memberNum',
        left_color: '#FF7E28',
        right_color: '#FFBE92',
        left_icon: require('@/assets/sign/member_sign_num.png'),
        right_tip: '签到用户数',
        value: '',
      }, {
        name: 'totalSign',
        left_color: '#5274F1',
        right_color: '#889EFF',
        left_icon: require('@/assets/sign/total_sign_num.png'),
        right_tip: '总签到次数',
        value: '',
      }, {
        name: 'newMemberNum',
        left_color: '#FFBB4F',
        right_color: '#FFD188',
        left_icon: require('@/assets/sign/new_member_num.png'),
        right_tip: '新签到人数',
        value: '',
      }, {
        name: 'newMemberRate',
        left_color: '#77779D',
        right_color: 'rgba(119, 119, 157, 0.5)',
        left_icon: require('@/assets/sign/new_member_rate.png'),
        right_tip: '新用户占比',
        value: '',
      }],//中间部分统计数据
      columns: [
        {
          title: ' ',
          dataIndex: 'logId',
          align: 'center',
          width: 55,
          render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
        },
        {
          title: `${sldComLanguage('会员名称')}`,
          dataIndex: 'memberName',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('签到时间')}`,
          dataIndex: 'signTime',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('签到类型')}`,
          dataIndex: 'signTypeValue',
          align: 'center',
          width: 100,
        }, {
          title: `${sldComLanguage('获取奖励类型')}`,
          dataIndex: 'bonusTypeValue',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('获取奖励值')}`,
          dataIndex: 'bonusIntegral',
          align: 'center',
          width: 150,
          render: (text, record, index) => {
            let res = '';
            if (text) {
              res += `${text}积分`;
            }
            if (record.bonusVoucherName) {
              if (res) {
                res += '+';
              }
              res += `${record.bonusVoucherName}`;
            }
            return res;
          },
        },
      ],
    };
  }

  componentDidMount() {
    this.get_stat_detail();
    this.get_list({ pageSize: pageSize });
    this.props.dispatch({
      type: 'global/getLayoutCollapsed',
    });
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  resize = () => {
    let { paddingLeft, itemWidth, fontSizeNum, fontSizeTip } = this.state;
    let curWidth = document.body.clientWidth;
    if (curWidth > 1400) {
      paddingLeft = 30;
      fontSizeNum = 30;
      fontSizeTip = 20;
      itemWidth = (curWidth - (this.props.global.collapsed ? 90 : 160) - 40) / 4 - 50;
    } else if (curWidth > 1300) {
      paddingLeft = 20;
      fontSizeNum = 28;
      fontSizeTip = 18;
      itemWidth = (curWidth - (this.props.global.collapsed ? 90 : 160) - 40) / 4 - 30;
    } else if (curWidth > 1200) {
      paddingLeft = 15;
      fontSizeNum = 28;
      fontSizeTip = 18;
      itemWidth = (curWidth - (this.props.global.collapsed ? 90 : 160) - 40) / 4 - 20;
    }
    this.setState({ paddingLeft, itemWidth, fontSizeNum, fontSizeTip });
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  //获取统计详情
  get_stat_detail = () => {
    this.setState({ initLoading: true });
    let { query, statPart } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'sign/get_activity_stat_num',
      payload: { signActivityId: query.id },
      callback: (res) => {
        this.setState({ initLoading: false });
        if (res.state == 200) {
          statPart.map(item => item.value = res.data[item.name]);
          this.setState({
            statPart,
          });
        }
      },
    });
  };

  //获取数据列表
  get_list = (params) => {
    this.setState({ initLoading: true });
    let { query } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'sign/get_member_stat_detail',
      payload: { ...params, signActivityId: query.id },
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

  render() {
    const { selectedRows, columns, initLoading, data, search_data, statPart, paddingLeft, itemWidth, fontSizeNum, fontSizeTip } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1 }}>
        <div className={global.flex_com_space_between}>
          {sldLlineRtextAddGoods('#FA6F1E', `${sldComLanguage('活动签到明细')}`)}
          {sldIconBtnBg(() => this.props.history.goBack(), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
        </div>
        <div className={global.tableListForm} ref={'search_part'}>
          <Search search_data={search_data}
                  seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}/>
        </div>
        <div className={`${promotion.sign_activity_stat} ${global.flex_row_between_start}`}>
          {statPart.map(item => {
            return <div key={item.name} className={`${promotion.item} ${global.flex_row_start_center}`}
                        style={{ background: item.right_color, width: itemWidth }}>
              <div className={`${promotion.left} ${global.flex_row_center_center}`}
                   style={{ background: item.left_color }}>
                <img src={item.left_icon}/>
              </div>
              <div className={`${promotion.right} ${global.flex_column_center_start}`}
                   style={{ paddingLeft: paddingLeft }}>
                <span className={`${promotion.num}`} style={{ fontSize: fontSizeNum }}>{item.value}</span>
                <span className={`${promotion.tip}`} style={{ fontSize: fontSizeTip }}>{item.right_tip}</span>
              </div>
            </div>;
          })}
        </div>
        <Spin spinning={initLoading}>
          {/*标准表格-start*/}
          <StandardTable
            selectedRows={selectedRows}
            data={data}
            rowKey={'logId'}
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
