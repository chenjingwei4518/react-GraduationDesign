import React from 'react';
import {
  Button, Form, Input,Select,message
}
from 'antd';
import SearchBox from "./SearchBox.jsx";
import ajax from "./Ajax.jsx";
var createForm = Form.create;
var FormItem = Form.Item;
function noop() {
  return false;
}

var AssignmentBox = React.createClass({
  getInitialState() {
    return {
      roleList:[]
    };
  },
  getValidateStatus: function(field) {
    var { isFieldValidating, getFieldError, getFieldValue } = this.props.form;

    if (isFieldValidating(field)) {
      return 'validating';
    } else if (!!getFieldError(field)) {
      return 'error';
    } else if (getFieldValue(field)) {
      return 'success';
    }
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
      ajax({
        url: "/api/driving/user/add",
        data: values,
        success: function(result) {
          message.success("添加成功");
           this.props.form.resetFields();
        }.bind(this),
        error: function(msg) {
          message.error(msg);
        }
      });
    });
  },

  userExists:function(rule, value, callback) {
    if (!value) {
      callback();
    } else {
      setTimeout(() => {
        if (value === 'JasonWood') {
          callback([new Error('抱歉，该用户名已被占用。')]);
        } else {
          callback();
        }
      }, 800);
    }
  },

  checkPass:function(rule, value, callback) {
    var { validateFields } = this.props.form;
    if (value) {
      validateFields(['rePasswd']);
    }
    callback();
  },

  checkPass2:function(rule, value, callback) {
    var { getFieldValue } = this.props.form;
    if (value && value !== getFieldValue('sysPassword')) {
      callback('两次输入密码不一致！');
    } else {
      callback();
    }
  },
  componentDidMount:function(){
     ajax({
        url: "/api/driving/role/list",
        data: {},
        success: function(result) {
         this.setState({
            roleList:result.list
         });
        }.bind(this),
        error: function(msg) {
          message.error(msg);
        }
      });
  },
  render:function() {
    var { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
    var sysNameProps = getFieldProps('sysName', {
      rules: [
        { required: true, min: 2, message: '用户名至少为 2 个字符' },
        { validator: this.userExists },
      ],
    });
    var roleProps = getFieldProps('roleId', {
      rules: [
        { required: true, message: '请选择角色' }
      ],
    });
    var idcardProps = getFieldProps('idcard', {
       rules: [
        { required: true, min: 18, message: '身份证至少为 18 个位' }    
      ],
    });
    var passwdProps = getFieldProps('sysPassword', {
      validate: [{
        rules: [{
          required: true,
          whitespace: true,
          message: '请输入密码',
        }, {
          validator: this.checkPass,
        }],
        trigger: 'onBlur',
      }]
    });
    var rePasswdProps = getFieldProps('rePasswd', {
      validate: [{
        rules: [{
          required: true,
          whitespace: true,
          message: '请再次输入密码',
        }, {
          validator: this.checkPass2,
        }],
        trigger: 'onBlur',
      }]
    });
    var noteProps = getFieldProps('note', {
      rules: [
        { required: false, message: '真的不打算写点什么吗？' },
      ],
    });
    var formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };
    var roleOptions = [];
    if(this.state.roleList){
       for(var i=0;i<this.state.roleList.length;i++){
        roleOptions[i] = (<Option key={i} value={this.state.roleList[i].id+""}>{this.state.roleList[i].roleName}</Option>);
      }
    }
    return (
      <Form horizontal form={this.props.form} style={{marginTop:'15px'}}>
      <FormItem
          {...formItemLayout}
          label="角色：">
          <Select {...roleProps} placeholder="请选择角色" style={{ width: '100%' }}>
            {roleOptions}
          </Select>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="用户名："
          hasFeedback
          help={isFieldValidating('sysName') ? '校验中...' : (getFieldError('sysName') || []).join(', ')}>
          <Input {...sysNameProps} placeholder="实时校验，输入 JasonWood 看看" />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="身份证："
          hasFeedback>
          <Input {...idcardProps} type="email" placeholder="请输入身份证" />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="密码："
          hasFeedback>
          <Input {...passwdProps} type="password" autoComplete="off"/>
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="确认密码："
          hasFeedback>
          <Input {...rePasswdProps} type="password" autoComplete="off" placeholder="两次输入密码保持一致" />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="备注：">
          <Input {...noteProps} type="textarea" placeholder="随便写" />
        </FormItem>

        <FormItem wrapperCol={{ span: 12, offset: 7 }}>
          <Button type="primary" onClick={this.handleSubmit}>确定</Button>
          &nbsp;&nbsp;&nbsp;
          <Button type="ghost" onClick={this.handleReset}>重置</Button>
        </FormItem>
      </Form>
    );
  }
})
AssignmentBox = createForm()(AssignmentBox);
export default AssignmentBox;


