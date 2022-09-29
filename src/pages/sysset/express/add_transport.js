import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, Button,  } from 'antd';
import {
	sldLlineRtextAddGoodsAddMargin,
	failTip,
	sucTip,
	getSldEmptyH,
  sldComLanguage,
} from '@/utils/utils';
import router from 'umi/router';
import global from '@/global.less';
import SldEditFormCom from '@/components/SldEditFormCom/SldEditFormCom';
import SldExpressCom from '@/components/SldExpressCom/SldExpressCom';

let sthis = '';
@connect(({ sldsetting }) => ({
  sldsetting,
}))
@Form.create()
export default class AddTransport extends Component {

	constructor(props) {
		super(props);
		sthis = this;
		const {
			form: { getFieldDecorator },
		} = props;
		this.state = {
      show_flag: props.location.query!=undefined&&props.location.query.id!=undefined?false:true,//是否展示内容
			express_info: [{
					type: 'transExpress',
					title: `${sldComLanguage('快递设置')}`,
					is_show: true,
					data_table: [],
					base_info: {},//基础运费信息
				},
			],//物流配送方式和地址信息
			transMail_show: false,
			transEms_show: false,
			transExpress_show: false,
			scrollY: 0,//顶部表格滚动的距离
			baseInfoHeight: 0,//顶部基本信息的高度
			query: props.location.query,
			selectedRows: [],
			selectedRowKeys: [],//selectedRows的key
			modalVisible: false,
			title: '',
			search_data: [{
				type: 'input',
				label: `${sldComLanguage('模板名称')}`,
				name: 'templateName',
				placeholder: `${sldComLanguage('请输入模板名称')}`,
				initialValue: '',
				rules: [{
					required: true,
          whitespace: true,
					message: `${sldComLanguage('请输入模板名称')}`,
				}],
			}, {
				type: 'radio',
				label: `${sldComLanguage('是否包邮')}`,
				name: 'isFree',
				placeholder: ``,
				sel_data: [
					{ name: `${sldComLanguage('是')}`, key: 1 },
					{ name: `${sldComLanguage('否')}`, key: 0 },
				],
				initialValue: 1,
			}, {
				type: 'radio',
				label: `${sldComLanguage('计价方式')}`,
				name: 'chargeType',
        width: 270,
				placeholder: `${sldComLanguage('请选择计价方式')}`,
				sel_data: [
					{ name: `${sldComLanguage('按件')}`, key: 1 },
					{ name: `${sldComLanguage('按重量')}`, key: 2 },
					{ name: `${sldComLanguage('按体积')}`, key: 3 },
				],
				initialValue: 1,
			},  ],
		};
	}

	index = 2;//检索属性的序号

