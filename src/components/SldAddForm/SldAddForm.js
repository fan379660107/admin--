import React, {Component, Fragment} from 'react';
import {
	Form,
	Select,
	Input,
	InputNumber,
	Checkbox,
	Switch,
	Cascader,
	TreeSelect,
} from 'antd';
import global from '../../global.less';
import {
	sldSearch,
	sldComLanguage,
} from '@/utils/utils';
import {TwitterPicker} from 'react-color';
import EditableTable from '../SldEditTable/index';

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const {TextArea} = Input;

@Form.create()
export default class SldAddForm extends Component{
	constructor(props){
		super(props);
		this.state = {
			showColorPicker: false,//是否展示颜色选择器
			rowId: '',//选中行的id
			selectedRowKeys: [],
		}
	}

	componentDidMount(){

	}


	//颜色选择器展示事件
	showColorPicker = () =>{
		this.setState({
			showColorPicker: !this.state.showColorPicker
		});
	}

	//选择颜色事件
	sldHandleColor = (color) =>{
		if(this.props.setColorPicker){
			this.props.setColorPicker(color.hex);
		}
	}

	//确定事件
	sldConfirm = (e) =>{
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) =>{
			if(!err){
				this.props.sldHandleConfirm(values);
			}
		});
	}

	//取消事件-清空表单
	sldCancle = () =>{
		this.props.form.resetFields();
		this.props.sldHandleCancle();
	}

	//下拉选择事件变动
	sldHandSeleChange = (items, value) =>{
		if(items.sldChange){
			items.sldChange(value);
		}
	}
	//多选事件
	sldCheckShop = (items, value) =>{
		if(items.sldCheckShop){
			items.sldCheckShop(value);
		}
	}

	handleTableChange = (pagination, filters, sorter, items) =>{
		if(items){
			items.onChange(pagination, filters, sorter);
		}
	};

	//表格单行点击事件
	sldHandleRow = (record, index, items, rowKey) =>{
		items(record);
		if(rowKey == 'unit_id'){
			this.setState({
				rowId: record.unit_id
			});
		}else if(rowKey == 'mark_id'){
			this.setState({
				rowId: record.mark_id
			});
		}else if(rowKey == 'supplier_id'){
			this.setState({
				rowId: record.supplier_id
			});
		}else if(rowKey == 'brand_id'){
			this.setState({
				rowId: record.brand_id
			});
		}else if(rowKey == 'tag_id'){
			this.setState({
				rowId: record.tag_id
			});
		}else if(rowKey == 'shop_id'){
			this.setState({
				rowId: record.shop_id
			});
		}else if(rowKey == 'level_id'){
			this.setState({
				rowId: record.level_id
			});
		}else if(rowKey == 'warehouse_id'){
			this.setState({
				rowId: record.warehouse_id
			});
		}else if(rowKey == 'po_id'){
			this.setState({
				rowId: record.po_id
			});
		}else if(rowKey == 'type_id'){
			this.setState({
				rowId: record.type_id
			});
		}
	}

	//设置选中行的背景色
	setRowClassName = (rowKey, record) =>{
		let cur_id = '';
		if(rowKey == 'unit_id'){
			cur_id = record.unit_id;
		}else if(rowKey == 'spec_id'){
			cur_id = record.spec_id;
		}else if(rowKey == 'supplier_id'){
			cur_id = record.supplier_id;
		}else if(rowKey == 'brand_id'){
			cur_id = record.brand_id;
		}else if(rowKey == 'mark_id'){
			cur_id = record.mark_id;
		}else if(rowKey == 'tag_id'){
			cur_id = record.tag_id;
		}else if(rowKey == 'shop_id'){
			cur_id = record.shop_id;
		}else if(rowKey == 'level_id'){
			cur_id = record.level_id;
		}else if(rowKey == 'warehouse_id'){
			cur_id = record.warehouse_id;
		}else if(rowKey == 'po_id'){
			cur_id = record.po_id;
		}else if(rowKey == 'type_id'){
			cur_id = record.type_id;
		}
		return cur_id === this.state.rowId ? 'seleSingle' : '';
	}


	//获取每个item的内容
	getItem = (items, index) =>{
		const {getFieldDecorator} = this.props.form;
		const {formItemLayoutModal} = this.props;
		const {showColorPicker} = this.state;
		if(items.type == 'input'){
			return <FormItem
				key={index}
				{...formItemLayoutModal}
				label={items.label}
				help={items.help}
        extra={items.extra}
			>
				{typeof (items.input_type) != 'undefined' && items.input_type == 'password' && (typeof (items.disable) == 'undefined' || (typeof (items.disable) != 'undefined' && !items.disable)) && getFieldDecorator(items.name, {
					initialValue: items.initialValue,
					rules: items.rules
				})(
					<Input maxLength={250} type={'password'} placeholder={items.placeholder}/>
				)}
				{typeof (items.input_type) != 'undefined' && items.input_type == 'password' && typeof (items.disable) != 'undefined' && items.disable && getFieldDecorator(items.name, {
					initialValue: items.initialValue,
					rules: items.rules
				})(
					<Input maxLength={250} type={'password'} disabled={true} placeholder={items.placeholder}/>
				)}

				{typeof (items.input_type) == 'undefined' && (typeof (items.disable) == 'undefined' || (typeof (items.disable) != 'undefined' && !items.disable)) && getFieldDecorator(items.name, {
					initialValue: items.initialValue,
					rules: items.rules
				})(
					<Input maxLength={250} placeholder={items.placeholder}/>
				)}

				{typeof (items.input_type) == 'undefined' && typeof (items.disable) != 'undefined' && items.disable && getFieldDecorator(items.name, {
					initialValue: items.initialValue,
					rules: items.rules
				})(
					<Input disabled={true} placeholder={items.placeholder}/>
				)}

			</FormItem>;
		}else if(items.type == 'textarea'){
			return <FormItem
				key={index}
				{...formItemLayoutModal}
				label={items.label}
				help={items.help}
        extra={items.extra}
			>
				{getFieldDecorator(items.name, {initialValue: items.initialValue, rules: items.rules})(
					<TextArea style={{minHeight: 32}} rows={4}/>
				)}
			</FormItem>;
		}else if(items.type == 'inputnum'){
			return <FormItem
				key={index}
				{...formItemLayoutModal}
				label={items.label}
				help={items.help}
        extra={items.extra}
			>
				{getFieldDecorator(items.name, {initialValue: items.initialValue, rules: items.rules})(
					<InputNumber max={999999999} precision={0} style={{width:'100%'}} disabled={items.disabled ? true : false} min={0}/>
				)}
			</FormItem>;
		}else if(items.type == 'color_picker'){
			return <FormItem
				key={index}
				{...formItemLayoutModal}
				label={items.label}
				help={items.help}
        extra={items.extra}
			>
				<div onClick={() => this.showColorPicker()} style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'flex-start',
					alignItems: 'center'
				}}>
					{getFieldDecorator(items.name, {initialValue: items.initialValue, rules: items.rules})(
						<Input disabled={true} style={{width: 150}} placeholder={items.placeholder}/>
					)}
					<span style={{
						width: 30,
						height: 30,
						display: 'inline-block',
						backgroundColor: items.initialValue,
						marginLeft: 10,
						borderRadius: 4
					}}></span>
				</div>
				{showColorPicker && (
					<TwitterPicker color={items.initialValue} onChange={(color) => this.sldHandleColor(color)}
					               style={{marginTop: 20}}/>
				)}
			</FormItem>;
		}else if(items.type == 'select'){
			return <FormItem
				key={index}
				{...formItemLayoutModal}
				label={items.label}
				help={items.help}
        extra={items.extra}
			>
				{getFieldDecorator(items.name, {
					initialValue: items.initialValue ? items.initialValue : (items.sel_data.length > 0 ? items.sel_data[0].key : undefined),
					rules: items.rules
				})(
					<Select placeholder={items.placeholder}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
          >
						{items.sel_data.map((itemss, indexss) =>{
							return <Option key={indexss} value={itemss.key}>{itemss.name}</Option>
						})}
					</Select>
				)}
			</FormItem>;
		}else if(items.type == 'switch'){
			return <FormItem
				key={index}
				{...formItemLayoutModal}
				label={items.label}
				help={items.help}
        extra={items.extra}
			>
				{getFieldDecorator(items.name, {
					valuePropName: 'checked',
					initialValue: items.initialValue ? items.initialValue : false,
					rules: items.rules
				})(
					<Switch/>,
				)}
			</FormItem>;
		}else if(items.type == 'edittable'){
			return <EditableTable sldAddRow={items.addRow} key={index} dataSource={items.dataSource}
			                      columns={items.columns} add_data={items.add_data} button_info={items.button_info}/>;
		}else if(items.type == 'cascader'){
			//三级地区选择器
			return (<FormItem
					key={index}
					{...formItemLayoutModal}
					label={items.label}
					help={items.help}
          extra={items.extra}
				>
					{getFieldDecorator(items.name, {initialValue: items.initialValue, rules: items.rules})(
						<Cascader options={items.sldarealist}  placeholder={items.placeholder}/>
					)}
				</FormItem>
			);

		}else if(items.type == 'checkboxgroup'){
			return <FormItem
				key={index}
				{...formItemLayoutModal}
				label={items.label}
				help={items.help}
        extra={items.extra}
			>
				{getFieldDecorator(items.name, {initialValue: items.initialValue, rules: items.rules})(
					<CheckboxGroup options={items.sldOptions} onChange={(value) => this.sldCheckShop(items, value)}/>
				)}
			</FormItem>;
		}else if(items.type == 'TreeSelect'){
			return <FormItem
				key={index}
				{...formItemLayoutModal}
				label={items.label}
				help={items.help}
        extra={items.extra}
			>
				{getFieldDecorator(items.name, {initialValue: items.initialValue, rules: items.rules})(
					<TreeSelect
						style={{width: '100%'}}
						treeData={items.data}
						showSearch={true}
						placeholder={items.placeholder}
						allowClear={items.allowClear}
						onSelect={items.onSelect}
            dropdownStyle={{maxHeight:300}}
            getPopupContainer={triggerNode => triggerNode.parentNode}
					/>
				)}
			</FormItem>;
		}else if(items.type == 'search_add_table'){
			const rowKey = items.rowKey;
			return <div key={index} style={{display: 'flex', flexDirection: 'column',}}>
				<div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
					{sldSearch(`${sldComLanguage("请输入搜索内容")', 300, items.search, true)}
					{items.add != '' &&
					sldIconBtnBg(items.add, 'jiahao-', `${sldComLanguage("新增")', '#fff', 7, 0, 18, 18, 4)
					}
				</div>
				<StandardTable
					selectedRows={items.selectedRows}
					data={items.table}
					rowKey={rowKey}
					rowClassName={(record) => this.setRowClassName(rowKey, record)}
					onRow={(record, index) =>{
						return {
							onClick: () =>{
								this.sldHandleRow(record, index, items.onSldHandleSeleRow, rowKey)
							},
						};
					}}
					isCheck={items.isCheck}
					columns={items.columns}
					onSelectRow={items.handleSelectRows}
					onChange={items.onChange}
					onSldHandleSeleRow={items.onSldHandleSeleRow}
				/>
			</div>
		}else if(items.type == 'tag_muilty_search'){
			//标签样式  多选 带搜索
			return <Select
				key={index}
				mode="multiple"
				allowClear={items.allowClear}
				style={{width: '100%'}}
				onChange={items.sldSeleChange}
				placeholder={items.placeholder}
				defaultValue={items.defaultValue}
				value={items.value}
				getPopupContainer={triggerNode => triggerNode.parentNode}
			>
				{items.data.map((itemss, indexss) =>{
					return <Option key={indexss} value={itemss.name}>{itemss.name}</Option>;
				})}
			</Select>;

		}else if(items.type == 'table'){
			return <div key={index} style={{display: 'flex', flexDirection: 'column', marginTop: 20}}>
				<StandardTable
					selectedRows={items.selectedRows}
					data={items.table}
					rowKey={items.rowKey}
					isCheck={items.isCheck}
					columns={items.columns}
					onSelectRow={items.handleSelectRows}
					sldpagination={false}
				/>

			</div>
		}else if(items.type == 'input_after'){
			//带图标后缀
			return (<FormItem
				key={index}
				{...formItemLayoutModal}
				label={items.label}
				help={items.help}
        extra={items.extra}
			>
				<div onClick={() => items.callback(items.operate_obj)}>
				{getFieldDecorator(items.name, {initialValue: items.initialValue, rules: items.rules})(
					<Input maxLength={250} addonAfter={sldInputAfterAddons()} placeholder={items.placeholder}/>
				)}
				</div>
			</FormItem>);
		}else if(items.type == 'single_checkbox'){
      //选择框
      return (
        <FormItem
          key={index}
          {...formItemLayoutModal}
          label={items.label}
          help={items.help}
          extra={items.extra}
        >
          {getFieldDecorator(items.name,{valuePropName:'checked',initialValue:items.initialValue,rules:items.rules})(
            <Checkbox
            >
              {items.check_con}
            </Checkbox>
          )}
        </FormItem>
      );
    }
	}

	//渲染主体内容
	rendeForm = (content) =>{
		return content.map((items, index) =>{
			return this.getItem(items, index);
		});
	}

	//表单提交事件
	handleSubmit = (e) =>{
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) =>{
			if(!err){
				this.props.handleSubmit(values);
			}
		});
	}

	render(){
		const {getFieldDecorator, getFieldValue} = this.props.form;
		const {title, formItemLayoutModal, modalVisible, content, submitting, handleSubmit} = this.props;
		const submitFormLayout = {
			wrapperCol: {
				xs: {span: 24, offset: 0},
				sm: {span: 10, offset: 7},
			},
		};
		return <Form
			layout="horizontal"
			onSubmit={this.handleSubmit}
      style={{width:600}}
		>
			{this.rendeForm(content)}
			<FormItem {...submitFormLayout} style={{marginTop: 32}}>
				<Button type="primary" htmlType="submit" loading={submitting} loading={submitting}>
					{sldComLanguage('保存')}
				</Button>
			</FormItem>
		</Form>;
	}
}


