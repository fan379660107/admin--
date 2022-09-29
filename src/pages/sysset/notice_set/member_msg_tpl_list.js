import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Switch } from 'antd';
import {
  failTip,
  sucTip,
  list_com_page_size_10,
  dragSldTableColumn,
  sldHandlePaginationData,
  formItemLayoutModal,
  getTableNum,
  sldComLanguage,
  getSldCopyData,
  sldtbaleOpeBtnText,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';

let pageSize = list_com_page_size_10;
@connect(({ sldsetting, common }) => ({
  sldsetting,
  common,
}))
@Form.create()
export default class MemberMsgTplList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal_width: 600,//modal 弹框宽度
      initLoading: false,
      submiting: false,
      data: {},//列表数据
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      title: '',
      type: '',//消息模板编辑类型
      params: { pageSize: pageSize },//搜索条件
      upload_img_info: {},//上传的图片信息
      operateData: [],//操作的数据
      msgData: [
        {
          type: 'switch',
          label: `${sldComLanguage('是否开启')}`,
          name: 'msgSwitch',
          placeholder: ``,
          initialValue: 1,
        },
        {
          type: 'textarea',
          label: `${sldComLanguage('模板内容')}`,
          name: 'msgContent',
          placeholder: `${sldComLanguage('请输入模板内容')}`,
          extra: `${sldComLanguage('最多输入100个字')}`,
          initialValue: '',
          maxLength:100,
          rules: [{
            required: true,
            whitespace: true,
            message: `${sldComLanguage('请输入模板内容')}`,
          }, ],
        },

      ],//站内信modal框的数据
      emailData: [
        {
          type: 'switch',
          label: `${sldComLanguage('是否开启')}`,
          name: 'emailSwitch',
          placeholder: ``,
          initialValue: 1,
        },
        {
          type: 'input',
          label: `${sldComLanguage('邮件标题')}`,//邮件标题
          name: 'email_subject',
          placeholder: `${sldComLanguage('请输入邮件标题')}`,
          initialValue: '',
          rules: [{
            required: true,
            whitespace: true,
            message: `${sldComLanguage('请输入模板内容')}`,
          }, ],
        }, {
          type: 'quill',
          label: `${sldComLanguage('邮件内容')}`,
          name: 'email_content',
          placeholder: ``,
          initialValue: '',
          handleGetContent: (val) => this.handleGetContent(val),
        },

      ],//邮件modal框的数据
      smsData: [
        {
          type: 'switch',
          label: `${sldComLanguage('是否开启')}`,
          name: 'smsSwitch',
          placeholder: ``,
          initialValue: 1,
        },
        {
          type: 'input',
          label: `${sldComLanguage('短信模版ID')}`,
          name: 'templateId',
          placeholder: `${sldComLanguage('请输入短信模版ID')}`,
          initialValue: '',
          rules: [{
            required: true,
            whitespace: true,
            message: `${sldComLanguage('请输入模板内容')}`,
          }, ],
        },
        {
          type: 'textarea',
          label: `${sldComLanguage('模板内容')}`,//模板内容
          name: 'templateContent',
          placeholder: `${sldComLanguage('请输入模板内容')}`,
          extra: `${sldComLanguage('最多输入100个字')}`,
          initialValue: '',
          maxLength:100,
          rules: [{
            required: true,
            whitespace: true,
            message: `${sldComLanguage('请输入模板内容')}`,
          }, ],
        },

      ],//短信modal框的数据
      wxData: [
        {
          type: 'switch',
          label: `${sldComLanguage('是否开启')}`,
          name: 'wxSwitch',
          placeholder: ``,
          initialValue: 1,
        }, {
          type: 'input',
          label: `${sldComLanguage('微信模板ID')}`,
          name: 'templateId',
          placeholder: `${sldComLanguage('请输入微信模板ID')}`,
          initialValue: '',
          rules: [{
            required: true,
            whitespace: true,
            message: `${sldComLanguage('请输入模板内容')}`,
          }, ],
        },
        {
          type: 'textarea',
          label: `${sldComLanguage('模板内容')}`,
          name: 'templateContent',
          placeholder: `${sldComLanguage('请输入模板内容')}`,
          initialValue: '',
          rules: [{
            required: true,
            whitespace: true,
            message: `${sldComLanguage('请输入模板内容')}`,
          }, ],
        },

      ],//微信modal框的数据
      formValues: {},//搜索条件、
      columns: [
        {
          title: ' ',
          dataIndex: 'tplCode',
          align: 'center',
          width: 30,
          render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
        },
        {
          title: `${sldComLanguage('模板描述')}`,
          dataIndex: 'tplName',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('站内信')}`,
          dataIndex: 'msgSwitch',
          align: 'center',
          width: 100,
          render: (text, record) => (
            <Switch
              onChange={(checked) => this.operateMsg({
                tplCode: record.tplCode,
                msgSwitch: checked ? 1 : 0,
              }, 'switch')}
              checked={text == 1 ? true : false}
              valuepropname={'checked'}/>
          ),
        },
        {
          title: `${sldComLanguage('邮件')}`,
          dataIndex: 'emailSwitch',
          align: 'center',
          width: 100,
          render: (text, record) => (
            <Switch
              onChange={(checked) => this.operateMsg({
                tplCode: record.tplCode,
                emailSwitch: checked ? 1 : 0,
              }, 'switch')}
              checked={text == 1 ? true : false}
              valuepropname={'checked'}/>
          ),
        }, {
          title: `${sldComLanguage('短信')}`,
          dataIndex: 'smsSwitch',
          align: 'center',
          width: 100,
          render: (text, record) => (
            <Switch
              onChange={(checked) => this.operateMsg({
                tplCode: record.tplCode,
                smsSwitch: checked ? 1 : 0,
              }, 'switch')}
              checked={text == 1 ? true : false}
              valuepropname={'checked'}/>
          ),
        },{
          title: `${sldComLanguage('微信')}`,
          dataIndex: 'wxSwitch',
          align: 'center',
          width: 100,
          render: (text, record) => (
            <Switch
              onChange={(checked) => this.operateMsg({
                tplCode: record.tplCode,
                wxSwitch: checked ? 1 : 0,
              }, 'switch')}
              checked={text == 1 ? true : false}
              valuepropname={'checked'}/>
          ),
        },
        {
          title: `${sldComLanguage('操作')}`,
          width: 100,
          align: 'center',
          render: (text, record) => (
            <Fragment>
              {sldtbaleOpeBtnText(`${sldComLanguage('站内信')}`, () => this.editMsg(record, 'msg'))}
              <span className={global.splitLine}></span>
              {sldtbaleOpeBtnText(`${sldComLanguage('邮件')}`, () => this.editMsg(record, 'email'))}
              <span className={global.splitLine}></span>
              {sldtbaleOpeBtnText(`${sldComLanguage('短信')}`, () => this.editMsg(record, 'sms'))}
              <span className={global.splitLine}></span>
              {sldtbaleOpeBtnText(`${sldComLanguage('微信')}`, () => this.editMsg(record, 'wx'))}
            </Fragment>
          ),
        },
      ],
    };
  }

  cur_edit_id = '';//当前操作数据id
  email_content = '';//邮件内容
  componentDidMount() {
    this.get_list({ pageSize: pageSize });
  }

  //编辑消息模板 val: 单条数据  type: 编辑类型
  editMsg = (val, type) => {
    let { operateData, modal_width } = this.state;
    operateData = getSldCopyData(this.state[type + 'Data']);
    modal_width = 600;
    let tmp_data = {};
    if (type == 'msg') {
      //站内信
      for (let i in operateData) {
        operateData[i].initialValue = val[operateData[i].name];
      }
    } else if (type == 'email') {
      //邮件
      modal_width = 900;
      tmp_data = JSON.parse(val.emailContent.replace(/&quot;/g,"\""));
      val = { ...val, ...tmp_data };
      for (let i in operateData) {
        operateData[i].initialValue = val[operateData[i].name];
      }
    } else if (type == 'sms') {
      //短信
      tmp_data = {};
      if(val.smsContent){
        tmp_data = JSON.parse(val.smsContent.replace(/&quot;/g,"\""));
      }else{
        tmp_data = {templateId:'',templateContent:''};
      }
      val = { ...val, ...tmp_data };
      for (let i in operateData) {
        operateData[i].initialValue = val[operateData[i].name];
      }
    } else if (type == 'wx') {
      //微信
      tmp_data = {};
      if(val.wxContent){
        tmp_data = JSON.parse(val.wxContent.replace(/&quot;/g,"\""));
      }else{
        tmp_data = {templateId:'',templateContent:''};
      }
      val = { ...val, ...tmp_data };
      for (let i in operateData) {
        operateData[i].initialValue = val[operateData[i].name];
      }
    }
    this.cur_edit_id = val.tplCode;//当前操作数据的唯一值
    this.setState({
      type: type,
      title: `${sldComLanguage('编辑消息模板')}`,
      operateData,
      modalVisible: true,
      modal_width,
    });//编辑消息模板
  };

  //消息模板操作  edit：编辑 switch：开关切换
  operateMsg = (id, type) => {
    const { params } = this.state;
    const { dispatch } = this.props;
    let dis_type = '';
    let param_data = {};
    if (type == 'switch') {
      dis_type = 'sldsetting/update_member_msg_tpl';
      param_data = id;
    } else if (type == 'edit') {
      dis_type = 'sldsetting/update_member_msg_tpl';
      param_data = id;
    }
    this.setState({ submiting: true });
    dispatch({
      type: dis_type,
      payload: param_data,
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
          this.get_list(params);
          this.setState({ modalVisible: false });
        } else {
          failTip(res.msg);
        }
        this.setState({ submiting: false });
      },
    });
  };

  //获取数据列表
  get_list = () => {
    this.setState({ initLoading: true });
    const { dispatch, tpl } = this.props;
    let { data } = this.state;
    let type = '';
    dispatch({
      type: 'sldsetting/get_member_msg_tpl_lists',
      callback: (res) => {
        this.setState({ initLoading: false });
        if (res.state == 200) {
          data.list = res.data;
          this.setState({ data });
        }
      },
    });
  };

  handleSelectRows = (rows, rowkeys) => {
    this.setState({
      selectedRows: rows,
      selectedRowKeys: rowkeys,
    });
  };

  handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
    const { formValues } = this.state;
    if (type == 'main') {
      const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
      pageSize = params.pageSize;
      this.setState({ params });
      this.get_list(params);
    }
  };


  //表格拖动
  resizeTable = (index, size, type, data) => {
    let datas = dragSldTableColumn(index, size, data);
    this.setState({ [type]: datas });
  };

  sldHandleCancle = () => {
    this.setState({ modalVisible: false });
  };

  sldHandleConfirm = (val) => {
    const { type } = this.state;
    let tmp_data = {};
    val.tplCode = this.cur_edit_id;
    if (type == 'msg') {
      val.msgSwitch = val.msgSwitch ? 1 : 0;
    } else if (type == 'sms') {
      val.smsSwitch = val.smsSwitch ? 1 : 0;
      tmp_data.templateId = val.templateId;
      tmp_data.templateContent = val.templateContent;
      delete val.templateId;
      delete val.templateContent;
      val.smsContent = JSON.stringify(tmp_data);
    } else if (type == 'email') {
      val.emailSwitch = val.emailSwitch ? 1 : 0;
      tmp_data.email_subject = val.email_subject;
      tmp_data.email_content = this.email_content;
      delete val.email_subject;
      val.emailContent = JSON.stringify(tmp_data);
    } else if (type == 'wx') {
      val.wxSwitch = val.wxSwitch ? 1 : 0;
      tmp_data.templateId = val.templateId;
      tmp_data.templateContent = val.templateContent;
      delete val.templateId;
      delete val.templateContent;
      val.wxContent = JSON.stringify(tmp_data);
    }
    this.operateMsg(val, 'edit');
  };

  //slodon_获取富文本返回的内容
  handleGetContent = (value) => {
    let { operateData } = this.state;
    let tmp_data = operateData.filter(item => item.name == 'email_content')[0];
    tmp_data.initialValue = value;
    this.email_content = value;
    this.setState({ operateData });
  };

  render() {
    const { selectedRows, columns, initLoading, data, submiting, operateData, modalVisible, title, modal_width } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1, paddingTop: 0 }}>
        <Spin spinning={initLoading}>
          {/*标准表格-start*/}
          <StandardTable
            selectedRows={selectedRows}
            data={data}
            rowKey={'tplCode'}
            isCheck={false}
            sldpagination={false}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
            onSldHandleSeleRow={this.onSldHandleSeleRow}
            resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
            isColumnResize={true}
          />
          {/*标准表格-end*/}

        </Spin>
        {/*新增/编辑对话框-start*/}
        <SldModal
          title={title}
          submiting={submiting}
          width={modal_width}
          modalVisible={modalVisible}
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
