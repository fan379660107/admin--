/*
* 添加奖项具体内容
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Input, InputNumber, Upload, Icon, Radio } from 'antd';
import {
  failTip,
  sldComLanguage,
  sldBeforeUpload,
  getLocalStorageStingVal,
  getSldEmptyH,
} from '@/utils/utils';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import SldSelGoodsSingleDiy from '@/components/SldSelGoodsSingleDiy';
import { apiUrl } from '@/utils/sldconfig.js';
import SldPreviewImg from '@/components/SldPreviewImg/SldPreviewImg';

let sthis = '';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
@connect(({ promotion, global }) => ({
  promotion, global,
}))
@Form.create()
export default class AddDetailContent extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      prizeType: 1,//奖品类型，1为积分，2为优惠券
      curTotalRate: 0,//当前总共的中奖率之和
      allowMaxRate: 0,//当前允许输入的最大值
      preview_img: '',
      preview_alt_con: '',
      show_preview_modal: false,
      sel_voucher: {},//选择的优惠券信息
      link_type: '',
      loading: false,
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      detail: {},//活动详情数据
      bgFileList: [],//奖项图片
    };
  }

  curSaveFlag = false;

  componentDidMount() {
    this.curSaveFlag = this.props.saveFlag;
    let { detail, bgFileList, sel_voucher, allowMaxRate, prizeType } = this.state;
    let { editPrizeKey, prizeData } = this.props;
    let curTotalRate = 0;
    if (prizeData.length > 0) {
      prizeData.map(item => {
        curTotalRate += item.rate * 1;
      });
    }
    allowMaxRate = 100 - curTotalRate;
    if (editPrizeKey > 0) {
      detail = prizeData.filter(item => item.key == editPrizeKey)[0];
      //图片的处理
      bgFileList = [];
      if (detail.prizeImage) {
        let tmp_data = {};
        tmp_data.uid = detail.prizeImage;
        tmp_data.name = detail.prizeImage;
        tmp_data.status = 'done';
        tmp_data.url = detail.prizeImageUrl;
        tmp_data.response = {
          data: {
            url: detail.prizeImageUrl,
            path: detail.prizeImage,
          },
        };
        bgFileList.push(tmp_data);
      }
      //选中的优惠券处理
      if (detail.prizeType == 2) {
        sel_voucher.couponId = detail.couponId;
        sel_voucher.couponName = detail.couponName;
        sel_voucher.couponValueStr = detail.couponValueStr;
        sel_voucher.couponContent = detail.couponContent;
      }
      allowMaxRate = allowMaxRate + detail.rate * 1;
      prizeType = detail.prizeType;
    }
    this.setState({ detail, bgFileList, sel_voucher, curTotalRate, allowMaxRate, prizeType });
  }

  componentWillReceiveProps(nextProps, nextContext) {

    if (nextProps.saveFlag && nextProps.saveFlag > this.curSaveFlag) {
      this.curSaveFlag = nextProps.saveFlag;
      let { bgFileList, sel_voucher, prizeType } = this.state;
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          //判断奖品名字是否重复
          if(nextProps.prizeData.length>0){
            for(let i in nextProps.prizeData){
              if(values.prizeName==nextProps.prizeData[i].prizeName){
                if((nextProps.editPrizeKey&&nextProps.editPrizeKey!=nextProps.prizeData[i].key)||!nextProps.editPrizeKey){
                  failTip(`${sldComLanguage('奖项名称不可重复')}～`);
                  return false;
                }
              }
            }
          }
          if (bgFileList.length == 0) {
            values.prizeImage = '';
            values.prizeImageUrl = '';
          } else {
            values.prizeImage = bgFileList[0].response.data.path;
            values.prizeImageUrl = bgFileList[0].response.data.url;
          }
          values.prizeType = prizeType;//奖品类型，1为积分，2为优惠券
          if (values.prizeType == 2) {
            if (sel_voucher.couponId == undefined) {
              failTip(`${sldComLanguage('请选择优惠券')}～`);
              return;
            } else {
              values.couponId = sel_voucher.couponId;
              values.couponName = sel_voucher.couponName;
              values.couponContent = sel_voucher.couponContent;
            }
          }

          this.props.handlePrizeData(values);
        }
      });
    }
    this.saveFlag = nextProps.saveFlag;
  }

  componentWillUnmount() {
  }

  //送优惠券事件
  handleVoucher = (e) => {
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

  //选择优惠券取消事件
  sldHandleLinkCancle = () => {
    let { link_type } = this.state;
    if (link_type == 'voucher') {
      this.props.form.resetFields(['sendCouponIds']);
    }
    this.setState({ link_type: '' });
  };

  //优惠券选中事件
  seleSku = (val) => {
    let { sel_voucher } = this.state;
    sel_voucher = val;

    //优惠券类型(1-固定金额券；2-折扣券（折扣比例）；3-随机金额券）
    if (sel_voucher.couponType == 1) {
      sel_voucher.couponName = sel_voucher.publishValue * 1 + '元券';
    } else if (sel_voucher.couponType == 2) {
      sel_voucher.couponName = (sel_voucher.publishValue / 10).toFixed(1) * 1 + '折券';
    } else if (sel_voucher.couponType == 3) {
      sel_voucher.couponName = sel_voucher.randomMin * 1 + '～' + sel_voucher.randomMax * 1 + '元随机券';
    }
    this.setState({ link_type: '', sel_voucher });
  };

  //预览图片
  uploadPreview = (info) => {
    this.viewImg(true, info.response.data.url);
  };

  //上传图片
  uploadChange = (info, type) => {
    if (info.file.status != undefined && info.file.status != 'error') {
      this.setState({ [type]: info.fileList });
    }
  };

  //预览图片/关闭预览图片
  viewImg = (flag, img = '', text = '') => {
    this.setState({
      preview_img: img,
      preview_alt_con: text,
      show_preview_modal: flag,
    });
  };

  //奖品类型点击事件
  handlePrizeType = (e) => {
    let { sel_voucher } = this.state;
    if (e.target.value == 1) {
      sel_voucher = {};
    } else {
      this.props.form.resetFields(['integralNum']);
    }
    this.setState({ prizeType: e.target.value, sel_voucher });
  };

  render() {
    const { loading, detail, link_type, sel_voucher, bgFileList, preview_img, preview_alt_con, show_preview_modal, curTotalRate, allowMaxRate, prizeType } = this.state;
    let { form: { getFieldDecorator }, drawType } = this.props;
    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">{sldComLanguage('上传图片')}</div>
      </div>
    );
    //奖品图片尺寸提示
    let uploadImgW = 54;
    let uploadImgH = 54;
    //抽奖活动类型，1-幸运抽奖，2-大转盘，3-刮刮卡，4-摇一摇，5-翻翻看
    if (drawType == 1) {
      uploadImgW = 54;
      uploadImgH = 54;
    } else if (drawType == 2) {
      uploadImgW = 62;
      uploadImgH = 62;
    } else if (drawType == 5) {
      uploadImgW = 66;
      uploadImgH = 66;
    }
    let uploadImgExtra = `${sldComLanguage('建议上传')}【${sldComLanguage('宽')}${uploadImgW}*${sldComLanguage('高')}${uploadImgH}】${sldComLanguage('的图片，支持gif，jpeg，jpg，png格式的图片')}`;
    return (
      <div className={`${promotion.full_activity} ${global.common_page} ${global.com_flex_column}`}
           style={{ position: 'relative' }}>
        <Spin spinning={loading}>
          <Form layout="inline">
            <div className={`${global.goods_sku_tab} ${global.add_goods_wrap}`}>
              {/* 基本信息-start */}
              <div>
                <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                  <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                    <div className={`${promotion.left}`} style={{ width: 150 }}>
                      <span style={{ color: 'red' }}>*</span>{sldComLanguage('奖项名称')}
                    </div>
                    <div className={`${promotion.right}`}>
                      <FormItem
                        extra={`${sldComLanguage('最多输入6个字')}`}
                        style={{ width: 300 }}
                      >
                        {getFieldDecorator('prizeName', {
                          initialValue: detail.prizeName, rules: [{
                            required: true,
                            whitespace: true,
                            message: `${sldComLanguage('请输入奖项名称')}`,
                          }],
                        })(
                          <Input maxLength={6} style={{ width: 200 }} placeholder={`${sldComLanguage('请输入奖项名称')}`}/>,
                        )}
                      </FormItem>
                    </div>
                  </div>

                  {(drawType == 1 || drawType == 2 || drawType == 5) &&
                  <Fragment>
                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`} style={{ width: 150 }}>
                        {sldComLanguage('奖项图片')}
                      </div>
                      <div className={`${promotion.right}`}>
                        <FormItem
                          style={{ width: 400 }}
                          extra={uploadImgExtra}
                        >
                          <div className={`${global.flex_row_start_start}`}>
                            <Upload
                              withCredentials={true}
                              beforeUpload={sldBeforeUpload}
                              accept={'.gif, .jpeg, .png,.jpg,'}
                              name={'file'}
                              action={apiUrl + `v3/oss/common/upload?source=setting`}
                              listType="picture-card"
                              fileList={bgFileList}
                              onPreview={(info) => this.uploadPreview(info)}
                              onChange={(info) => this.uploadChange(info, 'bgFileList')}
                              headers={{
                                Authorization: 'Bearer ' + getLocalStorageStingVal('sld_token'),
                              }}
                            >
                              {bgFileList.length >= 1 ? null : uploadButton}
                            </Upload>
                          </div>
                        </FormItem>
                      </div>
                    </div>
                  </Fragment>
                  }

                  <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                    <div className={`${promotion.left}`} style={{ width: 150 }}>
                      <span style={{ color: 'red' }}>*</span>{sldComLanguage('奖品设置')}
                    </div>
                    <div className={`${promotion.right} ${global.flex_column_start_start}`}>

                      <FormItem
                        style={{ width: 300 }}
                      >
                        <RadioGroup size={'small'} value={prizeType} onChange={(e) => this.handlePrizeType(e)}>
                          <div className={global.flex_column_start_start}>
                            <Radio value={1}>
                              <div className={global.flex_row_start_center}>
                                <span className={promotion.input_left_side_tip}>{sldComLanguage('奖励积分')}</span>
                                {getFieldDecorator('integralNum', {
                                  initialValue: detail.integralNum&&prizeType == 1?detail.integralNum:'',
                                  rules: prizeType == 1 ? [{
                                    required: true,
                                    message: `${sldComLanguage('此处必填')}`,
                                  }] : [],
                                })(
                                  <InputNumber disabled={prizeType == 2} max={999999} min={1} precision={0} style={{ width: 75 }}
                                               placeholder={`${sldComLanguage('请输入')}`}/>,
                                )}
                                <span className={promotion.input_right_side_tip}>{sldComLanguage('分')}</span>
                              </div>
                            </Radio>
                            <div className={global.flex_row_start_center}>
                              <Radio value={2}>
                                <div className={global.flex_row_start_center}>
                                  <span className={promotion.input_left_side_tip}>{sldComLanguage('奖励优惠券')}</span>
                                  <span className={`${promotion.reset_sel}`} style={{ fontSize: 12, marginTop: 12 }}
                                        onClick={() => this.resetSel('voucher')}>{sldComLanguage(sel_voucher.couponId != undefined && sel_voucher.couponId ? '重新选择' : '选择优惠券')}</span>
                                </div>
                              </Radio>
                            </div>
                          </div>
                        </RadioGroup>
                      </FormItem>
                      {sel_voucher.couponId != undefined && sel_voucher.couponId &&
                      <div className={`${promotion.sel_goods} ${global.flex_column_start_start}`}>
                        <div className={`${global.flex_row_start_center}`}><span
                          className={`${promotion.sel_tip}`}>{`${sldComLanguage('您已选择如下优惠券')}：`}</span></div>
                        <div className={`${promotion.goods_info} ${global.flex_row_start_center}`}>
                          <div className={`${promotion.left} ${global.flex_row_center_center}`}><img
                            src={require('@/assets/voucher.png')}/></div>
                          <div className={`${global.flex_column_between_start}`}>
                            <span className={`${promotion.goods_name}`}>{sldComLanguage('优惠券')}</span>
                            <span
                              className={`${promotion.goods_price}`}>{sel_voucher.couponName}【{sel_voucher.couponContent}】</span>
                          </div>
                        </div>
                      </div>
                      }
                    </div>
                  </div>

                  <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                    <div className={`${promotion.left}`} style={{ width: 150 }}>
                      <span style={{ color: 'red' }}>*</span>{sldComLanguage('奖品数量')}
                    </div>
                    <div className={`${promotion.right} ${global.flex_column_start_start}`}>
                      <FormItem
                        style={{ width: 300 }}
                      >
                        {getFieldDecorator('prizeNum', {
                          initialValue: detail.prizeNum,
                          rules: [{
                            required: true,
                            message: `${sldComLanguage('此项必填')}`,
                          }],
                        })(
                          <InputNumber style={{ width: 100 }} min={1} max={sel_voucher.couponId != undefined && sel_voucher.couponId?sel_voucher.remainNum:1000000} precision={0}/>,
                        )}<span style={{ marginLeft: 10 }}>{sldComLanguage('份')}{detail.fullValue}</span>
                      </FormItem>
                    </div>
                  </div>

                  <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                    <div className={`${promotion.left}`} style={{ width: 150 }}>
                      <span style={{ color: 'red' }}>*</span>{sldComLanguage('中奖率')}
                    </div>
                    <div className={`${promotion.right} ${global.flex_column_start_start}`}>
                      <div className={global.flex_row_start_center}>
                        <FormItem
                          style={{ width: 125 }}
                        >
                          {getFieldDecorator('rate', {
                            initialValue: detail.rate, rules: [{
                              required: true,
                              message: `${sldComLanguage('此项必填')}`,
                            }],
                          })(
                            <InputNumber style={{ width: 100 }} min={1} max={allowMaxRate} precision={0}/>,
                          )}<span style={{ marginLeft: 10 }}>%{detail.fullValue}</span>
                        </FormItem>
                        {curTotalRate > 0 &&
                        <div>
                          <span>{sldComLanguage('当前已设置奖项中奖率之和为')}</span>
                          <span style={{ color: '#FF1818', fontSize: 13 }}>{curTotalRate}%</span>
                        </div>
                        }
                      </div>
                      <span
                        className={promotion.form_item_bottom_tip}>{sldComLanguage('设为10，则每位抽奖会员的中奖概率为10%，活动全部奖项中奖率之和不可大于100%')}</span>
                    </div>
                  </div>

                </div>
              </div>
              {/* 基本信息-end */}
            </div>
            {getSldEmptyH(15)}
          </Form>
        </Spin>
        <SldSelGoodsSingleDiy link_type={link_type}
                              seleSku={this.seleSku}
                              sldHandleCancle={this.sldHandleLinkCancle}
                              client={'mobile'}/>
        {/*图片预览-start*/}
        <SldPreviewImg img={preview_img} show_preview_modal={show_preview_modal} modal_width={500}
                       preview_alt_con={preview_alt_con} closePreviewModal={() => this.viewImg(false)}/>
        {/*图片预览-end*/}
      </div>
    );
  }
};
