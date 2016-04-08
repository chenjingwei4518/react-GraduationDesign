import React from 'react';
import {
  Button, Form, Input
}
from 'antd';
import SearchBox from "./SearchBox.jsx";



var createForm = Form.create;
var FormItem = Form.Item;

function noop() {
  return false;
}

var PasswordBox = React.createClass({
  getInitialState() {
    return {
      
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
        console.log('Errors in form!!!');
        return;
      }
      console.log('Submit!!!');
      console.log(values);
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
    if (value && value !== getFieldValue('passwd')) {
      callback('两次输入密码不一致！');
    } else {
      callback();
    }
  },

  render:function() {
    var { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
    var nameProps = getFieldProps('name', {
      rules: [
        { required: true, min: 5, message: '用户名至少为 5 个字符' },
        { validator: this.userExists },
      ],
    });
    var emailProps = getFieldProps('email', {
      validate: [{
        rules: [
          { required: true },
        ],
        trigger: 'onBlur',
      }, {
        rules: [
          { type: 'email', message: '请输入正确的邮箱地址' },
        ],
        trigger: ['onBlur', 'onChange'],
      }]
    });
    var passwdProps = getFieldProps('passwd', {
      rules: [
        { required: true, whitespace: true, message: '请填写密码' },
        { validator: this.checkPass},
      ],
    });
    var rePasswdProps = getFieldProps('rePasswd', {
      rules: [{
        required: true,
        whitespace: true,
        message: '请再次输入密码',
      }, {
        validator: this.checkPass2,
      }],
    });
    var textareaProps = getFieldProps('textarea', {
      rules: [
        { required: true, message: '真的不打算写点什么吗？' },
      ],
    });
    var formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };
    return (
      <Form horizontal form={this.props.form} style={{marginTop:'15px'}}>
        <FormItem
          {...formItemLayout}
          label="用户名："
          hasFeedback
          help={isFieldValidating('name') ? '校验中...' : (getFieldError('name') || []).join(', ')}>
          <Input {...nameProps} placeholder="请输入姓名" />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="邮箱："
          hasFeedback>
          <Input {...emailProps} type="email" placeholder="onBlur 与 onChange 相结合" />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="密码："
          hasFeedback>
          <Input {...passwdProps} type="password" autoComplete="off"
            onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop} />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="确认密码："
          hasFeedback>
          <Input {...rePasswdProps} type="password" autoComplete="off" placeholder="两次输入密码保持一致"
            onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop} />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="备注：">
          <Input {...textareaProps} type="textarea" placeholder="随便写" id="textarea" name="textarea" />
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
PasswordBox = createForm()(PasswordBox);
export default PasswordBox;

