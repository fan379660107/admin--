import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Icon, Spin, Upload } from 'antd';
import {
  failTip,
  sucTip,
  sldLlineRtextAddGoodsAddMargin,
  dragSldTableColumn,
  sldHandlePaginationData,
  sldComLanguage,
  sldtbaleOpeBtnText,
  getSldCopyData,
  sldBeforeUpload,
  list_com_page_more,
  getLocalStorageStingVal,
  showMoreHelpTip,
  getSldEmptyH,
  sldIconBtn,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import { apiUrl } from '@/utils/sldconfig.js';
import SldPreviewImg from '@/components/SldPreviewImg/SldPreviewImg';
import SldDiyMoreImgModal from '@/components/SldDiyMoreImgModal/SldDiyMoreImgModal';
import styles from './mdecorate.less';

let pageSize = list_com_page_more;
let comm_cur_page = 1;//当前页数
let sthis = '';
const uploadButton = (
  <div>
    <Icon type="plus"/>
    <div className="ant-upload-text">{sldComLanguage('上传图片')}</div>
  </div>
);
@connect(({ mdecorate,common }) => ({
  mdecorate,common
}))
@Form.create()
export default class MCat extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      modal_width: 300,//图片预览宽度
      show_preview_modal: false,//预览图片modal框是否展示
      preview_img: '',//预览图片
      preview_alt_con: '',//预览图片内容
      expandedRowKeys: [],//展开的行
      show_table_modal_add: false,//是否显示input后缀搜索modal上的新增按钮，默认不显示
      modalSldAddVisible: false,//是否显示input后缀add的modal框，默认不显示
      tablesldSAddTitle: `${sldComLanguage('添加')}`,//input后缀add的modal框的标题   添加
      cur_type: '',//show_list表示表格搜索，add表示添加数据
      cur_operate_type: '',//当前操作对象
      search_modal_width: 600,//默认搜索，modal宽度
      tableTitle: '',
      data: {},
      formValues: {},
      modalTableVisible: false,//选择商品类型弹框
      submiting: false,//按钮loading
      loading: false,//按钮loading
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      modalVisibleAdv: false,//多图选择器是否显示，默认不显示
      cur_data: {},//多图选择器的数据
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
        }, {
          imgPath: '',
          imgUrl: '',
          info: {},
          link_type: '',
          link_value: '',
          title: '',
        }, {
          imgPath: '',
          imgUrl: '',
          info: {},
          link_type: '',
          link_value: '',
          title: '',
        }],
      },//多图选择器的数据
      modalTitle: `${sldComLanguage('设置分类广告')}`,//多图选择器标题
      title: `${sldComLanguage('新增')}${sldComLanguage('商品分类')}`,//新增商品分类
      type: 'add',//'add'新增  'edit'编辑
      params: {},//搜索条件
      curData: {},//编辑的数据
      columns: [
        {
          title: ' ',
          dataIndex: 'categoryId',
          align: 'center',
          width: 55,
          render: (text, record, index) => {
            return (comm_cur_page - 1) * pageSize + index + 1;
          },
        },
        {
          title: `${sldComLanguage('分类名称')}`,//分类名称
          align: 'left',
          dataIndex: 'categoryName',
          width: 300,
        },
        {
          title: `${sldComLanguage('排序')}`,//排序
          dataIndex: 'sort',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('二级分类图片')}`,//二级分类图片
          dataIndex: 'categoryImageUrl',
          align: 'center',
          width: 100,
          render: (text, record) => {
            let tmp_file_list = [];
            if(record.fileList==undefined){
              if(record.categoryImageUrl){
                let tmp_data = {};
                tmp_data.uid = record.categoryId;
                tmp_data.name = record.categoryImageUrl;
                tmp_data.status = 'done';
                tmp_data.url = record.categoryImageUrl;
                tmp_file_list.push(tmp_data);
              }
            }else{
              tmp_file_list = record.fileList;
              if(tmp_file_list.length>0&&record.categoryImageUrl){
                tmp_file_list[0].url = record.categoryImageUrl;
              }
            }
            return record.grade == 2
              ?<div className={`${global.flex_column_center_center} ${styles.mcat_upload_wrap}`}><Upload
                withCredentials={true}
                beforeUpload={sldBeforeUpload}
                accept={'.gif, .jpeg, .png,.jpg,'}
                name={'file'}
                action={`${apiUrl}v3/oss/common/upload?source=adminDeco`}
                listType="picture-card"
                fileList={tmp_file_list}
                onPreview={(info) => this.uploadImgPre(info)}
                onChange={(info) => this.uploadImg(info,record)}
                headers={{
                  Authorization: 'Bearer ' + getLocalStorageStingVal('sld_token')
                }}
              >
                {tmp_file_list.length >= 1 ? null : uploadButton}
              </Upload>
                <span>{sldComLanguage('建议上传160*160的图片')}</span>
            </div>
              :'--'
          },
        },
        {
          title: `${sldComLanguage('三级分类图片')}`,//三级分类图片
          dataIndex: 'categoryImage',
          align: 'center',
          width: 100,
          render: (text, record) => {
            let tmp_file_list = [];
            if(record.fileList==undefined){
              if(record.categoryImageUrl){
                let tmp_data = {};
                tmp_data.uid = record.categoryId;
                tmp_data.name = record.categoryImageUrl;
                tmp_data.status = 'done';
                tmp_data.url = record.categoryImageUrl;
                tmp_file_list.push(tmp_data);
              }
            }else{
              tmp_file_list = record.fileList;
              if(tmp_file_list.length>0&&record.categoryImageUrl){
                tmp_file_list[0].url = record.categoryImageUrl;
              }
            }
            return record.grade == 3
              ?<div className={`${global.flex_column_center_center} ${styles.mcat_upload_wrap}`}><Upload
                withCredentials={true}
                beforeUpload={sldBeforeUpload}
                accept={'.gif, .jpeg, .png,.jpg,'}
                name={'file'}
                action={`${apiUrl}v3/oss/common/upload?source=adminDeco`}
                listType="picture-card"
                fileList={tmp_file_list}
                onPreview={(info) => this.uploadImgPre(info)}
                onChange={(info) => this.uploadImg(info,record)}
                headers={{
                  Authorization: 'Bearer ' + getLocalStorageStingVal('sld_token')
                }}
              >
                {tmp_file_list.length >= 1 ? null : uploadButton}
              </Upload>
                <span>{sldComLanguage('建议上传160*160的图片')}</span>
            </div>
              :'--'
          },
        },
        {
          title: `${sldComLanguage('创建时间')}`,//创建时间
          dataIndex: 'createTime',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('更新时间')}`,//更新时间
          dataIndex: 'updateTime',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('操作')}`,//操作
          align: 'center',
          width: 100,
          render: (text, record) => (
            <Fragment>
              {record.grade == 1
              ?sldtbaleOpeBtnText(`${sldComLanguage('设置分类广告')}`, () => this.addCatAdv(record))
              :'--'
            }
            </Fragment>
          ),
        },
      ],
    };
  }


  modal_tip = [
    `${sldComLanguage('最多上传3张图片,每张图片不可以超过1M')}`,
    `${sldComLanguage('请严格根据提示要求上传规定尺寸的广告图片')}`,
    `${sldComLanguage('编辑项中的“操作”指点击该内容所产生的链接地址，可通过下拉选项选择不同的方式')}`,
  ];

  componentDidMount() {
    this.get_list({ categoryId: 0 });//获取一级数据
  }

  componentWillUnmount() {

  }

  //获取数据列表
  get_list = (params, grade = '') => {
    const { dispatch } = this.props;
    let { data, expandedRowKeys } = this.state;
    dispatch({
      type: 'mdecorate/get_cate_list_by_id',
      payload: {...params,pageSize:pageSize},
      callback: (res) => {
        //grade为''直接赋值
        if (grade != '') {
          for (let i in data.list) {
            if (grade == 1) {
              //二级分类
              if (data.list[i].categoryId == params.categoryId) {
                data.list[i].children = res.data.list;
                break;
              }
            } else {
              //三级分类
              if (data.list[i].children != undefined) {
                for (let j in data.list[i].children) {
                  if (data.list[i].children[j].categoryId == params.categoryId) {
                    data.list[i].children[j].children = res.data.list;
                    break;
                  }
                }
              }
            }
          }
        } else {
          //一级分类
          data.list = res.data.list;
        }
        this.setState({
          data: data,
          expandedRowKeys: grade == '' ? [] : expandedRowKeys,
        });
      },
    });
  };

  //上传图片
  uploadImg = (info,record) => {
    let { data } = this.state;
    let cur_data = [];
    if(record.grade == 2){
      let tmp_data = data.list.filter(item=>item.categoryId == record.pid);
      cur_data = tmp_data[0].children.filter(item=>item.categoryId == record.categoryId);
    }else if(record.grade == 3){
      cur_data = [record];
    }else{
      for(let i in data.list){
        if(data.list[i].children.length > 0){
          let tmp_data = data.list[i].children.filter(item=>item.categoryId == record.pid);
          cur_data = tmp_data[0].children.filter(item=>item.categoryId == record.categoryId);
        }
      }
    }
    cur_data[0].fileList = info.fileList;
    if (info.file.status != undefined) {
      if(info.file.status == 'done'){
        cur_data[0].categoryImageUrl = info.file.response.data.url;
        cur_data[0].fileList[0].url = cur_data[0].categoryImageUrl;
        //调用上传保存接口
        let edit_data = {};
        edit_data.categoryId = record.categoryId;
        edit_data.categoryImage = info.file.response.data.path;
        this.operateCat(edit_data,'edit');
      }else if(info.file.status == 'removed'){
        cur_data[0].categoryImageUrl = '';
        //调用上传保存接口
        let edit_data = {};
        edit_data.categoryId = record.categoryId;
        edit_data.categoryImage = '';
        this.operateCat(edit_data,'edit');
      }
    }
    data = JSON.parse(JSON.stringify(data));
    this.setState({data})
  };

  //预览图片
  uploadImgPre = (info) => {
    this.viewImg(true, info.url || info.thumbUrl);
  };

  //预览图片/关闭预览图片
  viewImg = (flag, img = '', text = '') => {
    this.setState({
      preview_img: img,
      preview_alt_con: text,
      show_preview_modal: flag,
    });
  };

  //显示modal弹框_弹框专属
  showAllUnit = (val) => {
    let { tableTitle, search_modal_width } = this.state;
    if (val == 'search_goods_type') {
      tableTitle = `${sldComLanguage('请选择')}${sldComLanguage('商品类型')}`;//请选择商品类型
      search_modal_width = 800;
    }
    this.setState({
      modalTableVisible: true,
      cur_operate_type: val,
      cur_type: 'show_list',
      tableTitle: tableTitle,
      search_modal_width: search_modal_width,
    });
  };

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

  //设置分类广告
  addCatAdv = (val) => {
    let { modalTitle, cur_data, origion_data } = this.state;
    cur_data = { ...origion_data, data: getSldCopyData(origion_data.data) };
    if (val.mobileImage) {
      modalTitle = `${sldComLanguage('编辑分类广告')}`;
      let adv_data = JSON.parse(val.mobileImage.replace(/&quot;/g,"\""));
      for (let i in cur_data.data) {
        if (adv_data[i].imgUrl) {
          cur_data.data[i] = adv_data[i];
        }
      }
    } else {
      modalTitle = `${sldComLanguage('设置分类广告')}`;
    }
    this.setState({
      modalVisibleAdv: true,
      modalTitle,
      cur_data: cur_data,
      curData: val,
    });
  };

  //分类操作事件 type edit:编辑 cache:更新分类缓存 source:来源，默认为空，如果是设置分类广告，则为adv，需要更新数据
  operateCat = (id, type, source='') => {
    let params = {};
    const { dispatch } = this.props;
    let {data} = this.state;
    let dis_type = '';
    if (type == 'edit') {
      dis_type = 'mdecorate/edit_cate_img';
      params = id;
    }else if (type == 'cache') {
      dis_type = 'common/update_goods_cat_cache';
    }
    this.setState({ submiting: true });
    dispatch({
      type: dis_type,
      payload: params,
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
          if(type == 'cache'){
            //更新缓存需要重新获取数据
            this.get_list({ categoryId: 0 });
          }else{
            if(source == 'adv'){
              let temp = data.list.filter(item=>item.categoryId == id.categoryId)[0];
              temp.mobileImage = id.mobileImage;
            }
            this.setState({data})
          }
          //更新数据
          this.setState({
            modalVisibleAdv: false,
          });
        } else {
          failTip(res.msg);
        }
        this.setState({ submiting: false });
      },
    });
  };

  sldHandleCancle = () => {
    this.setState({ modalVisibleAdv: false });
  };


  //表格拖动
  resizeTable = (index, size, type, data) => {
    let datas = dragSldTableColumn(index, size, data);
    this.setState({ [type]: datas });
  };

  onExpand = (expanded, record) => {
    let { expandedRowKeys } = this.state;
    if (expanded) {
      expandedRowKeys.push(record.categoryId);
      this.get_list({ categoryId: record.categoryId }, record.grade);
    } else {
      expandedRowKeys = expandedRowKeys.filter(item => item != record.categoryId);
    }
    this.setState({ expandedRowKeys });
  };

  sldHandleConfirmAdv = (val) => {
    const { curData } = this.state;
    this.operateCat({ categoryId: curData.categoryId, mobileImage: JSON.stringify(val) }, 'edit','adv');
  };

  render() {
    const { selectedRows, columns, submiting, data, loading, expandedRowKeys, preview_img, show_preview_modal, modal_width, preview_alt_con, modalVisibleAdv, modalTitle, cur_data } = this.state;
    return (
      <div className={global.common_page}>
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('分类图片管理')}`, 0, 0, 10)}
        {showMoreHelpTip(``, [`${sldComLanguage('当分类图片有更新的时候，需点击`更新分类缓存`按钮才能生效')}`], 8, true)}
        {getSldEmptyH(10)}
        <Spin spinning={loading}>
          { /*公共功能条-start*/}
          <div className={global.operate_bg}>
            {sldIconBtn(() => this.operateCat('','cache'), `${sldComLanguage('更新分类缓存')}`, 7, 0, 13, 13, 4, 'shuaxin1')}
          </div>
          { /*公共功能条-end*/}
          { /*标准表格-start*/}
          <StandardTable
            totalHeight={document.body.clientHeight-205-15}
            expandedRowKeys={expandedRowKeys}
            selectedRows={selectedRows}
            data={data}
            rowKey={'categoryId'}
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
          {/*图片预览-start*/}
          <SldPreviewImg img={preview_img} show_preview_modal={show_preview_modal} modal_width={modal_width}
                         preview_alt_con={preview_alt_con} closePreviewModal={() => this.viewImg(false)}/>
          {/*图片预览-end*/}
        </Spin>
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
        />
      </div>
    );
  }
}
