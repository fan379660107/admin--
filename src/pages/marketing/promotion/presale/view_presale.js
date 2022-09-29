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
@connect(({ presale, global }) => ({
  presale, global,
}))
@Form.create()
export default class ViewPresale extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      compensateRate:0,//赔偿倍数
      detail: {},//预售详情
      goodsInfo: [],//预售商品信息
      query: props.location.query,
      loading: false,
      columns_spec:[
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
          title: `${sldComLanguage('原价(￥)')}`,
          dataIndex: 'productPrice',
          align: 'center',
          width: 110,
        },
        {
          title: `${sldComLanguage('库存')}`,
          dataIndex: 'stock',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('预售价格(￥)')}`,
          dataIndex: 'presellPrice',
          align: 'center',
          width: 110,
        },
        {
          title: `${sldComLanguage('预售定金(￥)')}`,
          dataIndex: 'firstMoney',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('定金膨胀(￥)')}`,
          dataIndex: 'firstExpand',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('预售库存')}`,
          dataIndex: 'presellStock',
          align: 'center',
          width: 100,
        },
      ],
      columns_spec_all: [
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
          title: `${sldComLanguage('预售价格(￥)')}`,
          dataIndex: 'presellPrice',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('预售库存')}`,
          dataIndex: 'presellStock',
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
    if(query.type != undefined && query.type == 1){
      this.getSetting();
    }
  }

  componentWillUnmount() {
  }

  //获取系统配置(预售活动赔偿倍数)
  getSetting = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/getSetting',
      payload: {str:'presale_compensate'},
      callback: (res) => {
        if (res.state == 200) {
          this.setState({compensateRate:res.data[0].value,isFirstLoading:false})
        }
      },
    });
  };

  //获取预售详情
  get_detail = async (id) => {
    const { dispatch } = this.props;
    this.setState({ loading: true });
    dispatch({
      type: 'presale/get_detail_pre',
      payload: { presellId: id },
      callback: async (res) => {
        if (res.state == 200) {
          this.setState({
            detail: res.data,
            goodsInfo: res.data.goodsList,
          });
        }
        this.setState({ loading: false });
      },
    });
  };

  render() {
    const { loading, detail, columns_spec_all, goodsInfo, compensateRate, query, columns_spec } = this.state;
    return (
      <div className={`${global.common_page} ${promotion.seckill} ${global.com_flex_column}`}
           style={{ position: 'relative' }}>
        <Spin spinning={loading}>
          <Form layout="inline">
            <div className={`${global.goods_sku_tab} ${global.add_goods_wrap} ${promotion.full_activity}`}>
              <div className={global.flex_com_space_between} style={{ margin: 10, marginTop: 0 }}>
                {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('预售详情')}`, 0, 0, 0)}
                {sldIconBtnBg(() => router.go(-1), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
              </div>
              {getSldHorLine(1)}
              <Scrollbars
                autoHeight
                autoHeightMin={100}
                autoHeightMax={document.body.clientHeight - 108}>
                {/* 基本信息-start */}
                {query.type == 2&&getSldEmptyH(10)}
                {query.type == 1
                  ?<div className={`${global.flex_row_start_center} ${promotion.add_new}`} style={{marginTop:10}}>
                    <span style={{fontSize:14,color:'#333',marginLeft:10,lineHeight:14}}>{sldComLanguage('活动基本信息')}</span>
                    <span style={{ color: 'gray', fontSize: '12px', paddingLeft: '10px' }}>温馨提示：若因商家问题导致无法发货，需要对会员进行赔偿，赔偿金额为定金的{compensateRate}倍。</span>
                  </div>
                  :sldCommonTitleByBg(`${sldComLanguage('活动基本信息')}`)
                }
                <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>

                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                    <div className={`${promotion.left}`}>
                      <span style={{ color: '#FF1515' }}>*</span>{sldComLanguage('活动名称')}
                    </div>
                    <div className={`${promotion.right}`}>
                      {detail.presellName}
                    </div>
                  </div>

                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                    <div className={`${promotion.left}`}>
                      <span style={{ color: '#FF1515' }}>*</span>{sldComLanguage('活动标签')}
                    </div>
                    <div className={`${promotion.right}`}>
                      {detail.presellLabelName}
                    </div>
                  </div>

                  {query.type == 1&&
                    <Fragment>
                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                        <div className={`${promotion.left}`}>
                          <span style={{ color: '#FF1515' }}>*</span>{sldComLanguage('定金时间')}
                        </div>
                        <div className={`${promotion.right}`}>
                          {detail.startTime} ~ {detail.endTime}
                        </div>
                      </div>
                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                        <div className={`${promotion.left}`}>
                          <span style={{ color: '#FF1515' }}>*</span>{sldComLanguage('尾款时间')}
                        </div>
                        <div className={`${promotion.right}`}>
                          {detail.remainStartTime} ~ {detail.remainEndTime}
                        </div>
                      </div>
                    </Fragment>
                  }

                  {query.type == 2&&
                    <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: '#FF1515' }}>*</span>{sldComLanguage('活动时间')}
                      </div>
                      <div className={`${promotion.right}`}>
                        {detail.startTime} ~ {detail.endTime}
                      </div>
                    </div>
                  }

                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                    <div className={`${promotion.left}`}>
                      <span style={{ color: '#FF1515' }}>*</span>{sldComLanguage('发货时间')}
                    </div>
                    <div className={`${promotion.right}`}>
                      {detail.deliverTime}
                    </div>
                  </div>

                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                    <div className={`${promotion.left}`}>
                      <span style={{ color: '#FF1515' }}>*</span>{sldComLanguage('限购件数')}
                    </div>
                    <div className={`${promotion.right}`}>
                      {detail.buyLimit}件
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
                        <Table rowKey={'productId'} pagination={false} columns={query.type == 1?columns_spec:columns_spec_all}
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
