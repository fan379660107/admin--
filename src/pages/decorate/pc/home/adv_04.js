/*
* 猜你喜欢模块
* 标题可以自定义
* 商品一行5个，为了页面效果好看，建议选择的商品数量是5的倍数
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form } from 'antd';
import {
  formItemLayoutModal,
  sldComLanguage,
} from '@/utils/utils';
import styles from '../pcdecorate.less';
import SldModal from '@/components/SldModal/SldModal';
import SldSelMoreLeftRightGoods from '@/components/SldSelMoreLeftRightGoods';

let sthis = '';
let getFieldDecorator_new = '';
const empty_data = [1, 2, 3, 4, 5];
@connect(({ product }) => ({
  product,
}))
@Form.create()
export default class Adv_04 extends Component {
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
      cur_part: '',//当前操作的部分，比如left，center，right
      cur_data: {},//当前操作数据
      cur_data1: {},//当前操作数据
      submiting: false,//按钮loading
      modalVisible: false,//是否展示modal
      modalSpuShow: false,//是否展示选择商品modal
      tpl_info: props.tpl_info,
      addData: [{
        type: 'input',
        label: `${sldComLanguage('标题名称')}`,
        name: 'title_name',
        placeholder: `${sldComLanguage('请输入标题名称')}`,
        extra: `${sldComLanguage('标题名称不能为空，10个字符以内')}`,
        initialValue: '',
        maxLength:10,
        rules: [{
          required: true,
          whitespace: true,
          message: `${sldComLanguage('请输入标题名称')}`,
        }],
      }, {
        type: 'more_color_picker',
        label: `${sldComLanguage('颜色')}`,
        name: 'title_color',
        placeholder: `${sldComLanguage('请点击选择颜色')}`,
        initialValue: '',
        is_show: false,
        callbackShow: (color) => this.sldHandleColorPicker(color, 'title_color', 'is_show'),
        callback: (color) => this.sldHandleColorPicker(color, 'title_color', 'color'),
      }, {
        type: 'empty',
        name: 'empty',
        height: 0,
      }],//modal框的数据
      data: {
        type: 'adv_04',
        title_info: {
          title_name: '',//标题名称
          title_color: '',//标题颜色
        },
        data: {
          goods_ids: [],
          goods_data: [],
        },//商品信息
      },//装修的数据
    };
  }

  sele_goods_param = {
    type: 'common',
    total_num: 0,
    min_num: 5,
  };//商品选择器参数


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

  //设置颜色  color:选中的颜色值  name:addData里面的name  type：color 修改颜色， is_show 是否显示
  sldHandleColorPicker = (color, name, type) => {
    let { addData } = this.state;
    for (let i in addData) {
      if (addData[i].name == name) {
        if (type == 'is_show') {
          addData[i].is_show = color;
        } else if (type == 'color') {
          addData[i].initialValue = color;
        }
      } else {
        if (addData[i].name == 'empty') {
          if (type == 'is_show' && color) {
            addData[i].height = 300;
          } else if (type == 'is_show' && !color) {
            addData[i].height = 0;
          }
        }

        if (type == 'is_show') {
          addData[i].is_show = false;
        }
      }

    }
    this.setState({ addData });
  };

  //编辑板块 type：类型  modalTitle：弹框的标题  modalTip：弹框的整体提示
  editTpl = (type, modalTitle = '', modalTip = []) => {
    let { data, modalVisible, modalSpuShow, cur_sele_goods, cur_sele_goods_ids, cur_data, addData } = this.state;
    if (type == 'goods') {
      //商品选择
      modalSpuShow = true;
      cur_sele_goods = data.data.goods_data;
      cur_sele_goods_ids = data.data.goods_ids;
      cur_data = data.data;
    } else {
      modalVisible = true;
      for (let i in addData) {
        addData[i].initialValue = data.title_info[addData[i].name];
      }
      cur_data = data.title_info;
    }
    this.setState({
      cur_part: type,
      cur_data,
      modalVisible,
      modalSpuShow,
      cur_sele_goods,
      cur_sele_goods_ids,
      modalTitle: modalTitle,
      modal_tip: modalTip,
      addData,
    });
  };

  sldHandleConfirm = (val) => {
    let { data, addData } = this.state;
    //标题数据组装
    data.title_info.title_name = val.title_name;
    for (let i in addData) {
      if (addData[i].name == 'title_color') {
        data.title_info.title_color = addData[i].initialValue;
        break;
      }
    }
    this.setState({
      data,
      modalVisible: false,
    }, () => {
      this.props.save_tpl_data(data, this.refs.wrap_html.innerHTML);//保存数据
    });
  };

  sldHandleCancle = () => {
    this.setState({ modalVisible: false, modalSpuShow: false });
  };

  //选中spu事件
  seleSpu = (selectedRows, selectedRowKeys) => {
    let { data } = this.state;
    data.data.goods_ids = selectedRowKeys;
    data.data.goods_data = selectedRows;
    this.setState({ data }, () => {
      this.props.save_tpl_data(data, this.refs.wrap_html.innerHTML);//保存数据
      this.sldHandleCancle();
    });
  };

  render() {
    const { data, submiting, modalVisible, modalSpuShow, cur_sele_goods, cur_sele_goods_ids, modalTitle, addData } = this.state;
    return (
      <Fragment>
        <div ref={'wrap_html'}>
          <div className={`${styles.w_sld_react_1210} ${styles.adv_04_wrap}`}>
            <div className={styles.floor_title}>
              <div className={styles.sld_mask}
                   onClick={() => this.editTpl('title', `${sldComLanguage('顶部标题设置')}`)}>
                <span>{sldComLanguage('编辑')}</span>
              </div>
              <h2>
                <font
                  style={data.title_info.title_color != '' ? { background: data.title_info.title_color } : null}>&nbsp;</font>
                <span
                  style={data.title_info.title_color != '' ? { color: data.title_info.title_color } : null}>{data.title_info.title_name != '' ? data.title_info.title_name : `${sldComLanguage('请填写标题')}`}</span>
                <font
                  style={data.title_info.title_color != '' ? { background: data.title_info.title_color } : null}>&nbsp;</font>
              </h2>
            </div>
            <div className={styles.floor_goods}>
              <div className={styles.sld_mask}
                   onClick={() => this.editTpl('goods', `${sldComLanguage('商品选择(至少选择5个商品，建议是5的倍数)')}`, [`${sldComLanguage('标题不能为空，最多输入10个字')}`, `${sldComLanguage('择不同的颜色，标题颜色随之改变')}`])}>
                <span>{sldComLanguage('编辑')}</span>
              </div>
              {data.data.goods_data.length == 0 &&
              empty_data.map((item) => {
                return <div key={item} className={styles.item}>
                  <div className={styles.wrap}>
                    <a className={styles.example_text}>
                      <span>{sldComLanguage('示例产品')}<br/>【172*170】</span>
                    </a>
                    <p className={styles.title}>
                      <a href="javascript:;" title={`${sldComLanguage('商品名称')}`}>{sldComLanguage('商品名称')}</a>
                    </p>
                    <p className={styles.price}>
                      <span className={styles.second_color}>{sldComLanguage('￥')}<span className={styles.money_number}>0.00</span>
                      </span>
                    </p>
                  </div>
                </div>;
              })
              }

              {data.data.goods_data.length > 0 &&
              data.data.goods_data.map((item) => {
                return <div key={item.id} className={styles.item}>
                  <div className={styles.wrap}>
                    <a href="javascript:;" className={styles.example_text}>
                      <img src={item.mainImage}/>
                    </a>
                    <p className={styles.title}>
                      <a href="javascript:;" title={item.goodsName}>{item.goodsName}</a>
                    </p>
                    <p className={styles.price}>
                      <span className={styles.second_color}>{sldComLanguage('￥')}<span
                        className={styles.money_number}>{item.goodsPrice}</span>
                      </span>
                    </p>
                  </div>
                </div>;
              })
              }
            </div>


          </div>
        </div>
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
        {/*商品多选的modal框-start*/}
        <SldSelMoreLeftRightGoods selectedRows={cur_sele_goods}
                                  selectedRowKeys={cur_sele_goods_ids}
                                  modalVisible={modalSpuShow} width={1000}
                                  height={document.body.clientHeight - 400}
                                  sldHandleSeleMoreModalCancle={this.sldHandleCancle} seleSvideo={this.seleSpu}
                                  title={modalTitle} extra={this.sele_goods_param}/>
        {/*商品多选的modal框-end*/}
      </Fragment>
    );
  }
}
