/*
* 单图广告
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form } from 'antd';
import {
	isEmptyObject,
	sldTsvgBotText,
	sldComLanguage,
} from '@/utils/utils';
import global from '@/global.less';
import styles from '../pcdecorate.less';
import SldDiySingleImgModal from '@/components/SldDiySingleImgModal/SldDiySingleImgModal';


let sthis = '';
let getFieldDecorator_new = '';
@connect(({ product }) => ({
	product,
}))
@Form.create()
export default class Adv_01 extends Component {
	constructor(props) {
		super(props);
		sthis = this;
		const {
			form: { getFieldDecorator },
		} = props;
		getFieldDecorator_new = getFieldDecorator;
		this.state = {
			tpl_adv_01_modal_tip: [],//modal框提示
			submiting: false,//按钮loading
			modalVisible: false,//是否展示modal
			tpl_info: props.tpl_info,
			data: {
				type: 'adv_01',
				width: 1200,
				height: 0,//高度为0的话表示不限制
				data: {
					imgUrl: '',
					imgPath: '',
					title: '',
					link_url: '',
					link_type: '',
					link_value: '',
				},
			},//装修的数据

		};
	}

	componentDidMount() {
		let { tpl_info } = this.state;
		this.setState({
			data: tpl_info,
		});
	}

  componentWillReceiveProps(nextProps, nextContext) {
    let { data } = this.state;
    if (JSON.stringify(nextProps.tpl_info) != JSON.stringify(data)) {
      data = nextProps.tpl_info;
      this.setState({ data });
    }
  }

	componentWillUnmount() {

	}

	editTpl = (tip) => {
		this.setState({
			modalVisible: true,
			tpl_adv_01_modal_tip: tip,
		});
	};

	sldHandleConfirm = (val) => {
		let { data } = this.state;
		data.data = val;
		// data.height = ;
		this.setState({
			data,
			modalVisible: false,
		}, () => {
			this.props.save_tpl_data(data, sthis.refs.wrap_html.innerHTML);
		});
	};

	sldHandleCancle = () => {
		this.setState({ modalVisible: false });
	};

	render() {
		const { data, submiting, modalVisible, tpl_adv_01_modal_tip } = this.state;
		return (
			<Fragment>
				<div ref={'wrap_html'} className={global.flex_row_common}>
					<div className={styles.adv_01_wrap}>
						{!isEmptyObject(data.data) && data.data.imgUrl
							? <img className={styles.adv_01_img} src={data.data.imgUrl}/>
							: sldTsvgBotText('kehubiaoqian', `${sldComLanguage('点击上传图片')}`, 10, '', '', '#999', 30, 30, '#999')
						}
						<div className={styles.sld_mask} onClick={() => this.editTpl([
							`${sldComLanguage('请严格根据提示要求上传规定尺寸的广告图片')}`,
							`${sldComLanguage('编辑项中的“操作”指点击该内容所产生的链接地址，可通过下拉选项选择不同的方式')}`,
						])}>
							<span>{sldComLanguage('编辑')}</span>
						</div>
					</div>
				</div>
				<SldDiySingleImgModal
					width={1000}
					title={sldComLanguage('广告图设置')}
					sldSeleSingleRow={true}
					submiting={submiting}
					modalVisible={modalVisible}
					sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
					sldHandleCancle={this.sldHandleCancle}
					content={data}
					modal_tip={tpl_adv_01_modal_tip}
				/>
			</Fragment>
		);
	}
}
