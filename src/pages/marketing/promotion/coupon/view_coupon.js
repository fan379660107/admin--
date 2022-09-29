import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, Spin, Table, Tree } from 'antd';
import {
  sldLlineRtextAddGoodsAddMargin,
  sldComLanguage,
  sldCommonTitleByBg,
  getSldHorLine,
  getSldEmptyH,
  getSldComImg,
  sldIconBtnBg,
} from '@/utils/utils';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import router from 'umi/router';

let sthis = '';
@connect(({ promotion, global }) => ({
  promotion, global,
}))
@Form.create()
export default class ViewCoupon extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      coupon_detail: {},//优惠券详情
      cat_data: [],//三级分类数据
      checkedCatIds: [],//选择的分类id数组
      useType: 1,//适用商品类型
      useTimeType: 1,//使用时间类型
      curCouponType: 1,//当前选择的优惠券类型
      query: props.location.query,
      loading: false,
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
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
      ],
    };
  }

  componentDidMount() {
    const { query } = this.state;
    if (query.id != undefined && query.id > 0) {
      this.get_detail(query.id);
    }
    this.getCat();
  }

  componentWillUnmount() {
  }

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
    let { checkedCatIds } = this.state;
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
            });
          }
          this.setState({
            coupon_detail: res.data,
            loading: false,
            useTimeType: res.data.effectiveTimeType,//使用时间类型
            useType: res.data.useType,//适用商品类型
            curCouponType: res.data.couponType,//优惠券类型
            checkedCatIds,
          });
        }
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
          this.setState({
            selectedRows,
            selectedRowKeys,
          });
        }
      },
    });
  };

  render() {
    const {
      loading, curCouponType, useTimeType, useType, columns_spu, selectedRows, cat_data, coupon_detail, checkedCatIds, query,
    } = this.state;
    return (
      <div className={`${global.common_page} ${global.com_flex_column}`} style={{ position: 'relative' }}>
        <Spin spinning={loading}>
          <Form layout="inline">
            <div className={`${global.goods_sku_tab} ${global.add_goods_wrap} ${promotion.full_activity}`}>
              <div className={global.flex_com_space_between} style={{ margin: 10, marginTop: 0 }}>
                {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('优惠券详情')}`, 0, 0, 0)}
                {sldIconBtnBg(() => router.go(-1), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
              </div>
              {getSldHorLine(1)}
              <Scrollbars
                autoHeight
                autoHeightMin={100}
                autoHeightMax={document.body.clientHeight - 100}>
                {/* 基本信息-start */}
                {getSldEmptyH(10)}
                {sldCommonTitleByBg(`${sldComLanguage('优惠券基本信息')}`)}
                {getSldEmptyH(10)}
                <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>

                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                    <div className={`${promotion.left}`}>
                      <span style={{ color: 'red' }}>*</span>{sldComLanguage('优惠券所属类型')}
                    </div>
                    <div className={`${promotion.right}`}>
                      {coupon_detail.storeId > 0 ? `${sldComLanguage('店铺优惠券')}` : `${sldComLanguage('平台优惠券')}`}
                    </div>
                  </div>

                  {coupon_detail.storeId > 0 &&
                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                    <div className={`${promotion.left}`}>
                      <span style={{ color: 'red' }}>*</span>{sldComLanguage('店铺名称')}
                    </div>
                    <div className={`${promotion.right}`}>
                      {coupon_detail.storeName}
                    </div>
                  </div>
                  }

                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                    <div className={`${promotion.left}`}>
                      <span style={{ color: 'red' }}>*</span>{sldComLanguage('优惠券名称')}
                    </div>
                    <div className={`${promotion.right}`}>
                      {coupon_detail.couponName}
                    </div>
                  </div>
                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                    <div className={`${promotion.left}`}>
                      <span style={{ color: 'red' }}>*</span>{sldComLanguage('发放总量')}
                    </div>
                    <div className={`${promotion.right}`}>
                      {coupon_detail.publishNum}张
                    </div>
                  </div>

                  {query.type != undefined && query.type == 'system' &&
                    <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: 'red' }}>*</span>{sldComLanguage('与店铺优惠券叠加')}
                      </div>
                      <div className={`${promotion.right}`}>
                        {coupon_detail.plusQualification == 1 ? `${sldComLanguage('允许')}` : `${sldComLanguage('不允许')}`}
                      </div>
                    </div>
                  }

                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                    <div className={`${promotion.left}`}>
                      <span style={{ color: 'red' }}>*</span>{sldComLanguage('适用商品')}
                    </div>
                    <div className={`${promotion.right}`}>
                      {useType == 1 && `${sldComLanguage('全部商品可用')}`}
                      {useType == 2 && `${sldComLanguage('指定商品可用')}`}
                      {useType == 3 && `${sldComLanguage('指定分类可用')}`}
                    </div>
                  </div>

                  {useType == 2 &&
                  <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                    <div className={`${promotion.left}`}>
                      <span style={{ color: 'red' }}>*</span>{sldComLanguage('已选择商品')}
                    </div>
                    <div className={`${promotion.right}`}>
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
                          disabled={true}
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
                  {coupon_detail.publishType != undefined && coupon_detail.publishType ==1 &&
                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                    <div className={`${promotion.left}`}>
                      <span style={{ color: 'red' }}>*</span>{sldComLanguage('活动时间')}
                    </div>
                    <div className={`${promotion.right}`}>
                      {coupon_detail.publishStartTime} ~ {coupon_detail.publishEndTime}
                    </div>
                  </div>
                  }

                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                    <div className={`${promotion.left}`}>
                      <span style={{ color: 'red' }}>*</span>{sldComLanguage('使用时间')}
                    </div>
                    <div className={`${promotion.right}`}>
                      {useTimeType == 1 && `${coupon_detail.effectiveStart} ~ ${coupon_detail.effectiveEnd}`}
                      {useTimeType == 2 && `${sldComLanguage('领券当日起天')}${coupon_detail.cycle}${sldComLanguage('内可以使用')}`}
                    </div>
                  </div>


                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                    <div className={`${promotion.left}`}>
                      <span style={{ color: 'red' }}>*</span>{sldComLanguage('获取方式')}
                    </div>
                    <div className={`${promotion.right}`}>
                      {coupon_detail.publishType == 1 && `${sldComLanguage('免费领取')}`}
                      {coupon_detail.publishType == 3 && `${sldComLanguage('活动赠送')}`}
                    </div>
                  </div>

                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                    <div className={`${promotion.left}`}>
                      <span style={{ color: 'red' }}>*</span>{sldComLanguage('使用门槛')}
                    </div>
                    <div className={`${promotion.right}`}>
                      {coupon_detail.limitQuota
                        ? `${sldComLanguage('订单满')}${coupon_detail.limitQuota}${sldComLanguage('元时可以使用此优惠券')}`
                        : `${sldComLanguage('无使用门槛')}`
                      }
                    </div>
                  </div>
                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                    <div className={`${promotion.left}`}>
                      <span style={{ color: 'red' }}>*</span>{sldComLanguage('优惠内容')}
                    </div>
                    <div className={`${promotion.right}`}>
                      {curCouponType == 1 && `${sldComLanguage('满足使用门槛后可以减免')}${coupon_detail.publishValue}${sldComLanguage('元')}`}
                      {curCouponType == 2 && `${sldComLanguage('满足使用门槛后可以享受')}${coupon_detail.publishValue}${sldComLanguage('折')}`}
                      {curCouponType == 2 && coupon_detail.discountLimitAmount && `${sldComLanguage('，最多可以优惠')}${coupon_detail.discountLimitAmount}${sldComLanguage('元')}`}
                      {curCouponType == 3 && `${sldComLanguage('在')}${coupon_detail.randomMin}～${coupon_detail.randomMax}${sldComLanguage('元范围内随机生成，总共不超过')}${coupon_detail.publishAmount}${sldComLanguage('元')}`}

                    </div>
                  </div>


                </div>
                {/* 基本信息-end */}

                {/* 领取和使用规则-start */}
                {coupon_detail.publishType != undefined && coupon_detail.publishType ==1 &&
                  <Fragment>
                    {getSldEmptyH(10)}
                    {sldCommonTitleByBg(`${sldComLanguage('领取和使用规则')}`)}
                    {getSldEmptyH(10)}
                    <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                        <div className={`${promotion.left}`}>
                          <span style={{ color: 'red' }}>*</span>{sldComLanguage('每人限领次数')}
                        </div>
                        <div className={`${promotion.right}`}>
                          {coupon_detail.limitReceive
                            ? `${sldComLanguage('每位会员限制领取')}${coupon_detail.limitReceive}${sldComLanguage('次')}`
                            : `${sldComLanguage('不限制次数')}`
                          }
                        </div>
                      </div>
                    </div>
                  </Fragment>
                }
                {/* 领取和使用规则-end */}
                {getSldEmptyH(40)}
              </Scrollbars>
            </div>
          </Form>
        </Spin>
      </div>
    );
  }
}
;
