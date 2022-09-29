import React, { PureComponent } from 'react';
import { FormattedMessage, formatMessage } from 'umi/locale';
import { Tag, Menu, Icon, Tooltip } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { sldComLanguage } from '@/utils/utils';
import { specialFlag } from '@/utils/sldconfig';

export default class GlobalHeaderRight extends PureComponent {

	getNoticeData() {
		const { notices = [] } = this.props;
		if (notices.length === 0) {
			return {};
		}
		const newNotices = notices.map(notice => {
			const newNotice = { ...notice };
			if (newNotice.datetime) {
				newNotice.datetime = moment(notice.datetime).fromNow();
			}
			if (newNotice.id) {
				newNotice.key = newNotice.id;
			}
			if (newNotice.extra && newNotice.status) {
				const color = {
					todo: '',
					processing: 'blue',
					urgent: 'red',
					doing: 'gold',
				}[newNotice.status];
				newNotice.extra = (
					<Tag color={color} style={{ marginRight: 0 }}>
						{newNotice.extra}
					</Tag>
				);
			}
			return newNotice;
		});
		return groupBy(newNotices, 'type');
	}

	getUnreadData = noticeData => {
		const unreadMsg = {};
		Object.entries(noticeData).forEach(([key, value]) => {
			if (!unreadMsg[key]) {
				unreadMsg[key] = 0;
			}
			if (Array.isArray(value)) {
				unreadMsg[key] = value.filter(item => !item.read).length;
			}
		});
		return unreadMsg;
	};

	changeReadState = clickedItem => {
		const { id } = clickedItem;
		const { dispatch } = this.props;
		dispatch({
			type: 'global/changeNoticeReadState',
			payload: id,
		});
	};

	// 同步数据操作
	handleSync = () => {
		const { dispatch } = this.props;
		dispatch({
			type: 'login/update_setting',
		});
	}

	render() {
		const {
			onMenuClick,
			theme,
		} = this.props;
		const menu = (
			<Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        {specialFlag>-3&&
        <Menu.Item key="version">
          当前版本:v7.1
        </Menu.Item>
        }
				<Menu.Item key="userinfo">
					<Icon type="setting"/>
          {sldComLanguage('修改密码')}
				</Menu.Item>
				<Menu.Item key="logout">
					<Icon type="logout"/>
          {sldComLanguage('退出登录')}
				</Menu.Item>
			</Menu>
		);
		const noticeData = this.getNoticeData();
		const unreadMsg = this.getUnreadData(noticeData);
		let className = styles.right;
		if (theme === 'dark') {
			className = `${styles.right}  ${styles.dark}`;
		}
		return (
			<div className={className}>
				<Tooltip title={formatMessage({ id: `${sldComLanguage('同步')}` })}>
					<a
						onClick={()=>this.handleSync()}
						href={'javascript:void(0)'}
						rel="noopener noreferrer"
						className={styles.action}
					>
						<Icon style={{ color: '#555', fontSize: 16 }} type="sync"/>
					</a>
				</Tooltip>
				<HeaderDropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <span
				  className={styles.name}>{(localStorage.getItem('user_info') != '' && localStorage.getItem('user_info') != null) ? JSON.parse(localStorage.getItem('user_info')).user_name : 'admin'}</span>
            </span>
				</HeaderDropdown>
				{/*<SelectLang className={styles.action}/>*/}
			</div>
		);
	}
}
