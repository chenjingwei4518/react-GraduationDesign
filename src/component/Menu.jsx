import React from 'react';
import {
	Menu, Icon
}
from 'antd';
import {Link} from "react-router";
console.log(Link);
var SubMenu = Menu.SubMenu;
var MenuBox = React.createClass({
	getInitialState() {
		return {
			current: '1',
			openKeys: []
		};
	},
	handleClick(e) {
		console.log('click ', e);
		this.setState({
			current: e.key,
			openKeys: e.keyPath.slice(1)
		});
	},
	onToggle(info) {
		this.setState({
			openKeys: info.open ? info.keyPath : info.keyPath.slice(1)
		});
	},
	render: function(){
		return (
			<Menu
	        	mode="inline" theme="linght"
	          	defaultOpenKeys={['sub1']}
	          	defaultSelectedKeys={['1']} 
	          	openKeys={this.state.openKeys}
	          	onOpen={this.onToggle}
        		onClose={this.onToggle}
        		onClick={this.handleClick}>
	          	<SubMenu key="sub1" title={<span><Icon type="user" />系统管理</span>}>
		            <Menu.Item key="1"><Link to={"/user/assignment"}>帐号分配</Link></Menu.Item>
		            <Menu.Item key="2"><Link to={"/user/password"}>修改密码</Link></Menu.Item>
		            <Menu.Item key="3"><Link to={"/user/staff"}>员工信息</Link></Menu.Item>
		            <Menu.Item key="4"><Link to={"/user/cost"}>套餐信息</Link></Menu.Item>
	          	</SubMenu>
	          	<SubMenu key="sub2" title={<span><Icon type="laptop" />报名管理</span>}>
		            <Menu.Item key="5"><Link to={"/enroll/register"}>报名登记</Link></Menu.Item>
		            <Menu.Item key="6"><Link to={"/enroll/list"}>报名列表</Link></Menu.Item>
	          	</SubMenu>
	          	<SubMenu key="sub3" title={<span><Icon type="notification" />业务申请</span>}>
		            <Menu.Item key="9">科目变更</Menu.Item>
		            <Menu.Item key="10">申请补考</Menu.Item>
		            <Menu.Item key="11">申请预约</Menu.Item>
	          	</SubMenu>
	          	<SubMenu key="sub4" title={<span><Icon type="notification" />学员管理</span>}>
		            <Menu.Item key="12"><Link to={"/student/list"}>学员列表</Link></Menu.Item>
		            <Menu.Item key="13">学员流程</Menu.Item>
	          	</SubMenu>
	          	<SubMenu key="sub5" title={<span><Icon type="notification" />考试管理</span>}>
		            <Menu.Item key="14"><Link to={"/exam/subject1"}>科 目 一</Link></Menu.Item>
		            <Menu.Item key="15">科 目 二</Menu.Item>
		            <Menu.Item key="16">科 目 三</Menu.Item>
		            <Menu.Item key="17">科 目 四</Menu.Item>
		            <Menu.Item key="18">预约管理</Menu.Item>
	          	</SubMenu>
	          	<SubMenu key="sub6" title={<span><Icon type="notification" />缴费管理</span>}>
		            <Menu.Item key="19">学员费用</Menu.Item>
		            <Menu.Item key="20">车辆费用</Menu.Item>
	          	</SubMenu>
	          	<SubMenu key="sub7" title={<span><Icon type="notification" />教练管理</span>}>
		            <Menu.Item key="21"><Link to={"/trainer/list"}>教练列表</Link></Menu.Item>
	          	</SubMenu>
	          	<SubMenu key="sub8" title={<span><Icon type="notification" />车辆管理</span>}>
		            <Menu.Item key="23"><Link to={"/car/list"}>教练车列表</Link></Menu.Item>
	          	</SubMenu>
	        </Menu>
		)
	}
});

export default MenuBox;