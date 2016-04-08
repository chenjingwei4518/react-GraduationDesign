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
var Option = Select.Option;
function noop() {
  return false;
}

var StudentListBox = React.createClass({
  getInitialState() {
    return {
      loading:false,
      data:[],
      columns:[],
      trainerList:[],
      mealList:[],
      loadingTable:false,
      editVisible:false,
      loadingEdit:false,
      student:{},
      pagination:{}
    };
  },
  editStudent:function(record){
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
              student: record,
              editVisible: true
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
  toggleBtn:function(){
    this.setState({
      loading:!this.state.loading
    });
  },
  toggleTable:function(){
    this.setState({
      loadingTable:!this.state.loadingTable
    });
  },
  componentDidMount:function(){
    var columns = [{
      title: '姓名',
      dataIndex: 'studentName',
      sorter(a, b) {
        return a.name.length - b.name.length;
      }
    },{
      title: '性别',
      dataIndex: 'sex',
      render(text, record, index){
        if(text=="0"){
          text = "女";
        }else{
          text = "男";
        }
        return text;
      }
    }, {
      title: '手机号码',
      dataIndex: 'phone',
    }, {
      title: '教练姓名',
      dataIndex: 'trainerName',
      sorter(a, b) {
        return a.address.length - b.address.length;
      }
    },{
      title: '套餐',
      dataIndex: 'mealName',
      sorter(a, b) {
        return a.address.length - b.address.length;
      }
    },{
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return (
          <span>
            <a href="javascript:void(0);" onClick={this.editStudent.bind(this,record)}>编辑</a>
          </span>
        );
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
  cancelEdit:function(){
     this.setState({
        editVisible: false 
     });
     this.props.form.resetFields();
  },
  trainerChange: function(key, value) {
    this.setState({
      selectTrainerName: value
    });
  },
  mealChange: function(key, value) {
    this.setState({
      selectMealName: value
    });
  },
   editUpdate:function(){
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      this.setState({
        loadingEdit: true
      });
      values.id = this.state.student.id;
      ajax({
        url: "/api/driving/student/update",
        data: values,
        success: function(result) {
          this.setState({ loadingEdit: false, editVisible: false });
          message.success("更新成功");
          this.loadList();
          this.props.form.resetFields();
        }.bind(this),
        error: function(msg) {
          message.error(msg);
        }
      });
    });
  },
  SearchSubmit:function(values){
    console.log(values);
     this.toggleTable();
     ajax({
        url: "/api/driving/student/list",
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
  loadList:function(page){
    this.toggleTable();
    ajax({
      url:"/api/driving/student/list",
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
  render() {
    var formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };
    var { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
    var nameProps = getFieldProps('studentName', {
      rules: [
        { required: true, min: 2, message: '用户名至少为 2 个字符' },
        { validator: this.userExists },
      ],
      initialValue:this.state.student.studentName
    });
     var phoneProps = getFieldProps('phone', {
      rules: [
        { required: true, min: 11, message: '手机号码至少为 11 位' }
      ],
      initialValue:this.state.student.phone
    });
     var trainerProps = getFieldProps('trainerId', {
      rules: [
        { required: true, message: '请选择教练' }
      ],
      initialValue:this.state.student.trainerId+""
    });
     var mealProps = getFieldProps('mealId', {
      rules: [
        { required: true, message: '请选择套餐' }
      ],
      initialValue:this.state.student.mealId+""
    });
    var idcardProps = getFieldProps('idcard',{
      rules: [
        { required: true, min: 18, message: '身份证为18位' }
      ],
      initialValue:this.state.student.idcard+"",
      trigger: ['onBlur']
    })
    
    var textareaProps = getFieldProps('note', {
      rules: [
        { required: true, message: '真的不打算写点什么吗？' },
      ],
      initialValue:this.state.student.note+""
    }); 
    var trainerOptions = [];
    var searchTrainerOptions = [];
    if(this.state.trainerList){
       for(var i=0;i<this.state.trainerList.length;i++){
        searchTrainerOptions[i]={id:this.state.trainerList[i].id+"",text:this.state.trainerList[i].trainerName};
        trainerOptions[i] = (<Option key={i} value={this.state.trainerList[i].id+""}>{this.state.trainerList[i].trainerName}</Option>);
      }
    }
    
    var mealOptions = [];
    if(this.state.mealList){
       for(var i=0;i<this.state.mealList.length;i++){
        mealOptions[i] = (<Option key={i} value={this.state.mealList[i].id+""}>{this.state.mealList[i].mealName}</Option>);
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
      return ( 
        <div>
          <SearchBox 
            data={Searchdata}
            handleSubmit={this.SearchSubmit}
          />
         
          <LoadingTable 
            data={this.state.data}
            columns={this.state.columns}
            loading={this.state.loadingTable}
            pagination={this.state.pagination}
            load={this.loadList}
          />
          <Modal ref="modal"
            visible={this.state.editVisible}
            title="编辑学员" onOk={this.editUpdate} onCancel={this.cancelEdit}
            footer={[
              <Button key="back" type="ghost" size="large" onClick={this.cancelEdit}>返 回</Button>,
              <Button key="submit" type="primary" size="large" loading={this.state.loadingEdit} onClick={this.editUpdate}>
                提 交
              </Button>
            ]}>
             <Form horizontal form={this.props.form} style={{marginTop:'15px'}}>
              
              <FormItem
                {...formItemLayout}
                label="姓名："
                hasFeedback
                help={isFieldValidating('studentName') ? '校验中...' : (getFieldError('studentName') || []).join(', ')}>
                <Input {...nameProps} placeholder="请输入姓名"/>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="手机号码："
                hasFeedback
                help={isFieldValidating('phone') ? '校验中...' : (getFieldError('phone') || []).join(', ')}>
                <Input {...phoneProps} placeholder="请输入学员手机号码"/>
              </FormItem>
               <FormItem
                {...formItemLayout}
                label="教练：">
                  <Select {...trainerProps} placeholder="请选择教练" style={{ width: '100%' }}>
                    {trainerOptions}
                  </Select>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="套餐：">
                  <Select {...mealProps} placeholder="请选择套餐" style={{ width: '100%' }}>
                    {mealOptions}
                  </Select>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="备注：">
                <Input {...textareaProps} type="textarea" placeholder="随便写" id="textarea" name="textarea" />
              </FormItem>
             
            </Form>
          </Modal>
        </div>
      );
  }
})
StudentListBox = createForm()(StudentListBox);
export default StudentListBox;