	componentDidMount() {
		this.resize();
		window.addEventListener('resize', this.resize);
		const { query } = this.state;
		if (query.id > 0) {
			this.getDetail();
		}
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.resize);
	}

	//组装物流的信息
	getDetail = () => {
		let { search_data, express_info,query } = this.state;
    this.props.dispatch({
      type: 'sldsetting/get_transport_detail',
      payload: {freightTemplateId:query.id},
      callback: (res) => {
        if (res.state == 200) {
          //渲染基本信息
          let data = res.data;
          for (let i in search_data) {
            if(search_data[i].name == 'isFree'){
              search_data[i].initialValue = data[search_data[i].name]*1;
            }else{
              search_data[i].initialValue = data[search_data[i].name];
            }
          }
          let tmp_info = data.freightExtendList;
          let s = 0;
          for(let j in express_info){
            for(let j_detail in tmp_info) {
              if (tmp_info[j_detail].cityCode == 'CN') {
                express_info[j].base_info['trans_com_fee' + express_info[j].type] = tmp_info[j_detail].basePrice;
                express_info[j].base_info['trans_com_weight' + express_info[j].type] = tmp_info[j_detail].baseNumber;
                express_info[j].base_info['trans_com_add_weight' + express_info[j].type] = tmp_info[j_detail].addNumber;
                express_info[j].base_info['trans_com_add_fee' + express_info[j].type] = tmp_info[j_detail].addPrice;
                express_info[j].base_info['freightExtendId' + express_info[j].type] = tmp_info[j_detail].freightExtendId;
              } else {
                express_info[j].data_table.push({
                  key: s,
                  deliver_areas: tmp_info[j_detail].cityName,
                  trans_weight: tmp_info[j_detail].baseNumber,
                  trans_fee: tmp_info[j_detail].basePrice,
                  trans_add_weight: tmp_info[j_detail].addNumber,
                  trans_add_fee: tmp_info[j_detail].addPrice,
                  sele_area_id_array: tmp_info[j_detail].cityCode.split(','),
                  freightExtendId: tmp_info[j_detail].freightExtendId,
                });
                s++;
              }
            }
          }
          this.setState({
            search_data,
            express_info,
            show_flag: true,
          })
        } else {
          failTip(res.msg);
        }
      },
    });
	};

	resize() {
		let scrollY = 0;
		let screentW = document.body.clientWidth;
		let screentH = document.body.clientHeight;
		//73为底部高度，50为顶部高度
		if (screentW > 1600) {
			scrollY = screentH - 73 - 50 - 370;
		} else if (screentW > 1200) {
			scrollY = screentH - 73 - 50 - 400;
		}
		sthis.setState({
			scrollY: scrollY,
		});
	}

	handleSelectRows = (rows, rowkeys) => {
		this.setState({
			selectedRows: rows,
			selectedRowKeys: rowkeys,
		});
	};

	//将输入的内容置空
	sldResetInputData = () => {
		let { search_data, express_info } = this.state;
		this.props.form.resetFields();
		for (let i in search_data) {
			if (search_data[i].name == 'transType') {
				search_data[i].initialValue = '1';
			} else if (search_data[i].name == 'logisticsNumber') {
				search_data[i].initialValue = [];
			}
		}
		for (let i in express_info) {
			express_info[i].data_table = [];
			express_info[i].base_info = {};
			express_info[i].is_show = false;
		}
		this.setState({
			search_data, express_info,
		});
	};

	//返回上个页面
	backPre = () => {
		const { query } = this.state;
		router.replace(query.source);
	};

	//保存并新增事件
	handleSaveAllData = (e, type) => {
		e.preventDefault();
		let { express_info } = this.state;
		this.props.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					let params = {};
					//保存数据
					const { dispatch } = this.props;
					const { query } = this.state;
					params.templateName = values.templateName;
					params.isFree = values.isFree;
					params.chargeType = values.chargeType;
					//运费信息
					for (let i in express_info) {
							let tmp_data = [];
							//基础运费
							let trans_add_fee = values['trans_com_add_fee' + express_info[i].type];//续费
							let trans_fee = values['trans_com_fee' + express_info[i].type];//首费
							let trans_add_weight = values['trans_com_add_weight' + express_info[i].type];//续重
							let trans_weight = values['trans_com_weight' + express_info[i].type];//首重
              let tmp_base_info = {
                cityCode: 'CN',
                cityName: `${sldComLanguage('全国')}`,
                baseNumber: trans_weight,
                basePrice: trans_fee,
                addNumber: trans_add_weight,
                addPrice: trans_add_fee,
              };
              if(query.id != undefined){
                tmp_base_info.freightExtendId = express_info[i]['base_info']['freightExtendId' + express_info[i].type];;
              }
							tmp_data.push(tmp_base_info);
							//针对特定地区的运费
							for (let j in express_info[i].data_table) {
							  let tmp_fri_info = {};
								let area_tmp_data = express_info[i].data_table[j];
								let city_id_str = area_tmp_data.sele_area_id_array.join(',');
								let city_name_str = area_tmp_data.deliver_areas;
                tmp_fri_info = {
                  cityCode: city_id_str,
                  cityName: city_name_str,
                  baseNumber: area_tmp_data.trans_weight,
                  basePrice: area_tmp_data.trans_fee,
                  addNumber: area_tmp_data.trans_add_weight,
                  addPrice: area_tmp_data.trans_add_fee,
                };
                if(query.id != undefined){
                  tmp_fri_info.freightExtendId = area_tmp_data.freightExtendId;
                }
								tmp_data.push({...tmp_fri_info});
							}
							params['freightExtendList'] = JSON.stringify(tmp_data);
					}
					//如果有id，则编辑该条数据信息
					if (query.id != undefined && query.id > 0) {
						params.freightTemplateId = query.id;
						//编辑物流
						dispatch({
							type: 'sldsetting/edit_transport',
							payload: params,
							callback: (res) => {
								if (res.state == 200) {
									sucTip(res.msg);
									this.operate_complete(type);
								} else {
									failTip(res.msg);
								}
							},
						});
					} else {
						//新增物流
						dispatch({
							type: 'sldsetting/add_transport',
							payload: params,
							callback: (res) => {
								if (res.state == 200) {
									sucTip(res.msg);
									this.operate_complete(type);
								} else {
									failTip(res.msg);
								}
							},
						});
					}
				}
			},
		);
	};

	operate_complete = (type) => {
		const { query } = this.state;
		if (type == 'back') {
			//返回上一级
			router.replace(query.source);
		} else if (type == 'add') {
			//清空数据
			this.sldResetInputData();
		}
	};

	save_sele_area = (val, type) => {
		let { express_info } = this.state;
		for (let i in express_info) {
			if (express_info[i].type == type) {
				express_info[i].data_table = val;
			}
		}
		this.setState({
			express_info,
		});
	};

	render() {
		const { search_data, query, express_info,show_flag } = this.state;
		return (
			<div className={`${global.common_page_20} ${global.com_flex_column}`}>
        <Scrollbars
          autoHeight
          autoHeightMin={100}
          autoHeightMax={document.body.clientHeight-170}>
					{sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('基本信息')}`, 0, 0, 10)}
					<div className={`${global.tableListFormAdd}`} style={{paddingRight:10}}>
						<Form onSubmit={(e) => this.handleSaveAllData(e, 'add')} layout="inline">
              {show_flag&&<SldEditFormCom form={this.props.form} search_data={search_data}/>}
              {getSldEmptyH(10)}
							{show_flag&&express_info.map((item, index) => {
								return item.is_show ?
									<SldExpressCom key={index} base_info={item.base_info}
									               data_table={item.data_table}
									               save_sele_area={(val) => this.save_sele_area(val, item.type)}
									               form={this.props.form} edit_flag={query.id == undefined ? 0 : 1}
									               type={item.type}/> : null;
							})}
							<div className={global.common_bottom_wrap} >
								<Button size={'large'} onClick={() => this.backPre()} style={{ marginRight: 20 }}>
                  {sldComLanguage('返回')}
								</Button>
								{!(query.id != 'undefined' && query.id > 0) && (
									<Button size={'large'} htmlType="submit" style={{ marginRight: 20 }}>
                    {sldComLanguage('保存并新增')}
									</Button>
								)}
								<Button size={'large'} type="primary" style={{ marginRight: 20 }}
								        onClick={(e) => this.handleSaveAllData(e, 'back')}>
                  {sldComLanguage('保存并返回')}
								</Button>
							</div>
						</Form>
					</div>
        </Scrollbars>
			</div>
		);
	}
}
