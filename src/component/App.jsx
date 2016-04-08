import React from 'react';
import {
	Breadcrumb,QueueAnim,message,Button
}
from 'antd';

import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import MenuBox from "./Menu.jsx";
import LoadingTable from "./LoadingTable.jsx";



var App = React.createClass({
	success : function() {
		message.success('这是一条成功提示');
	},

	error : function() {
		message.error('这是一条报错提示');
	},

	warn : function() {
		message.warn('这是一条警告提示');
	},
	render () {
		const key = this.props.location.pathname;
		return (
			<div className="main-layout">
			    <Header/>
			    
		    	<div className="layout-main" style={{minHeight:'600px'}}>
		        	<aside className="layout-sider">
				        <MenuBox />
				    </aside>
			        <div className="layout-container">
						<div className="layout-breadcrumb">
			        		{/*<Button onClick={this.success}>显示成功提示</Button>
  							<Button onClick={this.error}>显示报错提示</Button>
  							<Button onClick={this.warn}>显示警告提示</Button>*/}
  							<Breadcrumb {...this.props}></Breadcrumb>
			        	</div>
			        	{React.cloneElement(this.props.children, { key })}
			        {/*	<QueueAnim type={['right', 'left']} duration={500}>
				          {React.cloneElement(this.props.children, { key })}
				       </QueueAnim>*/}
			        </div>
		      	</div>
	        	<Footer/>
	    	</div>
		);
	}
});

export default App;

