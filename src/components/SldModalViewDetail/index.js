import React, { Component, Fragment } from 'react';
import {
	Form,
	Select,
	Button,
	Input,
	InputNumber,
	Modal,
	Checkbox,
	Switch,
	Cascader,
	TreeSelect,
	Radio,
} from 'antd';
import global from '../../global.less';
import {
	sldLlineRtextAddGoods,
	sldIconBtnBg,
	getSldEmptyH,
	sldSearchVal,
	sldInputAfterAddons,
	sldComLanguage,
} from '@/utils/utils';
import StandardTable from '@/components/StandardTable';
import { TwitterPicker } from 'react-color';

const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;

@Form.create()
export default class SldModalViewDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showColorPicker: false,//是否展示颜色选择器
			rowId: '',//选中行的id
			selectedRowKeys: [],
		};
	}

	componentDidMount() {

	}

	//颜色选择器展示事件
	showColorPicker = () => {
		this.setState({
			showColorPicker: !this.state.showColorPicker,
		});
	};

	//选择颜色事件
	sldHandleColor = (color) => {
		if (this.props.setColorPicker) {
			this.props.setColorPicker(color.hex);
		}
	};
	//确定事件
	sldConfirm = (e) => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				this.props.sldHandleConfirm(values);
			}
		});
	};

	//取消事件-清空表单
	sldCancle = () => {
		this.props.form.resetFields();
		this.props.sldHandleCancle();
	};

	//下拉选择事件变动
	sldHandSeleChange = (items, value) => {
		if (items.sldChange) {
			items.sldChange(value);
		}
	};

	//表格添加事件
	addTableRow = (items) => {
		if (items.addRow) {
			items.addRow();
		}
	};
	//多选事件
	sldCheckShop = (items, value) => {
		if (items.sldCheckShop) {
			items.sldCheckShop(value);
		}
	};

	handleTableChange = (pagination, filters, sorter, items) => {
		if (items) {
			items.onChange(pagination, filters, sorter);
		}
	};

	//校验两次密码是否一样
	checkConfirm = (rule, value, callback) => {
		const { form } = this.props;
		if (value && value !== form.getFieldValue('new_login_password')) {
			callback(`${sldComLanguage('两次密码不一致，请重新输入')}`);
		} else {
			callback();
		}
	};

	radio_select = (e, item) => {
		if (item.callback) {
			item.callback(e);
		}
	};

	//表格单行点击事件
	sldHandleRow = (record, index, items, rowKey) => {
		items(record);
		if (rowKey == 'unit_id') {
			this.setState({
				rowId: record.unit_id,
			});
		} else if (rowKey == 'mark_id') {
			this.setState({
				rowId: record.mark_id,
			});
		} else if (rowKey == 'supplier_id') {
			this.setState({
				rowId: record.supplier_id,
			});
		} else if (rowKey == 'brand_id') {
			this.setState({
				rowId: record.brand_id,
			});
		} else if (rowKey == 'tag_id') {
			this.setState({
				rowId: record.tag_id,
			});
		} else if (rowKey == 'shop_id') {
			this.setState({
				rowId: record.shop_id,
			});
		} else if (rowKey == 'level_id') {
			this.setState({
				rowId: record.level_id,
			});
		} else if (rowKey == 'warehouse_id') {
			this.setState({
				rowId: record.warehouse_id,
			});
		} else if (rowKey == 'po_id') {
			this.setState({
				rowId: record.po_id,
			});
		} else if (rowKey == 'type_id') {
			this.setState({
				rowId: record.type_id,
			});
		} else if (rowKey == 'corp_id') {
			this.setState({
				rowId: record.corp_id,
			});
		} else if (rowKey == 'member_id') {
			this.setState({
				rowId: record.member_id,
			});
		} else if (rowKey == 'order_id') {
			this.setState({
				rowId: record.order_id,
			});
		} else if (rowKey == 'role_id') {
			this.setState({
				rowId: record.role_id,
			});
		} else if (rowKey == 'user_id') {
			this.setState({
				rowId: record.user_id,
			});
		} else if (rowKey == 'pos_id') {
			this.setState({
				rowId: record.pos_id,
			});
		} else if (rowKey == 'po_id') {
			this.setState({
				rowId: record.po_id,
			});
		} else if (rowKey == 'unit_id') {
			this.setState({
				rowId: record.unit_id,
			});
		} else if (rowKey == 'brand_id') {
			this.setState({
				rowId: record.brand_id,
			});
		} else if (rowKey == 'key') {
			this.setState({
				rowId: record.key,
			});
		} else if (rowKey == 'recipients_id') {
			//防止下面的选中行变色
			this.setState({
				rowId: record.member_id,
			});
		} else if (rowKey == 'role_user_id') {
			//防止下面的选中行变色
			this.setState({
				rowId: record.role_id,
			});
		}
	};

	//设置选中行的背景色
	setRowClassName = (rowKey, record) => {
		let cur_id = '';
		if (rowKey == 'unit_id') {
			cur_id = record.unit_id;
		} else if (rowKey == 'spec_id') {
			cur_id = record.spec_id;
		} else if (rowKey == 'supplier_id') {
			cur_id = record.supplier_id;
		} else if (rowKey == 'brand_id') {
			cur_id = record.brand_id;
		} else if (rowKey == 'mark_id') {
			cur_id = record.mark_id;
		} else if (rowKey == 'tag_id') {
			cur_id = record.tag_id;
		} else if (rowKey == 'shop_id') {
			cur_id = record.shop_id;
		} else if (rowKey == 'level_id') {
			cur_id = record.level_id;
		} else if (rowKey == 'warehouse_id') {
			cur_id = record.warehouse_id;
		} else if (rowKey == 'po_id') {
			cur_id = record.po_id;
		} else if (rowKey == 'type_id') {
			cur_id = record.type_id;
		} else if (rowKey == 'corp_id') {
			cur_id = record.corp_id;
		} else if (rowKey == 'member_id') {
			cur_id = record.member_id;
		} else if (rowKey == 'recipients_id') {
			cur_id = record.recipients_id;
		} else if (rowKey == 'order_id') {
			cur_id = record.order_id;
		} else if (rowKey == 'role_id') {
			cur_id = record.role_id;
		} else if (rowKey == 'user_id') {
			cur_id = record.user_id;
		} else if (rowKey == 'pos_id') {
			cur_id = record.pos_id;
		} else if (rowKey == 'po_id') {
			cur_id = record.po_id;
		} else if (rowKey == 'unit_id') {
			cur_id = record.unit_id;
		} else if (rowKey == 'brand_id') {
			cur_id = record.brand_id;
		} else if (rowKey == 'key') {
			cur_id = record.key;
		}
		return cur_id === this.state.rowId ? 'seleSingle' : '';
	};


	//获取每个item的内容
	getItem = (items, index) => {
		const { getFieldDecorator } = this.props.form;
		const { formItemLayoutModal } = this.props;
		const { showColorPicker } = this.state;
		if (items.type == 'input') {
			return <FormItem
				key={index}
				{...formItemLayoutModal}
				label={items.label}
			>
				{typeof (items.input_type) != 'undefined' && items.input_type == 'password' && (typeof (items.disable) == 'undefined' || (typeof (items.disable) != 'undefined' && !items.disable)) && getFieldDecorator(items.name, {
					initialValue: items.initialValue,
					rules: items.rules,
				})(
					<Input maxLength={250} type={'password'} placeholder={items.placeholder}/>,
				)}
				{typeof (items.input_type) != 'undefined' && items.input_type == 'password' && typeof (items.disable) != 'undefined' && items.disable && getFieldDecorator(items.name, {
					initialValue: items.initialValue,
					rules: items.rules,
				})(
					<Input maxLength={250} type={'password'} disabled={true} placeholder={items.placeholder}/>,
				)}

				{typeof (items.input_type) == 'undefined' && (typeof (items.disable) == 'undefined' || (typeof (items.disable) != 'undefined' && !items.disable)) && getFieldDecorator(items.name, {
					initialValue: items.initialValue,
					rules: items.rules,
				})(
					<Input maxLength={250} placeholder={items.placeholder}/>,
				)}

				{typeof (items.input_type) == 'undefined' && typeof (items.disable) != 'undefined' && items.disable && getFieldDecorator(items.name, {
					initialValue: items.initialValue,
					rules: items.rules,
				})(
					<Input disabled={true} placeholder={items.placeholder}/>,
				)}

			</FormItem>;
		} else if (items.type == 'textarea') {
			return <FormItem
				key={index}
				{...formItemLayoutModal}
				label={items.label}
			>
				{getFieldDecorator(items.name, { initialValue: items.initialValue, rules: items.rules })(
					<TextArea style={{ minHeight: 32 }} rows={4} placeholder={items.placeholder}/>,
				)}
			</FormItem>;
		} else if (items.type == 'inputnum') {
			return <FormItem
				key={index}
				{...formItemLayoutModal}
				label={items.label}
			>
				{getFieldDecorator(items.name, { initialValue: items.initialValue, rules: items.rules })(
					<InputNumber min={0} max={999999999} precision={0} step={items.step ? items.step : 0} style={{ width: '100%' }}
								 placeholder={items.placeholder} disabled={items.disable}/>,
				)}
			</FormItem>;
		} else if (items.type == 'show_content') {
			return <FormItem
				key={index}
				{...formItemLayoutModal}
				label={items.label}
			>
				<div>{items.content}</div>
			</FormItem>;
		} else if (items.type == 'color_picker') {
			return <FormItem
				key={index}
				{...formItemLayoutModal}
				label={items.label}
			>
				<div onClick={() => this.showColorPicker()} style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'flex-start',
					alignItems: 'center',
				}}>
					{getFieldDecorator(items.name, { initialValue: items.initialValue, rules: items.rules })(
						<Input disabled={true} style={{ width: 150 }} placeholder={items.placeholder}/>,
					)}
					<span style={{
						width: 30,
						height: 30,
						display: 'inline-block',
						backgroundColor: items.initialValue,
						marginLeft: 10,
						borderRadius: 4,
					}}></span>
				</div>
				{showColorPicker && (
					<TwitterPicker
						colors={['#D0AAFF', '#98BFFE', '#73E5FF', '#B1E788', '#FFF17A', '#FFBB7C', '#FFA5AD', '#FEC5E8', '#C2C2C2', '#8187e0']}
						color={items.initialValue} onChange={(color) => this.sldHandleColor(color)}
						style={{ marginTop: 20 }}/>
				)}
			</FormItem>;
		} else if (items.type == 'select') {
			return <FormItem
				key={index}
				{...formItemLayoutModal}
				label={items.label}
			>
				{getFieldDecorator(items.name, {
					initialValue: items.initialValue ? items.initialValue : (items.sel_data.length > 0 ? items.sel_data[0].key : undefined),
					rules: items.rules,
				})(
					<Select onChange={(value) => this.sldHandSeleChange(items, value)}
                  placeholder={items.placeholder}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
							    style={{ width: '100%' }}
          >
						{items.sel_data.map((itemss, indexss) => {
							return <Option key={indexss} value={itemss.key}>{itemss.name}</Option>;
						})}
					</Select>,
				)}
			</FormItem>;
		} else if (items.type == 'switch') {
			return <FormItem
				key={index}
				{...formItemLayoutModal}
				label={items.label}
			>
				{getFieldDecorator(items.name, {
					valuePropName: 'checked',
					initialValue: items.initialValue ? items.initialValue : false,
					rules: items.rules,
				})(
					<Switch/>,
				)}
			</FormItem>;
		} else if (items.type == 'edittable') {
			return <Fragment key={index}>
				<div style={{ marginBottom: 10, textAlign: 'right', marginTop: -30 }}><Button type="primary"
																							  onClick={() => this.addTableRow(items)}
																							  size={'default'}>{items.btn_text}</Button>
				</div>
				<StandardTable
					selectedRows={[]}
					rowKey={'key'}
					scroll={items.scroll}
					data={{ list: items.dataSource, pagination: {} }}
					isCheck={false}
					columns={items.columns}
					sldpagination={false}
				/></Fragment>;
		} else if (items.type == 'cascader') {
			//三级地区选择器
			return (<FormItem
					key={index}
					{...formItemLayoutModal}
					label={items.label}
				>
					{getFieldDecorator(items.name, { initialValue: items.initialValue, rules: items.rules })(
						<Cascader options={JSON.parse(localStorage.getItem('common_area_list'))}
								  placeholder={items.placeholder}/>,
					)}
				</FormItem>
			);

		} else if (items.type == 'checkboxgroup') {
			return <FormItem
				key={index}
				{...formItemLayoutModal}
				label={items.label}
			>
				{getFieldDecorator(items.name, { initialValue: items.initialValue, rules: items.rules })(
					<CheckboxGroup options={items.sldOptions} onChange={(value) => this.sldCheckShop(items, value)}/>,
				)}
			</FormItem>;
		} else if (items.type == 'TreeSelect') {
			return <FormItem
				key={index}
				{...formItemLayoutModal}
				label={items.label}
				help={items.help}
			>
				{getFieldDecorator(items.name, { initialValue: items.initialValue, rules: items.rules })(
					<TreeSelect
						style={{ width: '100%' }}
						treeData={items.data}
						showSearch={true}
						placeholder={items.placeholder}
						allowClear={items.allowClear}
						onSelect={items.onSelect}
            dropdownStyle={{maxHeight:300}}
            getPopupContainer={triggerNode => triggerNode.parentNode}
					/>,
				)}
			</FormItem>;
		} else if (items.type == 'TreeSelectAll') {
			return <FormItem
				key={index}
				{...formItemLayoutModal}
				label={items.label}
				help={items.help}
			>
				{getFieldDecorator(items.name, { initialValue: items.initialValue, rules: items.rules })(
					<TreeSelect
						style={{ width: '100%' }}
						treeData={items.data}
						showSearch={true}
						placeholder={items.placeholder}
						allowClear={items.allowClear}
						onSelect={items.onSelect}
            dropdownStyle={{maxHeight:300}}
            getPopupContainer={triggerNode => triggerNode.parentNode}
					>
						{items.data.map((val, key) => {
							return <TreeNode value={val.sellerName} title={val.sellerName} key={val.id}></TreeNode>;
						})}
					</TreeSelect>,
				)}
			</FormItem>;
		} else if (items.type == 'search_add_table') {
			const rowKey = items.rowKey;
			return <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
				<div style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					marginBottom: 10,
				}}>
					{/*{sldSearch('请输入搜索内容',300,items.search,true,items.search_value)}*/}
					{sldSearchVal(`${sldComLanguage('请输入搜索内容')}`, 300, items.search, true, items.search_value, items.searchCon)}
					{items.add != '' &&
					sldIconBtnBg(items.add, 'jiahao-', `${sldComLanguage('新增')}`, '#fff', 7, 0, 18, 18, 4)
					}
				</div>
				<StandardTable
					selectedRows={items.selectedRows}
					data={items.table}
					rowKey={rowKey}
					rowClassName={(record) => this.setRowClassName(rowKey, record)}
					onRow={(record, index) => {
						return {
							onClick: () => {
								this.sldHandleRow(record, index, items.onSldHandleSeleRow, rowKey);
							},
						};
					}}
					isCheck={items.isCheck}
					columns={items.columns}
					onSelectRow={items.handleSelectRows}
					onChange={items.onChange}
					onSldHandleSeleRow={items.onSldHandleSeleRow}
				/>
				{this.props.showItemDetail &&
				<Fragment>
					{sldLlineRtextAddGoods('#FA6F1E', items.detail_data.tip)}
					{getSldEmptyH(15)}
					<StandardTable
						selectedRows={items.detail_data.selectedRows}
						data={items.detail_data.table}
						rowKey={items.detail_data.rowKey}
						onRow={(record, index) => {
							return {
								onClick: () => {
									this.sldHandleRow(record, index, items.detail_data.onSldHandleSeleRow, items.detail_data.rowKey);
								},
							};
						}}
						isCheck={items.detail_data.isCheck}
						columns={items.detail_data.columns}
						onSelectRow={items.detail_data.handleSelectRows}
						onChange={items.detail_data.onChange}
					/>
				</Fragment>
				}
			</div>;
		} else if (items.type == 'modal_table_sele') {
			const rowKey = items.rowKey;
			return <div key={index} style={{ display: 'flex', flexDirection: 'column', marginBottom: 7 }}>
				<StandardTable
					selectedRows={items.selectedRows}
					data={items.table}
					rowKey={rowKey}
					sldpagination={false}
					isCheck={items.isCheck}
					columns={items.columns}
					onSelectRow={items.handleSelectRows}
					onChange={items.onChange}
					scroll={{ y: 350 }}
				/>
			</div>;
		} else if (items.type == 'tag_muilty_search') {
			//标签样式  多选 带搜索
			return <Select
				key={index}
				mode="multiple"
				allowClear={items.allowClear}
				style={{ width: '100%' }}
				onChange={items.sldSeleChange}
				placeholder={items.placeholder}
				defaultValue={items.defaultValue}
				value={items.value}
        getPopupContainer={triggerNode => triggerNode.parentNode}
			>
				{items.data.map((itemss, indexss) => {
					return <Option key={indexss} value={itemss.name}>{itemss.name}</Option>;
				})}
			</Select>;

		} else if (items.type == 'table') {
			return <div key={index} style={{ display: 'flex', flexDirection: 'column', marginTop: 20 }}>
				<StandardTable
					selectedRows={items.selectedRows}
					data={items.table}
					rowKey={items.rowKey}
					isCheck={items.isCheck}
					columns={items.columns}
					onSelectRow={items.handleSelectRows}
					sldpagination={false}
				/>
			</div>;
		} else if (items.type == 'input_after') {
			//带图标后缀
			return (<FormItem
				key={index}
				{...formItemLayoutModal}
				label={items.label}
				help={items.help}
			>
				<div onClick={() => items.callback(items.operate_obj)}>
					{getFieldDecorator(items.name, { initialValue: items.initialValue, rules: items.rules })(
						<Input
							disabled={true}
							addonAfter={sldInputAfterAddons()} placeholder={items.placeholder}/>,
					)}
				</div>
			</FormItem>);
		} else if (items.type == 'text') {
			return <div key={index} style={{
				display: 'flex',
				flexDirection: 'row',
				width: this.props.width ? this.props.width : 416,
				marginBottom: 10,
			}}>
				<div style={{
					display: 'flex',
					fontSize: 14,
					flexDirection: 'row',
					justifyContent: 'flex-end',
					width: (items.left) / 24 * (this.props.width ? this.props.width : 416),
					color: 'rgba(0,0,0,0.85)',
					lettreSpace: 2,
					paddingRight: 5,
				}}>{items.label}</div>
				<div style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'flex-start',
					width: (items.right) / 24 * (this.props.width ? this.props.width : 416),
					color: 'rgba(0,0,0,0.65)',
					fontSize: 14,
				}}>{items.initialValue}</div>
			</div>;
		} else if (items.type == 'single_checkbox') {
			//选择框
			return (
				<FormItem
					key={index}
					{...formItemLayoutModal}
					label={items.label}
				>
					{getFieldDecorator(items.name, {
						valuePropName: 'checked',
						initialValue: items.initialValue,
						rules: items.rules,
					})(
						<Checkbox
						>
							{items.check_con}
						</Checkbox>,
					)}
				</FormItem>
			);
		} else if (items.type == 'show_subtitle') {
			//选择框
			return (
				<div key={index} style={{
					marginTop: items.distance.top,
					marginLeft: items.distance.left,
					marginRight: items.distance.right,
					marginBottom: items.distance.bottom,
				}}>
					{sldLlineRtextAddGoods(items.color, items.name)}
				</div>
			);
		} else if (items.type == 'radio_select') {
			//带图标后缀
			return (<FormItem
				key={index}
				{...formItemLayoutModal}
				label={items.label}
				help={items.help}
			>
				{getFieldDecorator(items.name, { initialValue: items.initialValue, rules: items.rules })(
					<Radio.Group size={'small'} buttonStyle="solid" onChange={(e) => this.radio_select(e, items)}>
						{items.data.map((val, key) => {
							return <Radio.Button key={key} value={val.key}>{val.value}</Radio.Button>;
						})}

					</Radio.Group>,
				)}
			</FormItem>);
		}
	};

	//渲染主体内容
	rendeForm = (content) => {
		return content.map((items, index) => {
			return this.getItem(items, index);
		});
	};

	//全选按钮
	permissionAll = (e, index) => {
		this.props.permissionAll(e, index);
	};

	//单选按钮
	permissionSingle = (checkedList, index) => {
		this.props.permissionSingle(checkedList, index);
	};

	//关闭modal之后重置数据
	closeReset = () => {
		this.props.form.resetFields();
	};

	render() {
		const { getFieldDecorator, getFieldValue } = this.props.form;
		const { title, formItemLayoutModal, modalVisible, content, submiting, zIndex } = this.props;
		return <Modal
			title={title}
			zIndex={zIndex}
			afterClose={this.closeReset}
			width={this.props.width ? this.props.width : 416}
			visible={modalVisible}
			onOk={this.sldConfirm}
			onCancel={this.sldCancle}
			footer={null}
		>
			<Form
				layout="horizontal"
			>
				{this.rendeForm(content)}
				{typeof (this.props.conType) != 'undefined' && this.props.conType == 'moreCheck' && (
					<div className={styles.sldPerminss}>
						{content.map(item =>
							<Fragment key={item.key}>
								<Checkbox
									indeterminate={item.indeterminate}
									onChange={(e) => this.permissionAll(e, item.key)}
									checked={item.checkAll}
								>
									<span className={styles.sldGroup}>{item.name}</span>
								</Checkbox>
								<CheckboxGroup options={item.sldchild} value={item.checkList}
											   onChange={(e) => this.permissionSingle(e, item.key)}/>
							</Fragment>,
						)}
					</div>
				)}
			</Form>
		</Modal>;
	}
}


