/*
* 作品列表*/
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import Link from 'umi/link';
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
  getSldCopyData,
  sldPopConfirmDiy,
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
export default class VideoLists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search_height:0,
      preview_img: '',
      preview_alt_con: '',
      show_preview_modal: false,
      modalVisible: false,
      initLoading: false,
      submiting: false,
      show_foot: true,
      data: {},//列表数据
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      title: `${sldComLanguage('禁止发布')}`,
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      operateData: [],//modal弹框用到的数据
      forbidData: [{
        type: 'textarea',
        label: `${sldComLanguage('禁止理由')}`,
        name: 'remark',
        placeholder: `${sldComLanguage('请输入禁止理由，最多输入50字')}`,
        initialValue: '',
        maxLength: 50,
        rules: [{
          required: true,
          message: `${sldComLanguage('请输入禁止理由')}`,
        }],
      }],//禁止理由
      previewData: [{
        type: 'view_video',
        label: ``,//
        name: 'view_video',
        initialValue: '',
        width: 600,
        height: 400,
      }],//预览作品
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
        label: `${sldComLanguage('作品状态')}`,
        name: 'state',
        initialValue: '',
        placeholder: `${sldComLanguage('请选择作品状态')}`,
        sel_data: [
          { key: '', name: `${sldComLanguage('全部')}` },
          { key: '2', name: `${sldComLanguage('正常')}` },
          { key: '4', name: `${sldComLanguage('禁止')}` },
        ],
      },{
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
      expandData: [{
        key: `${sldComLanguage('评论数：')}`,
        val: 'commentNum',
      }, {
        key: `${sldComLanguage('商品数：')}`,
        val: 'goodsNum',
      }, {
        key: `${sldComLanguage('播放数：')}`,
        val: 'clickNum',
      }, {
        key: `${sldComLanguage('点赞数：')}`,
        val: 'likeNum',
      }, {
        key: `${sldComLanguage('作品简介：')}`,
        val: 'introduction',
      }],//额外展开的信息
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
            return getSldComImg(text, 200, 200, 60, 60);//图片预览
          },
        },
        {
          title: `${sldComLanguage('作品名称')}`,
          dataIndex: 'videoName',
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
          title: `${sldComLanguage('作品状态')}`,
          align: 'center',
          dataIndex: 'stateValue',
          width: 100,
        },
        {
          title: `${sldComLanguage('禁止理由')}`,
          dataIndex: 'remark',
          align: 'center',
          width: 150,
          render: (text) => text ? text : '--',
        },
        {
          title: `${sldComLanguage('操作')}`,
          align: 'center',
          width: 80,
          render: (text, record) => (
            <div style={{whiteSpace:'nowrap'}}>
              {
                sldtbaleOpeBtnText(`${sldComLanguage('预览')}`, () => this.preview(record))
              }
              <span className={global.splitLine}></span>
              <Link to={{
                pathname: '/marketing_svideo/video_manage_bind_goods',
                query: {
                  id: record.videoId,
                  videoName: record.videoName,
                },
              }}>
                {
                  sldtbaleOpeBtnText(`${sldComLanguage('查看商品')}`, null)
                }
              </Link>
              <span className={global.splitLine}></span>
              {record.state == 2 &&
              sldtbaleOpeBtnText(`${sldComLanguage('禁止显示')}`, () => this.forbidShow(record))
              }
              {record.state == 4 &&
              <Fragment>
                {sldPopConfirmDiy('leftBottom', `${sldComLanguage('确定解除禁止？')}`, () => this.operateVideo(record.videoId, 'show'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`, sldtbaleOpeBtnText(`${sldComLanguage('解除禁止')}`, () => null))}
                <span className={global.splitLine}></span>
              </Fragment>
              }
              {record.state == 4 &&
              sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除？')}`, () => this.operateVideo(record.videoId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`, sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))
              }
            </div>
          ),
        },
      ],
    };
  }

  cur_data = '';

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

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.updateFlag == '1') {
      this.get_list({ pageSize: pageSize });
    }
  }

  forbidShow = (record) => {
    let { operateData, forbidData } = this.state;
    operateData = getSldCopyData(forbidData);
    this.cur_data = record;
    this.setState({
      modalVisible: true,
      operateData,
      show_foot: true,
      title: `${sldComLanguage('禁止显示')}`,
    });
  };

  preview = (record) => {
    let { operateData, previewData } = this.state;
    operateData = JSON.parse(JSON.stringify(previewData));
    let temp = operateData.filter(item=>item.name == 'view_video')[0];
    if (record.videoType == 1) {
      //视频
      temp.initialValue = record.videoPath;
    } else {
      //图文
      temp.type = 'view_img_text';
      temp.content = record.imageList;
      temp.text = record.videoContent;
    }
    this.setState({
      modalVisible: true,
      operateData,
      show_foot: false,
      title: `${sldComLanguage('预览')}`,
    });
  };

  //作品操作  id: 作品id ，type ：show 解除禁止 del删除
  operateVideo = (id, type) => {
    this.setState({ submiting: true });
    const { params } = this.state;
    const { dispatch } = this.props;
    let dis_type = '';
    let param_data = {};
    dis_type = 'svideo/update_video_state';
    if (type == 'del') {
      dis_type = 'svideo/del_video';
      param_data.videoId = id;
    } else if (type == 'show') {
      param_data.isShow = true;
      param_data.videoId = id;
    } else {
      param_data = { ...id };
      param_data.isShow = false;
      param_data.videoId = this.cur_data.videoId;
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
        this.setState({ submiting: false, modalVisible: false });
      },
    });
  };

  //获取数据列表(获取所有的作品，未审核通过的不在内)
  get_list = (params) => {
    this.setState({ initLoading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'svideo/get_video_list',
      payload: { ...params },
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
          this.props.setUpdateFlag('');
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
    this.operateVideo(val, 'forbidden');
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
    const {search_height} = this.state;
    if(this.refs.search_part!=undefined){
      if(this.refs.search_part.clientHeight != search_height){
        this.setState({search_height:this.refs.search_part.clientHeight})
      }
    }
  }

  //更新列表数据
  handleSubmit = () => {
    const { params } = this.state;
    this.get_list(params);
    this.sldHandleCancle();
  };

  render() {
    const { selectedRows, search_data, columns, initLoading, data, modalVisible, operateData, show_preview_modal, preview_img, preview_alt_con, expandData, title, submiting, show_foot,search_height } = this.state;
    if (data.video_virtual_click_num_switch == 0) {
      for (let i = 0; i < expandData.length; i++) {
        if (expandData[i].val == 'virtual_click_num') {
          expandData.splice(i, 1);
        }
      }
    }
    if (data.video_virtual_like_num_switch == 0) {
      for (let i = 0; i < expandData.length; i++) {
        if (expandData[i].val == 'virtual_like_num') {
          expandData.splice(i, 1);
        }
      }
    }
    return (
      <div className={global.common_page} style={{ flex: 1,padding:0 }}>
        <div className={global.tableListForm} ref={'search_part'}>
          <Search search_data={search_data} moreSearchToggle={() => this.moreSearchToggle()}
                  seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}/>
        </div>
        <Spin spinning={initLoading}>
          {/*标准表格-start*/}
          <StandardTable
            totalHeight={document.body.clientHeight - 140-search_height-20}
            expandData={expandData}
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
          submiting={submiting}
          title={title}
          width={600}
          modalVisible={modalVisible}
          formItemLayoutModal={formItemLayoutModal}
          content={operateData}
          sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
          sldHandleCancle={this.sldHandleCancle}
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
