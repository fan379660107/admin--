import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Menu, Icon } from 'antd';
import Link from 'umi/link';
import { urlToList } from '../_utils/pathTools';
import { getMenuMatches } from './SiderMenuUtils';
import { isUrl } from '@/utils/utils';
import styles from './index.less';
import { specialFlag } from '@/utils/sldconfig';

const { SubMenu } = Menu;
const getIcon = icon => {
	if (typeof icon === 'string' && isUrl(icon)) {
		return <img src={icon} alt="icon" className={styles.icon}/>;
	}
	if (typeof icon === 'string') {
		return <Icon type={icon}/>;
	}
	return icon;
};

export default class BaseMenu extends PureComponent {
	/**
	 * 获得菜单子节点
	 * @memberof SiderMenu
	 */
	getNavMenuItems = (menusData, parent = '') => {
		if (!menusData) {
			return [];
		}
		let sldCurSeleTop = '';
		if (parent != '') {
			let sld_clear_xiegang = parent.split('/');
			let sldCurSeleTopArray = sld_clear_xiegang[1].split('_');
			sldCurSeleTop = sldCurSeleTopArray[0];
		}
		return menusData
			.filter(item => item.name && !item.hideInMenu)
			.map((item) => {
				let sld_item_path = item.path;
				let sld_item_sele = sld_item_path.split('/')[1];
				let sld_path_pre = sld_item_sele.split('_')[0];
				if (sld_path_pre == sldCurSeleTop) {
					const ItemDom = this.getSubMenuOrItem(item, sldCurSeleTop);
					return this.checkPermissionItem(item.authority, ItemDom);
				}
			})
			.filter(item => !!item);
	};

	// Get the currently selected menu
	getSelectedMenuKeys = pathname => {
		const { flatMenuKeys } = this.props;
		return urlToList(pathname).map(itemPath => getMenuMatches(flatMenuKeys, itemPath).pop());
	};

	/**
	 * get SubMenu or Item
	 */
	getSubMenuOrItem = (item, sldCurSeleTop) => {
		let pathname = item.path;
		let pathnamearray = pathname.split('_');
		let sld_path_pre_array = pathnamearray[0].split('/');
		let sld_path_pre = sld_path_pre_array[1];
		if (sld_path_pre == sldCurSeleTop && item.children && item.children.some(child => child.name)) {
			return (
				<SubMenu
					title={
						item.icon ? (
							<span>
                {specialFlag > -3&&(item.path == '/marketing_live'||item.path == '/marketing_spreader')
                  ?<img src={require('@/assets/must_add.png')}  style={{marginLeft:0,width:32,height:16,marginTop:-5,marginRight:3}}/>
                  :getIcon(item.icon)
                }
								<span style={this.props.isShowYiJi}>{item.name}</span>
              </span>
						) : item.name
					}
					key={item.path}
				>
					{this.getNavMenuItems(item.children, this.props.location.pathname)}
				</SubMenu>
			);
		} else {
			return (
				<Menu.Item key={item.path}>
					{this.getMenuItemPath(item)}
				</Menu.Item>
			);
		}
	};

	/**
	 * 判断是否是http链接.返回 Link 或 a
	 * Judge whether it is http link.return a or Link
	 * @memberof SiderMenu
	 */
	getMenuItemPath = item => {
		const { name } = item;
		const itemPath = this.conversionPath(item.path);
		const icon = getIcon(item.icon);
		const { target } = item;
		// Is it a http link
		if (/^https?:\/\//.test(itemPath)) {
			return (
				<a href={itemPath} target={target}>
					{icon}
					<span>{name}</span>
				</a>
			);
		}
		const { location, isMobile, onCollapse } = this.props;
		return (
			<Link
				to={itemPath}
				target={target}
				replace={itemPath === location.pathname}
				onClick={
					isMobile
						? () => {
							onCollapse(true);
						}
						: undefined
				}
			>
				{icon}
				<span>{name}</span>
			</Link>
		);
	};

	// permission to check
	checkPermissionItem = (authority, ItemDom) => {
		const { Authorized } = this.props;
		if (Authorized && Authorized.check) {
			const { check } = Authorized;
			return check(authority, ItemDom);
		}
		return ItemDom;
	};

	conversionPath = path => {
		if (path && path.indexOf('http') === 0) {
			return path;
		}
		return `/${path || ''}`.replace(/\/+/g, '/');
	};

	render() {
		const {
			openKeys,
			theme,
			mode,
			location: { pathname },
			className,
			collapsed,
		} = this.props;
		// if pathname can't match, use the nearest parent's key
		let selectedKeys = this.getSelectedMenuKeys(pathname);
		if (!selectedKeys.length && openKeys) {
			selectedKeys = [openKeys[openKeys.length - 1]];
		}
		let props = {};
		if (openKeys && !collapsed) {
			props = {
				openKeys: openKeys.length === 0 ? [...selectedKeys] : openKeys,
			};
		}
		const { handleOpenChange, style, menuData } = this.props;
		const cls = classNames(className, {
			'top-nav-menu': mode === 'horizontal',
		});
		return (
			<Menu
				key="Menu"
				mode={mode}
				theme={theme}
				onOpenChange={handleOpenChange}
				selectedKeys={selectedKeys}
				style={style}
				className={cls}
				{...props}
			>
				{this.getNavMenuItems(menuData, this.props.location.pathname)}
			</Menu>
		);
	}
}
