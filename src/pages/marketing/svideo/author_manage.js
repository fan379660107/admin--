import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import { sldLlineRtextAddGoodsAddMargin,sldComLanguage, } from '@/utils/utils';
import global from '@/global.less';
import AuthorLists from './author_lists';
import AuthorCheckLists from './author_check_lists';

const TabPane = Tabs.TabPane;
@connect(({ product }) => ({
	product,
}))
@Form.create()
export default class JoinLists extends Component {
	constructor(props) {
		super(props);
		this.state = {
      updateFlag:'',//更新数据标识 1:作者列表
    };
	}
	componentDidMount() {}

  setUpdateFlag = (flag) => {
    this.setState({updateFlag:flag})
  }

	render() {
	  const {updateFlag} = this.state;
		return (
			<div className={global.common_page} style={{ flex: 1 }}>
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('作者管理')}`, 0, 0, 10)}
				<Tabs type="card" defaultActiveKey="1" animated={false}>
					<TabPane tab={`${sldComLanguage('作者列表')}`} key="1" >
						<AuthorLists updateFlag={updateFlag} setUpdateFlag={this.setUpdateFlag}/>
					</TabPane>
					<TabPane tab={`${sldComLanguage('作者审核')}`} key="2">
						<AuthorCheckLists updateFlag={updateFlag} setUpdateFlag={this.setUpdateFlag}/>
					</TabPane>
				</Tabs>

			</div>

		);
	}
}
