import React from 'react';
import {
  Form, Button,Input, Row, Col,Select
}
from 'antd';
var createForm = Form.create;
var FormItem = Form.Item;
var Option = Select.Option;
var SearchBox = React.createClass({
	getInitialState() {
		return {};
	},
	handleReset: function(e) {
		e.preventDefault();
		this.props.form.resetFields();
	},

	handleSubmit: function(e) {
		e.preventDefault();
		this.props.form.validateFields((errors, values) => {
			if (!!errors) {
				return;
			}
			this.props.handleSubmit&&this.props.handleSubmit(values);
		});
	},
  render() { 	
  	var data = this.props.data||[{
  		type:"input",
  		label:"label1",
  		name:"label1",
  		placeholder:"label1提示",

  	},{
  		type:"input",
  		label:"label2",
  		name:"label2",
  		placeholder:"label2提示"
  	},{
  		type:"select",
  		label:"label3",
  		name:"label3",
  		placeholder:"label3提示",
  		data:[{
  			id:"1",
  			text:"select1"
  		},{
  			id:"2",
  			text:"select2"
  		}]
  	}];
  	var rows = [];
  	var { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
  	for(var i=0;i<data.length;i++){
  		if(data[i].type=="input"){
  			rows.push(
				<Col span="8" key={i}> 
			      <FormItem
			        label= {data[i].label+"："}
			        labelCol={{ span: 5 }}
			        wrapperCol={{ span: 14 }}>
			        <Input {...getFieldProps(data[i].name)} placeholder={data[i].placeholder}/>
			      </FormItem>
			    </Col>);
  		}else{
  			var options = [];
  			for(var j=0;j<data[i].data.length;j++){
  				options.push(<Option key={j} value={data[i].data[j].id+""}>{data[i].data[j].text}</Option>);
  			}
  			rows.push(
  				 <Col span="8" key={i}> 
			      <FormItem
			        label= {data[i].label+"："}
			        labelCol={{ span: 5 }}
			        wrapperCol={{ span: 14 }}>
			        <Select {...getFieldProps(data[i].name)} placeholder={data[i].placeholder}>
                    	{options}
                  	</Select>
			      </FormItem>
			    </Col>);
  		}
		
  	}
  	var form = [];
  	for(var i=0;i<(rows.length%3==0?rows.length/3:rows.length/3+1);i++){
		form.push(
			<Row key={i}>
				{rows[i]?rows[i]:""}
				{rows[i+1]?rows[i+1]:""}
				{rows[i+2]?rows[i+2]:""}
			</Row>	
	    );
  	}
  	form.push(
	  <Row key={999}>
	    <Col span="8" offset="9">
	      <Button type="primary" htmlType="submit" onClick={this.handleSubmit} style={{"marginRight":"40px"}}>搜索</Button>
	      <Button type="ghost"  onClick={this.handleReset}>清除条件</Button>
	    </Col>
	  </Row>
  	)
      return ( 
        <Form horizontal className="advanced-search-form" style={{marginTop:'15px'}}>
		  {form}
		</Form>
   );
  }
})
SearchBox = createForm()(SearchBox);
export default SearchBox;

