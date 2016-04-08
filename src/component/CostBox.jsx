import React from 'react';
import {
  Table, Button,Modal,Form,Input,message
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

var CostBox = React.createClass({
  getInitialState() {
    return {
      loading:false,
      data:[],
      columns:[],
      mealList:[],
      loadingTable:false,
      loadingEdit:false,
      editVisible:false,
      meal:{},
      pagination:{}
    };
  },
  deleteRow:function(record){
     confirm({
        title: '您是否确认要删除'+record.mealName+"?",
        content: '删除将无法恢复！',
        onOk:()=> {
          var ids = [];
          ids.push(parseInt(record.id));
          console.log(ids);
        ajax({
          url: "/api/driving/meal/delete",
          data:{"ids":ids},
          success: function(result) {
            message.success("删除"+record.mealName+"成功");
            this.loadList();
          }.bind(this),
          error: function(msg) {
            message.error(msg);
          }
        });
        },
        onCancel() {}
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
  toggleModel:function(){
    this.setState({
      editVisible:!this.state.editVisible
    });
  },
  toggleEditBtn: function() {
    this.setState({
      loadingEdit: !this.state.loadingEdit
    });
  },
  componentDidMount:function(){
    var columns = [{
      title: '套餐名',
      dataIndex: 'mealName'  
    }, {
      title: '价格',
      dataIndex: 'price',
    }, {
      title: '优惠价',
      dataIndex: 'discount',
    },{
      title: '备注',
      dataIndex: 'note'
    },{
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return (
          <span>
            <a href="javascript:void(0);" onClick={this.mealEdit.bind(null,record)}>编辑</a>
            <span className="ant-divider"></span>
            <a href="javascript:void(0);" onClick={this.deleteRow.bind(null,record)}>删除</a>
          </span>
        );
      }
    }];
    this.setState({
      columns:columns
    });
    this.loadList();
  },
  loadList:function(page){
    this.toggleTable();
    ajax({
        url: "/api/driving/meal/list",
        data: page,
        success: function(result) {
         this.setState({
            mealList:result.list,
            pagination:result.pagination
         });
         this.toggleTable();
        }.bind(this),
        error: function(msg) {
          message.error(msg);
        }
      });
  },
  mealEdit:function(record){
     this.setState({
        editVisible: true,
        meal:record
     });
  },
  moneyCheck:function(name,value){
    if(parseFloat(value)<0){
      return false;
    }else{
      return true;
    }
  },
  mealUpdate:function(){
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      this.toggleEditBtn();
      values.id = this.state.meal.id;
      ajax({
        url: "/api/driving/meal/update",
        data: values,
        success: function(result) {
          this.toggleEditBtn();
          this.toggleModel();
          this.toggleTable();
          this.props.form.resetFields();
          this.loadList();
          message.success("更新套餐成功");
        }.bind(this),
        error: function(msg) {
          message.error(msg);
        }
      });
    });
  },
  cancelEdit:function(){
     this.setState({
        editVisible: false 
     });
  },
  render() {
    var formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };
    var { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
    var mealNameProps = getFieldProps('mealName', {
      rules: [
        { required: true, min: 3, message: '套餐名至少为 3 个字符' },
      ],
      initialValue:this.state.meal.mealName
    });
    var priceProps = getFieldProps('price',{
      rules: [
        { required: true, message: '请填写正确的价格' },
        { validator: this.moneyCheck }
      ],
      trigger: ['onBlur'],
      initialValue:this.state.meal.price
    })
    var discountProps = getFieldProps('discount',{
      rules: [
        { required: true, message: '请填写正确的优惠价' },
        { validator: this.moneyCheck }
      ],
      trigger: ['onBlur'],
      initialValue:this.state.meal.discount
    })
    
    var noteProps = getFieldProps('note',{
      initialValue:this.state.meal.note
    })
    
      return ( 
        <div>
          <SearchBox />
          <div style={{marginTop:'10px',marginLeft:'5px'}}>
            <Button type="primary" loading={this.state.loading} onClick={this.toggleBtn}>
                删除所有
            </Button>
          </div>
          <LoadingTable 
            data={this.state.mealList}
            columns={this.state.columns}
            loading={this.state.loadingTable}
          />
          <Modal ref="modal"
            visible={this.state.editVisible}
            title="编辑套餐信息" onOk={this.mealUpdate} onCancel={this.cancelEdit}
            footer={[
              <Button key="back" type="ghost" size="large" onClick={this.cancelEdit}>返 回</Button>,
              <Button key="submit" type="primary" size="large" loading={this.state.loadingEdit} onClick={this.mealUpdate}>
                提 交
              </Button>
            ]}>
            <Form horizontal form={this.props.form} style={{marginTop:'15px'}}>
                <FormItem
                  {...formItemLayout}
                  label="套餐名："
                  hasFeedback>
                  <Input {...mealNameProps} placeholder="请输入套餐名" />
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label="价格："
                  hasFeedback>
                  <Input {...priceProps} placeholder="请输入套餐价格" />
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label="优惠："
                  hasFeedback>
                  <Input {...discountProps} placeholder="请输入套餐优惠价格" autoComplete="off" />
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
CostBox = createForm()(CostBox);
export default CostBox;

