import axios from 'axios';
import {message} from 'antd';
import StringUtils from "./StringUtils";
import qs from 'qs';
/*export default async(url,data={})=>{
    axios.defaults.headers['Content-Type'] = 'text/plain';
    let ret=false;
    const domain='http://127.0.0.1:7080'
    let response=await axios.post(domain+url,data).catch(error=>{
        console.log("error>>",error);
        message.error("网络连接失败")；
    });

    ret=!response?false:response;
    return ret;
}*/

export default class api {
    static async post(url,data={}){
        let ret=false;
        const domain='http://139.9.66.121:7080';
        // const domain='http://localhost:7080';
        let param=qs.stringify(data);
        console.log("param",param);
        let response=await axios.post(domain+url,param).catch(error=>{
            console.log("error>>",error);
            message.error("网络连接失败");
        });
        console.log("response:"+response);
        if(response.data.respCode===200){
            ret=response.data.respObject;
        }else{
            message.error(StringUtils.isNotEmpty(response.data.errorMsg)?response.data.errorMsg:response.data.respObject)
        }
        return ret;
    }
}
