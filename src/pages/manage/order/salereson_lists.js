import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import {
  sldLlineRtextAddGoodsAddMargin,
  sldComLanguage,
  list_com_page_more,
  sucTip,
  failTip,
  validatorNumbe,
  formItemLayoutModal,
  showMoreHelpTip,
  validatorSpecialString,
} from '@/utils/utils';
import global from '@/global.less';
import ReasonList from './reason_list';
import SldModal from '@/components/SldModal/SldModal';

let pageSize = list_com_page_more;
const TabPane = Tabs.TabPane;
@connect(({ reason }) => ({
  reason,
}))
@Form.create()
export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search_data: [{
        type: '',
        label: `${sldComLanguage('违规下架原因')}`,//违规下架原因
        name: 'cancelReason',
        placeholder: `${sldComLanguage('请输入违规下架原因')}`,//请输入违规下架原因
      }],
      data: {},
      loading: false,
      submiting: false,//按钮loading
      checkType: '101',
      searchData: {},
      pageData: {},
      titleName: '',
      modealItem: {},
      modaltype: '',
      modalVisible: false,
      isChenckchange: '',
      addData: [
        {
          type: 'input',
          label: `:
          ${sldComLanguage('违规下架原因')}`,//违规下架原因:
          name: 'content',
          placeholder: `${sldComLanguage('请输入违规下架原因')}`,//请输入违规下架原因
          extra: `${sldComLanguage('最多输入10个字')}`,//最多输入10个字
          initialValue: '',
          maxLength:10,
          rules: [{
            required: true,
            whitespace: true,
            message: `${sldComLanguage('请输入内容')}`,//请输入内容
          },{ validator: (rule, value, callback) => validatorSpecialString(rule, value, callback) }],
        },
        {
          type: 'inputnum',
          label: `${sldComLanguage('排序')}`,//排序
          name: 'sort',
          placeholder: `${sldComLanguage('请输入')}${sldComLanguage('排序')}`,
          extra: `${sldComLanguage('请输入0~255的数字，值越小，显示越靠前')}`,
          initialValue: '',
          rules: [{
            required: true,
            message: `${sldComLanguage('请输入')}${sldComLanguage('排序')}`,
          }, { validator: (rule, value, callback) => validatorNumbe(rule, value, callback) }],
        },
        {
          type: 'switch',
          label:  `${sldComLanguage('是否显示')}`,//显示
          name: 'isShow',
          placeholder: ``,
          initialValue: 1,
        },
      ],
    };
  }

  componentDidMount() {
    this.get_list({
      type: '101',
      pageSize: list_com_page_more,
    });
  }

  get_list = (params) => {
    const { dispatch } = this.props;
    this.setState({
      loading: true,
    });
    dispatch({
      type: 'reason/get_reason_lists',
      payload: params,
      callback: res => {
        this.setState({
          data: res.data,
          loading: false,
        });
      },
    });
  };
  onHandleTabClick = (e) => {
    const { dispatch } = this.props;
    let searchDataInfo = this.state.search_data;
    let addDataInfo = this.state.addData;
    let type = '';
    if (e == '1') {  // 违规下架
      searchDataInfo[0].label = `${sldComLanguage('违规下架')}`;
      searchDataInfo[0].placeholder = `${sldComLanguage('请输入违规下架原因')}`;
      addDataInfo[0].label = `${sldComLanguage('违规下架原因:')}`,
        addDataInfo[0].placeholder = `${sldComLanguage('请输入违规下架原因')}`,
        type = '101';
    } else if (e == '2') { // 商品审核拒绝
      searchDataInfo[0].label = `${sldComLanguage('拒绝原因')}`;
      searchDataInfo[0].placeholder = `${sldComLanguage('请输入拒绝原因')}`;
      addDataInfo[0].label = `${sldComLanguage('拒绝原因')}`,
        addDataInfo[0].placeholder = `${sldComLanguage('请输入拒绝原因')}`,
        type = '102';
    } else if (e == '3') { //入驻审核拒绝
      searchDataInfo[0].label =  `${sldComLanguage('拒绝原因')}`;
      searchDataInfo[0].placeholder = `${sldComLanguage('请输入拒绝原因')}`;
      addDataInfo[0].label = `${sldComLanguage('拒绝原因')}`,
        addDataInfo[0].placeholder = `${sldComLanguage('请输入拒绝原因')}`,
        type = '103';
    } else if (e == '4') {  // 会员取消原因
      searchDataInfo[0].label = `${sldComLanguage('取消原因')}`;
      searchDataInfo[0].placeholder = `${sldComLanguage('请输入取消原因')}`;
      addDataInfo[0].label = `${sldComLanguage('取消原因')}`,
        addDataInfo[0].placeholder = `${sldComLanguage('请输入取消原因')}`,
        type = '104';
    } else if (e == '5') { // 仅退款-未收货
      searchDataInfo[0].label = `${sldComLanguage('退款原因')}`;
      searchDataInfo[0].placeholder = `${sldComLanguage('请输入退款原因')}`;
      addDataInfo[0].label = `${sldComLanguage('申请原因:')}`,
        addDataInfo[0].placeholder = `${sldComLanguage('请输入申请原因')}`,
        type = '105';
    } else if (e == '6') { //仅退款-已收货
      searchDataInfo[0].label = `${sldComLanguage('退款原因')}`;
      searchDataInfo[0].placeholder = `${sldComLanguage('请输入退款原因')}`;
      addDataInfo[0].label = `${sldComLanguage('申请原因:')}`,
        addDataInfo[0].placeholder = `${sldComLanguage('请输入申请原因')}`,
        type = '106';
    } else if (e == '7') { //退货原因
      searchDataInfo[0].label = `${sldComLanguage('退货原因')}`;
      searchDataInfo[0].placeholder = `${sldComLanguage('请输入退货原因')}`;
      addDataInfo[0].label = `${sldComLanguage('申请原因:')}`,
        addDataInfo[0].placeholder = `${sldComLanguage('请输入申请原因')}`,
        type = '107';
    } else if (e == '8') { //商户取消原因
      searchDataInfo[0].label = `${sldComLanguage('取消原因')}`;
      searchDataInfo[0].placeholder = `${sldComLanguage('请输入取消原因')}`;
      addDataInfo[0].label = `${sldComLanguage('取消原因')}`,
        addDataInfo[0].placeholder = `${sldComLanguage('请输入取消原因')}`,
        type = '108';
    }
    this.setState({
      search_data: searchDataInfo,
      addData: addDataInfo,
      checkType: type,
      searchData: {},
      pageData: {},
    });
    this.get_list({ type: type, pageSize: pageSize });
  };
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { searchData, checkType } = this.state;
    //const {searchlist} = this.props.mapmanage.data;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
      ...searchData,
    };
    let page_data = {
      current: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.setState({
      pageData: page_data,
    });
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    params.type = checkType;

    this.get_list(params);
  };
  onHandleSearchList = (values) => {
    const { checkType } = this.state;
    this.setState({
      searchData: { content: values },
    });
    let params = {};
    params.content = values;
    params.type = checkType;
    this.get_list(params);
  };

  handleFormListReset = () => {
    const { checkType } = this.state;
    this.setState({
      searchData: {},
      pageData: {},
    });
    this.get_list({ type: checkType, pageSize: pageSize });
  };

  handleModalVisible = (flag, type, record) => {
    let title = type == 'add' ? `${sldComLanguage('新增原因')}` : `${sldComLanguage('编辑原因')}`;
    let { addData } = this.state;
    if (type == 'add') {
      for (let i in addData) {
        addData[i].initialValue = '';
      }
    } else {
      for (let i in addData) {
        addData[i].initialValue = record[addData[i].name];
      }
    }
    this.setState({
      modealItem: record,
      titleName: title,
      modaltype: type,
      modalVisible: !!flag,
      addData: addData,
    });
  };

  handleAddReason = (values) => {
    let params = {};
    const { checkType, modaltype, modealItem, pageData } = this.state;
    const { dispatch } = this.props;
    params.content = values.content;
    params.sort = values.sort;
    params.isShow = values.isShow ? 1 : 0;
    if (modaltype == 'add') {
      params.type = checkType;
      dispatch({
        type: 'reason/reason_add',
        payload: params,
        callback: res => {
          if (res.state == 200) {
            sucTip(res.msg);
            this.setState({
              titleName: '',
              modaltype: '',
              modalVisible: false,
            });
            this.get_list({ type: checkType, pageSize: pageSize });
          } else {
            failTip(res.msg);
          }
        },
      });
    } else {
      params.reasonId = modealItem.reasonId;
      dispatch({
        type: 'reason/reason_update',
        payload: params,
        callback: res => {
          if (res.state == 200) {
            sucTip(res.msg);
            this.setState({
              modealItem: {},
              titleName: '',
              modaltype: '',
              modalVisible: false,
            });
            this.get_list({ type: checkType, pageSize: pageSize, ...pageData });
          } else {
            failTip(res.msg);
          }
        },
      });
    }
  };

  handleaddModalVisible = () => {
    this.setState({
      modalVisible: false,
      modealItem: {},
      titleName: {},
    });
  };

  delReason = (reasonId) => {
    const { dispatch } = this.props;
    const { checkType } = this.state;
    dispatch({
      type: 'reason/reason_del',
      payload: { reasonId: reasonId },
      callback: res => {
        if (res.state == 200) {
          sucTip(res.msg);
          this.get_list({ type: checkType, pageSize: pageSize });
        } else {
          failTip(res.msg);
        }
      },
    });
  };
  handleshowReason = (params,type) => {
    const { dispatch } = this.props;
    const { checkType } = this.state;
    let dis_type = '';
    if(type == 'switch'){
      dis_type = 'reason/reason_switch';
    }else{
      dis_type = 'reason/reason_update';
    }
    dispatch({
      type: dis_type,
      payload: params,
      callback: res => {
        if (res.state == 200) {
          sucTip(res.msg);
          this.get_list({ type: checkType, pageSize: pageSize });
        } else {
          failTip(res.msg);
        }
      },
    });
  };

  render() {
    const { loading, data, search_data, modalVisible, titleName, addData, submiting } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1 }}>
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('订单原因管理')}`, 0, 0, 10)}{/* 订单原因管理 */}
        <Tabs type="card" defaultActiveKey="1" animated={false} onTabClick={this.onHandleTabClick}>
          <TabPane tab={`${sldComLanguage('违规下架')}`} key="1">{/* 违规下架 */}
            {showMoreHelpTip(``, [`${sldComLanguage('用于平台处理商品违规下架时选择下架理由，最多20条。')}`], 8, true)}{/*操作提示*/}
            <ReasonList
              loading={loading}
              data={data}
              search_data={search_data}
              onChange={this.handleStandardTableChange}
              onHandleSearchList={this.onHandleSearchList}
              handleFormListReset={this.handleFormListReset}
              onHandleModal={this.handleModalVisible}
              onHandleDel={this.delReason}
              onHandleshowReason={this.handleshowReason}
            />
          </TabPane>
          <TabPane tab={`${sldComLanguage('商品审核拒绝')}`} key="2">{/* 商品审核拒绝 */}
            {showMoreHelpTip(``, [`${sldComLanguage('用于平台审核商品时选择拒绝理由，最多20条。')}`], 8, true)}{/*操作提示*/}
            <ReasonList
              loading={loading}
              data={data}
              search_data={search_data}
              onChange={this.handleStandardTableChange}
              onHandleSearchList={this.onHandleSearchList}
              handleFormListReset={this.handleFormListReset}
              onHandleModal={this.handleModalVisible}
              onHandleDel={this.delReason}
              onHandleshowReason={this.handleshowReason}
            />
          </TabPane>
          <TabPane tab={`${sldComLanguage('入驻审核拒绝')}`} key="3">{/* 入驻审核拒绝 */}
            {showMoreHelpTip(``, [`${sldComLanguage('用于平台审核入驻店铺时选择拒绝理由，最多20条。')}`], 8, true)}{/*操作提示*/}
            <ReasonList
              loading={loading}
              data={data}
              search_data={search_data}
              onChange={this.handleStandardTableChange}
              onHandleSearchList={this.onHandleSearchList}
              handleFormListReset={this.handleFormListReset}
              onHandleModal={this.handleModalVisible}
              onHandleDel={this.delReason}
              onHandleshowReason={this.handleshowReason}
            />
          </TabPane>
          <TabPane tab={`${sldComLanguage('会员取消原因')}`} key="4">{/* 会员取消原因 */}
            {showMoreHelpTip(``, [`${sldComLanguage('会员待付款状态下取消订单可选择的原因，最多20条。')}`], 8, true)}{/*操作提示*/}
            <ReasonList
              loading={loading}
              data={data}
              search_data={search_data}
              onChange={this.handleStandardTableChange}
              onHandleSearchList={this.onHandleSearchList}
              handleFormListReset={this.handleFormListReset}
              onHandleModal={this.handleModalVisible}
              onHandleDel={this.delReason}
              onHandleshowReason={this.handleshowReason}
            />
          </TabPane>
          <TabPane tab={`${sldComLanguage('仅退款-未收货')}`} key="5">{/*仅退款-未收货 */}
            {showMoreHelpTip(``, [`${sldComLanguage('会员在未收货时申请仅退款可选择的原因，最多20条。')}`], 8, true)}{/*操作提示*/}
            <ReasonList
              loading={loading}
              data={data}
              search_data={search_data}
              onChange={this.handleStandardTableChange}
              onHandleSearchList={this.onHandleSearchList}
              handleFormListReset={this.handleFormListReset}
              onHandleModal={this.handleModalVisible}
              onHandleDel={this.delReason}
              onHandleshowReason={this.handleshowReason}
            />
          </TabPane>
          <TabPane tab={`${sldComLanguage('仅退款-已收货')}`} key="6">{/*仅退款-已收货*/}
            {showMoreHelpTip(``, [`${sldComLanguage('会员在已收货时申请仅退款可选择的原因，最多20条。')}`], 8, true)}{/*操作提示*/}
            <ReasonList
              loading={loading}
              data={data}
              search_data={search_data}
              onChange={this.handleStandardTableChange}
              onHandleSearchList={this.onHandleSearchList}
              handleFormListReset={this.handleFormListReset}
              onHandleModal={this.handleModalVisible}
              onHandleDel={this.delReason}
              onHandleshowReason={this.handleshowReason}
            />
          </TabPane>
          <TabPane tab={`${sldComLanguage('退款退货原因')}`} key="7">{/*退货原因 */}
            {showMoreHelpTip(``, [`${sldComLanguage('会员在申请退货退款时可选择的原因，最多20条。')}`], 8, true)}{/*操作提示*/}
            <ReasonList
              loading={loading}
              data={data}
              search_data={search_data}
              onChange={this.handleStandardTableChange}
              onHandleSearchList={this.onHandleSearchList}
              handleFormListReset={this.handleFormListReset}
              onHandleModal={this.handleModalVisible}
              onHandleDel={this.delReason}
              onHandleshowReason={this.handleshowReason}
            />
          </TabPane>
          <TabPane tab={`${sldComLanguage('商户取消订单')}`} key="8">{/*平台取消原因 */}
            {showMoreHelpTip(``, [`${sldComLanguage('商户取消会员订单时可选择的原因，最多20条。')}`], 8, true)}{/*操作提示*/}
            <ReasonList
              loading={loading}
              data={data}
              search_data={search_data}
              onChange={this.handleStandardTableChange}
              onHandleSearchList={this.onHandleSearchList}
              handleFormListReset={this.handleFormListReset}
              onHandleModal={this.handleModalVisible}
              onHandleDel={this.delReason}
              onHandleshowReason={this.handleshowReason}
            />
          </TabPane>
        </Tabs>
        {/* 新增或编辑弹框 */}
        <SldModal
          width={500}
          title={titleName}
          sldSeleSingleRow={true}
          submiting={submiting}
          modalVisible={modalVisible}
          sldHandleConfirm={(val) => this.handleAddReason(val)}
          sldHandleCancle={this.handleaddModalVisible}
          formItemLayoutModal={formItemLayoutModal}
          content={addData}
        />
      </div>

    );
  }
}
