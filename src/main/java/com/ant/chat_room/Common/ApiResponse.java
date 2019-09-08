package com.ant.chat_room.Common;

import lombok.Data;

@Data
public class ApiResponse<T> {
    private int respCode;
    private T respObject;
    private boolean isError;
    private String errorMsg;
    public void setRespCode(ApiCode apiCode){
        this.respCode=apiCode.value();
    }
    public void setResp(ApiCode apiCode,T res){
        this.respCode=apiCode.value();
        this.respObject=res;
    }
    public void Error(String msg){
        this.respCode=ApiCode.SERVER_ERROR_CODE.value();
        this.isError=true;
        this.errorMsg=msg;
    }
    public void Error(ApiCode apiCode,String msg){
        this.respCode=apiCode.value();
        this.isError=true;
        this.errorMsg=msg;
    }
    public void Exception(){
        this.respCode=ApiCode.EXCEPTION_CODE.value();
        this.isError=true;
    }
}
