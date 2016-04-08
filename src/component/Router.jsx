import React from 'react';
import { 
    Router,
    Route,
    IndexRoute,
    Redirect,
    browserHistory,
    hashHistory
} from 'react-router';

import App from './App.jsx';
import Home from './Home.jsx';
import LoadingTable from './LoadingTable.jsx';
import StaffBox from './StaffBox.jsx';
import CostBox from './CostBox.jsx';
import PasswordBox from './PasswordBox.jsx';
import AssignmentBox from './AssignmentBox.jsx';
import EnrollBox from './EnrollBox.jsx';
import EnrollListBox from './EnrollListBox.jsx';
import Subject1Box from './Subject1Box.jsx'
import StudentListBox from './StudentListBox.jsx'
import TrainerListBox from './TrainerListBox.jsx'
import CarListBox from './CarListBox.jsx'

var router = (
    <Route >
    	<Route path="/" breadcrumbName="首页" component={App} ignoreScrollBehavior>
		    <IndexRoute component={Home} />
             <Route path="user" breadcrumbName="系统管理">
                <IndexRoute component={Home} />
                <Route path="assignment" breadcrumbName="分配帐号"  component={AssignmentBox} />
                <Route path="password" breadcrumbName="修改密码"  component={PasswordBox} />
                <Route path="staff" breadcrumbName="员工信息" component={StaffBox} />
                <Route path="cost" breadcrumbName="套餐信息"  component={CostBox} />
             </Route>
             <Route path="enroll" breadcrumbName="用户管理">
                <IndexRoute component={Home} />
                <Route path="register" breadcrumbName="报名登记"  component={EnrollBox} />
                <Route path="list" breadcrumbName="报名列表"  component={EnrollListBox} />
             </Route>
             <Route path="exam" breadcrumbName="考试管理">
                <IndexRoute component={Home} />
                <Route path="subject1" breadcrumbName="报名登记"  component={Subject1Box} />
             </Route>
             <Route path="student" breadcrumbName="学员管理">
                <IndexRoute component={Home} />
                <Route path="list" breadcrumbName="学员列表"  component={StudentListBox} />
             </Route>
              <Route path="trainer" breadcrumbName="教练管理">
                <IndexRoute component={Home} />
                <Route path="list" breadcrumbName="教练列表"  component={TrainerListBox} />
             </Route>
             <Route path="car" breadcrumbName="车辆管理">
                <IndexRoute component={Home} />
                <Route path="list" breadcrumbName="教练车列表"  component={CarListBox} />
             </Route>
    	</Route>
    </Route>
);

export default React.createClass({
	render (){
		return (<Router history={hashHistory} routes={router} />)
	}
});