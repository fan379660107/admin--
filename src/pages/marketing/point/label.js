import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Switch } from 'antd';
import {
  sldIconBtn,
  failTip,
  sucTip,
  sldLlineRtextAddGoodsAddMargin,
  dragSldTableColumn,
  sldHandlePaginationData,
  formItemLayoutModal,
  validatorNumbe,
  sldComLanguage,
  sldtbaleOpeBtnText,
  sldPopConfirmDiy,
  list_com_page_more,
  getSldComImg,
  getSldCopyData,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';
import SldPreviewImg from '@/components/SldPreviewImg/SldPreviewImg';
import { apiUrl } from '@/utils/sldconfig.js';
import SldDiyMoreImgModal from '@/components/point/SldDiyMoreImgModal/SldDiyMoreImgModal';

let pageSize = list_com_page_more;
let sthis = '';
@connect(({ point }) => ({
  point,
}))
@Form.create()
export default class PointLabel extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      show_preview_modal: false,//预览图片modal框是否展示
      preview_img: '',//预览图片
      preview_alt_con: '',//预览图片内容
      expandedRowKeys: [],//展开的行
      data: {},
      formValues: {},
      submiting: false,//按钮loading
      loading: false,//按钮loading
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      modalVisible: false,
      modalVisibleAdv: false,
      title: `${sldComLanguage('新增')}${sldComLanguage('商品分类')}`,
      type: 'add',//'add'新增  'edit'编辑
      params: {},//搜索条件
      curData: {},//编辑的数据
      origion_data: {
        width: 520,
        height: 210,
        admin_show_width: 260,
        admin_show_height: 105,
        data: [{
          imgPath: '',
          imgUrl: '',
          info: {},
          link_type: '',
          link_value: '',
          title: '',
          bg_color:'#8439D3',
        }, {
          imgPath: '',
          imgUrl: '',
          info: {},
          link_type: '',
          link_value: '',
          title: '',
          bg_color:'#8439D3',
        }, {
          imgPath: '',
          imgUrl: '',
          info: {},
          link_type: '',
          link_value: '',
          title: '',
          bg_color:'#8439D3',
        }, {
          imgPath: '',
          imgUrl: '',
          info: {},
          link_type: '',
          link_value: '',
          title: '',
          bg_color:'#8439D3',
        }, {
          imgPath: '',
          imgUrl: '',
          info: {},
          link_type: '',
          link_value: '',
          title: '',
          bg_color:'#8439D3',
        }, {
          imgPath: '',
          imgUrl: '',
          info: {},
          link_type: '',
          link_value: '',
          title: '',
          bg_color:'#8439D3',
        }, {
          imgPath: '',
          imgUrl: '',
          info: {},
          link_type: '',
          link_value: '',
          title: '',
          bg_color:'#8439D3',
        }, {
          imgPath: '',
          imgUrl: '',
          info: {},
          link_type: '',
          link_value: '',
          title: '',
          bg_color:'#8439D3',
        }],
      },//多图选择器的数据
      modalTitle: `${sldComLanguage('设置广告')}`,//多图选择器标题
      cur_data: {},//多图选择器的数据
      addData: [{
        type: 'input',
        label: `${sldComLanguage('标签名称')}`,
        name: 'labelName',
        extra:`${sldComLanguage('最多输入4个字')}`,
        placeholder: `${sldComLanguage('请输入标签名称')}`,
        initialValue: '',
        maxLength:4,
        rules: [{
          whitespace: true,
          required: true,
          message: `${sldComLanguage('请输入标签名称')}`,
        }],
      }, {
        type: 'inputnum',
        label: `${sldComLanguage('排序')}`,
        name: 'sort',
        extra: `${sldComLanguage('请输入0~255的数字,值越小,显示越靠前')}`,
        placeholder: `${sldComLanguage('请输入')}${sldComLanguage('排序')}`,
        initialValue: '',
        rules: [{
          required: true,
          message: `${sldComLanguage('请输入')}${sldComLanguage('排序')}`,
        }, { validator: (rule, value, callback) => validatorNumbe(rule, value, callback) }],
      }, ],//modal框的数据
      columns: [
       {
          title: `${sldComLanguage('标签名称')}`,
          align: 'left',
          dataIndex: 'labelName',
          width: 150,
        },
        {
          title: `${sldComLanguage('排序')}`,
          dataIndex: 'sort',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('二级标签图')}`,
          dataIndex: 'imageUrl',
          align: 'center',
          width: 100,
          render: (text, record) => {
            return record.grade == 1?'--':getSldComImg(text,160,160,50,50);//图片预览
          },
        },

        {
          title: `${sldComLanguage('是否显示')}`,
          dataIndex: 'state',
          align: 'center',
          width: 80,
          render: (text, record) => (
            <Switch onChange={(checked) => this.operate({labelId:record.labelId,state:checked ? 1 : 0} ,'show')}
                    checked={text == 1 ? true : false}
                    valuepropname={'checked'}/>
          ),
        },
        {
          title: `${sldComLanguage('操作')}`,//操作
          align: 'center',
          width: 100,
          render: (text, record) => (
            <Fragment>
              {record.grade == 1&&
              <Fragment>
                {sldtbaleOpeBtnText(`${sldComLanguage('设置广告')}`, () => this.addAdv(record))}
                <span className={global.splitLine}></span>
              </Fragment>
              }
              {sldtbaleOpeBtnText(`${sldComLanguage('编辑')}`, () => this.editLabel(record))}
              {record.grade == 1 &&
                <Fragment>
                  <span className={global.splitLine}></span>
                  {sldtbaleOpeBtnText(`${sldComLanguage('添加子标签')}`, () => this.addNextLabel(record))}
                </Fragment>
              }

              {record.children == null &&
              <Fragment>
                <span className={global.splitLine}></span>
                {/*删除后不可恢复，是否确定删除？*/}
                {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.operate(record.labelId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                  sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
              </Fragment>
              }
            </Fragment>
          ),
        },
      ],
    };
  }

  cur_edit_id = '';//当前操作数据id
  parentLabelId = 0;//父标签id

  label_data = {
    type: 'TreeSelectDIy',
    label: `${sldComLanguage('上级标签')}`,
    name: 'parentLabelId',
    placeholder: `${sldComLanguage('请选择上级标签')}`,
    initialValue: '',
    help: `${sldComLanguage('默认为最顶级')}`,
    disabled: false,
    data: [],
    sele_key: 'labelId',
    sele_name: 'labelName',
    allowClear: true,
    onChange: (value, label, extra) => this.sldHandleChangeLabel(value, label, extra),
  };

  upload_data = {
    type: 'upload_img_upload',
    label: `${sldComLanguage('二级标签图片')}`,
    name: 'image',
    fileList: [],
    img_info: {},
    required: true,
    upload_name: 'file',
    upload_url: apiUrl + `v3/oss/common/upload?source=setting`,
    uploadPreview: (info) => this.uploadImgPre(info),
    uploadChange: (info) => this.uploadImg(info, 'image'),
    initialValue: '',
  };

  modal_tip = [
    `${sldComLanguage('最多上传8张图片,每张图片不可以超过1M')}`,
    `${sldComLanguage('请严格根据提示要求上传规定尺寸的广告图片')}`,
    `${sldComLanguage('编辑项中的“操作”指点击该内容所产生的链接地址，可通过下拉选项选择不同的方式')}`,
  ];

  componentDidMount() {
    this.get_list({ labelId: 0 });//grade为1表示获取一级数据
    this.get_tree_list(0,1);
  }

  componentWillUnmount() {

  }

  //获取标签树数据
  get_tree_list = (pid = 0, grade = 1) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'point/get_label_tree_list',
      payload: {parentLabelId:pid,grade:grade},
      callback: (res) => {
        this.label_data.data = res.data
      },
    });
  };

  //获取数据列表
  get_list = (params, grade = '') => {
    const { dispatch } = this.props;
    let { data, expandedRowKeys } = this.state;
    dispatch({
      type: 'point/get_label_list',
      payload: {...params,pageSize:pageSize},
      callback: (res) => {
        //grade为1直接赋值
        if (grade != '') {
          for (let i in data.list) {
            if (grade == 1) {
              if (data.list[i].labelId == params.labelId) {
                data.list[i].children = res.data.list;
                break;
              }
            } else {
              if (data.list[i].children != undefined) {
                for (let j in data.list[i].children) {
                  if (data.list[i].children[j].labelId == params.labelId) {
                    data.list[i].children[j].children = res.data.list;
                    break;
                  }
                }
              }
            }
          }
        } else {
          data.list = res.data.list;
        }
        this.setState({
          data: data,
          expandedRowKeys: grade == '' ? [] : expandedRowKeys,
        });
      },
    });
  };


  //设置广告
  addAdv = (val) => {
    let { modalTitle, cur_data, origion_data } = this.state;
    cur_data = { ...origion_data, data: getSldCopyData(origion_data.data) };
    if (val.data) {
      modalTitle = `${sldComLanguage('编辑广告')}`;
      let adv_data = JSON.parse(val.data.replace(/&quot;/g,"\""));
      for (let i in cur_data.data) {
        if (adv_data[i].imgUrl) {
          cur_data.data[i] = adv_data[i];
        }
      }
    } else {
      modalTitle = `${sldComLanguage('设置广告')}`;
    }
    this.setState({
      modalVisibleAdv: true,
      modalTitle,
      cur_data: cur_data,
      curData: val,
    });
  };

  //预览图片
  uploadImgPre = (info) => {
    this.viewImg(true, (info.response!=undefined&&info.response.data!=undefined?info.response.data.url:info.url));
  };

  //预览图片/关闭预览图片
  viewImg = (flag, img = '', text = '') => {
    this.setState({
      preview_img: img,
      preview_alt_con: text,
      show_preview_modal: flag,
    });
  };

  //上传图片
  uploadImg = (info, type) => {
    let { addData } = this.state;
    if(info.file.status!=undefined&&info.file.status!='error') {
      for (let i in addData) {
        if (addData[i].name == type) {
          addData[i].fileList = info.fileList;
          addData[i].img_info = (info.file.response != undefined && info.fileList.length > 0 && info.file.response.data != undefined) ? info.file.response.data : [];
        }
      }
      this.setState({ addData });
    }
  };

  sldHandleChangeLabel = (value, label, extra) => {
    let { addData } = this.state;
    if (label.length == 0){
      addData = addData.filter(item => item.name != 'image' );
      this.parentLabelId = 0;
    }else{
      //如果已有图片上传控件，则替换掉
      if(addData[addData.length-1].type==='upload_img_upload'){
        addData.splice(addData.length-1, 1, this.getNewData('image'));
      }else{
        //如果没有图片上传控件，则新增
        addData.splice(addData.length, 0, this.getNewData('image'));
      }
      this.parentLabelId = extra.triggerNode.props.eventKey;
    }
    this.setState({
      addData,
    });
  }

  handleSelectRows = (rows, rowkeys) => {
    this.setState({
      selectedRows: rows,
      selectedRowKeys: rowkeys,
    });
  };

  handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
    if (type == 'main') {
      const { formValues } = this.state;
      const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
      pageSize = params.pageSize;
      this.setState({
        params: params,
      });
      this.get_list(params);
    }
  };

  //实现深拷贝，防止对象相互影响
  getNewData = (type) => {
    let tar_data = {};
    if(type == 'image'){
      tar_data = JSON.parse(JSON.stringify(this.upload_data));
      tar_data.uploadPreview = (info) => this.uploadImgPre(info);
      tar_data.uploadChange = (info) => this.uploadImg(info, 'image');
    }else if(type == 'parentLabelId'){
      tar_data = JSON.parse(JSON.stringify(this.label_data));
      tar_data.onChange = (value, node, extra) => this.sldHandleChangeLabel(value, node, extra);
    }
    return tar_data;
  }

  //新增功能
  addLabel = () => {
    let { addData } = this.state;
    addData = addData.filter(item => item.name != 'parentLabelId'&&item.name != 'image');
    for (let i = 0; i < addData.length; i++) {
      if (addData[i].name == 'labelName') {
        addData.splice(i + 1, 0, this.getNewData('parentLabelId'));
        addData[i].initialValue = '';
      } else {
        addData[i].initialValue = '';
      }
    }
    this.parentLabelId = 0;
    this.setState({
      modalVisible: true,
      type: 'add',
      title: `${sldComLanguage('添加积分商城标签')}`,
      addData,
    });
  };

  //添加子标签功能
  addNextLabel = (val) => {
    let { addData } = this.state;
    addData = addData.filter(item => item.name != 'parentLabelId' && item.name != 'image' );
    for (let i = 0; i < addData.length; i++) {
      if (addData[i].name == 'labelName') {
        addData.splice(i + 1, 0, this.getNewData('parentLabelId'));
        addData[i].initialValue = '';
      } else if (addData[i].name == 'parentLabelId'){
        addData[i].initialValue = val.labelName;
        addData[i].disabled = true;
      }else if(addData[i].name == 'sort'){
        addData.splice(i + 2, 0, this.getNewData('image'));
        addData[i].initialValue = '';
      }
    }
    this.parentLabelId = val.labelId;
    this.setState({
      modalVisible: true,
      type: 'add',
      title: `${sldComLanguage('添加子标签')}`,
      addData,
    });
  };

  //编辑商品标签
  editLabel = (val) => {
    let { addData } = this.state;
    addData = addData.filter(item => item.name != 'parentLabelId'&&item.name != 'image');
    for (let i = 0; i < addData.length; i++) {
     if (addData[i].name == 'sort') {
        addData[i].initialValue = val[addData[i].name];
        if (val.grade == 2) {
          addData.splice(i + 1, 0, this.getNewData('image'));
          //初始化图片数据
          let fileList = [];
          let tmp_data = {};
          tmp_data.uid = val.labelId;
          tmp_data.name = val.imageUrl;
          tmp_data.status = 'done';
          tmp_data.url = val.imageUrl;
          fileList.push(tmp_data);
          addData[i+1].fileList = fileList;
          addData[i+1].img_info.path = val.image;
        }
      } else {
        addData[i].initialValue = val[addData[i].name];
      }
    }
    this.parentLabelId = val.parentLabelId;
    this.setState({
      type: 'edit',
      title: `${sldComLanguage('编辑积分标签')}`,
      addData: addData,
      modalVisible: true,
      curData: val,
    });
  };

  //积分标签操作事件 type add:添加 edit:编辑 del:删除 show:是否显示 adv:设置广告
  operate = (id, type) => {
    let params = {};
    const { dispatch } = this.props;
    let dis_type = '';
    if (type == 'add') {
      dis_type = 'point/add_label';
      params = id;
    } else if (type == 'edit') {
      dis_type = 'point/edit_label';
      params = id;
    } else if (type == 'del') {
      dis_type = 'point/del_label';
      params.labelId = id;
    } else if (type == 'show') {
      dis_type = 'point/is_show_label';
      params = id;
    } else if (type == 'adv') {
      dis_type = 'point/set_label_adv';
      params = id;
    }
    this.setState({ submiting: true });
    dispatch({
      type: dis_type,
      payload: params,
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
          this.get_list({ categoryId: 0 });
          this.get_tree_list(0,2);
          this.setState({
            modalVisible: false,
          });
        } else {
          failTip(res.msg);
        }
        this.setState({ submiting: false });
      },
    });
  };

  sldHandleConfirm = (val) => {
    const { curData, type, addData } = this.state;
    let sld_params = {};
    sld_params.labelName = val.labelName;
    sld_params.sort = val.sort;
    sld_params.parentLabelId = this.parentLabelId;//父分类id,一级分类==0

    if(sld_params.parentLabelId){
      for (let i in addData) {
        if (addData[i].name == 'image') {
          if (addData[i].img_info.path == undefined) {
            failTip(`${sldComLanguage('请上传二级标签图片')}`);
            return false;
          } else {
            sld_params.image = addData[i].img_info.path;
          }
        }
      }
    }

    if (type == 'edit') {
      sld_params.labelId = curData.labelId;
      this.operate(sld_params, 'edit');
    } else {
      this.operate(sld_params, 'add');
    }
  };

  sldHandleCancle = () => {
    this.setState({ modalVisible: false,modalVisibleAdv: false });
  };


  //表格拖动
  resizeTable = (index, size, type, data) => {
    let datas = dragSldTableColumn(index, size, data);
    this.setState({ [type]: datas });
  };

  sldHandleConfirmAdv = (val) => {
    const { curData } = this.state;
    this.operate({ labelId: curData.labelId, data: JSON.stringify(val) }, 'adv');
  };

  onExpand = (expanded, record) => {
    let { expandedRowKeys } = this.state;
    if (expanded) {
      expandedRowKeys.push(record.labelId);
      this.get_list({ labelId: record.labelId }, record.grade);
    } else {
      expandedRowKeys = expandedRowKeys.filter(item => item != record.labelId);
    }
    this.setState({ expandedRowKeys });
  };

  render() {
    const { selectedRows, modalVisible, title, addData, columns, submiting, data, loading, expandedRowKeys,preview_img, preview_alt_con, show_preview_modal,modalVisibleAdv,modalTitle,cur_data } = this.state;

    return (
      <div className={global.common_page}>
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('标签管理')}`, 0, 0, 5)}
        <Spin spinning={loading}>
          { /*公共功能条-start*/}
          <div className={global.operate_bg}>
            {sldIconBtn(() => this.addLabel(), `${sldComLanguage('新增标签')}`, 7, 0)}
          </div>
          { /*公共功能条-end*/}
          { /*标准表格-start*/}
          <StandardTable
            totalHeight={document.body.clientHeight - 140 - 20}
            expandedRowKeys={expandedRowKeys}
            selectedRows={selectedRows}
            data={data}
            rowKey={'labelId'}
            isCheck={false}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
            sldpagination={false}
            resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
            isColumnResize={true}
            onExpand={this.onExpand}
          />
          { /*标准表格-end*/}
          { /*新增/编辑对话框-start*/}
          <SldModal
            zIndex={1}
            width={500}
            title={title}
            submiting={submiting}
            modalVisible={modalVisible}
            sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
            sldHandleCancle={this.sldHandleCancle}
            formItemLayoutModal={formItemLayoutModal}
            content={addData}
          />
          { /*新增/编辑对话框-end*/}

        </Spin>
        {/*图片预览-start*/}
        <SldPreviewImg img={preview_img} show_preview_modal={show_preview_modal} modal_width={300}
                       preview_alt_con={preview_alt_con} closePreviewModal={() => this.viewImg(false)}/>
        {/*图片预览-end*/}
        <SldDiyMoreImgModal
          width={1000}
          title={modalTitle}
          sldSeleSingleRow={true}
          submiting={submiting}
          modalVisible={modalVisibleAdv}
          sldHandleConfirm={(val) => this.sldHandleConfirmAdv(val)}
          sldHandleCancle={this.sldHandleCancle}
          content={cur_data}
          modal_tip={this.modal_tip}
          client={'mobile'}
          uploadLimit={1}
        />
      </div>
    );
  }
}
