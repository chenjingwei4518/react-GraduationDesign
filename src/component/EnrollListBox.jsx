import React from 'react';
import {
  Table, Button,Modal,Form,Input,message,Select
}
from 'antd';
import SearchBox from "./SearchBox.jsx";
import LoadingTable from "./LoadingTable.jsx";
import ajax from "./Ajax.jsx";
var confirm = Modal.confirm;
var createForm = Form.create;
var FormItem = Form.Item;
function noop() {
  return false;
}

var EnrollListBox = React.createClass({
  getInitialState() {
    return {
      loading:false,
      data:[],
      columns:[],
      pagination:{},
      loadingTable:false,
      loadingEdit:false,
      editVisible:false,
      trainerList: [],
      mealList:[],
      enroll:{}
    };
  },
  deleteRow:function(key,name){
     confirm({
        title: '您是否确认要删除'+name,
        content: '删除将无法恢复！',
        onOk:()=> {
          this.loadList();
          console.log('确定删除'+key);
          message.success(name+"已被删除");
        },
        onCancel() {}
    });
  },
  editEnroll:function(record){
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
                mealList: result.list,
                enroll:record
              });
              this.toggleModel();
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
  handleSubmit: function(e) {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      }
      ajax({
        url: "/api/driving/enroll/update",
        data: values,
        success: function(result) {
         message.success("更新成功");
         this.props.form.resetFields();
         this.toggleModel();
        }.bind(this),
        error: function(msg) {
          message.error(msg);
        }
      });
    });
  },
  toggleBtn:function(){
    this.setState({
      loading:!this.state.loading
    });
  },
  toggleModel:function(){
    this.setState({
      editVisible:!this.state.editVisible
    });
  },
  toggleTable:function(){
    this.setState({
      loadingTable:!this.state.loadingTable
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
  componentDidMount:function(){
    var columns = [{
      title: '姓名',
      dataIndex: 'enrollName'      
    }, {
      title: '性别',
      dataIndex: 'sex',
      render(text, record, index) {
        if (text == "0") {
          text = "女";
        } else {
          text = "男";
        }
        return text;
      }
    }, {
      title: '手机号码',
      dataIndex: 'phone'
    }, {
      title: '教练姓名',
      dataIndex: 'trainerName'
    }, {
      title: '驾照类型',
      dataIndex: 'license'
    }, {
      title: '套餐',
      dataIndex: 'mealName'
      
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return ( <span><a href = "javascript:void(0);" onClick = {this.editEnroll.bind(this, record)} >编辑</a></span>);
      }
    }];
    var trainerList=[];
     ajax({
        url: "/api/driving/trainer/list",
        data: {},
        success: function(result) {
          this.setState({
            trainerList : result.list
          });     
        }.bind(this),
        error: function(msg) {
          message.error(msg);
        }
    });
    this.setState({
      columns: columns,
    });
    this.loadList();
  },
  loadList:function(page){
    this.toggleTable();
     ajax({
      url:"/api/driving/enroll/list",
      data:page,
      success:function(result){
        this.setState({
          data: result.list,
          pagination:result.pagination
        });
        this.toggleTable();
      }.bind(this), 
      error:function(msg){
         message.error(msg);
         this.toggleTable();
      }
    });
  },
  SearchSubmit:function(values){
     this.toggleTable();
     ajax({
        url: "/api/driving/enroll/list",
        data: values,
        success: function(result) {
          this.setState({
            data: result.list,
            pagination: result.pagination
          });
          this.toggleTable();
        }.bind(this),
        error: function(msg) {
          message.error(msg);
        }
      });
  },
  cancelEdit:function(e){
    e.preventDefault();
    this.setState({
      editVisible: false
    });
    this.props.form.resetFields();
  },
  render() {
    var formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };
    var { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
    var enrollNameProps = getFieldProps('enrollName', {
      rules: [{
        required: true,
        min: 2,
        message: '姓名至少为 2 位'
      }, {
        validator: this.userExists
      }],
      initialValue:this.state.enroll.enrollName
    });
    var idcardProps = getFieldProps('idcard', {
      rules: [{
        required: true,
        min:18,
        message: '身份证至少为 18 位'
      }],
      initialValue:this.state.enroll.idcard
    });
     var phoneProps = getFieldProps('phone', {
      rules: [
        { required: true, min: 11, message: '手机号码至少为 11 位' }
      ],
      initialValue:this.state.enroll.phone
    });
    var sexProps = getFieldProps('sex', {
      rules: [{
        required: true,
        message: '请选择学生的性别'
      }],
      initialValue:this.state.enroll.sex
    });
    var licenseProps = getFieldProps('license', {
      rules: [{
        required: true,
        message: '请选择驾照类型'
      }],
      initialValue:this.state.enroll.license
    });
    var trainerProps = getFieldProps('trainerId', {
      rules: [{
        required: true,
        message: '请选择学生的教练'
      }],
      initialValue:this.state.enroll.trainerId+""
    });
    var mealProps = getFieldProps('mealId', {
      rules: [{
        required: true,
        message: '请选择报名套餐'
      }],
      initialValue:this.state.enroll.mealId+""
    });
    var receivableProps = getFieldProps('receivable',{initialValue:this.state.enroll.receivable});
    var paidProps = getFieldProps('paid',{initialValue:this.state.enroll.paid});
    var managersProps = getFieldProps('managersId', {
      initialValue:"1"
    });
    var discountProps = getFieldProps('discount',{initialValue:this.state.enroll.receivable-this.state.enroll.paid});
    var noteProps = getFieldProps('note', {
      rules: [{
        required: true,
        message: '真的不打算写点什么吗？'
      }],
      initialValue:this.state.enroll.note
    });
    var trainerOptions = [];
    var searchTrainerOptions = [];
    if(this.state.trainerList){
       for(var i=0;i<this.state.trainerList.length;i++){
        searchTrainerOptions[i]={id:this.state.trainerList[i].id+"",text:this.state.trainerList[i].trainerName};
        trainerOptions[i] = (<Option key={i} value={this.state.trainerList[i].id+""}>{this.state.trainerList[i].trainerName}</Option>);
      }
    }
    var Searchdata = [{
      type:"input",
      label:"姓名",
      name:"studentName",
      placeholder:"请输入学生姓名",

    },{
      type:"input",
      label:"手机号码",
      name:"phone",
      placeholder:"请输入手机号码"
    },{
      type:"select",
      label:"教练",
      name:"trainerId",
      placeholder:"请选择教练",
      data:searchTrainerOptions
    }];
    var mealOptions = [];
    if(this.state.mealList){
       for(var i=0;i<this.state.mealList.length;i++){
        mealOptions[i] = (<Option key={i} value={this.state.mealList[i].id+""}>{this.state.mealList[i].mealName}</Option>);
      }
    }
      return ( 
        <div>
          <SearchBox 
            data={Searchdata}
            handleSubmit={this.SearchSubmit}
          />
          <div style={{marginTop:'10px',marginLeft:'5px'}}>
            <Button type="primary" loading={this.state.loading} onClick={this.toggleBtn}>
                删除所有
            </Button>
          </div>
          <LoadingTable 
            data={this.state.data}
            columns={this.state.columns}
            loading={this.state.loadingTable}
          />
          <Modal ref="modal"
            visible={this.state.editVisible}
            title="编辑报名信息" onOk={this.handleSubmit} onCancel={this.cancelEdit}
            footer={[
              <Button key="back" type="ghost" size="large" onClick={this.cancelEdit}>返 回</Button>,
              <Button key="submit" type="primary" size="large" loading={this.state.loadingEdit} onClick={this.handleSubmit}>
                提 交
              </Button>
            ]}>
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
                    label="备注："
                    hasFeedback>
                    <Input {...noteProps} type="textarea" placeholder="随便写" />
                  </FormItem>
                </Form>
          </Modal>
        </div>
      );
  }
})
EnrollListBox = createForm()(EnrollListBox);
export default EnrollListBox;

