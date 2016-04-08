import React from 'react';
import {
  Table, Button,Form,Input,message,Select
}
from 'antd';
import ajax from "./Ajax.jsx";
import SearchBox from "./SearchBox.jsx";
const createForm = Form.create;
const FormItem = Form.Item;
function noop() {
  return false;
}

var EnrollBox = React.createClass({
  getInitialState() {
    return {
       trainerList: [],
       mealList:[]
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
        console.log('Errors in form!!!');
        return;
      }
      ajax({
        url: "/api/driving/enroll/add",
        data: values,
        success: function(result) {
         message.success("报名成功");
         this.props.form.resetFields();
        }.bind(this),
        error: function(msg) {
          message.error(msg);
        }
      });
    });
  },
  selectMeal:function(id,value){
    var record;
    for(var i in this.state.mealList){
      if(this.state.mealList[i].id==id){
        record = this.state.mealList[i];
        break;
      }
    }
    this.props.form.setFieldsValue({
      mealId:record.id+"",
      receivable:record.price,
      paid:record.price-record.discount,
      discount:record.discount
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
  componentDidMount:function(){
     var trainerList = [];
     ajax({
        url: "/api/driving/trainer/list",
        data: {},
        success: function(result) {
          trainerList = result.list
          ajax({
            url: "/api/driving/meal/list",
            data: {},
            success: function(result) {
              this.setState({
                trainerList: trainerList,
                mealList: result.list
              });
            }.bind(this),
            error: function(msg) {
              message.error(msg);
            }
          });
        }.bind(this),
        error: function(msg) {
          message.error(msg);
        }
    });
  },
  render:function() {
    var { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
    var enrollNameProps = getFieldProps('enrollName', {
      rules: [{
        required: true,
        min: 2,
        message: '姓名至少为 2 位'
      }, {
        validator: this.userExists
      }, ],
    });
    var idcardProps = getFieldProps('idcard', {
      rules: [{
        required: true,
        min:18,
        message: '身份证至少为 18 位'
      }],
    });
     var phoneProps = getFieldProps('phone', {
      rules: [
        { required: true, min: 11, message: '手机号码至少为 11 位' }
      ],
    });
    var sexProps = getFieldProps('sex', {
      rules: [{
        required: true,
        message: '请选择学生的性别'
      }],
    });
    var licenseProps = getFieldProps('license', {
      rules: [{
        required: true,
        message: '请选择驾照类型'
      }],
    });
    var trainerProps = getFieldProps('trainerId', {
      rules: [{
        required: true,
        message: '请选择学生的教练'
      }],
    });
    var mealProps = getFieldProps('mealId', {
      rules: [{
        required: true,
        message: '请选择报名套餐'
      }],
    });
    var receivableProps = getFieldProps('receivable');
    var paidProps = getFieldProps('paid');
    var managersProps = getFieldProps('managersId', {
      initialValue:"1"
    });
    var discountProps = getFieldProps('discount');
    var noteProps = getFieldProps('note', {
      rules: [{
        required: true,
        message: '真的不打算写点什么吗？'
      }, ],
    });
    var formItemLayout = {
      labelCol: {
        span: 7
      },
      wrapperCol: {
        span: 12
      },
    };
     var trainerOptions = [];
    if(this.state.trainerList){
       for(var i=0;i<this.state.trainerList.length;i++){
        trainerOptions[i] = (<Option key={i} value={this.state.trainerList[i].id+""}>{this.state.trainerList[i].trainerName}</Option>);
      }
    }
    var mealOptions = [];
    if(this.state.mealList){
       for(var i=0;i<this.state.mealList.length;i++){
        mealOptions[i] = (<Option key={i} value={this.state.mealList[i].id+""}>{this.state.mealList[i].mealName}</Option>);
      }
    }
    return (
      <Form horizontal form={this.props.form} style={{marginTop:'15px'}}>
      <FormItem
          {...formItemLayout}
          label="姓名："
          hasFeedback
          help={isFieldValidating('enrollName') ? '校验中...' : (getFieldError('enrollName') || []).join(', ')}>
          <Input {...enrollNameProps} placeholder="请输入学生姓名" />
        </FormItem>
         <FormItem
            {...formItemLayout}
            hasFeedback
            label="性别：">
            <Select {...sexProps} placeholder="请选择性别" style={{ width: '100%' }}>
              <Option value="0">女</Option>
              <Option value="1">男</Option>
            </Select>
        </FormItem> 
        <FormItem
          {...formItemLayout}
          label="手机号码："
          hasFeedback>
          <Input {...phoneProps} placeholder="请输入学生身份证" />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="身份证："
          hasFeedback>
          <Input {...idcardProps} placeholder="请输入学生身份证" />
        </FormItem>
        <FormItem
            {...formItemLayout}
            hasFeedback
            label="驾照类型：">
            <Select {...licenseProps} placeholder="请选择驾照类型" style={{ width: '100%' }}>
              <Option value="C1">C1</Option>
              <Option value="C2">C2</Option>
            </Select>
        </FormItem> 
        <FormItem
            {...formItemLayout}
            hasFeedback
            label="套餐：">
            <Select {...mealProps} placeholder="请选择套餐" style={{ width: '100%' }} onChange={this.selectMeal}>
              {mealOptions}
            </Select>
        </FormItem> 
        <FormItem
          {...formItemLayout}
          hasFeedback
          label="教练：">
          <Select {...trainerProps} placeholder="请选择教练" style={{ width: '100%' }}>
            {trainerOptions}
          </Select>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="应收金额："
          hasFeedback>
          <Input {...receivableProps} autoComplete="off" disabled/>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="优惠金额："
          hasFeedback>
          <Input {...discountProps} autoComplete="off" disabled />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="实收金额："
          hasFeedback>
          <Input {...paidProps} autoComplete="off" disabled />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="经办人："
          hasFeedback>
          <Input {...managersProps}  disabled />
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
EnrollBox = createForm()(EnrollBox);
export default EnrollBox;


