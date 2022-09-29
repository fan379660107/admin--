/*
* 入驻店铺管理——入驻成功店铺详细信息
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Table, Tooltip } from 'antd';
import {
  failTip,
  getSldHorLine,
  sldLlineRtextAddGoods,
  sldIconBtnBg,
  sldCommonTitle,
  sldComLanguage,
  getSldEmptyH,
  sldSvgIcon,
} from '@/utils/utils';
import global from '@/global.less';
import router from 'umi/router';
import { Scrollbars } from 'react-custom-scrollbars';
import SldTableRowTwo from '@/components/SldTableRowTwo';

let sthis = '';
@connect(({ store, global }) => ({
  store, global,
}))
@Form.create()
export default class ApplyStoreDetail extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    const {
      form: { getFieldDecorator },
    } = props;
    this.state = {
      query: props.location.query,
      store_detail: {},
      store_base_info: [{ //店铺信息
        type: 'show_text',
        label: `${sldComLanguage('入驻类型')}`,
        name: 'enterTypeValue',
        extra: ``,
        item_height: 42,
        text: ``,
      }, {
        type: 'show_text',
        label: `${sldComLanguage('所在地')}`,
        name: 'areaInfo',
        extra: ``,
        item_height: 42,
        text: ``,
      }, {
        type: 'show_text',
        label: `${sldComLanguage('详细地址')}`,
        name: 'companyAddress',
        extra: ``,
        item_height: 42,
        text: ``,
      }, {
        type: 'show_text',
        label: `${sldComLanguage('联系人')}`,
        name: 'contactName',
        extra: ``,
        item_height: 42,
        text: ``,
      }, {
        type: 'show_text',
        label: `${sldComLanguage('联系人手机号')}`,
        name: 'contactPhone',
        extra: ``,
        item_height: 42,
        text: ``,
      }],
      card_data: [{
        type: 'show_img_more',
        label: `${sldComLanguage('身份证正面')}`,
        name: 'personCardUpPath',
        data: [],
        item_height: 140,
      }, {
        type: 'show_img_more',
        label: `${sldComLanguage('身份证反面')}`,
        name: 'personCardDownPath',
        data: [],
        item_height: 140,
      }],//身份证信息
      business_data: [{
        type: 'show_img_more',
        label: `${sldComLanguage('营业执照')}`,
        name: 'businessLicenseImagePath',
        data: [],
        item_height: 140,
      }],//营业执照信息
      more_qualification_data: [],//补充认证信息
      store_business_info: [{
        type: 'show_text',
        label: `${sldComLanguage('店铺名称')}`,
        name: 'storeName',
        extra: ``,
        item_height: 42,
        text: ``,
      }, {
        type: 'show_text',
        label: `${sldComLanguage('店铺等级')}`,
        name: 'storeGradeName',
        extra: ``,
        item_height: 42,
        text: ``,
      }, {
        type: 'show_text',
        label: `${sldComLanguage('开店时长')}`,
        name: 'openTime',
        extra: ``,
        item_height: 42,
        text: ``,
      }, {
        type: 'show_text',
        label: `${sldComLanguage('已付年费')}`,
        name: 'payAmount',
        extra: ``,
        item_height: 42,
        text: ``,
      }, {
        type: 'show_text',
        label: `${sldComLanguage('付款方式')}`,
        name: 'paymentName',
        extra: ``,
        item_height: 42,
        text: ``,
      }, {
        type: 'show_text',
        label: `${sldComLanguage('结算日')}`,
        name: 'billCycle',
        extra: ``,
        item_height: 42,
        text: ``,
      }],//店铺经营信息
      columns: [{
        title: ' ',
        dataIndex: 'key',
        align: 'center',
        width: 30,
        render: (text, record, index) => {
          return index + 1;
        },
      }, {
        title: `${sldComLanguage('一级类目')}`,
        dataIndex: 'goodsCateName1',
        align: 'center',
        width: 100,
      }, {
        title: `${sldComLanguage('二级类目')}`,
        dataIndex: 'goodsCateName2',
        align: 'center',
        width: 100,
      }, {
        title: `${sldComLanguage('三级类目')}`,
        dataIndex: 'goodsCateName3',
        align: 'center',
        width: 100,
      }, {
        title: <div style={{ position: 'relative' }}>
          <span style={{ color: '#FF2929', fontSize: 13 }}>*</span>{sldComLanguage('佣金比例')}<Tooltip placement="bottomLeft"
                                                                                title={sldComLanguage('佣金比例在0～1之间')}>
          <div style={{ right: -15, top: 2, position: 'absolute' }}>{sldSvgIcon('#bfbbba', 14, 14, 'wen')}</div>
        </Tooltip>
        </div>,
        dataIndex: 'scaling',
        align: 'center',
        width: 100,
      }],//经营类目数据
      resList: [], // 取消原因数据
      modalVisible: false,
      titleName: '',
      submiting: false,
      modal_width: 500,
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'global/getLayoutCollapsed',
    });
    const { query } = this.state;
    this.get_detail({ storeId: query.id });
  }

  get_detail = (params) => {
    const { dispatch } = this.props;
    let { store_detail, store_base_info, card_data, store_business_info, business_data, more_qualification_data } = this.state;
    dispatch({
      type: 'store/get_settled_store_apply_detail',
      payload: params,
      callback: res => {
        if (res.state == 200) {
          store_detail = res.data;
          for (let i = 0; i<store_base_info.length;i++){
            if (store_detail.enterType == 1 && store_base_info[i].name == 'enterTypeValue') {
              store_base_info.splice(i + 1, 0, {
                type: 'show_text',
                label: `${sldComLanguage('公司名称')}`,
                name: 'companyName',
                extra: ``,
                item_height: 42,
                text: ``,
              });
            }
            store_base_info[i].text = store_detail[store_base_info[i].name] ? store_detail[store_base_info[i].name] : '--';
          }

          if (store_detail.enterType == 1) {
            [1, 2, 3].map(item => {
              if (store_detail[`moreQualification${item}`]) {
                more_qualification_data.push({
                  type: 'show_img_more',
                  label: `${sldComLanguage('补充认证资质')}`,
                  name: `moreQualification${item}Url`,
                  data: [store_detail[`moreQualification${item}Path`]],
                  item_height: 140,
                });
              }
            });
          }

          //营业执照信息-start
          business_data.map(item => {
            item.data.push(store_detail[item.name]);
          });
          //营业执照信息-end

          //身份证信息-start
          card_data.map(item => {
            item.data.push(store_detail[item.name]);
          });
          //身份证信息-end

          //店铺经营信息-start
          store_business_info.map(item => {
            if (item.name == 'openTime') {
              item.text = `${store_detail[item.name]}${sldComLanguage('年')}`;
            } else if (item.name == 'payAmount') {
              item.text = `${store_detail[item.name]}${sldComLanguage('元')}`;
            } else if (item.name == 'billCycle') {
              item.text = `${store_detail[item.name]?store_detail[item.name]:`${sldComLanguage('系统默认')}`}`;
            } else {
              item.text = store_detail[item.name];
            }
          });
          //店铺经营信息-end

          this.setState({
            store_base_info,
            store_detail,
            card_data,
            store_business_info,
            business_data,
            more_qualification_data,
          });
        } else {
          failTip(res.msg);
        }
      },
    });
  };

  //表格编辑事件
  handleFieldChange(val, fieldName, record) {
    let { store_detail } = this.state;
    let tar_data = store_detail.storeGoodsCateVOList.filter(item => item.bindId == record.bindId);
    if (tar_data.length > 0) {
      tar_data[0][fieldName] = val;
      this.setState({ store_detail }, () => {
        sthis.props.form.resetFields(['scaling' + record.bindId]);
      });
    }
  }

  render() {
    const {
      store_base_info, card_data, store_business_info, columns, store_detail,  business_data, more_qualification_data,
    } = this.state;
    return (
      <div className={global.common_page}
           style={{ flex: 1, flexDirection: 'column', overflow: 'hidden' }}>
        <div className={global.flex_com_space_between} style={{ margin: 10, marginTop: 0 }}>
          {sldLlineRtextAddGoods('#FA6F1E', `${sldComLanguage('店铺信息')}`)}
          {sldIconBtnBg(() => router.go(-1), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
        </div>
        {getSldHorLine(1)}
        <Scrollbars
          autoHeight
          autoHeightMin={100}
          autoHeightMax={document.body.clientHeight - 108}
        >

          {sldCommonTitle(`${store_detail.enterType == 1 ? `${sldComLanguage('公司联系人信息')}` : `${sldComLanguage('店铺信息')}`}`, '#333', 5, 15, 15)}
          <SldTableRowTwo r_color={'#333'} l_color={'#999'} l_fontw={500} r_fontw={600} form={this.props.form}
                          data={store_base_info}/>
          {store_detail.enterType == 1 &&
          <Fragment>
            {sldCommonTitle(`${sldComLanguage('营业执照信息')}`, '#333', 5, 15, 15)}
            <SldTableRowTwo r_color={'#333'} l_color={'#999'} l_fontw={500} r_fontw={600} form={this.props.form}
                            part_width={100} lwidth={10} rwidth={90}
                            data={business_data}/>
          </Fragment>
          }
          {sldCommonTitle(`${store_detail.enterType == 1 ? `${sldComLanguage('法人身份信息')}` : `${sldComLanguage('身份证信息')}`}`, '#333', 5, 15, 15)}
          <SldTableRowTwo r_color={'#333'} l_color={'#999'} l_fontw={500} r_fontw={600} form={this.props.form}
                          part_width={100} lwidth={10} rwidth={90}
                          data={card_data}/>
          {store_detail.enterType == 1 && more_qualification_data.length > 0 &&
          <Fragment>
            {sldCommonTitle(`${sldComLanguage('补充认证信息')}`, '#333', 5, 15, 15)}
            <SldTableRowTwo r_color={'#333'} l_color={'#999'} l_fontw={500} r_fontw={600} form={this.props.form}
                            part_width={100} lwidth={10} rwidth={90}
                            data={more_qualification_data}/>
          </Fragment>
          }
          {sldCommonTitle(`${sldComLanguage('店铺经营信息')}`, '#333', 5, 15, 15)}
          <SldTableRowTwo r_color={'#333'} l_color={'#999'} l_fontw={500} r_fontw={600} form={this.props.form}
                          data={store_business_info}/>
          {sldCommonTitle(`${sldComLanguage('经营类目')}`, '#333', 5, 15, 15)}

          <div style={{ width: '98%', maxHeight: 300 }}>
            <Scrollbars autoHeight
                        autoHeightMax={300}>
              <Table rowKey={'bindId'} pagination={false} columns={columns}
                     dataSource={store_detail.storeGoodsCateVOList} size={'small'}/>
            </Scrollbars>
          </div>
          {getSldEmptyH(40)}
        </Scrollbars>
      </div>
    );
  }
}
