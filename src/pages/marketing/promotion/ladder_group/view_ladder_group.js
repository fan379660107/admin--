import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, Spin, Table } from 'antd';
import {
  sldLlineRtextAddGoodsAddMargin,
  sldComLanguage,
  sldCommonTitleByBg,
  getSldHorLine,
  getSldEmptyH,
  sldIconBtnBg,
} from '@/utils/utils';
import { num_to_num } from '@/utils/util_data';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import router from 'umi/router';

let sthis = '';
@connect(({ ladder_group, global }) => ({
  ladder_group, global,
}))
@Form.create()
export default class ViewLadderGroup extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      detail: {},//阶梯团详情
      goodsInfo: {},//阶梯团商品信息
      query: props.location.query,
      loading: false,
      columns_spec: [
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
          title: `${sldComLanguage('SKU规格')}`,
          dataIndex: 'specValues',
          align: 'center',
          width: 100,
          render: (text, record, index) => {
            return text ? text : `${sldComLanguage('默认')}`;
          },
        },
        {
          title: `${sldComLanguage('原价(¥)')}`,
          dataIndex: 'productPrice',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('库存')}`,
          dataIndex: 'stock',
          align: 'center',
          width: 100,
        },
      ],//商品规格表头
    };
  }

  componentDidMount() {
    const { query } = this.state;
    if (query.id != undefined && query.id > 0) {
      this.get_detail(query.id);
    }
  }

  componentWillUnmount() {
  }

  //获取阶梯团详情
  get_detail = async (id) => {
    const { dispatch } = this.props;
    let { columns_spec } = this.state;
    this.setState({ loading: true });
    dispatch({
      type: 'ladder_group/get_ladder_group_detail',
      payload: { groupId: id },
      callback: async (res) => {
        if (res.state == 200) {
          let tar_index = 4;
          res.data.ruleList.map((item, index) => {
            columns_spec.splice(tar_index, 0, {
              title: `${sldComLanguage('第')}${num_to_num()[item.ladderLevel]}${sldComLanguage(res.data.discountType==1?'阶梯价格':'阶梯折扣')}`,
              dataIndex: 'ladderPrice' + item.ladderLevel,
              align: 'center',
              width: 100,
            });
            tar_index += 1;
          });
          this.setState({
            detail: res.data,
            goodsInfo: res.data.goodsInfo,
            columns_spec,
          });
        }
        this.setState({ loading: false });
      },
    });
  };

  render() {
    const { loading, detail, columns_spec, goodsInfo } = this.state;
    return (
      <div className={`${global.common_page} ${promotion.seckill} ${global.com_flex_column}`}
           style={{ position: 'relative' }}>
        <Spin spinning={loading}>
          <Form layout="inline">
            <div className={`${global.goods_sku_tab} ${global.add_goods_wrap} ${promotion.full_activity}`}>
              <div className={global.flex_com_space_between} style={{ margin: 10, marginTop: 0 }}>
                {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('阶梯团详情')}`, 0, 0, 0)}
                {sldIconBtnBg(() => router.go(-1), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
              </div>
              {getSldHorLine(1)}
              <Scrollbars
                autoHeight
                autoHeightMin={100}
                autoHeightMax={document.body.clientHeight - 100}>
                {/* 基本信息-start */}
                {getSldEmptyH(10)}
                {sldCommonTitleByBg(`${sldComLanguage('阶梯团基本信息')}`)}
                {getSldEmptyH(10)}
                <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>

                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                    <div className={`${promotion.left}`}>
                      <span style={{ color: '#FF1515' }}>*</span>{sldComLanguage('活动名称')}
                    </div>
                    <div className={`${promotion.right}`}>
                      {detail.groupName}
                    </div>
                  </div>

                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                    <div className={`${promotion.left}`}>
                      <span style={{ color: '#FF1515' }}>*</span>{sldComLanguage('活动时间')}
                    </div>
                    <div className={`${promotion.right}`}>
                      {detail.startTime} ~ {detail.endTime}
                    </div>
                  </div>

                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                    <div className={`${promotion.left}`}>
                      <span style={{ color: '#FF1515' }}>*</span>{sldComLanguage('活动标签')}
                    </div>
                    <div className={`${promotion.right}`}>
                      {detail.labelName}
                    </div>
                  </div>

                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                    <div className={`${promotion.left}`}>
                      <span style={{ color: '#FF1515' }}>*</span>{sldComLanguage('限购数量')}
                    </div>
                    <div className={`${promotion.right}`}>
                      {detail.buyLimitNum}
                    </div>
                  </div>

                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                    <div className={`${promotion.left}`}>
                      <span style={{ color: '#FF1515' }}>*</span>{sldComLanguage('尾款时间')}
                    </div>
                    <div className={`${promotion.right}`}>
                      {detail.balanceTime}小时
                    </div>
                  </div>

                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                    <div className={`${promotion.left}`}>
                      <span style={{ color: '#FF1515' }}>*</span>{sldComLanguage('是否退还定金')}
                    </div>
                    <div className={`${promotion.right}`}>
                      {detail.isRefundDepositValue}
                    </div>
                  </div>

                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                    <div className={`${promotion.left}`}>
                      <span style={{ color: '#FF1515' }}>*</span>{sldComLanguage('阶梯优惠方式')}
                    </div>
                    <div className={`${promotion.right}`}>
                      {detail.discountTypeValue}
                    </div>
                  </div>

                </div>
                {/* 基本信息-end */}

                {/* 商品信息-start */}
                {getSldEmptyH(10)}
                {sldCommonTitleByBg(`${sldComLanguage('商品信息')}`)}
                {getSldEmptyH(10)}
                <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                  <div className={`${promotion.sele_goods}`} style={{ width: '100%' }}>
                    <div className={`${promotion.goods_info} ${global.flex_row_between_start}`}>
                      <div className={`${promotion.goods_info_left} ${global.flex_row_start_start}`}>
                        <div className={`${promotion.goods_img_wrap} ${global.flex_row_center_center}`}>
                          <img className={`${promotion.goods_img}`} src={goodsInfo.goodsImage}/>
                        </div>
                        <p className={`${promotion.goods_name}`}>{goodsInfo.goodsName}</p>
                      </div>
                    </div>
                    <div className={`${global.flex_column_start_start} ${promotion.ladder_part}`}>
                      <div className={`${promotion.deposit_part}`}>
                        <div className={global.flex_row_start_center}>
                          <span
                            style={{
                              display: 'inline-block',
                              marginRight: 5,
                              color: '#333',
                            }}><span
                            style={{ color: '#FF1515' }}>*</span>{sldComLanguage('预付定金：')}</span>
                          <span
                            style={{
                              display: 'inline-block',
                              color: '#333',
                            }}>{goodsInfo.advanceDeposit}{sldComLanguage('元')}</span>
                        </div>
                      </div>
                      {detail.ruleList != undefined && detail.ruleList.length > 0 && detail.ruleList.map((item_ladder_num, index_ladder_num) => {
                        return <div key={index_ladder_num} className={`${promotion.ladder_item}`}>
                          <div className={global.flex_row_start_center}>
                            {index_ladder_num == 0 &&
                            <span>
                              <span style={{ color: '#FF1515' }}>*</span>
                              {sldComLanguage('参团人数：')}
                              </span>
                            }
                            <span
                              style={{
                                display: 'inline-block',
                                marginRight: 5,
                                color: '#333',
                                marginLeft: index_ladder_num > 0 ? 77 : 0,
                              }}><span>第{num_to_num()[item_ladder_num.ladderLevel]}阶梯</span></span>
                            <span
                              style={{
                                display: 'inline-block',
                                marginLeft: 5,
                                color: '#333',
                              }}>{item_ladder_num.joinGroupNum}{sldComLanguage('人')}</span>
                          </div>
                        </div>;
                      })}
                    </div>
                    {goodsInfo.productList != undefined && goodsInfo.productList.length > 0 &&
                    <Scrollbars autoHeight
                                autoHeightMax={300}>
                      <Table rowKey={'productId'} pagination={false} columns={columns_spec}
                             dataSource={goodsInfo.productList} size={'small'}/>
                    </Scrollbars>
                    }
                  </div>
                </div>
                {/* 商品信息-end */}
                {getSldEmptyH(40)}
              </Scrollbars>
            </div>
          </Form>
        </Spin>
      </div>
    );
  }
};
