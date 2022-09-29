import React, { Component, Fragment } from 'react';
import { Form, Select, Icon, Radio, Col, Button, Input, InputNumber, DatePicker, TreeSelect } from 'antd';
import global from '@/global.less';
import { sldInputAfterAddons,sldComLanguage } from '@/utils/utils';

const FormItem = Form.Item;
const { RangePicker, MonthPicker } = DatePicker;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;


@Form.create()
export default class Search extends Component {
	state = {
		expandForm: false,
		yearpicker_isopen: false,//年份选择器的面板
	};

	componentDidMount() {

	}

	componentWillReceiveProps(nextProps, nextContext) {
		if (nextProps.isReset != undefined && nextProps.isReset) {
			this.props.form.resetFields();
		}
	}

	redioOnChange = (e, val) => {
		if (val.onChange) {
			val.onChange(e.target.value);
		}
	};

	commonCon = (val, index) => {
		const {
			form: { getFieldDecorator },
		} = this.props;
		const { yearpicker_isopen } = this.state;
		//普通输入框
		if (val.type == 'input') {
			return (
				<FormItem
					key={index}
					style={{ width: 230 }}
					label={val.label}>
					{getFieldDecorator(val.name)(<Input maxLength={250} style={{ width: 150 }} placeholder={val.placeholder}/>)}
				</FormItem>

			);
		} else if (val.type == 'inputnum') {
			//数字搜索框
			return (
				<FormItem
					key={index}
					style={{ width: 230 }}
					label={val.label}>
					{getFieldDecorator(val.name)(<InputNumber style={{ width: 150 }} placeholder={val.placeholder}/>)}
				</FormItem>
			);

		} else if (val.type == 'select') {
			//下拉选择框
			return (
				<FormItem
					key={index}
					style={{ width: 230 }}
					label={val.label}>
					{getFieldDecorator(val.name)(
						<Select placeholder={val.placeholder}
                    style={{ width: 150 }}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
            >
							{val.sel_data!=null&&val.sel_data.map((items, indexs) => {
								return <Option key={indexs}
											   value={val.diy != undefined && val.diy ? items[val.sele_key] : items.key}>{val.diy != undefined && val.diy ? items[val.sele_name] : items.name}</Option>;
							})}
						</Select>,
					)}
				</FormItem>
			);

		} else if (val.type == 'radio') {
			//radio
			return (<FormItem
					key={index}
					style={{ width: 230 }}
					extra={val.extra}
					label={val.label}
					style={{ width: val.width != undefined ? val.width + 80 : '100%' }}
				>
					{getFieldDecorator(val.name, {
						valuePropName: 'checked',
						rules: val.rules,
						initialValue: val.initialValue,
					})(
						<RadioGroup size={'small'} value={val.initialValue}
									style={{ width: val.width != undefined ? val.width : '100%' }}
									onChange={(e) => this.redioOnChange(e, val)}>
							{val.sel_data.map((item, index) => {
								return <Radio key={index} value={item.key}>{item.name}</Radio>;
							})}
						</RadioGroup>,
					)}
				</FormItem>
			);
		} else if (val.type == 'monthpicker') {
			//月份选择器
			return (<FormItem
					key={index}
					help={val.help}
					placeholder={val.placeholder}
					extra={val.extra}
					label={val.label}
				>
					{getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(
						<MonthPicker placeholder={val.placeholder}
                         style={{ width: 150 }}
                         getCalendarContainer={(triggerNode)=>{
                           return triggerNode.parentNode
                         }}
            />,
					)}
				</FormItem>
			);
		} else if (val.type == 'yearpicker') {
			//年份选择器
			return (<FormItem
					key={index}
					help={val.help}
					style={{ width: 230 }}
					placeholder={val.placeholder}
					extra={val.extra}
					label={val.label}
				>
					{getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(
						<DatePicker
              open={yearpicker_isopen} mode="year" format="YYYY"
              onFocus={() => {
							  this.setState({ yearpicker_isopen: true });
						  }}
              onBlur={() => {
                this.setState({ yearpicker_isopen: false });
              }}
              onPanelChange={(v) => {
                val.hanleYear(v);
                this.setState({
                  yearpicker_isopen: false,
                });
              }}
              getCalendarContainer={(triggerNode)=>{
                return triggerNode.parentNode
              }}
            />,
					)}
				</FormItem>
			);
		} else if (val.type == 'rangepicker') {
			//时间选择器
			return (
				<FormItem
					key={index}
					style={{ width: 290 }}
					label={val.label}>
					{getFieldDecorator(val.name)(
						<RangePicker
							showTime={val.show_time!=undefined?val.show_time:false}
							style={{ width: 220 }}
							placeholder={[val.placeholder1, val.placeholder2,
							]}
              getCalendarContainer={(triggerNode)=>{
                return triggerNode.parentNode
              }}
						/>,
					)}
				</FormItem>
			);

		} else if (val.type == 'datepicker') {
			//时间选择器
			return (
				<FormItem
					key={index}
					help={val.help}
					style={{ width: 250 }}
					placeholder={val.placeholder}
					extra={val.extra}
					label={val.label}
				>
					{getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(
						<DatePicker
							showTime={val.show_time!=undefined?val.show_time:false}
							placeholder={val.placeholder} style={{ width: 150 }}
              getCalendarContainer={(triggerNode)=>{
                return triggerNode.parentNode
              }}
            />,
					)}
				</FormItem>
			);
		} else if (val.type == 'rangeval') {
			//范围选择器
			return (
				<FormItem
					key={index}
					label={val.label}>
					<InputGroup compact style={{ width: 150 }}>
						{getFieldDecorator([val.name1])(<Input maxLength={250} style={{ width: '40%', textAlign: 'center' }}
															   placeholder={val.placeholder1}/>)}

						<Input style={{ width: '20%', borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }}
							   placeholder="~" disabled/>
						{getFieldDecorator([val.name2])(<Input
              maxLength={250}
							style={{ width: '40%', textAlign: 'center', borderLeft: 0 }}
							placeholder={val.placeholder2}/>)}
					</InputGroup>
				</FormItem>
			);

		} else if (val.type == 'rangeval_select') {
			//范围选择+select
			return (
				<FormItem
					key={index}
				>
					<InputGroup compact style={{ flex: 1, flexDirection: 'row' }}>
						{getFieldDecorator(val.select.name, { initialValue: val.select.initialValue?val.select.initialValue:undefined })(<Select
							style={{ width: '36%' }}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
							{val.select.sel_data.map((items, indexs) => {
								return <Option key={indexs} value={items.key}>{items.name}</Option>;
							})}
						</Select>)}
						{getFieldDecorator(val.name1)(<Input maxLength={250} key={'first' + index}
															 style={{ width: '26%', textAlign: 'center' }}
															 placeholder={val.placeholder1}/>)}
						<Input key={'center' + index}
							   style={{ width: '12%', borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }}
							   placeholder="~" disabled/>
						{getFieldDecorator(val.name2)(<Input maxLength={250} key={'end' + index} style={{
							width: '26%',
							textAlign: 'center',
							borderLeft: 0,
						}} placeholder={val.placeholder2}/>)}

					</InputGroup>
				</FormItem>
			);

		} else if (val.type == 'type_select_input') {
			//范围选择+select
			return (
				val.width == undefined ?
					<FormItem
						style={{ width: 290, paddingLeft: 10 }}
						key={index}
					>
						<InputGroup compact style={{ flex: 1, flexDirection: 'row' }}>
							{getFieldDecorator(val.select.name, { initialValue: val.select.initialValue?val.select.initialValue:undefined })(<Select
								style={{ width: 120 }}
                getPopupContainer={triggerNode => triggerNode.parentNode}
              >
								{val.select.sel_data.map((items, indexs) => {
									return <Option key={indexs} value={items.key}>{items.name}</Option>;
								})}
							</Select>)}
							{getFieldDecorator(val.name)(<Input maxLength={250} key={index} style={{ width: 160 }}
																placeholder={val.placeholder}/>)}
						</InputGroup>
					</FormItem>
					:
					<InputGroup key={index} compact style={{ width: val.width, flexDirection: 'row', marginLeft: 24 }}>
						{getFieldDecorator(val.select.name, { initialValue: val.select.initialValue?val.select.initialValue:undefined })(<Select
							style={{ width: 120 }}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
							{val.select.sel_data.map((items, indexs) => {
								return <Option key={indexs} value={items.key}>{items.name}</Option>;
							})}
						</Select>)}
						{getFieldDecorator(val.name)(<Input maxLength={250} key={index} style={{ width: 160 }}
															placeholder={val.placeholder}/>)}
					</InputGroup>
			);

		} else if (val.type == 'input_after') {
			//带图标后缀
			return (
				<FormItem
					key={index}
					label={val.label}
				>
					{getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(
						<div onClick={() => val.callback(val.operate_obj)}>
						<Input style={{ width: 150 }} disabled={true} addonAfter={sldInputAfterAddons()} placeholder={val.placeholder}/>
						</div>
					)}
				</FormItem>
			);
		} else if (val.type == 'tree_select_single') {
			//三级分类选择
			return (
				<FormItem
					key={index}
					label={val.label}
          style={{ width: 230 }}
				>
					{getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(
            <TreeSelect treeData={val.data} onChange={null}
                        style={{ width: 150 }}
                        showCheckedStrategy={'SHOW_PARENT'} placeholder={val.placeholder}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                        dropdownStyle={{ maxHeight: 300 }}
            />
					)}
				</FormItem>
			);
		} else if (val.type == 'TreeSelectAll') {
			return <Col key={index} md={8} sm={24} xl={7} xxl={5} lg={7}>
				<FormItem label={val.label}>
					{val.initialValue && getFieldDecorator(val.name, {
						initialValue: val.initialValue,
						rules: val.rules,
					})(
						<TreeSelect
							style={{ width: '100%' }}
							showSearch={true}
							placeholder={val.placeholder}
							allowClear={val.allowClear}
							onSelect={val.onSelect}
              dropdownStyle={{maxHeight:300}}
              getPopupContainer={triggerNode => triggerNode.parentNode}
						>
							{val.data.map((val, key) => {
								return <TreeNode value={val.sellerName} title={val.sellerName} key={val.id}></TreeNode>;
							})}
						</TreeSelect>,
					)}
					{val.initialValue == '' && getFieldDecorator(val.name, { rules: val.rules })(
						<TreeSelect
							style={{ width: '100%' }}
							showSearch={true}
							placeholder={val.placeholder}
							allowClear={val.allowClear}
							onSelect={val.onSelect}
              dropdownStyle={{maxHeight:300}}
              getPopupContainer={triggerNode => triggerNode.parentNode}
						>
							{val.data.map((val, key) => {
								return <TreeNode value={val.sellerName} title={val.sellerName} key={val.id}></TreeNode>;
							})}
						</TreeSelect>,
					)}
				</FormItem>
			</Col>;
		}
	};

