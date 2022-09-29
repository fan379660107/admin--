import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, Spin, Input, InputNumber, Radio, DatePicker, Table, Tree,Empty } from 'antd';
import {
  failTip,
  sucTip,
  sldLlineRtextAddGoodsAddMargin,
  sldComLanguage,
  dateTimeFormat,
  sldCommonTitleByBg,
  getSldHorLine,
  getSldEmptyH,
  getSldComImg,
} from '@/utils/utils';
import global from '@/global.less';
import SldSelMoreLeftRightGoods from '@/components/SldSelMoreLeftRightGoods';
import promotion from '@/assets/css/promotion.less';
import ALibbSvg from '@/components/ALibbSvg';
import moment from 'moment';

let sthis = '';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
@connect(({ promotion, global }) => ({
  promotion, global,
}))
@Form.create()
export default class AddCoupon extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      enableFlag: 0,//优惠券开关
      isFirstLoading: true,//是否第一次加载
      coupon_detail: {},//优惠券详情
      cat_data: [],//三级分类数据
      checkedCatIds: [],//选择的分类id数组
      useType: 1,//适用商品类型
      useTimeType: 1,//使用时间类型
      curCouponType: 1,//当前选择的优惠券类型
      sle_more_title: '',//选择商品的标题
      modalVisibleGoods: false,
      query: props.location.query,
      loading: false,
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      publishType: 1,//获取方式，1为免费领取，3为活动赠送
      columns_spu: [
        {
          title: ' ',
          dataIndex: 'key',
          align: 'center',
          width: 30,
          render: (text, record, index) => {
            return index + 1;
          },
        },
        {
          title: `${sldComLanguage('店铺名称')}`,
          dataIndex: 'storeName',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('商品图片')}`,
          dataIndex: 'mainImage',
          align: 'center',
          width: 100,
          render: (text, record) => {
            return <div>{getSldComImg(text, 200, 200, 50, 50)}</div>;
          },
        },
        {
          title: `${sldComLanguage('商品名称')}`,
          dataIndex: 'goodsName',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('商品价格(¥)')}`,
          dataIndex: 'goodsPrice',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('商品库存')}`,
          dataIndex: 'goodsStock',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('操作')}`,
          align: 'center',
          width: 100,
          render: (text, record) => {
            return <div onClick={() => this.delGoods(record.goodsId)}
                        className={`${promotion.coupon_goods_operate} ${global.flex_row_center_center}`}>
              <ALibbSvg fill={'#2d2d2d'} width={18} height={18} type={'shanchu5'}/>
            </div>;
          },
        },
      ],
    };
  }

  sele_more_goods = {
    info: [],//选择的商品数组
    ids: [],//选择的商品id数组
    min_num: 1,//最小数量，0为不限制
    max_num: 10000,//最多选择10000个
  };

  sele_cat_ids_array = [];//选择的最后一级分类id数组

  componentDidMount() {
    const { query } = this.state;
    if (query.id != undefined && query.id > 0) {
      this.get_detail(query.id);
    } else {
      this.setState({ isFirstLoading: false });
    }
    this.getCat();
    this.checkCouponState();
  }

  componentWillUnmount() {
  }

  //验证优惠券开关
  checkCouponState = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/getSetting',
      payload: { str: 'coupon_is_enable' },
      callback: (res) => {
        if (res.state == 200) {
          this.setState({ enableFlag: res.data[0].value, isFirstLoading: false });
        }
      },
    });
  };

  //获取分类数据
  getCat = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/get_cate_tree_list',
      payload: { pId: 0, grade: 3 },
      callback: (res) => {
        if (res.state == 200) {
          if (res.data.length > 0) {
            res.data.map(item => {
              item.key = item.categoryId;
              item.title = item.categoryName;
              if (item.children != null) {
                item.children.map(second => {
                  second.key = second.categoryId;
                  second.title = second.categoryName;
                  if (second.children != null) {
                    second.children.map(third => {
                      third.key = third.categoryId;
                      third.title = third.categoryName;
                    });
                  }
                });
              }
            });
          }
          this.setState({
            cat_data: res.data,
          });
        }
      },
    });
  };


  //获取优惠券详情
  get_detail = async (id) => {
    const { dispatch } = this.props;
    let { checkedCatIds,query,publishType } = this.state;
    this.setState({ loading: true });
    dispatch({
      type: 'promotion/get_coupon_detail',
      payload: { couponId: id },
      callback: async (res) => {
        if (res.state == 200) {
          if (res.data.useType == 2) {
            this.get_goods_list(id);//获取商品列表
          }
          if (res.data.useType == 3) {
            res.data.goodsCategoryList.map(item => {
              let tar_id = item.categoryId3;
              tar_id = tar_id ? tar_id : item.categoryId2;
              tar_id = tar_id ? tar_id : item.categoryId1;
              checkedCatIds.push(tar_id);
              this.sele_cat_ids_array.push(item.categoryId3);
            });
          }
          if(query.type != undefined&&query.type == 'copy'){
            res.data.couponName = '';//清空优惠券名称
            res.data.publishStartTime = '';//清空优惠券的活动时间
            if(res.data.effectiveTimeType == 1){
              //如果是固定使用时间，需要清空使用时间
              res.data.effectiveStart = '';
            }
          }
          publishType = res.data.publishType;//获取方式
          this.setState({
            coupon_detail: res.data,
            loading: false,
            useTimeType: res.data.effectiveTimeType,//使用时间类型
            useType: res.data.useType,//适用商品类型
            curCouponType: res.data.couponType,//优惠券类型
            checkedCatIds,
            publishType,
          });
        }
        this.setState({ isFirstLoading: false });
      },
    });
  };

  get_goods_list = (id) => {
    let { selectedRows, selectedRowKeys } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'promotion/get_coupon_goods_list',
      payload: { couponId: id },
      callback: async (res) => {
        if (res.state == 200) {
          if (res.data.list.length > 0) {
            selectedRows = res.data.list;
            selectedRows.map(item => {
              item.mainImage = item.goodsImage;
              selectedRowKeys.push(item.goodsId);
            });
          }
          this.sele_more_goods.info = selectedRows;
          this.sele_more_goods.ids = selectedRowKeys;
          this.setState({
            selectedRows,
            selectedRowKeys,
          });
        }
      },
    });
  };

  resetSelGoods = () => {
    this.setState({
      modalVisibleGoods: true,
      sle_more_title: `${sldComLanguage('选择商品(最少选择1个)')}`,
    });
  };

  //适用商品选择事件
  handleUseType = (e) => {
    let { modalVisibleGoods, sle_more_title, selectedRows, selectedRowKeys } = this.state;
    //重置数据
    this.sele_more_goods = {
      info: [],
      ids: [],
      min_num: 1,
    };
    selectedRows = [];
    selectedRowKeys = [];

    if (e.target.value == 2) {
      modalVisibleGoods = true;
      sle_more_title = `${sldComLanguage('选择商品(最少选择1个)')}`;
    }
    this.setState({
      sle_more_title,
      modalVisibleGoods,
      useType: e.target.value,
      selectedRows,
      selectedRowKeys,
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
    const { query, selectedRowKeys, publishType } = this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          if(publishType == 1){
            //免费领取优惠券——活动时间处理
            if (values.publishTime) {
              values.publishStartTime = values.publishTime[0] ? values.publishTime[0].format(dateTimeFormat) : '';
              values.publishEndTime = values.publishTime[1] ? values.publishTime[1].format(dateTimeFormat) : '';
              if (values.publishTime[0].unix() == values.publishTime[1].unix()) {
                failTip(sldComLanguage('活动结束时间必须晚于开始时间～'));
                return false;
              }
              delete values.publishTime;
            }
          }

          //使用时间处理
          if (values.effectiveTime) {
            values.effectiveStart = values.effectiveTime[0] ? values.effectiveTime[0].format(dateTimeFormat) : '';
            values.effectiveEnd = values.effectiveTime[1] ? values.effectiveTime[1].format(dateTimeFormat) : '';
            if (values.effectiveTime[0].unix() == values.effectiveTime[1].unix()) {
              failTip(sldComLanguage('使用结束时间必须晚于开始时间～'));
              return false;
            }
            delete values.effectiveTime;
          }

          //适用商品类型为指定商品
          if (values.useType == 2) {
            values.goodsIds = selectedRowKeys.join(',');
          }

          //适用商品类型为指定分类
          if (values.useType == 3) {
            values.categoryIds = this.sele_cat_ids_array.join(',');
          }

          if(publishType == 1){
            if(values.limitReceive*1 > values.publishNum*1){
              failTip(sldComLanguage('每人限领次数不能超过发放总数～'));
              return false;
            }
          }else{
            values.limitReceive = 0;//活动赠送的优惠券不限制会员领取的数量
          }

          let dis_type = '';
          if (query.id != undefined && query.id > 0 && query.type == 'edit') {
            //编辑优惠券
            values.couponId = query.id;
            dis_type = 'promotion/edit_coupon';
          } else {
            //新增优惠券
            dis_type = 'promotion/add_coupon';
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

  sldHandleCancle = () => {
    this.setState({
      modalVisibleGoods: false,
    });
  };

  //商品删除事件
  delGoods = (goodsId) => {
    let { selectedRows, selectedRowKeys } = this.state;
    selectedRows = selectedRows.filter(item => item.goodsId != goodsId);
    selectedRowKeys = selectedRowKeys.filter(item => item != goodsId);
    this.sele_more_goods.ids = [...selectedRowKeys];
    this.sele_more_goods.info = JSON.parse(JSON.stringify(selectedRows));
    this.setState({
      selectedRows: selectedRows,
      selectedRowKeys: selectedRowKeys,
    });
  };

  //商品多选-回调事件
  seleGoods = (selectedRows, selectedRowKeys) => {
    this.sele_more_goods.ids = [...selectedRowKeys];
    this.sele_more_goods.info = JSON.parse(JSON.stringify(selectedRows));
    this.setState({
      selectedRows: selectedRows,
      selectedRowKeys: selectedRowKeys,
    });
    this.sldHandleCancle();
  };

  //优惠券类型选择  1 满减券 2 折扣券 3 随机金额券
  handleCouponType = (e) => {
    this.setState({ curCouponType: e.target.value });
  };

  //使用时间类型选择 1 固定使用时间  2 灵活使用时间
  handleUseTimeType = (e) => {
    this.setState({ useTimeType: e.target.value });
  };

  //选择分类事件
  handleCatCheck = (checkedKeys, e) => {
    this.sele_cat_ids_array = [];
    e.checkedNodes.map(item=>{
      if(item.props.children.length == 0){
        this.sele_cat_ids_array.push(item.props.categoryId);
      }
    })
    this.setState({ checkedCatIds: checkedKeys });
  };

  //获取方式选择事件
  handlePublishType = (e) => {
    this.setState({publishType:e.target.value})
  }

  render() {
    const {
      modalVisibleGoods, loading, sle_more_title, curCouponType, useTimeType, useType, columns_spu, selectedRows, cat_data, coupon_detail, checkedCatIds, enableFlag, isFirstLoading, publishType, query
    } = this.state;
    let {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={`${global.common_page} ${global.com_flex_column}`} style={{ position: 'relative' }}>
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('发布优惠券')}`, 0, 0, 10)}
        {getSldHorLine(1)}
        {getSldEmptyH(10)}
        <Spin spinning={loading}>
          <Form layout="inline">
            <Scrollbars
              autoHeight
              autoHeightMin={100}
              autoHeightMax={document.body.clientHeight - 170}>
              <div className={`${global.goods_sku_tab} ${global.add_goods_wrap} ${promotion.full_activity}`}>
                {/* 基本信息-start */}
                {enableFlag == 1 && !isFirstLoading &&
                <Fragment>
                  {sldCommonTitleByBg(`${sldComLanguage('优惠券基本信息')}`)}
                  {getSldEmptyH(10)}
                  <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: 'red' }}>*</span>{sldComLanguage('优惠券名称')}
                      </div>
                      <div className={`${promotion.right}`}>
                        <FormItem
                          extra={`${sldComLanguage('最多输入20个字')}`}
                          style={{ width: 300 }}
                        >
                          {getFieldDecorator('couponName', {
                            initialValue: coupon_detail.couponName, rules: [{
                              required: true,
                              whitespace: true,
                              message: `${sldComLanguage('请输入优惠券名称')}`,
                            }],
                          })(
                            <Input maxLength={20} style={{ width: 400 }} placeholder={`${sldComLanguage('请输入优惠券名称')}`}/>,
                          )}
                        </FormItem>
                      </div>
                    </div>
                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: 'red' }}>*</span>{sldComLanguage('发放总量')}
                      </div>
                      <div className={`${promotion.right}`}>
                        <FormItem
                          style={{ width: 300 }}
                          extra={`${sldComLanguage('最多100000000张，修改优惠券总量时只能增加不能减少，请谨慎设置')}`}
                        >
                          {getFieldDecorator('publishNum', {
                            initialValue: coupon_detail.publishNum, rules: [{
                              required: true,
                              message: `${sldComLanguage('请输入发放总量')}`,
                            }],
                          })(
                            <InputNumber max={100000000} min={query.type!=undefined&&query.type == 'edit'?coupon_detail.publishNum:1} precision={0} style={{ width: 400 }}
                                         placeholder={`${sldComLanguage('请输入发放总量')}`}/>,
                          )}
                        </FormItem>
                      </div>
                    </div>

                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: 'red' }}>*</span>{sldComLanguage('与店铺优惠券叠加')}
                      </div>
                      <div className={`${promotion.right}`}>
                        <FormItem
                          style={{ width: 300 }}
                        >
                          {getFieldDecorator('plusQualification', {
                            initialValue: coupon_detail.plusQualification != undefined ? coupon_detail.plusQualification * 1 : 1,
                          })(
                            <RadioGroup size={'small'}>
                              <Radio value={1}>{sldComLanguage('允许')}</Radio>
                              <Radio value={0}>{sldComLanguage('不允许')}</Radio>
                            </RadioGroup>,
                          )}
                        </FormItem>
                      </div>
                    </div>

                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: 'red' }}>*</span>{sldComLanguage('适用商品')}
                      </div>
                      <div className={`${promotion.right}`}>
                        <FormItem
                          style={{ width: 400 }}
                        >
                          {getFieldDecorator('useType', {
                            initialValue: useType,
                          })(
                            <RadioGroup size={'small'} onChange={(e) => this.handleUseType(e)}>
                              <Radio value={1}>{sldComLanguage('全部商品可用')}</Radio>
                              <Radio value={2}>{sldComLanguage('指定商品可用')}</Radio>
                              <Radio value={3}>{sldComLanguage('指定分类可用')}</Radio>
                            </RadioGroup>,
                          )}
                        </FormItem>
                      </div>
                    </div>

                    {useType == 2 &&
                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: 'red' }}>*</span>{sldComLanguage('已选择商品')}
                      </div>
                      <div className={`${promotion.right}`}>
                      <span className={`${promotion.reset_sel}`}
                            onClick={() => this.resetSelGoods()}>{sldComLanguage('重新选择')}</span>
                        <Scrollbars autoHeight
                                    autoHeightMax={300}>
                          <Table rowKey={'goodsId'} pagination={false} columns={columns_spu}
                                 dataSource={selectedRows} size={'small'}/>
                        </Scrollbars>
                      </div>
                    </div>
                    }

                    {useType == 3 &&
                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: 'red' }}>*</span>{sldComLanguage('选择分类')}
                      </div>
                      <div className={`${promotion.right}`}>
                        <Scrollbars
                          autoHeight
                          autoHeightMin={100}
                          autoHeightMax={300}>
                          <Tree
                            checkable
                            autoExpandParent={false}
                            treeData={cat_data}
                            onCheck={this.handleCatCheck}
                            checkedKeys={checkedCatIds}
                          />
                        </Scrollbars>
                      </div>
                    </div>
                    }

                    {publishType == 1&&
                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: 'red' }}>*</span>{sldComLanguage('活动时间')}
                      </div>
                      <div className={`${promotion.right}`}>
                        <FormItem
                          style={{ width: 400 }}
                          extra={`${sldComLanguage('该时间为优惠券领取的起止时间')}`}
                        >
                          {getFieldDecorator('publishTime', {
                            initialValue: coupon_detail.publishStartTime != undefined&&coupon_detail.publishStartTime  ? [moment(coupon_detail.publishStartTime, dateTimeFormat), moment(coupon_detail.publishEndTime, dateTimeFormat)] : [],
                            rules: [{
                              required: true,
                              message: `${sldComLanguage('请选择活动时间')}`,
                            }],
                          })(
                            <RangePicker
                              disabledDate={(current)=> current< moment().startOf('day')}
                              style={{ width: 350 }}
                              placeholder={[`${sldComLanguage('开始时间')}`, `${sldComLanguage('结束时间')}`]}
                              showTime={{ format: 'HH:mm' }}
                              format="YYYY-MM-DD HH:mm:00"
                              getCalendarContainer={(triggerNode)=>{
                                return triggerNode.parentNode
                              }}
                            />,
                          )}
                        </FormItem>
                      </div>
                    </div>
                    }

                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: 'red' }}>*</span>{sldComLanguage('使用时间')}
                      </div>
                      <div className={`${promotion.right}`}>
                        <FormItem
                          style={{ width: 400 }}
                        >
                          {getFieldDecorator('useTimeType', {
                            initialValue: useTimeType,
                          })(
                            <RadioGroup size={'small'} onChange={(e) => this.handleUseTimeType(e)}>
                              <Radio value={1}>{sldComLanguage('固定使用时间')}</Radio>
                              <Radio value={2}>{sldComLanguage('灵活使用时间')}</Radio>
                            </RadioGroup>,
                          )}
                        </FormItem>
                      </div>
                    </div>

                    {useTimeType == 1 &&
                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: 'red' }}>*</span>{sldComLanguage('设置固定使用时间')}
                      </div>
                      <div className={`${promotion.right}`}>
                        <FormItem
                          style={{ width: 400 }}
                        >
                          {getFieldDecorator('effectiveTime', {
                            initialValue: coupon_detail.effectiveStart != undefined && coupon_detail.effectiveStart ? [moment(coupon_detail.effectiveStart, dateTimeFormat), moment(coupon_detail.effectiveEnd, dateTimeFormat)] : [],
                            rules: [{
                              required: true,
                              message: `${sldComLanguage('请先设置固定使用时间')}`,
                            }],
                          })(
                            <RangePicker
                              disabledDate={(current)=> current< moment().startOf('day')}
                              style={{ width: 350 }}
                              placeholder={[`${sldComLanguage('开始时间')}`, `${sldComLanguage('结束时间')}`]}
                              showTime={{ format: 'HH:mm' }}
                              format="YYYY-MM-DD HH:mm:00"
                              getCalendarContainer={(triggerNode)=>{
                                return triggerNode.parentNode
                              }}
                            />,
                          )}
                        </FormItem>
                      </div>
                    </div>
                    }

                    {useTimeType == 2 &&
                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: 'red' }}>*</span>{sldComLanguage('设置灵活使用时间')}
                      </div>
                      <div className={`${promotion.right}`}>
                        <FormItem
                          extra={`${sldComLanguage('以天为单位')}`}
                          style={{ width: 300 }}
                        >
                          <div className={global.flex_row_start_center}>
                          <span
                            style={{
                              display: 'inline-block',
                              marginRight: 5,
                              color: 'rgba(0, 0, 0, 0.65)',
                            }}>领券当日起</span>
                            {getFieldDecorator('cycle', {
                              initialValue: coupon_detail.cycle, rules: [{
                                required: true,
                                message: `${sldComLanguage('请输入灵活使用时间')}`,
                              }],
                            })(
                              <InputNumber max={1000} min={1} precision={0} style={{ width: 150 }}
                                           placeholder={`${sldComLanguage('请输入灵活使用时间')}`}/>,
                            )}
                            <span
                              style={{ display: 'inline-block', marginLeft: 5, color: 'rgba(0, 0, 0, 0.65)' }}>{sldComLanguage('天')}</span>
                          </div>
                        </FormItem>
                      </div>
                    </div>
                    }


                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: 'red' }}>*</span>{sldComLanguage('获取方式')}
                      </div>
                      <div className={`${promotion.right}`}>
                        <FormItem
                          style={{ width: 400 }}
                          extra={<div>
                            <div>{sldComLanguage('选择“免费领取”类型则领取方式为用户在领券中心等处直接点击领取')}</div>
                            <div>{sldComLanguage('选择“活动赠送”类型则在成功参与指定商城活动后系统自动赠送该券')}</div>
                          </div>}
                        >
                          {getFieldDecorator('publishType', {
                            initialValue: coupon_detail.publishType != undefined ? coupon_detail.publishType : 1,
                          })(
                            <RadioGroup size={'small'} onChange={this.handlePublishType}>
                              <Radio value={1}>{sldComLanguage('免费领取')}</Radio>
                              <Radio value={3}>{sldComLanguage('活动赠送')}</Radio>
                            </RadioGroup>,
                          )}
                        </FormItem>
                      </div>
                    </div>

                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: 'red' }}>*</span>{sldComLanguage('使用门槛')}
                      </div>
                      <div className={`${promotion.right}`}>
                        <FormItem
                          style={{ width: 300 }}
                          extra={`${sldComLanguage('订单满多少元时可以使用此优惠券，0元代表无使用门槛')}`}
                        >
                          <div className={global.flex_row_start_center}>
                          <span
                            style={{ display: 'inline-block', marginRight: 5, color: 'rgba(0, 0, 0, 0.65)' }}>{sldComLanguage('订单满')}</span>
                            {getFieldDecorator('limitQuota', {
                              initialValue: coupon_detail.limitQuota, rules: [{
                                required: true,
                                message: `${sldComLanguage('请输入使用门槛')}`,
                              }],
                            })(
                              <InputNumber max={99999999} min={0} precision={2} style={{ width: 140 }}
                                           placeholder={`${sldComLanguage('请输入使用门槛')}`}/>,
                            )}
                            <span
                              style={{ display: 'inline-block', marginLeft: 5, color: 'rgba(0, 0, 0, 0.65)' }}>{sldComLanguage('元')}</span>
                          </div>
                        </FormItem>
                      </div>
                    </div>
                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: 'red' }}>*</span>{sldComLanguage('优惠券类型')}
                      </div>
                      <div className={`${promotion.right}`}>
                        <FormItem
                          style={{ width: 400 }}
                        >
                          {getFieldDecorator('couponType', {
                            initialValue: curCouponType,
                          })(
                            <RadioGroup size={'small'} onChange={(e) => this.handleCouponType(e)}>
                              <Radio value={1}>{sldComLanguage('满减券')}</Radio>
                              <Radio value={2}>{sldComLanguage('折扣券')}</Radio>
                              <Radio value={3}>{sldComLanguage('随机金额券')}</Radio>
                            </RadioGroup>,
                          )}
                        </FormItem>
                      </div>
                    </div>

                    {/* 选择满减券的优惠内容-start */}
                    {curCouponType == 1 &&
                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: 'red' }}>*</span>{sldComLanguage('优惠内容')}
                      </div>
                      <div className={`${promotion.right}`}>
                        <FormItem
                          style={{ width: 300 }}
                        >
                          <div className={global.flex_row_start_center}>
                          <span
                            style={{ display: 'inline-block', marginRight: 5, color: 'rgba(0, 0, 0, 0.65)' }}>{sldComLanguage('减免')}</span>
                            {getFieldDecorator('publishValue', {
                              initialValue: coupon_detail.publishValue, rules: [{
                                required: true,
                                message: `${sldComLanguage('请输入优惠内容')}`,
                              }],
                            })(
                              <InputNumber max={99999} min={0.01} precision={2} style={{ width: 140 }}
                                           placeholder={`${sldComLanguage('请输入优惠内容')}`}/>,
                            )}
                            <span
                              style={{ display: 'inline-block', marginLeft: 5, color: 'rgba(0,0 , 0, 0.65)' }}>{sldComLanguage('元')}</span>
                          </div>
                        </FormItem>
                      </div>
                    </div>
                    }
                    {/* 选择满减券的优惠内容-end */}

                    {/* 选择折扣券的优惠内容-start */}
                    {curCouponType == 2 &&
                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: 'red' }}>*</span>{sldComLanguage('优惠内容')}
                      </div>
                      <div className={`${promotion.right}`}>
                        <FormItem
                          extra={`${sldComLanguage('输入90代表9折，85代表85折')}`}
                          style={{ width: 190 }}
                        >
                          <div className={global.flex_row_start_center}>
                          <span
                            style={{ display: 'inline-block', marginRight: 5, color: 'rgba(0, 0, 0, 0.65)' }}>{sldComLanguage('打')}</span>
                            {getFieldDecorator('publishValue', {
                              initialValue: coupon_detail.publishValue, rules: [{
                                required: true,
                                message: `${sldComLanguage('请输入折扣')}`,
                              }],
                            })(
                              <InputNumber max={100} min={1} precision={0} style={{ width: 140 }}
                                           placeholder={`${sldComLanguage('请输入折扣')}`}/>,
                            )}
                            <span
                              style={{ display: 'inline-block', marginLeft: 5, color: 'rgba(0, 0, 0, 0.65)' }}>{sldComLanguage('折')}</span>
                          </div>
                        </FormItem>
                      </div>
                      <div className={`${promotion.right}`}>
                        <FormItem
                          style={{ width: 300 }}
                        >
                          <div className={global.flex_row_start_center}>
                          <span style={{
                            display: 'inline-block',
                            marginRight: 5,
                            color: 'rgba(0, 0, 0, 0.65)',
                          }}>最多优惠</span>
                            {getFieldDecorator('discountLimitAmount', {
                              initialValue: coupon_detail.discountLimitAmount,
                            })(
                              <InputNumber max={99999999} min={0} precision={2} style={{ width: 140 }}
                                           placeholder={`${sldComLanguage('请输入优惠金额')}`}/>,
                            )}
                            <span
                              style={{ display: 'inline-block', marginLeft: 5, color: 'rgba(0, 0, 0, 0.65)' }}>{sldComLanguage('元')}</span>
                          </div>
                        </FormItem>
                      </div>
                    </div>
                    }
                    {/* 选择折扣券的优惠内容-end */}


                    {/* 选择随机金额券的优惠内容-start */}
                    {curCouponType == 3 &&
                    <Fragment>
                      <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                        <div className={`${promotion.left}`}>
                          <span style={{ color: 'red' }}>*</span>{sldComLanguage('优惠内容')}
                        </div>
                        <div className={`${promotion.right}`}>
                          <FormItem
                            style={{ width: 210, marginRight: 0 }}
                          >
                            <div className={global.flex_row_start_center}>
                          <span
                            style={{
                              display: 'inline-block',
                              marginRight: 5,
                              color: 'rgba(0, 0, 0, 0.65)',
                            }}>范围内随机</span>
                              {getFieldDecorator('randomMin', {
                                initialValue: coupon_detail.randomMin, rules: [{
                                  required: true,
                                  message: `${sldComLanguage('请输入最小值')}`,
                                }],
                              })(
                                <InputNumber max={99999999} min={0} precision={2} style={{ width: 140 }}
                                             placeholder={`${sldComLanguage('请输入最小值')}`}/>,
                              )}
                            </div>
                          </FormItem>
                        </div>
                        <div>~</div>
                        <div className={`${promotion.right}`}>
                          <FormItem
                            style={{ width: 300, marginLeft: 5 }}
                          >
                            <div className={global.flex_row_start_center}>
                              {getFieldDecorator('randomMax', {
                                initialValue: coupon_detail.randomMax,
                                rules: [{
                                  required: true,
                                  message: `${sldComLanguage('请输入最大值')}`,
                                }],
                              })(
                                <InputNumber max={99999999} min={0.01} precision={2} style={{ width: 140 }}
                                             placeholder={`${sldComLanguage('请输入最大值')}`}/>,
                              )}
                              <span
                                style={{
                                  display: 'inline-block',
                                  marginLeft: 5,
                                  color: 'rgba(0, 0, 0, 0.65)',
                                }}>元</span>
                            </div>
                          </FormItem>
                        </div>
                      </div>
                      <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                        <div className={`${promotion.left}`}>
                          <span style={{ color: 'red' }}>*</span>{sldComLanguage('优惠总金额')}
                        </div>
                        <div className={`${promotion.right}`}>
                          <FormItem
                            extra={`${sldComLanguage('本次生成的随机金额优惠券的金额之和')}`}
                            style={{ width: 300 }}
                          >
                            <div className={global.flex_row_start_center}>
                              {getFieldDecorator('publishAmount', {
                                initialValue: coupon_detail.publishAmount, rules: [{
                                  required: true,
                                  message: `${sldComLanguage('请输入优惠总金额')}`,
                                }],
                              })(
                                <InputNumber max={99999999} min={0.01} precision={0} style={{ width: 140 }}
                                             placeholder={`${sldComLanguage('请输入优惠总金额')}`}/>,
                              )}
                            </div>
                          </FormItem>
                        </div>
                      </div>
                    </Fragment>
                    }
                    {/* 选择随机金额券的优惠内容-end */}

                  </div>
                  {/* 基本信息-end */}

                  {/* 领取和使用规则-start */}
                  {publishType == 1&&
                    <Fragment>
                      {getSldEmptyH(10)}
                      {sldCommonTitleByBg(`${sldComLanguage('领取和使用规则')}`)}
                      {getSldEmptyH(10)}
                      <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                          <div className={`${promotion.left}`}>
                            <span style={{ color: 'red' }}>*</span>{sldComLanguage('每人限领次数')}
                          </div>
                          <div className={`${promotion.right}`}>
                            <FormItem
                              style={{ width: 300 }}
                              extra={`${sldComLanguage('每位会员限制领取的次数，0代表不限制次数')}`}
                            >
                              {getFieldDecorator('limitReceive', {
                                initialValue: coupon_detail.limitReceive, rules: [{
                                  required: true,
                                  message: `${sldComLanguage('请输入限制领取次数')}`,
                                }],
                              })(
                                <InputNumber max={100} min={0} precision={0} style={{ width: 400 }}
                                             placeholder={`${sldComLanguage('请输入限制领取次数')}`}/>,
                              )}
                            </FormItem>
                          </div>
                        </div>
                      </div>
                    </Fragment>
                  }
                  {/* 领取和使用规则-end */}
                </Fragment>
                }
                {enableFlag != 1 && !isFirstLoading &&
                <Fragment>
                  {getSldEmptyH(150)}
                  <Empty
                    image={require('@/assets/moudle_disable.png')}
                    imageStyle={{
                      height: 80,
                    }}
                    description={
                      <span>{sldComLanguage('优惠券模块暂未开启')}</span>
                    }
                  >
                  </Empty>
                </Fragment>
                }
              </div>

              {enableFlag == 1 && !isFirstLoading &&
              <div className={global.m_diy_bottom_wrap}
                   style={{ position: 'fixed', left: this.props.global.collapsed ? 90 : 160 }}>
                <div onClick={() => this.props.history.goBack()} className={global.add_goods_bottom_btn}>
                  {sldComLanguage(`${sldComLanguage('返回')}`)}
                </div>
                <div onClick={() => this.props.form.submit(this.handleSaveAllData)}
                     className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel}`}>
                  保存
                </div>
              </div>
              }
              {getSldEmptyH(20)}
            </Scrollbars>
          </Form>
        </Spin>

        {/*商品多选的modal框-start*/}
        <SldSelMoreLeftRightGoods selectedRows={this.sele_more_goods.info}
                                  selectedRowKeys={this.sele_more_goods.ids}
                                  modalVisible={modalVisibleGoods} width={1000}
                                  height={document.body.clientHeight - 400}
                                  sldHandleSeleMoreModalCancle={this.sldHandleCancle} seleSvideo={this.seleGoods}
                                  title={sle_more_title} extra={this.sele_more_goods}/>
        {/*商品多选的modal框-end*/}
      </div>
    );
  }
}
;
