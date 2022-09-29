import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import { sldLlineRtextAddGoodsAddMargin,sldComLanguage, } from '@/utils/utils';
import global from '@/global.less';
import VideoLists from './video_lists';
import VideoCheckLists from './video_check_lists';

const TabPane = Tabs.TabPane;
@connect(({ svideo }) => ({
  svideo,
}))
@Form.create()
export default class VideoManage extends Component {
	constructor(props) {
		super(props);
		this.state = {
      updateFlag:'',//更新数据标识 1:作品列表
    };
	}
	componentDidMount() {

	}

  setUpdateFlag = (flag) => {
    this.setState({updateFlag:flag})
  }

	render() {
    const {updateFlag} = this.state;
		return (
			<div className={global.common_page} style={{ flex: 1 }}>
				{sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('作品管理')}`, 0, 0, 5)}
				<Tabs type="card" defaultActiveKey="1" animated={false} onTabClick={this.onHandleTabClick}>
					<TabPane tab={`${sldComLanguage('作品列表')}`} key="1">
						<VideoLists updateFlag={updateFlag} setUpdateFlag={this.setUpdateFlag}/>
					</TabPane>
					<TabPane tab={`${sldComLanguage('作品审核')}`} key="2">
						<VideoCheckLists updateFlag={updateFlag} setUpdateFlag={this.setUpdateFlag}/>
					</TabPane>
				</Tabs>
			</div>

		);
	}
}
