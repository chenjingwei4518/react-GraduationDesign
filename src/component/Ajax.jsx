import reqwest from 'reqwest'
import {
	message
}
from 'antd';

const basePath = "http://localhost:8080/sys_admin";
// const basePath = "";

export default function(option){
	var opt = { ...option }

	opt.method = opt.method || "POST"

	opt.crossOrigin = true; // 跨域请求

	opt.url = basePath + opt.url;
	opt.type = opt.type || 'json'
	opt.error = function(xhr){
		message.error("[" + xhr.status + "] 系统异常！");
		option.error && option.error(arguments);
	}
	opt.success = function(result){
		setTimeout(()=>{
			option.success(result)
		},300)
	}
	reqwest(opt);
}