/*
* 平台导航，2行6列导航设置，每个导航可以设置一个主标题和子标题
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form } from 'antd';
import {
  sldComLanguage,
} from '@/utils/utils';
import styles from '../pcdecorate.less';
import SldDiyMoreImgModal from '@/components/SldDiyMoreImgModal/SldDiyMoreImgModal';
import global from '@/global.less';

let sthis = '';
let getFieldDecorator_new = '';
@connect(({ product }) => ({
  product,
}))
@Form.create()
export default class Adv_20 extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    const {
      form: { getFieldDecorator },
    } = props;
    getFieldDecorator_new = getFieldDecorator;
    this.state = {
      cur_data: {},
      modalTitle: '',//弹框的标题
      modal_tip: [],//弹框的提示语
      submiting: false,//按钮loading
      modalVisible: false,//是否展示modal
      tpl_info: props.tpl_info,
      data: {
        type: 'adv_20',
        data: [[{
          main_title: '导航标题',
          sub_title: '导航子标题',
          imgUrl: '',
          imgPath: '',
          title: '',
          link_type: '',
          link_value: '',
          info: {},
        }, {
          main_title: '导航标题',
          sub_title: '导航子标题',
          imgUrl: '',
          imgPath: '',
          title: '',
          link_type: '',
          link_value: '',
          info: {},
        }, {
          main_title: '导航标题',
          sub_title: '导航子标题',
          imgUrl: '',
          imgPath: '',
          title: '',
          link_type: '',
          link_value: '',
          info: {},
        }, {
          main_title: '导航标题',
          sub_title: '导航子标题',
          imgUrl: '',
          imgPath: '',
          title: '',
          link_type: '',
          link_value: '',
          info: {},
        }, {
          main_title: '导航标题',
          sub_title: '导航子标题',
          imgUrl: '',
          imgPath: '',
          title: '',
          link_type: '',
          link_value: '',
          info: {},
        }, {
          main_title: '导航标题',
          sub_title: '导航子标题',
          imgUrl: '',
          imgPath: '',
          title: '',
          link_type: '',
          link_value: '',
          info: {},
        }], [{
          main_title: '导航标题',
          sub_title: '导航子标题',
          imgUrl: '',
          imgPath: '',
          title: '',
          link_type: '',
          link_value: '',
          info: {},
        }, {
          main_title: '导航标题',
          sub_title: '导航子标题',
          imgUrl: '',
          imgPath: '',
          title: '',
          link_type: '',
          link_value: '',
          info: {},
        }, {
          main_title: '导航标题',
          sub_title: '导航子标题',
          imgUrl: '',
          imgPath: '',
          title: '',
          link_type: '',
          link_value: '',
          info: {},
        }, {
          main_title: '导航标题',
          sub_title: '导航子标题',
          imgUrl: '',
          imgPath: '',
          title: '',
          link_type: '',
          link_value: '',
          info: {},
        }, {
          main_title: '导航标题',
          sub_title: '导航子标题',
          imgUrl: '',
          imgPath: '',
          title: '',
          link_type: '',
          link_value: '',
          info: {},
        }, {
          main_title: '导航标题',
          sub_title: '导航子标题',
          imgUrl: '',
          imgPath: '',
          title: '',
          link_type: '',
          link_value: '',
          info: {},
        }]],
      },
    };
  }


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

  sldHandleCancle = () => {
    this.setState({ modalVisible: false });
  };

  //编辑板块 part：标示哪一部分，比如left，center type：某一模块下的具体部分  modalTitle：弹框的标题  modalTip：弹框的整体提示,tab_index 当前选中的tab的index
  editTpl = (part = '', type = '', modalTitle = '', modalTip = []) => {
    let { data, modalVisible, cur_data } = this.state;
    cur_data.data = data.data[type];
    modalVisible = true;
    this.operate_type = type;//第index行
    cur_data.width = 70;
    cur_data.height = 70;
    this.setState({
      cur_part: type,
      cur_data,
      modalVisible,
      modalTitle,
      modal_tip: modalTip,
    });
  };


  sldHandleConfirm = (val) => {
    let { data, cur_part } = this.state;
    data.data[cur_part] = JSON.parse(JSON.stringify(val));
    this.setState({
      data: JSON.parse(JSON.stringify(data)),
      modalVisible: false,
    }, () => {
      this.props.save_tpl_data(data, this.refs.wrap_html.innerHTML);//保存数据
    });
  };

  render() {
    const { data, submiting, modalTitle, modalVisible, cur_data, modal_tip } = this.state;
    return (
      <Fragment>
        <div ref={'wrap_html'}>
          <div className={`${styles.w_sld_react_1210} ${styles.adv_20}`}>
            <div className={`${styles.adv_20_wrap} ${global.flex_column_start_center}`}>

              {data.data.map((item, index) => {
                return <div className={`${global.flex_row_around_center} ${styles.adv_20_wrap_row}`}>

                  <div className={styles.sld_mask}
                       onClick={() => this.editTpl('', index, `${sldComLanguage('设置导航')}`)}>
                    <span>{sldComLanguage('编辑')}</span>
                  </div>

                  {item.map((child, child_index) => {
                    return <div className={`${global.flex_column_center_center} ${styles.adv_20_wrap_item}`}
                                key={'adv_20_' + index + '_' + child_index}>
                      <div className={`${global.flex_row_center_center}  ${styles.adv_20_wrap_item_img}`}
                           style={{
                             borderRadius: child.imgUrl ? 0 : 35,
                             background: child.imgUrl ? '#fff' : '#E8E8E8',
                           }}>
                        {child.imgUrl && <img src={child.imgUrl}/>}
                      </div>
                      <span className={styles.main_title}>{child.main_title}</span>
                      <span className={styles.sub_title}>{child.sub_title}</span>
                    </div>;
                  })}
                </div>;
              })}

            </div>
          </div>
        </div>
        <SldDiyMoreImgModal
          width={1000}
          title={modalTitle}
          sldSeleSingleRow={true}
          submiting={submiting}
          modalVisible={modalVisible}
          sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
          sldHandleCancle={this.sldHandleCancle}
          content={cur_data}
          modal_tip={modal_tip}
          client={'pc'}
          extra={{main_title_limit:4,sub_title_limit:6}}
        />
      </Fragment>
    );
  }
}
