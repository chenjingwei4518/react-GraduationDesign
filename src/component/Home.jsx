import React from 'react';

import {
	Icon,Carousel
}
from 'antd';

var Home = React.createClass({
	render: function() {
		return (
			<div className="ant-home">
				<div className="banner">
					<Carousel autoplay="true" vertical="true">
					    <div className="banner-item"><h3>1</h3></div>
					    <div className="banner-item"><h3>2</h3></div>
					    <div className="banner-item"><h3>3</h3></div>
					    <div className="banner-item"><h3>4</h3></div>
				  	</Carousel>
				</div>
				<div className="content">
					<BlockNav></BlockNav>
				</div>
			</div>
		);
	}
});

var BlockNav = React.createClass({
	render() {
		return (
			<nav className="nav-block">
				<BlockNav.Item />
				<BlockNav.Item />
				<BlockNav.Item />
				<BlockNav.Item />
				<BlockNav.Item />
				<BlockNav.Item />
			</nav>
		);
	}
});

BlockNav.Item = React.createClass({
	render() {
		return (
			<div className="nav-block-item col-8">
				<Icon className="icon" type="area-chart" />
				<h4 className="name">报表</h4>
				<p className="text">内容内容内容内容内容</p>
			</div>
		);
	}
})

export default Home;