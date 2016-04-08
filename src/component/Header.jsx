import React from 'react';
import {Dropdown,Menu,Icon} from 'antd'
var Header = React.createClass({
	render: function(){
		return (
			<div className="layout-header">
				<div className="logo">Drive-Sys</div>
				<UserBox />
			</div>
		);
	}
});

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
var UserBox = React.createClass({
	getInitialState() {
    return {
      current: 'mail'
    };
  },
   handleClick(e) {
    console.log('click ', e);
    this.setState({
      current: e.key
    });
  },
	render(){
		return (
			<div>
				 <Menu onClick={this.handleClick}
				  	className="user-box"
			        selectedKeys={[this.state.current]}
			        theme={this.state.theme}
			        mode="horizontal">
			        <SubMenu title={<span>CJW4518&nbsp;&nbsp;<Icon type="down" style={{fontSize:'8px'}} /></span>}>
			          <MenuItemGroup>
			            <Menu.Item key="setting:1">个人资料</Menu.Item>
			            <Menu.Item key="setting:2">修改密码</Menu.Item>
			            <Menu.Item key="setting:3">注销</Menu.Item>
			            <Menu.Item key="setting:4">退出</Menu.Item>
			          </MenuItemGroup>
			        </SubMenu>
      			</Menu>
			</div>
		);
	}
})

export default Header;

