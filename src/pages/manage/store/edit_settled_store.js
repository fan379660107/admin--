/*
* 入驻店铺管理——编辑入驻店铺信息
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Table, Tooltip, } from 'antd';
import {
  failTip,
  getSldHorLine,
  sldLlineRtextAddGoods,
  sldIconBtnBg,
  sldCommonTitle,
  sldComLanguage,
  getSldEmptyH,
  sucTip,
  sldSvgIcon,
  list_com_page_more,
  mobile_reg,
} from '@/utils/utils';
import global from '@/global.less';
import router from 'umi/router';
import { Scrollbars } from 'react-custom-scrollbars';
import SldTableRowTwo from '@/components/SldTableRowTwo';
import areaData from '@/assets/area.json';
import { apiUrl } from '@/utils/sldconfig.js';
import { week_to_num, month_to_num } from '@/utils/util_data';
import SldPreviewImg from '@/components/SldPreviewImg/SldPreviewImg';


let sthis = '';
const FormItem = Form.Item;
@connect(({ store, global, share }) => ({
  store, global, share
}))
@Form.create()
export default class EditSettledStore extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    const {
      form: { getFieldDecorator },
    } = props;
    this.state = {
      show_preview_modal: false,//预览图片modal框是否展示
      preview_img: '',//预览图片
      preview_alt_con: '',//预览图片内容
      show_radio_flag: false,
      query: props.location.query,
      store_detail: {},
      store_base_info: [{ //店铺信息
        type: 'show_text',
        label: `${sldComLanguage('入驻类型')}`,
        name: 'enterTypeValue',
        extra: ``,
        text: ``,
      }, {
        type: 'cascader_common',
        label: `${sldComLanguage('所在地')}`,
        name: 'area',
        data: areaData,//三级地址
        fieldNames: { label: 'regionName', value: 'regionCode', children: 'children' },
        placeholder: `${sldComLanguage('请选择店铺所在地')}`,//请选择店铺所在地
        initialValue: [],
        required: true,
        onChange: this.getAreaInfo,
        rules: [{
          required: true,
          message: `${sldComLanguage('请选择店铺所在地')}`,//请选择店铺所在地
        }],
      }, {
        type: 'textarea',
        maxLength: 40,
        label: `${sldComLanguage('详细地址')}`,
        name: 'companyAddress',
        placeholder: `${sldComLanguage('请输入店铺详细地址,最多40字')}`,
        initialValue: '',
        required: true,
        rules: [{
          required: true,
          message: `${sldComLanguage('请输入详细地址')}`,
        }],
      }, {
        type: 'input',
        maxLength: 6,
        label: `${sldComLanguage('联系人')}`,
        name: 'contactName',
        placeholder: `${sldComLanguage('请输入联系人姓名,最多6个字')}`,
        initialValue: '',
        required: true,
        rules: [{
          required: true,
          message: `${sldComLanguage('请输入联系人姓名')}`,
        }],
      }, {
        type: 'input',
        label: `${sldComLanguage('联系人手机号')}`,
        name: 'contactPhone',
        placeholder: `${sldComLanguage('请输入联系人手机号')}`,
        initialValue: '',
        required: true,
        rules: [{
          required: true,
          message: `${sldComLanguage('请输入联系人手机号')}`,
        }, {
          pattern: mobile_reg,
          message: `${sldComLanguage('请输入正确的手机号')}`,
        }],
      }],
      personal_front_card_img: [{
        type: 'upload_img_upload',
        label: `${sldComLanguage('身份证正面')}`,
        name: 'personCardUp',
        extra: `${sldComLanguage('支持JPG/PNG,大小不超过20M')}`,
        fileList: [],
        upload_name: 'file',
        upload_url: apiUrl + `v3/oss/common/upload?source=sellerApply`,
        uploadPreview: this.uploadImgPre,
        uploadChange: (info) => this.uploadImg('personal_front_card_img', 'personCardUp', info),
        initialValue: '',
        img_succ_info: {},
        required: true,
        num: 1,
        item_height: 160,
      }, {
        type: 'upload_img_upload',
        label: `${sldComLanguage('身份证反面')}`,
        name: 'personCardDown',
        extra: `${sldComLanguage('支持JPG/PNG,大小不超过20M')}`,
        fileList: [],
        upload_name: 'file',
        upload_url: apiUrl + `v3/oss/common/upload?source=sellerApply`,
        uploadPreview: this.uploadImgPre,
        uploadChange: (info) => this.uploadImg('personal_front_card_img', 'personCardDown', info),
        initialValue: '',
        img_succ_info: {},
        required: true,
        num: 1,
        item_height: 160,
      }],//身份证正面信息
      business_license_img: [{
        type: 'upload_img_upload',
        label: `${sldComLanguage('营业执照')}`,
        name: 'businessLicenseImage',
        extra: `${sldComLanguage('支持JPG/PNG,大小不超过20M')}`,
        fileList: [],
        upload_name: 'file',
        upload_url: apiUrl + `v3/oss/common/upload?source=sellerApply`,
        uploadPreview: this.uploadImgPre,
        uploadChange: (info) => this.uploadImg('business_license_img', 'businessLicenseImage', info),
        initialValue: '',
        img_succ_info: {},
        required: true,
        num: 1,
        item_height: 160,
      }],//营业执照信息——企业入驻
      replenish_img: [{
        type: 'upload_img_upload',
        label: `${sldComLanguage('补充认证一')}`,
        name: 'moreQualification1',
        extra: `${sldComLanguage('支持JPG/PNG,大小不超过20M')}`,
        fileList: [],
        upload_name: 'file',
        upload_url: apiUrl + `v3/oss/common/upload?source=sellerApply`,
        uploadPreview: this.uploadImgPre,
        uploadChange: (info) => this.uploadImg('replenish_img', 'moreQualification1', info),
        initialValue: '',
        img_succ_info: {},
        num: 1,
        item_height: 160,
      }, {
        type: 'upload_img_upload',
        label: `${sldComLanguage('补充认证二')}`,
        name: 'moreQualification2',
        extra: `${sldComLanguage('支持JPG/PNG,大小不超过20M')}`,
        fileList: [],
        upload_name: 'file',
        upload_url: apiUrl + `v3/oss/common/upload?source=sellerApply`,
        uploadPreview: this.uploadImgPre,
        uploadChange: (info) => this.uploadImg('replenish_img', 'moreQualification2', info),
        initialValue: '',
        img_succ_info: {},
        num: 1,
        item_height: 160,
      }, {
        type: 'upload_img_upload',
        label: `${sldComLanguage('补充认证三')}`,
        name: 'moreQualification3',
        extra: `${sldComLanguage('支持JPG/PNG,大小不超过20M`')}`,
        fileList: [],
        upload_name: 'file',
        upload_url: apiUrl + `v3/oss/common/upload?source=sellerApply`,
        uploadPreview: this.uploadImgPre,
        uploadChange: (info) => this.uploadImg('replenish_img', 'moreQualification3', info),
        initialValue: '',
        img_succ_info: {},
        num: 1,
        item_height: 160,
      }],//补充认证信息——企业入驻
      store_business_info: [{
        type: 'show_text',
        label: `${sldComLanguage('店铺名称')}`,
        name: 'storeName',
        extra: ``,
        text: ``,
      }, {
        type: 'select',
        label: `${sldComLanguage('店铺等级')}`,
        name: 'storeGradeId',
        sel_data: [],
        sele_key: 'gradeId',
        sele_name: 'gradeName',
        diy: true,
        required: true,
        rules: [{
          required: true,
          message: `${sldComLanguage('请选择开店时长')}`,
        }],
      }, {
        type: 'select',
        label: `${sldComLanguage('开店时长')}`,
        name: 'openTime',
        placeholder: `${sldComLanguage('请选择开店时长')}`,
        sel_data: [],
        required: true,
        rules: [{
          required: true,
          message: `${sldComLanguage('请选择开店时长')}`,
        }],
      }],//店铺经营信息
      settle_info: [{
        type: 'radio',
        label: `${sldComLanguage('结算日')}`,
        name: 'billCycle',
        required: true,
        sel_data: [
          { name: `${sldComLanguage('按月结算')}`, key: 1 },
          { name: `${sldComLanguage('按周结算')}`, key: 2 },
        ],
        isReset: true,
        initialValue: 1,
        onChange: this.switchBillType,
      }],// 结算信息
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

  sel_area_name = '';//选择店铺地址的文本内容
  week_data = {
    type: 'checkboxgroup',
    label: `${sldComLanguage('结算日')}`,
    extra: `${sldComLanguage('设置该商家每周几进行结算，可多选，全部选中则为按天结算。')}`,
    name: 'billDays',
    placeholder: `${sldComLanguage('请选择结算日')}`,
    sldOptions: week_to_num(),
    rules: [{
      required: true,
      message: `${sldComLanguage('请选择结算日')}`,
    }],
    item_height: 100,
  };

  month_data = {
    type: 'checkboxgroup',
    label: `${sldComLanguage('结算日')}`,
    extra: `${sldComLanguage('设置该商家每月几号进行结算，可多选，若当月没有设置的日期则该日不进行结算。')}`,
    name: 'billDays',
    placeholder: `${sldComLanguage('请选择结算日')}`,
    sldOptions: month_to_num(),
    rules: [{
      required: true,
      message: `${sldComLanguage('请选择结算日')}`,
    }],
    item_height: 140,
  };

  async componentDidMount() {
    this.props.dispatch({
      type: 'global/getLayoutCollapsed',
    });
    const { query } = this.state;
    await this.getStoreOpenTime();
    this.get_detail({ storeId: query.id });
    this.get_store_grade();
  }

  //获取开店时长列表
  getStoreOpenTime = async () => {
    let { store_business_info } = this.state;
    const { dispatch } = this.props;
    await dispatch({
      type: 'store/get_store_open_time',
      callback: (res) => {
        if (res.state == 200) {
          let tmp_data = [];
          res.data.map(item => {
            tmp_data.push({ key: item, name: item + '年' });
          });
          let tar_data = store_business_info.filter(item => item.name == 'openTime')[0];
          tar_data.sel_data = tmp_data;
          this.setState({
            store_business_info,
          });
        }
      },
    });
  };

  switchBillType = (e) => {
    let { settle_info,store_detail } = this.state;
    settle_info = settle_info.filter(item => item.name != 'billDays');
    let tar_bill_data = {};
    if (e == 1) {
      //按月结算
      tar_bill_data = JSON.parse(JSON.stringify(this.month_data));
    } else if (e == 2) {
      //按周结算
      tar_bill_data = JSON.parse(JSON.stringify(this.week_data));
    }
    if(store_detail.billType == e){
      tar_bill_data.initialValue = store_detail.billDay != null && store_detail.billDay ? store_detail.billDay.split(',') : '';
    }
    settle_info.push(tar_bill_data);
    this.setState({ settle_info });
  };

  //获取地址信息
  getAreaInfo = (area) => {
    for (let i in area) {
      this.sel_area_name += area[i].regionName;
    }
  };

  //获取店铺等级
  get_store_grade = () => {
    let { store_business_info } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'store/get_grade_lists',
      payload: { pageSize: list_com_page_more },
      callback: (res) => {
        if (res.state == 200) {
          let tar_data = store_business_info.filter(item => item.name == 'storeGradeId')[0];
          tar_data.sel_data = res.data.list;
          this.setState({
            store_business_info,
          });
        }
      },
    });
  };

  get_detail = (params) => {
    const { dispatch } = this.props;
    let { store_detail, store_base_info, personal_front_card_img, store_business_info, replenish_img, business_license_img, settle_info } = this.state;
    dispatch({
      type: 'store/get_settled_store_apply_detail',
      payload: params,
      callback: res => {
        if (res.state == 200) {
          store_detail = res.data;
          for (let i = 0; i < store_base_info.length; i++) {
            if (store_detail.enterType == 1 && store_base_info[i].name == 'enterTypeValue') {
              store_base_info.splice(i + 1, 0, {
                type: 'input',
                maxLength: 20,
                label: `${sldComLanguage('公司名称')}`,
                name: 'companyName',
                placeholder: `${sldComLanguage('请输入公司名称,最多20个字')}`,
                initialValue: '',
                required: true,
                rules: [{
                  required: true,
                  message: `${sldComLanguage('请输入公司名称')}`,
                }],
              });
            }
            if (store_base_info[i].name == 'enterTypeValue') {
              store_base_info[i].text = store_detail[store_base_info[i].name];
            } else if (store_base_info[i].name == 'area') {
              store_base_info[i].initialValue = [store_detail.companyProvinceCode, store_detail.companyCityCode, store_detail.companyAreaCode];
              this.sel_area_name = store_detail.areaInfo;
            } else {
              store_base_info[i].initialValue = store_detail[store_base_info[i].name];
            }
          }

          if (store_detail.enterType == 1) {
            //补充认证1图片
            if (store_detail.moreQualification1) {
              replenish_img[0].fileList.push({
                response: {
                  data: {
                    path: store_detail.moreQualification1,
                    url: store_detail.moreQualification1Path,
                  },
                },
                name: store_detail.moreQualification1,
                uid: store_detail.moreQualification1,
                status: 'done',
                thumbUrl: store_detail.moreQualification1Path,
              });
            }

            //补充认证2图片
            if (store_detail.moreQualification2) {
              replenish_img[1].fileList.push({
                response: {
                  data: {
                    path: store_detail.moreQualification2,
                    url: store_detail.moreQualification2Path,
                  },
                },
                name: store_detail.moreQualification2,
                uid: store_detail.moreQualification2,
                status: 'done',
                thumbUrl: store_detail.moreQualification2Path,
              });
            }

            //补充认证3图片
            if (store_detail.moreQualification3) {
              replenish_img[2].fileList.push({
                response: {
                  data: {
                    path: store_detail.moreQualification3,
                    url: store_detail.moreQualification3Path,
                  },
                },
                name: store_detail.moreQualification3,
                uid: store_detail.moreQualification3,
                status: 'done',
                thumbUrl: store_detail.moreQualification3Path,
              });
            }
          }

          //身份证正面图片
          personal_front_card_img[0].fileList.push({
            response: {
              data: {
                path: store_detail.personCardUp,
                url: store_detail.personCardUpPath,
              },
            },
            name: store_detail.personCardUp,
            uid: store_detail.personCardUp,
            status: 'done',
            thumbUrl: store_detail.personCardUpPath,
          });

          //身份证反面图片
          personal_front_card_img[1].fileList.push({
            response: {
              data: {
                path: store_detail.personCardDown,
                url: store_detail.personCardDownPath,
              },
            },
            name: store_detail.personCardDown,
            uid: store_detail.personCardDown,
            status: 'done',
            thumbUrl: store_detail.personCardDownPath,
          });

          //营业执照信息-start
          business_license_img[0].fileList.push({
            response: {
              data: {
                path: store_detail.businessLicenseImage,
                url: store_detail.businessLicenseImagePath,
              },
            },
            name: store_detail.businessLicenseImage,
            uid: store_detail.businessLicenseImage,
            status: 'done',
            thumbUrl: store_detail.businessLicenseImagePath,
          });
          //营业执照信息-end

          //店铺经营信息-start
          store_business_info.map(item => {
            if (item.name == 'storeName') {
              item.text = store_detail[item.name];
            } else if (item.name == 'billCycle') {
              item.initialValue = 1;
            } else {
              item.initialValue = store_detail[item.name];
            }
          });
          //店铺经营信息-end

          //结算信息-start
          for (let bill_i = 0; bill_i < settle_info.length; bill_i++) {
            if (settle_info[bill_i].name == 'billCycle') {
              settle_info[bill_i].initialValue = store_detail.billType ? store_detail.billType : 1;
              let temp_data = {};
              if (settle_info[bill_i].initialValue == 1) {
                temp_data = JSON.parse(JSON.stringify(this.month_data));
              } else {
                temp_data = JSON.parse(JSON.stringify(this.week_data));
              }
              settle_info.push(temp_data);
            } else {
              settle_info[bill_i].initialValue = store_detail.billDay ? store_detail.billDay.split(',') : [];
            }
          }
          //结算信息-end

          this.setState({
            store_base_info,
            store_detail,
            store_business_info,
            replenish_img,
            business_license_img,
            personal_front_card_img,
            settle_info,
            show_radio_flag: true,
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

  //预览图片
  uploadImgPre = (img) => {
    this.viewImg(true, img.url || img.thumbUrl);
  };

  //预览图片/关闭预览图片
  viewImg = (flag, img = '', text = '') => {
    this.setState({
      preview_img: img,
      preview_alt_con: text,
      show_preview_modal: flag,
    });
  };

  //上传图片 key  name ,info
  uploadImg = (key, name, info) => {
    let tmp_data = this.state[key];
    if (info.file.status != undefined && info.file.status != 'error') {
      for (let i in tmp_data) {
        if (tmp_data[i].name == name) {
          tmp_data[i].fileList = info.fileList;
          break;
        }
      }
      this.setState({ [key]: tmp_data });
    }
  };

  //保存
  save = () => {
    let { store_detail, business_license_img, replenish_img, personal_front_card_img } = this.state;
    const { query } = this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err){
        let params = { ...values };
        params.storeId = query.id;
        params.areaInfo = this.sel_area_name;
        params.billType = values.billCycle;
        params.billDays = values.billDays.join(',');
        delete params.billCycle;
        params.companyProvinceCode = values.area[0];
        params.companyCityCode = values.area[1];
        params.companyAreaCode = values.area[2];
        delete params.area;
        if (store_detail.enterType == 1) {
          //企业入驻
          if (business_license_img[0].fileList.length == 0) {
            failTip(`${sldComLanguage('请上传营业执照图片')}`);
            return false;
          } else {
            params.businessLicenseImage = business_license_img[0].fileList[0].response.data.path;//营业执照图片
          }

          if (replenish_img[0].fileList.length > 0) {
            params.moreQualification1 = replenish_img[0].fileList[0].response.data.path;//补充认证一图片
          }

          if (replenish_img[1].fileList.length > 0) {
            params.moreQualification2 = replenish_img[1].fileList[0].response.data.path;//补充认证二图片
          }

          if (replenish_img[2].fileList.length > 0) {
            params.moreQualification3 = replenish_img[2].fileList[0].response.data.path;//补充认证三图片
          }
        }

        if (personal_front_card_img[0].fileList.length == 0) {
          failTip(`${sldComLanguage('请上传身份证正面图片')}`);
          return false;
        } else {
          params.personCardUp = personal_front_card_img[0].fileList[0].response.data.path;//身份证正面图片
        }

        if (personal_front_card_img[1].fileList.length == 0) {
          failTip(`${sldComLanguage('请上传身份证反面图片')}`);
          return false;
        } else {
          params.personCardDown = personal_front_card_img[1].fileList[0].response.data.path;//身份证反面图片
        }
        this.props.dispatch({
          type: 'store/edit_settled_store_info',
          payload: params,
          callback: res => {
            if (res.state == 200) {
              this.props.dispatch({
                type: 'share/updateDate',
                payload: { flag: true, type: 'edit_settle_store_info', sldGlobalShareData: {} }
              });
              sucTip(res.msg, 1);
              //提示并返回上级页面
              setTimeout(() => {
                sthis.props.history.goBack();
              }, 500);
            } else {
              failTip(res.msg);
            }
          },
        });
      }

    });
  };

  render() {
    const {
      store_base_info, personal_front_card_img, store_business_info, columns, store_detail, business_license_img, replenish_img, show_radio_flag, settle_info, preview_img, show_preview_modal, preview_alt_con,
    } = this.state;
    return (
      <div className={global.common_page}
           style={{ flex: 1, flexDirection: 'column', overflow: 'hidden' }}>
        <div className={global.flex_com_space_between} style={{ margin: 10, marginTop: 0 }}>
          {sldLlineRtextAddGoods('#FA6F1E', `${sldComLanguage('编辑店铺信息')}`)}
          {sldIconBtnBg(() => router.go(-1), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
        </div>
        {getSldHorLine(1)}
        <Scrollbars
          autoHeight
          autoHeightMin={100}
          autoHeightMax={document.body.clientHeight - 170}
        >

          {sldCommonTitle(`${store_detail.enterType == 1 ? `${sldComLanguage('公司联系人信息')}` : `${sldComLanguage('店铺信息')}`}`, '#333', 5, 15, 15)}
          <SldTableRowTwo r_color={'#333'} l_color={'#999'} l_fontw={500} r_fontw={600} form={this.props.form}
                          data={store_base_info}/>
          {store_detail.enterType == 1 &&
          <Fragment>
            {sldCommonTitle(`${sldComLanguage('营业执照信息')}`, '#333', 5, 15, 15)}
            <SldTableRowTwo r_color={'#333'} l_color={'#999'} l_fontw={500} r_fontw={600} form={this.props.form}
                            part_width={100} lwidth={10} rwidth={90}
                            data={business_license_img}/>
          </Fragment>
          }
          {sldCommonTitle(`${store_detail.enterType == 1 ? `${sldComLanguage('法人身份信息')}` : `${sldComLanguage('身份证信息')}`}`, '#333', 5, 15, 15)}
          <SldTableRowTwo r_color={'#333'} l_color={'#999'} l_fontw={500} r_fontw={600} form={this.props.form}
                          part_width={100} lwidth={10} rwidth={90}
                          data={personal_front_card_img}/>
          {store_detail.enterType == 1 &&
          <Fragment>
            {sldCommonTitle(`${sldComLanguage('补充认证信息')}`, '#333', 5, 15, 15)}
            <SldTableRowTwo r_color={'#333'} l_color={'#999'} l_fontw={500} r_fontw={600} form={this.props.form}
                            part_width={100} lwidth={10} rwidth={90}
                            data={replenish_img}/>
          </Fragment>
          }
          {show_radio_flag &&
          <Fragment>
            {sldCommonTitle(`${sldComLanguage('店铺经营信息')}`, '#333', 5, 15, 15)}
            <SldTableRowTwo r_color={'#333'} l_color={'#999'} l_fontw={500} r_fontw={600} form={this.props.form}
                            data={store_business_info}/>
          </Fragment>
          }

          {show_radio_flag &&
          <Fragment>
            {sldCommonTitle(`${sldComLanguage('店铺结算信息')}`, '#333', 5, 15, 15)}
            <SldTableRowTwo r_color={'#333'} l_color={'#999'} l_fontw={500} r_fontw={600} form={this.props.form}
                            part_width={100} lwidth={10} rwidth={90}
                            data={settle_info}/>
          </Fragment>
          }

          {sldCommonTitle(`${sldComLanguage('经营类目')}`, '#333', 5, 15, 15)}

          <div style={{ width: '98%', maxHeight: 300 }}>
            <Scrollbars autoHeight
                        autoHeightMax={300}>
              <Table rowKey={'bindId'} pagination={false} columns={columns}
                     dataSource={store_detail.storeGoodsCateVOList} size={'small'}/>
            </Scrollbars>
          </div>
          {getSldEmptyH(10)}
        </Scrollbars>
        {/*图片预览-start*/}
        <SldPreviewImg img={preview_img} show_preview_modal={show_preview_modal} modal_width={500}
                       preview_alt_con={preview_alt_con} closePreviewModal={() => this.viewImg(false)}/>
        {/*图片预览-end*/}
        <div className={global.m_diy_bottom_wrap}
             style={{ position: 'fixed', left: this.props.global.collapsed ? 90 : 160 }}>
          <div onClick={() => router.go(-1)} className={global.add_goods_bottom_btn}>
            {sldComLanguage('返回')}
          </div>
          <div onClick={() => this.save()}
               className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel}`}>
            {sldComLanguage('保存')}
          </div>
        </div>
      </div>
    );
  }
}
