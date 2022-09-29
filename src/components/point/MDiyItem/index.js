import React, { Component, Fragment } from 'react';
import { Form, Select, Radio, Input, DatePicker, TreeSelect } from 'antd';
import global from '@/global.less';
import {
  getOSvgMDiy,
  sldSvgIcon,
  getPartNumber,
} from '@/utils/utils';
import {
  sld_com_empty_arrar_4,
  sld_com_empty_arrar_6,
  sld_com_empty_arrar_2,
  sld_com_empty_arrar_9,
  video_defalut_img,
  live_defalut_img,
  sld_m_diy_notice_style,
} from '@/utils/util_data';
import styles from './index.less';
import 'react-quill/dist/quill.snow.css';
import { Scrollbars } from 'react-custom-scrollbars';
import Slider from 'react-slick';
import './slider.less';
import ALibbSvg from '@/components/ALibbSvg';

const FormItem = Form.Item;
const { RangePicker, MonthPicker } = DatePicker;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
const screenWidth = 371;
const empty_bg_color = '#DFF2FD';

const defailt_goods_img = require('@/assets/m_diy_img/default_goods_img.png');//装修默认的商品空图片

const videoStyelThreeBgColor = ['#B9E5FF', '#FFCEB9'];//短视频展示风格3的背景色


