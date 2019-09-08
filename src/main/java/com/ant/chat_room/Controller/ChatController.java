package com.ant.chat_room.Controller;

import com.ant.chat_room.Common.ApiCode;
import com.ant.chat_room.Common.ApiResponse;
import com.ant.chat_room.Utils.StringUtils;
import com.ant.chat_room.WebSocket.WebSocketServer;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@Log4j2
@RestController
@RequestMapping(value = "/api/chat")
public class ChatController {
    @RequestMapping(value = "/test")
    public String test(){
        System.out.println("in /test...");
        return "Hello world!";
    }

    @RequestMapping(value = "/test1")
    public ApiResponse<Object> test1(String msg){
        ApiResponse<Object> apiResponse=new ApiResponse<>();
        log.info("in function test1...",msg);
        apiResponse.setResp(ApiCode.SUUCESS_CODE,"asd");
//        apiResponse.Error("请求异常");
        return apiResponse;
    }

    /**
     *  验证用户名是否重复
     * @param userName
     * @return
     */
    @RequestMapping(value = "/validUserName",method = {RequestMethod.POST})
    public ApiResponse<Object> validUserName(String userName){
        System.out.println(userName);
        ApiResponse<Object> apiResponse=new ApiResponse<>();
        if(StringUtils.isNotEmpty(userName)){
            if(WebSocketServer.vaildUserName(userName)){
                apiResponse.setResp(ApiCode.SUUCESS_CODE,true);
            }else{
                apiResponse.Error("用户名已存在");
            }
        }else{
            apiResponse.Error("用户名不为空");
        }
        return apiResponse;
    }
    @Autowired
    WebSocketServer server;
}
