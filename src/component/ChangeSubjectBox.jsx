import React from 'react';
import {
  Table, Button,Modal,Form,Input,message
}
from 'antd';
import SearchBox from "./SearchBox.jsx";
import LoadingTable from "./LoadingTable.jsx";

var confirm = Modal.confirm;
var createForm = Form.create;
var FormItem = Form.Item;
function noop() {
  return false;
}

var ChangeSubjectBox = React.createClass({
  getInitialState() {
    return {
      loading:false,
      data:[],
      columns:[],
      loadingTable:false,
      loadingEdit:false,
      isPassRecord:{}
    };
  },
  showConfirm:function(key,name) {
   
  },
  isPassSubject:function(record,flag){
   var message;
    if(flag){
     message="您确定将"+record.name+"的科目一状态设置为通过吗？";
    }else{
     message="您确定将"+record.name+"的科目一状态设置为不通过吗？";
    }
     confirm({
        title: "温馨提示",
        content: message,
        onOk:()=> {
          this.loadList();
          message.success("操作成功");
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
  componentDidMount:function(){
    this.loadList();
  },
  loadList:function(){
    this.toggleTable();
    var data = [{
          key: '1',
          name: '胡彦斌',
          age: 32,
          address: '西湖区湖底公园1号'
        }, {
          key: '2',
          name: '胡彦祖',
          age: 42,
          address: '西湖区湖底公园1号'
        }, {
          key: '3',
          name: '李大嘴',
          age: 32,
          address: '西湖区湖底公园1号'
        }, {
          key: '4',
          name: '李大嘴',
          age: 32,
          address: '西湖区湖底公园1号'
        }
        , {
          key: '5',
          name: '李大嘴',
          age: 32,
          address: '西湖区湖底公园1号'
        }
        , {
          key: '6',
          name: '李大嘴',
          age: 32,
          address: '西湖区湖底公园1号'
        }
        , {
          key: '7',
          name: '李大嘴',
          age: 32,
          address: '西湖区湖底公园1号'
        }
        , {
          key: '8',
          name: '李大嘴',
          age: 32,
          address: '西湖区湖底公园1号'
        }
        , {
          key: '9',
          name: '李大嘴',
          age: 32,
          address: '西湖区湖底公园1号'
        }
        , {
          key: '10',
          name: '李大嘴',
          age: 32,
          address: '西湖区湖底公园1号'
        }
        , {
          key: '11',
          name: '李大嘴',
          age: 32,
          address: '西湖区湖底公园1号'
        }
        , {
          key: '12',
          name: '李大嘴',
          age: 32,
          address: '西湖区湖底公园1号'
        }
        , {
          key: '13',
          name: '李大嘴',
          age: 32,
          address: '西湖区湖底公园1号'
        }
        , {
          key: '14',
          name: '李大嘴',
          age: 32,
          address: '西湖区湖底公园1号'
        }
        , {
          key: '15',
          name: '李大嘴',
          age: 32,
          address: '西湖区湖底公园1号'
        }];

        var columns = [{
          title: '姓名',
          dataIndex: 'name',
          filters: [{
            text: '姓李的',
            value: '李',
          }, {
            text: '姓胡的',
            value: '胡',
          }, {
            text: '子菜单',
            value: '子菜单',
            children: [{
              text: '姓陈的',
              value: '陈',
            }, {
              text: '姓王的',
              value: '王',
            }]
          }],
          // 指定确定筛选的条件函数
          // 这里是名字中第一个字是 value
          onFilter(value, record) {
            return record.name.indexOf(value) === 0;
          },
          sorter(a, b) {
            return a.name.length - b.name.length;
          }
        }, {
          title: '年龄',
          dataIndex: 'age',
          sorter(a, b) {
            return a.age - b.age;
          }
        }, {
          title: '地址',
          dataIndex: 'address',
          filters: [{
            text: '南湖',
            value: '南湖'
          }, {
            text: '西湖',
            value: '西湖'
          }],
          filterMultiple: false,
          onFilter(value, record) {
            return record.address.indexOf(value) === 0;
          },
          sorter(a, b) {
            return a.address.length - b.address.length;
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
    this.setState({
      data:data,
      columns:columns
    });
    setTimeout(function() {
       this.toggleTable();
    }.bind(this), 2000);
  },
  render() {
    var formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };
    var { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
    var nameProps = getFieldProps('name', {
      rules: [
        { required: true, min: 2, message: '用户名至少为 2 个字符' },
        { validator: this.userExists },
      ],
    });
    var idcardProps = getFieldProps('idcard',{
      rules: [
        { required: true, min: 18, message: '身份证为18位' }
      ],
      trigger: ['onBlur'],
    })
    
    var textareaProps = getFieldProps('textarea', {
      rules: [
        { required: true, message: '真的不打算写点什么吗？' },
      ],
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
          />
        </div>
      );
  }
})
ChangeSubjectBox = createForm()(ChangeSubjectBox);
export default ChangeSubjectBox;

