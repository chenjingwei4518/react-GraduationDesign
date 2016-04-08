import React from 'react';
import {
  Table, Button,Modal,Form,Input,message,Tooltip
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

var Subject1Box = React.createClass({
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
      disableAllow:true,
      student:{},
      pagination:{}
    };
  },
  isPassSubject:function(record,flag){
   var message;
    if(flag){
     message="您确定将"+record.studentName+"的科目一状态设置为通过吗？";
    }else{
     message="您确定将"+record.studentName+"的科目一状态设置为不通过吗？";
    }
     confirm({
        title: "温馨提示",
        content: message,
        onOk:()=> {
          var exam={
            id:record.id,
            studentId:record.studentId,
            state:0
          };
          var stateText="不通过";
          if(flag){
            exam.state = 1;
            stateText="通过";
          };
        ajax({
          url: "/api/driving/exam/update",
          data: exam,
          success: function(result) {
            message.success("已将"+record.studentName+"状态设为"+stateText);
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
  toggleAllowBtn:function(){
    this.setState({
      loading:!this.state.loading
    });
  },
  toggleTable:function(){
    this.setState({
      loadingTable:!this.state.loadingTable
    });
  },
  batchAllow:function(){
    var selectData = this.refs.subjectTable.getSelectRow();
    if(selectData.length==0){
      message.warn("请选择需要通过的学生");
      return;
    }
    this.toggleAllowBtn();
    var ids = [];
    selectData.map(function(item,i){
      ids.push(item.id);
    });
    ajax({
      url: "/api/driving/exam/updateList",
      data: {ids:ids},
      success: function(result) {
        this.toggleAllowBtn();
        message.success("成功批量通过");
        this.loadList();
      }.bind(this),
      error: function(msg) {
        message.error(msg);
      }
    });
  },
 
  componentDidMount:function(){
    var columns = [{
      title: '科目',
      dataIndex: 'course'
    }, {
      title: '学生姓名',
      dataIndex: 'studentName'
    }, {
      title: '教练姓名',
      dataIndex: 'trainerName'
    }, {
      title: '成绩',
      dataIndex: 'score'
    }, {
      title: '状态',
      dataIndex: 'state',
      render(text, record, index){
        if(text=="0"){
          text = "未通过";
        }else{
          text = "已通过";
        }
        return text;
      }
    },{
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return (
          <span>
            <a href="javascript:void(0);" onClick={this.isPassSubject.bind(this,record,true)}>通过</a>
            <span className="ant-divider"></span>
            <a href="javascript:void(0);" onClick={this.isPassSubject.bind(this,record,false)}>不通过</a>
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
  loadList:function(page){
    this.toggleTable();
    ajax({
      url:"/api/driving/exam/list",
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
    console.log(values);
     this.toggleTable();
     ajax({
        url: "/api/driving/exam/list",
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
  render() {
    var searchTrainerOptions = [];
    if(this.state.trainerList){
       for(var i=0;i<this.state.trainerList.length;i++){
        searchTrainerOptions[i]={id:this.state.trainerList[i].id+"",text:this.state.trainerList[i].trainerName};
      }
    }
    var searchCourseOptions = [];
    searchCourseOptions.push({id:"科目一",text:"科目一"});
    searchCourseOptions.push({id:"科目二",text:"科目二"});
    searchCourseOptions.push({id:"科目三",text:"科目三"});
    searchCourseOptions.push({id:"科目四",text:"科目四"});
    var Searchdata = [{
      type:"input",
      label:"姓名",
      name:"studentName",
      placeholder:"请输入学生姓名",

    },{
      type:"select",
      label:"教练",
      name:"trainerId",
      placeholder:"请选择教练",
      data:searchTrainerOptions
    },{
      type:"select",
      label:"科目",
      name:"course",
      placeholder:"请选择科目",
      data:searchCourseOptions
    }];
      return ( 
        <div>
          <SearchBox 
            data={Searchdata}
            handleSubmit={this.SearchSubmit}
          />
          <div style={{marginTop:'20px',marginLeft:'5px'}}>
          <Tooltip placement="top" title="通过后，选中的学生将进入下一科目学习">
            <Button type="primary" loading={this.state.loading} onClick={this.batchAllow} >
                批量通过
            </Button>
          </Tooltip>
          <Tooltip placement="top" title="不通过后，选中的学生将需要申请补考">
            <Button type="primary" loading={this.state.loading} onClick={this.toggleBtn} style={{marginLeft:'25px'}}>
                批量不通过
            </Button>
          </Tooltip>  
            
          </div>
          <LoadingTable 
            data={this.state.data}
            ref ="subjectTable"
            columns={this.state.columns}
            loading={this.state.loadingTable}
          />
        </div>
      );
  }
})
Subject1Box = createForm()(Subject1Box);
export default Subject1Box;

