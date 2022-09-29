/*
* 装修页面
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form } from 'antd';
import {
  failTip,
  sucTip,
  sldSvgIcon,
  sldComLanguage,
  getSldEmptyH,
  formItemLayoutModal,
  quillEscapeToHtml,
} from '@/utils/utils';
import global from '@/global.less';
import diy from '../diy_page.less';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import EditDdiyPageHead from './edit_diy_page_head';
import styles from '../pcdecorate.less';
import Adv_01 from './adv_01';
import Adv_02 from './adv_02';
import Adv_04 from './adv_04';
import Adv_05 from './adv_05';
import Adv_06 from './adv_06';
import Adv_07 from './adv_07';
import Adv_08 from './adv_08';
import Adv_09 from './adv_09';
import Adv_10 from './adv_10';
import Adv_11 from './adv_11';
import Adv_12 from './adv_12';
import Adv_13 from './adv_13';
import Adv_19 from './adv_19';
import Adv_20 from './adv_20';
import Adv_21 from './adv_21';
import MainBanner from './main_banner';
import SelInstanceTemplateLists from './sel_instance_template_lists';
import SldModal from '@/components/SldModal/SldModal';

let sthis = '';
let getFieldDecorator_new = '';

//  将拖拽后位置的数据删除然后添加到拖拽前的位置上
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
  alignItems: 'center',
  background: isDragging ? '#fff' : '#fff',
  opacity: isDragging ? 0.5 : 1,
  ...draggableStyle,
});

const getItemStyleTop = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  margin: `0 20px 0 0`,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'start',
  alignItems: 'center',
  // change background colour if dragging
  background: isDragging ? '#fff' : '#fff',
  opacity: isDragging ? 0.5 : 1,
  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? '#cfe2f9' : '#f0f2f5',
  width: '100%',
  minHeight: 500,
});

const getListStyleTop = isDraggingOver => ({
  background: isDraggingOver ? '#fff' : '#fff',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'start',
  alignItems: 'center',
});
@connect(({ pc_home }) => ({
  pc_home,
}))
@Form.create()

export default class Edit_diy_page extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    const {
      form: { getFieldDecorator },
    } = props;
    getFieldDecorator_new = getFieldDecorator;
    this.state = {
      operateModalType:'',//modal类型  floor_style为设置楼层样式  save_as：另存为
      selTplModalVisible: false,//选择实例化模板弹框是否显示，默认不显示
      selTplWidth: 1230,//选择实例化模板弹框宽度
      selTplTitle: '',//选择实例化模板弹框标题
      cur_top_code: '',//选前选中的顶部code
      cur_tpl_type: '',//当前操作模式,main_banner:页面主轮播图，floor：楼层，main_nav:主导航
      is_edit_flag: false,//当前页面是否执行过操作
      swiper_data: [],//选择的页面主轮播的数据
      curData: {},//当前页面数据
      query: props.location.query,
      diy_page_data: {},
      data: [],//装修数据
      main_swiper_data: { data: { data: [] } },//主轮播图数据
      cur_tpl_id:0,//装载模板id
      saveInsTplTitle:'',//保存模板Modal名称
      saveInsTplSubmiting:false,//保存模板Modal确定按钮loading
      saveInsTplModalVisible:false,//保存模板Modal是否显示标识 默认不显示
      saveInsTplData:[{
        type: 'input',
        label: `${sldComLanguage('实例化模板名称')}`,
        name: 'name',
        placeholder: `${sldComLanguage('请输入实例化模板名称')}`,
        initialValue: '',
        maxLength: 20,
        rules: [{
          required: true,
          whitespace: true,
          message: `${sldComLanguage('请输入实例化模板名称')}`,
        }],
      }],
      operateData:[],//保存模板Modal数据
      addData: [{
        type: 'inputnum',
        label: `${sldComLanguage('上边距')}`,
        name: 'padding_top',
        placeholder: `${sldComLanguage('请输入上边距')}`,
        extra: `${sldComLanguage('单位：px，设置楼层顶部内边距值，范围为0～200')}`,
        initialValue: '',
        min:0,
        max:200,
        rules: [{
          required: true,
          message: `${sldComLanguage('请输入上边距')}`,
        }],
      },{
        type: 'inputnum',
        label: `${sldComLanguage('下边距')}`,
        name: 'padding_bottom',
        placeholder: `${sldComLanguage('请输入下边距')}`,
        extra: `${sldComLanguage('单位：px，设置楼层底部内边距值，范围为0～200')}`,
        initialValue: '',
        min:0,
        max:200,
        rules: [{
          required: true,
          message: `${sldComLanguage('请输入下边距')}`,
        }],
      }, {
        type: 'more_color_picker',
        label: `${sldComLanguage('背景色')}`,
        name: 'bg_color',
        placeholder: `${sldComLanguage('请点击选择颜色')}`,
        initialValue: '',
        is_show: false,
        callbackShow: (color) => this.sldHandleColorPicker(color, 'bg_color', 'is_show'),
        callback: (color) => this.sldHandleColorPicker(color, 'bg_color', 'color'),
      }, {
        type: 'empty',
        name: 'empty',
        height: 0,
      }],//modal框的数据
      curSetFloorStyleItem:{},//当前设置楼层样式item数据
    };
  }

  sele_banner_instance_id = '';//选择的实例化模板id
  position = '';//添加模板的位置，top 当前模板的顶部，bottom 当前模板的底部
  id = '';//当前模板的id
  tpl_list = [];//所有模板类型
  main_banner_tpl_pc_id = '';//主轮播图的tplPcId
  cur_floor_data = '';//当前操作的楼层数据

  componentDidMount() {
    const { query } = this.state;
    if (query.id != undefined && query.id > 0) {
      this.get_diy_page_detial(query.id);
    }
    this.get_tpl_list();
  }

  componentWillUnmount() {

  }

  //获取所有模板类型
  get_tpl_list = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pc_home/get_tpl_list',
      callback: (res) => {
        if (res.state == 200) {
          this.tpl_list = res.data.list;
          let goods_floor_data = this.topData.filter(item => item.top_code == 'goods_floor')[0];
          let adv_floor_data = this.topData.filter(item => item.top_code == 'adv_floor')[0];
          this.main_banner_tpl_pc_id = this.tpl_list.filter(item => item.type == 'main_banner')[0].tplPcId;
          this.tpl_list.map(item => {
            if (item.type == 'goods_floor') {
              goods_floor_data.children.push(item);
            } else if (item.type == 'adv_floor') {
              adv_floor_data.children.push(item);
            }
          });
        }
      },
    });
  };

  //装修模板切换
  handleTabChange = (val) => {
    let { addData } = this.state;
    addData.map((item) => {
      if (item.type == 'sele_instance_tpl') {
        item.activeKey = val;
      }
    });
    this.setState({ addData });
    this.get_tpl_instance_list(val);
  };

  onDragEnd = (result) => {
    let { cur_top_code, data } = this.state;
    // 拖出范围外
    if (!result.destination) {
      return;
    }
    if (result.source.droppableId == 'droppableTop') {
      let temp_data = this.topData.filter(item => item.top_code == cur_top_code)[0].children[result.source.index];
      let temp = {
        id: 1,
        html: temp_data.data,
        key: '',
        data: JSON.parse(temp_data.defaultData.replace(/&quot;/g,"\"")),
        tplPcId: temp_data.tplPcId,
      }
      if(data.length>0){
        data.splice(result.destination.index, 0, temp);
      }else{
        data.push(temp);
      }
      cur_top_code = '';
      let curIndex = 1;
      data.map(item => {
        item.id = curIndex;
        curIndex++;
      });
    } else {
      const data = reorder(
        this.state.data,
        result.source.index,
        result.destination.index,
      );
      this.setState({ data, is_edit_flag: true });
      return;
    }
    this.setState({ cur_top_code, data });
  };

  //获取装修页面数据
  get_diy_page_detial = (id) => {
    const { dispatch } = this.props;
    let { main_swiper_data, data } = this.state;
    dispatch({
      type: 'pc_home/get_diy_page_detial',
      payload: { decoId: id },
      callback: (res) => {
        if (res.state == 200) {
          let tmp = res.data.data ? JSON.parse(res.data.data.replace(/&quot;/g,"\"")) : [];
          if (tmp.length > 0) {
            tmp.map((val, key) => {
              val.id = key + 1;
              val.data = val.json;
            });
          }
          data = [];
          main_swiper_data = {
            data: {
              data: [],
              type: 'main_banner',
              width: 1920,
              height: 457,//高度为0的话表示不限制
              admin_show_width: 320,
              admin_show_height: 76,
            },
          };
          if(tmp.length > 0){
            data = tmp.filter((item, index) => index > 0);
            main_swiper_data = tmp[0];//主轮播数据
          }
          this.setState({
            data, //楼层数据
            curData: res.data,
            main_swiper_data,
          });
        }
      },
    });
  };

  //保存装修数据  publish: 是否发布 true为发布 false为仅保存，不发布
  save_diy_page_data = (publish) => {
    const { data, curData, main_swiper_data,query } = this.state;
    //轮播图必须设置
    let swiper_data = {};
    let main_swiper_data_flag = false;//主轮播图数据标识 false为空
    for(let i in main_swiper_data.data.data){
      if(main_swiper_data.data.data[i].imgPath){
        main_swiper_data_flag = true;
        break;
      }
    }
    if(!main_swiper_data_flag){
      failTip(`${sldComLanguage('请设置主轮播图')}～`);
      return false;
    } else {
      swiper_data = { tplPcId: this.main_banner_tpl_pc_id, html: '', json: main_swiper_data.data };
    }

    let param = {};
    param.decoId = curData.decoId;
    param.decoType = query.type;
    param.isEnable = publish ? 1 : 0;
    let target = [swiper_data];
    data.map(item => {
      target.push({ tplPcId: item.tplPcId, html: '', json: item.data });
    });
    param.data = quillEscapeToHtml(JSON.stringify(target));
    const { dispatch } = this.props;
    dispatch({
      type: 'pc_home/save_diy_page_data',
      payload: param,
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
        } else {
          failTip(res.msg);
        }
      },
    });
  };

  topData = [{
    top_code: 'goods_floor',
    top_icon: require('@/assets/pc_diy_img/web_diy_top_goods_floor_icon.png'),
    top_name: sldComLanguage('商品楼层'),
    children: [],
  }, {
    top_code: 'adv_floor',
    top_icon: require('@/assets/pc_diy_img/web_diy_top_adv_floor_icon.png'),
    top_name: sldComLanguage('广告楼层'),
    children: [],
  }];//顶部数据

  onChangeTop = (val) => {
    let { cur_top_code } = this.state;
    if (cur_top_code) {
      cur_top_code = cur_top_code == val ? '' : val;
    } else {
      cur_top_code = val;
    }
    this.setState({ cur_top_code });
  };

  //每个楼层的操作  type:操作类型，up：上移
  handleMoveFloor = (index, type) => {
    let { data } = this.state;
    if (type == 'up') {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id == index) {
          let temp = JSON.parse(JSON.stringify(data[i - 1]));
          data[i - 1] = JSON.parse(JSON.stringify(data[i]));
          data[i] = temp;
          break;
        }
      }
    } else if (type == 'down') {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id == index) {
          let temp = JSON.parse(JSON.stringify(data[i]));
          data[i] = JSON.parse(JSON.stringify(data[i + 1]));
          data[i + 1] = temp;
          break;
        }
      }
    } else if (type == 'del') {
      data = data.filter(item => item.id != index);
    }
    let curIndex = 1;
    data.map(item => {
      item.id = curIndex;
      curIndex++;
    });
    this.setState({ data:JSON.parse(JSON.stringify(data)) });
  };

  //顶部上下箭头事件
  handleShowTop = () => {
    let { cur_top_code } = this.state;
    cur_top_code = cur_top_code ? '' : this.topData[0].top_code;
    this.setState({ cur_top_code });
  };

  //保存装修数据
  save_tpl_data = (val, html, index) => {
    let { data } = this.state;
    data[index].html = html;
    data[index].data = val;
    this.setState({ data });
  };

  //保存主轮播图装修数据
  save_main_banner_data = (val) => {
    let { main_swiper_data } = this.state;
    main_swiper_data.data = val;
    this.setState({ main_swiper_data });
  };

  //保存模板
  saveInstanceTpl = (val) => {
    const { dispatch } = this.props;
    let params = {};
    params.dataId = val.data.insTplId;
    params.html = val.html;
    params.json = typeof val.data == 'object'?JSON.stringify(val.data):val.data;
    dispatch({
      type: 'pc_home/edit_instance_tpl',
      payload: params,
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
        } else {
          failTip(res.msg);
        }
      },
    });
  }

  //保存模板Modal取消事件
  sldHandleCancle = () => {
    this.setState({saveInsTplModalVisible:false});
  }

  //保存模板Modal确定事件
  sldHandleConfirm = (val) => {
    let {operateModalType,data,curSetFloorStyleItem,operateData} = this.state;
    if(operateModalType == 'save_as'){
      let params = {};
      params.tplPcId = this.cur_floor_data.tplPcId!=undefined?this.cur_floor_data.tplPcId:this.main_banner_tpl_pc_id;
      params.html = '';
      params.data = this.cur_floor_data.data;
      params.sort = 0;
      params.isEnable = 1;
      params.name = val.name;
      this.addInstanceTpl(params);
    }else{
      for(let i in val){
        curSetFloorStyleItem.data[i] = val[i];
        if(i == 'full_screen'){
          curSetFloorStyleItem.data[i] = val[i]?1:0;
        }
      }
      curSetFloorStyleItem.data.bg_color = operateData[2].initialValue;
      this.setState({data,saveInsTplModalVisible:false})
    }
  }

  //备份功能
  addInstanceTpl = (val) => {
    const { dispatch } = this.props;
    let {data,main_swiper_data} = this.state;
    let params = {};
    params.tplPcId = val.tplPcId;
    params.html = '';
    params.json = typeof val.data == 'object'?JSON.stringify(val.data):val.data;
    params.json = quillEscapeToHtml(params.json);
    params.sort = 0;
    params.isEnable = 1;
    params.name = val.name?val.name:sldComLanguage('备份模板');
    dispatch({
      type: 'pc_home/add_instance_tpl',
      payload: params,
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
          if(!(this.cur_floor_data.data.insTplId != undefined&&this.cur_floor_data.data.insTplId)){
            //需要更新id和名字
            if(this.cur_floor_data.data.type == 'main_banner'){
              main_swiper_data.data.insTplId = res.data;
              main_swiper_data.data.insTplName = val.name;
            }else{
              let tmp = data.filter(item=>item.id==this.cur_floor_data.id)[0];
              tmp.data.insTplId = res.data;
              tmp.data.insTplName = val.name;
            }
          }
          this.setState({saveInsTplModalVisible:false,data,main_swiper_data});
        } else {
          failTip(res.msg);
        }
      },
    });
  };

  calcleSelInstanceModal = () => {
    this.setState({ selTplModalVisible: false });
  };

  //选中模板确定事件
  confirmSelInstanceModal = (val) => {
    let temp_data = JSON.parse(val.json.replace(/&quot;/g,"\""));
    temp_data.insTplId = val.dataId;
    temp_data.insTplName = val.name;
    let { data, cur_tpl_type, main_swiper_data } = this.state;
    let target = { id: 9999, html: val.html, key: '', data: temp_data, tplPcId: val.tplPcId };
    if (cur_tpl_type == 'main_banner') {
      main_swiper_data = { id: 9999, html: val.html, key: '', data: temp_data, tplPcId: val.tplPcId };
      this.setState({ main_swiper_data });
    } else {
      if (!this.position) {
        //在最后添加楼层
        data.push(target);
      } else {
        for (let i = 0; i < data.length; i++) {
          if (data[i].id == this.id) {
            if (this.position == 'top') {
              data.splice(i, 0, target);
            } else if (this.position == 'bottom') {
              data.splice(i + 1, 0, target);
            } else if (this.position == 'cur') {
              data[i] = target;
            }
            break;
          }
        }
      }
      data.map((item, index) => {
        item.id = index + 1;
      });
      this.setState({ data:JSON.parse(JSON.stringify(data)) });
    }
  };

  //添加模板
  addTplData = (position = '', id = '', type = 'floor',tplPcId=0) => {
    let { selTplTitle,cur_tpl_id } = this.state;
    cur_tpl_id = 0;
    if (type == 'main_banner') {
      selTplTitle = sldComLanguage('选择主轮播图模板');
    } else {
      if(position == 'cur'){
        cur_tpl_id = tplPcId;
      }
      selTplTitle = sldComLanguage('添加楼层');
    }
    this.position = position;
    this.id = id;
    this.setState({ selTplModalVisible: true, cur_tpl_type: type, selTplTitle,cur_top_code:'',cur_tpl_id });
  };

  //模板另存为
  saveAsInstanceTpl = (val,title) => {
    let {saveInsTplData} = this.state;
    this.cur_floor_data = val;
    this.setState({
      operateModalType:'save_as',
      saveInsTplTitle:title,
      operateData:JSON.parse(JSON.stringify(saveInsTplData)),
      saveInsTplModalVisible:true,
    })
  }

  //设置楼层样式
  handleFloorStyle = (val) => {
    let {addData,operateData} = this.state;
    operateData = JSON.parse(JSON.stringify(addData));
    operateData.map(item=>{
      item.initialValue = val.data[item.name]!= undefined&&val.data[item.name]?val.data[item.name]:'';
      if(item.name == 'bg_color'){
        item.callbackShow = (color) => this.sldHandleColorPicker(color, 'bg_color', 'is_show');
        item.callback = (color) => this.sldHandleColorPicker(color, 'bg_color', 'color');
      }
    })
    if(val.data.type == 'adv_01'){
      operateData.push({
        type: 'switch',
        label: `${sldComLanguage('宽度占满屏幕')}`,
        name: 'full_screen',
        placeholder: ``,
        initialValue: val.data.full_screen!=undefined&&val.data.full_screen?val.data.full_screen:0,
      });
    }
    this.setState({
      curSetFloorStyleItem:val,
      operateModalType:'floor_style',
      saveInsTplTitle:sldComLanguage('设置楼层样式'),
      operateData,
      saveInsTplModalVisible:true,
    })
  }

  //设置颜色  color:选中的颜色值  name:addData里面的name  type：color 修改颜色， is_show 是否显示
  sldHandleColorPicker = (color, name, type) => {
    let { operateData } = this.state;
    for (let i in operateData) {
      if (operateData[i].name == name) {
        if (type == 'is_show') {
          operateData[i].is_show = color;
        } else if (type == 'color') {
          operateData[i].initialValue = color;
        }
      } else {
        if (operateData[i].name == 'empty') {
          if (type == 'is_show' && color) {
            operateData[i].height = 300;
          } else if (type == 'is_show' && !color) {
            operateData[i].height = 0;
          }
        }

        if (type == 'is_show') {
          operateData[i].is_show = false;
        }
      }

    }
    this.setState({ operateData });
  };

  render() {
    const { data, main_swiper_data, cur_top_code, selTplModalVisible, selTplWidth, selTplTitle,cur_tpl_type,cur_tpl_id,saveInsTplTitle,saveInsTplSubmiting,saveInsTplModalVisible,operateData } = this.state;
    let floorData = cur_top_code ? this.topData.filter(item => item.top_code == cur_top_code)[0].children : [];
    return (
      <div ref={(el) => {
        this.messagesEnd = el;
      }} className={` ${diy.allow_show_sld_mask}`}
           style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
        <div ref={'wrap_top'} className={global.flex_com_column}>
          <EditDdiyPageHead/>
        </div>
        <div style={{ position: 'relative', width: '100%', height: 457, background: '#fff' }}
             className={`${styles.allow_show_edit}`}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 4 }}>
            <MainBanner tpl_info={main_swiper_data.data} save_tpl_data={this.save_main_banner_data}/>
          </div>
          <div className={`${diy.sld_web_item_hover} ${global.flex_row_between_start}`}>
            <div className={diy.instance_tpl_name}>{main_swiper_data.data.insTplName!=undefined&&main_swiper_data.data.insTplName?main_swiper_data.data.insTplName:''}</div>
            <div className={global.flex_row_end_start}>
              <div className={`${global.flex_row_center_center} ${diy.opt} ${diy.up}`}
                   onClick={() => this.addTplData('', '', 'main_banner')}><img
                src={require('@/assets/pc_diy_img/web_tpl_loading_icon.png')}/><span>{sldComLanguage('装载')}</span></div>
              <div className={`${global.flex_row_center_center} ${diy.opt} ${diy.up}`}
                   onClick={() => this.saveAsInstanceTpl(main_swiper_data, `${main_swiper_data.data.insTplId != undefined && main_swiper_data.data.insTplId ? sldComLanguage('模板另存为') : sldComLanguage('保存模板')}`)}>
                <img style={{ width: 14, height: 14 }} src={require('@/assets/pc_diy_img/web_tpl_save_as_icon.png')}/>
                <span>{main_swiper_data.data.insTplId != undefined && main_swiper_data.data.insTplId ? sldComLanguage('另存为') : sldComLanguage('保存')}</span>
              </div>
            </div>
          </div>
        </div>
        <div className={`${global.flex_com_column}`} style={{background:'#fff'}}>
          <DragDropContext onDragEnd={this.onDragEnd}>
            {floorData.length > 0 &&
            <div className={`${global.flex_row_start_center} ${diy.diy_web_fixed_top_detail}`}>
              <Droppable droppableId="droppableTop" direction={'vertical'}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyleTop(snapshot.isDraggingOver)}
                  >
                    {floorData.map((item, index) => (
                      <Draggable key={item.tplPcId} draggableId={item.tplPcId} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyleTop(
                              snapshot.isDragging,
                              provided.draggableProps.style,
                            )}
                          >
                            <div key={index} className={`${global.flex_column_center_center} ${diy.item}`}>
                              <img className={diy.tpl_icon}
                                   src={require(`@/assets/pc_diy_img/web_diy_top_${item.type}_icon_${item.tplPcId}.png`)}/>
                              <span className={diy.tpl_name}>{item.name}</span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
            }
            <div style={{ minHeight: 200,marginTop:10,width:'100%' }}>
              <Droppable droppableId="droppable" direction={'vertical'}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {data.map((item, index) => {
                      let data_json = '';
                      let show_html = false;
                      if (item.data) {
                        data_json = item.data;
                      } else {
                        show_html = true;
                      }
                      return <Draggable key={index} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style,
                            )}
                          >
                            <div style={{ position: 'relative',width: '100%' }} className={`${diy.sld_web_item_hover}`}>
                              <div className={`${global.flex_row_between_start}`}>
                                <div className={diy.instance_tpl_name}>{item.data.insTplName!=undefined&&item.data.insTplName?item.data.insTplName:''}</div>
                                <a className={diy.top_add}
                                   onClick={() => this.addTplData('top', item.id)}>{sldSvgIcon('#ff7e28', 19, 19, 'jia')}</a>
                                <a className={diy.bottom_add}
                                   onClick={() => this.addTplData('bottom', item.id)}>{sldSvgIcon('#ff7e28', 19, 19, 'jia')}</a>
                                <div className={global.flex_row_end_start} style={{position:'absolute',right:0,top:-30, borderRadius: '3px 3px 0 0',overflow:'hidden',zIndex:4}}>
                                  <div className={`${global.flex_row_center_center} ${diy.opt} ${diy.up}`}
                                       onClick={() => this.handleFloorStyle(item)}>
                                    <span>{sldComLanguage('楼层样式')}</span></div>
                                  {/* 第一个楼层不显示上移按钮 */}
                                  {index > 0 &&
                                  <div className={`${global.flex_row_center_center} ${diy.opt} ${diy.up}`}
                                       onClick={() => this.handleMoveFloor(item.id, 'up')}>
                                    <span>{sldComLanguage('上移')}</span></div>
                                  }
                                  {(index < data.length-1)&&
                                  <div className={`${global.flex_row_center_center} ${diy.opt} ${diy.up}`}
                                       onClick={() => this.handleMoveFloor(item.id, 'down')}>
                                    <span>{sldComLanguage('下移')}</span></div>
                                  }
                                  <div className={`${global.flex_row_center_center} ${diy.opt} ${diy.up}`}
                                       onClick={() => this.addTplData('cur', item.id,'floor',item.tplPcId)}>
                                    <span>{sldComLanguage('装载')}</span>
                                  </div>
                                  <div className={`${global.flex_row_center_center} ${diy.opt} ${diy.up}`}
                                       onClick={() => this.saveAsInstanceTpl(item,`${item.data.insTplId!=undefined&&item.data.insTplId?sldComLanguage('模板另存为'):sldComLanguage('保存模板')}`)}>
                                    <span>{item.data.insTplId!=undefined&&item.data.insTplId?sldComLanguage('另存为'):sldComLanguage('保存')}</span>
                                  </div>
                                  <div onClick={() => this.handleMoveFloor(item.id, 'del')}
                                       className={`${global.flex_row_center_center} ${diy.opt} ${diy.up}`}>
                                    <span>{sldComLanguage('删除')}</span>
                                  </div>
                                </div>
                              </div>
                              <Fragment>
                                <div className={`${styles.diy_part_wrap} ${styles.allow_show_edit}`} style={{backgroundColor:item.data.bg_color!=undefined&&item.data.bg_color?item.data.bg_color:'#fff',paddingTop:item.data.padding_top!=undefined&&item.data.padding_top?item.data.padding_top:0,paddingBottom:item.data.padding_bottom!=undefined&&item.data.padding_bottom?item.data.padding_bottom:0}}>
                                  {data_json.type == 'adv_01' &&
                                  <Adv_01 tpl_info={data_json} full_screen={item.data.full_screen!=undefined?item.data.full_screen:0}
                                          save_tpl_data={(val, html) => this.save_tpl_data(val, html, index)}/>
                                  }
                                  {data_json.type == 'adv_02' &&
                                  <Adv_02 tpl_info={data_json}
                                          save_tpl_data={(val, html) => this.save_tpl_data(val, html, index)}/>
                                  }
                                  {data_json.type == 'adv_04' &&
                                  <Adv_04 tpl_info={data_json}
                                          save_tpl_data={(val, html) => this.save_tpl_data(val, html, index)}/>
                                  }
                                  {data_json.type == 'adv_05' &&
                                  <Adv_05 tpl_info={data_json}
                                          save_tpl_data={(val, html) => this.save_tpl_data(val, html, index)}/>
                                  }
                                  {data_json.type == 'adv_06' &&
                                  <Adv_06 tpl_info={data_json}
                                          save_tpl_data={(val, html) => this.save_tpl_data(val, html, index)}/>
                                  }
                                  {data_json.type == 'adv_07' &&
                                  <Adv_07 tpl_info={data_json}
                                          save_tpl_data={(val, html) => this.save_tpl_data(val, html, index)}/>
                                  }
                                  {data_json.type == 'adv_08' &&
                                  <Adv_08 tpl_info={data_json}
                                          save_tpl_data={(val, html) => this.save_tpl_data(val, html, index)}/>
                                  }
                                  {data_json.type == 'adv_09' &&
                                  <Adv_09 tpl_info={data_json}
                                          save_tpl_data={(val, html) => this.save_tpl_data(val, html, index)}/>
                                  }
                                  {data_json.type == 'adv_10' &&
                                  <Adv_10 tpl_info={data_json}
                                          save_tpl_data={(val, html) => this.save_tpl_data(val, html, index)}/>
                                  }
                                  {data_json.type == 'adv_11' &&
                                  <Adv_11 tpl_info={data_json}
                                          save_tpl_data={(val, html) => this.save_tpl_data(val, html, index)}/>
                                  }
                                  {data_json.type == 'adv_12' &&
                                  <Adv_12 tpl_info={data_json}
                                          save_tpl_data={(val, html) => this.save_tpl_data(val, html, index)}/>
                                  }
                                  {data_json.type == 'adv_13' &&
                                  <Adv_13 tpl_info={data_json}
                                          save_tpl_data={(val, html) => this.save_tpl_data(val, html, index)}/>
                                  }
                                  {data_json.type == 'adv_19' &&
                                  <Adv_19 tpl_info={data_json}
                                          save_tpl_data={(val, html) => this.save_tpl_data(val, html, index)}/>
                                  }
                                  {data_json.type == 'adv_20' &&
                                  <Adv_20 tpl_info={data_json}
                                          save_tpl_data={(val, html) => this.save_tpl_data(val, html, index)}/>
                                  }
                                  {data_json.type == 'adv_21' &&
                                  <Adv_21 tpl_info={data_json}
                                          save_tpl_data={(val, html) => this.save_tpl_data(val, html, index)}/>
                                  }
                                </div>
                              </Fragment>

                            </div>
                          </div>
                        )}
                      </Draggable>;
                    })}
                    {provided.placeholder}
                  </div>
                )}

              </Droppable>
            </div>

          </DragDropContext>
        </div>
        {getSldEmptyH(40)}
        {/*装载、添加楼层-start*/}
        <SelInstanceTemplateLists visible={selTplModalVisible} title={selTplTitle} width={selTplWidth}
                                  calcleSelInstanceModal={this.calcleSelInstanceModal}
                                  confirmSelInstanceModal={this.confirmSelInstanceModal} type={cur_tpl_type} tplPcId={cur_tpl_id}/>
        {/*装载、添加楼层-end*/}
        <div className={`${global.flex_row_between_center} ${diy.diy_web_fixed_top}`}>
          <div className={`${global.flex_row_start_center} ${diy.left}`}>
            {this.topData.map((item, index) => {
              return <div key={index} className={`${global.flex_row_start_center} ${diy.item}`}
                          onClick={() => this.onChangeTop(item.top_code)}
                          style={{ background: item.top_code == cur_top_code ? 'rgba(255, 255, 255,.2)' : 'transparent' }}>
                <img className={diy.icon} src={item.top_icon}/>
                <span className={diy.name}>{item.top_name}</span>
              </div>;
            })}
            <div className={`${global.flex_row_center_center} ${diy.show_hide_icon}`}
                 onClick={this.handleShowTop}>{sldSvgIcon('#fff', 13, 13, cur_top_code ? 'shangjiantou' : 'xiajiantou1')}</div>
          </div>
          <div className={`${global.flex_row_end_center}  ${diy.right}`}>
            <span className={`${diy.opt}`} onClick={() => this.addTplData()}>{sldComLanguage('添加楼层')}</span>
            <span className={`${diy.opt}`} onClick={() => this.save_diy_page_data(false)}>{sldComLanguage('保存')}</span>
            <span className={`${diy.opt} ${diy.publish}`} onClick={() => this.save_diy_page_data(true)}>{sldComLanguage('发布')}</span>
          </div>
        </div>
        {/*新增/编辑对话框-start*/}
        <SldModal
          title={saveInsTplTitle}
          submiting={saveInsTplSubmiting}
          width={500}
          modalVisible={saveInsTplModalVisible}
          sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
          sldHandleCancle={this.sldHandleCancle}
          formItemLayoutModal={formItemLayoutModal}
          content={operateData}
        />
        {/*新增/编辑对话框-end*/}
      </div>
    );
  }
}
