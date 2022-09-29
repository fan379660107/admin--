/*
* 公共头部
* type 1 顶部标题和提示不在当前组件里
* type 2 顶部标题和提示都在当前组件里
* */
import React, { Component, Fragment } from 'react';
import ALibbSvg from '../ALibbSvg';
import styles from './index.less';
import global from '@/global.less';
import { showMoreHelpTip, getSldEmptyH, commonSetting,sldIconBtnBg,sldComLanguage } from '@/utils/utils';

export default class SldComHeader extends Component {

	constructor(props) {
		super(props);
		this.state = {
			sld_show_tip: true,
		};
	}

	componentDidMount() {

	}

	toggleTip = () => {
	  let _this = this;
		this.setState({
			sld_show_tip: !this.state.sld_show_tip,
		},()=>{
      if(_this.props.handleToggleTip){
        _this.props.handleToggleTip(_this.state.sld_show_tip);
      }
    });
	};

	render() {
		const { title, type, tip_title, tip_data,right_ope,right_ope_btn_text } = this.props;
		const { sld_show_tip } = this.state;
		return (
			<Fragment>
				{type == 1 &&
				<div className={`${styles.top_part} ${global.flex_row_start_center}`}>
					<span style={{ backgroundColor: '#FA6F1E' }} className={styles.left_border}/>
					<span className={styles.title}>{title}</span>
          {commonSetting.operateTipSwitch&&
          <a title={sld_show_tip?`${sldComLanguage("隐藏提示")}`:`${sldComLanguage("显示提示")}`} href={'javascript:void(0)'} className={styles.tip} onClick={() => this.toggleTip()}>
            <ALibbSvg fill={'#ff9864'} width={16} height={16} type={'ziyuan18'}/>
          </a>
          }
				</div>
				}

				{type == 2 &&
				<Fragment>
          <div className={global.flex_com_space_between} >
            <div className={`${styles.top_part} ${global.flex_row_start_center}`}>
              <span style={{ backgroundColor: '#FA6F1E' }} className={styles.left_border}/>
              <span className={styles.title}>{title}</span>
              {commonSetting.operateTipSwitch&&
              <a title={sld_show_tip?`${sldComLanguage("隐藏提示")}`:`${sldComLanguage("显示提示")}`} href={'javascript:void(0)'} className={styles.tip} onClick={() => this.toggleTip()}>
                <ALibbSvg fill={'#ff9864'} width={16} height={16} type={'ziyuan18'}/>
              </a>
              }
            </div>
            {right_ope!=undefined&&right_ope&&
            sldIconBtnBg(right_ope, 'ziyuan23', right_ope_btn_text!=undefined?right_ope_btn_text:`${sldComLanguage("订单导出")}`, '#fff', 7, 0, 15, 15, 3)
            }
          </div>
					{sld_show_tip &&
					<Fragment>
						{getSldEmptyH(10)}
						{showMoreHelpTip(tip_title, tip_data)}
					</Fragment>
					}{/*操作提示*/}
					{getSldEmptyH(10)}
				</Fragment>

				}

			</Fragment>
		);
	}
}
