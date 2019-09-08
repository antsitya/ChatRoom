import React from 'react';
import {Input,Button,Modal,message,Avatar} from "antd";
import api from "../utils/api";
import StringUtils from "../utils/StringUtils";

class Chact extends React.Component{
    constructor(props){
        console.log("constructor");
        super(props);
        this.state={
            nowDate :new Date().toLocaleString().split(" ")[0].split("/")[0]+"年"+new Date().toLocaleString().split(" ")[0].split("/")[1]+"月"+new Date().toLocaleString().split(" ")[0].split("/")[2]+"日",
            nowTime:new Date().toLocaleString().split(" ")[1],
            userModelShow:true,
            userName:null,
            socket:null,
            newsArray:[],
            sendText:"",
            onlineCount:0,
            Msg:[],
            // Msg:[
            //     {
            //         type:'SYS_NOTICE',
            //         userName:'',
            //         content:"您已加入群聊",
            //         time:'12:53:23',
            //     },
            //     {
            //         type:'NEWS_OTHER',
            //         userName:'王杰',
            //         content:"大家好",
            //         time:'12:54:23',
            //     },
            //     {
            //         type:'NEWS_OTHER',
            //         userName:'李想',
            //         content:"大家好",
            //         time:'12:55:23',
            //     },{
            //         type:'NEWS_SELF',
            //         userName:'张三',
            //         content:"大家好",
            //         time:'12:56:23',
            //     },
            //     {
            //         type:'SYS_NOTICE',
            //         userName:'',
            //         content:"您已退出群聊",
            //         time:'18:53:23',
            //     },
            //     {
            //         type:'SYS_NOTICE',
            //         userName:'',
            //         content:"您已加入群聊",
            //         time:'12:53:23',
            //     },
            //     {
            //         type:'NEWS_OTHER',
            //         userName:'王杰',
            //         content:"大家好",
            //         time:'12:54:23',
            //     },
            //     {
            //         type:'NEWS_OTHER',
            //         userName:'李想',
            //         content:"大家好",
            //         time:'12:55:23',
            //     },{
            //         type:'NEWS_SELF',
            //         userName:'张三',
            //         content:"大家好",
            //         time:'12:56:23',
            //     },
            //     {
            //         type:'SYS_NOTICE',
            //         userName:'',
            //         content:"您已退出群聊",
            //         time:'18:53:23',
            //     },
            //     {
            //         type:'SYS_NOTICE',
            //         userName:'',
            //         content:"您已加入群聊",
            //         time:'12:53:23',
            //     },
            //     {
            //         type:'NEWS_OTHER',
            //         userName:'王杰',
            //         content:"大家好",
            //         time:'12:54:23',
            //     },
            //     {
            //         type:'NEWS_OTHER',
            //         userName:'李想',
            //         content:"大家好",
            //         time:'12:55:23',
            //     },{
            //         type:'NEWS_SELF',
            //         userName:'张三',
            //         content:"大家好",
            //         time:'12:56:23',
            //     },
            //     {
            //         type:'SYS_NOTICE',
            //         userName:'',
            //         content:"您已退出群聊",
            //         time:'18:53:23',
            //     },
            // ],
        };
        setInterval(()=>{
            let dateArr=new Date().toLocaleString().split(" ");
            let dateArtr1=dateArr[0].split("/");
            let date=dateArtr1[0]+"年"+dateArtr1[1]+"月"+dateArtr1[2]+"日";
            let time=dateArr[1];
            this.setState({
                nowDate :date,
                nowTime:time,
            });
        },1000);
    }
    componentWillMount() {

    }

    async setUserName() {
        let that=this;
        console.log("setUserName...");
        console.log(this.state.userName);
        if(!StringUtils.isNotEmpty(this.state.userName)){
            message.warning("请输入群聊昵称!");
        }else {
            let res = await api.post("/api/chat/validUserName", {userName: this.state.userName});
            if(res) {
                if (typeof (WebSocket) == "undefined") {
                    message.error("您的浏览器不支持WebSocket,请换个浏览器重试!");
                    this.backToBlog();
                }
                let socket=new WebSocket("ws://139.9.66.121:7080/webSocket/"+this.state.userName);
                socket.onopen=function () {
                    message.info("socket连接已打开");
                    that.state.userModelShow=false;
                    that.forceUpdate();
                };
                //收到消息的处理函数
                socket.onmessage=function (msg) {
                    console.log("msg",msg);
                    let data=msg.data;
                    let arr=data.split("#antsitya#");
                    let type=arr[0];
                    let content=arr[1];
                    let userName="";
                    let time=new Date();
                    let onlineCount=that.state.onlineCount;
                    if(type==="SYS_NOTICE"){
                        content=arr[1].split("#ONLINECOUNT#")[0];
                        onlineCount=arr[1].split("#ONLINECOUNT#")[1];
                    }
                    if(type==="NEWS_OTHER"){
                        content=arr[1];
                        userName=arr[2];
                    }
                    let msgNew={
                        type:type,
                        userName:userName,
                        content:content,
                        time:time,
                    };
                    console.log("收到了一条消息：msgNew",msgNew);
                    let news=that.state.Msg;
                    news.push(msgNew);
                    that.setState({
                        Msg:news,
                        onlineCount:onlineCount,
                    })
                };

                socket.onclose=function () {
                    message.info("聊天通道已关闭!")
                };

                socket.onerror=function () {
                    message.error("socket连接异常")
                };

                window.onunload=function () {
                    socket.close();
                };

                this.state.socket=socket;
                this.forceUpdate();
            }
        }
    }

