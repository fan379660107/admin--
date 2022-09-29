/*
* 商品楼层
* 标题可以自定义
* 左侧图片+分类信息，中间和右侧是商品信息，属于标准的楼层模板
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form } from 'antd';
import {
  formItemLayoutModal,
  sldComLanguage,
} from '@/utils/utils';
import {
  sld_com_empty_arrar_4,
  sld_com_empty_arrar_5,
  sld_com_empty_arrar_9,
} from '@/utils/util_data';
import styles from '../pcdecorate.less';
import SldModal from '@/components/SldModal/SldModal';
import SldDiySingleImgModal from '@/components/SldDiySingleImgModal/SldDiySingleImgModal';
import SldDiyTitleLinkModal from '@/components/SldDiyTitleLinkModal/SldDiyTitleLinkModal';
import SldSelCatMore from '@/components/SldSelCatMore';
import SldSelMoreLeftRightGoods from '@/components/SldSelMoreLeftRightGoods';

let sthis = '';
let getFieldDecorator_new = '';
@connect(({ product }) => ({
  product,
}))
@Form.create()
export default class Adv_05 extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    const {
      form: { getFieldDecorator },
    } = props;
    getFieldDecorator_new = getFieldDecorator;
    this.state = {
      modal_tip: [],//弹框的提示语
      modalTitle: '',//弹框的标题
      cur_sele_goods: [],//当前选择的商品数据
      cur_sele_goods_ids: [],//当前选择商品id数组
      cur_sele_cats: [],//当前选择的分类数据
      cur_sele_cats_ids: [],//当前选择分类id数组
      cur_part: '',//当前操作的部分，比如left，center，right
      cur_data: {},//当前操作数据
      cur_data1: {},//当前操作数据
      submiting: false,//按钮loading
      modalVisible: false,//是否展示modal
      modalSpuShow: false,//是否展示选择商品modal
      modalSingleImgVisible: false,//单图选择器modal是否显示
      modalSldDiyTitleLinkVisible: false,//标题链接modal是否显示
      modalComCatSelectorShow: false,//分类选择modal是否显示
      tpl_info: props.tpl_info,
      addData: [{
        type: 'input',
        label: `${sldComLanguage('标题名称')}`,
        name: 'title_name',
        placeholder: `${sldComLanguage('请输入标题名称')}`,
        extra: `${sldComLanguage('最多8个字')}`,
        initialValue: '',
        maxLength:8,
        rules: [{
          required: true,
          whitespace: true,
          message: `${sldComLanguage('请输入标题名称')}`,
        }],
      }],//modal框的数据
      data: {
        type: 'adv_05',
        title_info: {
          title: {
            label: `${sldComLanguage('标题')}`,
            name: 'title',
            initialValue: `${sldComLanguage('清仓打折')}`,
            required: true,
          },//标题名称
          sub_title: {
            label: `${sldComLanguage('子标题')}`,
            name: 'sub_title',
            initialValue: `${sldComLanguage('清仓打折')}`,
            required: false,
          },//子标题名称
          link_type: '',
          link_value: '',
          info: {},
        },
        left: {
          type: 'img_cat',
          width: 298,
          height: 482,
          data: {
            imgUrl: '',
            imgPath: '',
            title: '',
            link_type: '',
            link_value: '',
            info: {},
          },
          cat_data: {
            title_info: {
              title_name: '',
              title_color: '',//标题颜色
            },
            cat_ids: [],//分类id数组
            cat_datas: [],//分类信息数组
          },//分类信息
        },//左侧板块信息
        center: {
          data: {
            goods_ids: [],
            goods_data: [],
          },
        },//中间板块信息
        right: {
          type: 'goods',
          title_info: {
            title_name: '',//标题名称
            title_color: '',//标题颜色
          },
          data: {
            goods_ids: [],
            goods_data: [],
          },
        },//右侧板块信息
      },
    };
  }

  sele_goods_param = {
    type: 'common',
    total_num: 0,
  };//商品选择器参数

  sele_cats_param = {
    type: 'common',
    max_num: 0,
  };//分类选择器参数

  componentDidMount() {
    let { tpl_info } = this.state;
    this.setState({
      data: tpl_info,
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let { data } = this.state;
    if (JSON.stringify(nextProps.tpl_info) != JSON.stringify(data)) {
      data = nextProps.tpl_info;
      this.setState({ data });
    }
  }

  componentWillUnmount() {

  }

  //编辑板块 part：标示哪一部分，比如left，center  modalTitle：弹框的标题  modalTip：弹框的整体提示
  editTpl = (part, modalTitle = '', modalTip = []) => {
    let { data, modalVisible, modalSpuShow, cur_sele_goods, cur_sele_goods_ids, cur_sele_cats, cur_sele_cats_ids, modalSingleImgVisible, cur_data, addData, modalSldDiyTitleLinkVisible, modalComCatSelectorShow } = this.state;
    if (part == 'center') {
      modalSpuShow = true;
      cur_sele_goods = data[part].data.goods_data;
      cur_sele_goods_ids = data[part].data.goods_ids;
      cur_data = data[part];
      this.sele_goods_param.total_num = 5;
    } else if (part == 'right') {
      modalSpuShow = true;
      cur_sele_goods = data[part].data.goods_data;
      cur_sele_goods_ids = data[part].data.goods_ids;
      cur_data = data[part];
      this.sele_goods_param.total_num = 4;
    } else if (part == 'left_img') {
      //左侧图片
      cur_data = data.left;
      modalSingleImgVisible = true;
    } else if (part == 'left_cat_title') {
      //左侧分类信息标题
      cur_data = data.left.cat_data.title_info;
      for (let i in addData) {
        addData[i].initialValue = cur_data[addData[i].name];
      }
      modalVisible = true;
    } else if (part == 'right_title') {
      //右侧标题设置
      cur_data = data.right.title_info;
      for (let i in addData) {
        addData[i].initialValue = cur_data[addData[i].name];
      }
      modalVisible = true;
    } else if (part == 'top_title_link') {
      //顶部标题设置
      cur_data = data.title_info;
      modalSldDiyTitleLinkVisible = true;
    } else if (part == 'left_cat_data') {
      //左侧分类标题设置
      cur_sele_cats = data.left.cat_data.cat_datas;
      cur_sele_cats_ids = data.left.cat_data.cat_ids;
      cur_data = data.left.cat_data;
      modalComCatSelectorShow = true;
      this.sele_cats_param.max_num = 9;
    }
    this.setState({
      cur_part: part,
      cur_data,
      modalVisible,
      modalSpuShow,
      cur_sele_goods,
      cur_sele_goods_ids,
      cur_sele_cats,
      cur_sele_cats_ids,
      modalSingleImgVisible,
      modalTitle: modalTitle,
      modal_tip: modalTip,
      addData,
      modalSldDiyTitleLinkVisible,
      modalComCatSelectorShow,
    });
  };

  sldHandleConfirm = (val) => {
    let { cur_part, data } = this.state;
    if (cur_part == 'left_img') {
      data.left.data = val;
    } else if (cur_part == 'left_cat_title') {
      data.left.cat_data.title_info = val;
    } else if (cur_part == 'right_title') {
      data.right.title_info = val;
    } else if (cur_part == 'top_title_link') {
      //顶部标题数据
      for (let i in val) {
        if (i == 'title') {
          data.title_info.title.initialValue = val.title;
        } else if (i == 'sub_title') {
          data.title_info.sub_title.initialValue = val.sub_title;
        } else if (i == 'link_type') {
          data.title_info.link_type = val.link_type;
          data.title_info.link_value = val.link_value;
          data.title_info.info = val.info != undefined ? val.info : {};
        }
      }
    }
    this.setState({
      data,
      modalVisible: false,
      modalSldDiyTitleLinkVisible: false,
    }, () => {
      this.props.save_tpl_data(data, this.refs.wrap_html.innerHTML);//保存数据
    });
  };

  sldHandleCancle = () => {
    this.setState({
      modalVisible: false,
      modalSingleImgVisible: false,
      modalSpuShow: false,
      modalSldDiyTitleLinkVisible: false,
      modalComCatSelectorShow: false,
    });
  };

  //选中spu事件
  seleSpu = (selectedRows, selectedRowKeys) => {
    let { data, cur_part } = this.state;
    if (cur_part == 'left_cat_data') {
      //左侧分类数据
      data.left.cat_data.cat_ids = selectedRowKeys;
      data.left.cat_data.cat_datas = selectedRows;
    } else {
      data[cur_part].data.goods_ids = selectedRowKeys;
      data[cur_part].data.goods_data = selectedRows;
    }
    this.setState({ data }, () => {
      this.props.save_tpl_data(data, this.refs.wrap_html.innerHTML);//保存数据
      this.sldHandleCancle();
    });
  };

  //渲染页面右侧商品数据
  render_right_goods = (item, index) => {
    let is_empty = typeof (item) != 'object' ? true : false;
    return <div key={index} className={styles.item}>
      <div className={styles.wrap}>
        <div className={styles.left_pic}>
          <a href="javascript:;" className={`${styles.ad_img} ${styles.example_text}`}>
            {is_empty
              ? <span>{sldComLanguage('【90*90】')}</span>
              : <img src={item.mainImage} alt={item.goodsName}/>
            }

          </a>
        </div>
        <div className={styles.right_info}>
          <p className={styles.title}>
            <a href="javascript:;"
               title={is_empty ? `${sldComLanguage('商品名称')}` : item.goodsName}>{is_empty ? `${sldComLanguage('商品名称')}` : item.goodsName}</a>
          </p>
          <p className={styles.price}>
            ￥<span className={styles.money_number}>{is_empty ? 0.00 : item.goodsPrice}</span>
          </p>
        </div>
      </div>
    </div>;
  };

  //渲染中间商品信息
  render_center_goods = (item, index) => {
    let is_empty = typeof (item) != 'object' ? true : false;
    let content = '';
    let goods_name = is_empty ? `${sldComLanguage('商品名称')}` : item.goodsName;
    let img_part = is_empty ? <span>{sldComLanguage('示例产品')}<br/>【162*162】</span> :
      <img src={item.mainImage} alt={item.goodsName}/>;
    let goods_price = is_empty ? 0.00 : item.goodsPrice;
    if (index == 0) {
      content = <div key={index} className={`${styles.big_item} ${styles.item}`}>
        <div className={styles.wrap}>
          <div className={styles.left_pic}>
            <a href="javascript:;" className={`${styles.ad_img} ${styles.example_text}`}>
              {img_part}
            </a>
          </div>
          <div className={styles.right_info}>
            <p className={styles.title}>
              <a href="javascript:;" title={goods_name}>{goods_name}</a>
            </p>
            <p className={styles.price}>
              ￥<span className={styles.money_number}>{goods_price}</span>
            </p>
          </div>
        </div>
      </div>;
    } else {
      content = <div key={index} className={`${styles.item} ${index > 1 ? styles.bottom_item : null}`}>
        <div className={styles.wrap}>
          <a href="javascript:;" className={`${styles.ad_img} ${styles.example_text} ${styles.special}`}>
            {img_part}
          </a>
          <p className={styles.title}>
            <a href="javascript:;" title={goods_name}>{goods_name}</a>
          </p>
          <p className={styles.price}>￥<span className={styles.money_number}>{goods_price}</span>
          </p>
        </div>
      </div>;
    }
    return content;
  };

  render() {
    const { data, submiting, modalVisible, cur_data, modalSpuShow, cur_sele_goods, cur_sele_goods_ids, cur_sele_cats, cur_sele_cats_ids, modalSingleImgVisible, modalTitle, modal_tip, addData, modalSldDiyTitleLinkVisible, modalComCatSelectorShow } = this.state;
    return (
      <Fragment>
        <div ref={'wrap_html'}>
          <div className={`${styles.w_sld_react_1210} ${styles.adv_05_wrap}`}>
            <div className={styles.floor}>
              <div className={styles.floor_layout}>
                <div className={`${styles.floor_con} ${styles.floor_con3}`}>
                  <div className={styles.floor_title}>
                    <div className={styles.sld_mask}
                         onClick={() => this.editTpl('top_title_link', `${sldComLanguage('标题设置')}`)}>
                      <span>{sldComLanguage('编辑')}</span>
                    </div>
                    <h2>
												<span
                          className={styles.main_title}>{data.title_info.title.initialValue != '' ? data.title_info.title.initialValue : `${sldComLanguage('添加标题')}`}</span>
                      <span
                        className={styles.sub_title}>{data.title_info.sub_title.initialValue != '' ? data.title_info.sub_title.initialValue : `${sldComLanguage('添加子标题')}`}</span>
                    </h2>
                    <div className={styles.right_action}>
                      <a
                        href="javascript:void(0)">{sldComLanguage('查看更多')}<i>&gt;&gt;</i></a>
                    </div>
                  </div>
                  <div className={styles.floor_content}>
                    <div className={styles.floor_left}>
                      <div className={styles.floor_bg_img}>
                        <div className={styles.sld_mask}
                             onClick={() => this.editTpl('left_img', `${sldComLanguage('左侧图片设置')}`)}>
                          <span>{sldComLanguage('编辑')}</span>
                        </div>
                        <a className={`${styles.ad_img} ${styles.example_text}`}
                           href="javascript:;">
                          {data.left.data.imgUrl != '' ?
                            <img src={data.left.data.imgUrl}/> :
                            <span>{sldComLanguage('此处添加【298*482】图片')}</span>}
                        </a>
                      </div>
                      <div className={styles.floor_words}>
                        <div className={styles.floor_words_top_title}>
                          <div className={styles.sld_mask}
                               onClick={() => this.editTpl('left_cat_title', `${sldComLanguage('左侧分类信息标题')}`)}>
                            <span>{sldComLanguage('编辑')}</span>
                          </div>
                          <font></font>
                          <span>{data.left.cat_data.title_info.title_name != '' ? data.left.cat_data.title_info.title_name : `${sldComLanguage('添加标题')}`}</span>
                          <font></font>
                        </div>
                        <ul className={styles.cat_data_wrap}>
                          <div className={styles.sld_mask}
                               onClick={() => this.editTpl('left_cat_data', `${sldComLanguage('左侧分类选择9个')}`)}>
                            <span>{sldComLanguage('编辑')}</span>
                          </div>
                          {data.left.cat_data.cat_datas.length == 0
                            ? sld_com_empty_arrar_9.map((item, index) => {
                              return <li key={index}>
                                <a href="javascript:;"
                                   title={sldComLanguage('分类名称')}>{sldComLanguage('分类名称')}</a>
                              </li>;
                            })
                            : data.left.cat_data.cat_datas.map((item, index) => {
                              return <li key={index}>
                                <a href="javascript:;"
                                   title={item.categoryName}>{item.categoryName}</a>
                              </li>;
                            })
                          }
                        </ul>
                      </div>
                    </div>
                    <div
                      style={{ borderColor: data.right.title_info.title_color ? data.right.title_info.title_color : '#fc5863' }}
                      className={styles.floor_right}>
                      <div className={styles.floor_right_main}>
                        <div className={styles.sld_mask}
                             onClick={() => this.editTpl('center', `${sldComLanguage('商品选择5个')}`)}>
                          <span>{sldComLanguage('编辑')}</span>
                        </div>
                        <div className={styles.floor_content}>
                          {data.center.data.goods_data.length == 0
                            ? sld_com_empty_arrar_5.map((item, index) => {
                              return this.render_center_goods(item, index);
                            })
                            : data.center.data.goods_data.map((item, index) => {
                              return this.render_center_goods(item, index);
                            })
                          }
                        </div>
                      </div>

                      <div className={styles.floor_right_new}>
                        <div className={styles.floor_right_new_top_title}>
                          <div className={styles.sld_mask}
                               onClick={() => this.editTpl('right_title', `${sldComLanguage('右侧标题设置')}`)}>
                            <span>{sldComLanguage('编辑')}</span>
                          </div>
                          <font
                            style={{ background: data.right.title_info.title_color ? data.right.title_info.title_color : '#fc5863' }}></font>
                          <span
                            style={{ color: data.right.title_info.title_color ? data.right.title_info.title_color : '#fc5863' }}>{data.right.title_info.title_name != '' ? data.right.title_info.title_name : `${sldComLanguage('添加标题')}`}</span>
                          <font
                            style={{ background: data.right.title_info.title_color ? data.right.title_info.title_color : '#fc5863' }}></font>
                        </div>
                        <div className={styles.floor_content}>
                          <div className={styles.sld_mask}
                               onClick={() => this.editTpl('right', `${sldComLanguage('商品选择4个')}`)}>
                            <span>{sldComLanguage('编辑')}</span>
                          </div>
                          {data.right.data.goods_data.length == 0
                            ? sld_com_empty_arrar_4.map((item, index) => {
                              return this.render_right_goods(item, index);
                            })
                            : data.right.data.goods_data.map((item, index) => {
                              return this.render_right_goods(item, index);
                            })
                          }
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <SldDiySingleImgModal
          width={1000}
          title={modalTitle}
          sldSeleSingleRow={true}
          submiting={submiting}
          modalVisible={modalSingleImgVisible}
          sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
          sldHandleCancle={this.sldHandleCancle}
          content={cur_data}
          modal_tip={modal_tip}
        />
        <SldDiyTitleLinkModal
          width={1000}
          title={modalTitle}
          sldSeleSingleRow={true}
          submiting={submiting}
          modalVisible={modalSldDiyTitleLinkVisible}
          sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
          sldHandleCancle={this.sldHandleCancle}
          content={cur_data}
          modal_tip={modal_tip}
        />
        { /*标题对话框-start*/}
        <SldModal
          title={modalTitle}
          submiting={submiting}
          width={500}
          modalVisible={modalVisible}
          sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
          sldHandleCancle={this.sldHandleCancle}
          formItemLayoutModal={formItemLayoutModal}
          content={addData}
        />
        { /*标题对话框-end*/}
        {/*添加spu的modal框-start*/}
        {/*商品多选的modal框-start*/}
        <SldSelMoreLeftRightGoods selectedRows={cur_sele_goods}
                                  selectedRowKeys={cur_sele_goods_ids}
                                  modalVisible={modalSpuShow} width={1000}
                                  height={document.body.clientHeight - 400}
                                  sldHandleSeleMoreModalCancle={this.sldHandleCancle} seleSvideo={this.seleSpu}
                                  title={modalTitle} extra={this.sele_goods_param}/>
        {/*商品多选的modal框-end*/}
        <SldSelCatMore selectedRows={cur_sele_cats} selectedRowKeys={cur_sele_cats_ids}
                       modalAddSkuIsShow={modalComCatSelectorShow} width={1000}
                       sldHandleAddSkuModalCancle={this.sldHandleCancle} seleSku={this.seleSpu}
                       modaltitle={modalTitle} extra={this.sele_cats_param}/>
        {/*添加spu的modal框-end*/}
      </Fragment>
    );
  }
}
