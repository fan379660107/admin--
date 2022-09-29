import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form } from 'antd';
import {
  sldCommonTitle,
  list_com_page_size_10,
  sldLlineRtextAddGoods,
  getSldHorLine,
  sldIconBtnBg,
  sldComLanguage,
  pageClose,
  quillEscapeToHtml,
} from '@/utils/utils';
import global from '@/global.less';
import SldTableRowTwo from '@/components/SldTableRowTwo';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './product.less';
import StandardTable from '@/components/StandardTable';
import SldPreviewImg from '@/components/SldPreviewImg/SldPreviewImg';

let pageSize = list_com_page_size_10;
@connect(({ product }) => ({
  product,
}))
@Form.create()
export default class GoodsDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: props.location.query,
      params: { pageSize: pageSize },//搜索条件
      preview_img: '',
      show_preview_modal: false,
      goods_base_data: [{
        type: 'show_text',
        label: `${sldComLanguage('商品类型')}：`,
        name: 'isVirtualGoods',
        extra: ``,
        item_height: 42,
        text: ``,
      },{
        type: 'show_text',
        label: `${sldComLanguage('商品分类')}：`,
        name: 'categoryPath',
        extra: ``,
        item_height: 42,
        text: ``,
      }, {
        type: 'show_text',
        label: `${sldComLanguage('商品名称')}：`,
        name: 'goodsName',
        extra: ``,
        item_height: 42,
        text: ``,
      }, {
        type: 'show_text',
        label: `${sldComLanguage('商品广告语')}：`,
        name: 'goodsBrief',
        extra: ``,
        item_height: 42,
        text: ``,
      }, {
        type: 'show_text',
        label: `${sldComLanguage('品牌')}：`,
        name: 'brandName',
        extra: ``,
        item_height: 42,
        text: ``,
      }, {
        type: 'show_text',
        label: `${sldComLanguage('店铺名称')}：`,
        name: 'storeName',
        extra: ``,
        item_height: 42,
        text: ``,
      }],//商品基本信息
      invoice_data: [{
        type: 'show_text',
        label: `${sldComLanguage('是否开专票')}：`,
        name: 'isVatInvoice',
        extra: ``,
        item_height: 42,
        text: ``,
      }],//发票状态
      other_data: [{
        type: 'show_text',
        label: `${sldComLanguage('店铺分类')}：`,
        name: 'storeInnerLabelList',
        extra: ``,
        item_height: 42,
        text: ``,
      }, {
        type: 'show_text',
        label: `${sldComLanguage('商品标签')}：`,
        name: 'goodsLabelList',
        extra: ``,
        item_height: 42,
        text: ``,
      }, {
        type: 'show_text',
        label: `${sldComLanguage('虚拟销量')}：`,
        name: 'virtualSales',
        extra: ``,
        item_height: 42,
        text: ``,
      }, {
        type: 'show_text',
        label: `${sldComLanguage('发布状态')}：`,
        name: 'sellNow',
        extra: ``,
        item_height: 42,
        text: ``,
      }, {
        type: 'show_text',
        label: `${sldComLanguage('商品状态')}：`,
        name: 'stateValue',
        extra: ``,
        item_height: 42,
        text: ``,
      }, {
        type: 'show_text',
        label: `${sldComLanguage('商品推荐')}：`,
        name: 'storeIsRecommend',
        extra: ``,
        item_height: 42,
        text: ``,
      }],//其他信息
      goods_img_data: [],//商品图片信息
      goods_video_data: [
        {
          type: 'show_video',
          label: sldComLanguage('商品视频'),
          name: 'goodsVideoUrl',
          initialValue: '',
          data: [],
          item_height: 142,
          preView: this.viewImg,
        },
      ],//商品视频
      goods_detail_data: {},//商品详情数据
      columns_spec: [
        {
          title: sldComLanguage('序号'),
          align: 'center',
          width: 50,
          render: (text, record, index) => {
            return index + 1;
          },
        },
        {
          title: sldComLanguage('规格名称'),
          dataIndex: 'specValues',
          align: 'center',
          width: 150,
          render: (text, record, index) => {
            return text?text:sldComLanguage('默认');
          },
        },
        {
          title: sldComLanguage('市场价(¥)'),
          dataIndex: 'marketPrice',
          align: 'center',
          width: 100,
          render: (text, record, index) => {
            return text ? text : '--';
          },
        },
        {
          title: sldComLanguage('价格(¥)'),
          dataIndex: 'productPrice',
          align: 'center',
          width: 100,
        },
        {
          title: sldComLanguage('库存'),
          dataIndex: 'productStock',
          align: 'center',
          width: 100,
        },
        {
          title: sldComLanguage('重量(KG)'),
          dataIndex: 'weight',
          align: 'center',
          width: 100,
          render: (text, record, index) => {
            return text ? text : '--';
          },
        },
        {
          title: sldComLanguage('长(CM)'),
          dataIndex: 'length',
          align: 'center',
          width: 100,
          render: (text, record, index) => {
            return text ? text : '--';
          },
        },
        {
          title: sldComLanguage('宽(CM)'),
          dataIndex: 'width',
          align: 'center',
          width: 100,
          render: (text, record, index) => {
            return text ? text : '--';
          },
        },
        {
          title: sldComLanguage('高(CM)'),
          dataIndex: 'height',
          align: 'center',
          width: 100,
          render: (text, record, index) => {
            return text ? text : '--';
          },
        },
        {
          title: sldComLanguage('预警值'),
          dataIndex: 'productStockWarning',
          align: 'center',
          width: 100,
          render: (text, record, index) => {
            return text ? (text>0?text:0) : '--';
          },
        }, {
          title: sldComLanguage('货号'),
          dataIndex: 'productCode',
          align: 'center',
          width: 100,
          render: (text, record, index) => {
            return text ? text : '--';
          },
        },
        {
          title: sldComLanguage('条形码'),
          dataIndex: 'barCode',
          align: 'center',
          width: 100,
          render: (text, record, index) => {
            return text ? text : '--';
          },
        }, {
          title: sldComLanguage('默认选中'),
          dataIndex: 'isDefault',
          align: 'center',
          width: 100,
          render: (text, record, index) => {
            return text == 1 ? sldComLanguage('是') : sldComLanguage('否');
          },
        }],//商品规格表头
    };
  }

  img_item = {
    type: 'show_goods_img_more',
    label: sldComLanguage('商品图片'),
    name: 'show_goods_img_more',
    initialValue: '',
    data: [],
    item_height: 142,
  };

  componentDidMount() {
    const { query } = this.state;
    this.get_goods_detail(query.id);
    window.addEventListener('resize', this.resize);
  }

  //预览图片/关闭预览图片
  viewImg = (flag, img = '') => {
    this.setState({
      preview_img: img,
      show_preview_modal: flag,
    });
  };

  //获取商品详情
  get_goods_detail = (id) => {
    const { dispatch } = this.props;
    let { goods_base_data, goods_img_data, goods_detail_data, other_data, invoice_data, goods_video_data } = this.state;
    let params = { goodsId: id };
    let dis_type = 'product/get_goods_detail';
    dispatch({
      type: dis_type,
      payload: params,
      callback: async (res) => {
        if (res.state == 200) {
          goods_detail_data = res.data;
          //商品分类
          goods_detail_data.goods_cat = goods_detail_data.categoryPath;

          //商品基本信息
          for (let i in goods_base_data) {
            if(goods_base_data[i].name == 'isVirtualGoods'){
              goods_base_data[i].text = goods_detail_data[goods_base_data[i].name] == 1?sldComLanguage('实物商品'):sldComLanguage('虚拟商品');
            }else{
              goods_base_data[i].text = goods_detail_data[goods_base_data[i].name] ? goods_detail_data[goods_base_data[i].name] : '--';
            }
          }

          //商品图片
          if (goods_detail_data.imageList.length > 0) {
            let temp = { ...this.img_item, data: goods_detail_data.imageList };
            goods_img_data.push(temp);
          } else {
            goods_img_data = [];
            let imgs = goods_detail_data.specInfoList;
            imgs.map(item => {
              if (item.isMainSpec) {
                item.specValueList.map(child => {
                  let temp = { ...this.img_item, data: child.imageList, label: child.specValue };
                  goods_img_data.push(temp);
                });
              }
            });
          }
          //商品视频
          goods_video_data[0].initialValue = goods_detail_data.goodsVideoUrl;

          /*发票信息start*/
          invoice_data.map(item => {
            item.text = goods_detail_data[item.name] == 1 ? sldComLanguage('是') : sldComLanguage('否');
          });
          /*发票信息end*/

          /*其他信息start*/
          for (let other_index in other_data) {
            if (other_data[other_index].name == 'storeInnerLabelList') {
              if (goods_detail_data[other_data[other_index].name] != null && goods_detail_data[other_data[other_index].name]) {
                goods_detail_data[other_data[other_index].name].map(item => {
                  other_data[other_index].text += '【' + item.innerLabelPath + '】';
                });
              } else {
                other_data[other_index].text = '--';
              }
            } else if (other_data[other_index].name == 'goodsLabelList') {
              if (goods_detail_data[other_data[other_index].name] != null && goods_detail_data[other_data[other_index].name]) {
                goods_detail_data[other_data[other_index].name].map(item => {
                  other_data[other_index].text += '【' + item.labelName + '】';
                });
              } else {
                other_data[other_index].text = '--';
              }
            } else if (other_data[other_index].name == 'sellNow') {
              other_data[other_index].text = goods_detail_data.sellNow ? sldComLanguage('立即售卖') : sldComLanguage('放入仓库');
            } else if (other_data[other_index].name == 'storeIsRecommend') {
              other_data[other_index].text = goods_detail_data.storeIsRecommend == 1 ? sldComLanguage('是') : sldComLanguage('否');
            } else {
              other_data[other_index].text = goods_detail_data[other_data[other_index].name] ? goods_detail_data[other_data[other_index].name] : '--';
            }
          }
          if(goods_detail_data.isVirtualGoods == 2){
            other_data.push({
              type: 'show_text',
              label: `${sldComLanguage('售后服务')}：`,
              name: 'afterSaleService',
              extra: ``,
              item_height: 42,
              text: goods_detail_data.afterSaleService == 1?sldComLanguage('支持退款'):sldComLanguage('不支持退款'),
            });
          }
          /*其他信息end*/

          this.setState({
            loading: false,
            goods_base_data,//商品的基本信息
            goods_img_data,//spu图片信息
            goods_detail_data,
            other_data,//其他信息
            invoice_data,//发票信息
            goods_video_data,//商品视频信息
          }, () => {
            //根据选择的结果计算规格数据
          });
        }
      },
    });
  };

  render() {
    const { goods_base_data, goods_img_data, goods_detail_data, columns_spec, preview_img, show_preview_modal, other_data, express_data, invoice_data, goods_video_data } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1 }}>
        <div className={global.flex_com_space_between} style={{ margin: 10, marginTop: 0 }}>
          {sldLlineRtextAddGoods('#FA6F1E', sldComLanguage('商品详情'))}
          {sldIconBtnBg(() => pageClose(), 'fanhui', sldComLanguage('返回上级页面'), '#fff', 7, 0, 15, 15, 5)}
        </div>
        {getSldHorLine(1)}
        <Scrollbars
          autoHeight
          autoHeightMin={100}
          autoHeightMax={document.body.clientHeight - 130}>
          {sldCommonTitle(sldComLanguage('基本信息'), '#333', 5, 12, 15)}
          <SldTableRowTwo r_color={'#333'} l_color={'#999'} l_fontw={500} r_fontw={600} form={this.props.form}
                          data={goods_base_data}/>
          {goods_detail_data.productList != undefined && goods_detail_data.productList.length > 0 &&
          <Fragment>
            {sldCommonTitle(sldComLanguage('商品规格'), '#333', 5, 15, 15)}
            <StandardTable
              selectedRows={[]}
              data={{ list: goods_detail_data.productList, pagination: {} }}
              size={'small'}
              rowKey={'productId'}
              isCheck={false}
              columns={columns_spec}
              sldpagination={false}
            />
          </Fragment>}

          {sldCommonTitle(sldComLanguage('商品图片'), '#333', 5, 15, 15)}
          <SldTableRowTwo part_width={100} lwidth={10} rwidth={90} form={this.props.form}
                          data={goods_img_data}/>

          {goods_detail_data.goodsVideoUrl &&
          <Fragment>
            {sldCommonTitle(sldComLanguage('商品视频'), '#333', 5, 15, 15)}
            <SldTableRowTwo part_width={100} lwidth={10} rwidth={90} form={this.props.form}
                            data={goods_video_data}/>
          </Fragment>
          }
          {sldCommonTitle(sldComLanguage('发票信息'), '#333', 5, 15, 15)}
          <SldTableRowTwo r_color={'#333'} l_color={'#999'} l_fontw={500} r_fontw={600} form={this.props.form}
                          data={invoice_data}/>
          {sldCommonTitle(sldComLanguage('其他信息'), '#333', 5, 15, 15)}
          <SldTableRowTwo r_color={'#333'} l_color={'#999'} l_fontw={500} r_fontw={600} form={this.props.form}
                          data={other_data}/>
          {(goods_detail_data.topTemplateContent||goods_detail_data.goodsDetails||goods_detail_data.bottomTemplateContent)
            ?<Fragment>
              {sldCommonTitle(sldComLanguage('商品详情'), '#333', 5, 15, 15)}
              <div className={styles.goods_detail_body}>
                {goods_detail_data.topTemplateContent
                  ?<div dangerouslySetInnerHTML={{
                    __html: quillEscapeToHtml(goods_detail_data.topTemplateContent),
                  }}/>
                  :''
                }
                {goods_detail_data.goodsDetails
                  ?<div dangerouslySetInnerHTML={{
                    __html: quillEscapeToHtml(goods_detail_data.goodsDetails),
                  }}/>
                  :''
                }
                {goods_detail_data.bottomTemplateContent
                  ?<div dangerouslySetInnerHTML={{
                    __html: quillEscapeToHtml(goods_detail_data.bottomTemplateContent),
                  }}/>
                  :''
                }
              </div>
            </Fragment>
            :''
          }
        </Scrollbars>
        {/*图片预览-start*/}
        <SldPreviewImg img={preview_img} show_preview_modal={show_preview_modal} modal_width={500}
                       preview_alt_con={sldComLanguage('商品图片')} closePreviewModal={() => this.viewImg(false)}/>
        {/*图片预览-end*/}
      </div>

    );
  }
}
