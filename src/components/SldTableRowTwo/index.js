/*
*发布商品的布局（表单内容）   一行多列  左侧label 右侧内容
* */
import React, { PureComponent, Fragment } from 'react';
import {
	Form, Select, Icon, Row, Col, Input, InputNumber, DatePicker, TreeSelect, Cascader, Checkbox, Radio, Upload, Button, Tooltip,
} from 'antd';
import global from '@/global.less';
import styles from './index.less';
import { sldInputAfterAddons, sldBeforeUpload, getSldComImg, sldComLanguage, getLocalStorageStingVal,sldBeforeUploadVideo } from '@/utils/utils';
import {reserveInfoLimitType} from '@/utils/util_data';
import ALibbSvg from '@/components/ALibbSvg';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const InputGroup = Input.Group;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const { TextArea } = Input;

export default class SldTableRowTwo extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			props_data: props,
      screenW: document.body.clientWidth,//屏幕宽度
		};
	}

  componentDidMount() {
    this.resize();
    window.addEventListener('resize', this.resize, { passive: true });
  }

  resize = () => {
    this.setState({ screenW: document.body.clientWidth });
  };

	componentWillReceiveProps(props) {
		this.setState({
			props_data: props,
		});
	}

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
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
    if(val.isReset != undefined && val.isReset){
      this.props.form.resetFields();
    }
		if (val.onChange) {
			val.onChange(e.target.value);
		}
	};

  //图品的点击预览
  sldShowImgPre = (val,item) => {
    if (val.preView) {
      val.preView(true, item);
    }
  };

  radio_select = (e, item) => {
    if (item.callback) {
      item.callback(e);
    }
  };

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
    const uploadButtonVideo = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">上传视频</div>
      </div>
    );
		if (val.type == 'input') {
			return (<FormItem
					key={index}
					extra={val.extra}
					style={{ width: '80%' }}
				>
					{getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(
						<Input maxLength={val.maxLength!=undefined?val.maxLength:250} disabled={val.disable != undefined ? val.disable : false} className={styles.item}
						        placeholder={val.placeholder}/>,
					)}
				</FormItem>
			);
		}else if (val.type == 'show_text') {
		  //内容展示，目前用于商品详情页
      return (<FormItem
          key={index}
          extra={val.extra}
          style={{ width: '80%' }}
        >
          <div style={{color:this.props.r_color!=undefined?this.props.r_color:'#999',fontWeight: this.props.r_fontw!=undefined?this.props.r_fontw:'500',lineHeight:'16px'}}>
            {val.text.length>84
              ?<Tooltip placement="bottomRight" title={val.text}>
                <span className={styles.word_break}>{val.text.substring(0,83)}...</span>
              </Tooltip>
              :val.text
            }
          </div>
        </FormItem>
      );
    }else if (val.type == 'show_text1') {
        //内容展示，目前用于商品详情页
    return (<FormItem
        key={index}
        extra={val.extra}
        style={{ width: '80%' }}
      >
        <div style={{color:this.props.r_color!=undefined?this.props.r_color:'#999',fontWeight: this.props.r_fontw!=undefined?this.props.r_fontw:'500',lineHeight:'16px'}} title={val.text}>{val.text.length > 30 ? val.text.substring(0,30) + '...' : val.text}</div>
      </FormItem>
    );
  }else if (val.type == 'show_goods_img_more') {
		  //展示商品图片（多图），目前用于商品详情页
      return (<FormItem
          key={index}
          extra={val.extra}
          style={{ width: '100%' }}
        >
          <div className={global.flex_row_start_center}>
            {val.data.length > 0 &&  val.data.map((item,index)=>{
              return <div key={index} className={global.flex_row_center_center} onClick={() => this.sldShowImgPre(val,item.imageUrl)} style={{overFlow:'hidden',width:100,height:100,backgroundColor:'#F8F8F8',marginRight:10}}>
                <img style={{ maxWidth: '100%', maxHeight: '100%' }} src={item.imageUrl} />
              </div>;
            })}
          </div>
        </FormItem>
      );
    }else if (val.type == 'show_video') {
		  //展示商品视频
      return (<div style={{marginTop:12,position:'relative'}}>
          <video width={102} height={102} src={val.initialValue} controls autoPlay/>
        </div>
      );
    } else if (val.type == 'inputnum') {
			//数字搜索框
			return (
				<FormItem key={index}
				          style={{ width: '80%' }}
				          extra={val.extra}
				>
					{getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(<InputNumber
						min={val.min != undefined ? val.min : 0}
						max={val.max != undefined ? val.max : 999999999}
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
					{getFieldDecorator(val.name, val.initialValue ? {
						initialValue: val.initialValue,
						rules: val.rules,
					} : {
						rules: val.rules,
					})(
						<Select placeholder={val.placeholder}
                    className={styles.item}
                    onChange={val.onChange}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
            >
							{val.sel_data.map((items, indexs) => {
								return <Option key={indexs}
								               value={val.diy != undefined && val.diy ? items[val.sele_key] : items.key}>{val.diy != undefined && val.diy ? items[val.sele_name] : items.name}</Option>;
							})}
						</Select>,
					)}
				</FormItem>
			);

		} else if (val.type == 'multiple_select') {
			//下拉多选框
			return (<FormItem
					key={index}
					style={{ width: val.width != undefined ? val.width : ' 80%' }}
					extra={val.extra}
				>
					{getFieldDecorator(val.name, val.initialValue ? {
						initialValue: val.initialValue,
						rules: val.rules,
					} : {
						rules: val.rules,
					})(
						<Select mode="multiple"
                    placeholder={val.placeholder}
                    className={styles.item}
                    onChange={val.onChange}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
            >
							{val.sel_data.map((items, indexs) => {
								return <Option key={indexs}
								               value={val.diy != undefined && val.diy ? items[val.sele_key] : items.key}>{val.diy != undefined && val.diy ? items[val.sele_name] : items.name}</Option>;
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
                    maxLength={val.maxLength!=undefined?val.maxLength:250}
					          disabled={val.is_disable != undefined && val.is_disable ? true : false}
					          style={{ minHeight: 32 }} rows={2} placeholder={val.placeholder}/>,
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
              showTime={val.show_time != undefined ? val.show_time : false}
							// className={styles.item}
              placeholder={[val.placeholder1, val.placeholder2]}
              getCalendarContainer={(triggerNode)=>{
                return triggerNode.parentNode
              }}
						/>,
					)}
				</FormItem>
			);
		}else if (val.type == 'checkboxgroup') {
			//checkbox多选
			return (<FormItem
					key={index}
					style={{ width: '100%' }}
					extra={val.extra}
				>
          {getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(
            <CheckboxGroup options={val.sldOptions} onChange={(value) => this.sldCheckShop(val, value)}/>,
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
                        showTime={val.show_time != undefined ? val.show_time : false}
                        getCalendarContainer={(triggerNode)=>{
                          return triggerNode.parentNode
                        }}
            />,
					)}
					{!val.initialValue && getFieldDecorator(val.name, { rules: val.rules })(
						<DatePicker className={styles.item}
                        placeholder={val.placeholder}
                        showTime={val.show_time != undefined ? val.show_time : false}
                        getCalendarContainer={(triggerNode)=>{
                          return triggerNode.parentNode
                        }}
            />,
					)}
				</FormItem>
			);
		} else if (val.type == 'rangeval') {
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
						<Input style={{ width: 150, marginLeft: 3 }} disabled={true} addonAfter={sldInputAfterAddons()}
						       placeholder={val.placeholder}/>,
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
			//店铺分类选择
			return (<FormItem
					key={index}
					extra={val.extra}
					style={{ width: '80%' }}
				>
					{getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(
						<Cascader
							disabled={val.disable != undefined && val.disable ? val.disable : false}
							fieldNames={{ label: 'title', value: 'key', children: 'children' }}
							className={styles.item} options={val.options}
							placeholder={val.placeholder}/>,
					)}
				</FormItem>
			);
		}else if (val.type == 'cascader_area') {
			//三级地址选择
			return (<FormItem
					key={index}
					extra={val.extra}
					style={{ width: '80%' }}
				>
					{getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(
						<Cascader
							disabled={val.disable != undefined ? val.disable : false}
							options={JSON.parse(localStorage.getItem('common_area_list'))}
							placeholder={val.placeholder}
						/>,
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
							disabled={val.disable != undefined && val.disable ? val.disable : false}
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
				>
					{getFieldDecorator(val.name, {
						valuePropName: 'checked',
						rules: val.rules,
						initialValue: val.initialValue,
					})(
						<RadioGroup disabled={val.disabled} size={'small'} defaultValue={val.initialValue} className={styles.item}
						            onChange={(e) => this.redioOnChange(e, val)}>
							{val.sel_data.map((item, index) => {
								return <Radio key={index} value={item.key}>{item.name}</Radio>;
							})}
						</RadioGroup>,
					)}
				</FormItem>
			);
		} else if (val.type == 'radio_select') {
      return (<FormItem
        key={index}
        extra={val.extra}
        style={{ width: '100%' }}
      >
        {getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(
          <Radio.Group size={'small'} buttonStyle="solid" disabled={val.disable}
                       onChange={(e) => this.radio_select(e, val)}>
            {val.data.map((cval, ckey) => {
              return <Radio.Button key={ckey} value={cval.key}>{cval.value}</Radio.Button>;
            })}

          </Radio.Group>,
        )}
      </FormItem>);
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
				extra={val.extra}
        style={{width:800}}
			>
				<Upload
					beforeUpload={sldBeforeUpload}
					withCredentials={true}
					accept={'.gif, .jpeg, .png,.jpg,'}
					name={val.upload_name}
					action={val.upload_url}
					listType="picture-card"
					fileList={val.fileList}
					onPreview={(info) => val.uploadPreview(info)}
					onChange={(info) => val.uploadChange(info,val.extra_param!=undefined?val.extra_param:{})}
          headers={{
            Authorization: 'Bearer ' + getLocalStorageStingVal('sld_token')
          }}
				>
					{val.fileList.length >= (val.num!=undefined?val.num:6) ? null : uploadButton}
				</Upload>
			</FormItem>;
		} else if (val.type == 'upload_video') {
      return <FormItem
        key={index}
        extra={val.extra}
      >
        {val.fileList.length > 0 && val.fileList[0].status == 'done' && val.fileList[0].response != undefined
          ? <div style={{ marginTop: 12, position: 'relative' }}>
            <video width={102} height={102} src={val.fileList[0].response.data.url} controls autoPlay/>
            <div style={{ position: 'absolute', zIndex: 99, top: '-11px', left: '93px' }}
                 onClick={() => val.delVideo()}>
              <ALibbSvg
                fill={'#c8c8c8'} width={18} height={18} type={'qingchu'}/>
            </div>
          </div>
          : <Upload
            beforeUpload={sldBeforeUploadVideo}
            withCredentials={true}
            accept={'.mp4'}
            name={val.upload_name}
            action={val.upload_url}
            listType="picture-card"
            fileList={val.fileList}
            onPreview={(info) => val.uploadPreview(info)}
            onChange={(info) => val.uploadChange(info, val.extra_param != undefined ? val.extra_param : {})}
          >
            {val.fileList.length == 0 && uploadButtonVideo}
          </Upload>
        }
      </FormItem>;
    } else if (val.type == 'show_img_more') {
			return <FormItem
				key={index}
				style={{ width: '100%' }}
				extra={val.extra}
			>
        <div className={`${global.flex_row_start_center}`}>
          {val.data.map((item,index)=>{
            return <div key={index} className={`${global.flex_row_center_center}`}>
              {getSldComImg(item,200,200,100,100)}
            </div>
          })}

        </div>
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
                <Checkbox.Group disabled={val.disable != undefined && val.disable ? val.disable : false}
                                style={{ width: '100%' }}>
                  <Row>
                    {vall.attrList.map((valr, keyr) => {
                      return <Col key={keyr} span={4}><Checkbox
                        value={valr.id}>{valr.name}</Checkbox>
                        {vall.type == 2 &&
                        <Upload
                          beforeUpload={sldBeforeUpload}
                          withCredentials={true}
                          accept={'.gif, .jpeg, .png,.jpg,'}
                          name={val.upload_name}
                          action={val.upload_url}
                          listType="picture-card"
                          fileList={[]}
                          onPreview={(info) => val.uploadPreview(info)}
                          onChange={(info) => val.uploadChange(info)}
                          headers={{
                            Authorization: 'Bearer ' + getLocalStorageStingVal('sld_token'),
                          }}
                        >
                          {uploadButton}
                        </Upload>
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
    } else if (val.type == 'add_reserve_info') {
      //添加用户预留信息
      let con = <div className={styles.spec_wrap}>
        {val.sel_data.map((sel_item,sel_index)=>{
          return <div key={sel_index} className={`${global.flex_row_start_start}`} style={{marginBottom:8}}>
            <FormItem
              style={{ width: 230,display:'flex' }}
              label={' '}
              colon={false}
            >
              {getFieldDecorator(`reserveName_${sel_item.key}`, { initialValue: sel_item.reserveName, rules:[{
                  required: true,
                  whitespace: true,
                  message: `${sldComLanguage('该项必填')}～`,
                }] })(
                <Input maxLength={10}
                       className={styles.item}
                       onChange={(e)=>val.handleReserveInfo(e.target.value,sel_item.key,'reserveName')}
                       placeholder={sldComLanguage('请输入预留信息名称,最多10个字')}/>,
              )}
            </FormItem>
            <div className={`${global.flex_row_start_center}`}>
              <Select placeholder={val.placeholder}
                      value={sel_item.reserveType}
                      className={styles.item}
                      onChange={(e)=>val.handleReserveInfo(e,sel_item.key,'reserveType')}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
              >
                {reserveInfoLimitType().map(type_item => {
                  return <Option key={type_item.key}
                                 value={type_item.value}>{type_item.value}</Option>;
                })}
              </Select>
              <div style={{width:130,marginLeft:10}} className={`${global.flex_row_start_center}`}><Checkbox onChange={(e)=>val.handleReserveInfo(e.target.checked,sel_item.key,'isRequired')} checked={sel_item.isRequired==1?true:false}>{sldComLanguage('必填')}</Checkbox>
                <div onClick={() => val.delReserveInfo(sel_item.key)} style={{paddingTop:4}}>
                  <ALibbSvg fill={'#e20e0e'} width={15} height={15} type={'shanchu7'}/>
                </div>
              </div>
            </div>
          </div>
        })}
        <div onClick={val.addReserveInfo} className={`${global.add_goods_bottom_btn}`}
             style={{ width: 95, marginLeft: 10 }}>
          {sldComLanguage('新增预留信息')}
        </div>
      </div>;
      return con;
    } else if (val.type == 'show_text_btn') {
			return <FormItem
				key={index}
				extra={val.extra}
			>
				<div>
					<span>{val.initialValue}</span>
					{val.btn != undefined &&
					<Button style={{ marginLeft: 10 }} key="submit" type="primary" loading={false}
					        onClick={val.btn.callback}>
						{val.btn.text}
					</Button>
					}
				</div>
			</FormItem>;
		} else if (val.type == 'cascader_common') {
      //多级联动选择器-通用
      return (<FormItem
          key={index}
          style={{ width: '100%' }}
          extra={val.extra}
        >
          {getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(
            <Cascader options={val.data}
                      fieldNames={val.fieldNames != undefined ? val.fieldNames : {
                        label: 'label',
                        value: 'value',
                        children: 'children',
                      }}
                      onChange={(value, selectedOptions) => val.onChange(selectedOptions)}
                      placeholder={val.placeholder}/>,
          )}
        </FormItem>
      );
		}


	};

	render() {
		const { data, lwidth, rwidth, totalHeght, part_width  } = this.state.props_data;
		const {screenW} = this.state;
		let {
			form: { getFieldDecorator },
		} = this.props;
    const total_width = screenW-190;
		const cur_height = totalHeght != undefined ? totalHeght : 70;
		return (
			<div className={styles.sld_table_row_two} style={{ height: totalHeght }}>
				<div className={styles.sld_det_lr_wrap}>
					{data != undefined && data.length > 0 && data.map((val, index) => {
						return <div className={styles.sld_det_lr_item_wrap} key={index} style={{
							width: `${(part_width != undefined ? part_width : 50)*0.01*total_width-2}px`,
							height: val.item_height!=undefined?val.item_height+1:cur_height + 1,
						}}>
            <span className={styles.sld_det_r_item} style={{
	            flexDirection: 'row',
	            alignItems: 'center',
	            justifyContent: 'flex-end',
	            width: `${lwidth != undefined ? lwidth : 20}%`,
	            backgroundColor: '#FFFAF7',
	            height: val.item_height!=undefined?val.item_height+2:cur_height + 2,
            }}>
              {val.required != undefined && val.required && <span style={{ color: 'red' }}>*</span>}
	            <span className={styles.sld_det_r_text} style={{ fontWeight: this.props.l_fontw!=undefined?this.props.l_fontw:'600',color:this.props.l_color!=undefined?this.props.l_color:'#333'}}>{val.label}</span>
            </span>
							<span className={styles.sld_det_r_item} style={{
								width: `${rwidth != undefined ? rwidth : 80}%`,
								alignItems: 'flex-start',
								paddingLeft: 20,
								height: val.item_height!=undefined?val.item_height+2:cur_height + 2,
								borderRightWidth: 1,
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
