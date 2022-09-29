/*
*发布商品的布局（表单内容）   一行多列  左侧label 右侧内容
* 只能用于单行  多行样式不兼容
* 针对发布商品的规格处使用的
* */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Select,
  Icon,
  Row,
  Col,
  Input,
  InputNumber,
  DatePicker,
  TreeSelect,
  Cascader,
  Checkbox,
  Radio,
  Upload,
} from 'antd';
import global from '@/global.less';
import styles from './index.less';
import { sldInputAfterAddons,sldBeforeUpload,sldComLanguage,getLocalStorageStingVal,getSldEmptyH } from '@/utils/utils';
import ALibbSvg from '@/components/ALibbSvg';
import { addGoodsSpecLimit,addGoodsSpecValLimit } from '@/utils/sldconfig.js';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const InputGroup = Input.Group;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const { TextArea } = Input;

export default class SldTableSingleRow extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			props_data: props,
      specSelectedItems: [],//选中的数据
      specAll:['Apples', 'Nails', 'Bananas', 'Helicopters'],
		};
	}

	componentWillReceiveProps(props) {
		this.setState({
			props_data: props,
		});
	}

	//处理input内容变化事件
	handleInputOnchange = (e, item) => {
		if (item.handleChange) {
			item.handleChange(e);
		}
	};

	//处理复选框变化事件
	handleSingleCheckboxOnchange = (e, item) => {
		if (item.onChange) {
			item.onChange(e);
		}
	};

	//多选事件
	sldCheckShop = (items, value) => {
		if (items.sldCheckShop) {
			items.sldCheckShop(value);
		}
	};

	redioOnChange = (e, val) => {
		if (val.onChange) {
			val.onChange(e.target.value);
		}
	};

	//添加规格值
  addSpecVal = (val,vall) => {
    if(vall.is_add_spec_val!=undefined && vall.is_add_spec_val){
      //有正在添加的数据，则不能继续添加
      return false;
    }else{
      //正常添加规格值
      val.addSpecValue(true,vall.specId)
    }
  }

	commonCon = (val, index) => {
		let {
			form: { getFieldDecorator }, item_width,
		} = this.props;
		//普通输入框
		item_width = item_width != undefined ? item_width : 'auto';
		const uploadButton = (
			<div>
				<Icon type="plus"/>
				<div className="ant-upload-text">{sldComLanguage('上传图片')}</div>
			</div>
		);
		const disableUploadButton = (
			<div className={global.disableUploadBtn}>
				<div className={global.text}>{sldComLanguage('请先选中该规格再上传图片')}</div>
			</div>
		);
		if (val.type == 'input') {
			return (<FormItem
					key={index}
					extra={val.extra}
					style={{ width: '100%' }}
				>
					{getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(
						<Input maxLength={250} className={styles.item} disabled={val.disable} placeholder={val.placeholder}/>,
					)}
				</FormItem>
			);
		} else if (val.type == 'inputnum') {
			//数字搜索框
			return (
				<FormItem key={index}
				          style={{ width: '100%' }}
				          extra={val.extra}
				>
					{getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(<InputNumber
            min={0}
            max={999999999}
						step={val.step ? val.step : 0} className={styles.item} placeholder={val.placeholder}
						precision={val.precision != undefined ? val.precision : 0} disabled={val.disable}
						onChange={(e) => this.handleInputOnchange(e, val)}/>)}
				</FormItem>
			);

		} else if (val.type == 'select') {
			//下拉选择框
			return (<FormItem
					key={index}
					style={{ width: val.width != undefined ? val.width : ' 80%' }}
					extra={val.extra}
				>
					{getFieldDecorator(val.name, {
						initialValue: val.initialValue ? val.initialValue : (val.sel_data.length > 0 ? val.sel_data[0].key : undefined),
						rules: val.rules,
					})(
						<Select placeholder={val.placeholder}
                    className={styles.item}
                    onChange={val.onChange}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
            >
							{val.sel_data.map((items, indexs) => {
								return <Option key={indexs} value={items.key}>{items.name}</Option>;
							})}
						</Select>,
					)}
				</FormItem>
			);

		} else if (val.type == 'textarea') {

			return (<FormItem
				key={index}
				help={val.help}
				extra={val.extra}
				style={{ width: '100%' }}
			>
				{getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(
					<TextArea className={styles.item}
					          disabled={val.is_disable != undefined && val.is_disable ? true : false}
					          style={{ minHeight: 32 }} rows={4} placeholder={val.placeholder}/>,
				)}
			</FormItem>);
		} else if (val.type == 'rangepicker') {
			//时间范围选择器
			return (<FormItem
					key={index}
					style={{ width: '100%' }}
					extra={val.extra}
				>
					{getFieldDecorator(val.name)(
						<RangePicker
							className={styles.item}
							placeholder={[val.placeholder1, val.placeholder2,]}
              getCalendarContainer={(triggerNode)=>{
                return triggerNode.parentNode
              }}
						/>,
					)}
				</FormItem>
			);
		} else if (val.type == 'datepicker') {
			//时间选择器
			return (<FormItem key={index}
			                  extra={val.extra}
			                  style={{ width: '100%' }}
				>
					{val.initialValue && getFieldDecorator(val.name, {
						initialValue: val.initialValue,
						rules: val.rules,
					})(
						<DatePicker className={styles.item}
                        placeholder={val.placeholder}
                        getCalendarContainer={(triggerNode)=>{
                          return triggerNode.parentNode
                        }}
            />,
					)}
					{!val.initialValue && getFieldDecorator(val.name, { rules: val.rules })(
						<DatePicker className={styles.item}
                        placeholder={val.placeholder}
                        getCalendarContainer={(triggerNode)=>{
                          return triggerNode.parentNode
                        }}
            />,
					)}
				</FormItem>
			);
		}  else if (val.type == 'rangeval') {
			//范围选择器
			return (<FormItem
					key={index}
					extra={val.extra}
					style={{ width: '100%' }}
				>
					<InputGroup compact className={styles.item}>
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

		} else if (val.type == 'input_after') {
			//带图标后缀
			return (<FormItem
				key={index}
				extra={val.extra}
				style={{ width: '100%' }}
			>
				<div onClick={() => val.callback(val.operate_obj)}>
				{getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(
					<Input style={{ width: 150, marginLeft: 3 }} disabled={true} addonAfter={sldInputAfterAddons()} placeholder={val.placeholder}/>,
				)}
				</div>
			</FormItem>);
		} else if (val.type == 'textarea_single') {
			return <FormItem
				key={index}
				extra={val.extra}
				style={{ width: '100%' }}
			>
				{getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(
					<TextArea className={styles.item} style={{ minHeight: 30 }} rows={1}/>,
				)}
			</FormItem>;
		} else if (val.type == 'TreeSelect') {
			return <FormItem key={index} extra={val.extra} style={{ width: ' 80%' }}>
				{getFieldDecorator(val.name, {
					initialValue: val.initialValue == '' ? undefined : val.initialValue,
					rules: val.rules,
				})(
					<TreeSelect
						className={styles.item}
						treeData={val.data}
						showSearch={true}
						placeholder={val.placeholder}
						allowClear={val.allowClear}
						onSelect={val.onSelect}
            dropdownStyle={{maxHeight:300}}
            getPopupContainer={triggerNode => triggerNode.parentNode}
					/>,
				)}
			</FormItem>;
		} else if (val.type == 'cascader') {
			//三级地址选择
			return (<FormItem
					key={index}
					extra={val.extra}
					style={{ width: '80%' }}
				>
					{getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(
						<Cascader className={styles.item} options={JSON.parse(localStorage.getItem('common_area_list'))}
						          placeholder={val.placeholder}/>,
					)}
				</FormItem>
			);
		} else if (val.type == 'single_checkbox') {
			//选择框
			return (<FormItem
					key={index}
					extra={val.extra}
					style={{ width: '100%' }}
				>
					{getFieldDecorator(val.name, {
						valuePropName: 'checked',
						initialValue: val.initialValue,
						rules: val.rules,
					})(
						<Checkbox
							className={styles.item}
							onChange={(e) => this.handleSingleCheckboxOnchange(e, val)}
						>
							{val.check_con}
						</Checkbox>,
					)}
				</FormItem>
			);
		} else if (val.type == 'radio') {
			//radio
			return (<FormItem
					key={index}
					extra={val.extra}
					style={{ width: '100%' }}
				>
					{getFieldDecorator(val.name, {
						valuePropName: 'checked',
						rules: val.rules,
						initialValue: val.initialValue,
					})(
						<RadioGroup size={'small'} defaultValue={val.initialValue} className={styles.item}
						            onChange={(e) => this.redioOnChange(e, val)}>
							{val.sel_data.map((item, index) => {
								return <Radio key={index} value={item.key}>{item.name}</Radio>;
							})}
						</RadioGroup>,
					)}
				</FormItem>
			);
		} else if (val.type == 'checkboxgroup') {
			//radio
			return (<FormItem
					key={index}
					style={{ width: '100%' }}
					extra={val.extra}
				>
					{getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(
						<CheckboxGroup className={styles.item} options={val.sldOptions}
						               onChange={(value) => this.sldCheckShop(val, value)}/>,
					)}
				</FormItem>
			);
		} else if (val.type == 'upload_img_upload') {
			return <FormItem
				key={index}
				style={{ width: '100%' }}
				extra={val.extra}
			>
				<Upload
					beforeUpload={sldBeforeUpload}
					withCredentials={true}
					name={val.upload_name}
					action={val.upload_url}
					listType="picture-card"
					fileList={val.fileList}
					onPreview={(info) => val.uploadPreview(info)}
					onChange={(info) => val.uploadChange(info)}
          headers={{
            Authorization: 'Bearer ' + getLocalStorageStingVal('sld_token')
          }}
				>
					{val.fileList.length >= 6 ? null : uploadButton}
				</Upload>
			</FormItem>;
		} else if (val.type == 'goods_spec_sele') {
			let con = <div className={styles.spec_wrap}>
				{
					val.sel_data.length > 0 && val.sel_data.map((vall, keyl) => {
						return <div key={keyl}
						            className={`${styles.spec_r_wrap} ${keyl != val.sel_data.length - 1 ? styles.show_bot_border : null}`}>
							<span className={styles.spec_l}>{vall.name}</span>
							{vall.attrList.length > 0 &&
							<div className={styles.spec_item_wrap}>
								<Checkbox.Group style={{ width: '100%' }} value={vall.sele_id_array!=undefined?vall.sele_id_array:[]}
								                disabled={val.disable != undefined && val.disable ? val.disable : false}>
									<Row>
										{vall.attrList.map((valr, keyr) => {
											return <Col key={keyr} span={4}><Checkbox
												onChange={(e) => this.handleCheckBox(e, valr, val)}
												value={valr.id}>{valr.name}</Checkbox>
												{vall.type == 2 &&
												<Fragment>
													{getSldEmptyH(5)}
													{valr.sele_flag != undefined && valr.sele_flag ? <Upload
														beforeUpload={sldBeforeUpload}
														withCredentials={true}
                            name={val.upload_name}
														accept={'.gif, .jpeg, .png,.jpg,'}
                            action={val.upload_url}
														listType="picture-card"
														fileList={valr.fileList != undefined ? valr.fileList : []}
														onPreview={(info) => val.uploadPreview(info, valr)}
														onChange={(info) => val.uploadChange(info, valr)}
                            headers={{
                              Authorization: 'Bearer ' + getLocalStorageStingVal('sld_token')
                            }}
													>
														{valr.fileList != undefined && valr.fileList.length >= 1 ? null : uploadButton}
													</Upload> : disableUploadButton}
												</Fragment>
												}
											</Col>;
										})}
									</Row>
								</Checkbox.Group>
							</div>
							}
						</div>;
					})
				}
			</div>;

			return con;
		} else if (val.type == 'goods_spec_sele_b2c') {
      let specData = [];
      //重新构造可选的规格项
      val.sel_data.map(item => {
        if (item.sele_flag == undefined || (item.sele_flag != undefined && !item.sele_flag)) {
          specData.push(item.specName);
        }
      });
      let con = <div className={styles.spec_wrap}>
        {
          val.show_data.length > 0 && val.show_data.map((vall, keyl) => {
            const specValData = [];//每个规格项下可选的规格值
            if (vall.valueList != null && vall.valueList.length > 0) {
              vall.valueList.map(item => {
                if (item.sele_flag == undefined || (item.sele_flag != undefined && !item.sele_flag)) {
                  specValData.push(item.specValue);
                }
              });
            }
            //vall.sele_flag!=undefined&&vall.sele_flag 表示该规格项被选中了
            return vall.sele_flag != undefined && vall.sele_flag && <div key={keyl}
                                                                         className={`${styles.spec_r_wrap} ${keyl != val.sel_data.length - 1 ? styles.show_bot_border : null}`}>
              <div className={`${styles.spec_bg} ${global.flex_row_start_center}`}>
                <span className={styles.spec_name_tile}>{sldComLanguage('规格名：')}</span>
                <div className={styles.del_spec}
                     onClick={() => val.handleDelAddSpec({ type: 'spec', specId: vall.specId })}>
                  <ALibbSvg
                    fill={'#c8c8c8'} width={18} height={18} type={'qingchu'}/>
                </div>
                <Select
                  showSearch
                  open={vall.open_flag != undefined && vall.open_flag ? true : false}
                  value={vall.specName}
                  placeholder={sldComLanguage('输入或选择规格项')}
                  showArrow={false}
                  onFocus={() => val.handleSetOpenFlag({
                    type: 'spec',
                    flag: true,
                    operate: 'edit',
                    specId: vall.specId,
                  })}
                  onBlur={() => val.handleSetOpenFlag({
                    type: 'spec',
                    flag: false,
                    operate: 'edit',
                    specId: vall.specId,
                  })}
                  onChange={(selectedItems) => {
                    val.handleSpecChange({ type: 'spec', sel: selectedItems, operate: 'edit', specId: vall.specId });
                  }}
                  onInputKeyDown={(e) => {
                    if (e.nativeEvent.keyCode == 13) {
                      //回车，更新内容，关闭选择框（将open属性置为false）
                      val.handleSpecChange({ type: 'spec', sel: e.target.value, operate: 'edit', specId: vall.specId });
                    }
                  }}
                  style={{ width: 200 }}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  {specData.map(item => (
                    <Select.Option key={item} value={item}>
                      {item}
                    </Select.Option>
                  ))}
                </Select>
                <div className={styles.spec_default_img_spec}>
                  <Checkbox checked={vall.is_img_spec != undefined && vall.is_img_spec ? true : false}
                            onChange={(e) => val.setImgSpec(e, vall.specId)}>{sldComLanguage('设为图片规格')}</Checkbox>
                </div>
              </div>

              <div className={styles.spec_item_wrap}>
                <span className={styles.spec_val_title}>{sldComLanguage('规格值：')}</span>
                <div className={global.flex_com_row_start_center} style={{ flexWrap: 'wrap' }}>
                  {vall.showValList.map((valr, keyr) => {
                    return valr.sele_flag != undefined && valr.sele_flag && <div className={styles.spec_val_item_wrap}>
                      <div className={styles.spec_val_del} onClick={() => val.handleDelAddSpec({
                        type: 'spec_val',
                        specId: vall.specId,
                        specValueId: valr.specValueId,
                      })}>
                        <ALibbSvg
                          fill={'#FF711E'} width={18} height={18} type={'qingchu'}/>
                      </div>
                      <Select
                        showSearch
                        open={valr.open_flag != undefined && valr.open_flag ? true : false}
                        showArrow={false}
                        placeholder={sldComLanguage('输入或选择规格值')}
                        value={valr.specValue}
                        onFocus={() => val.handleSetOpenFlag({
                          type: 'spec_val',
                          flag: true,
                          operate: 'edit',
                          specId: vall.specId,
                          specValueId: valr.specValueId,
                        })}
                        onBlur={() => val.handleSetOpenFlag({
                          type: 'spec_val',
                          flag: false,
                          operate: 'edit',
                          specId: vall.specId,
                          specValueId: valr.specValueId,
                        })}
                        onChange={(selectedItems) => {
                          val.handleSpecChange({
                            type: 'spec_val',
                            sel: selectedItems,
                            specId: vall.specId,
                            operate: 'edit',
                            specValueId: valr.specValueId,
                          });
                        }}
                        onInputKeyDown={(e) => {
                          if (e.nativeEvent.keyCode == 13) {
                            //回车，更新内容，关闭选择框（将open属性置为false）
                            val.handleSpecChange({
                              type: 'spec_val',
                              sel: e.target.value,
                              specId: vall.specId,
                              operate: 'edit',
                              specValueId: valr.specValueId,
                            });
                          }
                        }}
                        style={{ width: 200 }}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        {specValData.map(item => (
                          <Select.Option key={item} value={item}>
                            {item}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>;
                  })}
                  {vall.is_add_spec_val != undefined && vall.is_add_spec_val &&
                  <div className={styles.add_spec_val_wrap}>
                    <div className={styles.spec_val_del} onClick={() => val.addSpecValue(false, vall.specId)}>
                      <ALibbSvg
                        fill={'#FF711E'} width={18} height={18} type={'qingchu'}/>
                    </div>
                    <Select
                      showSearch
                      showArrow={false}
                      autoFocus
                      defaultOpen
                      placeholder={`${sldComLanguage('输入或选择规格值')}`}
                      onChange={(selectedItems) => {
                        val.handleSpecChange({
                          type: 'spec_val',
                          sel: selectedItems,
                          specId: vall.specId,
                          operate: 'add',
                        });
                      }}
                      onInputKeyDown={(e) => {
                        if (e.nativeEvent.keyCode == 13) {
                          //回车，更新内容，关闭选择框（将open属性置为false）
                          val.handleSpecChange({
                            type: 'spec_val',
                            sel: e.target.value,
                            specId: vall.specId,
                            operate: 'add',
                          });
                        }
                      }}
                      style={{ width: 200 }}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                      {specValData.map(item => (
                        <Select.Option key={item} value={item}>
                          {item}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                  }
                  {!(vall.showValList!=undefined&&vall.showValList.length!=undefined&&vall.showValList.length>=addGoodsSpecValLimit)&&
                  <span className={styles.add_spec_val} onClick={() => this.addSpecVal(val, vall)}>{sldComLanguage('添加规格值')}</span>
                  }
                </div>
              </div>
            </div>;
          })
        }
        {(!(val.show_data != undefined && val.show_data.length >= addGoodsSpecLimit)) &&
        <Fragment>
          <div className={styles.spec_bg}>
            {val.is_add_spec &&
            <span className={styles.spec_name_tile}>{sldComLanguage('规格名：')}</span>
            }
            <div className={styles.del_spec} style={{ display: val.is_add_spec ? 'inline-block' : 'none' }}
                 onClick={() => val.addSpec(!val.is_add_spec)}>
              <ALibbSvg
                fill={'#c8c8c8'} width={18} height={18} type={'qingchu'}/>
            </div>
            {val.is_add_spec &&
            <Select
              showSearch
              defaultOpen
              placeholder={sldComLanguage('输入或选择规格项')}
              showArrow={false}
              onChange={(selectedItems) => {
                val.handleSpecChange({ type: 'spec', sel: selectedItems, operate: 'add' });
              }}
              onInputKeyDown={(e) => {
                if (e.nativeEvent.keyCode == 13) {
                  //回车，更新内容，关闭选择框（将open属性置为false）
                  val.handleSpecChange({ type: 'spec', sel: e.target.value, operate: 'add' });
                }
              }}
              style={{ width: 200 }}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {specData.map(item => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
            }
            {!val.is_add_spec &&
            <div className={styles.add_spec} onClick={() => val.addSpec(!val.is_add_spec)}>
              {sldComLanguage('添加规格项')}
            </div>
            }
          </div>
        </Fragment>
        }
      </div>;

      return con;
    }
	};

	//处理规格选择事件
	handleCheckBox = (e, val, item) => {
		if (item.handleSpecSele) {
			item.handleSpecSele(e.target.checked, val);
		}
	};

	render() {
		const { data, lwidth, rwidth, totalHeght, part_width } = this.state.props_data;
		let {
			form: { getFieldDecorator },
		} = this.props;
		const cur_height = totalHeght != undefined ? totalHeght : 70;
		return (
			<div style={{ height: totalHeght }}>
				<div className={styles.sld_det_lr_wrap}>
					{data != undefined && data.length > 0 && data.map((val, index) => {
						return <div className={styles.sld_det_lr_item_wrap} key={index}
						            style={{ width: `${part_width != undefined ? part_width : 50}%` }}>
            <span className={styles.sld_det_r_item} style={{
	            flexDirection: 'row',
	            alignItems: 'center',
	            border: 0,
	            justifyContent: 'flex-end',
	            width: `${lwidth != undefined ? lwidth : 20}%`,
	            backgroundColor: '#fff',
            }}>
              {val.required != undefined && val.required && <span style={{ color: 'red' }}>*</span>}
	            <span className={styles.sld_det_r_text} style={{ fontWeight: '600' }}>{val.label}</span>
            </span>
							<span className={styles.sld_det_r_item} style={{
								width: `${rwidth != undefined ? rwidth : 80}%`,
								alignItems: 'flex-start',
								paddingLeft: 20,
							}}>
              <span className={styles.sld_det_r_text} style={{ width: '100%' }}>
                {this.commonCon(val, index)}
              </span>
            </span>
						</div>;
					})}
				</div>
			</div>
		);
	}
}
