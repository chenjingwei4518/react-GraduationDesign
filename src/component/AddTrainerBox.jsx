import React from 'react';
import {
  Button, Form, Input,Select,message
}
from 'antd';
import SearchBox from "./SearchBox.jsx";
import ajax from "./Ajax.jsx";
const createForm = Form.create;
const FormItem = Form.Item;
function noop() {
  return false;
}

var AddTrainerBox = React.createClass({
  getInitialState() {
    return {
      
    };
  },
  getValidateStatus: function(field) {
    const { isFieldValidating, getFieldError, getFieldValue } = this.props.form;

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
    const { validateFields } = this.props.form;
    if (value) {
      validateFields(['rePasswd']);
    }
    callback();
  },

  checkPass2:function(rule, value, callback) {
    const { getFieldValue } = this.props.form;
    if (value && value !== getFieldValue('sysPassword')) {
      callback('两次输入密码不一致！');
    } else {
      callback();
    }
  },

  render:function() {
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
    const trainerNameProps = getFieldProps('trainerName', {
      rules: [
        { required: true, min: 2, message: '用户名至少为 2 个字符' },
        { validator: this.userExists },
      ],
    });
    const sexProps = getFieldProps('sex', {
      rules: [
        { required: true, message: '请选择角色' }
      ],
    });
    const phoneProps = getFieldProps('phone', {
       rules: [
        { required: true, min: 11, message: '手机号码至少为 11 位' }    
      ],
    });
    const idcardProps = getFieldProps('idcard', {
      rules: [
        { required: true, min: 11, message: '手机号码至少为 11 位' }    
      ],
    });
    const courseProps = getFieldProps('course', {
      rules: [
        { required: true, min: 11, message: '手机号码至少为 11 位' }    
      ],
    });
    const licenseProps = getFieldProps('license', {
      rules: [
        { required: true, min: 11, message: '手机号码至少为 11 位' }    
      ],
    });
    const noteProps = getFieldProps('note', {
      rules: [
        { required: false, message: '真的不打算写点什么吗？' },
      ],
    });
    const carPlateProps = getFieldProps('carPlate', {
      rules: [
        { required: false, message: '真的不打算写点什么吗？' },
      ],
    });   
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };
    return (
      <Form horizontal form={this.props.form} style={{marginTop:'15px'}}>
      <FormItem
          {...formItemLayout}
          label="姓名：">
          <Input {...trainerNameProps} placeholder="实时校验，输入 JasonWood 看看" />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="性别："
          hasFeedback
          help={isFieldValidating('sex') ? '校验中...' : (getFieldError('sysName') || []).join(', ')}>
          <Input {...sexProps} placeholder="实时校验，输入 JasonWood 看看" />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="手机号码："
          hasFeedback>
          <Input {...phoneProps} type="email" placeholder="onBlur 与 onChange 相结合" />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="身份证："
          hasFeedback>
          <Input {...idcardProps} autoComplete="off"
            onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop} />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="所教科目："
          hasFeedback>
          <Input {...courseProps} autoComplete="off" placeholder="两次输入密码保持一致"
            onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop} />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="驾照类型：">
          <Input {...licenseProps} placeholder="随便写" id="textarea" name="textarea" />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="教练车牌照：">
          <Input {...carPlateProps} placeholder="随便写" id="textarea" name="textarea" />
        </FormItem>
         <FormItem
          {...formItemLayout}
          label="备注：">
          <Input {...noteProps} type="textarea" placeholder="随便写" id="textarea" name="textarea" />
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
AddTrainerBox = createForm()(AddTrainerBox);
export default AddTrainerBox;


