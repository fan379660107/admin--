import React, { Component, Fragment } from 'react';
import { Form, Select,Input,InputNumber,DatePicker,TreeSelect,Cascader,Checkbox,Radio } from 'antd';
import global from '@/global.less';
import { sldInputAfterAddons } from '@/utils/utils';
import styles from './SldEditFormCom.less';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const InputGroup = Input.Group;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const {TextArea} = Input;

export default  class SldEditFormCom extends Component {

    componentDidMount() {

    }
  //处理input内容变化事件
  handleInputOnchange = (e,item) => {
    if(item.handleChange){
      item.handleChange(e);
    }
  }

  //多选事件
  sldCheckShop = (items, value) => {
    if (items.sldCheckShop) {
      items.sldCheckShop(value);
    }
  };

  redioOnChange = (e,val) => {
    if(val.onChange){
      val.onChange(e.target.value);
    }
  }

	  commonCon = (val,index) => {
		  let {
			  form: { getFieldDecorator },item_width,
		  } = this.props;
    	  //普通输入框
      item_width  = item_width!=undefined?item_width:'auto'
			if(val.type == 'input'){
				return (<FormItem
							key={index}
							label={val.label}
							extra={val.extra}
              style={{width:val.width!=undefined?val.width+80:250}}
						>
							{getFieldDecorator(val.name,{initialValue:val.initialValue,rules:val.rules})(
								<Input maxLength={val.maxLength?val.maxLength:250} className={styles.item}  disabled={val.disable} placeholder={val.placeholder}/>
							)}
						</FormItem>
				);
			}else if(val.type == 'inputnum'){
				//数字搜索框
				return (
						<FormItem key={index}
                      extra={val.extra}
                      label={val.label}>
							{getFieldDecorator(val.name,{initialValue:val.initialValue,rules:val.rules})(<InputNumber min={0} max={999999999} step={val.step?val.step:0} className={styles.item} placeholder={val.placeholder} precision={val.precision!=undefined?val.precision:0} disabled={val.disable} onChange={(e)=>this.handleInputOnchange(e,val)}/>)}
						</FormItem>
				);

			}else if(val.type == 'select'){
				//下拉选择框
				return (<FormItem key={index} extra={val.extra} label={val.label}>
							{getFieldDecorator(val.name,{initialValue:val.initialValue?val.initialValue:undefined,rules:val.rules})(
								<Select placeholder={val.placeholder}
                        className={styles.item}
                        onChange={val.onChange}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                >
									{val.sel_data.map((items,indexs)=>{
										return <Option key={indexs} value={items.key}>{items.name}</Option>
									})}
								</Select>
							)}
						</FormItem>
				);

			}else if(val.type == 'textarea'){

        return (<FormItem
            key={index}
            help={val.help}
            extra={val.extra}
            label={val.label}>
            {getFieldDecorator(val.name,{initialValue:val.initialValue,rules:val.rules})(
              <TextArea className={styles.item} disabled={val.is_disable!=undefined&&val.is_disable?true:false} style={{minHeight: 32}} rows={4} placeholder={val.placeholder}/>
            )}
          </FormItem>);
      }else if(val.type == 'rangepicker'){
				//时间范围选择器
				return (<FormItem
                          key={index}
                          style={{width:val.width!=undefined?val.width+80:250}}
                          extra={val.extra}
                          label={val.label}>
							{getFieldDecorator(val.name)(
								<RangePicker
                  style={{width:val.width!=undefined&&val.width?val.width:'100%'}}
                  className={styles.item}
									placeholder={[val.placeholder1,val.placeholder2,]}
                  getCalendarContainer={(triggerNode)=>{
                    return triggerNode.parentNode
                  }}
								/>
							)}
						</FormItem>
				);
			}else if(val.type == 'datepicker'){
				//时间选择器
				return (<FormItem key={index} extra={val.extra} label={val.label}>
							{val.initialValue&&getFieldDecorator(val.name,{initialValue:val.initialValue,rules:val.rules})(
								<DatePicker style={{width:180}}
                            placeholder={val.placeholder}
                            className={styles.item}
                            getCalendarContainer={(triggerNode)=>{
                              return triggerNode.parentNode
                            }}
                />
							)}
              {!val.initialValue&&getFieldDecorator(val.name,{rules:val.rules})(
                <DatePicker style={{width:180}}
                            placeholder={val.placeholder}
                            className={styles.item}
                            getCalendarContainer={(triggerNode)=>{
                              return triggerNode.parentNode
                            }}
                />
              )}
						</FormItem>
				);
			}else if(val.type == 'rangeval'){
				//范围选择器
				return (<FormItem key={index} extra={val.extra} label={val.label}>
							<InputGroup compact className={styles.item}>
								{getFieldDecorator([val.name1])(<Input maxLength={250} style={{ width: '40%', textAlign: 'center' }} placeholder={val.placeholder1} />)}

								<Input style={{ width: '20%', borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
								{getFieldDecorator([val.name2])(<Input maxLength={250} style={{ width: '40%', textAlign: 'center', borderLeft: 0 }} placeholder={val.placeholder2} />)}
							</InputGroup>
						</FormItem>
				);

			}else if(val.type == 'input_after'){
				//带图标后缀
				return (<FormItem
            key={index}
            extra={val.extra}
						label={val.label}
					>
					<div onClick={() => val.callback(val.operate_obj)}>
						{getFieldDecorator(val.name,{initialValue:val.initialValue,rules:val.rules})(
							<Input style={{width:150,marginLeft:3}} disabled={true} addonAfter={sldInputAfterAddons()} placeholder={val.placeholder}/>
						)}
					</div>
					</FormItem>);
			}else if(val.type == 'textarea_single'){
				return <FormItem
              key={index}
              extra={val.extra}
              label={val.label}>
							{getFieldDecorator(val.name,{initialValue:val.initialValue,rules:val.rules})(
								<TextArea className={styles.item} style={{minHeight: 30}} rows={1}/>
							)}
						</FormItem>;
			}else if(val.type == 'TreeSelect'){
				return <FormItem key={index} extra={val.extra} label={val.label}>
						{getFieldDecorator(val.name,{initialValue:val.initialValue,rules:val.rules})(
							<TreeSelect
                className={styles.item}
								treeData={val.data}
								showSearch={true}
								placeholder={val.placeholder}
								allowClear={val.allowClear}
								onSelect={val.onSelect}
                dropdownStyle={{maxHeight:300}}
                getPopupContainer={triggerNode => triggerNode.parentNode}
							/>
						)}
					</FormItem>;
			}else if(val.type == 'cascader'){
				//三级地址选择
				return (<FormItem
              key={index}
              extra={val.extra}
							label={val.label}
						>
							{getFieldDecorator(val.name,{initialValue:val.initialValue,rules:val.rules})(
								<Cascader style={{width:200}} options={JSON.parse(localStorage.getItem('common_area_list'))}  placeholder={val.placeholder}/>
							)}
						</FormItem>
				);
			}else if(val.type == 'single_checkbox'){
        //选择框
        return (<FormItem
              key={index}
              extra={val.extra}
              label={val.label}
            >
              {getFieldDecorator(val.name,{valuePropName:'checked',initialValue:val.initialValue,rules:val.rules})(
                <Checkbox
                >
                  {val.check_con}
                </Checkbox>
              )}
            </FormItem>
        );
      }else if(val.type == 'radio'){
        //radio
        return (<FormItem
              key={index}
              extra={val.extra}
              label={val.label}
              style={{width:val.width!=undefined?val.width+80:250}}
            >
              {getFieldDecorator(val.name,{valuePropName:'checked',rules:val.rules,initialValue:val.initialValue})(
                <RadioGroup size={'small'} defaultValue={val.initialValue} style={{width:val.width!=undefined?val.width:'100%'}} onChange={(e)=>this.redioOnChange(e,val)}>
                  {val.sel_data.map((item,index)=>{
                    return <Radio key={index} value={item.key}>{item.name}</Radio>
                  })}
                </RadioGroup>
              )}
            </FormItem>
        );
      }else if(val.type == 'checkboxgroup'){
        //radio
        return (<FormItem
              key={index}
              style={{width:val.width!=undefined?val.width+80:250}}
              extra={val.extra}
              label={val.label}
            >
              {getFieldDecorator(val.name,{initialValue: val.initialValue,rules:val.rules})(
                <CheckboxGroup style={{width:193}} options={val.sldOptions} onChange={(value) => this.sldCheckShop(val, value)}/>,
              )}
            </FormItem>
        );
      }

	  }

	  //渲染每一项
	  renderSearchSecond = (search_data) => {
		  return search_data.map((item,index)=>{
        return this.commonCon(item,index);
		  });
	  }


	  renderSimpleForm() {
		  const {search_data} = this.props;

		  return (
			  search_data.length>0&&
          <div style={{display:'block'}}>
					  <div className={styles.flex_com_row_wrap}>
						  {this.renderSearchSecond(search_data)}
					  </div>
          </div>
		  );
	  }

    render() {
      return this.renderSimpleForm();
    }
  }

