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

var TrainerListBox = React.createClass({
  getInitialState() {
    return {
      loading:false,
      data:[],
      columns:[],
      loadingTable:false,
      editVisible:false,
      loadingEdit:false,
      trainer:{},
      pagination:{}
    };
  },
  editTrainer:function(record){
    this.setState({
      trainer:record,
      editVisible:true
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
      dataIndex: 'trainerName',
      sorter(a, b) {
        return a.name.length - b.name.length;
      }
    },{
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
      title: '所教科目',
      dataIndex: 'course'
    },{
      title: '教练车品牌',
      dataIndex: 'carBrand'
    },{
      title: '车牌号',
      dataIndex: 'carPlate'
    },{
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return (
          <span>
            <a href="javascript:void(0);" onClick={this.editTrainer.bind(this,record)}>编辑</a>
          </span>
        );
      }
    }];
    this.setState({
      columns: columns
    });
    this.loadList();
  },
  cancelEdit:function(){
     this.setState({
        editVisible: false 
     });
  },
  toggleEditLoadingBtn:function(){
    this.setState({ 
      loadingEdit: !this.state.loadingEdit 
    });
  },
   editUpdate:function(){ 
    this.toggleEditLoadingBtn();
    this.props.form.validateFields((errors, values) => {
      console.log(values);
      if (!!errors) {
        return;
      }
      values.id = this.state.trainer.id
      ajax({
        url: "/api/driving/trainer/update",
        data: values,
        success: function(result) {
          message.success("更新成功");
          this.setState({
            editVisible: false
          });
          this.toggleEditLoadingBtn();
          this.loadList();
          this.props.form.resetFields();
        }.bind(this),
        error: function(msg) {
          message.error(msg);
        }
      });
    });
  },
  loadList:function(page){
    this.toggleTable();
    ajax({
      url:"/api/driving/trainer/list",
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
    var trainerNameProps = getFieldProps('trainerName', {
      rules: [
        { required: true, min: 2, message: '用户名至少为 2 个字符' },
        { validator: this.userExists },
      ],
      initialValue:this.state.trainer.trainerName
    });
     var sexProps = getFieldProps('sex', {
      rules: [
        { required: true,message: '请选择教练性别' },
        { validator: this.userExists },
      ],
      initialValue:this.state.trainer.sex+""
    });
     var phoneProps = getFieldProps('phone', {
      rules: [
        { required: true, min: 11, message: '手机号码至少为 11 位' }
      ],
      initialValue:this.state.trainer.phone
    });
    var courseProps = getFieldProps('course',{
      rules: [
        { required: true,message: '请选择教练所教科目' }
      ],
      initialValue:this.state.trainer.course
    })
    
    var noteProps = getFieldProps('note', {
      rules: [
        {message: '真的不打算写点什么吗？' },
      ],
      initialValue:this.state.trainer.note
    }); 

      return ( 
        <div>
          <SearchBox />
          <div style={{marginTop:'10px',marginLeft:'5px'}}>
            <Button type="primary" loading={this.state.loading} onClick={this.toggleBtn}>
                通过
            </Button>
            <Button type="primary" loading={this.state.loading} onClick={this.toggleBtn}>
                不通过
            </Button>
          </div>
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
                help={isFieldValidating('trainerNameProps') ? '校验中...' : (getFieldError('trainerNameProps') || []).join(', ')}>
                <Input {...trainerNameProps} placeholder="实时校验，输入 JasonWood 看看" />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="性别：">
                  <Select {...sexProps} placeholder="请选择教练" style={{ width: '100%' }}>
                    <Option value="0">女</Option>
                    <Option value="1">男</Option>
                  </Select>
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
                label="所教科目：">
                  <Select {...courseProps} placeholder="请选择所教科目" style={{ width: '100%' }}>
                    <Option value="科目一">科目一</Option>
                    <Option value="科目二">科目二</Option>
                    <Option value="科目三">科目三</Option>
                    <Option value="科目四">科目四</Option>
                  </Select>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="备注：">
                <Input {...noteProps} type="textarea" placeholder="随便写" />
              </FormItem>         
            </Form>
          </Modal>
        </div>
      );
  }
})
TrainerListBox = createForm()(TrainerListBox);
export default TrainerListBox;

