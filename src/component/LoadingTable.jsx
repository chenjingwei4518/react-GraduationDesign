import React from 'react';
import {
  Table, Button
}
from 'antd';
var LoadingTable = React.createClass({
  getInitialState() {
    return {
      rowSelection:{
        onChange:(selectedRowKeys, selectedRows)=> {//选择的时候把key保存起来
          this.setState({
            selectedRow:selectedRows
          });
        }
      },
      selectedRow:[]
    };
  },
  
  onChange: function(pagination, filters, sorter) {
    // 点击分页、筛选、排序时触发
    var page={
      current:pagination.current,
      pageSize:pagination.pageSize
    }
    this.props.load&&this.props.load(page);
    console.log('各类参数是', pagination, filters, sorter);
  },
  getSelectRow:function(){
    return this.state.selectedRow;
  },
  render() {
      return ( 
        <div style={{marginTop:'15px'}}>
          <Table 
            rowKey={record => record.id}
            columns={this.props.columns} 
            dataSource = {this.props.data} 
            loading = {this.props.loading} 
            rowSelection={this.state.rowSelection}
            pagination={this.props.pagination} 
            onChange={this.onChange} 
            /> 
        </div >
      );
    }
  })
export default LoadingTable;