	//搜索重置事件
	handleFormReset = () => {
		const { form } = this.props;
		form.resetFields();
		this.props.seaReset();
	};

	//搜索事件
	handleSearch = e => {
		e.preventDefault();
		const { form } = this.props;

		form.validateFieldsAndScroll((err, fieldsValue) => {
			if (err) return;
			this.props.seaSubmit(fieldsValue);
		});
	};

	//搜索条件-默认前两条数据
	renderSearchFiist = (search_data) => {
		return search_data.map((item, index) => {
			return index < 4 ? this.commonCon(item, index) : null;
		});
	};

	//搜索条件-默认前两条之后数据
	renderSearchSecond = (search_data) => {
		return search_data.map((item, index) => {
			return index > 3 ? this.commonCon(item, index) : null;
		});
	};


	renderSimpleForm() {
		const { search_data, top } = this.props;
		const { expandForm } = this.state;

		return (
			search_data.length > 0 && <Form onSubmit={this.handleSearch} ref={'sld_common_search_part'} layout="inline">

				{this.renderSearchFiist(search_data)}
				{expandForm && (
					<Fragment>
						{this.renderSearchSecond(search_data)}
					</Fragment>
				)}
				<span style={{ position: 'absolute', right: search_data.length > 4?20:0, top: top != undefined ? top : 0 }}>
              <Button type="primary" htmlType="submit">
                {sldComLanguage('搜索')}
              </Button>
              <Button style={{ marginLeft: 3, marginBottom: 10 }} onClick={this.handleFormReset}>
                {sldComLanguage('重置')}
              </Button>
					{search_data.length > 4 && <a style={{ marginLeft: 3, fontSize: 12,color:'#FF6A12' }} onClick={this.toggleForm}>
						{expandForm ? `${sldComLanguage('收起')}` : `${sldComLanguage('展开')}`} <Icon type={expandForm ? 'up' : 'down'}/>
					</a>}
            </span>
			</Form>
		);
	}


	toggleForm = () => {
		const { expandForm } = this.state;
		this.setState({
			expandForm: !expandForm,
		},()=>{
      if(this.props.moreSearchToggle)this.props.moreSearchToggle()
    });
	};

	render() {
		return this.renderSimpleForm();
	}
}

