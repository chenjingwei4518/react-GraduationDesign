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

var StaffBox = React.createClass({
  getInitialState() {
    return {
      loading:false,
      data:[],
      columns:[],
      roleList:[],
      mealList:[],
      loadingTable:false,
      editVisible:false,
      loadingEdit:false,
      user:{},
      pagination:{}
    };
  },
  editUser:function(record){
    this.toggleEditVisible();
    this.setState({
      user:record
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
  toggleEditVisible:function(){
    this.setState({
      editVisible:!this.state.editVisible
    });
  },
  componentDidMount:function(){
    var columns = [{
      title: '姓名',
      dataIndex: 'sysName'
    },{
      title: '身份证',
      dataIndex: 'idcard'
    }, {
      title: '职位',
      dataIndex: 'roleName'
    },{
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return (
          <span>
            <a href="javascript:void(0);" onClick={this.editUser.bind(this,record)}>编辑</a>
          </span>
        );
      }
    }];
     ajax({
        url: "/api/driving/role/list",
        data: {},
        success: function(result) {
          this.setState({
            roleList : result.list
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
  editUpdate: function() {
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      this.setState({
        loadingEdit: true
      });
      values.id = this.state.user.id;
      ajax({
        url: "/api/driving/user/update",
        data: values,
        success: function(result) {
          this.setState({
            loadingEdit: false,
            editVisible: false
          });
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
      url:"/api/driving/user/list",
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
    var sysNameProps = getFieldProps('sysName', {
      rules: [
        { required: true, min: 2, message: '用户名至少为 2 个字符' },
        { validator: this.userExists },
      ],
      initialValue:this.state.user.sysName
    });
     var roleProps = getFieldProps('roleId', {
      rules: [
        { required: true,message: '请选择职位' }
      ],
      initialValue:this.state.user.roleId+""
    });
    var idcardProps = getFieldProps('idcard',{
      rules: [
        { required: true, min: 18, message: '身份证为18位' }
      ],
      initialValue:this.state.user.idcard,
      trigger: ['onBlur']
    })
    var textareaProps = getFieldProps('note', {
      rules: [
        { required: true, message: '真的不打算写点什么吗？' },
      ],
      initialValue:this.state.user.note+""
    }); 
   
    var roleOptions = [];
    if(this.state.roleList){
       for(var i=0;i<this.state.roleList.length;i++){
        roleOptions[i] = (<Option key={i} value={this.state.roleList[i].id+""}>{this.state.roleList[i].roleName}</Option>);
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
      type:"input",
      label:"手机号码",
      name:"phone",
      placeholder:"请输入手机号码"
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
            title="编辑用户" onOk={this.editUpdate} onCancel={this.cancelEdit}
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
                help={isFieldValidating('sysName') ? '校验中...' : (getFieldError('sysName') || []).join(', ')}>
                <Input {...sysNameProps} placeholder="请输入姓名"/>
              </FormItem>
               
              <FormItem
                {...formItemLayout}
                label="职位：">
                  <Select {...roleProps} placeholder="请选择职位" style={{ width: '100%' }}>
                    {roleOptions}
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
StaffBox = createForm()(StaffBox);
export default StaffBox;

