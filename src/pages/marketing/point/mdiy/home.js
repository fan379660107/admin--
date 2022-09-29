import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Popover, Spin, Switch } from 'antd';
import {
  sldIconBtn,
  failTip,
  sucTip,
  dragSldTableColumn,
  sldHandlePaginationData,
  list_com_page_size_10,
  sldLlineRtextAddGoodsAddMargin,
  formItemLayoutModal,
  sldComLanguage,
  sldtbaleOpeBtnText,
  sldPopConfirmDiy,
  getSldCopyData,
  sldSearchValClear,
} from '@/utils/utils';
import Link from 'umi/link';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';
import QRCode from 'qrcode.react';
import SldDiyMoreImgModal from '@/components/point/SldDiyMoreImgModal/SldDiyMoreImgModal';

let comm_cur_page = 1;//当前页数
let pageSize = list_com_page_size_10;
@connect(({ commonMDiy }) => ({
  commonMDiy,
}))
@Form.create()
export default class PointHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      submiting: false,//按钮loading
      loading: false,//按钮loading
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      modalVisible: false,
      title: '',
      search_con: '',
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      curData: {},//编辑的数据
      addData: [{
        type: 'input',
        label: `${sldComLanguage('页面名称')}`,
        name: 'name',
        placeholder: `${sldComLanguage('请输入页面名称')}`,
        initialValue: '',
        maxLength:8,
        rules: [{
          required: true,
          whitespace: true,
          message: `${sldComLanguage('请输入页面名称')}`,
        }],
      }],//modal框的数据
      columns: [
        {
          title: ' ',
          dataIndex: 'decoId',
          align: 'center',
          width: 55,
          render: (text, record, index) => {
            return (comm_cur_page - 1) * pageSize + index + 1;
          },
        },
        {
          title: `${sldComLanguage('页面名称')}`,
          align: 'center',
          dataIndex: 'name',
          width: 100,
        },
        {
          title: `${sldComLanguage('创建时间')}`,
          dataIndex: 'createTime',
          align: 'center',
          width: 150,
        }, {
          title: `${sldComLanguage('更新时间')}`,
          dataIndex: 'updateTime',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('Android')}`,
          width: 80,
          align: 'center',
          dataIndex: 'android',
          render: (text, record) => {
            return <Switch checked={text == 1 ? true : false}
                           onChange={(val) => this.handleSetEnable(val, record.decoId, 'android')}/>;
          },
        },
        {
          title: `${sldComLanguage('IOS')}`,
          dataIndex: 'ios',
          align: 'center',
          width: 80,
          render: (text, record) => {
            return <Switch checked={text == 1 ? true : false}
                           onChange={(val) => this.handleSetEnable(val, record.decoId, 'ios')}/>;
          },
        }, {
          title: `${sldComLanguage('微商城')}`,//H5
          dataIndex: 'h5',
          align: 'center',
          width: 80,
          render: (text, record) => {
            return <Switch checked={text == 1 ? true : false}
                           onChange={(val) => this.handleSetEnable(val, record.decoId, 'h5')}/>;
          },
        }, {
          title: `${sldComLanguage('微信小程序')}`,//是否推荐
          dataIndex: 'weixinXcx',
          align: 'center',
          width: 80,
          render: (text, record) => {
            return <Switch checked={text == 1 ? true : false}
                           onChange={(val) => this.handleSetEnable(val, record.decoId, 'weixinXcx')}/>;
          },
        },
        {
          title: `${sldComLanguage('操作')}`,
          align: 'center',
          width: 100,
          render: (text, record) => (
            <Fragment>
              <Link to={{
                pathname: '/marketing_point/diy_home_to_edit',
                query: {
                  id: record.decoId,
                  type: 'integral',
                  source: '/marketing_point/diy_home',
                },
              }}>
                {sldtbaleOpeBtnText(`${sldComLanguage('装修')}`, () => null)}
              </Link>
              <span className={global.splitLine}></span>
              {sldtbaleOpeBtnText(`${sldComLanguage('编辑')}`, () => this.editMDiyPage(record))}
              <span className={global.splitLine}></span>
              {sldtbaleOpeBtnText(`${sldComLanguage('复制')}`, () => this.operateMDiyPage(record.decoId, 'copy'))}
              <span className={global.splitLine}></span>
              {sldtbaleOpeBtnText(`${sldComLanguage('开屏图')}`, () => this.addScreenAdv(record))}
              <span className={global.splitLine}></span>
              {sldPopConfirmDiy('leftBottom', `${sldComLanguage(`${sldComLanguage('删除后不可恢复，是否确定删除')}`)}`, () => this.operateMDiyPage(record.decoId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))//删除后不可恢复，是否确定删除？
              }
              {/*扫描查看效果*/}
              {/* <span className={global.splitLine}></span>
              <Popover placement="leftBottom" content={<QRCode value={record.previewUrl}/>}
                       title={'扫描查看效果'}>
                {
                  sldtbaleOpeBtnText('预览', () => null)
                }
              </Popover> */}
            </Fragment>
          ),
        },
      ],
      screen_data: [],//开屏图数据
      origion_data: {
        width: 580,
        height: 776,
        admin_show_width: 290,
        admin_show_height: 388,
        data: [{
          imgPath: '',
          imgUrl: '',
          info: {},
          link_type: '',
          link_value: '',
          title: '',
          width:0,
          height:0,
        }],
      },//多图选择器的数据
      modalTitle: '',
    };
  }

  modal_tip = [
    `${sldComLanguage('请严格根据提示要求上传规定尺寸的图片,图片不可以超过1M,否则影响页面加载效果')}`,
    `${sldComLanguage('编辑项中的“操作”指点击该内容所产生的链接地址，可通过下拉选项选择不同的方式')}`,
  ];

  componentDidMount() {
    this.get_list({ pageSize: pageSize });
  }

  componentWillUnmount() {

  }

  //获取数据列表
  get_list = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonMDiy/get_diy_page_lists',
      payload: { ...params, type: 'integral' },
      callback: (res) => {
        this.setState({ loading: false });
        if (res.state == 200) {
          if (res.data.list.length == 0 && this.state.params.current > 1) {
            params.current = params.current - 1;
            this.get_list(params);
          } else {
            this.setState({
              data: res.data,
              isReset: false,
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

  //开关操作
  handleSetEnable = (val, id, os) => {
    let params = {};
    params.decoId = id;
    params.isUse = val ? 1 : 0;
    params.os = os;
    this.operateMDiyPage(params, 'enable');
  };

  //装修页面操作，edit 编辑，del 删除，enable 启用/禁用  copy 复制
  operateMDiyPage = (id, type) => {
    const { dispatch } = this.props;
    let dis_type = '';
    let params = { decoId: id };
    if (type == 'edit') {
      dis_type = 'commonMDiy/edit_m_diy_page';
      params = id;
    } else if (type == 'del') {
      dis_type = 'commonMDiy/del_m_diy_page';
    } else if (type == 'copy') {
      dis_type = 'commonMDiy/copy_m_diy_page';
    } else if (type == 'enable') {
      dis_type = 'commonMDiy/set_m_diy_page';
      params = id;
    }
    dispatch({
      type: dis_type,
      payload: params,
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
          this.get_list(this.state.params);
          this.setState({
            modalVisible: false,
          });
        } else {
          failTip(res.msg);
        }
        this.setState({ submiting: false });
      },
    });
  };

  sldHandleConfirm = (val) => {
    this.setState({ submiting: true });
    const { curData, type } = this.state;
    const { dispatch } = this.props;
    val.type = 'integral';
    if (type == 'edit') {
      val.decoId = curData.decoId;
      this.operateMDiyPage(val, 'edit');
    } else {
      val.data = '';
      dispatch({
        type: 'commonMDiy/add_m_diy_page',
        payload: val,
        callback: (res) => {
          if (res.state == 200) {
            sucTip(res.msg);
            this.get_list({ pageSize: pageSize });
            this.setState({
              modalVisible: false,
              params: { pageSize: pageSize },
            });
          } else {
            failTip(res.msg);
          }
          this.setState({ submiting: false });
        },
      });
    }
  };

  sldHandleCancle = () => {
    this.setState({ modalVisible: false, modalVisibleAdv: false });
  };

  //表格拖动
  resizeTable = (index, size, type, data) => {
    let datas = dragSldTableColumn(index, size, data);
    this.setState({ [type]: datas });
  };

  //新增功能
  addMDiyPage = () => {
    let { addData } = this.state;
    for (let i in addData) {
      addData[i].initialValue = '';
    }
    this.setState({
      modalVisible: true,
      type: 'add',
      title: `${sldComLanguage('添加首页装修')}`,
      addData: addData,
    });//添加首页装修
  };
  //编辑功能
  editMDiyPage = (record) => {
    let { addData } = this.state;
    for (let i in addData) {
      addData[i].initialValue = record[addData[i].name];
    }
    this.setState({
      modalVisible: true,
      type: 'edit',
      title: `${sldComLanguage('编辑首页装修')}`,
      addData: addData,
      curData: record,
    });//添加首页装修
  };

  //设置开屏图
  addScreenAdv = (val) => {
    let { modalTitle, screen_data, origion_data } = this.state;
    screen_data = { ...origion_data, data: getSldCopyData(origion_data.data) };
    if (val.showTip != null && val.showTip) {
      modalTitle = `${sldComLanguage('编辑开屏图')}`;
      let adv_data = JSON.parse(val.showTip.replace(/&quot;/g,"\""));
      for (let i in screen_data.data) {
        if (adv_data[i].imgUrl) {
          screen_data.data[i] = adv_data[i];
        }
      }
    } else {
      modalTitle = `${sldComLanguage('设置开屏图')}`;
    }
    this.setState({
      modalVisibleAdv: true,
      modalTitle,
      screen_data: screen_data,
      curData: val,
    });
  };

  //开屏图确认事件
  sldHandleConfirmScreenAdv = (val) => {
    let { curData } = this.state;
    let param = {};
    param.decoId = curData.decoId;
    param.type = 'integral';
    param.showTip = JSON.stringify(val);
    this.operateMDiyPage(param, 'edit');
  };

  //搜索
  sldSearch = (val) => {
    this.setState({
      formValues: { name: val },
      params: { pageSize: pageSize }
    });
    this.get_list({ pageSize: pageSize, name: val });
  };

  //搜索框内容的变化
  sldSearChange = (val) => {
    this.setState({
      search_con: val.target.value,
    });
  };

  //清空搜索内容
  sldSearClear = () => {
    this.setState({
      search_con: '',
    });
    this.sldSearch('');
  };

  render() {
    const { selectedRows, modalVisible, title, addData, columns, submiting, data, loading, search_con, modalTitle, modalVisibleAdv, screen_data } = this.state;
    return (
      <div className={global.common_page}>
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('首页装修')}`, 0, 0, 10)}
        <Spin spinning={loading}>
          { /*公共功能条-start*/}
          <div className={global.operate_bg}>
            {sldIconBtn(() => this.addMDiyPage(), `${sldComLanguage('新建页面')}`, 7, 7)}{/*新增*/}
            {sldSearchValClear(`${sldComLanguage('请输入页面名称')}`, 291, this.sldSearch, `${sldComLanguage('搜索')}`, search_con, this.sldSearChange, this.sldSearClear, 65)}
          </div>
          { /*公共功能条-end*/}
          { /*标准表格-start*/}
          <StandardTable
            totalHeight={document.body.clientHeight - 150 - 15}
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
          { /*标准表格-end*/}
          { /*新增/编辑对话框-start*/}
          <SldModal
            title={title}
            submiting={submiting}
            modalVisible={modalVisible}
            sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
            sldHandleCancle={this.sldHandleCancle}
            formItemLayoutModal={formItemLayoutModal}
            content={addData}
          />
          { /*新增/编辑对话框-end*/}
        </Spin>
        <SldDiyMoreImgModal
          width={1000}
          title={modalTitle}
          sldSeleSingleRow={true}
          submiting={submiting}
          modalVisible={modalVisibleAdv}
          sldHandleConfirm={(val) => this.sldHandleConfirmScreenAdv(val)}
          sldHandleCancle={this.sldHandleCancle}
          content={screen_data}
          modal_tip={this.modal_tip}
          client={'mobile'}
        />
      </div>
    );
  }
}
