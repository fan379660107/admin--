/*
* 新建签到活动
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, Spin, Input, DatePicker, InputNumber, Checkbox, Upload, Icon } from 'antd';
import {
  failTip,
  sucTip,
  sldLlineRtextAddGoodsAddMargin,
  sldComLanguage,
  getSldHorLine,
  sldCommonTitleByBg,
  dateTimeFormat,
  getSldEmptyH,
  sldBeforeUpload,
  getLocalStorageStingVal,
} from '@/utils/utils';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import SldSelGoodsSingleDiy from '@/components/SldSelGoodsSingleDiy';
import moment from 'moment';
import { apiUrl } from '@/utils/sldconfig.js';
import SldPreviewImg from '@/components/SldPreviewImg/SldPreviewImg';

let sthis = '';
const FormItem = Form.Item;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
@connect(({ sign, global }) => ({
  sign, global,
}))
@Form.create()
export default class AddSign extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      preview_img: '',
      preview_alt_con: '',
      show_preview_modal: false,
      uploadImgInfo: {
        shareImgFileList: [],//分享图片数据
        tipImgFileList: [],//提醒图片数据
      },//上传的图片数据
      perSignFlag: false,//日签奖励是否开启
      continueSignFlag: false,//连签奖励是否开启
      continueSignPointFlag: false,//连签奖励积分是否开启
      pageBgFlag: false,//背景设置是否开启
      pageShareFlag: false,//分享设置是否开启
      pagetipFlag: false,//提醒设置是否开启
      sel_voucher: {},//选择的优惠券信息
      link_type: '',
      loading: false,
      query: props.location.query,
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      detail: {},//活动详情数据
      viewFlag: props.location.query.tar != undefined && props.location.query.tar == 'view' ? true : false,//查看标识
      dateRange: [],
    };
  }

  componentDidMount() {
    const { query } = this.state;
    if (query.id != undefined && query.id > 0) {
      this.get_detail(query.id);
    }
    this.props.dispatch({
      type: 'global/getLayoutCollapsed',
    });
  }

  componentWillUnmount() {
  }

  //获取签到详情
  get_detail = async (id) => {
    const { dispatch } = this.props;
    let { detail, sel_voucher, perSignFlag, continueSignFlag, continueSignPointFlag, uploadImgInfo, pageShareFlag, pagetipFlag } = this.state;
    dispatch({
      type: 'sign/get_detail',
      payload: { signActivityId: id },
      callback: async (res) => {
        if (res.state == 200) {
          detail = res.data;
          //初始化选中的优惠券数据
          if (detail.bonusVoucher) {
            sel_voucher.couponId = detail.bonusVoucher;
            sel_voucher.couponName = detail.bonusVoucherName;
          }
          perSignFlag = detail.integralPerSign > 0 ? true : false;
          continueSignFlag = detail.continueNum > 0 ? true : false;
          continueSignPointFlag = detail.bonusIntegral > 0 ? true : false;
          //页面设置：
          if (detail.templateJson) {
            let pageData = JSON.parse(detail.templateJson.replace(/&quot;/g,"\""));
            pageShareFlag = pageData.pageShareFlag;
            if (pageShareFlag) {
              detail.shareTitle = pageData.shareData.shareTitle;
              detail.shareDesc = pageData.shareData.shareDesc;
              let shareImgFileList = [];
              if (pageData.shareData.shareImgPath) {
                let tmp_data = {};
                tmp_data.uid = pageData.shareData.shareImgPath;
                tmp_data.name = pageData.shareData.shareImgPath;
                tmp_data.status = 'done';
                tmp_data.url = pageData.shareData.shareImgUrl;
                tmp_data.response = {};
                tmp_data.response.data = {};
                tmp_data.response.data.url = pageData.shareData.shareImgUrl;
                tmp_data.response.data.path = pageData.shareData.shareImgPath;
                shareImgFileList.push(tmp_data);
              }
              uploadImgInfo.shareImgFileList = shareImgFileList;
            }
            pagetipFlag = pageData.pagetipFlag;
            if (pagetipFlag) {
              let tipImgFileList = [];
              if (pageData.tipData.imgPath) {
                let tmp_data = {};
                tmp_data.uid = pageData.tipData.imgPath;
                tmp_data.name = pageData.tipData.imgPath;
                tmp_data.status = 'done';
                tmp_data.url = pageData.tipData.imgUrl;
                tmp_data.response = {};
                tmp_data.response.data = {};
                tmp_data.response.data.url = pageData.tipData.imgUrl;
                tmp_data.response.data.path = pageData.tipData.imgPath;
                tipImgFileList.push(tmp_data);
              }
              uploadImgInfo.tipImgFileList = tipImgFileList;
            }
          } else {
            pageShareFlag = false;
            pagetipFlag = false;
          }
          this.setState({
            detail,
            sel_voucher,
            perSignFlag,
            continueSignFlag,
            continueSignPointFlag,
            pageShareFlag,
            pagetipFlag,
            uploadImgInfo,
          });
        } else {
          failTip(res.msg);
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

//保存并新增事件
  handleSaveAllData = () => {
    const { dispatch } = this.props;
    const { query, sel_voucher, uploadImgInfo, perSignFlag, continueSignFlag } = this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          if (!perSignFlag && !continueSignFlag) {
            failTip(`${sldComLanguage('请至少选中一种奖励方式')}～`);
            return false;
          }
          let params = {};
          //活动时间处理
          params.startTime = values.activityTime[0] ? values.activityTime[0].format(dateTimeFormat) : '';
          params.endTime = values.activityTime[1] ? values.activityTime[1].format(dateTimeFormat) : '';

          //签到周期开始时间必须小于结束时间
          if (Date.parse(params.startTime) >= Date.parse(params.endTime)) {
            failTip(`${sldComLanguage('签到周期开始时间必须小于结束时间')}～`);
            return false;
          }

          params.bonusIntegral = values.bonusIntegral != undefined && values.bonusIntegral ? values.bonusIntegral : 0;//连签奖励:积分
          params.bonusRules = values.bonusRules;//规则说明
          params.continueNum = values.continueNum != undefined && values.continueNum ? values.continueNum : 0;//连续签到天数；0表示无连签奖励

          //连续签到天数必须小于签到周期
          if (Date.parse(params.endTime) - Date.parse(params.startTime) <= params.continueNum * 24 * 60 * 60 * 1000) {
            failTip(`${sldComLanguage('连续签到天数必须小于签到周期')}～`);
            return false;
          }

          params.integralPerSign = values.integralPerSign != undefined && values.integralPerSign ? values.integralPerSign : 0;//日签奖励积分，0表示不开启日签奖励

          //连签奖励优惠券ID
          params.bonusVoucher = sel_voucher.couponId != undefined && sel_voucher.couponId > 0 ? sel_voucher.couponId : '';

          if (params.continueNum > 0 && !params.bonusVoucher && !params.bonusIntegral) {
            failTip(`${sldComLanguage('请设置连签奖励')}～`);
            return false;
          }

          let pageData = {};
          pageData.pageShareFlag = values.pageShareFlag;//分享设置是否开启
          pageData.shareData = {};//分享数据
          if (pageData.pageShareFlag) {
            let shareData = {};
            shareData.shareTitle = values.shareTitle;//分享标题
            shareData.shareDesc = values.shareDesc;//分享描述
            //分享图片
            if (uploadImgInfo.shareImgFileList.length > 0) {
              shareData.shareImgPath = uploadImgInfo.shareImgFileList[0].response.data.path;//图片
              shareData.shareImgUrl = uploadImgInfo.shareImgFileList[0].response.data.url;//图片
            } else {
              failTip(`${sldComLanguage('请上传分享图片')}～`);
              return false;
            }
            pageData.shareData = shareData;
          }
          pageData.pagetipFlag = values.pagetipFlag;//提醒设置是否开启
          pageData.tipData = {};//弹窗提醒图片数据
          if (pageData.pagetipFlag) {
            let tipData = {};
            //弹窗图片
            if (uploadImgInfo.tipImgFileList.length > 0) {
              tipData.imgPath = uploadImgInfo.tipImgFileList[0].response.data.path;//图片
              tipData.imgUrl = uploadImgInfo.tipImgFileList[0].response.data.url;//图片
            } else {
              failTip(`${sldComLanguage('请上传弹窗图片')}～`);
              return false;
            }
            pageData.tipData = tipData;
          }
          params.templateJson = JSON.stringify(pageData);//页面设置数据
          sthis.setState({ loading: true });
          let dis_type = '';
          if (query.id != undefined && query.id > 0 && query.tar == 'edit') {
            //编辑签到
            params.signActivityId = query.id;
            dis_type = 'sign/edit';
          } else {
            //新增签到
            dis_type = 'sign/add';
          }
          dispatch({
            type: dis_type,
            payload: params,
            callback: (res) => {
              sthis.setState({ loading: false });
              if (res.state == 200) {
                sucTip(res.msg);
                setTimeout(() => {
                  sthis.props.history.goBack();
                }, 500);
              } else {
                failTip(res.msg);
              }
            },
          });

        }
      },
    );
  };


  //开关事件
  handleSwitch = (e, type) => {
    this.setState({ [type]: e.target.checked });
  };

  //送优惠券事件
  handleVoucher = (e, type) => {
    if (e.target.checked) {
      this.setState({ link_type: 'voucher' });
    } else {
      this.setState({
        sel_voucher: {},
      });
    }
  };

  resetSel = (type) => {
    this.setState({ link_type: type });
  };

  //选择商品或者优惠券取消事件
  sldHandleLinkCancle = () => {
    let { link_type } = this.state;
    if (link_type == 'voucher') {
      this.props.form.resetFields(['sendCouponIds']);
    }
    this.setState({ link_type: '' });
  };

  //商品或优惠券选中事件
  seleSku = (val) => {
    let { link_type, sel_voucher } = this.state;
    if (link_type == 'voucher') {
      sel_voucher = val;
    }
    this.setState({ link_type: '', sel_voucher });
  };

  //预览图片
  uploadPreview = (info) => {
    this.viewImg(true, info.response.data.url);
  };

  //上传图片
  uploadChange = (info, type) => {
    let { uploadImgInfo } = this.state;
    if (info.file.status != undefined && info.file.status != 'error') {
      uploadImgInfo[type] = info.fileList;
    }
    this.setState({ uploadImgInfo });
  };

  //预览图片/关闭预览图片
  viewImg = (flag, img = '', text = '') => {
    this.setState({
      preview_img: img,
      preview_alt_con: text,
      show_preview_modal: flag,
    });
  };

  //验证活动时间，不可超过30天
  validateActivityTime = (rule, value, callback) => {
    if (value.length == 2 && (value[1].unix() * 1 - value[0].unix() * 1 > 30 * 24 * 60 * 60)) {
      callback(sldComLanguage('签到周期不可以超过30天'));
    } else {
      callback();
    }
  };

  changeCalData = (dateRange) => {
    this.setState({ dateRange });
  };
  onChangeData = (dateRange) => {
    if (!dateRange.length) {
      this.setState({ dateRange });
    }
  };

  render() {
    const { loading, detail, link_type, sel_voucher, viewFlag, perSignFlag, continueSignFlag, pageShareFlag,
      pagetipFlag, continueSignPointFlag, uploadImgInfo, preview_img, preview_alt_con, show_preview_modal, dateRange } = this.state;
    let {
      form: { getFieldDecorator },
    } = this.props;
    const disabledDate = (currentDate) => {
      if (dateRange.length) {
        return currentDate && (currentDate < moment().subtract(1, 'days')
          || currentDate < moment(dateRange[0]).subtract(29, 'days')
          || currentDate > moment(dateRange[0]).add(29, 'days'));
      } else {
        return currentDate && currentDate < moment().subtract(1, 'days');
      }
    };
    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">{sldComLanguage('上传图片')}</div>
      </div>
    );
    return (
      <div className={`${promotion.full_activity} ${global.common_page} ${global.com_flex_column}`}
           style={{ position: 'relative' }}>
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('签到活动')}`, 0, 0, 10)}
        {getSldHorLine(1)}
        <Spin spinning={loading}>
          <Form layout="inline">
            <Scrollbars
              autoHeight
              autoHeightMin={100}
              autoHeightMax={document.body.clientHeight - 160}>
              <div className={`${global.goods_sku_tab} ${global.add_goods_wrap}`}>
                <div>
                  {getSldEmptyH(10)}
                  {sldCommonTitleByBg(`${sldComLanguage('规则设置')}`)}
                  <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: 'red' }}>*</span>{sldComLanguage('签到周期')}
                      </div>
                      <div className={`${promotion.right}`}>
                        <FormItem
                          extra={`${sldComLanguage('活动时间不可与其他活动重叠，签到周期最长为30天')}`}
                          style={{ width: 300 }}
                        >
                          {getFieldDecorator('activityTime', {
                            initialValue: detail.startTime != undefined && detail.startTime
                              ? [moment(detail.startTime, dateTimeFormat), moment(detail.endTime, dateTimeFormat)]
                              : '', rules: [{
                              required: true,
                              message: `${sldComLanguage('请选择活动时间')}`,
                            }, { validator: (rule, value, callback) => this.validateActivityTime(rule, value, callback) }],
                          })(
                            <RangePicker
                              disabledDate={disabledDate}
                              disabled={viewFlag}
                              style={{ width: 400 }}
                              placeholder={[`${sldComLanguage('开始时间')}`, `${sldComLanguage('结束时间')}`]}
                              showTime={{ format: 'HH:mm' }}
                              format="YYYY-MM-DD HH:mm:00"
                              getCalendarContainer={(triggerNode) => {
                                return triggerNode.parentNode;
                              }}
                              onCalendarChange={this.changeCalData}
                              onChange={this.onChangeData}
                            />,
                          )}
                        </FormItem>
                      </div>
                    </div>


                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        {sldComLanguage('日签奖励')}
                      </div>
                      <div className={`${promotion.right} ${global.flex_column_start_start}`}>
                        <FormItem
                          style={{ width: 300 }}
                        >
                          {getFieldDecorator('perSignFlag', { initialValue: perSignFlag, valuePropName: 'checked' })(
                            <Checkbox
                              disabled={viewFlag}
                              onChange={(e) => this.handleSwitch(e, 'perSignFlag')}
                            >
                              {sldComLanguage('开启')}
                            </Checkbox>,
                          )}
                        </FormItem>
                        {getSldEmptyH(10)}
                        {perSignFlag && <FormItem
                          style={{ width: 300 }}
                        >
                          <span style={{ color: 'red' }}>*</span>
                          <span style={{ marginRight: 10 }}>{sldComLanguage('赠送')}</span>
                          {getFieldDecorator('integralPerSign', {
                            initialValue: detail.integralPerSign,
                            rules: [{
                              required: true,
                              message: `${sldComLanguage('该项必填')}`,
                            }],
                          })(
                            <InputNumber disabled={viewFlag} precision={0} style={{ width: 100 }} min={1}
                                         max={9999999}/>,
                          )}<span style={{ marginLeft: 10 }}>{sldComLanguage('积分')}</span>
                        </FormItem>
                        }
                      </div>
                    </div>

                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        {sldComLanguage('连签奖励')}
                      </div>
                      <div className={`${promotion.right} ${global.flex_column_start_start}`}>
                        <div className={`${global.flex_row_start_center}`}>
                          <FormItem>
                            {getFieldDecorator('continueSignFlag', {
                              initialValue: continueSignFlag,
                              valuePropName: 'checked',
                            })(
                              <Checkbox
                                disabled={viewFlag}
                                onChange={(e) => this.handleSwitch(e, 'continueSignFlag')}
                              >
                                {sldComLanguage('开启')}
                              </Checkbox>,
                            )}
                          </FormItem>
                          {continueSignFlag &&
                          <FormItem>
                          <span
                            style={{ marginRight: 10 }}>{sldComLanguage('连续签到')}</span>
                            {getFieldDecorator('continueNum', {
                              initialValue: detail.continueNum, rules: [{
                                required: true,
                                message: `${sldComLanguage('该项必填')}`,
                              }],
                            })(
                              <InputNumber disabled={viewFlag} precision={0} style={{ width: 100 }} min={2} max={20}/>,
                            )}<span style={{ marginLeft: 10 }}>{sldComLanguage('天')}</span>
                          </FormItem>
                          }
                        </div>
                        {getSldEmptyH(10)}
                        {continueSignFlag &&
                        <Fragment>
                          <div className={`${global.flex_row_start_center}`}>
                            <FormItem>
                              {getFieldDecorator('continueSignPointFlag', {
                                initialValue: continueSignPointFlag,
                                valuePropName: 'checked',
                              })(
                                <Checkbox
                                  disabled={viewFlag}
                                  onChange={(e) => this.handleSwitch(e, 'continueSignPointFlag')}
                                >
                                  {sldComLanguage('积分')}
                                </Checkbox>,
                              )}
                            </FormItem>
                            {continueSignPointFlag &&
                            <FormItem>
                          <span
                            style={{ marginRight: 10 }}></span>{getFieldDecorator('bonusIntegral', { initialValue: detail.bonusIntegral })(
                              <InputNumber disabled={viewFlag} precision={0} style={{ width: 100 }} min={1}
                                           max={9999999}/>,
                            )}<span style={{ marginLeft: 10 }}>{sldComLanguage('个')}</span>
                            </FormItem>
                            }
                          </div>
                          {getSldEmptyH(10)}
                          <FormItem
                            style={{ width: 300 }}
                          >
                            {getFieldDecorator('sendCouponIds', {
                              initialValue: sel_voucher.couponId != undefined && sel_voucher.couponId ? true : false,
                              valuePropName: 'checked',
                            })(
                              <Checkbox
                                disabled={viewFlag}
                                onChange={(e) => this.handleVoucher(e)}
                              >
                                {sldComLanguage('送优惠券')}
                              </Checkbox>,
                            )}
                            {sel_voucher.couponId != undefined && sel_voucher.couponId && !viewFlag &&
                            <span className={`${promotion.reset_sel}`}
                                  onClick={() => this.resetSel('voucher')}>{sldComLanguage('重新选择')}</span>
                            }
                          </FormItem>
                        </Fragment>
                        }
                        {sel_voucher.couponId != undefined && sel_voucher.couponId &&
                        <div className={`${promotion.sel_goods} ${global.flex_column_start_start}`}>
                          <div className={`${global.flex_row_start_center}`}><span
                            className={`${promotion.sel_tip}`}>{sldComLanguage('您已选择如下优惠券：')}</span></div>
                          <div className={`${promotion.goods_info} ${global.flex_row_start_center}`}>
                            <div className={`${promotion.left} ${global.flex_row_center_center}`}><img
                              src={require('@/assets/voucher.png')}/></div>
                            <div className={`${global.flex_column_between_start}`}>
                              <span className={`${promotion.goods_name}`}>{sldComLanguage('优惠券')}</span>
                              <span className={`${promotion.goods_price}`}>{sel_voucher.couponName}</span>
                            </div>
                          </div>
                        </div>
                        }
                        {getSldEmptyH(10)}

                      </div>
                    </div>

                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: 'red' }}>*</span>{sldComLanguage('规则说明')}
                      </div>
                      <div className={`${promotion.right} ${global.flex_column_start_start}`}>
                        <FormItem
                          style={{ width: 300 }}
                          extra={`${sldComLanguage('最多输入200字')}`}
                        >
                          {getFieldDecorator('bonusRules', {
                            initialValue: detail.bonusRules, rules: [{
                              required: true,
                              message: `${sldComLanguage('请输入规则说明')}`,
                            }],
                          })(
                            <TextArea disabled={viewFlag} maxLength={200} style={{ minHeight: 32, width: 450 }}
                                      rows={4} placeholder={`${sldComLanguage('请输入规则说明')}`}/>,
                          )}
                        </FormItem>

                      </div>
                    </div>

                  </div>
                  {getSldEmptyH(10)}
                  {sldCommonTitleByBg(`${sldComLanguage('页面设置')}`)}
                  <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>

                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        {sldComLanguage('分享设置')}
                      </div>
                      <div className={`${promotion.right} ${global.flex_column_start_start}`}>
                        <FormItem
                          style={{ width: 300 }}
                        >
                          {getFieldDecorator('pageShareFlag', {
                            initialValue: pageShareFlag,
                            valuePropName: 'checked',
                          })(
                            <Checkbox
                              disabled={viewFlag}
                              onChange={(e) => this.handleSwitch(e, 'pageShareFlag')}
                            >
                              {sldComLanguage('开启')}
                            </Checkbox>,
                          )}
                        </FormItem>
                        {getSldEmptyH(10)}
                        {pageShareFlag &&
                        <Fragment>
                          <div className={`${global.flex_row_start_center}`}>
                            <FormItem
                              style={{ width: 500 }}
                            >
                              <span style={{ color: 'red' }}>*</span><span
                              style={{ marginRight: 10 }}>{sldComLanguage('分享标题')}</span>
                              {getFieldDecorator('shareTitle', {
                                initialValue: detail.shareTitle, rules: [{
                                  required: true,
                                  whitespace: true,
                                  message: `${sldComLanguage('请输入分享标题')}`,
                                }],
                              })(
                                <Input disabled={viewFlag} placeholder={'请输入分享标题'} style={{ width: 400 }} maxLength={15}/>,
                              )}
                            </FormItem>
                          </div>
                          {getSldEmptyH(10)}
                          <div className={`${global.flex_row_start_center}`}>
                            <FormItem
                              style={{ width: 500 }}
                            >
                              <span style={{ color: 'red' }}>*</span><span
                              style={{ marginRight: 10 }}>{sldComLanguage('分享描述')}</span>
                              {getFieldDecorator('shareDesc', {
                                initialValue: detail.shareDesc, rules: [{
                                  required: true,
                                  whitespace: true,
                                  message: `${sldComLanguage('请输入分享描述')}`,
                                }],
                              })(
                                <Input disabled={viewFlag} placeholder={'请输入分享描述'} style={{ width: 400 }} maxLength={50}/>,
                              )}
                            </FormItem>
                          </div>
                          {getSldEmptyH(10)}
                          <div className={`${global.flex_row_start_center}`}>
                            <FormItem
                              style={{ width: 500 }}
                            >
                              <div className={`${global.flex_row_start_start}`}>
                                <span style={{ color: 'red' }}>*</span>
                                <span style={{ marginRight: 10 }}>{sldComLanguage('分享图片')}</span>
                                <Upload
                                  disabled={viewFlag}
                                  withCredentials={true}
                                  beforeUpload={sldBeforeUpload}
                                  accept={'.gif, .jpeg, .png,.jpg,'}
                                  name={'file'}
                                  action={apiUrl + `v3/oss/common/upload?source=setting`}
                                  listType="picture-card"
                                  fileList={uploadImgInfo.shareImgFileList}
                                  onPreview={(info) => this.uploadPreview(info)}
                                  onChange={(info) => this.uploadChange(info, 'shareImgFileList')}
                                  headers={{
                                    Authorization: 'Bearer ' + getLocalStorageStingVal('sld_token'),
                                  }}
                                >
                                  {uploadImgInfo.shareImgFileList.length >= 1 ? null : uploadButton}
                                </Upload>
                              </div>
                            </FormItem>
                          </div>
                        </Fragment>
                        }
                      </div>
                    </div>
                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        {sldComLanguage('提醒设置')}
                      </div>
                      <div className={`${promotion.right} ${global.flex_column_start_start}`}>
                        <FormItem
                          extra={'开启提醒,未签到用户每日第1次访问商城个人中心时会弹出签到弹窗'}
                          style={{ width: 500 }}
                        >
                          {getFieldDecorator('pagetipFlag', { initialValue: pagetipFlag, valuePropName: 'checked' })(
                            <Checkbox
                              disabled={viewFlag}
                              onChange={(e) => this.handleSwitch(e, 'pagetipFlag')}
                            >
                              {sldComLanguage('开启')}
                            </Checkbox>,
                          )}
                        </FormItem>
                        {getSldEmptyH(10)}
                        {pagetipFlag &&
                        <Fragment>
                          <div className={`${global.flex_row_start_center}`}>
                            <FormItem
                              style={{ width: 500 }}
                            >
                              <div className={`${global.flex_row_start_start}`}>
                                <span style={{ color: 'red' }}>*</span>
                                <span style={{ marginRight: 10 }}>{sldComLanguage('弹窗图片')}</span>
                                <Upload
                                  disabled={viewFlag}
                                  withCredentials={true}
                                  beforeUpload={sldBeforeUpload}
                                  accept={'.gif, .jpeg, .png,.jpg,'}
                                  name={'file'}
                                  action={apiUrl + `v3/oss/common/upload?source=setting`}
                                  listType="picture-card"
                                  fileList={uploadImgInfo.tipImgFileList}
                                  onPreview={(info) => this.uploadPreview(info)}
                                  onChange={(info) => this.uploadChange(info, 'tipImgFileList')}
                                  headers={{
                                    Authorization: 'Bearer ' + getLocalStorageStingVal('sld_token'),
                                  }}
                                >
                                  {uploadImgInfo.tipImgFileList.length >= 1 ? null : uploadButton}
                                </Upload>
                              </div>
                            </FormItem>
                          </div>
                        </Fragment>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {getSldEmptyH(15)}
              <div className={global.m_diy_bottom_wrap}
                   style={{ position: 'fixed', left: this.props.global.collapsed ? 90 : 160 }}>
                <div onClick={() => this.props.history.goBack()} className={global.add_goods_bottom_btn}>
                  {sldComLanguage('返回')}
                </div>
                {!viewFlag &&
                <div onClick={() => this.props.form.submit(this.handleSaveAllData)}
                     className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel}`}>
                  {sldComLanguage('保存')}
                </div>
                }
              </div>
            </Scrollbars>
          </Form>
        </Spin>
        {/*图片预览-start*/}
        <SldPreviewImg img={preview_img} show_preview_modal={show_preview_modal} modal_width={500}
                       preview_alt_con={preview_alt_con} closePreviewModal={() => this.viewImg(false)}/>
        {/*图片预览-end*/}
        <SldSelGoodsSingleDiy link_type={link_type}
                              seleSku={this.seleSku}
                              sldHandleCancle={this.sldHandleLinkCancle}
                              client={'mobile'}/>
      </div>
    );
  }
};
