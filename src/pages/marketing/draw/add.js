import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import {
  Form,
  Spin,
  Input,
  InputNumber,
  Radio,
  Upload,
  Icon,
  Switch,
  DatePicker, Modal,
} from 'antd';
import {
  failTip,
  sucTip,
  sldLlineRtextAddGoodsAddMargin,
  sldComLanguage,
  getSldHorLine,
  getSldEmptyH,
  getSldComImg,
  sldBeforeUpload,
  getLocalStorageStingVal,
  list_com_page_size_10,
  sldPopConfirmDiy,
  sldtbaleOpeBtnText,
  dateTimeFormat,
} from '@/utils/utils';
import { sldRankLeft, sldRankRight, sldRankTitleByBg } from '@/utils/utils_v2';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import addRank from '@/assets/css/add_rank.less';
import { apiUrl } from '@/utils/sldconfig.js';
import SldPreviewImg from '@/components/SldPreviewImg/SldPreviewImg';
import AddDetailContent from './add_detail_content';
import moment from 'moment';
import StandardTable from '@/components/StandardTable';

let sthis = '';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
let pageSize = list_com_page_size_10;
@connect(({ draw, global, project }) => ({
  draw, global, project,
}))
@Form.create()
export default class AddRank extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      integralUseType: 1,//活动类型，1为无限制，2为积分抽奖
      ruleType: 1,//活动规则，1为每人每天可抽奖次数，2为每人总共可抽奖次数
      editPrizeKey: 0,//当前编辑的奖项key
      preview_img: '',
      preview_alt_con: '',
      show_preview_modal: false,
      modalVisible: false,//添加奖项弹框是否显示
      saveFlag: 1,//添加奖项弹框保存标识
      query: props.location.query,
      viewFlag: props.location.query.id != undefined && props.location.query.id > 0 && props.location.query.type == 'view',//是否是查看
      bgFileList: [],//活动背景图
      drawBtnEnableFileList: [],//抽奖按钮正常可用时的图片
      drawBtnDisableFileList: [],//抽奖按钮禁用时的图片
      undrawonFileList: [],//未中奖的图片
      isFirstLoading: true,//是否第一次加载
      detail: {},//活动详情
      loading: false,
      params: { pageSize: pageSize },//搜索条件
      columns: [
        {
          title: ' ',
          dataIndex: 'key',
          align: 'center',
          width: 30,
          render: (text, record, index) => index + 1,
        },
        {
          title: `${sldComLanguage('奖项名称')}`,
          dataIndex: 'prizeName',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('奖品图片')}`,
          dataIndex: 'prizeImageUrl',
          align: 'center',
          width: 100,
          render: (text, record) => {
            return text?getSldComImg(text, 100, 100, 20, 20):'--';
          },
        },
        {
          title: `${sldComLanguage('奖品类型')}`,
          dataIndex: 'prizeType',
          align: 'center',
          width: 100,
          render: (text, record) => {
            let target = '';
            //奖品类型，1-积分，2-优惠券
            if (text == 1) {
              target = `${sldComLanguage('积分')}`;
            } else {
              target = `${sldComLanguage('优惠券')}`;
            }
            return target;
          },
        },
        {
          title: `${sldComLanguage('奖品')}`,
          dataIndex: 'couponName',
          align: 'center',
          width: 100,
          render: (text, record) => {
            let target = '';
            //奖品类型，1-积分，2-优惠券
            if (record.prizeType == 1) {
              target = `${record.integralNum}${sldComLanguage('积分')}`;
            } else {
              target = `${record.couponName}【${record.couponContent}】`;
            }
            return target;
          },
        },
        {
          title: `${sldComLanguage('奖品数量')}`,
          dataIndex: 'prizeNum',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('中奖率')}`,
          dataIndex: 'rate',
          align: 'center',
          width: 100,
          render: (text, record) => {
            return text + '%';
          },
        },
        {
          title: `${sldComLanguage('操作')}`,
          align: 'center',
          dataIndex: 'operation',
          width: 100,
          render: (text, record) => (
            <Fragment>
              {sldtbaleOpeBtnText(`${sldComLanguage('编辑')}`, () => this.editPrize(record.key))}
              <span className={global.splitLine}></span>
              {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}？`, () => this.delPrize(record.key), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
            </Fragment>
          ),
        },
      ],
      prizeData: [],//奖项数据
    };
  }

  componentDidMount() {
    let { query,columns } = this.state;
    if (query.id != undefined && query.id > 0) {
      this.getDetail(query.id);
    } else {
      this.setState({ isFirstLoading: false });
    }
    if(query.drawType == 3||query.drawType == 4){
      columns = columns.filter(item => item.dataIndex != 'prizeImageUrl');
      this.setState({columns})
    }
    this.props.dispatch({
      type: 'global/getLayoutCollapsed',
    });
  }

  //获取活动详情
  getDetail = (id) => {
    const { dispatch } = this.props;
    let { bgFileList, detail, drawBtnEnableFileList, drawBtnDisableFileList, undrawonFileList, ruleType, integralUseType, prizeData, viewFlag, columns, query } = this.state;
    this.setState({ loading: true });
    dispatch({
      type: 'draw/get_activity_detail',
      payload: { drawId: id },
      callback: (res) => {
        if (res.state == 200) {
          let data = res.data;
          //初始化活动背景图数据-start
          bgFileList = [];
          if (data.backgroundImage) {
            let tmp_data = {};
            tmp_data.uid = data.backgroundImage;
            tmp_data.name = data.backgroundImage;
            tmp_data.status = 'done';
            tmp_data.url = data.backgroundImageUrl;
            tmp_data.response = {
              data: {
                url: data.backgroundImageUrl,
                path: data.backgroundImage,
              },
            };
            bgFileList.push(tmp_data);
          }
          //初始化活动背景图数据-end

          //初始化抽奖按钮正常可用时按钮图片数据-start
          drawBtnEnableFileList = [];
          if (data.availableButtonImage) {
            let tmp_data = {};
            tmp_data.uid = data.availableButtonImage;
            tmp_data.name = data.availableButtonImage;
            tmp_data.status = 'done';
            tmp_data.url = data.availableButtonImageUrl;
            tmp_data.response = {
              data: {
                url: data.availableButtonImageUrl,
                path: data.availableButtonImage,
              },
            };
            drawBtnEnableFileList.push(tmp_data);
          }
          //初始化抽奖按钮正常可用时按钮图片数据-end

          //初始化抽奖按钮禁用时的图片数据-start
          drawBtnDisableFileList = [];
          if (data.chanceOutButtonImage) {
            let tmp_data = {};
            tmp_data.uid = data.chanceOutButtonImage;
            tmp_data.name = data.chanceOutButtonImage;
            tmp_data.status = 'done';
            tmp_data.url = data.chanceOutButtonImageUrl;
            tmp_data.response = {
              data: {
                url: data.chanceOutButtonImageUrl,
                path: data.chanceOutButtonImage,
              },
            };
            drawBtnDisableFileList.push(tmp_data);
          }
          //初始化抽奖按钮禁用时的图片数据-end

          //初始化未中奖的图片数据-start
          undrawonFileList = [];
          if (data.losePrizeImage) {
            let tmp_data = {};
            tmp_data.uid = data.losePrizeImage;
            tmp_data.name = data.losePrizeImage;
            tmp_data.status = 'done';
            tmp_data.url = data.losePrizeImageUrl;
            tmp_data.response = {
              data: {
                url: data.losePrizeImageUrl,
                path: data.losePrizeImage,
              },
            };
            undrawonFileList.push(tmp_data);
          }
          //初始化未中奖的图片数据-end

          integralUseType = data.integralUse ? 2 : 1;//活动类型，1为无限制，2为积分抽奖
          ruleType = data.ruleType;//活动规则，1为每人每天可抽奖次数，2为每人总共可抽奖次数
          if (ruleType == 1) {
            data.ruleNumDay = data.ruleNum;
          } else {
            data.ruleNumTotal = data.ruleNum;
          }

          //奖项数据
          let key = 1;
          data.drawPrizeVOList.map(item => {
            item.key = key;
            key++;
            prizeData.push(item);
          });

          if (viewFlag) {
            //查看
            columns = columns.filter(item => item.dataIndex != 'operation');
          }

          if (query.type != undefined && query.type == 'copy') {
            //复制的情况，需要清空活动名称和活动时间
            data.drawName = '';
            data.startTime = '';
          }

          detail = data;
        }
        this.setState({
          isFirstLoading: false,
          loading: false,
          detail,
          bgFileList,
          drawBtnEnableFileList,
          drawBtnDisableFileList,
          undrawonFileList,
          ruleType,
          integralUseType,
          prizeData,
          columns,
        });
      },
    });
  };

  //保存并新增事件
  handleSaveAllData = () => {
    const { dispatch } = this.props;
    const { query, bgFileList, prizeData, drawBtnEnableFileList, drawBtnDisableFileList, undrawonFileList, integralUseType, ruleType } = this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let dis_type = '';

          values.drawType = query.drawType;//抽奖活动类型，1-幸运抽奖，2-大转盘，3-刮刮卡，4-摇一摇，5-翻翻看

          //活动时间处理
          if (values.activityTime) {
            values.startTime = values.activityTime[0] ? values.activityTime[0].format(dateTimeFormat) : '';
            values.endTime = values.activityTime[1] ? values.activityTime[1].format(dateTimeFormat) : '';
            if (values.activityTime[0].unix() == values.activityTime[1].unix()) {
              failTip(`${sldComLanguage('活动结束时间必须晚于开始时间')}～`);
              return false;
            }
            delete values.activityTime;
          }

          //活动背景图
          if (bgFileList.length > 0 && bgFileList[0].response != undefined && bgFileList[0].response.data != undefined) {
            values.backgroundImage = bgFileList[0].response.data.path;
          } else {
            values.backgroundImage = '';
          }

          //正常可用时按钮图片
          if (drawBtnEnableFileList.length > 0 && drawBtnEnableFileList[0].response != undefined && drawBtnEnableFileList[0].response.data != undefined) {
            values.availableButtonImage = drawBtnEnableFileList[0].response.data.path;
          } else {
            values.availableButtonImage = '';
          }

          //机会用尽时按钮图片
          if (drawBtnDisableFileList.length > 0 && drawBtnDisableFileList[0].response != undefined && drawBtnDisableFileList[0].response.data != undefined) {
            values.chanceOutButtonImage = drawBtnDisableFileList[0].response.data.path;
          } else {
            values.chanceOutButtonImage = '';
          }

          //未中奖图片
          if (undrawonFileList.length > 0 && undrawonFileList[0].response != undefined && undrawonFileList[0].response.data != undefined) {
            values.losePrizeImage = undrawonFileList[0].response.data.path;
          } else {
            values.losePrizeImage = '';
          }
          values.ruleType = ruleType;
          if (values.ruleType == 1) {
            values.ruleNum = values.ruleNumDay;
          } else {
            values.ruleNum = values.ruleNumTotal;
          }
          delete values.ruleNumDay;
          delete values.ruleNumTotal;
          if (integralUseType == 1) {
            values.integralUse = 0;
          }

          values.openVirtual = values.openVirtual ? 1 : 0;

          //奖品
          values.drawPrizeInfoList = [];
          if (prizeData.length > 0) {
            prizeData.map(item => {
              let temp = {};
              temp.prizeType = item.prizeType;
              //奖品类型，1-积分，2-优惠券
              if (temp.prizeType == 1) {
                temp.integralNum = item.integralNum;
              } else {
                temp.couponId = item.couponId;
              }
              temp.prizeImage = item.prizeImage;
              temp.prizeName = item.prizeName;
              temp.prizeNum = item.prizeNum;
              temp.rate = item.rate;
              values.drawPrizeInfoList.push(temp);
            });
          } else {
            failTip(`${sldComLanguage('请设置奖品')}～`);
            return;
          }

          if (query.id != undefined && query.id > 0 && query.type == 'edit') {
            //编辑活动
            values.drawId = query.id;
            dis_type = 'draw/edit_activity';
          } else {
            //新建活动
            dis_type = 'draw/add_activity';
          }
          sthis.setState({ loading: true });
          dispatch({
            type: dis_type,
            payload: values,
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

  //添加奖品
  addPrize = () => {
    let { prizeData } = this.state;
    let curTotalRate = 0;
    if (prizeData.length >= 6) {
      failTip(`${sldComLanguage('最多添加6个奖项')}～`);
      return false;
    } else {
      prizeData.map(item => {
        curTotalRate += item.rate * 1;
      });
      if (curTotalRate >= 100) {
        failTip(`${sldComLanguage('中奖率已超100%，无法继续添加奖项')}～`);
        return false;
      }
    }
    this.setState({ modalVisible: true });
  };

  //添加奖项确定事件
  sldHandleConfirm = () => {
    let { saveFlag } = this.state;
    saveFlag++;
    this.setState({ saveFlag });
  };

  //添加奖项弹框取消事件
  sldHandleCancle = () => {
    this.setState({ modalVisible: false, editPrizeKey: 0 });
  };

  //处理添加奖项的数据
  handlePrizeData = (e) => {
    let { prizeData, editPrizeKey } = this.state;
    if (editPrizeKey > 0) {
      for (let i in prizeData) {
        if (prizeData[i]['key'] == editPrizeKey) {
          prizeData[i] = { ...e, key: editPrizeKey };
          break;
        }
      }
    } else {
      prizeData.push({ ...e, key: prizeData.length + 1 });
    }
    this.setState({
      prizeData: JSON.parse(JSON.stringify(prizeData)),
      saveFlag: false,
      modalVisible: false,
      editPrizeKey: 0,
    });
  };

  //删除奖项
  delPrize = (key) => {
    let { prizeData } = this.state;
    prizeData = prizeData.filter(item => item.key != key);
    this.setState({ prizeData });
  };

  //编辑奖项
  editPrize = (key) => {
    this.setState({ editPrizeKey: key, modalVisible: true });
  };

  //活动类型点击事件
  handleIntegralUseType = (e) => {
    if (e.target.value == 1) {
      this.props.form.resetFields(['integralUse']);
    }
    this.setState({ integralUseType: e.target.value });
  };

  //活动规则点击事件
  handleRuleType = (e) => {
    if (e.target.value == 1) {
      this.props.form.resetFields(['ruleNumTotal']);
    } else {
      this.props.form.resetFields(['ruleNumDay']);
    }
    this.setState({ ruleType: e.target.value });
  };


  render() {
    const {
      loading, detail, isFirstLoading, bgFileList, drawBtnEnableFileList, drawBtnDisableFileList, undrawonFileList, query, viewFlag, preview_img, show_preview_modal, preview_alt_con, modalVisible, saveFlag, prizeData, columns, editPrizeKey, integralUseType, ruleType,
    } = this.state;
    let {
      form: { getFieldDecorator },
    } = this.props;
    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">{sldComLanguage('上传图片')}</div>
      </div>
    );
    //页面标题的处理
    let pageTitle = `${sldComLanguage('新建活动')}`;
    if (query.type != undefined) {
      if (query.type == 'edit') {
        pageTitle = `${sldComLanguage('编辑活动')}`;
      } else if (query.type == 'view') {
        pageTitle = `${sldComLanguage('查看活动')}`;
      } else {
        pageTitle = `${sldComLanguage('复制活动')}`;
      }
    }
    //未中奖图片尺寸提示
    let undrawonImgW = 54;//未中奖图片的宽度
    let undrawonImgH = 54;//未中奖图片的高度
    //抽奖活动类型，1-幸运抽奖，2-大转盘，3-刮刮卡，4-摇一摇，5-翻翻看
    if(query.drawType == 1){
      undrawonImgW = 54;
      undrawonImgH = 54;
    }else if(query.drawType == 2){
      undrawonImgW = 62;
      undrawonImgH = 62;
    }else if(query.drawType == 5){
      undrawonImgW = 66;
      undrawonImgH = 66;
    }
    let undrawonExtra = `${sldComLanguage('建议上传')}【${sldComLanguage('宽')}${undrawonImgW}*${sldComLanguage('高')}${undrawonImgH}】${sldComLanguage('的图片，支持gif，jpeg，jpg，png格式的图片')}`;
    return (
      <div className={`${global.common_page} ${global.com_flex_column}`} style={{ position: 'relative' }}>
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', pageTitle, 0, 0, 10)}
        {getSldHorLine(1)}
        {getSldEmptyH(20)}
        <Spin spinning={loading}>
          <Form layout="inline">
            <Scrollbars
              autoHeight
              autoHeightMin={100}
              autoHeightMax={document.body.clientHeight - 120}>
              <div
                className={`${global.goods_sku_tab} ${global.add_goods_wrap} ${promotion.full_activity} ${global.flex_column_start_center}`}>

                {/* 基本信息-start */}
                {!isFirstLoading &&
                <Fragment>
                  {sldRankTitleByBg(`${sldComLanguage('基本信息')}`)}
                  <div className={addRank.sld_det_lr_wrap}>
                    <div className={`${addRank.sld_det_lr_item_wrap} ${global.flex_row_start_center}`}>
                      {sldRankLeft(true, sldComLanguage('活动名称'), 1)}
                      {sldRankRight(<FormItem
                        extra={`${sldComLanguage('最多输入6个字')}`}
                        style={{ width: 300 }}
                      >
                        {getFieldDecorator('drawName', {
                          initialValue: detail.drawName, rules: [{
                            required: true,
                            whitespace: true,
                            message: `${sldComLanguage('请输入活动名称')}`,
                          }],
                        })(
                          <Input disabled={viewFlag} maxLength={6} style={{ width: 400 }}
                                 placeholder={`${sldComLanguage('请输入活动名称')}`}/>,
                        )}
                      </FormItem>, 1)}
                    </div>


                    <div className={`${addRank.sld_det_lr_item_wrap} ${global.flex_row_start_center}`} style={{
                      width: 1000,
                    }}>
                      {sldRankLeft(true, sldComLanguage('活动时间'), 0)}
                      {sldRankRight(<FormItem
                        style={{ width: 400 }}
                      >
                        {getFieldDecorator('activityTime', {
                          initialValue: detail.startTime != undefined && detail.startTime ? [moment(detail.startTime, dateTimeFormat), moment(detail.endTime, dateTimeFormat)] : [],
                          rules: [{
                            required: true,
                            message: `${sldComLanguage('请选择活动时间')}`,
                          }],
                        })(
                          <RangePicker
                            disabled={viewFlag}
                            disabledDate={(current) => current < moment().startOf('day')}
                            style={{ width: 350 }}
                            placeholder={[`${sldComLanguage('开始时间')}`, `${sldComLanguage('结束时间')}`]}
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm:00"
                            getCalendarContainer={(triggerNode) => {
                              return triggerNode.parentNode;
                            }}
                          />,
                        )}
                      </FormItem>, 0)}
                    </div>

                    <div className={`${addRank.sld_det_lr_item_wrap} ${global.flex_row_start_center}`} style={{
                      width: 1000,
                    }}>
                      {sldRankLeft(true, sldComLanguage('活动类型'), 0)}
                      {sldRankRight(<FormItem
                        style={{ width: 700 }}
                      >
                        <RadioGroup disabled={viewFlag} size={'small'} value={integralUseType}
                                    onChange={(e) => this.handleIntegralUseType(e)}>
                          <div className={global.flex_row_start_center}>
                            <Radio value={1}>{sldComLanguage('无限制')}</Radio>
                            <div className={global.flex_row_start_center}>
                              <Radio value={2}>
                                <div className={global.flex_row_start_center}>
                                  <span className={promotion.input_left_side_tip}>{sldComLanguage('积分抽奖，单次抽奖消耗')}</span>
                                  {getFieldDecorator('integralUse', {
                                    initialValue: detail.integralUse!=undefined&&detail.integralUse?detail.integralUse:'',
                                    rules: integralUseType == 2 ? [{
                                      required: true,
                                      message: `${sldComLanguage('此处必填')}`,
                                    }] : [],
                                  })(
                                    <InputNumber max={1000000} min={1} precision={0} style={{ width: 100 }} disabled={viewFlag||integralUseType==1}
                                                 placeholder={`${sldComLanguage('请输入')}`}/>,
                                  )}
                                  <span className={promotion.input_right_side_tip}>{sldComLanguage('分')}</span>
                                </div>
                              </Radio>
                            </div>
                          </div>
                        </RadioGroup>
                      </FormItem>, 0)}
                    </div>


                    <div className={`${addRank.sld_det_lr_item_wrap} ${global.flex_row_start_center}`} style={{
                      width: 1000,
                    }}>
                      {sldRankLeft(true, sldComLanguage('活动规则'), 0)}
                      {sldRankRight(<Fragment>
                        <RadioGroup disabled={viewFlag} size={'small'} value={ruleType}
                                    onChange={(e) => this.handleRuleType(e)}>
                          <div className={global.flex_row_start_center}>
                            <Radio value={1}>
                              <div className={global.flex_row_start_center}>
                                <span className={promotion.input_left_side_tip}>{sldComLanguage('每人每天可抽奖')}</span>
                                <FormItem>
                                  {getFieldDecorator('ruleNumDay', {
                                    initialValue: detail.ruleNumDay,
                                    rules: ruleType == 1 ? [{
                                      required: true,
                                      message: `${sldComLanguage('此处必填')}`,
                                    }] : [],
                                  })(
                                    <InputNumber max={1000000} min={1} precision={0} style={{ width: 100 }}
                                                 placeholder={`${sldComLanguage('请输入')}`} disabled={viewFlag||ruleType == 2}/>,
                                  )}
                                </FormItem>
                                <span className={promotion.input_right_side_tip}>{sldComLanguage('次')}</span>
                              </div>
                            </Radio>
                            <div className={global.flex_row_start_center}>
                              <Radio value={2}>
                                <div className={global.flex_row_start_center}>
                                  <span className={promotion.input_left_side_tip}>{sldComLanguage('每人总共可抽奖')}</span>
                                  <FormItem>
                                    {getFieldDecorator('ruleNumTotal', {
                                      initialValue: detail.ruleNumTotal,
                                      rules: ruleType == 2 ? [{
                                        required: true,
                                        message: `${sldComLanguage('此处必填')}`,
                                      }] : [],
                                    })(
                                      <InputNumber max={1000000} min={1} precision={0} style={{ width: 100 }}
                                                   placeholder={`${sldComLanguage('请输入')}`} disabled={viewFlag||ruleType == 1}/>,
                                    )}
                                  </FormItem>
                                  <span className={promotion.input_right_side_tip}>{sldComLanguage('次')}</span>
                                </div>
                              </Radio>
                            </div>
                          </div>
                        </RadioGroup>
                      </Fragment>, 0)}
                    </div>

                    <div className={`${addRank.sld_det_lr_item_wrap} ${global.flex_row_start_center}`} style={{
                      width: 1000,
                    }}>
                      {sldRankLeft(false, sldComLanguage('活动背景图'), 0, 150)}
                      {!viewFlag && sldRankRight(<FormItem
                        style={{ width: 400 }}
                        extra={`${sldComLanguage('建议上传【宽750*高1334】的图片，支持gif，jpeg，jpg，png格式的图片')}`}
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
                      </FormItem>, 0, 150)}
                      {viewFlag && sldRankRight(<FormItem
                        style={{ width: 400 }}
                      >
                        {detail.backgroundImageUrl
                          ? getSldComImg(detail.backgroundImageUrl, 400, 400, 110, 110)
                          : '--'
                        }
                      </FormItem>, 0, 150)}
                    </div>
                    <div className={`${addRank.sld_det_lr_item_wrap} ${global.flex_row_start_center}`}>
                      {sldRankLeft(false, sldComLanguage('虚拟中奖'), 0)}
                      {sldRankRight(<FormItem
                        style={{ width: 500 }}
                        extra={`${sldComLanguage('开启后，中奖名单将加入虚拟中奖数据')}`}
                      >
                        {getFieldDecorator('openVirtual', {
                          valuePropName: 'checked',
                          initialValue: detail.openVirtual != undefined ? Boolean(detail.openVirtual * 1) : true,
                        })(
                          <Switch disabled={viewFlag}/>,
                        )}
                      </FormItem>, 0)}
                    </div>
                    <div className={`${addRank.sld_det_lr_item_wrap} ${global.flex_row_start_center}`}>
                      {sldRankLeft(false, sldComLanguage('活动说明'), 0, 90)}
                      {sldRankRight(<FormItem
                        style={{ width: 700 }}
                        extra={`${sldComLanguage('最多输入100字')}`}
                      >
                        {getFieldDecorator('drawDescription', {
                          initialValue: detail.drawDescription,
                        })(
                          <TextArea maxLength={100} style={{ minHeight: 32, width: 400 }} rows={2}
                                    placeholder={'请输入活动说明'} disabled={viewFlag}/>,
                        )}
                      </FormItem>, 0, 90)}
                    </div>
                  </div>
                  {/* 基本信息-end */}


                  {/* 抽奖按钮设置-start */}
                  {(query.drawType == 1 || query.drawType == 2 || query.drawType == 4)&&
                  <Fragment>
                    {getSldEmptyH(20)}
                    {/*抽奖活动类型，1-幸运抽奖，2-大转盘，3-刮刮卡，4-摇一摇，5-翻翻看*/}
                    {query.drawType == 1&&sldRankTitleByBg(`${sldComLanguage('抽奖按钮图片')}`)}
                    {query.drawType == 2&&sldRankTitleByBg(`${sldComLanguage('抽奖指针图片')}`)}
                    {query.drawType == 4&&sldRankTitleByBg(`${sldComLanguage('摇一摇效果图')}`)}
                    <div className={addRank.sld_det_lr_wrap}>
                      <div className={`${addRank.sld_det_lr_item_wrap} ${global.flex_row_start_center}`} style={{
                        width: 1000,
                      }}>
                        {sldRankLeft(false, sldComLanguage(query.drawType == 4?'摇动结束时图片':'正常可用时图片'), 1, 150)}
                        {!viewFlag && sldRankRight(<FormItem
                          style={{ width: 400 }}
                          extra={`${sldComLanguage(query.drawType == 1?'建议上传【宽283*高296】的图片，支持gif，jpeg，jpg，png格式的图片':(query.drawType == 2?'建议上传【宽169*高209】的图片，支持gif，jpeg，jpg，png格式的图片':'建议上传【宽384*高283】的图片，支持gif，jpeg，jpg，png格式的图片'))}`}
                        >
                          <div className={`${global.flex_row_start_start}`}>
                            <Upload
                              withCredentials={true}
                              beforeUpload={sldBeforeUpload}
                              accept={'.gif, .jpeg, .png,.jpg,'}
                              name={'file'}
                              action={apiUrl + `v3/oss/common/upload?source=setting`}
                              listType="picture-card"
                              fileList={drawBtnEnableFileList}
                              onPreview={(info) => this.uploadPreview(info)}
                              onChange={(info) => this.uploadChange(info, 'drawBtnEnableFileList')}
                              headers={{
                                Authorization: 'Bearer ' + getLocalStorageStingVal('sld_token'),
                              }}
                            >
                              {drawBtnEnableFileList.length >= 1 ? null : uploadButton}
                            </Upload>
                          </div>
                        </FormItem>, 0, 150)}
                        {viewFlag && sldRankRight(<FormItem
                          style={{ width: 400 }}
                        >
                          {detail.availableButtonImageUrl
                            ? getSldComImg(detail.availableButtonImageUrl, 400, 400, 110, 110)
                            : '--'
                          }
                        </FormItem>, 0, 150)}
                      </div>
                      {(query.drawType == 1 || query.drawType == 2)&&
                      <div className={`${addRank.sld_det_lr_item_wrap} ${global.flex_row_start_center}`} style={{
                        width: 1000,
                      }}>
                        {sldRankLeft(false, sldComLanguage('机会用尽时图片'), 0, 150)}
                        {!viewFlag && sldRankRight(<FormItem
                          style={{ width: 400 }}
                          extra={`${sldComLanguage(query.drawType == 1?'建议上传【宽282*高300】的图片，支持gif，jpeg，jpg，png格式的图片':'建议上传【宽169*高209】的图片，支持gif，jpeg，jpg，png格式的图片')}`}
                        >
                          <div className={`${global.flex_row_start_start}`}>
                            <Upload
                              withCredentials={true}
                              beforeUpload={sldBeforeUpload}
                              accept={'.gif, .jpeg, .png,.jpg,'}
                              name={'file'}
                              action={apiUrl + `v3/oss/common/upload?source=setting`}
                              listType="picture-card"
                              fileList={drawBtnDisableFileList}
                              onPreview={(info) => this.uploadPreview(info)}
                              onChange={(info) => this.uploadChange(info, 'drawBtnDisableFileList')}
                              headers={{
                                Authorization: 'Bearer ' + getLocalStorageStingVal('sld_token'),
                              }}
                            >
                              {drawBtnDisableFileList.length >= 1 ? null : uploadButton}
                            </Upload>
                          </div>
                        </FormItem>, 0, 150)}
                        {viewFlag && sldRankRight(<FormItem
                          style={{ width: 400 }}
                        >
                          {detail.chanceOutButtonImageUrl
                            ? getSldComImg(detail.chanceOutButtonImageUrl, 400, 400, 110, 110)
                            : '--'
                          }
                        </FormItem>, 0, 150)}
                      </div>
                      }
                    </div>
                  </Fragment>
                  }
                  {/* 抽奖按钮设置-start */}

                  {/* 未中奖信息设置-start */}
                  {(query.drawType == 1 || query.drawType == 2 || query.drawType == 5)&&
                    <Fragment>
                      {getSldEmptyH(20)}
                      {sldRankTitleByBg(`${sldComLanguage('未中奖信息')}`)}
                      <div className={addRank.sld_det_lr_wrap}>
                        <div className={`${addRank.sld_det_lr_item_wrap} ${global.flex_row_start_center}`}>
                          {sldRankLeft(false, sldComLanguage('未中奖名称'), 1)}
                          {sldRankRight(<FormItem
                            extra={`${sldComLanguage('最多输入6个字')}`}
                            style={{ width: 300 }}
                          >
                            {getFieldDecorator('losePrizeDescription', {
                              initialValue: detail.losePrizeDescription,
                            })(
                              <Input disabled={viewFlag} maxLength={6} style={{ width: 400 }}
                                     placeholder={`${sldComLanguage('请输入未中奖前台展示名称')}`}/>,
                            )}
                          </FormItem>, 1)}
                        </div>
                        <div className={`${addRank.sld_det_lr_item_wrap} ${global.flex_row_start_center}`} style={{
                          width: 1000,
                        }}>
                          {sldRankLeft(false, sldComLanguage('未中奖图片'), 0, 150)}
                          {!viewFlag && sldRankRight(<FormItem
                            style={{ width: 400 }}
                            extra={undrawonExtra}
                          >
                            <div className={`${global.flex_row_start_start}`}>
                              <Upload
                                withCredentials={true}
                                beforeUpload={sldBeforeUpload}
                                accept={'.gif, .jpeg, .png,.jpg,'}
                                name={'file'}
                                action={apiUrl + `v3/oss/common/upload?source=setting`}
                                listType="picture-card"
                                fileList={undrawonFileList}
                                onPreview={(info) => this.uploadPreview(info)}
                                onChange={(info) => this.uploadChange(info, 'undrawonFileList')}
                                headers={{
                                  Authorization: 'Bearer ' + getLocalStorageStingVal('sld_token'),
                                }}
                              >
                                {undrawonFileList.length >= 1 ? null : uploadButton}
                              </Upload>
                            </div>
                          </FormItem>, 0, 150)}
                          {viewFlag && sldRankRight(<FormItem
                            style={{ width: 400 }}
                          >
                            {detail.losePrizeImageUrl
                              ? getSldComImg(detail.losePrizeImageUrl, 400, 400, 110, 110)
                              : '--'
                            }
                          </FormItem>, 0, 150)}
                        </div>
                      </div>
                    </Fragment>
                  }
                  {/* 未中奖信息设置-end */}

                  {/* 奖项设置-start */}
                  {getSldEmptyH(20)}
                  {sldRankTitleByBg(`${sldComLanguage('奖项设置')}`)}
                  <div className={addRank.sld_det_lr_wrap}>
                    {!viewFlag &&
                    <div className={`${addRank.sld_det_lr_item_wrap} ${global.flex_row_start_center}`}>
                      {sldRankLeft(true, sldComLanguage('添加奖项'), 0)}
                      {sldRankRight(<FormItem
                        style={{ width: 400 }}
                      >
                        <div className={global.flex_row_start_end}>
                          <div onClick={() => this.addPrize()} className={promotion.rank_load_goods_btn}>{sldComLanguage('添加奖项')}
                          </div>
                          <span className={promotion.btn_right_side_tip}>{sldComLanguage('最多添加6个')}</span>
                        </div>
                      </FormItem>, 0)}
                    </div>
                    }
                  </div>
                  {/* 奖项设置-end */}

                  {/* 奖项数据-start */}
                  {prizeData.length > 0 &&
                  <div className={`${global.flex_row_start_start}`} style={{ marginTop: 20 }}>
                    <StandardTable
                      width={1000}
                      totalHeight={500}
                      bordered={false}
                      selectedRowKeys={[]}
                      selectedRows={[]}
                      data={{ list: prizeData }}
                      rowKey={'key'}
                      isCheck={false}
                      columns={columns}
                      onSelectRow={null}
                      onChange={null}
                      onSldHandleSeleRow={null}
                      resizeTable={null}
                      isColumnResize={false}
                      sldpagination={false}
                    />
                  </div>
                  }
                  {/* 奖项数据-end */}

                </Fragment>
                }
              </div>

              <div className={global.m_diy_bottom_wrap}
                   style={{ position: 'fixed', left: this.props.global.collapsed ? 90 : 160 }}>
                <div onClick={() => this.props.history.goBack()} className={global.add_goods_bottom_btn}>
                  {sldComLanguage(`${sldComLanguage('返回')}`)}
                </div>
                {!isFirstLoading && !viewFlag &&
                <div onClick={() => this.props.form.submit(this.handleSaveAllData)}
                     className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel}`}>
                  {sldComLanguage('保存')}
                </div>
                }
              </div>
              {getSldEmptyH(70)}
            </Scrollbars>
          </Form>
        </Spin>
        {/*图片预览-start*/}
        <SldPreviewImg img={preview_img} show_preview_modal={show_preview_modal} modal_width={500}
                       preview_alt_con={preview_alt_con} closePreviewModal={() => this.viewImg(false)}/>
        {/*图片预览-end*/}
        <Modal
          destroyOnClose={true}
          maskClosable={false}
          title={`${sldComLanguage(!editPrizeKey?'添加奖项':'编辑奖项')}`}
          zIndex={999}
          width={600}
          onCancel={this.sldHandleCancle}
          onOk={this.sldHandleConfirm}
          visible={modalVisible}
        >
          <AddDetailContent drawType={query.drawType} saveFlag={saveFlag} handlePrizeData={(e) => this.handlePrizeData(e)} prizeData={prizeData} editPrizeKey={editPrizeKey}/>
        </Modal>
      </div>
    );
  }
};