    sendMsg(){
        let that=this;
        let newText=that.state.sendText;
        if(!StringUtils.isNotEmpty(newText)){
            message.warning("请输入聊天内容");
            return;
        }
        console.log("发送消息");
        try{
            let socket=this.state.socket;
            if(socket!=null){
                let msg="NEWS_OTHER@antsitya@"+newText+"@antsitya@"+this.state.userName;
                socket.send(msg);
                let news=that.state.Msg;
                news.push({
                    type:'NEWS_SELF',
                    userName:that.state.userName,
                    content:newText,
                    time:new Date(),
                });
                that.setState({
                    Msg:news,
                    sendText:"",
                })
            }else{
                message.error("连接异常");
            }
        }catch (e) {
            message.error("连接异常",e);
        }
    }

    enterKeyDown(keyCode){
        let that=this;
        if(keyCode===13){
            that.sendMsg();
        }
    }

    backToBlog(){
        window.location.href="http://blog.antsit.cc";
    }

    valueSet(e){
        let that=this;
        console.log(e);
        let name=e.target.name;
        let value=e.target.value;
        that.setState({
            [name]:value,
        })
    }
    render(){
        return(
            <div className="chat-body">
                <div className='chat-box'>
                    <div className="leftMenu">

                    </div>
                    <div className="chatBody">
                        <div className="chat-body-header">
                            <h4>聊天室-蚁穴({this.state.onlineCount})</h4>
                            <hr/>
                        </div>
                        <div className="chat-body-content nui-scroll">
                            {
                                this.state.Msg.map((msg,index)=>{
                                    let DOM=msg.type==="NEWS_OTHER"?<div className="msg">
                                        <div className={msg.type} key={index}>
                                            <Avatar shape="square" className="avatar">{msg.userName.charAt(0)}</Avatar>
                                            <div className="msg-box">
                                                <div className="user-name">{msg.userName}</div>
                                                <div className="msg-content">{msg.content}</div>
                                            </div>
                                    </div>
                                    </div>:msg.type==="NEWS_SELF"?<div className="msg">
                                            <div className={msg.type} key={index}>
                                                <Avatar shape="square" className="avatar">{msg.userName.charAt(0)}</Avatar>
                                                <div className="msg-box">
                                                    <div className="msg-content">{msg.content}</div>
                                                </div>
                                            </div>
                                            </div>:<div className="msg">
                                                <div className={msg.type} key={index}>
                                                    <div className="msg-box">
                                                        <div className="msg-content">{msg.content}</div>
                                                    </div>
                                                </div>
                                            </div>;
                                    return  DOM;
                                })
                            }
                        </div>
                        <div className="chat-body-footer">
                            <hr/>
                            <div className="chat-tool"><Button className="sendMsg" onClick={()=>this.sendMsg()}>发送</Button></div>
                            <textarea className="input-area" value={this.state.sendText} name="sendText" onChange={(e)=>this.valueSet(e)} onKeyDown={(e)=>this.enterKeyDown(e.keyCode)} />
                        </div>
                    </div>
                    <div className="rightBox">
                        <div className="date-time">
                            <h1>{this.state.nowDate}</h1>
                            <h1>{this.state.nowTime}</h1>
                        </div>
                    </div>
                </div>


                <Modal title="请设置群聊昵称" visible={this.state.userModelShow} onOk={()=>this.setUserName()} onCancel={()=>this.backToBlog()}
                       footer={[
                           <Button key="back" onClick={()=>this.backToBlog()}>
                               返回博客
                           </Button>,
                           <Button key="submit" type="primary" onClick={()=>this.setUserName()}>
                               确认
                           </Button>,
                       ]}>
                    <Input placeholder="请输入昵称" onChange={(e)=>this.valueSet(e)} value={this.state.userName} name="userName"/>
                </Modal>
            </div>
        );
    }
}

export default Chact;