@Form.create()
export default class MDiyItem extends Component {
  state = {
    refresh_flag: 0,
  };

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.refresh_center_flag > this.props.refresh_center_flag) {
      let { refresh_flag } = this.state;
      this.setState({ refresh_flag: refresh_flag + 1 });
    }
  }

  handleItem = (index, type) => {
    const { handleMdiyCenItemOperate } = this.props;
    handleMdiyCenItemOperate(index, type);
  };

  /*
 * 输入框内容更改事件
 * val组件传回来的值，
 * type 修改值对应的键名
 * tar_index 多个数据的序号,主要用于轮播/导航/图片组合/TAB切换
 * */
  onChange = (val, type, tar_index = 0) => {
    let { select_data } = this.props;
    if ((select_data.type == 'more_tab' && type == 'nav_current')) {
      this.saveCurSelData(val, type, tar_index, 'single');
    }
  };

  //修改内容，数据根节点的操作
  saveCurSelData = (val, type, tar_index = 0, flag) => {
    let { select_data } = this.props;
    if (flag == 'single') {
      //根节点数据变更
      this.props.handleCurSelData({ [type]: val });
    } else if (flag == 'more') {
      //每个数组下面的操作
      let tar_data = select_data.data.filter((item, index) => index == tar_index)[0];
      tar_data[type] = val;
      this.props.handleCurSelData(select_data);
    }
  };

  //TAB切换商品数据为空的时候
  renderMoreTabContentEmpty = (type) => {
    let data = { ...this.props.data };
    let con = '';
    if (type == 'goods') {
      con = <div className={`${styles.goods_item} ${global.flex_column_start_start}`}
                 style={{ borderRadius: data.border_radius }}>
              <span className={styles.goods_img} style={{
                backgroundImage: 'url(' + require('@/assets/m_diy_img/more_tab/empty_goods_img.png') + ')',
                borderTopLeftRadius: data.border_radius,
                borderTopRightRadius: data.border_radius,
              }}></span>
        <span className={styles.goods_name}>商品名称商品名称商品名称商品名称商品名商品名称商品名称商品名称商品名称商品名</span>
        <div className={`${styles.bottom_part} ${global.flex_row_between_center}`}>
          <div className={`${styles.price} ${global.flex_row_start_end}`}>
            <span className={styles.unit}>0积分+¥0.00</span>
          </div>
        </div>
      </div>;
    } else if (type == 'live') {
      con = <div className={`${styles.live_item} ${global.flex_column_start_start}`}
                 style={{ borderRadius: data.border_radius }}>
        <img className={styles.empty_live_img} src={require('@/assets/m_diy_img/more_tab/empty_live.png')}
             style={{ borderRadius: data.border_radius }}/>
      </div>;
    } else if (type == 'svideo') {
      con = <div className={`${styles.svideo_item} ${global.flex_column_start_start}`}
                 style={{ borderRadius: data.border_radius }}>
        <img className={styles.empty_svideo_img}
             src={require('@/assets/m_diy_img/more_tab/empty_svideo.png')}
             style={{ borderRadius: data.border_radius }}/>
      </div>;
    }
    return con;
  };

  //渲染分类导航数据
  renderMoreTabContent = (item_info, index, item) => {
    const { select_data } = this.props;
    let data = { ...select_data };
    let con = '';
    if (item.data_type == 'goods') {
      con = <div className={`${styles.goods_item} ${global.flex_column_start_start}`}
                 style={{ borderRadius: data.border_radius }}>
                <span className={styles.goods_img} style={{
                  backgroundImage: 'url(' + item_info.mainImage + ')',
                  borderTopLeftRadius: data.border_radius,
                  borderTopRightRadius: data.border_radius,
                }}></span>
        <span className={styles.goods_name}>{item_info.goodsName}</span>
        <div className={`${styles.bottom_part} ${global.flex_row_between_center}`}>
          <div className={`${styles.price} ${global.flex_row_start_end}`}>
            <span className={styles.unit}>{item_info.integralPrice}积分+¥{item_info.cashPrice}</span>
          </div>
        </div>
      </div>;
    } else if (item.data_type == 'live') {
      con = <div className={`${styles.live_item} ${global.flex_column_start_start}`}
                 style={{ borderRadius: data.border_radius }}>
        <div className={styles.live_img} style={{
          backgroundImage: 'url(' + item_info.live_image_url + ')',
          borderTopLeftRadius: data.border_radius,
          borderTopRightRadius: data.border_radius,
        }}>
          <div className={`${styles.live_click} ${global.flex_row_start_center}`} style={{
            borderBottomRightRadius: data.border_radius,
            borderTopLeftRadius: data.border_radius,
          }}>
            {item_info.status == 2
              ? <img className={styles.back_icon} src={require('@/assets/m_diy_img/live/back_icon.png')}/>
              : <img className={styles.play_icon} src={require('@/assets/m_diy_img/live/living_icon.png')}/>
            }
            <span
              className={styles.live_click_num}>{item_info.click_num}人观看</span>
          </div>
          <img className={styles.right_bottom_icon}
               src={require('@/assets/m_diy_img/live/live_list_heart.gif')}/>
        </div>
        <span className={styles.live_name}>{item_info.live_name}</span>
        <div className={`${styles.bottom_part} ${global.flex_row_start_center}`}>
          <div className={`${styles.left} ${global.flex_row_start_center}`}>
            <img className={styles.author_avator}
                 src={item_info.member_avatar}/>
            <span className={styles.author_nick_name}>{item_info.member_nickname}</span>
          </div>
          <span className={styles.live_status}
                style={{ backgroundColor: item_info.status == 2 ? '#BCAEFE' : '#FF1F1F' }}>
            {item_info.status == 2 ? '回放' : '直播中'}
          </span>
        </div>
      </div>;
    } else if (item.data_type == 'svideo') {
      con = <div className={`${styles.svideo_item} ${global.flex_column_start_start}`}
                 style={{ borderRadius: data.border_radius }}>
        <div className={styles.svideo_img} style={{
          backgroundImage: 'url(' + item_info.video_image + ')',
          borderTopLeftRadius: data.border_radius,
          borderTopRightRadius: data.border_radius,
        }}>
          <div className={`${styles.video_click} ${global.flex_row_start_center}`}>
            <img className={styles.play_icon} src={require('@/assets/m_diy_img/svideo/play_icon.png')}/>
            <span
              className={styles.video_click_num}>{item_info.click_num}人观看</span>
          </div>
        </div>
        <span className={styles.svideo_name}>{item_info.video_name}</span>
        <div className={`${styles.bottom_part} ${global.flex_row_start_center}`}>
          <div className={`${styles.left} ${global.flex_row_start_center}`}>
            <img className={styles.author_avator}
                 src={item_info.member_avatar}/>
            <span className={styles.author_nick_name}>{item_info.video_name}</span>
          </div>
        </div>
      </div>;
    }
    return con;
  };

  renderItem = () => {
    const { data, select_data } = this.props;

    let con = '';

    if (data.type == 'lunbo') {
      //轮播
      if (data.data.length == 0) {
        con = <div className={`${styles.empty_swiper_img} ${global.flex_column_center_center}`}
                   style={{ height: data.height*373/710 }}>
          <ALibbSvg fill={'#fff'} width={40.8} height={33.6} type={'tupian1'}/>
          <span
            className={`${styles.center_tip} ${global.flex_row_common}`}>宽710*高不限</span>
        </div>;
      } else {
        con = <Slider {...{
          dots: true,
          infinite: true,
          speed: 500,
          slidesToShow: 1,
          slidesToScroll: 1,
          className: 'common',
          autoplay: true,
          autoplaySpeed: 2000,
          adaptiveHeight:true,
        }}>
          {data.data.map((item, index) => {
            return <div className={`${styles.lunbo_wrap} ${global.flex_row_common}`}
                        key={index} style={{ height: data.height*373/710 }}>
              {item.img
                ? <img src={item.img}/>
                : <div style={{ height: item.img_path?data.height * 373 / 710:120 }} className={`${styles.empty_swiper_img} ${global.flex_column_center_center}`}>
                  <ALibbSvg fill={'#fff'} width={40.8} height={33.6} type={'tupian1'}/>
                  <span
                    className={`${styles.center_tip} ${global.flex_row_common}`}>宽710*高不限</span>
                </div>
              }

            </div>;
          })
          }
        </Slider>;
      }
    } else if (data.type == 'nav') {
      //导航
      if (data.style_set == 'nav') {
        //导航样式
        con = <div className={`${styles.nav} ${global.flex_com_row_space_around_center}`}>
          {data.data.map((item, index) => {
            let nav_style = {};
            if (data.icon_set == 'up') {
              nav_style.marginBottom = 5;
              nav_style.marginRight = 0;
            } else if (data.icon_set == 'left') {
              nav_style.marginBottom = 0;
              nav_style.marginRight = 5;
            }
            return <div key={index}
                        className={`${styles.item} ${global.flex_com_row_center}`}
                        style={{ flexDirection: data.icon_set == 'up' ? 'column' : 'row' }}>
              {data.icon_set != 'no-icon' &&
              <img style={{ width: data.slide, height: data.slide, ...nav_style }}
                   src={item.img ? item.img : require('@/assets/m_diy_img/nav_default.png')}/>
              }
              <span className={`${styles.nav_text}`}>{item.name ? item.name : '导航'}</span>
            </div>;
          })}
        </div>;
      } else if (data.style_set == 'tag-nav') {
        //分组样式
        con = <div className={`${styles.nav} ${global.flex_com_row} ${styles.tag_nav}`}>
          {data.data.map((item, index) => {
            return <div key={index} className={`${styles.item} ${global.flex_com_row_center}`}>
              <img style={{ width: data.slide, height: data.slide }}
                   src={item.img ? item.img : require('@/assets/m_diy_img/nav_default.png')}/>
              <span className={styles.nav_text}>{item.name ? item.name : '导航'}</span>
            </div>;
          })}
        </div>;
      }
    } else if (data.type == 'tupianzuhe') {
      //图片组合
      let wrap_style = {};
      let tmp_data = {};
      if (data.sele_style == 2 || data.sele_style == 3) {
        wrap_style = { display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap' };
      } else if (data.sele_style == 4) {
        wrap_style = {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: 10,
          width: screenWidth - 20,
        };
        tmp_data.one_width = Math.trunc((screenWidth - 30) / 2);
        tmp_data.one_height = tmp_data.one_width + 10;
        tmp_data.second_height = Math.trunc(tmp_data.one_width / 2);
      } else if (data.sele_style == 5) {
        tmp_data.left_width = Math.trunc((screenWidth - 30) / 3);
        tmp_data.right_width = tmp_data.left_width * 2;
        wrap_style = {
          display: 'flex',
          flexDirection: 'cloumn',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: 10,
          height: tmp_data.right_width + 15,
          flexWrap: 'wrap',
        };
      } else if (data.sele_style == 6) {
        tmp_data.left_width = Math.trunc((screenWidth - 30) / 2);//第一个图片的宽
        tmp_data.left_height = Math.trunc(tmp_data.left_width / 2);//第一个图片的高
        tmp_data.total_height = tmp_data.left_width + tmp_data.left_height + 10;//该模块总高度
        wrap_style = {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: 10,
          width: screenWidth - 20,
        };
      } else if (data.sele_style == 7) {
        tmp_data.left_width = Math.trunc((screenWidth - 40) / 3);//第一个图片的宽
        tmp_data.total_height = tmp_data.left_width * 2 + 10;//该模块总高度
        wrap_style = {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: 10,
          width: screenWidth - 20,
        };
      }
      con = <div className={styles.tupianzuhe} style={{ ...wrap_style }}>
        {(data.sele_style == 0 || data.sele_style == 1 || data.sele_style == 2 || data.sele_style == 3) &&
        data.data.map((item, index) => {
          let detail = '';
          let style = {};
          let tip_width = 750;//提示图片宽度
          let tip_height = '不限';//提示图片高度
          if (data.sele_style == 0) {
            style = {};
          } else if (data.sele_style == 1) {
            style = { margin: 8, marginTop: 0 };
          } else if (data.sele_style == 2) {
            tip_width = 350;
            tip_height = '不限';
            style = { margin: 8, marginTop: 0, marginRight: 0, width: 173 };
          } else if (data.sele_style == 3) {
            tip_width = 240;
            tip_height = '不限';
            style = { margin: 8, marginTop: 0, marginRight: 0, width: 113 };
          }
          detail = <div key={index} className={`${styles.item} ${styles.item_0}`} style={{
            height: item.img ? 'auto' : item.height, ...style,
            backgroundColor: item.img ? '#fff' : empty_bg_color,
          }}>
            {item.img
              ? <img src={item.img}/>
              : <div className={`${global.flex_column_center_center}`}>
                <ALibbSvg fill={'#fff'} width={40.8} height={33.6} type={'tupian1'}/>
                <span
                  className={`${styles.center_tip} ${global.flex_row_common}`}>宽{tip_width}*高{tip_height}</span>
              </div>
            }
          </div>;
          return detail;
        })
        }
        {data.sele_style == 4 &&
        <Fragment>
          <div style={{
            width: tmp_data.one_width,
            height: tmp_data.one_height,
            backgroundColor: data.data[0].img ? '#fff' : empty_bg_color,
          }} className={`${global.flex_com_row_center}`}>
            {data.data[0].img
              ? <img src={data.data[0].img}/>
              : <div className={`${global.flex_column_center_center}`}>
                <ALibbSvg fill={'#fff'} width={40.8} height={33.6} type={'tupian1'}/>
                <span
                  className={`${styles.center_tip} ${global.flex_row_common}`}>宽{300}*高{320}</span>
              </div>
            }
          </div>
          <div className={`${global.flex_com_column_space_betweent_center}`} style={{ height: tmp_data.one_height }}>
            <div style={{
              width: tmp_data.one_width,
              height: tmp_data.second_height,
              backgroundColor: data.data[1].img ? '#fff' : empty_bg_color,
            }} className={`${global.flex_com_row_center}`}>
              {data.data[1].img
                ? <img src={data.data[1].img}/>
                : <div className={`${global.flex_column_center_center}`}>
                  <ALibbSvg fill={'#fff'} width={40.8} height={33.6} type={'tupian1'}/>
                  <span
                    className={`${styles.center_tip} ${global.flex_row_common}`}>宽{300}*高{150}</span>
                </div>
              }
            </div>
            <div style={{
              width: tmp_data.one_width,
              height: tmp_data.second_height,
              backgroundColor: data.data[2].img ? '#fff' : empty_bg_color,
            }} className={`${global.flex_com_row_center}`}>
              {data.data[2].img
                ? <img src={data.data[2].img}/>
                : <div className={`${global.flex_column_center_center}`}>
                  <ALibbSvg fill={'#fff'} width={40.8} height={33.6} type={'tupian1'}/>
                  <span
                    className={`${styles.center_tip} ${global.flex_row_common}`}>宽{300}*高{150}</span>
                </div>
              }
            </div>

          </div>
        </Fragment>
        }
        {data.sele_style == 5 &&
        <Fragment>
          <div className={`${global.flex_com_space_between}`} style={{ width: screenWidth - 20 }}>
            <div style={{
              width: tmp_data.left_width,
              height: tmp_data.left_width,
              backgroundColor: data.data[0].img ? '#fff' : empty_bg_color,
            }} className={`${global.flex_com_row_center}`}>
              {data.data[0].img
                ? <img src={data.data[0].img}/>
                : <div className={`${global.flex_column_center_center}`}>
                  <ALibbSvg fill={'#fff'} width={40.8} height={33.6} type={'tupian1'}/>
                  <span
                    className={`${styles.center_tip} ${global.flex_row_common}`}>宽{200}*高{200}</span>
                </div>
              }
            </div>
            <div style={{
              width: tmp_data.right_width,
              height: tmp_data.left_width,
              backgroundColor: data.data[1].img ? '#fff' : empty_bg_color,
            }} className={`${global.flex_com_row_center}`}>
              {data.data[1].img
                ? <img src={data.data[1].img}/>
                : <div className={`${global.flex_column_center_center}`}>
                  <ALibbSvg fill={'#fff'} width={40.8} height={33.6} type={'tupian1'}/>
                  <span
                    className={`${styles.center_tip} ${global.flex_row_common}`}>宽{400}*高{200}</span>
                </div>
              }
            </div>

          </div>
          <div className={`${global.flex_com_space_between}`} style={{ width: screenWidth - 20 }}>
            <div style={{
              width: tmp_data.right_width,
              height: tmp_data.left_width,
              backgroundColor: data.data[2].img ? '#fff' : empty_bg_color,
            }} className={`${global.flex_com_row_center}`}>
              {data.data[2].img
                ? <img src={data.data[2].img}/>
                : <div className={`${global.flex_column_center_center}`}>
                  <ALibbSvg fill={'#fff'} width={40.8} height={33.6} type={'tupian1'}/>
                  <span
                    className={`${styles.center_tip} ${global.flex_row_common}`}>宽{400}*高{200}</span>
                </div>
              }
            </div>
            <div style={{
              width: tmp_data.left_width,
              height: tmp_data.left_width,
              backgroundColor: data.data[3].img ? '#fff' : empty_bg_color,
            }} className={`${global.flex_com_row_center}`}>
              {data.data[3].img
                ? <img src={data.data[3].img}/>
                : <div className={`${global.flex_column_center_center}`}>
                  <ALibbSvg fill={'#fff'} width={40.8} height={33.6} type={'tupian1'}/>
                  <span
                    className={`${styles.center_tip} ${global.flex_row_common}`}>宽{200}*高{200}</span>
                </div>
              }
            </div>
          </div>
        </Fragment>
        }
        {data.sele_style == 6 &&
        <Fragment>
          <div className={`${global.flex_com_column_space_betweent_center}`} style={{ height: tmp_data.total_height }}>
            <div style={{
              width: tmp_data.left_width,
              height: tmp_data.left_height,
              backgroundColor: data.data[0].img ? '#fff' : empty_bg_color,
            }} className={`${global.flex_com_row_center}`}>
              {data.data[0].img
                ? <img src={data.data[0].img}/>
                : <div className={`${global.flex_column_center_center}`}>
                  <ALibbSvg fill={'#fff'} width={40.8} height={33.6} type={'tupian1'}/>
                  <span
                    className={`${styles.center_tip} ${global.flex_row_common}`}>宽{300}*高{150}</span>
                </div>
              }
            </div>
            <div style={{
              width: tmp_data.left_width,
              height: tmp_data.left_width,
              backgroundColor: data.data[1].img ? '#fff' : empty_bg_color,
            }} className={`${global.flex_com_row_center}`}>
              {data.data[1].img
                ? <img src={data.data[1].img}/>
                : <div className={`${global.flex_column_center_center}`}>
                  <ALibbSvg fill={'#fff'} width={40.8} height={33.6} type={'tupian1'}/>
                  <span
                    className={`${styles.center_tip} ${global.flex_row_common}`}>宽{300}*高{300}</span>
                </div>
              }
            </div>

          </div>
          <div className={`${global.flex_com_column_space_betweent_center}`} style={{ height: tmp_data.total_height }}>
            <div style={{
              width: tmp_data.left_width,
              height: tmp_data.left_width,
              backgroundColor: data.data[2].img ? '#fff' : empty_bg_color,
            }} className={`${global.flex_com_row_center}`}>
              {data.data[2].img
                ? <img src={data.data[2].img}/>
                : <div className={`${global.flex_column_center_center}`}>
                  <ALibbSvg fill={'#fff'} width={40.8} height={33.6} type={'tupian1'}/>
                  <span
                    className={`${styles.center_tip} ${global.flex_row_common}`}>宽{300}*高{300}</span>
                </div>
              }
            </div>
            <div style={{
              width: tmp_data.left_width,
              height: tmp_data.left_height,
              backgroundColor: data.data[3].img ? '#fff' : empty_bg_color,
            }} className={`${global.flex_com_row_center}`}>
              {data.data[3].img
                ? <img src={data.data[3].img}/>
                : <div className={`${global.flex_column_center_center}`}>
                  <ALibbSvg fill={'#fff'} width={40.8} height={33.6} type={'tupian1'}/>
                  <span
                    className={`${styles.center_tip} ${global.flex_row_common}`}>宽{300}*高{150}</span>
                </div>
              }
            </div>

          </div>
        </Fragment>
        }
        {data.sele_style == 7 &&
        <Fragment>
          <div className={`${global.flex_com_column_space_betweent_center}`} style={{ height: tmp_data.total_height }}>
            <div style={{
              width: tmp_data.left_width,
              height: tmp_data.left_width,
              backgroundColor: data.data[0].img ? '#fff' : empty_bg_color,
            }} className={`${global.flex_com_row_center}`}>
              {data.data[0].img
                ? <img src={data.data[0].img}/>
                : <div className={`${global.flex_column_center_center}`}>
                  <ALibbSvg fill={'#fff'} width={40.8} height={33.6} type={'tupian1'}/>
                  <span
                    className={`${styles.center_tip} ${global.flex_row_common}`}>宽{200}*高{200}</span>
                </div>
              }
            </div>
            <div style={{
              width: tmp_data.left_width,
              height: tmp_data.left_width,
              backgroundColor: data.data[1].img ? '#fff' : empty_bg_color,
            }} className={`${global.flex_com_row_center}`}>
              {data.data[1].img
                ? <img src={data.data[1].img}/>
                : <div className={`${global.flex_column_center_center}`}>
                  <ALibbSvg fill={'#fff'} width={40.8} height={33.6} type={'tupian1'}/>
                  <span
                    className={`${styles.center_tip} ${global.flex_row_common}`}>宽{200}*高{200}</span>
                </div>
              }
            </div>

          </div>
          <div className={`${global.flex_com_column_space_betweent_center}`} style={{ height: tmp_data.total_height }}>
            <div style={{
              width: tmp_data.left_width,
              height: tmp_data.left_width,
              backgroundColor: data.data[2].img ? '#fff' : empty_bg_color,
            }} className={`${global.flex_com_row_center}`}>
              {data.data[2].img
                ? <img src={data.data[2].img}/>
                : <div className={`${global.flex_column_center_center}`}>
                  <ALibbSvg fill={'#fff'} width={40.8} height={33.6} type={'tupian1'}/>
                  <span
                    className={`${styles.center_tip} ${global.flex_row_common}`}>宽{200}*高{200}</span>
                </div>
              }
            </div>
            <div style={{
              width: tmp_data.left_width,
              height: tmp_data.left_width,
              backgroundColor: data.data[3].img ? '#fff' : empty_bg_color,
            }} className={`${global.flex_com_row_center}`}>
              {data.data[3].img
                ? <img src={data.data[3].img}/>
                : <div className={`${global.flex_column_center_center}`}>
                  <ALibbSvg fill={'#fff'} width={40.8} height={33.6} type={'tupian1'}/>
                  <span
                    className={`${styles.center_tip} ${global.flex_row_common}`}>宽{200}*高{200}</span>
                </div>
              }
            </div>

          </div>
          <div style={{
            width: tmp_data.left_width,
            height: tmp_data.total_height,
            backgroundColor: data.data[4].img ? '#fff' : empty_bg_color,
          }} className={`${global.flex_com_row_center}`}>
            {data.data[4].img
              ? <img src={data.data[4].img}/>
              : <div className={`${global.flex_column_center_center}`}>
                <ALibbSvg fill={'#fff'} width={40.8} height={33.6} type={'tupian1'}/>
                <span
                  className={`${styles.center_tip} ${global.flex_row_common}`}>宽{200}*高{420}</span>
              </div>
            }
          </div>
        </Fragment>
        }
      </div>;
    } else if (data.type == 'fzx') {
      //辅助线
      con = <div className={styles.fzx}>
        <hr style={{
          borderStyle: data.val,
          marginLeft: data.lrmargin,
          marginRight: data.lrmargin,
          marginTop: data.tbmargin,
          marginBottom: data.tbmargin,
          borderColor: data.color,
        }}/>
      </div>;
    } else if (data.type == 'fzkb') {
      //辅助空白
      con = <div className={styles.fzkb} style={{ height: data.text, backgroundColor: data.color }}>
      </div>;
    } else if (data.type == 'fuwenben') {
      //富文本
      con = <div className={styles.fuwenben}>
        {data.text
          ? <div className={'ql-editor'} dangerouslySetInnerHTML={{
            __html: data.text,
          }}/>
          : '点此编辑『富文本』内容:你可以对文字进行加粗、斜体、下划线、删除线、文字颜色、背景色、以及字号大小等简单排版操作。'
        }
      </div>;
    } else if (data.type == 'kefu') {
      //客服
      con = <div className={styles.kefu}>
        {sldSvgIcon('#666', 15, 15, 'phone')}
        <span className={styles.text}>{data.text}</span>
        <span>{data.tel}</span>
      </div>;
    } else if (data.type == 'gonggao') {
      let notice_bg = sld_m_diy_notice_style.filter(item => item.sele_style == data.show_style)[0]['left_img'];
      let show_text = data.text ? data.text : '公告：请填写内容,将会在手机上滚动显示!!!';
      //公告
      if (data.show_style == 'one') {
        con = <div className={styles.gonggao}>
          <img className={styles.left_img_1} src={notice_bg}/>
          <marquee className={`${styles.show_style_1}`}><span className={styles.left_img_1_text}>{show_text}</span>
          </marquee>
          <span className={styles.more_text_1}>>></span>
        </div>;
      } else {
        con = <div className={`${styles.gonggao}`}>
          <img className={styles.left_img_2} src={notice_bg}/>
          <marquee className={`${styles.show_style_2}`}><span className={styles.left_img_2_text}>{show_text}</span>
          </marquee>
          <span className={styles.more_text_2}>>></span>
        </div>;
      }

    } else if (data.type == 'tuijianshangpin') {
      //商品推荐
      let border_style = '';//商品样式  border_none无边白底  card-shadow卡片投影  border_eee描边白底
      if (data.border_style == 'border_none') {
        border_style = { border: 0 };
      } else if (data.border_style == 'card-shadow') {
        border_style = { border: 0, boxShadow: '0 2px 8px rgba(93,113,127,.08)' };
      } else if (data.border_style == 'border_eee') {
        border_style = { border: '1px solid #e6e6e6' };
      }
      let show_style = '';//展示类型：big 大图 small 一行两个 list 列表 一行一个
      let list_layout = {};//list 展示的话商品图片和商品信息变为横向布局
      if (data.show_style == 'small') {
        show_style = Math.floor((screenWidth - data.page_margin * 2 - data.goods_margin) / 2);
      } else if (data.show_style == 'list') {
        show_style = Math.floor((screenWidth - data.page_margin * 2) / 2);
        list_layout = {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        };
      } else {
        show_style = screenWidth - data.page_margin * 2;
      }

      con = <div className={styles.tuijianshangpin}
                 style={{
                   padding: data.page_margin,
                   width: 'calc(100%-data.page_margin*2)',
                   backgroundColor: data.border_style == 'border_none_grey_bg' ? '#f5f5f5' : '#fff',
                 }}>
        {data.data.info.length == 0 &&
        sld_com_empty_arrar_4.map((item, index) => {
          return this.render_tjsp(data, sld_com_empty_arrar_4, item, index, 'empty', border_style, show_style, list_layout);
        })
        }
        {data.data.info.length > 0 &&
        data.data.info.map((item, index) => {
          return this.render_tjsp(data, data.data.ids, item, index, 'goods', border_style, show_style, list_layout);
        })
        }
      </div>;
    } else if (data.type == 'svideo') {
      //短视频
      con = <div className={`${styles.video} ${global.flex_column_start_start}`}
                 style={{ background: data.show_style == 'three' ? '#f5f5f5' : '#fff' }}>
        <div className={`${styles.title} ${global.flex_row_between_center}`}>
          <span className={`${styles.left_con}`}>{data.title}</span>
          <span className={styles.right_con}>查看更多&nbsp;></span>
        </div>

        {(data.data.info.length == 0 && (data.show_style == 'one' || data.show_style == 'two' || data.show_style == 'three')) &&
        <div className={`${global.flex_row_start_start} ${styles.video_list}`} style={{
          height: data.show_style == 'two' ? 111 : (data.show_style == 'one' ? 171 : 230),
          width: '100%',
          overflow: 'hidden',
        }}>
          {data.data.info.length == 0 &&
          sld_com_empty_arrar_4.map((item_video, index_video) =>
            <div key={index_video} className={`${styles['item_' + data.show_style]}`} style={{
              backgroundImage: 'url(' + video_defalut_img()[data.show_style] + ')',
              borderRadius: data.border_radius,
            }}>
            </div>)
          }
        </div>}

        {data.data.info.length > 0 && data.show_style == 'one' &&
        <div className={`${global.flex_row_start_start} ${styles.video_list}`} style={{
          height: 171,
          width: '100%',
          overflow: 'hidden',
        }}>
          {
            data.data.info.map((item_video, index_video) =>
              <div key={index_video}
                   className={`${styles['item_' + data.show_style]} ${global.flex_column_between_start}`}
                   style={{ backgroundImage: 'url(' + item_video.video_image + ')', borderRadius: data.border_radius }}>
                <div className={`${styles.video_click} ${global.flex_row_start_center}`}>
                  <ALibbSvg fill={'#fff'} width={11} height={11} type={'bofang11'} extra={{ marginLeft: 3 }}/>
                  <span
                    className={styles.video_click_num}>{item_video.click_num}人观看</span>
                </div>
                <span className={styles.video_name}>{item_video.video_name}</span>
              </div>)
          }
        </div>
        }

        {data.data.info.length > 0 && data.show_style == 'two' &&
        <div className={`${global.flex_row_start_start} ${styles.video_list}`} style={{
          height: 111,
          width: '100%',
          overflow: 'hidden',
        }}>
          {data.data.info.map((item_video, index_video) =>
            <div key={index_video}
                 className={`${styles['item_' + data.show_style]} ${global.flex_column_between_start}`}
                 style={{ backgroundImage: 'url(' + item_video.video_image + ')', borderRadius: data.border_radius }}>
              <div className={`${styles.video_click} ${global.flex_row_start_center}`}>
                <ALibbSvg fill={'#fff'} width={11} height={11} type={'bofang11'} extra={{ marginLeft: 3 }}/>
                <span
                  className={styles.video_click_num}>{item_video.click_num}人观看</span>
              </div>
              <span className={styles.video_name} style={{
                borderBottomRightRadius: data.border_radius,
                borderBottomLeftRadius: data.border_radius,
              }}>{item_video.video_name}</span>
            </div>)}
        </div>
        }

        {data.data.info.length > 0 && data.show_style == 'three' &&
        <div className={`${global.flex_row_start_start} ${styles.video_list}`} style={{
          height: 230,
          width: '100%',
          overflow: 'hidden',
        }}>
          {data.data.info.map((item_video, index_video) =>
            <div key={index_video}
                 className={`${styles['item_' + data.show_style]} ${global.flex_column_between_start}`}
                 style={{ borderRadius: data.border_radius }}>
              <img className={styles.bg_img} src={item_video.video_image}
                   style={{ borderTopLeftRadius: data.border_radius, borderTopRightRadius: data.border_radius }}/>
              <span className={styles.bg_color} style={{
                borderTopLeftRadius: data.border_radius,
                borderTopRightRadius: data.border_radius,
                backgroundColor: videoStyelThreeBgColor[index_video],
              }}></span>
              <span className={styles.bottom_bg_color} style={{
                borderBottomRightRadius: data.border_radius,
                borderBottomLeftRadius: data.border_radius,
              }}></span>
              <div className={`${styles.video_info} ${global.flex_column_center_center}`}>
                <span
                  className={styles.video_click_num}>{item_video.click_num}人观看</span>
                <div className={`${styles.video_img} ${global.flex_row_center_center}`}
                     style={{ backgroundImage: 'url(' + item_video.video_image + ')' }}>
                  <ALibbSvg fill={'#fff'} width={20} height={20} type={'2'}/>
                </div>
                <span className={styles.video_name}>{item_video.video_name}</span>
                <span className={styles.video_desc}>{item_video.introdution}</span>
              </div>

            </div>)}
        </div>
        }

        {data.show_style == 'four' &&
        <Slider {...{
          className: 'center',
          centerMode: true,
          autoplay: true,
          infinite: true,
          centerPadding: '0',
          slidesToShow: 3,
          speed: 500,
        }}>
          {data.data.info.length == 0 ?
            sld_com_empty_arrar_6.map((item, index) => {
              return <div key={index} className="svideo_default_img">
                <img src={video_defalut_img()[data.show_style]} style={{ borderRadius: data.border_radius }}/>
              </div>;
            })
            : data.data.info.map((item_video, index_video) => {
              return <div key={index_video} className="svideo_default_img">
                <img src={item_video.video_image} style={{ borderRadius: data.border_radius }}/>
                <img className="item_four_video_left_bg" style={{ borderTopLeftRadius: data.border_radius }}
                     src={require('@/assets/m_diy_img/svideo/four_left_top_bg.png')}/>
                <div className="item_four_video_click">
                  <span
                    className="video_click_num">{item_video.click_num}人观看</span>
                </div>
              </div>;
            })
          }
        </Slider>
        }

        {(data.show_style == 'five') && <Scrollbars
          autoHide
          autowidth="true"
          autowidthmin={355}
          style={{ height: 150 }}>
          <div className={`${global.flex_row_start_start} ${styles.video_list}`}>
            {data.data.info.length == 0
              ? sld_com_empty_arrar_4.map((item_video, index_video) =>
                <div key={index_video} className={`${styles.item_five}`} style={{
                  backgroundImage: 'url(' + video_defalut_img()[data.show_style] + ')',
                  borderRadius: data.border_radius,
                }}>
                </div>,
              )
              : data.data.info.map((item_video, index_video) =>
                <div key={index_video} className={`${styles.item_five}`} style={{
                  backgroundImage: 'url(' + item_video.video_image + ')',
                  borderRadius: data.border_radius,
                }}>
                  <div className={`${styles.video_click_wrap} ${global.flex_row_center_center}`} style={{
                    borderBottomRightRadius: data.border_radius,
                    borderTopLeftRadius: data.border_radius,
                  }}>
                    <ALibbSvg fill={'#fff'} width={14} height={14} type={'bofang11'} extra={{ marginLeft: 3 }}/>
                    <span
                      className={styles.video_click_num}>{item_video.click_num}人观看</span>
                  </div>
                  <img style={{
                    borderBottomRightRadius: data.border_radius,
                    borderBottomLeftRadius: data.border_radius,
                  }} className={`${styles.bottom_bg}`}
                       src={require('@/assets/m_diy_img/svideo/front_bg_' + index_video + '.png')}/>
                  <span className={styles.video_name}>{item_video.video_name}</span>
                </div>,
              )
            }
          </div>
        </Scrollbars>}
      </div>;
    } else if (data.type == 'live') {
      //直播
      con = <div className={`${styles.video} ${global.flex_column_start_start}`}
                 style={{ background: '#fff' }}>
        <div className={`${styles.title} ${global.flex_row_between_center}`}>
          <span className={`${styles.left_con}`}>{data.title}</span>
          <span className={styles.right_con}>查看更多&nbsp;></span>
        </div>

        {data.show_style == 'one' &&
        <div className={`${global.flex_row_start_start} ${styles.live_list}`} style={{
          height: 171,
          width: '100%',
          overflow: 'hidden',
        }}>
          {data.data.info.length == 0
            ? sld_com_empty_arrar_2.map((item_video, index_video) =>
              <div key={index_video} className={`${styles['item_' + data.show_style]}`} style={{
                backgroundImage: 'url(' + live_defalut_img()[data.show_style] + ')',
                borderRadius: data.border_radius,
              }}>
              </div>)
            : data.data.info.map((item_video, index_video) =>
              <div key={index_video}
                   className={`${styles['item_' + data.show_style]} ${global.flex_column_between_start}`}
                   style={{
                     backgroundImage: 'url(' + item_video.live_image_url + ')',
                     borderRadius: data.border_radius,
                   }}>
                <div className={`${styles.live_click} ${global.flex_row_start_center}`} style={{
                  borderBottomRightRadius: data.border_radius,
                  borderTopLeftRadius: data.border_radius,
                }}>
                  <img className={styles.play_icon} src={require('@/assets/m_diy_img/live/living_icon.png')}/>
                  <span
                    className={styles.live_click_num}>{item_video.click_num}人观看</span>
                </div>
                <span className={styles.live_name}>{item_video.live_name}</span>
                <img className={styles.right_bottom_icon}
                     src={require('@/assets/m_diy_img/live/live_list_heart.gif')}/>
              </div>)
          }
        </div>
        }

        {(data.show_style == 'two') && <Scrollbars
          autoHide
          autowidth="true"
          autowidthmin={355}
          style={{ height: 120 }}>
          <div className={`${global.flex_row_start_start} ${styles.live_list}`}>
            {data.data.info.length == 0
              ? sld_com_empty_arrar_4.map((item_video, index_video) =>
                <div key={index_video} className={`${styles.item_two}`} style={{
                  backgroundImage: 'url(' + live_defalut_img()[data.show_style] + ')',
                  borderRadius: data.border_radius,
                }}>
                </div>,
              )
              : data.data.info.map((item_video, index_video) =>
                <div key={index_video} className={`${styles.item_two}`} style={{
                  backgroundImage: 'url(' + item_video.live_image_url + ')',
                  borderRadius: data.border_radius,
                }}>
                  <div className={`${styles.live_click_wrap} ${global.flex_row_center_center}`} style={{
                    borderBottomRightRadius: data.border_radius,
                    borderTopLeftRadius: data.border_radius,
                  }}>
                    <img className={styles.play_icon} src={require('@/assets/m_diy_img/live/living_icon.png')}/>
                    <span
                      className={styles.live_click_num}>{item_video.click_num}人观看</span>
                  </div>
                  <img className={styles.right_bottom_icon}
                       src={require('@/assets/m_diy_img/live/live_list_heart.gif')}/>
                  <span className={styles.live_name}>{item_video.live_name}</span>
                </div>,
              )
            }
          </div>
        </Scrollbars>}
      </div>;
    } else if (data.type == 'more_tab') {
      //TAB切换
      con = <div className={`${styles.tab_wrap} ${global.flex_column_start_start}`}>
        <Scrollbars
          autoHide
          autowidth="true"
          autowidthmin={355}
          style={{ height: 65 }}>
          <div className={`${styles.tab_top} ${global.flex_row_start_center}`}>
            {(data.data.length == 0 || (data.data.length == 1 && data.data[0].title == '' && data.data[0].sub_title == '')) ? sld_com_empty_arrar_9.map((item, index) => {
                return <div key={index} className={`${styles.item} ${global.flex_column_between_center}`}
                            onClick={() => this.onChange(index, 'nav_current', 0)}>
                  <div className={`${styles.tab_name_part} ${global.flex_column_between_center}`}>
                    <span className={styles.tab_name}>全部</span>
                    <span className={`${styles.line} ${data.nav_current == index ? styles.current_nav : null}`}></span>
                  </div>
                  <span className={styles.tab_sub_name}>全部分类</span>
                </div>;
              })
              : data.data.map((item, index) => {
                return <div key={index} className={`${styles.item} ${global.flex_column_between_center}`}
                            onClick={() => this.onChange(index, 'nav_current', 0)}>
                  <div className={`${styles.tab_name_part} ${global.flex_column_between_center}`}>
                    <span className={styles.tab_name}>{item.title}</span>
                    <span className={`${styles.line} ${data.nav_current == index ? styles.current_nav : null}`}></span>
                  </div>
                  <span className={styles.tab_sub_name}>{item.sub_title}</span>
                </div>;
              })
            }
          </div>
        </Scrollbars>
        <div className={`${styles.tab_content} ${global.flex_row_start_start}`}>
          {/*空数据默认展示空商品*/}
          {data.data.length == 0
          && sld_com_empty_arrar_4.map(() => {
            return this.renderMoreTabContentEmpty('goods');
          })
          }

          {data.data.length > 0 && data.data[data.nav_current] == undefined
          && sld_com_empty_arrar_4.map(() => {
            return this.renderMoreTabContentEmpty('goods');
          })
          }

          {data.data.length > 0 && data.data[data.nav_current] != undefined && data.data[data.nav_current].info.length == 0
          && sld_com_empty_arrar_4.map(() => {
            return this.renderMoreTabContentEmpty(data.data[data.nav_current].data_type);
          })
          }

          {data.data.length > 0 && data.data[data.nav_current] != undefined && data.data[data.nav_current].info.length > 0
          && data.data[data.nav_current].info.map((info_item, info_index) => {
            return this.renderMoreTabContent(info_item, info_index, data.data[data.nav_current]);
          })
          }

        </div>
      </div>;
    } else if (data.type == 'activity') {
      //活动组
      con = <div className={`${styles.activity}`}>
        {/* 拼团-s */}
        {data.show_style == 'pin' &&
        <div className={`${styles.pin_wrap} ${global.flex_column_start_start}`}>
          <div className={`${styles.top} ${global.flex_row_between_center}`}>
            <div className={`${styles.left} ${global.flex_row_start_center}`}>
              <img className={styles.pin_top_left_title_img}
                   src={require('@/assets/m_diy_img/activity/pin_top_left_title.png')}/>
              <span className={styles.title}>{data.title}</span>
            </div>
            <div className={`${styles.right} ${global.flex_row_end_center}`}>
              <span className={styles.view_more}>MORE</span>
              <img className={styles.pin_top_arrow_right_img}
                   src={require('@/assets/m_diy_img/activity/pin_top_arrow_right.png')}/>
            </div>
          </div>
          <div style={{ width: '100%', paddingLeft: 10, paddingRight: 10 }}>
            <Scrollbars
              autoHide
              autowidth="true"
              autowidthmin={355}
              style={{ height: 213 }}>
              <div className={`${styles.pin_goods_info} ${global.flex_row_start_start}`}>
                {data.data.info.length == 0
                  ? sld_com_empty_arrar_6.map((item, index) => {
                    return <div key={index}
                                className={`${global.flex_com_column_start_start} ${styles.goods_item}`}>
                      <div className={`${global.flex_row_common} ${styles.img}`}
                           style={{ borderRadius: data.border_radius }}>
                        <img src={require('@/assets/m_diy_img/empty_goods_img.png')}/>
                        <span className={styles.time}
                              style={{ background: data.tag_bg_color ? data.tag_bg_color : 'linear-gradient(45deg, #FCE000 0%, #FED600 0%, #FF5D00 0%, #FB3E31 100%)' }}>01:02:23</span>
                      </div>
                      <span className={styles.name}>这里是商品名称</span>
                      <div className={`${styles.price} ${global.flex_row_start_end}`}>
                        <span className={styles.unit}>¥</span>
                        <span className={styles.price_int}>{getPartNumber(12.34, 'int')}</span>
                        <span className={styles.price_decimal}>{getPartNumber(12.34, 'decimal')}</span>
                      </div>
                      <div className={`${styles.go_pin_wrap} ${global.flex_row_center_center}`}>
                        <img className={styles.pin_num_icon}
                             src={require('@/assets/m_diy_img/activity/pin_num_icon.png')}/>
                        <span className={styles.pin_num}>2人团</span>
                        <span className={styles.go_pin}>去开团</span>
                      </div>
                    </div>;
                  })
                  : data.data.info.map((item, index) => {
                    return <div key={index}
                                className={`${global.flex_com_column_start_start} ${styles.goods_item}`}>
                      <div className={`${global.flex_row_common} ${styles.img}`}
                           style={{ borderRadius: data.border_radius }}>
                        <img src={item.mainImage}/>
                        <span className={styles.time}
                              style={{ background: data.tag_bg_color ? data.tag_bg_color : 'linear-gradient(45deg, #FCE000 0%, #FED600 0%, #FF5D00 0%, #FB3E31 100%)' }}>03:12:23</span>
                      </div>
                      <span className={styles.name}>{item.goodsName}</span>
                      <div className={`${styles.price} ${global.flex_row_start_end}`}>
                        <span className={styles.unit}>¥</span>
                        <span className={styles.price_int}>{getPartNumber(item.activity_price, 'int')}</span>
                        <span className={styles.price_decimal}>{getPartNumber(item.activity_price, 'decimal')}</span>
                      </div>
                      <div className={`${styles.go_pin_wrap} ${global.flex_row_center_center}`}>
                        <img className={styles.pin_num_icon}
                             src={require('@/assets/m_diy_img/activity/pin_num_icon.png')}/>
                        <span className={styles.pin_num}>{item.team_count}人团</span>
                        <span className={styles.go_pin}>去开团</span>
                      </div>
                    </div>;
                  })
                }
              </div>
            </Scrollbars>
          </div>
        </div>
        }
        {/* 拼团-e */}

        {/* 限时折扣-s */}
        {data.show_style == 'discount' &&
        <div className={`${styles.discount_wrap} ${global.flex_column_start_start}`}>
          <div className={`${styles.top} ${global.flex_row_between_center}`}>
            <div className={`${styles.left} ${global.flex_row_start_center}`}>
              <img className={styles.discount_top_left_title_img}
                   src={require('@/assets/m_diy_img/activity/discount_top_left_title.png')}/>
              <span className={styles.title}>{data.title}</span>
            </div>
            <div className={`${styles.right} ${global.flex_row_end_center}`}>
              <span className={styles.view_more}>MORE</span>
              <img className={styles.discount_top_arrow_right_img}
                   src={require('@/assets/m_diy_img/activity/pin_top_arrow_right.png')}/>
            </div>
          </div>
          {data.sub_title &&
          <span className={`${styles.sub_title}`}>{data.sub_title}</span>
          }
          <div style={{ width: '100%', paddingLeft: 10, paddingRight: 10 }}>
            <Scrollbars
              autoHide
              autowidth="true"
              autowidthmin={355}
              style={{ height: 218 }}>
              <div className={`${styles.discount_goods_info} ${global.flex_row_start_start}`}>
                {data.data.info.length == 0
                  ? sld_com_empty_arrar_6.map((item, index) => {
                    return <div key={index}
                                className={`${global.flex_com_column_start_start} ${styles.goods_item}`}
                                style={{ borderRadius: data.border_radius }}>
                      <div className={`${global.flex_row_common} ${styles.img}`}>
                        <img src={require('@/assets/m_diy_img/empty_goods_img.png')}/>
                        <span className={styles.discount_tag}
                              style={{ background: data.tag_bg_color ? data.tag_bg_color : 'linear-gradient(0deg, #FCE000 0%, #FFAA06 0%, #FF8323 0%, #FF2A64 100%)' }}>限时抢购</span>
                      </div>
                      <span className={styles.name}>这里是商品名称</span>
                      <div className={`${styles.price} ${global.flex_row_start_end}`}>
                        <span className={styles.unit}>¥</span>
                        <span className={styles.price_int}>{getPartNumber(12.34, 'int')}</span>
                        <span className={styles.price_decimal}>{getPartNumber(12.34, 'decimal')}</span>
                      </div>
                      <div className={`${styles.go_discount_wrap} ${global.flex_row_center_center}`}>
                        <span className={styles.go_discount}>抢购</span>
                        <span className={styles.discount_time}>01:12:18</span>
                      </div>
                    </div>;
                  })
                  : data.data.info.map((item, index) => {
                    return <div key={index}
                                className={`${global.flex_com_column_start_start} ${styles.goods_item}`}
                                style={{ borderRadius: data.border_radius }}>
                      <div className={`${global.flex_row_common} ${styles.img}`}>
                        <img src={item.mainImage}/>
                        <span className={styles.discount_tag}
                              style={{ background: data.tag_bg_color ? data.tag_bg_color : 'linear-gradient(0deg, #FCE000 0%, #FFAA06 0%, #FF8323 0%, #FF2A64 100%)' }}>限时抢购</span>
                      </div>
                      <span className={styles.name}>{item.goodsName}</span>
                      <div className={`${styles.price} ${global.flex_row_start_end}`}>
                        <span className={styles.unit}>¥</span>
                        <span className={styles.price_int}>{getPartNumber(item.activity_price, 'int')}</span>
                        <span className={styles.price_decimal}>{getPartNumber(item.activity_price, 'decimal')}</span>
                      </div>
                      <div className={`${styles.go_discount_wrap} ${global.flex_row_center_center}`}>
                        <span className={styles.go_discount}>抢购</span>
                        <span className={styles.discount_time}>01:12:18</span>
                      </div>
                    </div>;
                  })
                }
              </div>
            </Scrollbars>
          </div>
        </div>
        }
        {/* 限时折扣-e */}

        {/* 团购-s */}
        {data.show_style == 'group_buy' &&
        <div className={`${styles.group_wrap} ${global.flex_column_start_start}`}>
          <div className={`${styles.top} ${global.flex_row_between_center}`}>
            <div className={`${styles.left} ${global.flex_row_start_center}`}>
              <img className={styles.group_top_left_title_img}
                   src={require('@/assets/m_diy_img/activity/group_top_left_title.png')}/>
            </div>
            <div className={`${styles.right} ${global.flex_row_end_center}`}>
              <span className={styles.view_more}>MORE</span>
              <img className={styles.group_top_arrow_right_img}
                   src={require('@/assets/m_diy_img/activity/pin_top_arrow_right.png')}/>
            </div>
          </div>
          {data.sub_title &&
          <span className={styles.title}>{data.title}</span>
          }
          {data.sub_title &&
          <span className={`${styles.sub_title}`}>{data.sub_title}</span>
          }
          <div className={`${styles.group_goods_info} ${global.flex_row_start_start}`}>
            {data.data.info.length == 0
              ? sld_com_empty_arrar_2.map((item, index) => {
                return <div key={index}
                            className={`${global.flex_com_column_start_start} ${styles.goods_item}`}>
                  <div className={`${global.flex_row_common} ${styles.img}`}
                       style={{ borderRadius: data.border_radius }}>
                    <img src={require('@/assets/m_diy_img/empty_goods_img.png')}/>
                    <span className={styles.group_tag} style={{
                      borderTopLeftRadius: data.border_radius,
                      background: data.tag_bg_color ? data.tag_bg_color : 'linear-gradient(90deg, #FCE000 0%, #FFAA06 0%, #FF8323 0%, #FF2A64 100%)',
                    }}>优享团购</span>
                    <div className={`${styles.time_wrap} ${global.flex_row_between_center}`}>
                      <span className={styles.left}>已团3件</span>
                      <span className={styles.right}>距结束:12:22:33</span>
                    </div>
                  </div>
                  <span className={styles.name}>这里是商品名称</span>
                  <div className={`${styles.bottom_part} ${global.flex_row_between_center}`}>
                    <div className={`${styles.price} ${global.flex_row_start_end}`}>
                      <span className={styles.unit}>¥</span>
                      <span className={styles.price_int}>{getPartNumber(12.34, 'int')}</span>
                      <span className={styles.price_decimal}>{getPartNumber(12.34, 'decimal')}</span>
                    </div>
                    <span className={styles.go_group}>立即团></span>
                  </div>
                </div>;
              })
              : data.data.info.map((item, index) => {
                return <div key={index}
                            className={`${global.flex_com_column_start_start} ${styles.goods_item}`}>
                  <div className={`${global.flex_row_common} ${styles.img}`}
                       style={{ borderRadius: data.border_radius }}>
                    <img src={item.mainImage}/>
                    <span className={styles.group_tag} style={{
                      borderTopLeftRadius: data.border_radius,
                      background: data.tag_bg_color ? data.tag_bg_color : 'linear-gradient(90deg, #FCE000 0%, #FFAA06 0%, #FF8323 0%, #FF2A64 100%)',
                    }}>优享团购</span>
                    <div className={`${styles.time_wrap} ${global.flex_row_between_center}`}>
                      <span className={styles.left}>已团{item.buyer_count}件</span>
                      <span className={styles.right}>距结束:05:12:43</span>
                    </div>
                  </div>
                  <span className={styles.name}>{item.goodsName}</span>
                  <div className={`${styles.bottom_part} ${global.flex_row_between_center}`}>
                    <div className={`${styles.price} ${global.flex_row_start_end}`}>
                      <span className={styles.unit}>¥</span>
                      <span className={styles.price_int}>{getPartNumber(item.activity_price, 'int')}</span>
                      <span className={styles.price_decimal}>{getPartNumber(item.activity_price, 'decimal')}</span>
                    </div>
                    <span className={styles.go_group}>立即团></span>
                  </div>
                </div>;
              })
            }
          </div>
        </div>
        }
        {/* 团购-e */}
      </div>;
    }
    return con;
  };

  //推荐商品获取商品样式 data:id 数组 index 循环的序号
  getMarginRB = (id_array, index) => {
    const { data } = this.props;
    let marginR = 0,
      marginB = 0;
    if (data.show_style == 'small') {
      marginB = marginR = data.goods_margin;
      if (index % 2 == 1) {
        marginR = 0;//每行的最后一个元素右边距为0
      }
      if (data.data.info.length % 2 == 0) {
        //最后一行是偶数
        if (index >= id_array.length - 2) {
          marginB = 0;
        }
      } else {
        //最后一行是奇数
        if (index == id_array.length - 1) {
          marginB = 0;
        }
      }
    } else {
      marginR = 0;
      marginB = data.goods_margin;
      if (index == id_array.length - 1) {
        //最后一个距离底部为0
        marginB = 0;
      }
    }
    return { marginB: marginB, marginR: marginR };
  };


  /*
  * 推荐商品渲染样式
  * id_array id 数组
  * item 当前数据
  * index 循环的序号
  * type(类型 empty 无商品， goods 有商品)
  * border_style 商品样式
  * show_style 展示类型
  * list_layout 列表模式下的布局
  * */
  render_tjsp = (data, id_array, item, index, type, border_style, show_style, list_layout) => {
    let marginRB = this.getMarginRB(id_array, index);
    let marginR = marginRB.marginR;
    let marginB = marginRB.marginB;
    return <div key={index} className={styles.goods_info} style={{
      width: data.show_style == 'list' ? show_style * 2 : show_style,
      borderRadius: data.border_radius, ...border_style,
      marginRight: marginR,
      marginBottom: marginB, ...list_layout,
      backgroundColor: '#fff',
    }}>
      <div className={`${styles.img_wrap} ${global.flex_com_row_center}`} style={{
        width: show_style,
        height: show_style,
        borderTopLeftRadius: data.border_radius,
        borderTopRightRadius: data.show_style == 'list' ? 0 : data.border_radius,
        borderBottomLeftRadius: data.show_style == 'list' ? data.border_radius : 0,
      }}>
        {item.integralGoodsId != undefined
          ? <img src={item.mainImage}/>
          : <ALibbSvg fill={'#fff'} width={40.8} height={33.6} type={'tupian1'}/>
        }
      </div>
      <div className={`${global.flex_com_column_center_center} ${styles.detail}`}
           style={{
             alignItems: data.text_align,
             padding: data.show_style == 'list' ? 10 : '8px 10px 8px 10px',
             justifyContent: data.show_style == 'list' ? 'space-between' : 'center',
             height: data.show_style == 'list' ? '100%' : 'auto',
           }}>
        <span style={{ fontWeight: data.text_style }}
              className={styles.name}>{item.integralGoodsId != undefined ? item.goodsName : '商品名称商品名称商品名称商品名称商品名称商品名称商品名称'}</span>

        <div className={`${global.flex_column_start_start}`} style={{ width: '100%' }}>
          <div className={`${styles.bottom_part} ${global.flex_row_between_center}`}>
            <div className={`${styles.price} ${global.flex_row_start_end}`}>
              <span className={styles.unit}>{type == 'empty'?0:item.integralPrice}积分+¥{type == 'empty'?'0.00':item.cashPrice}</span>
            </div>
          </div>
          {data.isshow_sales == 1 &&
          <div className={`${styles.bottom_part} ${global.flex_row_between_center}`} style={{ marginTop: 3 }}>
            <span className={styles.sales_num}>已售{type == 'empty' ? 0 : item.goods_salenum}件</span>
          </div>
          }
        </div>
      </div>
    </div>;
  };

  renderCon() {
    const { data, select_data } = this.props;
    return (
      <div style={{ position: 'relative' }} className={`${styles.center_item}`}>
        <div
          className={`${select_data != '' && select_data.id == data.id ? styles.selected : null}`}
          onClick={() => this.handleItem(data.id, 'edit')}>
          {this.renderItem()}
        </div>
        <div className={styles.operate_wrap}>
          {getOSvgMDiy(() => this.handleItem(data.id, 'up'), 'move-up', '#fff', 15, 15)}
          {getOSvgMDiy(() => this.handleItem(data.id, 'down'), 'xia1', '#fff', 15, 15)}
          {data.is_show
            ? getOSvgMDiy(() => this.handleItem(data.id, 'is_show'), 'kejian', '#fff', 16, 16)
            : getOSvgMDiy(() => this.handleItem(data.id, 'is_show'), 'bukejian11', '#fff', 16, 16)
          }
          {getOSvgMDiy(() => this.handleItem(data.id, 'del'), 'guanbi3', '#fff', 16, 16)}
        </div>
      </div>
    );
  }

  render() {
    return this.renderCon();
  }
}

