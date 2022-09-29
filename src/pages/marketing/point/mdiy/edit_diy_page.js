/*
* 装修页面
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form } from 'antd';
import {
  failTip,
  sucTip,
  getSldEmptyH,
  sldLlineRtextAddGoods,
  sldIconBtnBg,
  getSldHorLine,
  sldComLanguage
} from '@/utils/utils';
import {
  sld_com_empty_arrar_4,
  sld_com_empty_arrar_2,
  m_diy_swiper_data,
} from '@/utils/util_data';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import mdiy from './mdecorate.less';
import global from '@/global.less';
import { Scrollbars } from 'react-custom-scrollbars';
import MDiyItem from '@/components/point/MDiyItem';
import MDiyItemEdit from '@/components/point/MDiyItemEdit';
import ALibbSvg from '@/components/ALibbSvg';
import styles from '@/components/point/MDiyItem/index.less';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

let sthis = '';
let getFieldDecorator_new = '';


// fake data generator
const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k + offset}`,
    content: `item ${k + offset}`,
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

@connect(({ commonMDiy, pc_home, project,global,point }) => ({
  commonMDiy,
  pc_home,
  project,
  global,
  point,
}))
@Form.create()

export default class Edit_diy_page extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.index = 0;//添加的模块数量
    this.state = {
      menu_data: [],//左侧菜单数据
      query: props.location.query,
      items: getItems(10),
      selected: [],
      select_data: '',//选中的当前数据
      refresh_center_flag: 0,//中间组件是否刷新标示
      refresh_right_flag: 0,//右面组件是否刷新标示
      cat_nav: [],
      sele_cat_nav_index: 0,//选中的分类导航index，默认第一个
      cur_top_swiper_bg_color: m_diy_swiper_data[0].bg_color,//顶部分类主要颜色
      show_top_cat_nav: true,//是否显示顶部分类导航，默认显示
      is_selected_top_cat_nav: false,//是否选中顶部分类导航，默认不选中
      center_fixed_data: {
        type: 'top_cat_nav',
        swiper_bg_style: 1,//轮播背景显示风格，1为纯色弧度 2为渐变
        data: [],//轮播图
      },//中间部分需要显示的不可拖动的数据
      special_select_data: {},//选中的不可拖动的数据
    };
    const {
      form: { getFieldDecorator },
    } = props;
    getFieldDecorator_new = getFieldDecorator;

  }

  id2List = {
    droppable: 'items',
    droppable2: 'selected',
  };

  getList = id => this.state[this.id2List[id]];

  onDragEnd = result => {
    const { source, destination } = result;
    let { selected, menu_data } = this.state;
    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index,
      );

      let state = { items };

      if (source.droppableId === 'droppable2') {
        state = { selected: items };
      }

      this.setState(state);
    } else {

      let con = {};
      this.index++;
      con.id = this.index;
      con.type = result.draggableId;
      con.is_show = true;
      let tmp_sele_menu_data = menu_data.filter(item => item.type == result.draggableId)[0];
      con.admin_text = tmp_sele_menu_data.name;
      con.admin_icon = tmp_sele_menu_data.icon;
      if (result.draggableId == 'lunbo') {
        //拖动的类型为轮播
        con.data = [];//模块数据
        con.width = 750;
        con.height = 285.5;//整个轮播的高度
      } else if (result.draggableId == 'nav') {
        //拖动的类型为导航
        con.data = [];//导航数据
        con.icon_set = 'up';//图标方向 up 图标向上 left 图标向左  no-icon 不显示图标
        con.slide = 35; //图标的大小
        con.style_set = 'nav';//样式设置 nav 导航  tag-nav分组
        sld_com_empty_arrar_4.map(item => {
          con.data.push({
            img: '',
            img_path: '',
            name: '',
            url: '',
            url_type: '',
            info: '',
          });
        });
      } else if (result.draggableId == 'tupianzuhe') {
        //拖动的类型为图片组合
        con.data = [];
        for (let i in sld_com_empty_arrar_2) {
          con.data.push({
            img: '',
            img_path: '',
            title: '',
            url: '',
            url_type: '',
            info: '',
            width: '100%',
            height: 150,
          });
        }//数据
        con.sele_style = 0;//选择类型：0为第一种图片展示方式，1为第二种，2为第三种，3为第四种，4为第五种，5为第六种，6为第七种，7为第八种，
      } else if (result.draggableId == 'fzx') {
        //拖动的类型为辅助线
        con.val = 'solid';//辅助线类型
        con.lrmargin = 10; //左右边距
        con.tbmargin = 10; //上下边距
        con.color = '#e3e5e9';//颜色
      } else if (result.draggableId == 'fzkb') {
        //拖动的类型为辅助空白
        con.text = 30;//辅助空白的高度
        con.color = '#fff';//颜色
      } else if (result.draggableId == 'fuwenben') {
        //拖动的类型为富文本
        con.text = '';//富文本的内容
      } else if (result.draggableId == 'kefu') {
        //拖动的类型为客服
        con.tel = 15288888888;//联系方式
        con.text = `${sldComLanguage('客服电话：')}`;//文本内容
      } else if (result.draggableId == 'gonggao') {
        //拖动的类型为公告
        con.show_style = 'one';//公告展示风格
        con.text = '';//公告内容
        con.url = '';//公告连接
        con.url_type = '';//公告连接类型
        con.info = '';//用于存放额外信息
      } else if (result.draggableId == 'dapei') {
        //拖动的类型为搭配
        con.dapei_desc = '';//搭配图片描述
        con.dapei_img = '';//搭配图片
        con.width = '';//搭配图片宽度
        con.height = '';//搭配图片高度
        con.dapei_title = '';//搭配标题
        con.img_path = '';//图片相对路径
        con.data = {
          ids: [],
          info: [],
        };//商品数据
      } else if (result.draggableId == 'tuijianshangpin') {
        //拖动的类型为推荐商品
        con.isshow_sales = 0;//是否展示销量
        con.cart_icon_type = 5;//购物车图标样式
        con.show_style = 'small';//展示类型：big 大图 small 一行两个 list 列表 一行一个
        con.border_radius = 10;//商品圆角 0表示直角
        con.border_style = 'card-shadow';//商品样式  border_none无边白底  card-shadow卡片投影  border_eee描边白底 border_none_grey_bg 无边灰底
        con.page_margin = 10;//距离页面两边的距离
        con.goods_margin = 10;//商品之间的距离
        con.text_align = 'flex-start';//文本对齐方式，flex-start 左对齐 center 居中对齐
        con.text_style = 'normal';//文本样式，normal常规体 bold 加粗体
        con.data = {
          ids: [],
          info: [],
        };//商品数据
      } else if (result.draggableId == 'svideo') {
        //拖动的类型为短视频
        con.title = `${sldComLanguage('商联达短视频')}`;//标题名称
        con.view_more_url = '';//查看更多的链接
        con.show_style = 'one';//展示风格：one 只显示2个商品，不可滚动，two 只显示3个商品，不可滚动 three 只显示2个商品，不可滚动，长形显示   four 异形轮播 five 多余3个的轮播
        con.border_radius = 8;//短视频卡片边角，直角0、圆角5px
        con.data = {
          ids: [],//短视频id集合
          info: [],//短视频信息
        };//短视频数据
      } else if (result.draggableId == 'live') {
        //拖动的类型为直播
        con.title = `${sldComLanguage('商联达直播')}`;//标题名称
        con.view_more_url = '';//查看更多的链接
        con.show_style = 'one';//展示风格：one 只显示2个商品，不可滚动，two 显示多个商品，最多9个，可滚动
        con.border_radius = 8;//短视频卡片边角，直角0、圆角5px
        con.data = {
          ids: [],//直播id集合
          info: [],//直播信息
        };//直播数据
      } else if (result.draggableId == 'more_tab') {
        //拖动的类型为TAB切换
        con.border_radius = 8;//数据是否圆角，默认圆角
        con.nav_current = 0;//当前选中的导航
        con.data = [];//TAB切换数据
      } else if (result.draggableId == 'activity') {
        //拖动的类型为活动组
        con.show_style = 'pin';//活动类型 pin：拼团 discount：限时折扣 group_buy：团购
        con.border_radius = 8;//数据是否圆角，默认圆角
        con.tag_bg_color = '';//标签背景色
        con.title = '';//标题
        con.sub_title = '';//子标题
        con.data = {
          ids: [],//商品id集合
          info: [],//商品信息
        };//商品数据
      }
      //放置到拖动的位置
      selected.splice(destination.index, 0, con);
      this.setState({
        items: result.droppable,
        selected,
      });
    }
  };

  componentDidMount() {
    this.get_diy_page_detial(this.state.query.id);
    this.get_diy_menu();
    this.get_point_label();
    this.props.dispatch({
      type: 'global/getLayoutCollapsed',
    });
  }

  componentWillUnmount() {

  }

  //获取装修菜单
  get_diy_menu = () => {
    const { dispatch } = this.props;
    const { query } = this.state;
    dispatch({
      type: 'commonMDiy/get_m_diy_menu',
      payload: { isEnable: 1, apply: query.type },//获取首页可用的菜单
      callback: (res) => {
        if (res.state == 200) {
          let tmp_data = res.data.filter(item => item.type != 'top_cat');
          tmp_data.map(item => {
            item.id = item.type;
          });
          this.setState({ menu_data: tmp_data });
        } else {
          failTip(res.msg);
        }
      },
    });
  };

  //获取一级积分标签，用于顶部分类导航展示数据
  get_point_label = () => {
    const { dispatch } = this.props;
    let { cat_nav } = this.state;
    dispatch({
      type: 'point/get_label_tree_list',
      payload: { parentLabelId: 0 ,grade: 1 },
      callback: (res) => {
        if (res.state == 200) {
          cat_nav = res.data;
          cat_nav = [{ labelName: `${sldComLanguage('首页')}`, labelId: -1 }, ...cat_nav];
          this.setState({ cat_nav });
        } else {
          failTip(res.msg);
        }
      },
    });
  };

  //获取装修的详情
  get_diy_page_detial = (id) => {
    const { dispatch } = this.props;
    let { selected, query, center_fixed_data,show_top_cat_nav } = this.state;
    dispatch({
      type: 'commonMDiy/get_diy_page_detail',
      payload: { decoId: id },
      callback: (res) => {
        if (res.state == 200) {
          //空处理
          if (res.data.data) {
            let tmp_data = JSON.parse(res.data.data.replace(/&quot;/g,"\""));
            let top_cat_nav_data = tmp_data.filter(item => item.type == 'top_cat_nav');
            if (top_cat_nav_data!=undefined&&top_cat_nav_data.length > 0) {
              //初始化顶部分类导航数据
              center_fixed_data = top_cat_nav_data[0];
              //过滤掉顶部分类导航
              tmp_data = tmp_data.filter(item => item.type != 'top_cat_nav');
            }else{
              show_top_cat_nav = false;//不显示顶部分类
            }
            for (let i in tmp_data) {
              this.index++;
              tmp_data[i].id = this.index;
            }
            selected = tmp_data;
          } else {
            selected = [];
          }
          query.name = res.data.name;
          this.setState({ selected: selected, center_fixed_data,show_top_cat_nav });
        } else {
          failTip(res.msg);
        }
      },
    });
  };

  //装修模块的操作
  handleMdiyCenItemOperate = (index, type) => {
    let { selected, select_data } = this.state;
    if (type == 'del') {
      selected = selected.filter(item => item.id != index);//删除操作
    } else {
      for (let i = 0; i < selected.length; i++) {
        if (selected[i].id == index) {
          let tmp = {};
          if (type == 'down') {
            //向下移动,最后一个不处理
            if (i < selected.length - 1) {
              tmp = { ...selected[i] };
              selected[i] = { ...selected[i + 1] };
              selected[i + 1] = { ...tmp };
            }
          } else if (type == 'up') {
            //向上移动，第一个不处理
            if (i != 0) {
              tmp = { ...selected[i] };
              selected[i] = { ...selected[i - 1] };
              selected[i - 1] = { ...tmp };
            }
          } else if (type == 'is_show') {
            selected[i].is_show = !selected[i].is_show;//是否显示
          } else if (type == 'edit') {
            select_data = selected[i];//编辑
          }
          break;
        }
      }
    }
    this.setState({
      selected,
      select_data,
      is_selected_top_cat_nav: false,//选中可拖动的模块，需要把顶部分类的选中效果去掉
      special_select_data: {},//非拖拽数据要编辑的数据清空
    });

  };

  //顶部分类导航数据的更新
  handleCurFixedData = (data) => {
    let { center_fixed_data, refresh_center_flag, special_select_data } = this.state;
    center_fixed_data = { ...special_select_data, ...data };
    center_fixed_data = JSON.parse(JSON.stringify(center_fixed_data));
    special_select_data = JSON.parse(JSON.stringify(center_fixed_data));
    this.setState({
      refresh_center_flag: ++refresh_center_flag,
      center_fixed_data,
      special_select_data,
    });
  };

  //处理当前选中的数据
  handleCurSelData = (data) => {
    let { select_data, refresh_center_flag, selected } = this.state;
    select_data = { ...select_data, ...data };

    for (let i in selected) {
      if (selected[i].id == select_data.id) {
        selected[i] = select_data;
        break;
      }
    }
    this.setState({
      select_data,
      selected,
      refresh_center_flag: ++refresh_center_flag,
    });
  };

  saveMDiyData = () => {
    const { selected, query, center_fixed_data, show_top_cat_nav } = this.state;
    const { dispatch } = this.props;
    let params = {};
    params.decoId = query.id;
    let tar_data = [...selected];
    //顶部分类导航启用的话需要合并一下数据
    if (show_top_cat_nav) {
      tar_data.unshift({ ...center_fixed_data });
    }
    params.data = JSON.stringify(tar_data);
    dispatch({
      type: 'commonMDiy/edit_m_diy_page',
      payload: params,
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
          //2s之后返回上一页
          setTimeout(() => {
            sthis.props.history.goBack();
          }, 2000);
        } else {
          failTip(res.msg);
        }
      },
    });
  };

  //顶部分类导航切换事件
  onChangeCatNav = (index) => {
    this.setState({
      sele_cat_nav_index: index,
    });
  };

  //是否显示顶部分类导航
  setTopCatNav = () => {
    let { show_top_cat_nav } = this.state;
    this.setState({
      show_top_cat_nav: !show_top_cat_nav,
    });
  };

  //选中顶部分类导航
  selectTopCatNav = () => {
    let { special_select_data,center_fixed_data } = this.state;
    special_select_data = JSON.parse(JSON.stringify(center_fixed_data));
    this.setState({ is_selected_top_cat_nav: true, special_select_data,select_data:'' });
  };

  //更新顶部分类导航背景色
  updateCurTopSwiperBgColor = (index) => {
    let { cur_top_swiper_bg_color, center_fixed_data } = this.state;

    if (center_fixed_data.data.length == 0) {
      cur_top_swiper_bg_color = m_diy_swiper_data[index].bg_color;
    } else {
      cur_top_swiper_bg_color = center_fixed_data.data[index].bg_color;
    }

    this.setState({
      cur_top_swiper_bg_color,
    });
  };

  render() {
    const { select_data, refresh_center_flag, selected, menu_data, query, cat_nav, sele_cat_nav_index, cur_top_swiper_bg_color, show_top_cat_nav, is_selected_top_cat_nav, special_select_data, center_fixed_data } = this.state;
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div className={global.flex_com_space_between} style={{ margin: 10 }}>
          {sldLlineRtextAddGoods('#FA6F1E', query.name)}
          {sldIconBtnBg(() => this.props.history.goBack(), 'ziyuan24', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0,14,14,3)}
        </div>
        {getSldHorLine(1)}
        <div className={global.flex_row_between_center} style={{ height: '100%' }}>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable isDropDisabled={true} droppableId="droppable">
              {(provided, snapshot) => (
                <Scrollbars
                  style={{ width: 220 }}>
                  <div
                    className={`${mdiy.left_wrap} ${global.flex_com_row_start_start}`}
                    style={{ flexWrap: 'wrap' }}
                    ref={provided.innerRef}>

                    {/* 顶部分类导航-s */}
                    {/*<div*/}
                    {/*  className={`${mdiy.item} ${global.flex_com_column_center_center}`} style={{cursor:'pointer'}}*/}
                    {/*>*/}
                    {/*  <div className={`${mdiy.image_wrap} ${global.flex_row_center_center}`}>*/}
                    {/*    <ALibbSvg fill={'#FC701E'} width={40} height={40} type={'ziyuan16'}/>*/}
                    {/*  </div>*/}
                    {/*  <span style={{color:'#333'}}>顶部分类</span>*/}
                    {/*</div>*/}
                    {/* 顶部分类导航-e */}

                    {menu_data.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}>
                        {(provided, snapshot) => {
                          return <div
                            className={`${mdiy.item}  ${global.flex_com_column_center_center}`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className={`${mdiy.image_wrap} ${global.flex_row_center_center}`}>
                              <ALibbSvg fill={'#FC701E'} width={40} height={40} type={item.icon}/>
                            </div>
                            <span style={{color:'#333'}}>{item.name}</span>
                          </div>;
                        }}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </Scrollbars>
              )}
            </Droppable>
            <div style={{ flex: 1, height: '100%' }}>
              <div className={`${mdiy.center_wrap} ${global.flex_row_center_center}`} style={{height:"100%"}}>
                <Scrollbars
                  className={`${mdiy.center_scroller} ${global.flex_row_center_center}`}>
                  <div className={`${global.flex_row_center_center}`}>
                    <Droppable droppableId="droppable2" overflow={'auto'}>
                      {(provided, snapshot) => (
                        <div className={`${mdiy.center_con_border}`}>
                          <div
                            className={mdiy.center_con}
                            ref={provided.innerRef}
                          >
                            <img className={`${mdiy.status_bar}`}
                                 src={require('@/assets/m_diy_img/m_top_status_bar.png')}/>

                            {/* 固定的顶部组件 - s */}
                            {show_top_cat_nav &&
                            <div className={`${mdiy.fixed_top} ${global.flex_column_start_start}`}
                                 onClick={() => this.selectTopCatNav()}
                                 style={{ borderColor: is_selected_top_cat_nav ? '#FC701E' : '#fff' }}
                            >
                              <div className={`${mdiy.cat_nav} ${global.flex_row_start_center}`}
                                   style={{ backgroundColor: cur_top_swiper_bg_color }}>
                                <Scrollbars
                                  autoHide
                                  autowidth="true"
                                  autowidthmin={293}
                                  style={{ height: 48 }}>
                                  <div className={`${mdiy.cat_nav_left} ${global.flex_row_start_center}`}>
                                    {cat_nav.map((item, index) => {
                                      return <span key={index}
                                                   className={`${mdiy.cat_nam} ${sele_cat_nav_index == index ? mdiy.current_cat_nav : null}`}
                                                   onClick={() => this.onChangeCatNav(index)}>
                                    {item.labelName}
                                  </span>;
                                    })}
                                    <span className={mdiy.right_empty}></span>
                                  </div>
                                </Scrollbars>
                                <div className={`${mdiy.right_fixed} ${global.flex_row_center_center}`}
                                     style={{ backgroundColor: cur_top_swiper_bg_color }}>
                                  <img className={`${mdiy.fixed_icon}`}
                                       src={require('@/assets/m_diy_img/cat_nav_right_fixed.png')}/>
                                  <span className={`${mdiy.fixed_con}`}>{sldComLanguage('分类')}</span>
                                </div>
                              </div>

                              <Slider {...{
                                dots: true,
                                infinite: true,
                                autoplay: true,
                                speed: 200,
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                className: 'simple',
                                afterChange: (e) => {
                                  this.updateCurTopSwiperBgColor(e);
                                },
                              }}>
                                {center_fixed_data.data.length > 0
                                  ? center_fixed_data.data.map((item, index) => {
                                    return <div className={`${mdiy.lunbo_wrap} ${global.flex_row_common}`}
                                                key={index}>
                                      <div className={`${mdiy.swiper_img_wrap} ${global.flex_row_center_center}`}
                                           style={{ width: 372 }}>
                                        {item.img
                                          ? <img style={{ height: 140 }} src={item.img}/>
                                          : <div
                                            className={`${mdiy.empty_swiper_img} ${global.flex_column_center_center}`}>
                                            <ALibbSvg fill={'#fff'} width={40.8} height={33.6} type={'tupian1'}/>
                                            <span
                                              className={`${styles.center_tip} ${global.flex_row_common}`}>宽710*高280</span>
                                          </div>
                                        }

                                        <span className={`${mdiy.swiper_bg}`}
                                              style={{
                                                background: center_fixed_data.swiper_bg_style == 1 ? cur_top_swiper_bg_color : 'linear-gradient(180deg, ' + cur_top_swiper_bg_color + ' 0%, ' + cur_top_swiper_bg_color + ' 42%, #FFFFFF 100%)',
                                                borderRadius: center_fixed_data.swiper_bg_style == 1 ? 15 : 0,
                                              }}></span>
                                      </div>
                                    </div>;
                                  })
                                  : m_diy_swiper_data.map((item, index) => {
                                    return <div className={`${mdiy.lunbo_wrap} ${global.flex_row_common}`}
                                                key={index}>
                                      <div className={`${mdiy.swiper_img_wrap} ${global.flex_row_center_center}`}
                                           style={{ width: 372 }}>
                                        <img style={{ height: 140 }} src={item.img}/>
                                        <span className={`${mdiy.swiper_bg}`}
                                              style={{
                                                background: center_fixed_data.swiper_bg_style == 1 ? cur_top_swiper_bg_color : 'linear-gradient(180deg, ' + cur_top_swiper_bg_color + ' 0%, ' + cur_top_swiper_bg_color + ' 42%, #FFFFFF 100%)',
                                                borderRadius: center_fixed_data.swiper_bg_style == 1 ? 15 : 0,
                                              }}></span>
                                      </div>
                                    </div>;
                                  })
                                }

                              </Slider>

                            </div>
                            }
                            {/* 固定的顶部组件 - e */}

                            {selected.map((item, index) => (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <MDiyItem
                                      data={item}
                                      handleCurSelData={this.handleCurSelData}
                                      handleMdiyCenItemOperate={this.handleMdiyCenItemOperate}
                                      select_data={select_data}
                                      refresh_center_flag={refresh_center_flag}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        </div>
                      )}
                    </Droppable>
                  </div>
                </Scrollbars>
              </div>
            </div>
          </DragDropContext>
          <div className={mdiy.right_wrap}
               style={{ background: (select_data != '' || special_select_data.type != undefined) ? '#fff' : '#f8f8f8' }}>
            {select_data != '' &&
            <Fragment>
              <div className={`${global.flex_com_row_start_center} ${mdiy.r_title}`}>
                <ALibbSvg fill={'#FC701E'} width={22} height={22} type={select_data.admin_icon}/>
                <span className={mdiy.r_title_text}>{select_data.admin_text}{sldComLanguage('设置')}</span>
              </div>
              <Scrollbars
                autoHide>
                <MDiyItemEdit
                  handleCurSelData={this.handleCurSelData}
                  select_data={select_data}
                />
                {getSldEmptyH(160)}
              </Scrollbars>
            </Fragment>
            }
            {special_select_data.type != undefined &&
            <Fragment>
              <div className={`${global.flex_com_row_start_center} ${mdiy.r_title}`}>
                <ALibbSvg fill={'#FC701E'} width={22} height={22} type={'ziyuan16'}/>
                <span className={mdiy.r_title_text}>{sldComLanguage('顶部分类设置')}</span>
              </div>
              <Scrollbars
                autoHide>
                <MDiyItemEdit
                  handleCurSelData={this.handleCurFixedData}
                  select_data={special_select_data}
                />
                {getSldEmptyH(160)}
              </Scrollbars>
            </Fragment>
            }
          </div>
          <div className={mdiy.m_diy_bottom_wrap} style={{ position: 'fixed',left:this.props.global.collapsed?90:160 }}>
            <div onClick={() => this.saveMDiyData()} className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel}`}>
              {sldComLanguage('保存装修')}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
