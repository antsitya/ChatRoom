package com.ant.chat_room.WebSocket;

import com.ant.chat_room.Utils.StringUtils;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Log4j2
@ServerEndpoint("/webSocket/{userId}")
@Component
public class WebSocketServer {
    private final String MSG_FIX="#antsitya#";
    private static int onlinCount=0;
    private static Map<String,WebSocketServer> users= Collections.synchronizedMap(new HashMap<>());
    private Session session;
    private String userName;

    public static synchronized int getOnlinCount(){
        return onlinCount;
    }

    public static synchronized void addOnlineCount(){
        WebSocketServer.onlinCount++;
    }

    public static synchronized void subOnlineCount(){
        WebSocketServer.onlinCount--;
    }

    public static synchronized boolean vaildUserName(String userName){
        return users.get(userName)==null;
    }

    /**
     * 客户端建立webSocket连接
     * @param session
     * @param userName
     */
    @OnOpen
    public void onOpen(Session session, @PathParam("userId") String userName){
        this.session=session;
        this.userName=userName;
        users.put(userName,this);
        addOnlineCount();
        log.info(userName+"加入群聊,当前在线人数为"+getOnlinCount());
        try{
//            this.session.getBasicRemote().sendText("连接成功");
            sendToAll("SYS_NOTICE","已加入群聊"+"#ONLINECOUNT#"+getOnlinCount(),userName);
        }catch (IOException e){
            e.printStackTrace();
            log.error("error happen on function onOpen"+e);
        }
    }

    /**
     * 客户端管理webSocket连接
     */
    @OnClose
    public void onClose(){
        users.remove(this.userName);
        subOnlineCount();
        try{
//            this.session.getBasicRemote().sendText("连接成功");
            sendToAll("SYS_NOTICE","已退出群聊"+"#ONLINECOUNT#"+getOnlinCount(),this.userName);
        }catch (IOException e){
            e.printStackTrace();
            log.error("error happen on function onOpen"+e);
        }
        log.info(this.userName+"已退出群聊,当前在线人数为:"+getOnlinCount());
    }

    /**
     * 收到客户端出发的消息后出发的方法
     */
    @OnMessage
    public void onMessage(String message){
        log.info("收到客户端发送的消息,内容为:"+message);
        try{
            //群聊发送消息
            if(StringUtils.isNotEmpty(message)){
                String[] arrMsg=message.split("@antsitya@");
                if(arrMsg.length==3){
                    sendToAll(arrMsg[0],arrMsg[1],arrMsg[2]);
                }else{
                    log.error("发送信息格式错误");
                }
            }
        }catch (IOException e){
            log.error("error happen on function onMessage ",e);
        }
    }

    /**
     *
     */
    @OnError
    public void onError(Session session,Throwable error){
        log.error("发生错误session:"+session);
        error.printStackTrace();
    }
    //给特定人员发送消息
    public void sendMessageToSomeBody(String userName,String message)throws IOException{
        if(users.get(userName)==null) return;
        users.get(userName).session.getBasicRemote().sendText(message);
        this.session.getBasicRemote().sendText(this.userName+"@"+userName+":"+message);
    }
    //群发消息
    public void sendToAll(String type,String message,String userName) throws IOException{
        for(WebSocketServer socketServer:users.values()){
            String Msg=type+MSG_FIX;
            try{
                if(type.equals("SYS_NOTICE")){
                    Msg=Msg+(socketServer.userName.equals(userName)?"您":userName)+message;
                    socketServer.session.getBasicRemote().sendText(Msg);
                }
                if(type.equals("NEWS_OTHER")){
                    Msg=Msg+message+MSG_FIX+userName;
                    if(!socketServer.userName.equals(userName)){
                        socketServer.session.getBasicRemote().sendText(Msg);
                    }
                }
            }catch (IOException e){
                continue;
            }
        }
    }

}
