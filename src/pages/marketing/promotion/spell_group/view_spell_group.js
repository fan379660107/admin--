import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
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
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import router from 'umi/router';

let sthis = '';
@connect(({ spell_group, global }) => ({
  spell_group, global,
}))
@Form.create()
export default class ViewSpellGroup extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      detail: {},//拼团详情
      goodsInfo: [],//拼团商品信息
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
        },{
          title: `${sldComLanguage('拼团价(¥)')}`,
          dataIndex: 'spellPrice',
          align: 'center',
          width: 100,
        },{
          title: `${sldComLanguage('拼团库存')}`,
          dataIndex: 'spellStock',
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

  //获取拼团详情
  get_detail = async (id) => {
    const { dispatch } = this.props;
    let { columns_spec } = this.state;
    this.setState({ loading: true });
    dispatch({
      type: 'spell_group/get_spell_group_detail',
      payload: { spellId: id },
      callback: async (res) => {
        if (res.state == 200) {
          if(res.data.leaderIsPromotion == 1){
            //开启团长优惠，商品信息需要显示团长优惠价
            for(let i in columns_spec){
              if(columns_spec[i].dataIndex == 'spellPrice'){
                columns_spec.splice(i + 1, 0, {
                  title: `${sldComLanguage('团长优惠价(¥)')}`,
                  dataIndex: 'leaderPrice',
                  align: 'center',
                  width: 100,
                });
                break;
              }
            }
          }
          this.setState({
            detail: res.data,
            goodsInfo: res.data.goodsList,
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
                {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('拼团详情')}`, 0, 0, 0)}
                {sldIconBtnBg(() => router.go(-1), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
              </div>
              {getSldHorLine(1)}
              <Scrollbars
                autoHeight
                autoHeightMin={100}
                autoHeightMax={document.body.clientHeight - 108}>
                {/* 基本信息-start */}
                {getSldEmptyH(10)}
                {sldCommonTitleByBg(`${sldComLanguage('拼团基本信息')}`)}
                {getSldEmptyH(10)}
                <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                    <div className={`${promotion.left}`}>
                      <span style={{ color: '#FF1515' }}>*</span>{sldComLanguage('活动名称')}
                    </div>
                    <div className={`${promotion.right}`}>
                      {detail.spellName}
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
                      {detail.spellLabelName}
                    </div>
                  </div>

                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                    <div className={`${promotion.left}`}>
                      <span style={{ color: '#FF1515' }}>*</span>{sldComLanguage('参团人数')}
                    </div>
                    <div className={`${promotion.right}`}>
                      {detail.requiredNum}人
                    </div>
                  </div>

                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                    <div className={`${promotion.left}`}>
                      <span style={{ color: '#FF1515' }}>*</span>{sldComLanguage('拼团有效期')}
                    </div>
                    <div className={`${promotion.right}`}>
                      {detail.cycle}小时
                    </div>
                  </div>

                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                    <div className={`${promotion.left}`}>
                      <span style={{ color: '#FF1515' }}>*</span>{sldComLanguage('限购数量')}
                    </div>
                    <div className={`${promotion.right}`}>
                      {detail.buyLimit}{sldComLanguage('件')}
                    </div>
                  </div>

                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                    <div className={`${promotion.left}`}>
                      <span style={{ color: '#FF1515' }}>*</span>{sldComLanguage('模拟成团')}
                    </div>
                    <div className={`${promotion.right}`}>
                      {detail.isSimulateGroupValue}
                    </div>
                  </div>

                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                    <div className={`${promotion.left}`}>
                      <span style={{ color: '#FF1515' }}>*</span>{sldComLanguage('团长优惠')}
                    </div>
                    <div className={`${promotion.right}`}>
                      {detail.leaderIsPromotionValue}
                    </div>
                  </div>
                </div>
                {/* 基本信息-end */}

                {/* 商品信息-start */}
                {getSldEmptyH(10)}
                {sldCommonTitleByBg(`${sldComLanguage('商品信息')}`)}
                {getSldEmptyH(10)}
                <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                  {goodsInfo.map((item,index)=>{
                    return <div key={index} className={`${promotion.sele_goods}`} style={{ width: '100%' }}>
                      <div className={`${promotion.goods_info} ${global.flex_row_between_start}`}>
                        <div className={`${promotion.goods_info_left} ${global.flex_row_start_start}`}>
                          <div className={`${promotion.goods_img_wrap} ${global.flex_row_center_center}`}>
                            <img className={`${promotion.goods_img}`} src={item.goodsImage}/>
                          </div>
                          <p className={`${promotion.goods_name}`}>{item.goodsName}</p>
                        </div>
                      </div>
                      {item.productList != undefined && item.productList.length > 0 &&
                      <Scrollbars autoHeight
                                  autoHeightMax={300}>
                        <Table rowKey={'productId'} pagination={false} columns={columns_spec}
                               dataSource={item.productList} size={'small'}/>
                      </Scrollbars>
                      }
                    </div>
                  })}
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
