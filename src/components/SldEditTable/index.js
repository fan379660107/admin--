import React, { Component, Fragment } from 'react';
import { Table, Input, Button, Popconfirm, Form,Cascader } from 'antd';
import ReactDOM from 'react-dom';
import styles from './index.less';
import {  sldComLanguage,} from '@/utils/utils';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
	<EditableContext.Provider value={form}>
		<tr {...props} />
	</EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
	state = {
		editing: false,
	}

	componentDidMount() {
		if (this.props.editable) {
			document.addEventListener('click', this.handleClickOutside, true);
		}
	}

	componentWillUnmount() {
		if (this.props.editable) {
			document.removeEventListener('click', this.handleClickOutside, true);
		}
	}

	toggleEdit = () => {
		const editing = !this.state.editing;
		this.setState({ editing }, () => {
			if (editing&&!this.props.select_area) {
				this.input.focus();
			}
		});
	}

	handleClickOutside = (e) => {
		const { editing } = this.state;
		if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
			this.save();
		}
	}

	save = () => {
		const { record, handleSave,operatetype } = this.props;
		this.form.validateFieldsAndScroll((error, values) => {
			if (error) {
				return;
			}
			this.toggleEdit();
			handleSave({ ...record, ...values });
		});
	}

	render() {
		const { editing } = this.state;
		const {
			editable,
			rules,
			dataIndex,
			title,
			record,
			index,
			handleSave,
			select_area,
			...restProps
		} = this.props;
		return (
			<td ref={node => (this.cell = node)} {...restProps}>
				{editable ? (
					<EditableContext.Consumer>
						{(form) => {
							this.form = form;
							return (
								editing ? (select_area?
										<FormItem style={{ margin: 0 }}>
											{form.getFieldDecorator(dataIndex, {
												rules:rules,
											})(
												<Cascader options={JSON.parse(localStorage.getItem('common_area_list'))}  placeholder={`${sldComLanguage('请选择地址')}`
											}/>
											)}
										</FormItem>
										:
									<FormItem style={{ margin: 0 }}>
										{form.getFieldDecorator(dataIndex, {
											rules:rules,
											initialValue: record[dataIndex],
										})(
											<Input
                        maxLength={250}
												ref={node => (this.input = node)}
												onPressEnter={this.save}
											/>
										)}
									</FormItem>
								) : (
									<div
										className={styles.editableCellValueWrap}
										style={{ paddingRight: 24,width:'100%',height:25,lineHeight:'25px' }}
										onClick={this.toggleEdit}
									>
										{restProps.children}
									</div>
								)
							);
						}}
					</EditableContext.Consumer>
				) : restProps.children}
			</td>
		);
	}
}

export default class EditableTable extends React.Component {
	constructor(props) {
		super(props);

	}
	componentWillReceiveProps (nextProps) {
	}
	handleAdd = () => {
		const { add_data } = this.props;
		this.props.sldAddRow(add_data,'add');
	}

	//新增一行
	handleSave = (row) => {
		const {operatetype} = this.props;
		if(typeof (operatetype)!='undefined'&&operatetype=='edit'){
			this.props.sldEditRow(row);
			return false;
		}
		const newData = [...this.props.dataSource];
		const index = newData.findIndex(item => row.key === item.key);
		const item = newData[index];
		newData.splice(index, 1, {
			...item,
			...row,
		});

		this.props.sldAddRow(newData,'save');
	}


	render() {
		let {columns,dataSource,button_info,operatetype,rowKey,select_area} = this.props;
		const components = {
			body: {
				row: EditableFormRow,
				cell: EditableCell,
			},
		};

		 columns = columns.map((col) => {
			if (!col.editable) {
				return col;
			}
			return {
				...col,
				onCell: record => ({
					record,
					editable: col.editable,
					dataIndex: col.dataIndex,
					title: col.title,
					operatetype:operatetype,
					handleSave: this.handleSave,
					select_area:(typeof(col.select_area)!='undefined'&&col.select_area)?true:false,
				}),
			};
		});
		return (
			<div>
				{typeof (button_info)!='undefined'&&
				<Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
					{button_info.text}
				</Button>
				}
				<Table
					refs={'edittable'}
					size={'small'}
					components={components}
					rowClassName={() => 'editable-row'}
					bordered
					key={Math.random()}
					rowKey={rowKey || 'key'}
					dataSource={dataSource}
					columns={columns}
					pagination={false}
				/>
			</div>
		);
	}
}

