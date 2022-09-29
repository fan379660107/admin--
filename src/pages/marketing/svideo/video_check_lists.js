/*
* 作品审核列表*/
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
  failTip,
  sucTip,
  list_com_page_size_10,
  dragSldTableColumn,
  sldHandlePaginationData,
  formItemLayoutModal,
  dateFormat,
  getTableNum,
  sldComLanguage,
  sldtbaleOpeBtnText,
  getSldComImg,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import SldModal from '@/components/SldModal/SldModal';
import SldPreviewImg from '@/components/SldPreviewImg/SldPreviewImg';

let pageSize = list_com_page_size_10;
@connect(({ svideo }) => ({
  svideo,
}))
@Form.create()
export default class VideoCheckLists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search_height: 0,
      show_foot: false,
      preview_img: '',
      preview_alt_con: '',
      show_preview_modal: false,
      scrToBottom: false,//modal 是否滚动到底部属性
      modalVisible: false,
      initLoading: false,
      submiting: false,
      data: {},//列表数据
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      title: `${sldComLanguage('作品审核')}`,
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      operateData: [],//modal弹框用到的数据
      checkData: [{
        type: 'show_content',
        name: 'memberName',
        label: `${sldComLanguage('会员名称')}`,
        content: '',
      }, {
        type: 'show_content',
        name: 'memberNickname',
        label: `${sldComLanguage('作者昵称')}`,
        content: '',
      }, {
        type: 'show_content',
        name: 'videoName',
        label: `${sldComLanguage('作品名称')}`,
        content: '',
      }, {
        type: 'show_content',
        name: 'introduction',
        label: `${sldComLanguage('作品简介')}`,
        content: '',
      }, {
        type: 'show_image',
        label: `${sldComLanguage('作品封面')}`,
        name: 'videoImage',
        width: 100,
        height: 100,
        content: '',
        preView: this.viewImg,
      }, {
        type: 'view_video',
        label: `${sldComLanguage('作品内容')}`,
        name: 'videoPath',
        width: 300,
        height: 200,
        content: '',
        preView: this.viewImg,
      }, {
        type: 'show_content_table',
        name: 'bind_goods',
        label: `${sldComLanguage('绑定的商品')}`,
        content: '',
        data: [],
        totalHeight: 300,
        columns: this.goods_table_columns,
        rowKey: 'goodsId',
        scroll:false,
      }, {
        type: 'radio_select',
        label: `${sldComLanguage('审核')}`,
        name: 'isPass',
        placeholder: `${sldComLanguage('请选择')}${sldComLanguage('审核结果')}`,
        data: [{
          key: true,
          value: `${sldComLanguage('通过')}`,
        }, {
          key: false,
          value: `${sldComLanguage('拒绝')}`,
        }],
        initialValue: true,
        callback: this.isCheck,
      }, {
        type: 'textarea',
        label: `${sldComLanguage('审核意见')}`,
        name: 'remark',
        maxLength: 150,
        placeholder: `${sldComLanguage('请输入')}${sldComLanguage('审核意见')}`,
        rules: [{
          required: true,
          message: `${sldComLanguage('请输入')}${sldComLanguage('审核意见')}`,
        }],
      }, {
        type: 'show_content',
        name: 'stateValue',
        label: `${sldComLanguage('审核结果')}`,
        content: '',
      }, {
        type: 'show_content',
        name: 'remark',
        label: `${sldComLanguage('审核意见')}`,
        content: '',
      }],
      search_data: [{
        type: 'input',
        label: `${sldComLanguage('作品名称')}`,
        name: 'videoName',
        placeholder: `${sldComLanguage('请输入作品名称')}`,
      }, {
        type: 'input',
        label: `${sldComLanguage('会员名称')}`,
        name: 'memberName',
        placeholder: `${sldComLanguage('请输入会员名称')}`,
      }, {
        type: 'input',
        label: `${sldComLanguage('作者昵称')}`,
        name: 'memberNickname',
        placeholder: `${sldComLanguage('请输入作者昵称')}`,
      }, {
        type: 'rangepicker',
        label: `${sldComLanguage('发布时间')}`,
        name: 'publish_time',
        placeholder1: `${sldComLanguage('开始时间')}`,
        placeholder2: `${sldComLanguage('结束时间')}`,
      }, {
        type: 'select',
        label: `${sldComLanguage('审核状态')}`,
        name: 'state',
        initialValue: '',
        placeholder: `${sldComLanguage('请选择审核状态')}`,
        sel_data: [
          { key: '', name: `${sldComLanguage('全部')}` },
          { key: '1', name: `${sldComLanguage('待审核')}` },
          { key: '3', name: `${sldComLanguage('审核失败')}` },
        ],
      }, {
        type: 'select',
        label: `${sldComLanguage('作品类型')}`,
        name: 'videoType',
        initialValue: '',
        placeholder: `${sldComLanguage('请选择作品类型')}`,
        sel_data: [
          { key: '', name: `${sldComLanguage('全部')}` },
          { key: '1', name: `${sldComLanguage('视频')}` },
          { key: '2', name: `${sldComLanguage('图文')}` },
        ],
      }],
      formValues: {},//搜索条件
      columns: [
        {
          title: ' ',
          align: 'center',
          width: 55,
          render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
        },
        {
          title: `${sldComLanguage('会员名称')}`,
          dataIndex: 'memberName',
          align: 'center',
          width: 150,
        }, {
          title: `${sldComLanguage('作者昵称')}`,
          dataIndex: 'memberNickname',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('封面')}`,
          dataIndex: 'videoImage',
          align: 'center',
          width: 100,
          render: (text, record) => {
            return getSldComImg(text, 200, 200, 60, 60);
          },
        },
        {
          title: `${sldComLanguage('作品名称')}`,
          dataIndex: 'videoName',
          align: 'center',
          width: 100,
        }, {
          title: `${sldComLanguage('作品简介')}`,
          dataIndex: 'introduction',
          align: 'center',
          width: 100,
        }, {
          title: `${sldComLanguage('商品数')}`,
          dataIndex: 'goodsNum',
          align: 'center',
          width: 100,
        }, {
          title: `${sldComLanguage('发布时间')}`,
          dataIndex: 'createTime',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('作品类型')}`,
          align: 'center',
          dataIndex: 'videoTypeValue',
          width: 100,
        },
        {
          title: `${sldComLanguage('审核状态')}`,
          align: 'center',
          dataIndex: 'stateValue',
          width: 100,
        }, {
          title: `${sldComLanguage('审核意见')}`,
          align: 'center',
          dataIndex: 'remark',
          width: 100,
        },
        {
          title: `${sldComLanguage('操作')}`,
          align: 'center',
          width: 80,
          render: (text, record) => (
            <Fragment>
              {
                sldtbaleOpeBtnText(record.state == 1 ? `${sldComLanguage('审核')}` : `${sldComLanguage('查看')}`, () => this.checkVideo(record))
              }
            </Fragment>
          ),
        },
      ],
    };
  }

  goods_table_columns = [
    {
      title: ' ',
      dataIndex: 'id',
      align: 'center',
      width: 30,
      render: (text, record, index) => {
        return index + 1;
      },
    }, {
      title: `${sldComLanguage('商品名称')}`,
      dataIndex: 'goodsName',
      align: 'center',
      width: 200,
    }, {
      title: `${sldComLanguage('商品图片')}`,
      dataIndex: 'goodsImage',
      align: 'center',
      width: 100,
      render: (text, record) => {
        return getSldComImg(text, 200, 200, 60, 60);
      },
    }, {
      title: `${sldComLanguage('店铺名称')}`,
      dataIndex: 'storeName',
      align: 'center',
      width: 150,
    }, {
      title: `${sldComLanguage('商品价格(¥)')}`,
      dataIndex: 'goodsPrice',
      align: 'center',
      width: 100,
    },
    {
      title: `${sldComLanguage('商品库存')}`,
      align: 'center',
      dataIndex: 'goodsStock',
      width: 100,
    }];

  cur_data = '';

  componentDidMount() {
    this.get_list({ pageSize: pageSize });
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    const { search_height } = this.state;
    if (this.refs.search_part != undefined) {
      if (this.refs.search_part.clientHeight != search_height) {
        this.setState({ search_height: this.refs.search_part.clientHeight });
      }
    }
  };

  //审核通过拒绝联动事件
  isCheck = (e) => {
    let { operateData, scrToBottom } = this.state;
    operateData = operateData.filter(item => item.name != 'remark');
    if (e.target.value == false) {
      operateData.push({
        type: 'textarea',
        label: `${sldComLanguage('审核意见')}`,
        name: 'remark',
        maxLength: 150,
        placeholder: `${sldComLanguage('请输入')}${sldComLanguage('审核意见')}`,
        rules: [{
          required: true,
          whitespace: true,
          message: `${sldComLanguage('请输入')}${sldComLanguage('审核意见')}`,
        }],
      });
      scrToBottom = true;
    } else {
      scrToBottom = false;
    }
    this.setState({
      operateData,
      scrToBottom,
    });
  };

  resetScroll = () => {
    this.setState({
      scrToBottom: false,
    });
  };

  checkVideo = (record) => {
    let { operateData, checkData } = this.state;
    let tmpData = [];
    let data = [];
    //获取绑定的商品
    this.props.dispatch({
      type: 'svideo/get_video_goods',
      payload: { videoId: record.videoId, videoType: 1 },
      callback: (res) => {
        if (res.state == 200) {
          data = res.data.list;
        }
        for (let i in checkData) {
          if (checkData[i].name == 'bind_goods' && data.length > 0) {
            tmpData.push({ ...checkData[i], data: data });
          } else if (checkData[i].name == 'videoPath') {
            let temp = { ...checkData[i], content: record[checkData[i]['name']] };
            if (record.videoType == 1) {
              //视频
              temp.type = 'view_video';
              temp.content = record.videoPath;
            } else {
              //图文
              temp.type = 'view_img_text';
              temp.content = record.imageList;
              temp.text = record.videoContent;
            }
            tmpData.push(temp);
          } else {
            if (record.state == 1) {
              if (checkData[i].name != 'stateValue' && checkData[i].name != 'remark') {
                if (checkData[i].type != 'radio_select' && checkData[i].type != 'textarea') {
                  tmpData.push({ ...checkData[i], content: record[checkData[i]['name']] });
                } else {
                  tmpData.push({ ...checkData[i] });
                }
              }
            } else {
              if (checkData[i].type != 'radio_select' && checkData[i].type != 'textarea') {
                tmpData.push({ ...checkData[i], content: record[checkData[i]['name']] });
              }
            }
          }
        }
        operateData = tmpData;
        this.cur_data = record;
        this.setState({
          modalVisible: true,
          operateData,
          title: record.state == 1 ? `${sldComLanguage('作品审核')}` : `${sldComLanguage('查看详情')}`,
          show_foot: record.state == 1 ? true : false,
        });
      },
    });

  };

  //审核操作 val:modal框的数据
  operateVideo = (val) => {
    this.setState({ submiting: true });
    const { params } = this.state;
    const { dispatch } = this.props;
    let dis_type = '';
    dis_type = 'svideo/check_video';
    val.videoId = this.cur_data.videoId;
    dispatch({
      type: dis_type,
      payload: val,
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
          this.get_list(params);
          this.props.setUpdateFlag('1');
        } else {
          failTip(res.msg);
        }
        this.setState({ submiting: false, modalVisible: false });
      },
    });
  };

  //获取数据列表
  get_list = (params) => {
    this.setState({ initLoading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'svideo/get_video_list',
      payload: { ...params, type: 'audit' },
      callback: (res) => {
        this.setState({ initLoading: false });
        if (res.state == 200) {
          if (res.data.length == 0 && this.state.params.currentPage > 1) {
            params.currentPage = params.currentPage - 1;
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

  //预览图片/关闭预览图片
  viewImg = (flag, img = '', text = '') => {
    this.setState({
      preview_img: img,
      preview_alt_con: text,
      show_preview_modal: flag,
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
    this.operateVideo(val);
  };

  //搜索事件
  search = (data) => {
    const values = { ...data };
    //时间处理
    if (values.publish_time) {
      values.startTime = values.publish_time[0] ? values.publish_time[0].format(dateFormat) + ' 00:00:00' : '';
      values.endTime = values.publish_time[1] ? values.publish_time[1].format(dateFormat) + ' 23:59:59' : '';
      delete values.publish_time;
    }
    for (let i in values) {
      if (values[i] == '') {
        delete values[i];
      }
    }
    this.setState({
      formValues: values,
    });
    this.get_list({ pageSize: pageSize, ...values });
  };

  //搜索重置事件
  seaReset = () => {
    //搜索条件置为空
    this.setState({
      formValues: {},
    });
    this.get_list({ pageSize: pageSize });
  };

  //搜索点击
  moreSearchToggle = () => {
    const { search_height } = this.state;
    if (this.refs.search_part != undefined) {
      if (this.refs.search_part.clientHeight != search_height) {
        this.setState({ search_height: this.refs.search_part.clientHeight });
      }
    }
  };

  //更新列表数据
  handleSubmit = () => {
    const { params } = this.state;
    this.get_list(params);
    this.sldHandleCancle();
  };

  render() {
    const { selectedRows, show_foot, search_data, columns, initLoading, data, modalVisible, operateData, show_preview_modal, preview_img, preview_alt_con, title, submiting, scrToBottom, search_height } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1, padding: 0 }}>
        <div className={global.tableListForm} ref={'search_part'}>
          <Search search_data={search_data} moreSearchToggle={() => this.moreSearchToggle()}
                  seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}/>
        </div>
        <Spin spinning={initLoading}>
          {/*标准表格-start*/}
          <StandardTable
            totalHeight={document.body.clientHeight - 140 - search_height - 20}
            selectedRows={selectedRows}
            data={data}
            rowKey={'videoId'}
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
        {/*查看详情对话框-start*/}
        <SldModal
          scrToBottom={scrToBottom}
          submiting={submiting}
          title={title}
          width={1000}
          modalVisible={modalVisible}
          formItemLayoutModal={formItemLayoutModal}
          content={operateData}
          sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
          sldHandleCancle={this.sldHandleCancle}
          resetScroll={() => this.resetScroll()}
          show_foot={show_foot}
        />
        {/*查看详情对话框-end*/}
        {/*图片预览-start*/}
        <SldPreviewImg img={preview_img} show_preview_modal={show_preview_modal} modal_width={900}
                       preview_alt_con={preview_alt_con} closePreviewModal={() => this.viewImg(false)}/>
        {/*图片预览-end*/}
      </div>

    );
  }
}
