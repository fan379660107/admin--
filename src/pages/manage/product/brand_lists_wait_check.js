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
  getTableNum,
  sldComLanguage,
  sldtbaleOpeBtnText,
  getSldComImg,
  sldPopConfirmDiy,
  sldIconBtn,
  sldPopConfirm,
  dateFormat,
  getSldComShowMoreTtex,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';
import SldPreviewImg from '@/components/SldPreviewImg/SldPreviewImg';
import Search from '@/components/Search/Search';

let pageSize = list_com_page_size_10;
@connect(({ product }) => ({
  product,
}))
@Form.create()
export default class BrandListsWaitCheck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initLoading: false,
      scrToBottom: false,//modal 是否滚动到底部属性
      submiting: false,
      show_preview_modal: false,//预览图片modal框是否展示
      preview_img: '',//预览图片
      preview_alt_con: '',//预览图片内容
      modalTableVisible: false,//input 后缀弹出框是否显示
      data: {},//列表数据
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      title: '',
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      upload_img_info: {},//上传的图片信息
      addData: [
        {
          type: 'radio_select',
          label: `${sldComLanguage('审核结果')}`,
          name: 'state',
          extra: `${sldComLanguage('请选择')}${sldComLanguage('审核结果')}`,
          data: [{
            key: 1,
            value: `${sldComLanguage('通过')}`,//通过
          }, {
            key: 0,
            value: `${sldComLanguage('拒绝')}`,//拒绝
          }],
          initialValue: 1,
          callback: this.isCheck,
        },
      ],//modal框的数据
      search_data: [{
        type: 'input',
        label: `${sldComLanguage('品牌名称')}`,//品牌名称
        name: 'brandName',
        placeholder: `${sldComLanguage('请输入品牌名称')}`,//请输入品牌名称
      },{
        type: 'input',
        label: `${sldComLanguage('店铺名称')}`,//店铺名称
        name: 'storeName',
        placeholder: `${sldComLanguage('请输入店铺名称')}`,//请输入店铺名称
      },
      //  {
      //   type: 'rangepicker',
      //   label: `发布时间`,//发布时间
      //   name: 'search_create_time',
      //   placeholder1: `${sldComLanguage('开始时间')}`,//开始时间
      //   placeholder2: `${sldComLanguage('结束时间')}`,//结束时间
      // },
      {
        type: 'select',
        label: `${sldComLanguage('审核状态')}`,
        name: 'state',
        placeholder: `${sldComLanguage('请选择审核状态')}`,
        sel_data: [
          { key: '', name: `${sldComLanguage('全部')}` },
          { key: '2', name:  `${sldComLanguage('待审核')}`},
          { key: '3', name:  `${sldComLanguage('审核拒绝')}`},
        ],
      }],
      formValues: {},//搜索条件
      columns: [
        {
          title: ' ',
          dataIndex: 'brandId',
          align: 'center',
          width: 30,
          render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
        },
        {
          title: `${sldComLanguage('店铺名称')}`,//店铺名称
          dataIndex: 'storeName',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('品牌名称')}`,//品牌名称
          dataIndex: 'brandName',
          align: 'center',
          width: 150,
        },

        {
          title: `${sldComLanguage('品牌LOGO')}`,
          dataIndex: 'imageUrl',
          align: 'center',
          width: 100,
          render: (text) => {
            return getSldComImg(text,160,60,85,30);//图片预览
          },
        },
        {
          title: `${sldComLanguage('品牌分类')}`,
          dataIndex: 'goodsCategoryPath',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('品牌描述')}`,
          dataIndex: 'brandDesc',
          align: 'center',
          width: 100,
          render: (text) => {
            return getSldComShowMoreTtex(text,50,200);
          },
        },
        {
          title: `${sldComLanguage('审核状态')}`,
          dataIndex: 'stateValue',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('审核理由')}`,
          dataIndex: 'failReason',
          align: 'center',
          width: 100,
          render: (text) => {
            return text?getSldComShowMoreTtex(text,50,200):'--';
          },
        },
        {
          title: `${sldComLanguage('操作')}`,//操作
          align: 'center',
          width: 80,
          render: (text, record) => {
            return <Fragment>
              {record.state == 2 &&
              <Fragment>
                {sldtbaleOpeBtnText(`${sldComLanguage('审核')}`, () => this.checkBrand(record))}
                <span className={global.splitLine}></span>
              </Fragment>
              }
              {/*删除后不可恢复，是否确定删除？*/}
              {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.operateBrand(record.brandId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
            </Fragment>
          },
        },
      ],
    };
  }

  cur_edit_id = '';//当前操作数据id
  formValues = {};//搜索条件
  componentDidMount() {
    this.get_list({ pageSize: pageSize });
  }

  //审核通过拒绝联动事件
  isCheck = (e) => {
    let { addData, scrToBottom } = this.state;
    addData = addData.filter(item => item.name != 'auditReason');
    if (!e.target.value) {
      addData.push({
        type: 'textarea',
        label: `${sldComLanguage('审核意见')}`,//审核意见
        name: 'auditReason',
        placeholder: `${sldComLanguage('请输入审核意见')}，${sldComLanguage('最多100字')}`,
        initialValue: '',
        maxLength:100,
        rules: [{
          required: true,
          whitespace: true,
          message: `${sldComLanguage('请输入审核意见')}`,
        }]
      });
      scrToBottom = true;
    } else {
      scrToBottom = false;
    }
    this.setState({
      addData,
      scrToBottom,
    });
  };

  resetScroll = () => {
    this.setState({
      scrToBottom: false,
    })
  }

  //审核品牌
  checkBrand = (val) => {
    let { addData } = this.state;
    for (let i in addData) {
      if (addData[i].name != 'state') {
        addData[i].initialValue = '';
      }else{
        addData[i].initialValue = 1;
      }
    }
    addData = addData.filter(item=>item.name == 'state');
    this.cur_edit_id = val.brandId;//当前操作数据id
    this.setState({ type: 'edit', title: `${sldComLanguage('审核')}${sldComLanguage('品牌')}`, addData: addData, modalVisible: true });//审核品牌
  };


  //获取数据列表
  get_list = (params) => {
    this.setState({ initLoading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'product/get_check_brand_lists',
      payload: { ...params},
      callback: (res) => {
        this.setState({ initLoading: false });
        if (res.state == 200) {
          this.setState({ data: res.data });
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


  //表格拖动
  resizeTable = (index, size, type, data) => {
    let datas = dragSldTableColumn(index, size, data);
    this.setState({ [type]: datas });
  };

  sldHandleCancle = () => {
    this.setState({ modalVisible: false });
  };

  //品牌管理操作，check 审核，del 删除
  operateBrand = (id, type) => {
    const { dispatch } = this.props;
    let dis_type = '';
    let params = { brandIds: id };
    if (type == 'check') {
      dis_type = 'product/check_brand';
      params = id;
    } else if (type == 'del') {
      dis_type = 'product/del_brand';
      params = {brandIds:id}
    }
    this.setState({ submiting: true });
    dispatch({
      type: dis_type,
      payload: params,
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
          this.get_list(this.state.params);
          this.setState({
            modalVisible: false,
            selectedRows: [],
            selectedRowKeys: [],
          });
          this.props.setUpdateFlag('brand_list');
        } else {
          failTip(res.msg);
        }
        this.setState({ submiting: false });
      },
    });
  };

  sldHandleConfirm = (val) => {
    val.brandIds = this.cur_edit_id;
    this.operateBrand(val,'check');
  };

  //预览图片/关闭预览图片
  viewImg = (flag, img = '', text = '') => {
    this.setState({
      preview_img: img,
      preview_alt_con: text,
      show_preview_modal: flag,
    });
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

  render() {
    const { selectedRows, columns, initLoading, data, submiting, addData, modalVisible, title, preview_img, preview_alt_con, show_preview_modal, selectedRowKeys,search_data } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1 }}>
        <div className={global.tableListForm} style={{marginTop:0}}>
          <Search search_data={search_data}
                  seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}/>
        </div>
        <div className={global.operate_bg} style={{ paddingLeft: 8 }}>
          {selectedRowKeys.length == 0 ? sldIconBtn(() => {
            failTip(`${sldComLanguage('请先选中数据')}`);//请先选中数据
            //确认删除选中的品牌吗？
          }, `${sldComLanguage('批量审核')}`, 0, 7, 15, 15, 3, 'piliangxiajia', '#FA6F1E') : sldIconBtn(() => this.checkBrand({brandId:selectedRowKeys.join(',')}), `${sldComLanguage('批量审核')}`, 0, 7)}

          {selectedRowKeys.length == 0 ? sldIconBtn(() => {
            failTip(`${sldComLanguage('请先选中数据')}`);//请先选中数据
            //确认删除选中的品牌吗？
          }, `${sldComLanguage('批量删除')}`, 0, 7, 15, 15, 3, 'piliangxiajia', '#FA6F1E') : sldPopConfirm('leftBottom', `${sldComLanguage('确认删除选中的品牌吗？')}`, () => this.operateBrand(selectedRowKeys.join(','), 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`, sldIconBtn(null,  `${sldComLanguage('批量删除')}`, 0, 7, 15, 15, 3, 'piliangxiajia', '#FA6F1E'), 0, 0, '#FA6F1E')}

        </div>
        <Spin spinning={initLoading}>
          {/*标准表格-start*/}
          <StandardTable
            totalHeight={document.body.clientHeight - 310}
            selectedRows={selectedRows}
            data={data}
            rowKey={'brandId'}
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
        {/*新增/编辑对话框-start*/}
        <SldModal
          title={title}
          submiting={submiting}
          width={500}
          modalVisible={modalVisible}
          sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
          sldHandleCancle={this.sldHandleCancle}
          formItemLayoutModal={formItemLayoutModal}
          content={addData}
          resetScroll={() => this.resetScroll()}
        />
        {/*新增/编辑对话框-end*/}

        {/*图片预览-start*/}
        <SldPreviewImg img={preview_img} show_preview_modal={show_preview_modal} modal_width={300}
                       preview_alt_con={preview_alt_con} closePreviewModal={() => this.viewImg(false)} />
        {/*图片预览-end*/}

      </div>

    );
  }
}
