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

var CarListBox = React.createClass({
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
      car:{},
      pagination:{}
    };
  },
  editCar:function(record){
    var trainerList = [];
    ajax({
      url: "/api/driving/trainer/list",
      data: {},
      success: function(result) {
        trainerList = result.list
        this.setState({
          trainerList:trainerList
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
      title: '驾照类型',
      dataIndex: 'carType'
    },{
      title: '品牌',
      dataIndex: 'brand'
    }, {
      title: '车牌号',
      dataIndex: 'carPlate'
    }, {
      title: '使用者',
      dataIndex: 'distributionName'
    },{
      title: '使用状态',
      dataIndex: 'useSate'
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
  editUpdate: function() {
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      this.setState({
        loadingEdit: true
      });
      values.id = this.state.car.id;
      ajax({
        url: "/api/driving/car/update",
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
      url:"/api/driving/car/list",
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
    var carTypeProps = getFieldProps('carType', {
      rules: [
        { required: true}
      ],
      initialValue:this.state.car.carType
    });
     var brandProps = getFieldProps('brand', {
      rules: [
        { required: true,message: '请输入教练车品牌' }
      ],
      initialValue:this.state.car.brand
    });
     var carPlateProps = getFieldProps('carPlate', {
      rules: [
        { required: true, message: '请输入车牌号' }
      ],
      initialValue:this.state.car.carPlate
    });
     var distributionProps = getFieldProps('distributionId', {
      rules: [
        { required: true, message: '请选择套餐' }
      ],
      initialValue:this.state.car.distributionId+""
    });
    var useSateProps = getFieldProps('useSate',{
      rules: [
        { required: true}
      ],
      initialValue:this.state.car.useSateProps
    })
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
            title="编辑教练车" onOk={this.editUpdate} onCancel={this.cancelEdit}
            footer={[
              <Button key="back" type="ghost" size="large" onClick={this.cancelEdit}>返 回</Button>,
              <Button key="submit" type="primary" size="large" loading={this.state.loadingEdit} onClick={this.editUpdate}>
                提 交
              </Button>
            ]}>
             <Form horizontal form={this.props.form} style={{marginTop:'15px'}}>
              <FormItem
                {...formItemLayout}
                label="驾照类型：">
                  <Select {...carTypeProps} placeholder="请选择教练" style={{ width: '100%' }}>
                    <Option value="C1">C1</Option>
                    <Option value="C2">C2</Option>
                  </Select>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="手机号码："
                hasFeedback>
                <Input {...brandProps} placeholder="请输入车辆品牌"/>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="使用者：">
                  <Select {...distributionProps} placeholder="请选择教练" style={{ width: '100%' }}>
                    {trainerOptions}
                  </Select>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="使用状态：">
                  <Select {...useSateProps} placeholder="请选择状态" style={{ width: '100%' }}>
                    <Option value="0">正常使用</Option>
                    <Option value="1">例行维护</Option>
                    <Option value="2">报废停用</Option>
                  </Select>
              </FormItem>
            </Form>
          </Modal>
        </div>
      );
  }
})
CarListBox = createForm()(CarListBox);
export default CarListBox;

